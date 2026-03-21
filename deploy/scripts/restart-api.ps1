param(
    [int]$ApiPort = 8000,
    [switch]$Elevated
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$runApiScript = Join-Path $repoRoot "run-api.ps1"
$runtimeDir = Join-Path $repoRoot ".runtime"
$stateFile = Join-Path $runtimeDir "api-launcher.json"

function Test-IsAdministrator {
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($identity)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Invoke-SelfElevatedRestart([int]$Port) {
    $argList = @(
        "-NoExit",
        "-NoProfile",
        "-ExecutionPolicy", "Bypass",
        "-File", $PSCommandPath,
        "-ApiPort", $Port,
        "-Elevated"
    )

    Write-Host "[api] relaunching restart-api with administrator rights"
    try {
        Start-Process -FilePath "powershell.exe" -Verb RunAs -ArgumentList $argList | Out-Null
    }
    catch {
        throw "[api] administrator elevation was cancelled or failed."
    }

    Write-Host "[api] elevated restart window opened. follow that window for restart progress."
    exit 0
}

function Ensure-RuntimeDir {
    if (-not (Test-Path $runtimeDir)) {
        New-Item -ItemType Directory -Path $runtimeDir | Out-Null
    }
}

function Read-LauncherState {
    if (-not (Test-Path $stateFile)) {
        return $null
    }
    try {
        return Get-Content -Raw -Encoding utf8 $stateFile | ConvertFrom-Json
    }
    catch {
        Write-Warning "[api] failed to parse launcher state file. ignoring."
        return $null
    }
}

function Write-LauncherState([int]$LauncherProcessId) {
    Ensure-RuntimeDir
    [pscustomobject]@{
        pid = $LauncherProcessId
        started_at = (Get-Date).ToString("s")
        script = $runApiScript
    } | ConvertTo-Json | Set-Content -Encoding utf8 $stateFile
}

function Get-PortOwnerPid([int]$Port) {
    $line = netstat -ano -p tcp | Select-String ":$Port\s+.*LISTENING\s+(\d+)" | Select-Object -First 1
    if (-not $line) {
        return $null
    }
    $parts = ($line.ToString() -split '\s+') | Where-Object { $_ -ne '' }
    if ($parts.Length -lt 5) {
        return $null
    }
    return [int]$parts[-1]
}

function Wait-ForPortToBeFree([int]$Port, [int]$RetryCount = 16, [int]$DelayMs = 500) {
    for ($i = 0; $i -lt $RetryCount; $i++) {
        $ownerPid = Get-PortOwnerPid -Port $Port
        if ($null -eq $ownerPid) {
            return $true
        }
        Start-Sleep -Milliseconds $DelayMs
    }
    return $false
}

function Get-ProcessInfoById([int]$ProcessId) {
    return Get-CimInstance Win32_Process -Filter "ProcessId = $ProcessId" -ErrorAction SilentlyContinue
}

function Get-ApiAncestorPids([int]$ProcessId) {
    $chain = @()
    $seen = @{}
    $current = Get-ProcessInfoById -ProcessId $ProcessId
    while ($current) {
        if ($seen.ContainsKey([string]$current.ProcessId)) {
            break
        }
        $seen[[string]$current.ProcessId] = $true
        $chain += $current
        if (-not $current.ParentProcessId -or $current.ParentProcessId -le 0) {
            break
        }
        $current = Get-ProcessInfoById -ProcessId ([int]$current.ParentProcessId)
    }
    return $chain
}

function Get-BestApiRootPid([int]$ProcessId) {
    $escapedRepo = [regex]::Escape($repoRoot.ToString())
    $chain = Get-ApiAncestorPids -ProcessId $ProcessId
    if (-not $chain -or $chain.Count -eq 0) {
        return $ProcessId
    }

    $matches = @(
        $chain | Where-Object {
            $_.CommandLine -and (
                $_.CommandLine -match $escapedRepo -or
                $_.CommandLine -match 'run-api\.ps1' -or
                $_.CommandLine -match 'run\.ps1' -or
                $_.CommandLine -match 'uvicorn' -or
                $_.CommandLine -match 'app\.main:app'
            )
        }
    )

    if ($matches.Count -gt 0) {
        return [int]($matches[-1].ProcessId)
    }
    return [int]($chain[-1].ProcessId)
}

function Stop-ProcessIfRunning([Nullable[int]]$TargetProcessId, [string]$Reason) {
    if ($null -eq $TargetProcessId) {
        return
    }
    $process = Get-Process -Id $TargetProcessId -ErrorAction SilentlyContinue
    if (-not $process) {
        return
    }
    Write-Host "[api] stopping $Reason PID $TargetProcessId ($($process.ProcessName))"
    Stop-Process -Id $TargetProcessId -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 500

    $processAfterStop = Get-Process -Id $TargetProcessId -ErrorAction SilentlyContinue
    if ($processAfterStop) {
        Write-Host "[api] process $TargetProcessId still alive, trying taskkill /T /F"
        & taskkill /PID $TargetProcessId /T /F | Out-Null
        Start-Sleep -Milliseconds 800
    }
}

function Stop-ApiProcessTree([int]$TargetProcessId, [string]$Reason) {
    $rootPid = Get-BestApiRootPid -ProcessId $TargetProcessId
    $rootInfo = Get-ProcessInfoById -ProcessId $rootPid
    $rootName = if ($rootInfo) { $rootInfo.Name } else { "unknown" }

    Write-Host "[api] stopping $Reason PID $TargetProcessId via root PID $rootPid ($rootName)"
    Stop-Process -Id $rootPid -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 700

    $rootStillAlive = Get-Process -Id $rootPid -ErrorAction SilentlyContinue
    if ($rootStillAlive) {
        Write-Host "[api] root PID $rootPid still alive, trying taskkill /T /F"
        try {
            & taskkill /PID $rootPid /T /F | Out-Null
        }
        catch {
            Write-Warning "[api] taskkill failed for PID $rootPid. continuing with retry checks."
        }
        Start-Sleep -Milliseconds 900

        $rootStillAlive = Get-Process -Id $rootPid -ErrorAction SilentlyContinue
        if ($rootStillAlive) {
            Write-Host "[api] root PID $rootPid still alive after fallback attempts"
        }
    }
}

function Get-RunApiLauncherPids {
    $escapedPath = [regex]::Escape($runApiScript)
    $processes = Get-CimInstance Win32_Process -Filter "Name = 'powershell.exe' OR Name = 'pwsh.exe'" |
        Where-Object {
            $_.CommandLine -and (
                $_.CommandLine -match $escapedPath -or
                $_.CommandLine -match 'run-api\.ps1'
            )
        }
    return @($processes | Select-Object -ExpandProperty ProcessId -Unique)
}

if (-not (Test-Path $runApiScript)) {
    throw "run-api.ps1 not found: $runApiScript"
}

Write-Host "[api] repo root: $repoRoot"
Write-Host "[api] restarting API on port $ApiPort"

$trackedState = Read-LauncherState
if ($trackedState -and $trackedState.pid) {
    Stop-ProcessIfRunning -TargetProcessId ([int]$trackedState.pid) -Reason "tracked API launcher"
}

$launcherPids = Get-RunApiLauncherPids
foreach ($launcherPid in $launcherPids) {
    Stop-ProcessIfRunning -TargetProcessId $launcherPid -Reason "existing run-api launcher"
}

$portOwnerPid = Get-PortOwnerPid -Port $ApiPort
if ($null -ne $portOwnerPid) {
    Stop-ApiProcessTree -TargetProcessId $portOwnerPid -Reason "API port owner"
}

for ($attempt = 0; $attempt -lt 4; $attempt++) {
    $remainingOwner = Get-PortOwnerPid -Port $ApiPort
    if ($null -eq $remainingOwner) {
        break
    }
    Stop-ApiProcessTree -TargetProcessId $remainingOwner -Reason "remaining API port owner"
}

$portFreed = Wait-ForPortToBeFree -Port $ApiPort
if (-not $portFreed) {
    $portOwnerAfter = Get-PortOwnerPid -Port $ApiPort
    if (-not (Test-IsAdministrator) -and -not $Elevated) {
        Write-Warning "[api] port $ApiPort is still owned by PID $portOwnerAfter. trying one elevated restart."
        Invoke-SelfElevatedRestart -Port $ApiPort
    }
    throw "[api] failed to free port $ApiPort. still used by PID $portOwnerAfter"
}

Write-Host "[api] starting API in a new PowerShell window"
$launcher = Start-Process -FilePath "powershell.exe" -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy", "Bypass",
    "-File", $runApiScript
) -PassThru

Write-LauncherState -LauncherProcessId $launcher.Id

Write-Host "[done] API restarted"
Write-Host "  - launcher PID: $($launcher.Id)"
Write-Host "  - script: $runApiScript"

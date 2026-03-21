param(
    [int]$ApiPort = 8000
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$runApiScript = Join-Path $repoRoot "run-api.ps1"
$runtimeDir = Join-Path $repoRoot ".runtime"
$stateFile = Join-Path $runtimeDir "api-launcher.json"

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

function Write-LauncherState([int]$Pid) {
    Ensure-RuntimeDir
    [pscustomobject]@{
        pid = $Pid
        started_at = (Get-Date).ToString("s")
        script = $runApiScript
    } | ConvertTo-Json | Set-Content -Encoding utf8 $stateFile
}

function Get-PortOwnerPid([int]$Port) {
    $line = netstat -ano -p tcp | Select-String "127.0.0.1:$Port\s+.*LISTENING\s+(\d+)" | Select-Object -First 1
    if (-not $line) {
        return $null
    }
    $parts = ($line.ToString() -split '\s+') | Where-Object { $_ -ne '' }
    if ($parts.Length -lt 5) {
        return $null
    }
    return [int]$parts[-1]
}

function Stop-ProcessIfRunning([Nullable[int]]$Pid, [string]$Reason) {
    if ($null -eq $Pid) {
        return
    }
    $process = Get-Process -Id $Pid -ErrorAction SilentlyContinue
    if (-not $process) {
        return
    }
    Write-Host "[api] stopping $Reason PID $Pid ($($process.ProcessName))"
    Stop-Process -Id $Pid -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 500
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
    Stop-ProcessIfRunning -Pid ([int]$trackedState.pid) -Reason "tracked API launcher"
}

$launcherPids = Get-RunApiLauncherPids
foreach ($launcherPid in $launcherPids) {
    Stop-ProcessIfRunning -Pid $launcherPid -Reason "existing run-api launcher"
}

$portOwnerPid = Get-PortOwnerPid -Port $ApiPort
if ($null -ne $portOwnerPid) {
    Stop-ProcessIfRunning -Pid $portOwnerPid -Reason "API port owner"
}

$portOwnerAfter = Get-PortOwnerPid -Port $ApiPort
if ($null -ne $portOwnerAfter) {
    throw "[api] failed to free port $ApiPort. still used by PID $portOwnerAfter"
}

Write-Host "[api] starting API in a new PowerShell window"
$launcher = Start-Process -FilePath "powershell.exe" -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy", "Bypass",
    "-File", $runApiScript
) -PassThru

Write-LauncherState -Pid $launcher.Id

Write-Host "[done] API restarted"
Write-Host "  - launcher PID: $($launcher.Id)"
Write-Host "  - script: $runApiScript"

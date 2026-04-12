param(
    [int]$Port = 8000,
    [switch]$LogToFile,
    [string]$LogDir = "logs/api",
    [int]$HealthTimeoutSeconds = 20
)

$ErrorActionPreference = "Stop"

$repoRoot = $PSScriptRoot
$runtimeDir = Join-Path $repoRoot ".runtime"
$stateFile = Join-Path $runtimeDir "api-launcher.json"
$healthUrl = "http://127.0.0.1:$Port/api/v1/health"

function Set-ScriptWindowTitle([string]$Title) {
    try {
        if ($Host -and $Host.UI -and $Host.UI.RawUI) {
            $Host.UI.RawUI.WindowTitle = $Title
        }
    }
    catch {
        # Ignore console title failures in non-interactive hosts.
    }
}

function Ensure-Directory([string]$Path) {
    if (-not (Test-Path $Path)) {
        New-Item -ItemType Directory -Path $Path -Force | Out-Null
    }
}

function Resolve-LogDirectory([string]$ConfiguredPath) {
    if ([System.IO.Path]::IsPathRooted($ConfiguredPath)) {
        return $ConfiguredPath
    }
    return Join-Path $repoRoot $ConfiguredPath
}

function Write-LauncherState(
    [string]$StdoutLog,
    [string]$StderrLog,
    [Nullable[int]]$WorkerProcessId
) {
    Ensure-Directory -Path $runtimeDir
    [pscustomobject]@{
        pid = $PID
        started_at = (Get-Date).ToString("s")
        script = (Join-Path $repoRoot "run-api.ps1")
        mode = "manual-or-direct-run-api"
        port = $Port
        health_url = $healthUrl
        stdout_log = $StdoutLog
        stderr_log = $StderrLog
        worker_pid = $WorkerProcessId
    } | ConvertTo-Json | Set-Content -Encoding utf8 $stateFile
}

function Wait-ForApiHealth(
    [string]$Url,
    [int]$PortNumber,
    $Process,
    [int]$TimeoutSeconds = 20,
    [int]$IntervalMilliseconds = 1000
) {
    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        if ($Process -and $Process.HasExited) {
            return $false
        }

        $line = netstat -ano -p tcp | Select-String ":$PortNumber\s+.*LISTENING\s+(\d+)" | Select-Object -First 1
        if ($line) {
            try {
                $response = Invoke-RestMethod -Method Get -Uri $Url -TimeoutSec 5
                if ($null -ne $response) {
                    return $true
                }
            }
            catch {
                # keep polling until timeout
            }
        }

        Start-Sleep -Milliseconds $IntervalMilliseconds
    }
    return $false
}

Set-ScriptWindowTitle -Title "MYASSET API"

$stdoutLogPath = $null
$stderrLogPath = $null
if ($LogToFile) {
    $resolvedLogDir = Resolve-LogDirectory -ConfiguredPath $LogDir
    Ensure-Directory -Path $resolvedLogDir
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $stdoutLogPath = Join-Path $resolvedLogDir "stdout-$timestamp.log"
    $stderrLogPath = Join-Path $resolvedLogDir "stderr-$timestamp.log"
}

Set-Location $repoRoot

$exitCode = 1
$serverProcess = $null

try {
    Write-Host "[api] title: MYASSET API"
    Write-Host "[api] port: $Port"
    Write-Host "[api] health: $healthUrl"

    $serverArgs = @(
        "-NoProfile",
        "-ExecutionPolicy", "Bypass",
        "-File", (Join-Path $repoRoot "run.ps1"),
        "-Run",
        "-KillPortOwner",
        "-Port", $Port
    )

    if ($LogToFile) {
        Write-Host "[api] stdout log: $stdoutLogPath"
        Write-Host "[api] stderr log: $stderrLogPath"
        Write-Host "[api] server output is being redirected to log files."
        $serverProcess = Start-Process -FilePath "powershell.exe" -ArgumentList $serverArgs -WorkingDirectory $repoRoot -WindowStyle Hidden -PassThru -RedirectStandardOutput $stdoutLogPath -RedirectStandardError $stderrLogPath
    }
    else {
        $serverProcess = Start-Process -FilePath "powershell.exe" -ArgumentList $serverArgs -WorkingDirectory $repoRoot -NoNewWindow -PassThru
    }

    Write-LauncherState -StdoutLog $stdoutLogPath -StderrLog $stderrLogPath -WorkerProcessId $serverProcess.Id

    Write-Host "[api] waiting for API health..."
    if (-not (Wait-ForApiHealth -Url $healthUrl -PortNumber $Port -Process $serverProcess -TimeoutSeconds $HealthTimeoutSeconds)) {
        throw "[api] API failed to become healthy within $HealthTimeoutSeconds seconds."
    }

    Write-Host "[api] health is OK"
    $serverProcess.WaitForExit()
    $exitCode = [int]$serverProcess.ExitCode
}
catch {
    if ($serverProcess -and -not $serverProcess.HasExited) {
        Stop-Process -Id $serverProcess.Id -Force -ErrorAction SilentlyContinue
    }
    Write-Error $_
    $exitCode = 1
}
finally {
    if (Test-Path $stateFile) {
        try {
            $state = Get-Content -Raw -Encoding utf8 $stateFile | ConvertFrom-Json
            if ($state -and [int]$state.pid -eq $PID) {
                Remove-Item $stateFile -Force -ErrorAction SilentlyContinue
            }
        }
        catch {
            Remove-Item $stateFile -Force -ErrorAction SilentlyContinue
        }
    }
}

exit $exitCode

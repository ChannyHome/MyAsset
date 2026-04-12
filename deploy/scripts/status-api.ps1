param(
    [int]$ApiPort = 8000
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$runtimeDir = Join-Path $repoRoot ".runtime"
$stateFile = Join-Path $runtimeDir "api-launcher.json"
$healthUrl = "http://127.0.0.1:$ApiPort/api/v1/health"

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

function Read-LauncherState {
    if (-not (Test-Path $stateFile)) {
        return $null
    }
    try {
        return Get-Content -Raw -Encoding utf8 $stateFile | ConvertFrom-Json
    }
    catch {
        return $null
    }
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

function Get-ProcessNameById([Nullable[int]]$ProcessId) {
    if ($null -eq $ProcessId) {
        return $null
    }
    $process = Get-Process -Id $ProcessId -ErrorAction SilentlyContinue
    if (-not $process) {
        return $null
    }
    return $process.ProcessName
}

function Test-ApiHealth([string]$Url) {
    try {
        $response = Invoke-RestMethod -Method Get -Uri $Url -TimeoutSec 5
        return $null -ne $response
    }
    catch {
        return $false
    }
}

Set-ScriptWindowTitle -Title "MYASSET API STATUS"

$state = Read-LauncherState
$portOwnerPid = Get-PortOwnerPid -Port $ApiPort
$portOwnerName = Get-ProcessNameById -ProcessId $portOwnerPid
$healthOk = Test-ApiHealth -Url $healthUrl

Write-Host "[status] title: MYASSET API STATUS"
Write-Host "[status] repo root: $repoRoot"
Write-Host "[status] port: $ApiPort"
Write-Host "[status] health URL: $healthUrl"
Write-Host "[status] state file: $(if (Test-Path $stateFile) { $stateFile } else { 'missing' })"
Write-Host "[status] launcher PID: $(if ($state -and $state.pid) { $state.pid } else { '-' })"
Write-Host "[status] worker PID: $(if ($state -and $state.worker_pid) { $state.worker_pid } else { '-' })"
Write-Host "[status] launcher started_at: $(if ($state -and $state.started_at) { $state.started_at } else { '-' })"
Write-Host "[status] port owner PID: $(if ($null -ne $portOwnerPid) { $portOwnerPid } else { '-' })"
Write-Host "[status] port owner process: $(if ($portOwnerName) { $portOwnerName } else { '-' })"
Write-Host "[status] stdout log: $(if ($state -and $state.stdout_log) { $state.stdout_log } else { '-' })"
Write-Host "[status] stderr log: $(if ($state -and $state.stderr_log) { $state.stderr_log } else { '-' })"
Write-Host "[status] health: $(if ($healthOk) { 'OK' } else { 'NOT READY' })"

if ($healthOk) {
    exit 0
}

exit 1

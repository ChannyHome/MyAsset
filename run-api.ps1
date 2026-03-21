$ErrorActionPreference = "Stop"

$repoRoot = $PSScriptRoot
$runtimeDir = Join-Path $repoRoot ".runtime"
$stateFile = Join-Path $runtimeDir "api-launcher.json"

if (-not (Test-Path $runtimeDir)) {
    New-Item -ItemType Directory -Path $runtimeDir | Out-Null
}

[pscustomobject]@{
    pid = $PID
    started_at = (Get-Date).ToString("s")
    script = (Join-Path $repoRoot "run-api.ps1")
    mode = "manual-or-direct-run-api"
} | ConvertTo-Json | Set-Content -Encoding utf8 $stateFile

Set-Location $repoRoot

try {
    & "$repoRoot\run.ps1" -Run -KillPortOwner
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

param(
    [string]$ApiBaseUrl = "/api/v1",
    [string]$RemoteAssetUrl = "/web-asset/assets/remoteEntry.js",
    [string]$NginxRoot = "C:\nginx",
    [string]$BuildOutDir = "deploy/out/frontend",
    [int]$ApiPort = 8000,
    [switch]$LogToFile,
    [string]$LogDir = "logs/api",
    [int]$HealthTimeoutSeconds = 20,
    [switch]$InstallDependencies,
    [switch]$SkipFrontend,
    [switch]$SkipApiRestart
)

$ErrorActionPreference = "Stop"

try {
    if ($Host -and $Host.UI -and $Host.UI.RawUI) {
        $Host.UI.RawUI.WindowTitle = "MYASSET PUBLISH"
    }
}
catch {
    # Ignore console title failures in non-interactive hosts.
}

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$publishFrontendScript = Join-Path $PSScriptRoot "publish-frontend-windows.ps1"
$restartApiScript = Join-Path $PSScriptRoot "restart-api.ps1"

Write-Host "[stack] repo root: $repoRoot"

if (-not $SkipFrontend) {
    Write-Host "[stack] publishing frontend"
    & $publishFrontendScript `
        -ApiBaseUrl $ApiBaseUrl `
        -RemoteAssetUrl $RemoteAssetUrl `
        -NginxRoot $NginxRoot `
        -BuildOutDir $BuildOutDir `
        -InstallDependencies:$InstallDependencies
}
else {
    Write-Host "[stack] skip frontend publish"
}

if ($SkipApiRestart) {
    Write-Host "[stack] skip API restart"
}
else {
    if (-not (Test-Path $restartApiScript)) {
        throw "restart-api.ps1 not found: $restartApiScript"
    }
    Write-Host "[stack] restarting API"
    & $restartApiScript `
        -ApiPort $ApiPort `
        -LogToFile:$LogToFile `
        -LogDir $LogDir `
        -HealthTimeoutSeconds $HealthTimeoutSeconds
}

Write-Host "[done] local stack publish completed"
Write-Host "  - frontend: $(if ($SkipFrontend) { 'skipped' } else { 'published + nginx reloaded' })"
Write-Host "  - api: $(if ($SkipApiRestart) { 'skipped' } else { 'restarted in a new PowerShell window' })"
Write-Host "[browser] cache refresh guidance"
Write-Host "  1. If the screen still looks old, press Ctrl+F5 once."
Write-Host "  2. If a remote module looks stale, close the tab and reopen http://127.0.0.1."
Write-Host "  3. If you still see mixed old/new assets, clear site data for 127.0.0.1 and reload."

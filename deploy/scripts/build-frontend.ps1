param(
    [string]$ApiBaseUrl = "/api/v1",
    [string]$RemoteAssetUrl = "/web-asset/assets/remoteEntry.js",
    [string]$OutDir = "deploy/out/frontend",
    [switch]$InstallDependencies
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$webHostDir = Join-Path $repoRoot "apps\web-host"
$webAssetDir = Join-Path $repoRoot "apps\web-asset"
$resolvedOutDir = Join-Path $repoRoot $OutDir

function Ensure-NpmBuild {
    param(
        [Parameter(Mandatory = $true)][string]$Workdir,
        [switch]$Install
    )

    if ($Install) {
        Write-Host "[build] npm ci in $Workdir"
        Push-Location $Workdir
        npm ci
        Pop-Location
    }
}

Write-Host "[build] output directory: $resolvedOutDir"
New-Item -ItemType Directory -Force -Path $resolvedOutDir | Out-Null

Ensure-NpmBuild -Workdir $webAssetDir -Install:$InstallDependencies
Ensure-NpmBuild -Workdir $webHostDir -Install:$InstallDependencies

if ($ApiBaseUrl -like "http://127.0.0.1*") {
    Write-Warning "ApiBaseUrl uses 127.0.0.1. Mobile/other devices cannot call your PC localhost. Use -ApiBaseUrl '/api/v1' for nginx reverse proxy."
}

$env:VITE_API_BASE_URL = $ApiBaseUrl
$env:VITE_WEB_ASSET_REMOTE_URL = $RemoteAssetUrl

Write-Host "[build] web-asset production build"
Push-Location $webAssetDir
npm run build
Pop-Location

Write-Host "[build] web-host production build"
Push-Location $webHostDir
npm run build
Pop-Location
Remove-Item Env:VITE_API_BASE_URL -ErrorAction SilentlyContinue
Remove-Item Env:VITE_WEB_ASSET_REMOTE_URL -ErrorAction SilentlyContinue

$hostOut = Join-Path $resolvedOutDir "web-host"
$assetOut = Join-Path $resolvedOutDir "web-asset"

if (Test-Path $hostOut) { Remove-Item -Recurse -Force $hostOut }
if (Test-Path $assetOut) { Remove-Item -Recurse -Force $assetOut }

Copy-Item -Recurse -Force (Join-Path $webHostDir "dist") $hostOut
Copy-Item -Recurse -Force (Join-Path $webAssetDir "dist") $assetOut

Write-Host "[done] Frontend artifacts created:"
Write-Host "  - $hostOut"
Write-Host "  - $assetOut"
Write-Host "[next] Upload to server paths:"
Write-Host "  - /var/www/myasset/web-host"
Write-Host "  - /var/www/myasset/web-asset"

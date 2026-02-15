param(
    [string]$NginxRoot = "C:\nginx",
    [string]$BuildOutDir = "deploy/out/frontend"
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$resolvedBuildOut = Join-Path $repoRoot $BuildOutDir

$hostSrc = Join-Path $resolvedBuildOut "web-host"
$assetSrc = Join-Path $resolvedBuildOut "web-asset"

if (-not (Test-Path $hostSrc)) {
    throw "Host build output not found: $hostSrc (run build-frontend.ps1 first)"
}
if (-not (Test-Path $assetSrc)) {
    throw "Asset build output not found: $assetSrc (run build-frontend.ps1 first)"
}

$hostDst = Join-Path $NginxRoot "html\myasset\web-host"
$assetDst = Join-Path $NginxRoot "html\myasset\web-asset"
$confDst = Join-Path $NginxRoot "conf\conf.d\myasset.conf"
$confSrc = Join-Path $repoRoot "deploy\nginx\myasset-windows.conf"

Write-Host "[deploy] nginx root: $NginxRoot"
Write-Host "[deploy] build output: $resolvedBuildOut"

New-Item -ItemType Directory -Force -Path $hostDst | Out-Null
New-Item -ItemType Directory -Force -Path $assetDst | Out-Null
New-Item -ItemType Directory -Force -Path (Split-Path $confDst -Parent) | Out-Null

if (Test-Path $hostDst) { Remove-Item -Recurse -Force (Join-Path $hostDst "*") -ErrorAction SilentlyContinue }
if (Test-Path $assetDst) { Remove-Item -Recurse -Force (Join-Path $assetDst "*") -ErrorAction SilentlyContinue }

Copy-Item -Recurse -Force (Join-Path $hostSrc "*") $hostDst
Copy-Item -Recurse -Force (Join-Path $assetSrc "*") $assetDst
Copy-Item -Force $confSrc $confDst

Write-Host "[done] frontend files copied:"
Write-Host "  - $hostDst"
Write-Host "  - $assetDst"
Write-Host "[done] nginx config copied:"
Write-Host "  - $confDst"
Write-Host ""
Write-Host "[next] test and reload nginx:"
Write-Host "  cd $NginxRoot"
Write-Host "  .\nginx.exe -t"
Write-Host "  .\nginx.exe -s reload"
Write-Host "  # if first start: .\nginx.exe"


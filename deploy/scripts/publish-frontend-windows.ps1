param(
    [string]$ApiBaseUrl = "/api/v1",
    [string]$RemoteAssetUrl = "/web-asset/assets/remoteEntry.js",
    [string]$NginxRoot = "C:\nginx",
    [string]$BuildOutDir = "deploy/out/frontend",
    [switch]$InstallDependencies,
    [switch]$SkipBuild,
    [switch]$SkipDeploy,
    [switch]$SkipReload
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$buildScript = Join-Path $PSScriptRoot "build-frontend.ps1"
$deployScript = Join-Path $PSScriptRoot "deploy-frontend-windows.ps1"
$nginxExe = Join-Path $NginxRoot "nginx.exe"

Write-Host "[publish] repo root: $repoRoot"

if (-not $SkipBuild) {
    Write-Host "[publish] step 1/3: build frontend"
    & $buildScript `
        -ApiBaseUrl $ApiBaseUrl `
        -RemoteAssetUrl $RemoteAssetUrl `
        -OutDir $BuildOutDir `
        -InstallDependencies:$InstallDependencies
}
else {
    Write-Host "[publish] skip build"
}

if (-not $SkipDeploy) {
    Write-Host "[publish] step 2/3: copy frontend to nginx root"
    & $deployScript `
        -NginxRoot $NginxRoot `
        -BuildOutDir $BuildOutDir
}
else {
    Write-Host "[publish] skip deploy"
}

if ($SkipReload) {
    Write-Host "[publish] skip nginx reload"
    exit 0
}

if (-not (Test-Path $nginxExe)) {
    throw "nginx.exe not found: $nginxExe"
}

Write-Host "[publish] step 3/3: test nginx config"
Push-Location $NginxRoot
try {
    & $nginxExe -t
    if ($LASTEXITCODE -ne 0) {
        throw "nginx config test failed."
    }

    Write-Host "[publish] reloading nginx"
    & $nginxExe -s reload

    if ($LASTEXITCODE -ne 0) {
        Write-Warning "nginx reload returned non-zero exit code. Trying first-start mode."
        & $nginxExe
        if ($LASTEXITCODE -ne 0) {
            throw "nginx reload/start failed."
        }
        Write-Host "[publish] nginx started"
    }
    else {
        Write-Host "[publish] nginx reloaded"
    }
}
finally {
    Pop-Location
}

Write-Host "[done] frontend publish completed"
Write-Host "  - ApiBaseUrl: $ApiBaseUrl"
Write-Host "  - RemoteAssetUrl: $RemoteAssetUrl"
Write-Host "  - NginxRoot: $NginxRoot"

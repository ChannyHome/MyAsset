param(
    [string]$ApiBaseUrl = "/api/v1",
    [string]$RemoteAssetUrl = "/web-asset/assets/remoteEntry.js",
    [string]$NginxRoot = "C:\nginx",
    [string]$BuildOutDir = "deploy/out/frontend",
    [string]$NginxHealthUrl = "http://127.0.0.1/",
    [int]$NginxHealthTimeoutSeconds = 10,
    [switch]$InstallDependencies,
    [switch]$SkipBuild,
    [switch]$SkipDeploy,
    [switch]$SkipReload
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
$buildScript = Join-Path $PSScriptRoot "build-frontend.ps1"
$deployScript = Join-Path $PSScriptRoot "deploy-frontend-windows.ps1"
$nginxExe = Join-Path $NginxRoot "nginx.exe"

function Get-NginxProcesses {
    $expectedPath = $null
    try {
        $expectedPath = (Resolve-Path $nginxExe).Path
    }
    catch {
        $expectedPath = $nginxExe
    }

    @(Get-Process -Name "nginx" -ErrorAction SilentlyContinue | Where-Object {
        try {
            -not $_.Path -or ($_.Path -ieq $expectedPath)
        }
        catch {
            $true
        }
    })
}

function Wait-NginxReady {
    param(
        [string]$Url,
        [int]$TimeoutSeconds
    )

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    do {
        $processes = Get-NginxProcesses
        if ($processes.Count -gt 0) {
            try {
                $response = Invoke-WebRequest -UseBasicParsing -Uri $Url -TimeoutSec 2
                if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) {
                    return $true
                }
            }
            catch {
                Start-Sleep -Milliseconds 500
            }
        }
        else {
            Start-Sleep -Milliseconds 500
        }
    } while ((Get-Date) -lt $deadline)

    return $false
}

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
    return
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

    $nginxProcesses = Get-NginxProcesses
    if ($nginxProcesses.Count -gt 0) {
        Write-Host "[publish] nginx is running. reloading nginx"
        & $nginxExe -s reload
        if ($LASTEXITCODE -ne 0) {
            throw "nginx reload failed."
        }
        Write-Host "[publish] nginx reloaded"
    }
    else {
        Write-Host "[publish] nginx is not running. starting nginx"
        Start-Process -FilePath $nginxExe -WorkingDirectory $NginxRoot -WindowStyle Hidden | Out-Null
        Write-Host "[publish] nginx start requested"
    }

    if (-not (Wait-NginxReady -Url $NginxHealthUrl -TimeoutSeconds $NginxHealthTimeoutSeconds)) {
        throw "nginx did not become ready within $NginxHealthTimeoutSeconds seconds: $NginxHealthUrl"
    }

    Write-Host "[publish] nginx ready: $NginxHealthUrl"
}
finally {
    Pop-Location
}

Write-Host "[done] frontend publish completed"
Write-Host "  - ApiBaseUrl: $ApiBaseUrl"
Write-Host "  - RemoteAssetUrl: $RemoteAssetUrl"
Write-Host "  - NginxRoot: $NginxRoot"
Write-Host "  - NginxHealthUrl: $NginxHealthUrl"

param(
    [switch]$Setup,
    [switch]$SetupWeb,
    [switch]$Smoke,
    [switch]$InitDb,
    [switch]$Migrate,
    [switch]$Seed,
    [switch]$UpdateQuotes,
    [switch]$SmokeDb,
    [switch]$RunHost,
    [switch]$RunAsset,
    [switch]$Run,
    [int]$Port = 8000
)

$ErrorActionPreference = 'Stop'

$repoRoot = $PSScriptRoot
$apiDir = Join-Path $repoRoot 'apps/api'
$webHostDir = Join-Path $repoRoot 'apps/web-host'
$webAssetDir = Join-Path $repoRoot 'apps/web-asset'
$venvPython = Join-Path $apiDir '.venv/Scripts/python.exe'
$venvPip = Join-Path $apiDir '.venv/Scripts/pip.exe'

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

function Assert-PortFree([int]$Port, [string]$Name) {
    $ownerPid = Get-PortOwnerPid -Port $Port
    if ($null -eq $ownerPid) {
        return
    }
    $process = Get-Process -Id $ownerPid -ErrorAction SilentlyContinue
    $procName = if ($process) { $process.ProcessName } else { "unknown" }
    throw "$Name cannot start. Port $Port is already in use by PID $ownerPid ($procName). Stop it and retry."
}

if (-not (Test-Path $apiDir)) {
    throw 'apps/api folder was not found.'
}
if (($SetupWeb -or $RunHost) -and -not (Test-Path $webHostDir)) {
    throw 'apps/web-host folder was not found.'
}
if (($SetupWeb -or $RunAsset) -and -not (Test-Path $webAssetDir)) {
    throw 'apps/web-asset folder was not found.'
}

if ($SetupWeb) {
    Write-Host '[setup-web] installing web-host dependencies...'
    Set-Location $webHostDir
    if (-not (Test-Path '.env') -and (Test-Path '.env.example')) {
        Copy-Item '.env.example' '.env'
        Write-Host '[setup-web] web-host .env created from .env.example'
    }
    npm install
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

    Write-Host '[setup-web] installing web-asset dependencies...'
    Set-Location $webAssetDir
    npm install
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

if ($RunHost) {
    Assert-PortFree -Port 5173 -Name 'web-host'
    Set-Location $webHostDir
    Write-Host '[run-host] starting web-host at http://127.0.0.1:5173'
    npm run dev
    exit $LASTEXITCODE
}

if ($RunAsset) {
    Assert-PortFree -Port 5174 -Name 'web-asset'
    Set-Location $webAssetDir
    Write-Host '[run-asset] starting web-asset remote server at http://127.0.0.1:5174 (build + preview)'
    npm run dev:remote
    exit $LASTEXITCODE
}

Set-Location $apiDir

if (-not (Test-Path '.env') -and (Test-Path '.env.example')) {
    Copy-Item '.env.example' '.env'
    Write-Host '[setup] .env created from .env.example'
}

if ($Setup -or -not (Test-Path $venvPython)) {
    Write-Host '[setup] creating venv and installing requirements...'
    if (-not (Test-Path '.venv')) {
        python -m venv .venv
    }
    & $venvPython -m pip install --upgrade pip
    & $venvPip install -r requirements.txt
}

if ($InitDb) {
    Write-Host '[initdb] creating mysql database from DATABASE_URL if needed...'
    & $venvPython -m app.scripts.init_mysql_db
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

if ($Migrate) {
    Write-Host '[migrate] running alembic upgrade head...'
    & $venvPython -m alembic upgrade head
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

if ($Seed) {
    Write-Host '[seed] inserting MVP seed data...'
    & $venvPython -m app.scripts.seed_mvp
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

if ($UpdateQuotes) {
    Write-Host '[quotes] updating quotes once now...'
    & $venvPython -m app.scripts.update_quotes_once
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

if ($Smoke) {
    Write-Host '[smoke] running api smoke tests...'
    $env:PYTHONDONTWRITEBYTECODE = '1'
    $smokeScript = @"
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

health = client.get('/api/v1/health')
assert health.status_code == 200, health.text

login = client.post('/api/v1/auth/login', json={'email': 'me@myasset.local', 'password': 'pass1234'})
assert login.status_code == 200, login.text

token = login.json()['access_token']
me = client.get('/api/v1/auth/me', headers={'Authorization': f'Bearer {token}'})
assert me.status_code == 200, me.text

print('SMOKE_OK')
print('health:', health.json())
print('me:', me.json())
"@
    $smokeScript | & $venvPython -
    exit $LASTEXITCODE
}

if ($SmokeDb) {
    Write-Host '[smoke-db] running mysql-backed smoke tests...'
    & $venvPython -m app.scripts.smoke_db
    exit $LASTEXITCODE
}

if (($Setup -or $InitDb -or $Migrate -or $Seed -or $UpdateQuotes) -and -not $Run) {
    Write-Host '[done] setup/initdb/migrate/seed/quotes completed. Use .\run.ps1 -Run to start server.'
    exit 0
}
if ($SetupWeb) {
    Write-Host '[done] web setup completed. Use .\run.ps1 -RunAsset and .\run.ps1 -RunHost in separate terminals.'
    exit 0
}

Write-Host "[run] starting api at http://127.0.0.1:$Port"
Assert-PortFree -Port $Port -Name 'api'
& $venvPython -m uvicorn app.main:app --reload --host 127.0.0.1 --port $Port

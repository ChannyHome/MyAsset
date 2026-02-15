# Frontend Nginx Deployment

This project can be deployed with Nginx using:
- `web-host` as the main SPA
- `web-asset` as module federation remote under `/web-asset/`
- FastAPI proxied under `/api/`

## Quick Deploy (Windows 11)

Use these commands in order:

```powershell
# 1) Build frontend artifacts
.\deploy\scripts\build-frontend.ps1 `
  -ApiBaseUrl "/api/v1" `
  -RemoteAssetUrl "/web-asset/assets/remoteEntry.js"

# 2) Copy build output + nginx config
.\deploy\scripts\deploy-frontend-windows.ps1 -NginxRoot "C:\nginx"

# 3) Start backend API (separate terminal)
.\run-api.ps1

# 4) Test + reload nginx
cd C:\nginx
.\nginx.exe -t
.\nginx.exe -s reload
# first start only:
# .\nginx.exe
```

Open:
- `http://127.0.0.1`

## 1) Build frontend artifacts on local machine (Windows)

From repo root:

```powershell
.\deploy\scripts\build-frontend.ps1 `
  -ApiBaseUrl "https://your-domain.com/api/v1" `
  -RemoteAssetUrl "/web-asset/assets/remoteEntry.js"
```

Output directories:
- `deploy/out/frontend/web-host`
- `deploy/out/frontend/web-asset`

If you run first time and need install:

```powershell
.\deploy\scripts\build-frontend.ps1 `
  -InstallDependencies `
  -ApiBaseUrl "/api/v1" `
  -RemoteAssetUrl "/web-asset/assets/remoteEntry.js"
```

## 2) Upload artifacts to Linux server

Target paths:
- `/var/www/myasset/web-host`
- `/var/www/myasset/web-asset`

Example (from local, if `scp` is available):

```bash
scp -r deploy/out/frontend/web-host/* user@server:/var/www/myasset/web-host/
scp -r deploy/out/frontend/web-asset/* user@server:/var/www/myasset/web-asset/
```

## 3) Apply Nginx config

Template file:
- `deploy/nginx/myasset.conf`

Copy on server:

```bash
sudo cp deploy/nginx/myasset.conf /etc/nginx/conf.d/myasset.conf
sudo nginx -t
sudo systemctl reload nginx
```

## Windows 11 local Nginx deploy

Use this when Nginx is running on your Windows machine.

### A) Build

```powershell
.\deploy\scripts\build-frontend.ps1 `
  -ApiBaseUrl "/api/v1" `
  -RemoteAssetUrl "/web-asset/assets/remoteEntry.js"
```

### B) Copy build output + config into Nginx

```powershell
.\deploy\scripts\deploy-frontend-windows.ps1 -NginxRoot "C:\nginx"
```

Windows Nginx template:
- `deploy/nginx/myasset-windows.conf`

### C) Start backend API

```powershell
.\run-api.ps1
```

### D) Test/reload Nginx

```powershell
cd C:\nginx
.\nginx.exe -t
.\nginx.exe
# or reload if already running
.\nginx.exe -s reload
```

Open:
- `http://127.0.0.1`

### E) Quick health check (important)

```powershell
# backend direct
Invoke-WebRequest http://127.0.0.1:8000/api/v1/health

# nginx proxy path
Invoke-WebRequest http://127.0.0.1/api/v1/health
```

If backend direct works but nginx proxy fails, your active nginx config is not loaded correctly.

## 4) Enable HTTPS (Let's Encrypt)

HTTPS template:
- `deploy/nginx/myasset-https.conf`

### 4-1) Point domain DNS first
- `your-domain.com` -> your server public IP

### 4-2) Issue certificate

```bash
cd /opt/myasset
chmod +x deploy/scripts/setup-letsencrypt.sh
./deploy/scripts/setup-letsencrypt.sh your-domain.com admin@your-domain.com
```

For test certificate:

```bash
./deploy/scripts/setup-letsencrypt.sh your-domain.com admin@your-domain.com --staging
```

### 4-3) Switch Nginx to HTTPS config

1. Open `deploy/nginx/myasset-https.conf`
2. Replace `your-domain.com` with your real domain
3. Apply config

```bash
sudo cp deploy/nginx/myasset-https.conf /etc/nginx/conf.d/myasset.conf
sudo nginx -t
sudo systemctl reload nginx
```

### 4-4) Validate renew job

```bash
chmod +x deploy/scripts/test-cert-renew.sh
./deploy/scripts/test-cert-renew.sh
```

## 5) API service

Nginx config assumes API is running at:
- `http://127.0.0.1:8000/api/`

If your API is on another port/host, update `location /api/` in `myasset.conf`.

## 6) systemd setup (FastAPI + Nginx)

See:
- `deploy/systemd/README.md`
- `deploy/systemd/myasset-api.service`
- `deploy/systemd/myasset-stack.target`
- `deploy/scripts/install-systemd.sh`

# systemd (FastAPI + Nginx) Guide

## Concept

`systemd` is the Linux service manager.
It keeps your server processes running in production.

Main benefits:
- Auto start on boot
- Auto restart on crash
- Unified logs (`journalctl`)
- Simple start/stop/status commands

In this project:
- FastAPI runs as `myasset-api.service`
- Nginx uses distro-provided `nginx.service`
- Optional group target: `myasset-stack.target`

## Files

- `myasset-api.service`: FastAPI service unit
- `myasset-stack.target`: starts API + Nginx together
- `api.env.example`: environment file template (`/etc/myasset/api.env`)

## Prerequisites on server

1. Code deployed to `/opt/myasset`
2. Python venv exists at `/opt/myasset/apps/api/.venv`
3. Nginx installed and enabled
4. Dedicated service user exists:

```bash
sudo useradd --system --create-home --home-dir /opt/myasset --shell /usr/sbin/nologin myasset
sudo chown -R myasset:myasset /opt/myasset
```

## Install units

```bash
sudo mkdir -p /etc/myasset
sudo cp /opt/myasset/deploy/systemd/api.env.example /etc/myasset/api.env
sudo cp /opt/myasset/deploy/systemd/myasset-api.service /etc/systemd/system/myasset-api.service
sudo cp /opt/myasset/deploy/systemd/myasset-stack.target /etc/systemd/system/myasset-stack.target
sudo systemctl daemon-reload
```

Edit env values:

```bash
sudo vi /etc/myasset/api.env
```

## Start and enable

```bash
sudo systemctl enable myasset-api.service
sudo systemctl enable nginx.service
sudo systemctl start myasset-api.service
sudo systemctl reload nginx
```

Optional: enable/start both by target:

```bash
sudo systemctl enable myasset-stack.target
sudo systemctl start myasset-stack.target
```

## Operations

```bash
sudo systemctl status myasset-api.service
sudo systemctl restart myasset-api.service
sudo journalctl -u myasset-api.service -f
```


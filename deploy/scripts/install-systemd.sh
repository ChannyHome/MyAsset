#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

SYSTEMD_DIR="/etc/systemd/system"
ENV_DIR="/etc/myasset"

echo "[install] Using repo root: $REPO_ROOT"
sudo mkdir -p "$ENV_DIR"

if [[ ! -f "$ENV_DIR/api.env" ]]; then
  sudo cp "$REPO_ROOT/deploy/systemd/api.env.example" "$ENV_DIR/api.env"
  echo "[install] Created $ENV_DIR/api.env (edit this file before start)."
else
  echo "[install] Existing $ENV_DIR/api.env found, skip copy."
fi

sudo cp "$REPO_ROOT/deploy/systemd/myasset-api.service" "$SYSTEMD_DIR/myasset-api.service"
sudo cp "$REPO_ROOT/deploy/systemd/myasset-stack.target" "$SYSTEMD_DIR/myasset-stack.target"

sudo systemctl daemon-reload
sudo systemctl enable myasset-api.service
sudo systemctl enable nginx.service

echo "[done] systemd units installed."
echo "[next] Start API: sudo systemctl start myasset-api.service"
echo "[next] Check API: sudo systemctl status myasset-api.service"
echo "[next] Follow logs: sudo journalctl -u myasset-api.service -f"


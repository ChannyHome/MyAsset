#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <domain> <email> [--staging]"
  echo "Example: $0 myasset.example.com admin@example.com"
  exit 1
fi

DOMAIN="$1"
EMAIL="$2"
STAGING_FLAG="${3:-}"

WEBROOT="/var/www/certbot"

echo "[setup] domain: $DOMAIN"
echo "[setup] email: $EMAIL"
echo "[setup] webroot: $WEBROOT"

sudo mkdir -p "$WEBROOT"

if ! command -v certbot >/dev/null 2>&1; then
  echo "[setup] installing certbot..."
  sudo apt-get update
  sudo apt-get install -y certbot
fi

CERTBOT_CMD=(
  sudo certbot certonly
  --webroot
  -w "$WEBROOT"
  -d "$DOMAIN"
  --email "$EMAIL"
  --agree-tos
  --non-interactive
)

if [[ "$STAGING_FLAG" == "--staging" ]]; then
  CERTBOT_CMD+=(--staging)
fi

echo "[setup] issuing certificate..."
"${CERTBOT_CMD[@]}"

echo "[setup] checking renew timer..."
sudo systemctl enable certbot.timer || true
sudo systemctl start certbot.timer || true
sudo systemctl status certbot.timer --no-pager || true

echo "[done] certificate issued for $DOMAIN"
echo "[next] apply HTTPS nginx conf and reload nginx:"
echo "  sudo nginx -t && sudo systemctl reload nginx"


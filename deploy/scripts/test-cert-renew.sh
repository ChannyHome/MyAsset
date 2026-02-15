#!/usr/bin/env bash
set -euo pipefail

echo "[check] certbot renew dry-run"
sudo certbot renew --dry-run

echo "[done] renew dry-run completed"


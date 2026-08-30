#!/usr/bin/env bash
# Deploy a tested Git revision as an atomic native-systemd release on the VPS.
# This script must run as root after CI has fetched the requested revision.
set -euo pipefail

APP_USER="${APP_USER:-chabaqa}"
PROJECT_DIR="${PROJECT_DIR:-/home/ubuntu/chabaqa}"
DEPLOY_REF="${DEPLOY_REF:-main}"
RELEASES_DIR="${RELEASES_DIR:-/opt/chabaqa/releases}"
CURRENT_LINK="${CURRENT_LINK:-/opt/chabaqa/current}"
SHARED_DIR="${SHARED_DIR:-/opt/chabaqa/shared}"
CONFIG_DIR="${CONFIG_DIR:-/etc/chabaqa}"
DEPLOY_CONFIG="${DEPLOY_CONFIG:-${CONFIG_DIR}/deploy.env}"
BACKEND_ENV="${BACKEND_ENV:-${CONFIG_DIR}/backend.env}"
FRONTEND_ENV="${FRONTEND_ENV:-${CONFIG_DIR}/frontend.env}"
KEEP_RELEASES="${KEEP_RELEASES:-3}"

if [[ -f "$DEPLOY_CONFIG" ]]; then
  # This root-owned file may set NODE_BIN and NPM_BIN for a non-system Node install.
  # shellcheck disable=SC1090
  source "$DEPLOY_CONFIG"
fi

NODE_BIN="${NODE_BIN:-$(command -v node)}"
NPM_BIN="${NPM_BIN:-${NODE_BIN%/node}/npm}"
NODE_DIR="$(dirname "$NODE_BIN")"
NPM_CACHE="${NPM_CACHE:-/opt/chabaqa/.npm}"

fail() { echo "[systemd-deploy] error: $*" >&2; exit 1; }

[[ $EUID -eq 0 ]] || fail "run via sudo as root"
id "$APP_USER" >/dev/null 2>&1 || fail "missing service user: $APP_USER"
[[ -e "$PROJECT_DIR/.git" ]] || fail "missing Git checkout: $PROJECT_DIR"
[[ -x "$NODE_BIN" ]] || fail "NODE_BIN is not executable: $NODE_BIN"
[[ -x "$NPM_BIN" ]] || fail "NPM_BIN is not executable: $NPM_BIN"
[[ -f "$BACKEND_ENV" ]] || fail "missing backend environment: $BACKEND_ENV"
[[ -f "$FRONTEND_ENV" ]] || fail "missing frontend environment: $FRONTEND_ENV"

for unit in chabaqa-backend.service chabaqa-frontend.service; do
  [[ -f "${PROJECT_DIR}/deploy/systemd/${unit}" ]] || fail "missing unit: ${unit}"
done

commit="$(git -C "$PROJECT_DIR" rev-parse --verify "${DEPLOY_REF}^{commit}")"
release_id="${commit:0:12}-$(date -u +%Y%m%dT%H%M%SZ)"
release_dir="${RELEASES_DIR}/${release_id}"
previous_release=""
if [[ -L "$CURRENT_LINK" ]]; then
  previous_release="$(readlink -f "$CURRENT_LINK")"
fi

run_as_app() {
  runuser -u "$APP_USER" -- env \
    "HOME=/opt/chabaqa" \
    "PATH=${NODE_DIR}:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin" \
    "npm_config_cache=${NPM_CACHE}" \
    "$@"
}

cleanup_failed_release() {
  rm -rf -- "$release_dir"
}

rollback() {
  local exit_code=$?
  if [[ $exit_code -eq 0 ]]; then
    return
  fi
  echo "[systemd-deploy] deploy failed; restoring previous release" >&2
  if [[ -n "$previous_release" && -d "$previous_release" ]]; then
    ln -sfn "$previous_release" "$CURRENT_LINK"
    systemctl restart chabaqa-backend chabaqa-frontend || true
  fi
  cleanup_failed_release
}
trap rollback EXIT

install -d -o "$APP_USER" -g "$APP_USER" -m 0755 \
  "$RELEASES_DIR" "$SHARED_DIR/uploads" "$SHARED_DIR/hls-output" "$NPM_CACHE"
install -d -o root -g root -m 0755 "$CONFIG_DIR"
install -d -o "$APP_USER" -g "$APP_USER" -m 0755 "$release_dir"

echo "[systemd-deploy] extracting ${commit} into ${release_dir}"
git -C "$PROJECT_DIR" archive --format=tar "$commit" | tar -xf - -C "$release_dir"
chown -R "$APP_USER:$APP_USER" "$release_dir"

# Next reads .env.production while building. It remains outside the release and
# has the same group-readable ownership expected by the systemd service.
ln -s "$FRONTEND_ENV" "$release_dir/frontend/.env.production"

echo "[systemd-deploy] installing production dependencies"
run_as_app "$NPM_BIN" ci --prefix "$release_dir/backend"
run_as_app "$NPM_BIN" ci --prefix "$release_dir/frontend"

echo "[systemd-deploy] building backend and frontend"
run_as_app "$NPM_BIN" run build --prefix "$release_dir/backend"
run_as_app "$NPM_BIN" run build --prefix "$release_dir/frontend"
[[ -f "$release_dir/backend/dist/src/main.js" ]] || fail "backend build did not produce dist/src/main.js"
[[ -f "$release_dir/frontend/.next/standalone/server.js" ]] || fail "frontend build did not produce standalone/server.js"

install -m 0644 "$release_dir/deploy/systemd/chabaqa-backend.service" /etc/systemd/system/chabaqa-backend.service
install -m 0644 "$release_dir/deploy/systemd/chabaqa-frontend.service" /etc/systemd/system/chabaqa-frontend.service
systemctl daemon-reload
systemctl enable chabaqa-backend chabaqa-frontend

ln -sfn "$release_dir" "$CURRENT_LINK"
systemctl restart chabaqa-backend chabaqa-frontend
systemctl is-active --quiet chabaqa-backend
systemctl is-active --quiet chabaqa-frontend

for attempt in {1..24}; do
  if curl --fail --silent --show-error --max-time 5 http://127.0.0.1:3000/api/health/ping >/dev/null \
    && curl --fail --silent --show-error --max-time 5 http://127.0.0.1:8083/api/health/ping >/dev/null; then
    break
  fi
  if [[ $attempt -eq 24 ]]; then
    fail "native services did not become healthy"
  fi
  sleep 5
done

echo "[systemd-deploy] release ${release_id} is healthy"

# Retain the active release and a small, recoverable rollback history.
mapfile -t old_releases < <(find "$RELEASES_DIR" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %p\n' | sort -nr | awk 'NR > '"$KEEP_RELEASES"' {print $2}')
if ((${#old_releases[@]})); then
  printf '%s\0' "${old_releases[@]}" | xargs -0r rm -rf --
fi

trap - EXIT

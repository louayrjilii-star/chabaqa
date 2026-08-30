# Native systemd deployment

The native deployment path keeps the current Docker infrastructure services
(MongoDB, Redis, MinIO, Meilisearch, ClamAV, and monitoring) while running the
Chabaqa backend and frontend as `systemd` units. It is selected by setting the
repository Actions variable `PRODUCTION_DEPLOY_MODE` to `systemd`; the safe
default remains `docker`.

## One-time VPS setup

Run these commands on the VPS before enabling the Actions variable. Replace the
Node path only if Node is not installed at `/usr/bin/node`.

```bash
sudo useradd --system --home /opt/chabaqa --create-home --shell /usr/sbin/nologin chabaqa
sudo install -d -o chabaqa -g chabaqa /opt/chabaqa/{releases,shared/uploads,shared/hls-output,.npm}
sudo install -d -o root -g root /etc/chabaqa
sudo install -m 0640 -o root -g chabaqa backend/.env /etc/chabaqa/backend.env
sudo install -m 0640 -o root -g chabaqa frontend/.env /etc/chabaqa/frontend.env
sudo tee /etc/chabaqa/deploy.env >/dev/null <<'EOF'
NODE_BIN=/usr/bin/node
NPM_BIN=/usr/bin/npm
EOF
sudo chmod 0640 /etc/chabaqa/deploy.env
```

If the production Node installation is under `/home/ubuntu/.local/node-v22.19.0-linux-x64/bin`, use that path for both variables. The `chabaqa` user must be able to traverse `/home/ubuntu` and execute the Node binaries.

The backend environment must use native localhost endpoints (for example,
`MONGODB_URI`, `REDIS_HOST=127.0.0.1`, `MEILI_HOST`, and `CLAMAV_HOST`) and
`HOST=127.0.0.1`. The frontend environment must include `JWT_SECRET`,
`API_INTERNAL_URL=http://127.0.0.1:3000/api`, and the production public API URL.

## CI/CD behaviour

On a successful CI run for `main`, the production workflow checks out the exact
commit on the VPS and runs `scripts/deploy-systemd.sh` with `sudo`. The script:

1. builds the backend and standalone Next.js frontend in a new release directory;
2. installs the tracked service units and atomically switches `/opt/chabaqa/current`;
3. restarts both units and probes their localhost health endpoints;
4. restores the previous symlink and services if any post-switch check fails.

CI validates shell syntax and all three unit files with `systemd-analyze verify`.
The first production switch should be performed with a verified Mongo backup and
the Docker `chabaqa-backend` / `chabaqa-frontend` containers stopped to prevent
port conflicts.

`chabaqa-openwa.service` is optional and runs the native OpenWA multi-session
gateway for creator campaigns. Its port stays localhost-only; follow
`docs/OPENWA_NATIVE.md` before enabling it.

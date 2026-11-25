# High-risk rehearsal run log

- Date/time: 2026-11-25 14:23 Asia/Shanghai
- Node v22.23.2; no dependencies/network
- `node --test` → **7 tests, 7 pass, 0 fail, exit 0**
- `--dry-run` → v2 output; source unchanged
- `--apply` → v2 written; timestamped backup
- `--rollback` → original restored byte-identical (`fef82d83…3052`)
- Scope: temp copies only; no real profile/config was migrated

- Spaced/unicode path copy: `cp -a` to `/tmp/hrisk space 配置`; `node --test` → 7/7 pass; cleanup.

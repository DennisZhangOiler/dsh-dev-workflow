# Program E2E run log

- Date/time: 2026-11-25 14:18 Asia/Shanghai (after final edits; observed at 14:17:28–14:17:42)
- Runtime: Node v22.23.2, no dependencies/network
- Command: `cd docs/e2e/0.8/program && node --test`
- Result: **10 tests, 10 pass, 0 fail, exit 0**
- Contract hashes: `sha256sum -c CONTRACT-HASHES.txt` → 3/3 OK
- Tests cover: provider schema-valid output, malformed gate rejection, consumer
  mapping/no mutation, missing release/gates candidate/status, root/nested extra
  key mutations, tests passed>total, release type, schema/runtime surface,
  two temp data dirs, two child processes.
- Limitations: no live server, no container/network isolation, no post-deploy.

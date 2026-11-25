# MIGRATION — preset config 0.7 → 0.8 (rehearsed, not applied)

**Status: rehearsal only. No real config was modified. Human approval for a real
apply is pending.**

## Preconditions

- [x] Rehearsal approver recorded in `HUMAN-APPROVAL.md` (rehearsal only; real apply not approved)
- [ ] Fresh backup hash recorded
- [ ] Profile stopped; no concurrent writer
- [ ] `node --test` passes in this directory

## Steps

```sh
node migrate.mjs --dry-run <config>
node migrate.mjs --apply <config>      # prints backup path + sha256
# validate: schemaVersion=2, preset.id/name, skillIds, conventions
node migrate.mjs --rollback <config> <backup>
```

## Rollback

Use the exact backup emitted by `--apply`; verify the restored SHA-256 equals the
pre-migration hash. The rehearsal restored `fef82d83…3052` byte-identically.

## Compatibility / cutover

| Area | v1 | v2 | Rule |
|---|---|---|---|
| preset id | `preset.id` | same | required |
| display name | `displayName` | `name` | required fallback to id |
| skills | `skills` | `skillIds` | 9-skill allowlist |
| docs | `docs.*` | `conventions.*` | optional values preserved |
| ui | `ui.rubric` | same path | optional |

- Idempotency: applying to an already-v2 config is **rejected** (`expected config version 1`), not silently re-applied.
- Cutover: stop profile, fresh backup, one file, verify, then start; no dual-write.
- Owner/trigger: maintainer triggers; human approval is required for real apply.
- Compatibility: only v1 fixtures tested; real 0.7 profile not loaded.

## Non-goals

- No production install, tag, push, or network.
- Writes use temp-file + fsync + rename; there is no concurrent-writer or
  crash-injection test. A production migration must add locking and crash tests.

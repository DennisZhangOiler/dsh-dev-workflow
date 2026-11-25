# High-risk migration plan — preset config 0.7 → 0.8

**Risk tier: high** because it changes persisted preset configuration and could
drop skills/docs references. This E2E rehearses on temp copies only; no user
config or production data is touched.

## Scope

- Input: `fixtures/config-v1.json` (version 1 preset config).
- Output: `schemaVersion: 2` with `preset.id/name/skillIds`, `conventions`, `ui`,
  `migration` metadata.
- Explicitly out of scope: real profile installation, network, user home writes,
  release/tag/push.

## Gate sequence

1. Threat model (`THREAT-MODEL.md`)
2. SCA / license (`SCA-LICENSE.md`)
3. SAST / secrets (`SAST.md`)
4. Failure/load cases (`LOAD-FAILURE.md`)
5. Rehearsal: dry-run, backup, apply, validate, rollback (`REHEARSAL.md`)
6. Human approval for the rehearsal plan (`HUMAN-APPROVAL.md`) — **approved rehearsal only**; real apply remains blocked
7. Post-deploy plan (`POST-DEPLOY.md`) — not executed

## Decision rule

Proceed to a real migration only if: rehearsal is byte-identical after rollback,
all 4 tests pass, no P0/P1 threat, human approval is recorded, and a fresh backup
is taken immediately before the real apply. Otherwise stop.

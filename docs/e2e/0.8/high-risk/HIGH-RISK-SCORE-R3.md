# High-risk score — preset config 0.7 → 0.8 rehearsal (round 3)

- **Reviewer:** `highrisk-reviewer-3` (independent, read-only; not the author or
  test author). Delegated by `lead`; new session, no author transcript.
- **Date/time:** 2026-11-25 14:37–14:52 Asia/Shanghai; Node v22.23.2.
- **Gate:** the request's high-risk/migration gate — **no P0/P1**, reviewable
  evidence, a recorded human approval with an explicit scope, the real migration
  explicitly **pending**, and **>=85/100 for PASS**.
- **Subject:** `docs/e2e/0.8/high-risk/` — 25 files before this file plus an
  empty `scripts/` dir (excluding `HIGH-RISK-SCORE-R3.md`). Base commit
  `14d31df47bc0548106e0b9726fe33095892f9976`; the whole `docs/e2e/` tree is
  untracked (`git ls-files docs/e2e/0.8/high-risk` → 0).
- **Independence:** a separate subagent session with no author transcript. I
  read the round-1/2 scores as review-target context, then re-derived every
  claim from the files and independent `/tmp` probes. This is a **re-review**,
  not a blind first review. Caveat: same model family (`deepseek-flash`) as the
  author, so context-independent only, not model-independent; real apply still
  needs the human code/release review the pack itself withholds.
- **Scope of this score:** the local rehearsal pack and its claims — not
  production readiness, not release approval, not a real migration.

## Verdict

**FAIL — gate not met — 84/100 — 0 P0 / 0 P1 / 8 P2 / 10 P3.**

This is a **score-only fail**. The round-2 P1 is genuinely closed: `--apply`
records `migration.backupSha256` from the pre-migration bytes, `--rollback`
requires a v2 target with that field, validates the full v1 shape and the preset
id, compares the backup SHA-256, and rejects every wrong backup I tried with a
non-zero exit and a byte-unchanged source. I reproduced the happy path and the
new negative cases with the real CLI, and the reissued rehearsal's `after` hash
is only reproducible when the v2 contains that pre-hash. Deleting the hash
comparison turns the suite red.

The pack still sits one point below the 85 gate on P2 evidence and operational
completeness, not on rollback safety: the rollback section of `MIGRATION.md`
still cites a hash that does not exist in this fixture (P2-1), the CLI still
breaks when the pack is relocated under a space/unicode path (P2-2), write/crash
recovery is still not atomic or CLI-recoverable (P2-3), the migration target is
still a synthetic schema with no real 0.7 config or 0.8 consumer (P2-4), SAST is
still manual only (P2-5), the evidence freeze is still partial with no raw
command log (P2-6), the pack is still untracked and absent from
`docs/VERIFICATION.md`/`test/check.mjs` (P2-7), and the hash binding itself lives
in the mutable v2 target, so editing that field can rebind rollback to another
v1 (P2-8).

Do **not** use this pack to authorize the real apply. The real apply remains
blocked by `HUMAN-APPROVAL.md:9-10`, `MIGRATION.md:3-4`, and
`POST-DEPLOY.md` ("not executed"); the gate's no-P0/P1 and pending-apply
conditions pass, but the score condition does not.

## Score

| Area | Weight | Score | Assessment |
|---|---:|---:|---|
| Evidence integrity and reproducibility | 25 | **21** | `CONTRACT-HASHES.txt` 4/4 OK, `EVIDENCE-HASHES.txt` 17/17 OK, 7/7 tests, real CLI happy path reproduced, and the reissued rehearsal's `after` hash is reproducible from the current code. Deductions: `MIGRATION.md` still cites the old `1fbbcadd…1374` hash; the space/unicode **pack path** bug remains; the freeze is partial and there is no raw command/exit-code log. |
| Backup / apply / rollback correctness | 25 | **23** | Round-2 P1 fixed and mutation-covered: apply records the pre-hash, rollback checks v2 target + `backupSha256` + full v1 shape + preset id + hash; four negative classes rejected with no write; byte-identical restore; backup `0600`; symlink invocation fixed. Deductions: no fsync/atomic rename, and a corrupt/partial target cannot be rolled back by the CLI; the target's binding field is unauthenticated. |
| Scope honesty and human approval | 15 | **14** | Rehearsal-only approval is explicit, real apply is not approved, post-deploy is marked not executed, installed profile is still 0.7.0 while the repo is 0.8.0, and no real preset config was written. Deduction: the approval predates the fixed code and reissued evidence and is self-attested. |
| Threat / SCA / SAST / load coverage | 15 | **11** | T1–T8 cover the right categories and T3 is still medium; T6 is stronger now that hash binding exists. SCA is trivially clean (no dependencies). Deductions: SAST/secrets are still manual only; crash/load/concurrency are unproven. |
| Migration artifact completeness | 10 | **7** | Status, rollback, backup, non-goals, compatibility matrix, idempotency, cutover, and owner/trigger are present. Still missing privacy/retention, backfill/dual-run, ordering, and representative real-config data; the matrix overstates what the validator actually preserves. |
| Reviewability and integration | 10 | **8** | Small, readable, reproducible pack with real CLI tests. But it is untracked, absent from `docs/VERIFICATION.md` and `test/check.mjs`, `scripts/` is empty, and there is no raw run log. |
| **Total** | **100** | **84** | **FAIL — score only — 0 P0 / 0 P1 / 8 P2 / 10 P3.** |

Anchors (same as round 2): 0 = missing/unusable; 50 = present with a material
gap; 100 = specific, measured, task-fit. This total is a gate, not a diagnostic.
Round-2 was 76; the P1 fix is worth +6 in backup correctness, the reissued
evidence/test/symlink fixes are worth +2 across evidence and threat, and the
remaining P2s cap the total at 84.

## What I actually ran

```sh
cd docs/e2e/0.8/high-risk && node --test
# 7 tests, 7 pass, 0 fail, 0 cancelled, exit 0 (run twice, both green)

sha256sum -c CONTRACT-HASHES.txt
# fixtures/config-v1.json: OK
# migrate.mjs: OK
# test/migrate.test.mjs: OK
# test/cli.test.mjs: OK

# EVIDENCE-HASHES.txt parse (Python SHA-256 over every listed path):
# 17/17 OK, 0 missing, 0 mismatched
sha256sum fixtures/config-v1.json rehearsal/config.json \
  rehearsal/config.json.backup-1795588644994.json
# all three = fef82d830f68b6c0b06870d2aa3c040e9211ac8fadf0259d85fb249784c33052
```

Real CLI probes, all on fresh `/tmp` copies (repository untouched):

| Probe | Result |
|---|---|
| `--apply`, then inspect v2 | exit 0; `migration.backupSha256` = pre-migration SHA-256; backup mode `600`; source mode preserved (`664` stayed `664`); backup path + `sha256` printed |
| `--rollback` with the emitted backup | exit 0; restored SHA-256 = pre-hash; byte-identical |
| `--rollback` with a valid v1, same preset id, different `docs` | exit 1, `backup hash does not match pre-migration hash`; source byte-unchanged |
| `--rollback` with a valid v1, other preset id | exit 1, `backup preset id does not match target`; source byte-unchanged |
| `--rollback` with `{"wrong":true}` / empty / string / array `preset` | exit 1, `v1 has unexpected/missing keys`; source byte-unchanged |
| `--rollback` with a missing backup | exit 1, `backup required`; no write |
| `--rollback` against a v2 target with no `backupSha256` | exit 1, `rollback requires a migrated v2 target with backupSha256`; no write |
| `--apply` on an already-v2 config | exit 1; no new backup; message is `v1 has unexpected/missing keys`, not the `expected config version 1` claimed in `MIGRATION.md:37` |
| `--apply` with invalid JSON / unknown skill | exit 1; no backup; source untouched |
| symlink invocation (`ln -s migrate.mjs link.mjs`) | exit 0 and real output (round-2 P2-2 fixed by `realpathSync` on `argv[1]`) |
| tampered v2 target: set `migration.backupSha256` to a valid wrong v1's hash and same preset id | **exit 0 and wrong v1 restored** — residual P2-8 |
| pack copied to `/tmp/hrisk space 配置` and `node --test` there | **4 top-level results, 1 pass / 3 fail**, all three CLI paths failing with `ENOENT … '/tmp/hrisk%20space%20%E9%85%8D%E7%BD%AE'` at `migrate.mjs:105`; direct `node ./migrate.mjs --dry-run src.json` also exits 1 |

Rehearsal-artifact reproduction:

- `RESULT.json.after` is `96418edb6fa895bda56826f87eec94a07da743176ee3495756cdcdd62c938a38`.
  I reproduced it exactly with the current `migrateV1toV2` by setting
  `migration.backupSha256 = fef82d83…3052` and `migration.at =
  2026-11-25T06:37:24.994Z` (the millisecond timestamp encoded in the backup
  filename `…1795588644994.json`). Other `at` values do not match. That is
  independent evidence that the reissued rehearsal really used the current
  apply code and the new pre-hash field, not just a hand-edited v2.
- `rehearsal/apply.json` (sha256 = pre-hash), `rehearsal/rollback.json`
  (restored = pre-hash), `rehearsal/config.json` (v1), and the backup are all
  byte-identical to `fixtures/config-v1.json`; all are mode `600`.
- `rehearsal/dry-run.json` has no `backupSha256` (expected: dry-run does not
  apply), and `RESULT.json` records no command, exit code, or `at` value.

Mutation checks on a fresh `/tmp` copy (repository untouched):

| Mutation | Suite result |
|---|---|
| delete the `backupSha256` comparison (`migrate.mjs:97`) | **6 pass / 1 fail** — hash binding is pinned |
| delete `validateV1(backupValue)` (`migrate.mjs:94`) | **7/7 pass** — not pinned |
| delete the preset-id check (`migrate.mjs:95`) | **7/7 pass** — not pinned |
| delete the v2-target guard (`migrate.mjs:92`) | **7/7 pass** — not pinned |
| delete the `backupSha256` recording (`migrate.mjs:81`) | **6 pass / 1 fail** — pinned |
| delete the backup write (`migrate.mjs:83`) | **5 pass / 2 fail** — pinned |
| delete the rollback copy (`migrate.mjs:98`) | **6 pass / 1 fail** — pinned |

Scope / profile checks:

- The active profile still has `dsh-rd-workflow@0.7.0` installed; the repository
  is `0.8.0`; `~/.dsh/profiles` contains no preset config with this schema; no
  recent write to a user config was found. The only config written is
  `rehearsal/config.json` inside the untracked pack.
- `git status --porcelain docs/e2e` → `?? docs/e2e/`; `git ls-files
  docs/e2e/0.8/high-risk` → 0.
- `HUMAN-APPROVAL.md` (mtime 14:23:57) predates `migrate.mjs` (14:37:10) and the
  reissued rehearsal artifacts (14:37:24–25).

## Findings

### P0 — Blocking

None. No real profile/config was overwritten, no secret was found, and no
real/unauthorized apply was performed. The rehearsal wrote only
`rehearsal/config.json` and its backup inside the untracked pack.

### P1 — Major

None. **Round-2 P1-1 is closed for its stated scenario.**

`migrate.mjs:79-84` records the pre-migration SHA-256 in the v2 target before
writing the backup and source; `migrate.mjs:92-98` requires a v2 target with a
string `migration.backupSha256`, validates the backup against the full v1 shape
(`exact` at the root and on `preset`/`docs`/`ui`), requires the same preset id, compares the
SHA-256, and only then copies. Round 2's false-success cases now all exit 1 with
the source byte-unchanged (see the probe table), including a wrong-but-valid v1
with the same preset id and a hash mismatch. The negative test
`test/cli.test.mjs:43-67` covers other-preset, malformed, and hash-mismatch
backups; test 1 covers the byte-identical happy path through the real CLI.

Residual, outside the stated P1 scenario and the threat model: the binding is
self-referential. The hash is stored in the mutable v2 target, so editing
`migration.backupSha256` to match any v1 with the same preset id makes rollback
restore that v1 with exit 0 (I demonstrated it). There is no external anchor,
sidecar, or signature. This is P2-8, not a re-opening of P1-1: the round-2
scenario (intact target, wrong backup) is rejected.

### P2 — Moderate

**P2-1 · `MIGRATION.md` still cites a hash that does not exist in this fixture.**
`MIGRATION.md:25` says "The rehearsal restored `1fbbcadd…1374` byte-identically."
The fixture, both rehearsal artifacts, and `RUNLOG.md:8` / `REHEARSAL.md:9` use
`fef82d830f68b6c0b06870d2aa3c040e9211ac8fadf0259d85fb249784c33052`. An
operator following the rollback verification instruction would compare against a
hash that can never match. This is the same open P2-6 from round 2; the reissue
did not fix it. Fix: reference the SHA-256 printed by `--apply` (or use
`fef82d83…3052`) and regenerate `EVIDENCE-HASHES.txt`.

**P2-2 · The CLI still breaks when the pack itself is under a space/unicode
path.** `migrate.mjs:105` uses `realpathSync(new URL(import.meta.url).pathname)`;
`.pathname` is percent-encoded, so the right-hand `realpathSync` throws. Copying
the pack to `/tmp/hrisk space 配置` makes 3/4 top-level test results fail and
makes a direct `node ./migrate.mjs --dry-run src.json` exit 1 with
`ENOENT … '/tmp/hrisk%20space%20%E9%85%8D%E7%BD%AE'`. The test helper was fixed
to `fileURLToPath` (`test/cli.test.mjs:9`), and the *source* path with spaces
works, but the CLI's own module path is not. Fix:
`fileURLToPath(import.meta.url)` (or compare canonical file URLs) and add a test
that runs the CLI/suite from a space/unicode pack path.

**P2-3 · No fsync/atomic rename, and the CLI cannot roll back a corrupt target.**
`--apply` writes the backup and then the source directly (`migrate.mjs:83-84`);
`--rollback` writes with `copyFileSync` (`migrate.mjs:98`). `MIGRATION.md:45-46`
honestly says production must add fsync/atomic rename, and T3 is medium. The
harder consequence is not stated: if the source write is partial/corrupt, the
target is no longer a valid v2 with `backupSha256`, so `--rollback` rejects by
design (`migrate.mjs:92`) and the documented "rollback from backup" recovery
path is unavailable exactly in the crash case. The backup remains and manual
restore is possible, but the CLI offers no `--force`/expected-hash recovery.
This blocks real apply, not the rehearsal.

**P2-4 · The migration target is still synthetic and unproven against a real
0.7 config or a 0.8 consumer.** The repo has no real 0.7 preset config with this
schema; the fixture is authored for the drill. A grep for `schemaVersion` /
`skillIds` / `backupSha256` outside the pack finds no loader (only
`docs/e2e/0.8/ui/manifest.json`'s unrelated `schemaVersion:1`); the shipped
preset registers its nine skills in `index.js` and declares the preset in
`cordis.patch.yml`, not in a v1 JSON file. `MIGRATION.md:40` is honest ("only v1
fixtures tested; real 0.7 profile not loaded"), but the pack does not prove that
the v2 output is consumable by 0.8. Fix: use a real/representative config copy
or state explicitly that the fixture is a stand-in and the 0.8 loader is out of
scope.

**P2-5 · SAST/secrets are still manual only.** `SAST.md:9` says "no full SAST
tool run"; no secrets scanner was run. The code is small and I found no
`eval`/`Function`/dynamic import from user input/shell execution, the fixtures
contain no secret-like strings, and SCA is trivially clean (no dependencies).
But the high-risk gate says SAST/secrets/SCA must be executed. Fix: run a
scanner or record an explicit tool-unavailable risk acceptance.

**P2-6 · The evidence freeze is still partial and there is no raw run log.**
`EVIDENCE-HASHES.txt` now covers 17 paths (up from 12) and verifies 17/17 — an
improvement — but it excludes `rehearsal/config.json`, the backup,
`rehearsal/dry-run.json`, `CONTRACT-HASHES.txt`, and itself. `scripts/` is empty;
`RUNLOG.md` is prose, not captured command/exit-code output; `rehearsal/
RESULT.json` records no command, exit code, or `at`. Fix: freeze the full
evidence set (or explicitly label which copies are derivative), capture raw
stdout/stderr and exit codes in `scripts/`, and record the apply timestamp.

**P2-7 · The pack is untracked and not integrated; `docs/VERIFICATION.md`
contradicts its existence.** `git ls-files docs/e2e/0.8/high-risk` → 0;
`git status --porcelain docs/e2e` → `?? docs/e2e/`. `docs/VERIFICATION.md:152`
says "There is still no high-risk/migration E2E pack", `:158` says a full pack
"was not run in this window", and `:168` says "there is no
high-risk/migration E2E". `test/check.mjs` does not list the pack. Fix:
track/integrate the pack, update `docs/VERIFICATION.md`, or explicitly scope it
as an untracked rehearsal that is not part of the release evidence.

**P2-8 · The pre-hash binding is self-referential.** The only recorded anchor is
`migration.backupSha256` inside the same v2 target the operator is rolling
back. Editing that field (or copying a v2 from another migration) rebinds
rollback to a different v1 with the same preset id; I demonstrated exit 0 and a
wrong restore on a `/tmp` copy. This is outside the stated threat model (it
requires write access to the target, at which point the target is already
compromised) and does not restore the round-2 P1. Still, the docs should state
the residual and a production design should use an external sidecar/signature
or a command-line expected hash. Fix: document the residual, or require
`--expected-sha256` / a read-only sidecar outside the target directory.

### P3 — Minor

- **P3-1 · Approval provenance and timing.** `HUMAN-APPROVAL.md:6` says the
  approval time is 14:23; the file mtime is 14:23:57, while the current
  `migrate.mjs` is 14:37:10 and the reissued rehearsal artifacts are
  14:37:24–25. The scope is correct (rehearsal only; real apply blocked; not
  release), but the approver could not have reviewed the hash-binding fix or the
  reissued evidence. The record is self-attested prose with no linked message or
  signature. Acceptable as a rehearsal record; not sufficient as a real-apply
  approval.
- **P3-2 · `RUNLOG.md` timestamp/scope wording.** `RUNLOG.md:3` says 14:23 and
  `:9` says "temp copies only"; the 7-test evidence and the artifacts are from
  14:37 and live in `rehearsal/`, not a temp copy. `REHEARSAL.md:3` has the same
  "temp copy" wording. The target is a copy and no real config was touched, but
  the log should match the reissued run.
- **P3-3 · `PLAN.md:28` still gates on "all 4 tests pass".** The suite is 7
  tests. This is a stale contract number, not a behaviour defect.
- **P3-4 · `RESULT.json` is minimal.** It has before/after/restored/backup/
  `byteIdentical`, but no commands, exit codes, or timestamp; `after` is
  time-dependent and only reproducible by inferring `at` from the backup
  filename (I did reproduce it). `rehearsal/dry-run.json` is likewise not
  byte-reproducible (`migration.at` is wall-clock) and is not in
  `EVIDENCE-HASHES.txt`.
- **P3-5 · The in-process test at `test/migrate.test.mjs:41-53` is blind and
  misnamed.** It writes its own backup, calls `migrateV1toV2`, and writes the
  source back by hand; it does not exercise `--apply`/`--rollback`. It no longer
  carries the main evidence, but it should be removed or renamed.
- **P3-6 · Test assertions are weaker than the controls they claim to cover.**
  The negative CLI tests assert only a non-zero exit and an unchanged source,
  not the error message. If the CLI cannot be spawned at all (e.g., the
  space/unicode path case), test 2 still passes for the wrong reason (status is
  non-zero, source unchanged). My mutation table shows that removing the full v1
  validation, the preset-id check, or the v2-target guard leaves 7/7 green;
  only the hash comparison, the `backupSha256` recording, the backup write, and
  the rollback copy are uniquely pinned. Fix: assert the specific stderr and add
  a case that fails without each guard.
- **P3-7 · `MIGRATION.md`'s compatibility matrix overstates the implementation.**
  `displayName` is required by `validateV1` (`migrate.mjs:35`), so there is no
  "required fallback to id" (`MIGRATION.md:32`); `docs`/`ui` are not optional or
  generically preserved — `validateV1` requires exactly `conventions`/
  `delivery` and `rubric` keys (`migrate.mjs:37-38`); the idempotency error is
  not `expected config version 1` for a real v2 shape (I got `v1 has
  unexpected/missing keys`). State the actual field-level contract.
- **P3-8 · `validateV2` does not require `migration.backupSha256` or
  `migration.at`.** `validateV2` checks `from === 1` only; the library
  migration output has no `backupSha256` (only CLI `--apply` adds it). A v2
  produced by the library and written by another tool would pass `validateV2`
  but be rejected by `--rollback`. `--dry-run` output likewise lacks the field.
  This is safe (no write) but should be explicit.
- **P3-9 · Backup operational edges.** The backup filename uses
  `Date.now()` (`migrate.mjs:80`), so two applies in the same millisecond collide;
  there is a TOCTOU window between `sha256File(backup)` (`migrate.mjs:96`) and
  `copyFileSync(backup, src)` (`migrate.mjs:98`); the backup is not re-hashed
  after writing; and the backup is left beside the source (the post-deploy plan
  says keep it outside).
- **P3-10 · Guard/CLI edges.** `node -` (or another import path where
  `process.argv[1]` is `-`) crashes at `migrate.mjs:105` because
  `realpathSync('-')` throws; no-mode/no-source errors are not distinguished
  ("source path required" even when the mode is missing); extra args are
  ignored; `POST-DEPLOY.md:7` says "all 9 skills register" without a command or
  expected output.

## Per-file check (the files named in the request)

| File | Result |
|---|---|
| `PLAN.md` | Gate sequence and rehearsal-only scope are correct. `:28` still says "all 4 tests pass" (P3-3); real-config representativeness remains (P2-4). |
| `THREAT-MODEL.md` | T1–T8 present; T6's mitigation is now backed by hash binding, though T3 remains medium and the self-referential binding is not listed (P2-3/P2-8). |
| `SCA-LICENSE.md` | Correct: no dependencies; no network/license obligation. |
| `SAST.md` | Honest but manual only; "no full SAST tool run" (`:9`) leaves the SAST/secrets gate unexecuted (P2-5). No dangerous constructs found. |
| `LOAD-FAILURE.md` | Behaviours are mostly correct; `:9` "backup mismatch → not silently applied" is now true, but the evidence column still points at the rehearsal/CLI guard rather than a CLI test, and invalid JSON/version-2/missing-backup rows are still in-process or manual (P3-6/P2-6). |
| `REHEARSAL.md` | The 7/7 count and `fef82d83…3052` byte-identical result are true; the limitations are honest. "temp copy" wording and the 14:23 timestamp mismatch remain (P3-2). |
| `MIGRATION.md` | Status is correctly "rehearsal only; pending"; compatibility/cutover/idempotency/owner are present. The `1fbbcadd…1374` rollback hash is stale (P2-1); the matrix overstates preservation (P3-7); no fsync/atomic write is acknowledged (P2-3). |
| `HUMAN-APPROVAL.md` | Scope is explicit and correct: rehearsal only; real apply blocked; separate approval required; not release. Provenance/timing is P3-1. |
| `POST-DEPLOY.md` | Clearly marked "not executed"; no production claim. The "all 9 skills register" check has no command/expected output (P3-10). |
| `rehearsal/RESULT.json` | Before = restored = `fef82d83…3052`; backup identical; `after` `96418edb…` is reproducible at `06:37:24.994Z` when the v2 carries `backupSha256`. Minimal, time-dependent record (P3-4). |
| `test/migrate.test.mjs` | 4 in-process tests; `:41-53` is still blind (P3-5); the invalid/unknown-skill tests are real but not CLI-level. |
| `test/cli.test.mjs` | Real CLI spawn; happy path + wrong-v1/other-preset/hash-mismatch negatives; hash binding is mutation-covered. `fileURLToPath` used for the CLI path (`:9`), but the CLI module itself still breaks under a space/unicode pack path (P2-2); only non-zero/unchanged asserts (P3-6). |
| `migrate.mjs` | P1 fix is correctly implemented (`:79-84`, `:92-98`); full v1 validation and preset-id check are present. No atomic write/recovery (P2-3); `.pathname` guard bug (P2-2); binding is self-referential (P2-8). |
| `EVIDENCE-HASHES.txt` | 17/17 verify; improved coverage, but still excludes config/backup/dry-run/CONTRACT/itself and there is no raw log (P2-6). |
| `CONTRACT-HASHES.txt` | 4/4 verify; covers the fixture, script, and both test files (the right contract set). |
| `scripts/` | Empty; no raw command/exit-code capture (P2-6). |

## Unproven / not executed

- **Real 0.7 preset config / real 0.8 loader:** not exercised; the fixture is
  synthetic and no 0.8 consumer of `schemaVersion:2`/`skillIds` exists in the
  repo. This is the main representativeness gap (P2-4).
- **fsync / atomic rename / crash-during-write:** not implemented or tested;
  a partial write makes the CLI rollback refuse, leaving only manual restore
  (P2-3).
- **Concurrency / exclusive lock / load:** not simulated; no throughput claim.
- **SAST / secrets scanner / SCA tool:** not run; SCA is clean by inspection (no
  dependencies) (P2-5).
- **Wrong-backup, path-space, and tamper probes:** I ran them on `/tmp` copies.
  The intact-target wrong-backup cases are rejected; the space/unicode **pack
  path** and the tampered-target rebind are proven defects/residuals
  (P2-2/P2-8).
- **Human approval authenticity:** not independently verifiable from the pack;
  the record is self-attested and predates the fixed code (P3-1).
- **Real apply / post-deploy smoke / monitoring / abort trigger:** not executed;
  `HUMAN-APPROVAL.md:9-10` blocks real apply and `POST-DEPLOY.md` says not
  executed.

## Gate checklist

| PASS condition | Result |
|---|---|
| No P0/P1 | **PASS** — 0 P0 / 0 P1; round-2 P1-1 is closed and mutation-covered. |
| Score >= 85 | **FAIL** — 84/100. |
| Evidence reviewable | **PARTIAL** — 4/4 contract hashes, 17/17 evidence hashes, 7/7 tests, real CLI happy/negative paths reproduced, rehearsal `after` hash reproduced. But `MIGRATION.md` has a stale rollback hash, the pack-path bug remains, the freeze is partial, and there is no raw run log. |
| Human approval recorded with explicit scope | **PASS on content** — rehearsal only; real apply not approved; not release; separate approval required. Provenance/timing is P3-1. |
| Real migration pending, no false production claim | **PASS** — `MIGRATION.md:3-4`, `HUMAN-APPROVAL.md:9-10`, `POST-DEPLOY.md`; the installed profile is 0.7.0 while the repo is 0.8.0. |
| **Overall** | **FAIL — score only; the rollback P1 is genuinely closed.** |

## What changed from round 2

- **Fixed (verified):** rollback now requires a v2 target with
  `migration.backupSha256`, validates the full v1 shape, checks the preset id,
  and compares the backup hash before copying. Wrong-but-valid, other-preset,
  malformed, and hash-mismatch backups all exit 1 with no write. The hash
  comparison is mutation-covered; the happy path is byte-identical.
- **Fixed (verified):** symlink invocation now works (`realpathSync` on
  `argv[1]`); nested unknown v1 keys are rejected instead of silently dropped;
  the CLI test helper uses `fileURLToPath`; evidence coverage grew from 12 to 17
  hash entries; the suite grew from 6 to 7 tests; the rehearsal was reissued
  with the current code.
- **Not fixed:** the stale `MIGRATION.md:25` hash (P2-1); the CLI module-path
  `.pathname` bug (P2-2, only the test helper was fixed); no
  fsync/atomic/recovery (P2-3); synthetic schema/no real config (P2-4); manual
  SAST (P2-5); partial freeze/no raw log (P2-6); untracked/unintegrated (P2-7);
  self-referential binding (P2-8); the P3 list (approval timing, RUNLOG
  timestamp, PLAN count, RESULT record, blind test, weak asserts, matrix
  inaccuracies, `validateV2` gaps, backup edges, guard edges).
- **Still the pack's strongest property:** it does not claim a real migration;
  the approval is rehearsal-only, the real apply is blocked, and the installed
  profile remains 0.7.0.

## What would change the verdict

1. Fix P2-1 and P2-2 and reissue `CONTRACT-HASHES.txt`/`EVIDENCE-HASHES.txt`
   (stale rollback hash; `fileURLToPath` for the CLI guard + a pack-relocation
   test). This alone would likely move evidence from 21 to 22–23 and clear the
   85 threshold.
2. Fix P2-3: temp-file + atomic rename + fsync, re-read/validate after write, and
   either a recovery path for a corrupt target or an explicit
   manual-restore-required note in `POST-DEPLOY.md`.
3. Fix P2-6/P2-7: freeze the full evidence set including `config.json`, the
   backup, `dry-run.json`, `CONTRACT-HASHES.txt`, and this file; capture raw
   commands/exit codes in `scripts/`; integrate or explicitly scope the pack and
   update `docs/VERIFICATION.md`/`test/check.mjs`.
4. Run or risk-accept SAST/secrets (P2-5); add the missing
   privacy/retention/backfill/ordering sections (P2-4/P2-7) and a real-config
   dry-run or an explicit synthetic-fixture statement.
5. Document the self-referential binding residual (P2-8) or add an external
   expected-hash anchor.
6. Reissue the human approval against the final code/evidence (P3-1), or state
   explicitly that the 14:23 approval covers the rehearsal plan only and the
   real apply needs a new approval.

Real apply remains **pending** regardless: it needs a fresh backup, the target
profile stopped, a separate explicit human approval, fsync/atomic write, and the
post-deploy checks actually observed. This rehearsal does not authorize it.

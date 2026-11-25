# High-risk score — preset config 0.7 → 0.8 rehearsal (round 4)

- **Reviewer:** `highrisk-reviewer-4` (independent, read-only; not the author or
  test author). Delegated by `lead`; new session, no author transcript.
- **Date/time:** 2026-11-25 14:44–14:50 Asia/Shanghai; Node v22.23.2.
- **Gate:** the high-risk/migration gate — **no P0/P1**, reviewable evidence, a
  recorded human approval with explicit scope, the real migration explicitly
  **pending**, and **>=85/100 for PASS**.
- **Subject:** `docs/e2e/0.8/high-risk/` — 26 files before this file plus an
  empty `scripts/` dir (excluding `HIGH-RISK-SCORE-R4.md`). Base commit
  `14d31df47bc0548106e0b9726fe33095892f9976`; the whole `docs/e2e/` tree is
  untracked (`git ls-files docs/e2e/0.8/high-risk` → 0).
- **Independence:** a separate subagent session with no author transcript. I read
  round 3 as review-target context, then re-derived every claim from the files and
  independent `/tmp` probes. Caveat: same model family (`deepseek-flash`) as the
  author, so context-independent only, not model-independent; real apply still
  needs the human code/security/release review the pack itself withholds.
- **Scope of this score:** the local rehearsal pack and its claims — not
  production readiness, not release approval, not a real migration.

## Verdict

**PASS (narrow) — 86/100 — 0 P0 / 0 P1 / 8 P2 / 14 P3.**

The core claimed fixes are real and independently reproduced: the CLI now works
from a space/unicode **pack** path (`fileURLToPath` + `realpathSync`), `--apply`
and `--rollback` use temp-file + file `fsync` + rename, and `MIGRATION.md` now
cites the real rehearsal hash `fef82d83…3052`. Round-2/3's rollback P1 stays
closed (see below).

The reason this is only 86, not higher, is a **new evidence-integrity
regression**: `EVIDENCE-HASHES.txt` is labelled "frozen", but **2/18 entries do
not verify**. `REHEARSAL.md` and `RUNLOG.md` were modified at `14:44:50`, nine
seconds **after** the manifest was generated at `14:44:41`; the manifest still
contains the pre-edit hashes. The current text of the two files contains the very
claims this round is about ("Writes use temp-file + fsync + rename", the
spaced/unicode run) — consistent with a post-freeze edit, though the pre-edit
content is not recoverable from the pack. The final documents are therefore not
covered by the freeze. I independently verified those claims are true, and the
code/test/rehearsal artifacts all hash correctly, so this is a P2
evidence-metadata failure, not a safety failure. It
must be reissued before any real apply, and it is the single most important
remaining defect.

Do **not** use this pack to authorize the real apply. The real apply remains
blocked by `HUMAN-APPROVAL.md:9-10`, `MIGRATION.md:3-4`, and
`POST-DEPLOY.md` ("not executed"); the installed profile is still 0.7.0 while the
repository is 0.8.0. The narrow PASS is for the rehearsal gate only.

## Score

| Area | Weight | Score | Assessment |
|---|---:|---:|---|
| Evidence integrity and reproducibility | 25 | **21** | 4/4 contract hashes OK; 16/18 evidence hashes OK (2 stale); 7/7 tests twice (pack root and a space/unicode copy); real CLI happy path/negatives reproduced; rehearsal `after` hash reproduced exactly. Deductions: the freeze is invalid for `REHEARSAL.md` and `RUNLOG.md`; the freeze still excludes `rehearsal/config.json`, the backup, `CONTRACT-HASHES.txt`, and itself; no raw command/exit-code log. |
| Backup / apply / rollback correctness | 25 | **24** | P1 closed and mutation-covered; atomic temp+fsync+rename; real CLI wrong-backup, wrong-preset, malformed, missing, tampered, and corrupt-target probes all reject with a non-zero exit and no write; byte-identical rollback. Deductions: self-referential hash binding (P2), corrupt target is not CLI-recoverable (P2), no directory fsync/mode preservation (P3). |
| Scope honesty and human approval | 15 | **14** | Rehearsal-only approval is explicit; real apply is not approved; post-deploy is marked not executed; installed profile is 0.7.0; no real config was written. Deduction: the approval (14:23) predates the final code/evidence (14:44) and is self-attested. |
| Threat / SCA / SAST / load coverage | 15 | **12** | T1–T8 are present; T3 is now mitigated in code; T6 is backed by the hash binding. Deductions: T3 and `MIGRATION.md` still say "no fsync"; SAST/secrets is still manual only; crash/concurrency/load are unproven; the self-referential binding is not in the threat model. |
| Migration artifact completeness | 10 | **7** | Status, rollback, backup, non-goals, compatibility, idempotency, cutover, and owner are present. Deductions: `MIGRATION.md:45-46` now **contradicts** the implemented atomic write; the compatibility matrix still overstates required/optional fields; the target is synthetic; privacy/retention/backfill/ordering are missing. |
| Reviewability and integration | 10 | **8** | Small, readable, reproducible pack; real CLI tests; pack-path bug fixed. Deductions: still untracked, absent from `docs/VERIFICATION.md` and `test/check.mjs`; `scripts/` is empty; no raw run log. |
| **Total** | **100** | **86** | **PASS (narrow) — 0 P0 / 0 P1 / 8 P2 / 14 P3.** |

Anchors: 0 = missing/unusable; 50 = present with a material gap; 100 = specific,
measured, task-fit. This total is a gate, not a diagnostic. Round 3 was 84; the
genuine path/atomic/hash fixes are worth roughly +3, and the new stale-freeze
regression plus stale contract text cost roughly −1, giving 86.

## What I actually ran

```sh
cd docs/e2e/0.8/high-risk && node --test
# 7 tests, 7 pass, 0 fail, 0 cancelled, exit 0

sha256sum -c CONTRACT-HASHES.txt
# fixtures/config-v1.json: OK
# migrate.mjs: OK
# test/migrate.test.mjs: OK
# test/cli.test.mjs: OK

# EVIDENCE-HASHES.txt: 18 entries, 16 OK, 2 FAIL
# FAIL REHEARSAL.md  recorded 32913b60…, current 7fee2831…
# FAIL RUNLOG.md     recorded fe07d139…, current 30817e6c…

# Space/unicode pack copy, copied with `cp -a` to
# `/tmp/r4-probe-…/pack 配置 dir`:
cd "/tmp/r4-probe-…/pack 配置 dir"
node --test                 # 7/7 pass, exit 0
node ./migrate.mjs --dry-run fixtures/config-v1.json   # exit 0, v2 JSON
node ./link.mjs --dry-run fixtures/config-v1.json      # symlink invocation, exit 0
```

## EVIDENCE-HASHES verification (the headline finding)

`EVIDENCE-HASHES.txt` says `# Evidence hashes (frozen)` (line 1). Current-state
verification:

| Entry | Recorded | Current | Result |
|---|---|---|---|
| `REHEARSAL.md` (line 8) | `32913b60589b…` | `7fee2831ea2b…` | **FAIL** |
| `RUNLOG.md` (line 12) | `fe07d139dae9…` | `30817e6c5447…` | **FAIL** |
| other 16 entries | — | — | **OK** |

Timing explains it and makes it a real freeze failure rather than a hashing
mistake:

- `EVIDENCE-HASHES.txt` mtime: `2026-11-25 14:44:41.189`
- `REHEARSAL.md` mtime: `2026-11-25 14:44:50.766`
- `RUNLOG.md` mtime: `2026-11-25 14:44:50.766`

The two documents were edited **after** the freeze. The current text contains the
new round-4 claims (`REHEARSAL.md:15-16` "Writes use temp-file + fsync + rename";
`RUNLOG.md:11` spaced/unicode 7/7), consistent with a post-freeze edit. I verified
both claims are true, but they are not frozen; the manifest's "frozen" claim is
false for the final pack.
Fix: regenerate `EVIDENCE-HASHES.txt` after the last edit, verify all listed
paths, and add a small script so the freeze cannot be generated before the final
write. `CONTRACT-HASHES.txt` is unaffected and is 4/4 OK.

The rest of the freeze is still partial: it covers the four raw rehearsal JSON
outputs (this round's improvement) but not `rehearsal/config.json`, the backup,
`CONTRACT-HASHES.txt`, or `EVIDENCE-HASHES.txt` itself, and `scripts/` is empty
(no captured stdout/stderr/exit codes). See P2-2.

## Real CLI probes

All probes ran on fresh `/tmp` copies; the repository was not modified. The CLI
is the real script, not the in-process helper.

| Probe | Result |
|---|---|
| `--apply` on a 664 config in a temp dir | exit 0; v2 `schemaVersion:2`, `preset.id=dev-workflow`, `name=研发流程`, 9 `skillIds`, `migration.from=1`, `backupSha256` = pre-migration SHA-256; backup printed; backup mode `600`; source mode changed to `600` |
| `--rollback` with the emitted backup | exit 0; restored SHA-256 = pre-hash; byte-identical; source mode `600` |
| `--rollback` with a valid v1, same preset id, different `docs` | exit 1, `backup hash does not match pre-migration hash`; source byte-unchanged |
| `--rollback` with a valid v1, other preset id | exit 1, `backup preset id does not match target`; source byte-unchanged |
| `--rollback` with `{"wrong":true}` / malformed v1 | exit 1, `v1 has unexpected/missing keys`; source byte-unchanged |
| `--rollback` with a missing backup | exit 1, `backup required`; no write |
| `--rollback` with a backup tampered after apply | exit 1 (JSON/parse or hash); no write |
| `--apply` with invalid JSON | exit 1; no backup for that source; source untouched |
| `--apply` on an already-v2 config | exit 1, `v1 has unexpected/missing keys` (not the `expected config version 1` claimed in `MIGRATION.md:37`) |
| `--rollback` against a corrupted target | exit 1 at JSON parse; no write — CLI recovery from a corrupt target is unavailable (P2-8) |
| Space/unicode pack path, `node --test` | 7/7 pass, exit 0 |
| Space/unicode pack path, direct `--dry-run` | exit 0, v2 JSON |
| Symlink invocation of `migrate.mjs` | exit 0 (fixed by `realpathSync`) |
| Tampered v2 target: replace `migration.backupSha256` with another valid v1's hash, same preset id | **exit 0 and the wrong v1 is restored** — self-referential binding residual (P2-7) |
| Symlinked **source** config (`link.json` → `real.json`) | exit 0; `link.json` becomes a regular v2 file, `real.json` remains v1 — dotfile/symlink edge (P3-4) |
| `printf 'import("./migrate.mjs")' \| node -` | uncaught `ENOENT: lstat '…/high-risk/-'` — guard edge (P3-5) |

Mutation checks on a `/tmp` copy (repository untouched):

| Mutation | Suite result |
|---|---|
| delete the `backupSha256` comparison (`migrate.mjs:104`) | **6 pass / 1 fail** — hash binding is pinned |
| delete `validateV1(backupValue)` (`migrate.mjs:101`) | **7/7 pass** — not pinned |
| delete the preset-id check (`migrate.mjs:102`) | **7/7 pass** — not pinned |
| delete the v2-target guard (`migrate.mjs:99`) | **7/7 pass** — not pinned |
| delete the backup write (`migrate.mjs:90`) | **5 pass / 2 fail** — pinned |

## Rehearsal-artifact reproduction

- `rehearsal/RESULT.json` (hash `6fc9fe53…`) records
  `before = restored = fef82d83…3052`, `after = fee20a17e25d6dfa9b6c35ff4552618145899aea20a5ec2f21043329d0fbbe82`,
  `byteIdentical: true`.
- I reproduced `after` exactly with the current `migrateV1toV2` by setting
  `migration.backupSha256 = fef82d83…3052` and
  `migration.at = 2026-11-25T06:44:41.114Z` (the timestamp encoded in the backup
  filename `…1795589081114.json`). This independently confirms the applied v2 was
  produced by the current apply code and carries the pre-hash.
- `rehearsal/apply.json` (`a386b378…`) reports the backup path and pre-hash;
  `rehearsal/rollback.json` (`62d653b4…`) reports the restored pre-hash;
  `rehearsal/dry-run.json` (`2417648a…`) is a v2 without `backupSha256` (expected).
- `rehearsal/config.json` and the backup are byte-identical to the fixture
  (`fef82d83…3052`), mode `600`; the fixture is mode `664`. The applied v2 file
  itself was rolled back and is not preserved (P3-11).
- `CONTRACT-HASHES.txt` 4/4 OK; the code/test hashes in `EVIDENCE-HASHES.txt`
  match the current files.

## P0 — Blocking

None. No real profile/config was overwritten, no secret was found, and no
real/unauthorized apply was performed. The rehearsal wrote only
`rehearsal/config.json`, its backup, and the four JSON outputs inside the
untracked pack.

## P1 — Major

None. **Round-2/3's rollback P1 remains closed.**

`migrate.mjs:84-92` records the pre-migration SHA-256 in the v2 target; `:95-106`
requires a v2 target with a string `migration.backupSha256`, validates the full
v1 shape, requires the same preset id, compares the SHA-256, and only then writes
atomically. The probes above show wrong-but-valid v1, other-preset, malformed,
missing, tampered, and corrupt-target cases all exit non-zero with the source
byte-unchanged; the hash comparison and backup write are mutation-pinned. The
negative CLI tests (`test/cli.test.mjs:30-67`) and the real happy path
(`:13-28`) cover the stated scenario.

Residual, outside the stated P1 scenario: the binding is self-referential
(P2-7), and a corrupt target cannot be rolled back by the CLI (P2-8). Neither
reopens the round-2 P1 (intact target, wrong backup), because that scenario is
rejected.

## P2 — Moderate

**P2-1 · `EVIDENCE-HASHES.txt` is invalid for `REHEARSAL.md` and
`RUNLOG.md` (2/18 fail).**
The freeze was generated at `14:44:41.189`; both files were modified at
`14:44:50.766`, after it. Recorded vs current:
`REHEARSAL.md` `32913b60589b…` vs `7fee2831ea2b…`; `RUNLOG.md`
`fe07d139dae9…` vs `30817e6c5447…`. The current text contains the fsync and
spaced-path claims, so the final claims are outside the frozen set. The
`frozen` label is false for the delivered pack. Fix: regenerate the manifest
after the final edit and verify every entry; add a freeze/verify script.

**P2-2 · The freeze is still partial and there is no raw run log.**
`EVIDENCE-HASHES.txt` covers the four raw rehearsal JSONs (improvement), but
excludes `rehearsal/config.json`, the backup, `CONTRACT-HASHES.txt`, and itself;
`scripts/` is empty; `RUNLOG.md` is prose; `rehearsal/RESULT.json` has no
command, exit code, or timestamp. An auditor cannot replay commands from the
pack. Fix: freeze the full evidence set (or label derivative copies), capture
raw stdout/stderr/exit codes in `scripts/`, and record the apply timestamp.

**P2-3 · The contract docs still say the atomic write does not exist.**
`MIGRATION.md:45-46` says "no fsync/atomic rename in this fixture"; the code
now uses temp-file + `fsyncSync` + `renameSync` (`migrate.mjs:25-30`).
`THREAT-MODEL.md:7` still rates T3 "medium (no fsync)" and `MIGRATION.md:32-37`
still describes fallback/optional fields and the wrong idempotency error. These
are frozen, authoritative-looking statements that contradict the implementation.
Fix: state the actual atomic behavior, the remaining no-directory-fsync and
corrupt-target-recovery residuals, and align the compatibility matrix with
`validateV1`/`validateV2`.

**P2-4 · The migration target is synthetic and unproven against a real 0.7
config or a 0.8 consumer.**
The fixture is authored for the drill; no real 0.7 preset config with this schema
exists in the repo, and no loader consumes `schemaVersion:2`/`skillIds` outside
the pack. `MIGRATION.md:40` is honest ("only v1 fixtures tested; real 0.7
profile not loaded"), but the pack does not prove the v2 output is consumable by
0.8. Fix: use a real/representative config copy or explicitly scope the fixture
as a stand-in and the loader as out of scope.

**P2-5 · SAST/secrets is still manual only.**
`SAST.md:9` says "no full SAST tool run"; no secrets scanner was run. The code is
small and I found no `eval`/`Function`/dynamic import from user input/shell
execution, and SCA is trivially clean (no dependencies). But the high-risk gate
says SAST/secrets/SCA must be executed. Fix: run a scanner or record an explicit
tool-unavailable risk acceptance.

**P2-6 · The pack is untracked and not integrated; `docs/VERIFICATION.md`
contradicts its existence.**
`git ls-files docs/e2e/0.8/high-risk` → 0; `git status` → `?? docs/e2e/`;
`test/check.mjs` does not list the pack; `docs/VERIFICATION.md:152,158,168`
still says "There is still no high-risk/migration E2E pack" / "there is no
high-risk/migration E2E". Package `files` includes `docs` and `test`, so an
untracked pack could ship in a tarball while the verification doc says it does
not exist. Fix: track/integrate the pack and update `check.mjs`/`VERIFICATION`,
or explicitly scope it as an untracked rehearsal outside release evidence.

**P2-7 · The pre-hash binding is self-referential.**
The only anchor is `migration.backupSha256` inside the same mutable v2 target.
I edited that field on a `/tmp` copy to another valid v1's hash (same preset id)
and `--rollback` exited 0 and restored the wrong v1. The docs do not mention this
residual. Fix: use an external sidecar/signature or a command-line expected hash
(`--expected-sha256`), or document the residual explicitly.

**P2-8 · A corrupt target cannot be rolled back by the CLI.**
`--rollback` must parse the v2 target to obtain `backupSha256`
(`migrate.mjs:98-99`); if the target is corrupt or the field is missing, the CLI
refuses and only manual restore from the backup remains. Atomic apply makes a
partial target much less likely, but external/manual corruption is still
unrecovered. Fix: add a `--force`/expected-hash recovery path or an explicit
manual-restore note in `POST-DEPLOY.md`.

## P3 — Minor

- **P3-1 · Source mode changes on apply/rollback.** Temp+rename writes with
  mode `0600`, so a `664` source becomes `600`; the docs/limits do not mention
  it. Safe for secrets, but group-readable consumers would break.
- **P3-2 · No directory fsync or post-write re-read/validate.** The file is
  fsynced before rename, but the directory is not; crash durability of the
  rename is unproven, and the written v2 is not re-read/validated.
- **P3-3 · Backup TOCTOU/re-hash/collision.** `sha256File(backup)` and the later
  `readFileSync(backup)` are separate reads; the backup is not re-hashed after
  write; `Date.now()` filenames can collide; there is no lock/concurrency test.
- **P3-4 · Symlinked source is replaced, not followed.** `--apply` on `link.json`
  → `real.json` exits 0 and replaces `link.json` with a regular v2 file, leaving
  `real.json` v1. Dotfile-managed configs could get a false-success migration.
- **P3-5 · `node -` import guard crashes.** `realpathSync(process.argv[1])` on
  `-` throws `ENOENT` at `migrate.mjs:112`; importing via stdin is not guarded.
- **P3-6 · Temp-file error/symlink edges.** `writeAtomic` leaves `.tmp-*` on a
  failed write and follows a pre-existing temp symlink; no cleanup/hardening.
- **P3-7 · Test/mutation gaps.** Negative tests assert only non-zero exit and an
  unchanged source, not the specific stderr; removing `validateV1`, the preset-id
  check, or the v2-target guard leaves 7/7 green. The in-process test at
  `test/migrate.test.mjs:41-53` is blind and misnamed (it writes its own backup
  and restores by hand).
- **P3-8 · `validateV2` is weaker than `--rollback`.** It does not require
  `migration.backupSha256`/`at`; library/dry-run output passes `validateV2` but
  cannot be rolled back by the CLI.
- **P3-9 · Documentation inaccuracies.** `PLAN.md:28` gates on "all 4 tests"
  (suite is 7); `RUNLOG.md:3` says 14:23 while the artifacts are 14:44;
  `REHEARSAL.md:3` says "temp copy" while the artifacts live in the pack;
  `MIGRATION.md:32-37` overstates fallback/optional fields and the idempotency
  error; `LOAD-FAILURE.md:6` repeats the wrong error; `SAST.md:5` refers to a
  "Program isolation test" that is not in this pack (the CLI test uses
  `child_process`); `POST-DEPLOY.md:6-7` says "all 9 skills register" with no
  command/expected output; `MIGRATION.md:11` leaves `node --test` unchecked.
- **P3-10 · Approval provenance/timing.** `HUMAN-APPROVAL.md:6` is 14:23,
  before `migrate.mjs` (14:44:36) and the final rehearsal (14:44:41); the
  approval could not have covered the fsync/path fixes or the final evidence.
  The scope is correct (rehearsal only; real apply blocked; not release), but the
  record is self-attested prose.
- **P3-11 · Rehearsal record is minimal/time-dependent.** `RESULT.json` has no
  commands, exit codes, or timestamps; `dry-run.json` is wall-clock-dependent;
  the applied v2 is not preserved (only its hash). `after` is reproducible only
  by inferring `at` from the backup filename (I did).
- **P3-12 · Missing migration-artifact sections.** No privacy/retention,
  backfill/dual-run, or ordering/cutover-window detail beyond the one-line
  cutover rule.
- **P3-13 · Freeze self-coverage.** `EVIDENCE-HASHES.txt` does not hash
  `CONTRACT-HASHES.txt` or itself; `CONTRACT-HASHES.txt` covers only the fixture,
  script, and two test files.
- **P3-14 · No crash/concurrency/load injection.** The pack says so; no
  concurrent-writer, ENOSPC, kill-during-write, or large-config test exists.

## Per-file check

| File | Result |
|---|---|
| `PLAN.md` | Gate sequence and rehearsal-only scope correct. `:28` still says "all 4 tests" (P3-9); synthetic target/service scope remains (P2-4). |
| `THREAT-MODEL.md` | T1–T8 present; T3's code mitigation is real but the table still says "medium (no fsync)" (P2-3); the self-ref binding is absent (P2-7). |
| `SCA-LICENSE.md` | Correct: no dependencies, no network/license obligation. |
| `SAST.md` | Honest but manual only (`:9`); wrong test reference (`:5`); SAST gate unexecuted (P2-5). |
| `LOAD-FAILURE.md` | Main behaviours correct; `:6` error message is wrong; evidence column still points at rehearsal/CLI guards rather than a CLI test (P3-9). |
| `REHEARSAL.md` | 7/7, `fef82d83…3052`, and fsync claim are true; "temp copy" wording is stale (P3-9); its hash is stale in `EVIDENCE-HASHES.txt:8` (P2-1). |
| `MIGRATION.md` | Status correct; `:25` hash is now correct; `:45-46` falsely says no fsync/atomic rename; `:32-37` matrix/idempotency still overstate (P2-3/P3-9). |
| `HUMAN-APPROVAL.md` | Scope is explicit and correct: rehearsal only; real apply blocked; separate approval required; not release. Timing/provenance is P3-10. |
| `POST-DEPLOY.md` | Clearly "not executed"; no production claim. "all 9 skills" check has no command (P3-9); corrupt-target manual restore is not stated (P2-8). |
| `rehearsal/RESULT.json` | Before = restored = `fef82d83…3052`; backup identical; `after` `fee20a17…` reproduced at `06:44:41.114Z`. Minimal/time-dependent (P3-11). |
| `rehearsal/dry-run.json` | v2 without `backupSha256` (expected); frozen; wall-clock `at` (P3-11). |
| `rehearsal/apply.json` | Backup path + pre-hash correct; frozen. |
| `rehearsal/rollback.json` | Restored pre-hash correct; frozen. |
| `rehearsal/config.json` / backup | Byte-identical to fixture (`fef82d83…3052`), mode `600`; not in `EVIDENCE-HASHES.txt` (P2-2). |
| `migrate.mjs` | P1 fix correct; `fileURLToPath` + `realpathSync` guard works from a spaced pack path; atomic write implemented. Residuals: no dir fsync, mode change, self-ref binding, corrupt-target recovery, `node -` edge (P2-7/P2-8/P3-1/P3-2/P3-5). |
| `test/migrate.test.mjs` | In-process tests; `:41-53` still blind (P3-7). |
| `test/cli.test.mjs` | Real CLI; happy path with spaces/unicode **source**; wrong-v1/other-preset/hash-mismatch negatives. The pack-path relocation itself is not a test (I ran it manually); negative asserts are weak (P3-7). |
| `EVIDENCE-HASHES.txt` | 18 entries, **16/18 OK**; `REHEARSAL.md` and `RUNLOG.md` stale (P2-1); partial set/no raw log (P2-2). |
| `CONTRACT-HASHES.txt` | 4/4 OK; correct contract set. |
| `scripts/` | Empty; no raw command/exit-code capture (P2-2). |

## Unproven / not executed

- **Real 0.7 preset config / real 0.8 loader:** not exercised; the fixture is
  synthetic and no consumer of `schemaVersion:2`/`skillIds` exists in the repo.
- **fsync durability / directory fsync / crash-during-write:** file fsync +
  rename is implemented, but no crash injection, ENOSPC, or kill test; directory
  metadata durability is unproven.
- **Concurrency / exclusive lock / load:** not simulated; no throughput claim.
- **SAST / secrets / SCA tools:** not run; SCA is clean by inspection (no
  dependencies).
- **Pack relocation, symlink source, `node -`, tamper, corrupt target:** I ran
  these on `/tmp` copies; the pack-path and symlink-invocation fixes are
  confirmed; the tamper/corrupt-target residuals are proven.
- **Human approval authenticity:** not independently verifiable; the record is
  self-attested and predates the final code/evidence (P3-10).
- **Real apply / post-deploy smoke / monitoring / abort trigger:** not executed;
  `HUMAN-APPROVAL.md:9-10` blocks real apply and `POST-DEPLOY.md` says not
  executed.

## Gate checklist

| PASS condition | Result |
|---|---|
| No P0/P1 | **PASS** — 0 P0 / 0 P1; round-2/3 P1 remains closed and is mutation-covered. |
| Score >= 85 | **PASS (narrow)** — 86/100. |
| Evidence reviewable | **PARTIAL** — 4/4 contract, 16/18 evidence, 7/7 tests twice, real CLI happy/negative paths reproduced, rehearsal `after` reproduced. But 2 frozen entries are stale, the freeze is partial, and there is no raw command log. Reissue the freeze before real apply. |
| Human approval recorded with explicit scope | **PASS on content** — rehearsal only; real apply not approved; not release; separate approval required. Provenance/timing is P3-10. |
| Real migration pending, no false production claim | **PASS** — `MIGRATION.md:3-4`, `HUMAN-APPROVAL.md:9-10`, `POST-DEPLOY.md`; installed profile 0.7.0, repo 0.8.0, no v0.8 tag. |
| **Overall** | **PASS (narrow) — 86/100; not authorization for the real apply.** |

## What changed from round 3

- **Fixed (verified):** the CLI module-path guard now uses `fileURLToPath` +
  `realpathSync`; the suite and direct CLI run from a `/tmp` copy named
  `pack 配置 dir` (7/7, exit 0); symlink invocation still works.
- **Fixed (verified):** `--apply`/`--rollback` write temp-file + `fsyncSync` +
  `renameSync`; real CLI apply/rollback is byte-identical; wrong-backup cases
  still reject with no write.
- **Fixed (verified):** `MIGRATION.md:25` now cites `fef82d83…3052`, which is the
  actual rehearsal pre-hash; the four raw rehearsal JSONs are in
  `EVIDENCE-HASHES.txt` and verify.
- **New regression:** `EVIDENCE-HASHES.txt` was generated 9 seconds before the
  final `REHEARSAL.md`/`RUNLOG.md` edits; 2/18 fail. This is the top P2.
- **Still open:** stale contract text (`MIGRATION.md:45-46`,
  `THREAT-MODEL.md:7`), synthetic target/no loader (P2-4), manual SAST (P2-5),
  untracked/unintegrated pack (P2-6), self-referential binding (P2-7), corrupt
  target recovery (P2-8), and the P3 list.
- **Still the pack's strongest property:** it does not claim a real migration;
  the approval is rehearsal-only, the real apply is blocked, and the installed
  profile remains 0.7.0.

## What would change the verdict

1. Regenerate `EVIDENCE-HASHES.txt` after the final edits and verify **all**
   entries (or a complete, clearly scoped set); include
   `rehearsal/config.json`, the backup, `CONTRACT-HASHES.txt`, and itself, and
   add `scripts/` raw command/exit-code capture. This is the gating fix.
2. Update `MIGRATION.md` and `THREAT-MODEL.md` to match the atomic write, state
   the directory-fsync/corrupt-target residuals, and fix the compatibility
   matrix/idempotency wording.
3. Track/integrate the pack (`test/check.mjs`, `docs/VERIFICATION.md`) or scope
   it explicitly as untracked rehearsal evidence.
4. Run/record SAST/secrets (or risk-accept) and a real-config dry-run or a
   loader-consumability check; document the synthetic fixture.
5. Add an external expected-hash anchor or `--expected-sha256`, and a
   `--force`/manual recovery path for a corrupt target.
6. Reissue the human approval against the final code/evidence, or state
   explicitly that the 14:23 approval covers the plan only and real apply needs a
   new approval.

Real apply remains **pending** regardless: it needs a fresh backup, the target
profile stopped, a separate explicit human approval, verified atomic/durable
write, and the post-deploy checks actually observed. This rehearsal does not
authorize it.

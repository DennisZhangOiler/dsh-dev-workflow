# High-risk score — preset config 0.7 → 0.8 rehearsal (round 2)

- **Reviewer:** `highrisk-reviewer-2` (independent, read-only; not the author or
  test author). Delegated by `lead`; new session, no author transcript.
- **Date/time:** 2026-11-25 14:31–14:36 Asia/Shanghai; Node v22.23.2.
- **Gate:** the request's high-risk/migration gate — **no P0/P1**, reviewable
  evidence, a recorded human approval with an explicit scope, and the real
  migration explicitly **pending** rather than silently passed.
- **Subject:** `docs/e2e/0.8/high-risk/` — 24 files plus one empty `scripts/`
  dir (excluding this `HIGH-RISK-SCORE-R2.md`). Base commit
  `14d31df47bc0548106e0b9726fe33095892f9976`; the whole `docs/e2e/` tree is
  untracked (`git status --porcelain docs/e2e` → `?? docs/e2e/`).
- **Independence:** a separate subagent session with no author transcript. The
  request named the round-1 result (`70/FAIL`, 2 P1), and I read
  `HIGH-RISK-SCORE.md` as the review target's context; I then re-derived every
  claim from the files and independent `/tmp` probes. This is a **re-review**,
  not a blind first review. Caveat: same model family (`deepseek-flash`) as the
  author, so context-independent only, not model-independent; a real apply still
  needs the human code/release review the pack itself withholds.
- **Scope of this score:** the local rehearsal pack and its claims — not
  production readiness, not release approval, not a real migration.

## Verdict

**FAIL — gate not met — 76/100 — 0 P0 / 1 P1 / 9 P2 / 7 P3.**

The round-1 blind-test P1 is genuinely fixed: the new `test/cli.test.mjs`
spawns the real CLI, and mutations that delete the dispatch, the backup write,
or the rollback copy each turn the suite red. The space/unicode source path,
the 9-skill fixture, the backup mode, and the compatibility/cutover sections
are also fixed. The gate still fails on one P1:

**Rollback still does not bind the backup to the pre-migration state.** The
guard at `migrate.mjs:73` only checks `version === 1` and the truthiness of
`preset`; `migrate.mjs:74` then `copyFileSync`s the backup over the source. Any
version-1-shaped object — `{"version":1,"preset":{}}`, `preset:"x"`,
`preset:[]`, or another preset — is accepted, overwrites the config, and exits
0. The only negative test (`test/cli.test.mjs:29-39`) uses `{"wrong":true}`,
which is the trivial non-v1 case. `LOAD-FAILURE.md:9` still claims "backup
mismatch → not silently applied"; that control does not exist. This is the same
"任意 backup 可覆盖" P1 from round 1, narrowed from "any existing file" to "any
version-1-shaped file".

The rehearsal itself used the correct backup and restored byte-identically, so
the happy-path evidence stands; the defect is in the rollback control that the
real apply would rely on. Do not promote the pack to PASS and do not use it to
authorize the real apply until P1-1 is closed and the evidence is reissued.

## Score

| Area | Weight | Score | Assessment |
|---|---:|---:|---|
| Evidence integrity and reproducibility | 25 | **20** | Hashes verify (CONTRACT 4/4, EVIDENCE 12/12), 6/6 CLI+unit tests, happy path independently reproduced, and the new CLI tests are mutation-sensitive. But the evidence freeze is partial (run artifacts, RUNLOG, tests and the backup are not covered), there is no raw command/exit-code log, `MIGRATION.md` cites a stale hash, and one test path is broken for space/unicode pack locations. |
| Backup / apply / rollback correctness | 25 | **17** | Dry-run does not write; apply emits a backup whose SHA-256 equals the pre-image; rollback restored `fef82d83…3052` byte-identically; the backup is now `0600`; a space/unicode source path works. But rollback accepts a wrong version-1 backup (P1-1), and there is no recorded pre-hash/sidecar binding and no fsync/atomic rename. |
| Scope honesty and human approval | 15 | **14** | Rehearsal-only approval is explicit, real apply is not approved, post-deploy is marked not executed, the installed profile is still 0.7.0 while the repo is 0.8.0, and no real preset config was written. Minor deduction: the approval is self-attested and its 14:23 timestamp predates the reissued 14:31 evidence; `docs/VERIFICATION.md` still says no high-risk E2E pack exists. |
| Threat / SCA / SAST / load coverage | 15 | **10** | Threat model covers the right categories and residuals are stated; SCA is trivially clean (no dependencies). SAST/secrets are still manual only; T6's residual is stale now that rollback accepts wrong v1 backups; load/concurrency are honestly unproven. |
| Migration artifact completeness | 10 | **7** | Compatibility matrix, idempotency, cutover, owner/trigger, and "only v1 fixtures tested" are present. Still missing privacy/retention, backfill/dual-run, ordering, and representative real-config data; the matrix overstates `docs.*`/`ui.*` preservation. |
| Reviewability and integration | 10 | **8** | Small, readable, reproducible pack with a partial evidence manifest. But it is untracked, absent from `docs/VERIFICATION.md` and `test/check.mjs`, has no reviewer record, and `scripts/` is empty. |
| **Total** | **100** | **76** | **FAIL — 0 P0 / 1 P1 / 9 P2 / 7 P3.** |

Anchors: 0 = missing/unusable; 50 = present with a material gap; 100 = specific,
measured, task-fit. This total is a gate, not a diagnostic.

## What I actually ran

```sh
cd docs/e2e/0.8/high-risk && node --test
# 6 tests, 6 pass, 0 fail, 0 skipped; exit 0

sha256sum -c CONTRACT-HASHES.txt
# fixtures/config-v1.json: OK
# migrate.mjs: OK
# test/migrate.test.mjs: OK
# test/cli.test.mjs: OK

# EVIDENCE-HASHES parse: 12/12 OK (all 12 listed files match)

sha256sum fixtures/config-v1.json rehearsal/config.json \
  rehearsal/config.json.backup-1795588260074.json
# all three = fef82d830f68b6c0b06870d2aa3c040e9211ac8fadf0259d85fb249784c33052
# apply.json sha256 = fef82d83…3052; rollback.json sha256 = fef82d83…3052
# RESULT before = restored = fef82d83…3052; after = 7634122b…a5a9
# after is reproducible as v2 with migration.at = 2026-11-25T06:31:00.074Z
```

Independent CLI probes, all on `/tmp` copies (source mode and paths varied):

| Probe | Result |
|---|---|
| `--dry-run` | exit 0; v2 printed; source SHA-256 unchanged |
| `--apply` | exit 0; backup path + `sha256` printed; backup SHA-256 = pre-hash; source is v2; backup mode `600`; source mode preserved (`600` stayed `600`) |
| `--rollback` with the emitted backup | exit 0; restored SHA-256 = pre-hash; byte-identical |
| `--rollback` with `{"wrong":true}` | exit 1; source unchanged (covered by `test/cli.test.mjs`) |
| `--rollback` with `{"version":1,"preset":{}}` | **exit 0; source overwritten** |
| `--rollback` with `{"version":1,"preset":"x"}` | **exit 0; source overwritten** |
| `--rollback` with `{"version":1,"preset":[]}` | **exit 0; source overwritten** |
| `--rollback` with `{"version":1,"preset":{"id":"other"}}` | **exit 0; source overwritten** |
| `--rollback` with a missing backup | exit 1; source unchanged |
| `--apply` on a v2 config | exit 1 (`expected config version 1`); no backup |
| `--apply` with an unknown skill | exit 1 (`unknown skill: …`); no backup |
| `--apply` with invalid JSON | exit 1; no backup; source untouched |
| no mode / no source / bogus mode | exit 1; no write |
| source and CLI both under `配置 dir` / `migrate 脚本.mjs` (space+unicode) | apply exit 0, rollback exit 0, byte-identical |

Mutation checks on a fresh `/tmp` copy (repository untouched):

| Mutation | Suite result |
|---|---|
| delete the whole CLI dispatch (`migrate.mjs:81-83`) | **2/6 fail** — the new CLI tests are real |
| remove the backup write (`migrate.mjs:64`) | **1/6 fail** |
| remove the rollback copy (`migrate.mjs:74`) | **1/6 fail** |
| revert the main guard to the old `file://${resolve(argv[1])}` comparison | **6/6 pass** — the suite does **not** catch the round-1 guard regression |

Space/unicode **pack location** check (not source path): copy the pack to
`/tmp/hrisk space 配置.*` and run `node --test` there → **5/6**, with
`CLI apply then rollback on a path with spaces/unicode…` failing as
`Cannot find module '/tmp/hrisk%20space%20%E9%85%8D%E7%BD%AE.../migrate.mjs'`.
The second CLI test passes there for the wrong reason (non-zero due to
module-not-found, source unchanged).

Symlink probe: `ln -s migrate.mjs link.mjs; node link.mjs --dry-run src.json`
→ **exit 0, no output**; `--apply` → exit 0, no output, no backup, source
unchanged.

Scope/profile checks:

- Active profile has `dsh-rd-workflow@0.7.0` installed; the repo is `0.8.0`;
  no preset config with this schema exists under `~/.dsh/profiles`; no recent
  `preset*.json`/`config.json` write under `~/.dsh` at 14:31.
- The rehearsal artifacts were born in `rehearsal/` at 14:31:00 (apply/backup
  `.074Z`, dry-run `.061Z`, RESULT `.112Z`); the approval file is 14:23:57.
- The whole `docs/e2e/` tree is untracked; `docs/VERIFICATION.md:151,158,168`
  still says there is no high-risk/migration E2E pack; `test/check.mjs` does
  not include the pack.

## Findings

### P0 — Blocking

None. No real profile/config was overwritten, no secret was found, and no
real/unauthorized apply was performed. The rehearsal only wrote the pack's own
`rehearsal/config.json` copy and left its backup as an artifact.

### P1 — Major

**P1-1 · Rollback accepts a wrong version-1 backup and overwrites with exit 0;
it is not bound to the pre-migration state.**

`migrate.mjs:69-76`:

```js
if (mode === '--rollback') {
  const backup = args[2]
  if (!backup || !existsSync(backup)) throw new Error('backup required')
  const parsed = JSON.parse(readFileSync(backup, 'utf8'))
  if (!parsed || parsed.version !== 1 || !parsed.preset) throw new Error('backup is not a valid v1 config')
  copyFileSync(backup, src)
  console.log(JSON.stringify({ restored: true, sha256: sha256File(src) }))
  return
}
```

The check is structural only: `version === 1` and a truthy `preset`. A backup
from a different preset, an empty `preset`, or even `preset: "x"` / `preset: []`
passes and replaces the source. I reproduced all four cases with exit 0 and an
overwritten source (see the probe table). `--apply` records no pre-migration
hash in the v2 `migration` metadata (only `from` and `at`), writes no sidecar,
and `--rollback` never compares a hash. `LOAD-FAILURE.md:9` says "backup
mismatch → not silently applied"; that is false. The only negative test
(`test/cli.test.mjs:29-39`) uses `{"wrong":true}`, i.e. the easy non-v1 case,
and it does not assert the specific error.

The rehearsal used the backup emitted by `--apply` and the restored bytes are
`fef82d83…3052`, so the happy-path result itself stands. The defect is the
control, not the recorded run. Fix: record the pre-migration SHA-256 (a sidecar
next to the backup or a `migration.backupSha256` field in the v2 source), check
the full v1 schema (not just `version`/truthiness), check the preset id, refuse
with a non-zero exit on mismatch, and add CLI tests for a wrong-but-valid v1,
empty/string/array `preset`, another preset, and a hash mismatch.

### P2 — Moderate

**P2-1 · The CLI test helper breaks when the pack itself is under a
space/unicode path, and the suite still does not cover the actual round-1
guard regression.** `test/cli.test.mjs:8` uses
`path.resolve(new URL('../migrate.mjs', import.meta.url).pathname)`; `.pathname`
is percent-encoded, so from `/tmp/hrisk space 配置.*` the test cannot find the
module (`%20`/`%E9…`). Run from the normal repo path, it passes. Conversely,
mutation B (revert `migrate.mjs:81` to the old `file://${resolve(...)}`
comparison) leaves **6/6 green** because the test only puts the *source* in a
space/unicode dir; the CLI path itself is space-free. The code fix works (I ran
the CLI from a `配置…/migrate 脚本.mjs` path: apply and rollback byte-identical),
but the committed test would not catch that regression. Also, the non-v1 test
passes for the wrong reason if the CLI cannot be spawned at all: it only asserts
`status !== 0` and an unchanged source. Fix: `fileURLToPath`, assert the error
message, and add a test that runs the CLI (or the whole suite) from a
space/unicode directory.

**P2-2 · A symlinked CLI invocation is a silent no-op (exit 0, no output).**
`migrate.mjs:81` compares `pathToFileURL(resolve(process.argv[1]))` with
`import.meta.url`; `resolve` does not resolve symlinks, while Node's ESM loader
uses the real path. `ln -s migrate.mjs link.mjs; node link.mjs --dry-run src.json`
exits 0 with empty stdout; `--apply` exits 0, prints nothing, writes no backup,
and leaves the source unchanged. This is the same "exit 0 without doing the
operation" class as the closed space-path P1-2a. It is an edge case — the
runbook invokes `node migrate.mjs` directly, not via a symlink — so I keep it
P2, but it should be fixed with `realpathSync` or a loud failure. Add a test.

**P2-3 · Nested unknown v1 fields are still silently dropped, and the
compatibility matrix overstates preservation.** `migrateV1toV2` emits a fixed
shape (`migrate.mjs:31-37`). I ran it on a v1 with `preset.description`,
`docs.research`, and `ui.theme`: all three disappeared with no warning.
Top-level unknown keys are now rejected (`migrate.mjs:24`), which is better, but
nested extras are not. `MIGRATION.md:34-35` says "docs | docs.* | conventions.*
| optional values preserved" and `ui.rubric`; only `docs.conventions`,
`docs.delivery`, and `ui.rubric` are mapped. If the real 0.7 schema carries any
other nested field, this is silent data loss; if it does not, that is unproven.
Fix: a field-level 0.7→0.8 allowlist/diff (preserve, map, or reject unknown
nested fields) and a dry-run diff against a real-config copy.

**P2-4 · `LOAD-FAILURE.md`'s evidence mapping is still inaccurate.** Lines 5–9
cite "test `dry-run`/CLI failure path" for invalid JSON, `migrate.test.mjs` for
version-2/unknown-skill, "CLI guard" for missing backup, and "rehearsal hash
compares" for backup mismatch. The suite has no CLI invalid-JSON, version-2,
unknown-skill, or missing-backup test; those are in-process or manual. The
backup-mismatch row is false in the wrong-but-valid-v1 sense (P1-1). The
behaviours are real when I ran the CLI manually (invalid JSON/unknown skill/v2
exit 1 before write), so this is an evidence-mapping defect, not a behaviour
defect. Fix: add the CLI failure tests and correct the table, or label the rows
manual.

**P2-5 · The evidence freeze is partial and there is no raw run log.**
`EVIDENCE-HASHES.txt` verifies 12/12, but it does not cover `RUNLOG.md`,
`rehearsal/apply.json`, `rehearsal/rollback.json`, `rehearsal/dry-run.json`,
`rehearsal/config.json`, the backup, `test/migrate.test.mjs`,
`test/cli.test.mjs`, `CONTRACT-HASHES.txt`, or itself. `scripts/` exists but is
empty; there is no captured command/exit-code log. `rehearsal/RESULT.json`
records no timestamp, command, or exit code; its `after` hash is time-dependent
— I reproduced it only at `2026-11-25T06:31:00.074Z`, which the file does not
record. Fix: hash the full evidence set, capture raw command/exit-code output,
and record the apply timestamp and commands.

**P2-6 · `MIGRATION.md` still cites the previous fixture's hash.**
`MIGRATION.md:25` says "The rehearsal restored `1fbbcadd…1374`
byte-identically". The reissued fixture/restored/backup hash is
`fef82d83…3052`; `RUNLOG.md:8` and `REHEARSAL.md:9` use the new hash. An
operator following the rollback verification section would compare against a
hash that never matches. Fix: update the line to `fef82d83…3052` or reference
the SHA-256 printed by `--apply` rather than a fixed example.

**P2-7 · The pack is untracked and not integrated; `docs/VERIFICATION.md`
contradicts its existence.** `git ls-files docs/e2e/0.8/high-risk` → 0;
`git status --porcelain docs/e2e` → `?? docs/e2e/`. `docs/VERIFICATION.md:151`
says "There is still no high-risk/migration E2E pack", `:158` says "A full
high-risk/migration E2E pack was not run in this window", and `:168` says "there
is no high-risk/migration E2E". `test/check.mjs` does not include the pack.
There is no reviewer record in the pack (role/session/model/prompt hash/input
hash/verdict). This R2 file is a context-independent review, but it is not
model-independent and is not integrated. Fix: track/integrate the pack, update
`docs/VERIFICATION.md`, add it to `test/check.mjs`, or explicitly scope it as
an untracked rehearsal.

**P2-8 · SAST/secrets are still manual only.** `SAST.md:9` admits "no full SAST
tool run"; no secrets scanner was run. I found no `eval`/`Function`/
`child_process` in `migrate.mjs` and no secret-like strings in the fixtures,
and `package.json` has no dependencies (so SCA is trivially clean), but the
high-risk gate says SAST/secrets/SCA must be executed. Fix: run a scanner (or
record an explicit tool-unavailable risk acceptance) and scan for secrets.

**P2-9 · `MIGRATION.md` is better but still short of the project's contract.**
It now has a compatibility matrix, idempotency, cutover, owner/trigger, and an
honest "only v1 fixtures tested; real 0.7 profile not loaded". It still lacks
privacy/retention, backfill/dual-run (only "no dual-write"), ordering, and a
rehearsal on representative real-config data. The compatibility matrix's
`docs.*`/`ui.*` rows overstate what is preserved (P2-3). Fix: add those
sections or mark them N/A with a reason.

### P3 — Minor

- **P3-1 · Approval provenance and timing.** `HUMAN-APPROVAL.md:6` says the
  approval time is 14:23; the file mtime is 14:23:57, while the reissued
  rehearsal artifacts are 14:31:00. The scope is correct (rehearsal only; real
  apply blocked; not release), but the approver could not have reviewed the
  reissued 9-skill/CLI evidence. The approval is self-attested prose with no
  linked message or signature. Acceptable as a rehearsal record; not sufficient
  as a real-apply approval.
- **P3-2 · `RUNLOG.md` timestamp/scope wording.** It says 14:23 and "temp
  copies only"; the artifacts were born in `rehearsal/` at 14:31. The target is
  a copy and no real config was touched, but the log's timestamp and "temp"
  wording do not match the generated artifacts.
- **P3-3 · `PLAN.md:28` still says "all 4 tests pass".** The suite is 6 tests;
  the stale gate rule is minor but is itself a contract number.
- **P3-4 · `RESULT.json` is minimal.** It has before/after/restored/backup/
  byteIdentical, but no commands, exit codes, or timestamp; `after` is
  time-dependent and not reproducible without the apply `at`.
- **P3-5 · The dry-run artifact is not byte-reproducible.** `migration.at` is
  wall-clock (`migrate.mjs:21,36`), so `rehearsal/dry-run.json` changes every run;
  only its semantic fields and the config hashes can be replayed. It is not in
  `EVIDENCE-HASHES.txt`, so no false hash claim is made, but it is not frozen.
- **P3-6 · No fsync/atomic rename; backup left beside the source.** `--apply`
  writes the backup and then the source directly (`migrate.mjs:64-65`). T3 is
  medium, and `MIGRATION.md:45-46` says a production migration must add
  fsync/atomic write. The backup stays in `rehearsal/`; the real-apply plan says
  keep it outside the target. This blocks real apply, not the rehearsal.
- **P3-7 · Small contract/evidence gaps.** `POST-DEPLOY.md:7` says "all 9
  skills register" but gives no command or expected output; the no-args CLI
  error is "source path required" rather than a mode usage error; `scripts/` is
  empty despite the raw-log gap. Minor.

## Per-file check (the files named in the request)

| File | Result |
|---|---|
| `PLAN.md` | Gate sequence and rehearsal-only scope are correct. Decision rule (`:28`) still says 4 tests; real-config representativeness and a field-level diff are still missing (P2-3/P2-9). |
| `THREAT-MODEL.md` | Covers T1–T8 with residuals. T6's "test proves byte-identical" is now true for the happy path, but the wrong-v1 rollback path makes T6's "low" residual optimistic; T4's "SAST scan" is manual. |
| `SCA-LICENSE.md` | Correct: the pack and repo have no dependencies; no network/license obligation. |
| `SAST.md` | Honest but manual only; "no full SAST tool run" (`:9`) means the high-risk SAST/secrets gate is not executed (P2-8). No dangerous constructs found in `migrate.mjs`. |
| `LOAD-FAILURE.md` | Behaviours mostly correct; the evidence column is still inaccurate and the "backup mismatch" row is false for a wrong-but-valid v1 (P1-1/P2-4). Concurrency/load are honestly unproven. |
| `REHEARSAL.md` | The 6/6 test count and `fef82d83…3052` byte-identical result are true; limitations (temp copy, no fsync, no concurrency, no real install) are honest. It still cites "temp copy" while the artifacts were born in `rehearsal/` (P3-2). |
| `MIGRATION.md` | Status is correctly "rehearsal only; pending"; compatibility/cutover/idempotency/owner are new and useful. The rollback example hash is stale (P2-6), the matrix overstates preservation (P2-3), and the contract is still short (P2-9). |
| `HUMAN-APPROVAL.md` | Scope is explicit and correct: rehearsal only; real apply blocked; separate approval required; not release. Provenance/timing is P3-1. |
| `POST-DEPLOY.md` | Clearly marked "not executed"; no production claim. "All 9 skills register" has no command/expected output (P3-7). |
| `rehearsal/RESULT.json` | Before = restored = `fef82d83…3052`; backup identical; after `7634122b…a5a9` is reproducible at `06:31:00.074Z`. Minimal, time-dependent record (P3-4). |
| `test/migrate.test.mjs` | The old `backup + apply + rollback` test (`:41-53`) is still blind/in-process; it is now redundant rather than the only evidence. Rename or remove it so it does not overclaim. |
| `test/cli.test.mjs` | Real CLI spawn; mutation-sensitive for dispatch/backup/rollback. Only non-v1 backup covered; `.pathname` breaks under a space/unicode pack path; no wrong-but-valid-v1, symlink, or CLI-path-space test (P1-1/P2-1/P2-2). |
| `EVIDENCE-HASHES.txt` | 12/12 verify, but partial coverage (P2-5). |

## Unproven / not executed

- **Real 0.7 preset config / real 0.8 loader:** not exercised. The 9-skill
  fixture matches the shipped 9 (`index.js:31-100`), and `MIGRATION.md:40`
  honestly says only v1 fixtures were tested, but no real persisted 0.7 config
  was loaded or diffed. This is the main representativeness gap.
- **fsync / atomic rename / crash-during-write:** not implemented or tested;
  T3 is medium. Blocks real apply, not the rehearsal.
- **Concurrency / exclusive lock / load:** not simulated; no throughput claim.
- **SAST / secrets scanner / SCA tool:** not run; SCA is clean by inspection
  (no dependencies).
- **Wrong-backup, symlink, and space/unicode CLI-path rollback:** wrong-backed
  v1 and symlink are proven defects (P1-1/P2-2); the pack's tests do not cover
  them.
- **Human approval authenticity:** not independently verifiable from the pack
  (P3-1).
- **Real apply / post-deploy smoke / monitoring / abort trigger:** not executed;
  `HUMAN-APPROVAL.md:9-11` blocks real apply and `POST-DEPLOY.md:12` says not
  executed.

## Gate checklist

| PASS condition | Result |
|---|---|
| No P0/P1 | **FAIL** — 1 P1 (P1-1: rollback accepts a wrong version-1 backup and overwrites with exit 0; no pre-hash binding). |
| Evidence reviewable | **PARTIAL** — hashes verify, 6/6 tests pass, the CLI tests are real/mutation-sensitive, and I reproduced the happy path (dry-run no write, apply backup = pre-hash, rollback byte-identical, space/unicode source path). But the P1 control is untested, the evidence freeze is partial, `MIGRATION.md` has a stale hash, and the space/unicode test helper is broken. |
| Human approval recorded with explicit scope | **PASS on content** — rehearsal only; real apply not approved; not release; separate approval required. Provenance/timing is P3-1. |
| Real migration pending, no false production claim | **PASS** — `MIGRATION.md:3-4` says rehearsal only and pending; `HUMAN-APPROVAL.md:9-11` blocks real apply; `POST-DEPLOY.md:12` says not executed; installed profile is 0.7.0 while the repo is 0.8.0. This remains the pack's strongest property. |

## What changed from round 1

- **Fixed:** the blind apply/rollback test — the new `test/cli.test.mjs` spawns
  the CLI and is mutation-sensitive (deleting the dispatch/backup/rollback code
  turns it red).
- **Fixed:** space/unicode **source** paths and the strict main guard
  (`pathToFileURL`); I verified apply/rollback from a space+unicode source and
  CLI path.
- **Partially fixed:** bad-backup rejection — non-v1 objects are rejected, but
  wrong version-1-shaped objects are still accepted (P1-1).
- **Fixed:** the fixture now carries the shipped 9 skills; `SKILL_MAP` maps all
  nine; the backup is created `0600`; `MIGRATION.md` has compatibility/cutover/
  idempotency/owner; `EVIDENCE-HASHES.txt` was added.
- **Still open:** P1-1; the test-path/CLI-path gap; symlink no-op; nested field
  drop; stale `MIGRATION.md` hash; partial evidence freeze; untracked/not
  integrated; manual SAST; contract gaps; approval provenance.

## What would change the verdict

1. Fix P1-1: record the pre-migration hash, validate the full v1 shape and
   preset id, refuse non-zero on mismatch, and add CLI tests for a wrong-but-
   valid v1, empty/string/array `preset`, another preset, and a hash mismatch.
2. Fix the CLI test to use `fileURLToPath` and run from a space/unicode path;
   assert the specific error for a rejected backup; add a symlink test and a
   `realpathSync`/loud-failure fix for the main guard.
3. Add a field-level 0.7→0.8 allowlist/diff and a real-config dry-run (or
   explicitly mark the fixture synthetic and the real config out of scope).
4. Freeze the full evidence set (RUNLOG, apply/rollback/dry-run, config, backup,
   tests, this file), capture raw commands/exit codes, and record the apply
   timestamp/`after` hash.
5. Update the stale `MIGRATION.md` hash and `PLAN.md` test count; correct
   `LOAD-FAILURE.md`'s evidence column; state the approval's reissue timing.
6. Track/integrate the pack in `docs/VERIFICATION.md`/`test/check.mjs`, update
   T6's residual, run or risk-accept SAST/secrets, and add the missing
   privacy/retention/backfill/ordering sections.

Real apply remains **pending** regardless: it needs a fresh backup, the target
profile stopped, a separate explicit human approval, fsync/atomic write, and the
post-deploy checks actually observed. This rehearsal does not authorize it.

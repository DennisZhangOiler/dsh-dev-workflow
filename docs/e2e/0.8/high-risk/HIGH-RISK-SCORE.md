# High-risk score — preset config 0.7 → 0.8 rehearsal

- **Reviewer:** `highrisk-reviewer-1` (independent, read-only; not the author or
  test author). Delegated by `lead`.
- **Date/time:** 2026-11-25 14:24–14:29 Asia/Shanghai; Node v22.23.2.
- **Gate:** the request's high-risk/migration gate — **no P0/P1**, reviewable
  evidence, a recorded human approval with an explicit scope, and the real
  migration explicitly **pending** rather than silently passed.
- **Subject:** `docs/e2e/0.8/high-risk/` — 21 files; input manifest
  `c358c7d3eae26b5ee8753560684c4ba02424c876e58d42a5e6f419430e44cf80`
  (all files except this one; SHA-256 of sorted per-file hashes). Base commit
  `14d31df47bc0548106e0b9726fe33095892f9976`; the pack is untracked.
- **Independence:** a separate subagent session with no author transcript; I
  read the pack, the repository's gate documents and the shipped preset code,
  and re-ran everything on `/tmp` copies. I did not read prior scores for this
  pack (none exist). Caveat: this session is the same model family
  (`deepseek-flash`) as the pack author, so this is **context-independent only,
  not model-independent**; a real apply still needs the human code/release
  review the pack itself withholds.
- **Scope of this score:** the local rehearsal pack and its claims — not
  production readiness, not release approval, not a real migration.

## Verdict

**FAIL — gate not met — 70/100 — 0 P0 / 2 P1 / 7 P2 / 4 P3.**

The rehearsal itself is largely honest and its happy path is real: no user
profile/config was written, the restoration is byte-identical, the human
approval is explicitly limited to the rehearsal, and `MIGRATION.md` /
`POST-DEPLOY.md` leave real apply pending/not executed. The gate still fails on
two P1s:

1. the only test that claims apply/rollback is **blind** — it never invokes the
   CLI, and deleting the entire CLI dispatch leaves 4/4 tests green;
2. **rollback can exit 0 without restoring** (a path containing a space makes
   the CLI a silent no-op) and accepts **any existing file** as the backup with
   no pre-migration-hash check, contradicting `LOAD-FAILURE.md`.

Both are fixable and neither caused a real config write in this rehearsal, but
they are exactly the false-success paths a high-risk migration gate exists to
catch. Do not promote this pack to PASS and do not use it to authorize the real
apply until the P1s, and at least P2-1/P2-2/P2-3, are closed and the evidence is
reissued.

## Score

| Area | Weight | Score | Assessment |
|---|---:|---:|---|
| Evidence integrity and reproducibility | 25 | **17** | Hash chain verifies; happy path independently reproduced. But the core apply/rollback test is blind (P1-1), the evidence files are copies that are not hash-covered, and the run log is prose rather than raw commands/exit codes. |
| Backup / apply / rollback correctness | 25 | **15** | Dry-run does not write; apply emits a backup whose hash equals the pre-image; rollback restored `1fbbcadd…1374` byte-identically. But rollback has two false-success paths (P1-2) and there is no fsync/atomic rename. |
| Scope honesty and human approval | 15 | **14** | Rehearsal-only approval is explicit, real apply is not approved, post-deploy is marked not executed, and no release/install claim is made. Minor deduction for the synthetic fixture not being labelled as a stand-in and for the self-attested approval record. |
| Threat / SCA / SAST / load coverage | 15 | **10** | Threat model covers the right categories and residuals are stated; SCA is trivially clean (no dependencies). SAST/secrets are manual only, the backup widens file mode on a `0600` source, and load/concurrency are honestly not tested. |
| Migration artifact completeness | 10 | **6** | Status/rollback/backup/non-goals are present. The compatibility matrix, dual-run/backfill, idempotency/ordering, cutover verification, owner/trigger and privacy/retention required by `rd-workflow-delivery` and `TEST-PLAN` are missing. |
| Reviewability and integration | 10 | **8** | Small, readable, reproducible pack. But it is untracked, absent from `docs/VERIFICATION.md` and `test/check.mjs`, has no code-review record, and `RESULT.json` is not a run record. |
| **Total** | **100** | **70** | **FAIL — 0 P0 / 2 P1 / 7 P2 / 4 P3.** |

Anchors: 0 = missing/unusable; 50 = present with a material gap; 100 = specific,
measured, task-fit. This total is a gate, not a diagnostic.

## What I actually ran

```sh
cd docs/e2e/0.8/high-risk && node --test
# 4 tests, 4 pass, 0 fail, 0 skipped; exit 0 (run twice, identical)

sha256sum -c CONTRACT-HASHES.txt
# fixtures/config-v1.json: OK
# migrate.mjs: OK
# test/migrate.test.mjs: OK  (3/3)

sha256sum fixtures/config-v1.json rehearsal/config.json \
  rehearsal/config.json.backup-1795587779528.json
# all three = 1fbbcaddb1427079c562283472b548e9b31b6e3cf3c5317ba6fb711987071374
```

Independent reproduction on a fresh `/tmp` copy (source path has no spaces):

```sh
node migrate.mjs --dry-run config.json   # exit 0; source hash unchanged 1fbbcadd…
node migrate.mjs --apply config.json     # exit 0; backup + sha256 1fbbcadd…; src -> v2 8a6632f…
node migrate.mjs --rollback config.json <backup>
# exit 0; restored sha256 1fbbcadd…; byte-identical YES
```

Negative probes (also on `/tmp` copies): invalid JSON → exit 1, source
unchanged; missing backup → exit 1; a true v2 input → exit 1, no backup; an
unknown skill → exit 1, no backup. So the rehearsed happy path is genuinely
byte-identical and the basic guards work.

Scope checks:

- **Only a temp copy was changed.** The run happened in a scratch copy outside
  the repository (`oiler-hub/.tmp/highrisk/`, gitignored); all six common
  rehearsal artifacts in the repo are byte-identical to that run (`cmp` equal),
  and their in-repo birth time (14:23:15) is later than the source mtimes
  (14:22:56–14:23:05). The only **config** writes were the scratch
  `rehearsal/config.json` (v2, then restored) and its backup; the other scratch
  files are captured command outputs.
- **No real config was written.** The active profile still has the installed
  plugin **0.7.0** while the repo is **0.8.0**; there is no preset config with
  `dev-workflow` under `~/.dsh/profiles`; `docs/VERIFICATION.md` still says
  0.8.0 is not installed; no tag/push/install claim. The `rehearsal/config.json`
  in the repo is a post-run copy of the restored fixture, not a CLI write in
  place.
- **The migration target is synthetic.** The repo has no real 0.7 preset config
  with this schema; the shipped preset registers nine skills in `index.js` while
  the fixture carries three. This is acceptable only if the pack is called a
  stand-in drill; it currently is not (see P2-1).

## Findings

### P0 — Blocking

None. No real config was overwritten, no secret was found in the pack, and no
real/unauthorized apply was performed.

### P1 — Major

**P1-1 · The "backup + apply + rollback" test is blind; the CLI is untested.**
`test/migrate.test.mjs:41-52` never imports or spawns `migrate.mjs`; it creates
the backup itself (`:46`), calls the pure `migrateV1toV2`/`validateV2` in memory
(`:47`), writes v2, then writes `before` back itself (`:49`) and asserts it read
what it just wrote. The backup-size assertion (`:51`) is on a file it also wrote.
Mutation proof (fresh `/tmp` copy, repository untouched): deleting the whole CLI
dispatch block `migrate.mjs:70-71` leaves **4/4 tests green**, and
`node migrate.mjs --apply config.json` then exits **0** with no output. The test
suite would not notice a deleted `--apply`/`--rollback`, a missing backup, or a
non-restoring rollback. Yet `THREAT-MODEL.md:10` says "test proves
byte-identical", `PLAN.md:28` gates on "all 4 tests pass", and `REHEARSAL.md:10`
cites "4 tests, 4 pass" as the rehearsal evidence. The rehearsal JSON artifacts
do show a real run and I reproduced the happy path, so the *claim* is true — the
*test evidence* is not. Fix: `spawnSync(process.execPath, ['migrate.mjs',
'--apply', src])` and the rollback command; assert the emitted backup path,
backup hash = pre-hash, post-apply v2, restored bytes, exit codes, and the
negative exits below. Re-run with a mutation that removes the backup write; it
must fail.

**P1-2 · Rollback can report success without restoring, and does not bind the
backup to the pre-migration state.**
Two reproducible false-success paths:

- The main-module guard at `migrate.mjs:70` compares `import.meta.url` with
  `file://${resolve(process.argv[1])}`. On a path containing a space (or
  non-ASCII, which is percent-encoded in `import.meta.url`) the comparison
  fails and **no mode runs**. In a `/tmp` directory named `hrisk space-…`,
  `node migrate.mjs --rollback config.json config.json.backup-manual.json`
  exited **0**, printed nothing, and left the migrated source unchanged. A
  runbook that checks exit codes would record a successful rollback that never
  happened. `--dry-run` and `--apply` have the same silent no-op.
- `--rollback` at `migrate.mjs:60-65` only checks `existsSync(backup)` and then
  `copyFileSync`s it over the source. It never compares the backup against a
  recorded pre-migration hash. I passed `{"wrong":true}` as the backup; the
  command exited **0** and the source became `{"wrong":true}`. `LOAD-FAILURE.md:9`
  claims "backup mismatch → not silently applied"; that control does not exist.

The rehearsed path used a space-free path and the correct backup, so the
byte-identical result itself stands; this is a rollback-failure P1 in the
tool/control, not a contradiction of the happy-path result. Fix: strict main
detection via `pathToFileURL(resolve(process.argv[1])).href`, a usage error and
non-zero exit when no mode matched, a sidecar or recorded pre-hash for the
backup, refusal on mismatch, and tests for space/non-ASCII paths and wrong
backups.

### P2 — Moderate

**P2-1 · The rehearsal is not representative of the shipped preset and the
fixture is not labelled as a stand-in.** `fixtures/config-v1.json:6` carries
three skills; `SKILL_MAP` maps the same three (`migrate.mjs:6-10`); the shipped
preset registers nine (`index.js:31-100`; `docs/TEST-PLAN.md:32` expects nine);
`POST-DEPLOY.md:7` says "all 9 skills register". If the real 0.7 config lists
the shipped nine, six are rejected at `unknown skill` — fail-closed, no data
loss, but the migration never happens; if it lists only three, the other six are
unproven. The repo has no real 0.7 preset config, so this is a synthetic drill;
that must be stated, and a dry-run against a real-config copy (or a 9-skill
fixture) added before the decision rule in `PLAN.md:25-29` can authorize real
apply.

**P2-2 · Unknown v1 fields are silently dropped; no compatibility matrix.**
`migrateV1toV2` (`migrate.mjs:22-28`) emits only `preset.id/name/skillIds`,
`conventions.workflow/delivery`, `ui.rubric` and `migration`. I ran it on a v1
document containing `preset.description`, `docs.research`, `ui.theme` and a
`settings` block: all four disappeared from the v2 output with no warning. If
the real 0.7 schema contains any such field, this is silent data loss; if it
does not, that is unproven. Add a field-level 0.7→0.8 matrix (preserve, map, or
reject unknown fields) and a dry-run diff; silent dropping is not acceptable for
a high-risk migration.

**P2-3 · `MIGRATION.md` is materially thinner than the project's own contract.**
It has status, preconditions, steps, rollback and non-goals, but lacks the
compatibility matrix (old/new readers), backfill/dual-run, idempotency/ordering,
rehearsal on representative data, cutover verification queries, rollback
owner/trigger, and privacy/retention required by `rd-workflow-delivery.md:94-103`
and `docs/TEST-PLAN.md:153-156`. Re-apply is fail-closed (a v2 input is
rejected), but that is neither stated nor tested as the idempotency control.

**P2-4 · Security gates are manual only, and the backup widens permissions.**
`SAST.md:9` admits "no full SAST tool run"; no secrets scanner was run, and
`SCA-LICENSE.md` relies on "no dependencies" (verified true). The skill says
high-risk cannot skip SAST/secrets/SCA (`rd-workflow-delivery.md:16`); 72 lines
with no dependencies limits the risk but does not execute the gate. Separately,
I set the source to `0600` and ran `--apply`: the source stayed `600`, the
backup was created `644`. If a real config ever carries a secret, the backup
widens its readership and is left behind. T4 only checks the fixture. Fix: run a
scanner (or record an explicit tool-unavailable risk acceptance), scan for
secrets, and create the backup with the source's mode (or `0600`).

**P2-5 · Evidence is not frozen; hash coverage is partial and the run artifacts
are copies.** `CONTRACT-HASHES.txt:1-3` covers only the fixture, `migrate.mjs`
and the test; it does not cover `rehearsal/*`, the gate documents, or this
evidence. The six rehearsal artifacts are byte-identical copies of the scratch
run, but they are not hashed. `RESULT.json` is not a run record: no timestamp,
command, exit code, or migrated-source hash, and `appliedCandidate: null` is
unexplained. `RUNLOG.md` is prose. Fix: a manifest over the full evidence set,
raw command/exit-code logs, and remove or explain the field.

**P2-6 · `LOAD-FAILURE.md` evidence mapping is inaccurate.** Lines 5–9 cite
"test `dry-run`/CLI failure path" for invalid JSON and `migrate.test.mjs` for
version-2/unknown-skill/missing-backup; the suite contains only the in-process
version/unknown-skill assertions (`test/migrate.test.mjs:25-28`), no CLI failure
test. The "backup mismatch → not silently applied" row is false (P1-2). The
invalid-JSON/unknown-skill/no-write behaviours are real when I ran them
manually, so this is an evidence-mapping defect, not a behaviour defect. Fix:
add the CLI tests and correct the table; label manual checks manual.

**P2-7 · The pack is untracked and not integrated; no code-review record.**
`git status` shows `?? docs/e2e/0.8/high-risk/`; `docs/VERIFICATION.md:158,168,174`
still says no high-risk E2E was run and that high-risk is "design + static
coverage"; `test/check.mjs` does not include the pack. There is no reviewer
record in the bundle (role/session/model/prompt hash/input hash/verdict) as
`rd-workflow-delivery.md:24-43` requires. This file supplies a context-independent
review, but it is not model-independent and is not linked from the pack; real
apply still needs the human code/release review.

### P3 — Minor

- **P3-1 · The human approval is self-attested prose.** `HUMAN-APPROVAL.md:3-11`
  names the approver role and time, and the scope is exactly right (rehearsal
  only; real apply blocked; not release approval), but there is no linked user
  message, signature, or immutable record; the file's edit time (14:23:57) is
  later than the stated approval minute and the rehearsal (14:22:59). Acceptable
  as a rehearsal record; not sufficient as a real-apply approval.
- **P3-2 · `RESULT.json` is minimal/ambiguous.** It records before/restored/
  backup/byteIdentical, but no apply/rollback source hash, timestamp, commands,
  or exit codes; `appliedCandidate: null` has no definition.
- **P3-3 · The dry-run artifact is not byte-reproducible.** `migration.at` is
  wall-clock (`migrate.mjs:14,27`), so `rehearsal/dry-run.json` changes every
  run; only the semantic fields and the config hashes can be replayed. It is
  not in `CONTRACT-HASHES`, so no false hash claim is made, but it is not a
  frozen artifact.
- **P3-4 · The backup is left beside the source.** `--apply` writes
  `<src>.backup-<ms>.json` in the same directory; T1's "low" residual assumes a
  backup outside the target (`POST-DEPLOY.md:4`) only in the unexecuted plan.
  The backup is never cleaned up, and no fsync/atomic rename is used (also in
  the unproven list).

## Per-file check (the files named in the request)

| File | Result |
|---|---|
| `PLAN.md` | Gate sequence and rehearsal-only scope are correct. Decision rule (`:25-29`) omits real-config representativeness and a field-level diff. |
| `THREAT-MODEL.md` | Covers T1–T8 with residuals, including T3 "medium (no fsync)". T6's "test proves byte-identical" is unsupported (P1-1). T4 does not cover the widened backup mode (P2-4). |
| `SCA-LICENSE.md` | Correct: `package.json` has no dependencies; no network/license obligation. No independent scanner, but the claim is verifiable. |
| `SAST.md` | Honest but manual only; "no full SAST tool run" (`:9`) means the high-risk SAST/secrets gate is not executed (P2-4). No dangerous constructs found (no `eval`/`Function`/`child_process` in `migrate.mjs`). |
| `LOAD-FAILURE.md` | Behaviour mostly correct; evidence column is inaccurate and the "backup mismatch" control is false (P1-2 / P2-6). Concurrency/load are honestly unproven. |
| `REHEARSAL.md` | The happy-path hash and 4/4 test count are true; limitations (temp copy, no fsync, no concurrency, no real install) are honest. It cites the blind test as evidence (P1-1). |
| `MIGRATION.md` | Status is correctly "rehearsal only; pending"; no false real-apply claim. Contract sections are incomplete (P2-3). |
| `HUMAN-APPROVAL.md` | Scope is explicit and correct: rehearsal only; real apply blocked; separate approval required. Provenance is self-attested (P3-1). |
| `POST-DEPLOY.md` | Clearly marked "not executed"; no production claim. "All 9 skills register" is inconsistent with the 3-skill fixture and has no script/expected output (P2-1). |
| `rehearsal/RESULT.json` | Hashes are consistent and true (before = restored = `1fbbcadd…1374`; backup identical); minimal record (P3-2). |

## Unproven / not executed

- **fsync / atomic rename / crash-during-write:** not implemented or tested;
  `--apply` writes the backup and then the source directly
  (`migrate.mjs:55-56`). `THREAT-MODEL.md:7` marks T3 medium and
  `MIGRATION.md:30-31` says a production migration must add these. This blocks
  real apply, not the rehearsal.
- **Concurrency / exclusive lock:** not simulated (`LOAD-FAILURE.md:12-13`);
  the plan says a production migration must be exclusive/offline. Unproven.
- **Post-deploy smoke, monitoring window, abort/rollback trigger:** not
  executed (`POST-DEPLOY.md:12`); it is a plan. The "all 9 skills register"
  check has no command or expected output.
- **Real 0.7 config / real 0.8 loader:** not exercised. No real preset config
  with this schema exists in the repo or profile; the rehearsal is a synthetic
  stand-in (P2-1). A real apply would additionally need a dry-run on a copy of
  the real config and a field-level diff.
- **SAST / secrets scanner / SCA tool:** not run; `SAST.md:9` states this.
  SCA is trivially clean by inspection (no dependencies).
- **Load / large config:** explicitly not benchmarked (`LOAD-FAILURE.md:10-12`);
  no throughput claim is made.
- **Wrong-backup and space/non-ASCII rollback paths:** not in the pack tests;
  I reproduced both failures (P1-2), so these are proven defects, not merely
  unproven.
- **Human approval authenticity:** not independently verifiable from the pack
  (P3-1).

## Gate checklist

| PASS condition | Result |
|---|---|
| No P0/P1 | **FAIL** — 2 P1 (P1-1, P1-2). |
| Evidence reviewable | **PARTIAL** — hashes verify and I reproduced the happy path (dry-run no write, apply backup hash = pre-hash, rollback byte-identical); but the core test is blind, evidence files are not frozen, and the fixture is not representative. |
| Human approval recorded with explicit scope | **PASS on content** — rehearsal only, real apply not approved, not release approval; self-attested provenance (P3-1). |
| Real migration pending, no false production claim | **PASS** — `MIGRATION.md:3-4` says rehearsal only and pending; `HUMAN-APPROVAL.md:9-11` blocks real apply; `POST-DEPLOY.md:12` says not executed. This is the pack's strongest property. |

## What would change the verdict

1. Replace the blind test with real CLI apply/rollback tests (including a
   mutation that removes the backup write and must fail), and record the raw
   command/exit-code output.
2. Fix P1-2: strict main detection (space/non-ASCII), non-zero exit on no mode,
   a recorded pre-hash or backup sidecar, and refusal on mismatch; test wrong
   backup and space paths.
3. Make the rehearsal representative: map all nine shipped skills or document
   the real 0.7 allowlist, add a 9-skill/real-config dry-run, and label the
   fixture as a stand-in.
4. Add the migration contract sections (compatibility matrix, idempotency,
   cutover verification, owner/trigger, privacy) and a field-level diff.
5. Freeze the evidence (hash the full set, raw logs) and integrate the pack into
   `docs/VERIFICATION.md` / the repo's evidence index; record the code-review
   identity/prompt/input hash.
6. Run or explicitly risk-accept SAST/secrets; create backups with the source
   mode.

Real apply remains **pending** regardless: it needs a fresh backup, the target
profile stopped, a separate explicit human approval, fsync/atomic write, and the
post-deploy checks actually observed. This rehearsal does not authorize it.

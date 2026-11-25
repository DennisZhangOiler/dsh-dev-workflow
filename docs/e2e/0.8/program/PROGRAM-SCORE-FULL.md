# Program score FULL — 0.8 readiness service + dashboard consumer

- **Reviewer:** `program-verifier-3` (independent, read-only; not the author)
- **Date:** 2026-11-25 16:02–16:10 Asia/Shanghai, Node v22.23.2, Chrome headless
- **Gate:** `PROGRAM-RUBRIC.md` — five areas (20 each), floors 16, total >= 85,
  no P0/P1, <= 3 unresolved P2.
- **Subject:** the full Program gate in `docs/e2e/0.8/program/`: prior
  contract/isolation evidence plus this round's rubric, architecture, module
  plan, integrated preview and approvals.
- **Approval:** user approved the architecture, module plan and integrated
  preview on 2026-11-25 16:03 (`GATE-APPROVALS.md`); this is a Program-gate
  scoring approval, not release approval. The delegating lead confirmed the
  approval in-session.
- **Independence:** I did not author the pack and had no author transcript. I
  read R2 to enumerate prior findings and re-tested the claims made here. The
  full 23-mutant audit is R2's prior evidence (test files are unchanged since
  R2); I re-ran three representative survivors myself. Probes and the preview
  re-run used `/tmp` copies; the repository was not modified. **Only this file
  was written.**
- **Scope:** this scores the full Program gate, not the UI, research or
  high-risk gates. No live server, production deploy or post-deploy exists and
  none is claimed.

## Verdict

**FAIL — 84/100 — 0 P0 / 0 P1 / 5 P2 / 7 P3.**

- All five areas are at or above their floor (17, 16, 18, 17, 16).
- Total **84 < 85** (one point short).
- No P0/P1.
- **5 unresolved P2 > the 3-P2 cap.**

The P2 cap is decisive on its own: even if a reviewer moved the two floor-scored
areas up one point each (total 86), the five P2 findings below would still block
PASS. The count is also robust to classification disputes: downgrading any one
finding still leaves 4 > 3; only two downgrades would reach the cap. The new
documents and approvals are real progress, but they do not close the prior
contract/evidence P2s; the new artifacts add one new P2 (the UI boundary) and
widen the evidence/freeze one.

## Score

| Area | Weight | Floor | Score | Assessment |
|---|---:|---:|---:|---|
| Architecture / module boundaries | 20 | 16 | **17** | Clear provider/consumer split, explicit data path, purity, ownership and failure boundary. Deducted for the unexercised UI contract in the diagram/module plan (P2-5) and the false "two temp copies" runtime statement (P3-1). |
| Contract tests | 20 | 16 | **16** | 10/10 tests green; provider/consumer negative cases and schema structure are checked. At floor only: schema/runtime divergence (P2-1) and 10/23 surviving mutants (P2-2) remain. |
| Runtime isolation / integration | 20 | 16 | **18** | Real in-process and child-process isolation with separate temp data; integrated preview reproduces byte-identically. Sequential child runs and no preview test are the remaining deductions. |
| Risk / gap honesty | 20 | 16 | **17** | Five scope gaps are explicit; no fake live/publish/deploy claim; `published: false` and active `0.7.0` are true; approval scope excludes deploy/release. Deducted for the unqualified `12/12` preview headline (P2-3) and the UI-boundary contradiction (P2-5). |
| Reproducibility / evidence | 20 | 16 | **16** | Test and hash commands reproduce; run log and contract hashes exist; check/e2e scripts now include the pack. At floor only: the newly approved artifacts are not run-logged, hash-pinned, or documented with a capture command, and the screenshot report names a nonexistent file (P2-4). |
| **Total** | **100** | **>=85** | **84** | **FAIL — total one short and 5 P2 > 3.** |

Anchors: 0 = missing/unusable; 50 = present with a material gap; 100 = specific,
measured, task-fit; 16/20 is the minimum acceptable floor.

## What I actually ran / checked

```sh
cd docs/e2e/0.8/program && node --test
# 10 tests, 10 pass, 0 fail, 0 skipped; exit 0
# per file: provider 2, consumer 3, mutations 1, schema 1,
#           isolation 1, process-isolation 1, integration 1

sha256sum -c CONTRACT-HASHES.txt
# contracts/readiness.schema.json: OK
# provider/evidence-service.mjs: OK
# consumer/dashboard-api.mjs: OK   (3/3)

# repo root, provenance of the fixture's 12/12:
node --test test/plugin.test.mjs test/gates.test.mjs
# 12 tests, 12 pass, 0 fail

# preview reproduction in a /tmp copy:
cp -a docs/e2e/0.8/program/. /tmp/prog-verify-.../
cd /tmp/prog-verify-... && node integration/preview.mjs
# integrated-preview.json  sha256 60f333ed…  byte-identical to committed
# integrated-preview.html  sha256 ae69bbcc…  byte-identical to committed
# second run identical; stdout equals the committed JSON object

# PNG authenticity, rendered from the committed HTML:
google-chrome-stable --headless=new --window-size=1200,900 \
  --screenshot=/tmp/prog-fresh.png file:///.../integration/integrated-preview.html
# /tmp/prog-fresh.png == committed integrated-preview.png:
# sha256 034a321f3bbe5f9afc19ccc6171fdf77ebd35c3de01ab93f38670cd4a50696c3
# 1200x900, pixel diff 0

# representative contract survivors, each in a fresh /tmp copy:
#   remove empty-gates guard; remove gate-id guard;
#   change schema candidate pattern to ^v[0-9]+$
# each run: 10 tests, 10 pass -> the survivors are still uncaught

# repo gate scripts, read-only:
node test/check.mjs          # packaging checks passed
node scripts/verify-e2e.mjs  # 3 packs pass, 4 scores present, hashes verified
```

Independent probes (read-only):

```sh
node --input-type=module -e 'import {assertReadiness} from "./provider/evidence-service.mjs"; ...'
# tests.passed = -1, total = 1   -> runtime ACCEPTED
# candidate = ["0.8.0"]          -> runtime ACCEPTED
python3 (jsonschema draft 2020-12)
# same two payloads            -> schema REJECTS
#   -1 < minimum 0; ["0.8.0"] is not of type "string"
```

I did **not** run a live server, deploy, post-deploy check or container/network
isolation test; those artifacts do not exist in the pack and are explicitly out
of scope in `GAP-LOG.md`/`PROGRAM.md`.

## Which Program gates were actually walked

| Gate | Walked? | Evidence | What is still not proven |
|---|---|---|---|
| Provider/consumer contract + isolation | **Yes** (prior round, re-run) | 10/10 tests, 3/3 hashes, provider→consumer integration, in-process + child-process isolation | Full JSON-Schema conformance at runtime; mutation adequacy; concurrency |
| Rubric | **Yes** (used here) | `PROGRAM-RUBRIC.md` five areas/weights/floors/gate; this score applies them | Version/author/change record (P3-5) |
| Architecture / module boundaries | **Yes, approved at 16:03** | `PROGRAM-ARCHITECTURE.md`; user approval recorded | UI wiring is not exercised; "two temp copies" claim is wrong (P2-5/P3-1) |
| Module plan / write scope / freeze / rollback | **Yes, approved at 16:03** | `PROGRAM-MODULE-PLAN.md`; user approval recorded | Test inventory error and no explicit contract-file owner (P3-2) |
| Integrated preview (provider→consumer→view model) | **Yes, accepted at 16:03** | JSON/HTML/PNG reproduce byte-identically; PNG is a true 1200×900 render; blocked/partial are not turned green | No UI wiring; no logged capture command; fixture/preview not hash-pinned (P2-4) |
| Approvals / scope honesty | **Yes, recorded** | `GATE-APPROVALS.md`: 3 gates approved; deploy/live/release explicitly **not** approved | Approval attribution is a self-authored record without artifact hashes (P3-3) |
| Real deploy / live server / post-deploy | **No** | None exists; `GAP-LOG.md` and `PROGRAM.md` say so | Everything about deployment, live HTTP, observability, container/network isolation, real migration and release remains unproven and is not claimed |

## P0 / P1

**None.** The failure is evidence/coverage at the P2 cap, not a P0 data-loss or
P1 blocked-flow defect. The preview truthfully shows `research` blocked,
`ui-design` ready, `program` partial and `not published`.

## P2 findings (5 unresolved)

### P2-1 · Contract runtime and schema still diverge, and the "agreement" test is structural only (carried from R2 P2-1)

- **Location:** `provider/evidence-service.mjs:18,27`; `contracts/readiness.schema.json`;
  `test/schema.test.mjs:6-21`.
- **Evidence:** the schema declares `tests.passed` `minimum: 0` and
  `candidate`/`activeProfile` `type: "string"`, but the runtime accepts
  `{passed: -1, total: 1}` and `candidate: ["0.8.0"]` (verified above; the
  schema rejects both). `test/schema.test.mjs` asserts selected required keys,
  the status enum and root `additionalProperties`, but never validates the
  fixture or a provider output against the schema, and does not compare
  `pattern`, `minimum`/`maximum`, type arrays, `minItems` or nested
  `additionalProperties`.
- **Impact:** the test title "schema and runtime validator agree" overstates the
  contract; a schema-invalid readiness payload can pass the provider and reach
  the consumer.
- **Fix:** add the missing type/range checks to `assertReadiness` and add the two
  rejected probes as tests (or validate with a real JSON-Schema validator).
- **Re-review:** both probes are rejected; the schema test fails when the
  candidate pattern, test minimum or nested gate extras change.

### P2-2 · Contract mutation coverage is still thin (carried from R2 P2-2)

- **Location:** `test/mutations.test.mjs` (11 table cases against the provider only).
- **Evidence:** R2's 23-mutant audit caught 13 and left 10 survivors, including
  removing the empty-gates check, the gate-id check, the tests integer check, the
  `release.tag`/`release.notes` type checks, the consumer boolean check, and the
  schema `pattern`/`minimum`/nested-`additionalProperties` anchors. The test
  files are unchanged since R2. I re-ran three representative survivors in a
  `/tmp` copy — empty-gates guard removed, gate-id check removed, schema
  candidate pattern changed to `^v[0-9]+$` — and each stayed **10/10 green**.
- **Impact:** a validation branch can be deleted without a failing test; the
  frozen contract is not enforced by tests at the margin.
- **Fix:** add the missing negative cases (and a consumer mutation check), or
  add a real schema validator to the suite.
- **Re-review:** re-run the 23-mutant audit; validation branches have no
  survivors.

### P2-3 · The approved preview still prints an unqualified `Tests: 12/12` while the Program pack runs 10/10 (carried from R2 P2-4)

- **Location:** `provider/data/readiness.json:9`; `test/consumer.test.mjs:18`;
  `integration/integrated-preview.html` / `.json`; `INTEGRATED-PREVIEW.md:7`;
  `PROGRAM.md:30`; `GAP-LOG.md:12`.
- **Evidence:** the fixture says 12/12, the consumer test hard-codes `'12/12'`,
  and the approved preview headline reads `Tests: 12/12`. The pack's own run
  log/summary says 10/10, and `GAP-LOG.md:12` says the score must not exceed
  "the evidence of 10/10 tests". The 12/12 provenance is the repo root suite
  (verified 12/12 above), but no Program doc states that scope.
- **Impact:** a reader of the approved preview reasonably concludes the Program
  pack executed 12 tests; the pack's own evidence limit is 10. This is an
  evidence-honesty defect, not a fake live claim.
- **Fix:** label the preview/fixture as candidate-wide 12/12 (root suite) vs
  Program pack 10/10, or use the pack count in the Program-scoped preview;
  decouple the hard-coded literal from the root suite.
- **Re-review:** no unqualified `12/12` in the approved preview; scopes are
  stated wherever both numbers appear.

### P2-4 · The newly approved preview/approval evidence is not run-logged or hash-pinned (carried from R2 P2-6 and widened)

- **Location:** `RUNLOG.md:3-7`; `integration/integrated-preview-report.json:3`;
  `CONTRACT-HASHES.txt`; `check.mjs:84`; `scripts/verify-e2e.mjs`.
- **Evidence:** `RUNLOG.md` is dated 14:18 and covers only `node --test` and the
  three contract hashes; the integrated preview was generated at 16:01 and the
  approvals recorded at 16:02:50/16:03, after the log. There is no logged
  command for the approved PNG; the report says `"file": "page.png"` (no such
  file), with no timestamp, target path or hash. `CONTRACT-HASHES.txt` covers
  only schema/provider/consumer: changing `provider/data/readiness.json`, the
  preview JSON/HTML/PNG, or any approved document would not fail a hash check.
  `check.mjs` requires the PNG but not the approved HTML/JSON/report;
  `verify-e2e.mjs` still pins `PROGRAM-SCORE-R2.md` + `86`.
- **Important fairness note:** I re-generated the JSON and HTML byte-identically
  with `integration/preview.mjs`, and re-rendered the PNG byte-identically with
  Chrome at 1200×900 (pixel diff 0). The artifacts are authentic; the gap is
  documented reproducibility and freeze coverage, not fabricated output.
- **Impact:** an approved artifact can change without detection, and a fresh
  reviewer cannot reproduce the PNG from the pack's documented commands.
- **Fix:** log the preview and screenshot commands in `RUNLOG.md`, correct or
  delete the stale `page.png` report, add an evidence-hash file for the fixture,
  preview artifacts and approved docs, and make check/e2e require the approved
  HTML/JSON.
- **Re-review:** a fresh copy reproduces all four artifacts from logged
  commands; hashes pass; a fixture/artifact change fails the check.

### P2-5 · Architecture and module plan overclaim the UI boundary

- **Location:** `PROGRAM-ARCHITECTURE.md:13`; `PROGRAM-MODULE-PLAN.md:8`;
  `UI-FREEZE.md:9`; `GAP-LOG.md:6`; `PROGRAM.md:37`; `integration/preview.mjs`.
- **Evidence:** the architecture diagram shows the "UI readiness dashboard
  (A · Ledger)" downstream of the integrated preview, and the module plan gives
  the UI module the contract "dashboard view model". But `integration/preview.mjs`
  generates a standalone HTML page and never imports the UI; `direction-a.html`
  contains no `dashboard-api`/`toDashboard`/`integrated-preview` reference (its
  `readiness` occurrences are page copy only; grep), and both the gap log and
  `PROGRAM.md` say "No UI wiring". `UI-FREEZE.md:9` even
  says the UI freeze "is for the Program integrated preview", which is not true
  of the artifact the user approved.
- **Impact:** the approved architecture/module plan claims a consumer→UI data
  contract that no test or artifact exercises; a reader may believe the UI is
  integrated. The actual approved preview is provider→consumer→generated page.
- **Fix:** mark UI wiring out of scope in the architecture and module plan (and
  remove it as a proven UI contract), or add a real consumer→UI adapter plus a
  test/artifact; align `UI-FREEZE.md` with the scope.
- **Re-review:** docs consistently say "UI not wired; separate UI E2E"; if wired,
  a test proves the UI consumes the view model.

## P3 findings (7, non-blocking)

1. **Architecture precision.** `PROGRAM-ARCHITECTURE.md:20` says "integration
   uses two temp copies"; `integration/preview.mjs` actually reads the single
   `provider/data/readiness.json` — the two temp copies are in
   `test/isolation.test.mjs`/`process-isolation.test.mjs`. `PROGRAM.md:28` still
   calls two in-process calls "two provider instances". The "schema v2" label
   (`PROGRAM-ARCHITECTURE.md:4`) is not encoded anywhere (no version field/$id).
2. **Module-plan inventory and ownership.** `PROGRAM-MODULE-PLAN.md:11-12` says
   "isolation 2, process 1" but `test/isolation.test.mjs` has 1 test; the
   breakdown sums to 11 against the stated total 10 (actual 10/10). The plan has
   no write-scope/owner row for `contracts/readiness.schema.json`; the freeze
   rule mentions re-review but not who may change it.
3. **Approval record precision.** `GATE-APPROVALS.md` was written at 16:02:50
   but records the approval as 16:03; it is an author-written summary without a
   verbatim user message path or hashes of the approved artifacts. I accept the
   approval on the lead's in-session statement, and the scope exclusions
   (deploy/live/release) are correctly stated.
4. **Adjacent UI dependency is stale.** `UI-SCORE-R3.md` is 15:18, but
   `direction-a.html` was changed at 15:27 (the R3 P2-1 text fix) with no
   `UI-SCORE-R4`/delta review. `UI-FREEZE.md:8` says "User preview acceptance:
   pending" while `docs/e2e/0.8/ui/USER-ACCEPTANCE.md:7-8` says the user accepted
   at 16:03. This is not counted in the Program score, but the architecture
   cites UI 91 and the module plan cites the UI freeze; reconcile before freeze.
5. **Rubric governance.** `PROGRAM-RUBRIC.md` has no version, date, author or
   link to the Program skill, despite saying "This rubric is versioned with the
   Program skill; changing weights requires a new review." The table itself is
   consistent (floors sum 80; gate 85; cap 3 P2).
6. **Enforcement/index residual.** `scripts/verify-e2e.mjs` still requires
   `PROGRAM-SCORE-R2.md` and the string `86`, and checks only that a score file
   contains "PASS"; it reports the E2E gate passing even though this full gate
   fails. `docs/VERIFICATION.md` still records the 86 narrow score and "Program
   gate walk-through/waiver still required"; the pack remains untracked
   (`git status: ?? docs/e2e/0.8/program/`). Update the index/script after the
   full gate actually passes.
7. **Consumer decision semantics.** `consumer/dashboard-api.mjs:28` derives
   `decision` only from `release.published`; `published: true` + a blocked gate
   yields `decision: "published"` with a non-empty `blocked` list. It is
   untested and undocumented (R2 called this a residual P3). Either derive the
   decision from both fields or document why publication and gate state are
   independent.

## Prior R2 P2 audit

| R2 finding | Status in FULL | Evidence |
|---|---|---|
| P2-1 schema/runtime divergence | **Open** | P2-1 here; probes reproduce the divergence |
| P2-2 thin mutation coverage | **Open** | P2-2 here; tests unchanged, 10 survivors, 3 representative survivors re-run green |
| P2-3 "two instances" was two in-process calls | **Closed (core)** | `test/process-isolation.test.mjs` is a real child-process test; P3-1 wording remains |
| P2-4 12/12 vs 10/10 with no scope | **Open** | P2-3 here; the preview now repeats it prominently |
| P2-5 consumer decision ignores gates | **Residual P3** | P3-7 here |
| P2-6 no run log/freeze enforcement | **Open, widened** | P2-4 here; new approved artifacts are outside the log/hashes |
| P2-7 no repo evidence integration | **Improved, not closed** | `test/check.mjs` and `verify-e2e.mjs` now include the pack, but `verify-e2e` still pins R2/86 and `docs/VERIFICATION.md` is still narrow (P3-6) |

The new rubric/architecture/module-plan/preview/approval work is additive; it
does not close the contract or evidence P2s. That is why a pack that passed
narrowly at 86 under the old areas now fails the full gate: the new rubric adds
the P2 cap and scores architecture/reproducibility as first-class areas.

## Limits

- No live HTTP server, production deploy, post-deploy monitoring, container/OS
  isolation, real migration or release was executed or claimed; those remain
  unproven and are explicitly out of scope for this local gate.
- The approval attribution is based on the recorded `GATE-APPROVALS.md` and the
  lead's statement; there is no chat log or independent user signature in the
  repository, and the record's timestamp is 10 seconds before the claimed
  approval time (P3-3).
- I verified the PNG is a true render of the committed HTML (byte-identical
  fresh Chrome screenshot), but the pack documents no capture command and the
  screenshot report is stale (P2-4).
- I did not re-score the UI page; the UI 91 cited by the architecture is R3's
  score, and the page changed after R3 (P3-4). One Program reviewer only; no
  second-scorer tie-break.

## Bottom line

**FAIL — 84/100 — 0 P0 / 0 P1 / 5 P2 / 7 P3; all floors met, total one short,
5 unresolved P2 > 3.** The integrated preview is authentic and the approvals
are honestly scoped, but the full Program gate is not met: the prior contract
and `12/12`/run-log P2s remain, and the approved architecture overclaims the UI
boundary. Close at least two P2s, raise reproducibility/evidence enough to
reach 85, fix the stale report/run log and the UI-wiring claim, then re-review.
This is a gate result, not a release approval.

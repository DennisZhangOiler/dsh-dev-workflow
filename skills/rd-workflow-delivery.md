# Verification, independence, and delivery

Use at Phase 6-9 and whenever a verifier, UI scorer, code reviewer, migration,
deploy, or release evidence is needed. This skill defines what counts as proof
and what must not be claimed.

## Verification commands

Before PASS, run and record, as applicable to the project:

```text
test        unit/integration/e2e as defined by the project
lint        configured linter and exit code
typecheck   configured type checker
build       production/CI build, not only dev server
security    SAST, secrets scan, dependency/license (SCA); high-risk cannot skip
```

Do not replace a failing build/typecheck with "unit tests pass". A skipped
command is listed as skipped with the reason, never as passed. If the project
documents CI, record the pipeline ID/URL and wait for a green result; not
observing CI is not a green CI claim.

## Review record and independence

Write `docs/verification/<change>.md`:

```text
REVIEWER RECORD
role / agent-session id / model / provider
prompt hash: SHA-256(system prompt + loaded skills + contract)
input hash: SHA-256(git diff --binary + base commit)
timestamp / independence type / prior verdicts / replacement reason
VERDICT / findings / residual risks
```

Reviewers form their verdict before reading prior verdicts; record prior verdicts
afterward. Same-model independent context is labeled **context-independent only**,
not "independent"; high-risk adopt/migrate/security needs a different model/
provider or human review, otherwise blocked. Keep every REJECT/reason; a second
sequential review of the same input/prompt after REJECT is invalid. Parallel
scorers are calibration, not shopping. A replacement needs a material change and
new input hash, at most once. A user-visible original REJECT is required.

## Code review

For high-risk work, a read-only code reviewer (not author/test author/verifier)
checks security, secrets, concurrency, error paths, data, compatibility, rollback.
Findings close/waive via the user; the record enters PASS. It does not replace
human approval where required.

## Evidence bundle

Include:

- contract and AC traceability matrix;
- diff scope and files changed;
- exact commands, exit codes, raw output/log paths;
- UI screenshots (desktop/mobile; real interactions, not only mockups);
- UI scorer records (scores, P0-P3 findings, re-review), if UI design;
- verifier record: role, identity, model/provider, prompt hash, diff/input hash,
  timestamp, verdict, and all previous verdicts;
- migration/rollback/post-deploy evidence, if applicable;
- user preview/acceptance record.

Keep rejected verdicts. Do not silently spawn a new reviewer until one passes.
If a reviewer is replaced, record why and the original REJECT; high-risk work
requires human code review/release approval, not only an agent verdict.

## Independence

State whether independence is prompt-only or tool-enforced. Same-agent fallback:
low-risk only; label "same-agent fallback, not independent". High-risk work should use a
different model/provider or a human reviewer; otherwise blocked. Reviewers form verdicts before seeing prior ones; the verifier must not be the
author, test author, or UI implementer.

## UI verification

- UI design: independent score after the final implementation; do not reuse the
  Phase 3 direction score as the final score.
- UI behavior: before/after desktop 1440 and mobile 390 screenshots; check
  mobile horizontal overflow, keyboard path, and key actions even without a
  design score.
- UI design: real interaction, 200% zoom/reflow, keyboard, screen reader where
  available, contrast, touch targets; check the project's browser/device matrix.
- If no browser/screenshot capability exists, use the project's browser tooling;
  otherwise stop and ask for evidence. Do not fabricate screenshots or call a
  mockup verified.

## Migration and data

For data/schema/production changes, require a `MIGRATION.md`:

- compatibility matrix (old/new readers/writers);
- backfill/dual-write/dual-read plan, idempotency, ordering;
- rehearsal on representative data, including a restore test of the backup;
- rollback plan and an actual dry-run or rehearsal; rollback owner/trigger;
- cutover, verification queries, and post-cutover observation;
- privacy/retention impact.

A migration is not "done" because code merged or unit tests pass. If rehearsal
is impossible, the release owner must sign a written risk acceptance; the agent
does not sign it.

## Program artifacts

Persist `docs/program/ARCHITECTURE.md`, `FROZEN-UI.md` (score/screenshots),
`GAP-LOG.md` (description/why/decision/approver/score), `modules/<name>.md`, and
`INTEGRATION.md` (contract tests/resources/residue). Runtime-isolation waiver needs
lead approval. Integration checks frozen UI with real long/large/empty data;
changed visuals re-score.

## Migration artifact and release thresholds

Write `MIGRATION.md` (or the project-documented path) with: compatibility
matrix, backfill/dual-run, idempotency/order, rehearsal data, backup-restore
result, rollback dry-run/actual, cutover/verification query, owner/trigger,
privacy/retention. The migration verifier checks this file; notes in chat are not
enough.

For release, define the observation window and thresholds in the contract/NFR
(e.g. errors, p95 latency, saturation) plus abort/rollback triggers. Record the
observed result; "no monitoring configured" is a risk, not a pass. If tools are
missing for high-risk work, block or obtain written user risk acceptance.

## Release and post-deploy

For a deploy/release, record:

- release/deploy identifier, commit, environment, timestamp;
- feature flag/canary/rollout plan when available;
- post-deploy smoke checks and expected results;
- monitoring window (errors, latency, saturation) and abort/rollback trigger;
- rollback owner and exact command;
- result observed, not "should work".

If deployment is undocumented, stop at local patch/documentation and ask once.
Never push a protected branch, merge/deploy with red CI, or claim a deployment
or CI result that was not observed.

## Honest evidence labels

Distinguish:

- **implemented** (code exists);
- **statically tested** (registration/format/strings);
- **exercised end-to-end** (real session/run with artifacts);
- **observed in production** (post-deploy metrics/smoke).

README/VERIFICATION must not promote one level to another. A screenshot of a
plan is not execution evidence; a unit test is not production proof; an internal
PASS is not user acceptance.

## Calibration fixtures

Before trusting a verifier/scorer, run and record these fixtures:

1. Missing AC evidence (tests green, one AC unmapped) -> REJECT.
2. Unit tests green but lint/typecheck/build fails -> REJECT.
3. Migration with no rehearsal/backup-restore/rollback evidence -> REJECT.
4. UI behavior with mobile horizontal overflow or broken keyboard path -> REJECT.
5. A REJECT replaced by a new lenient reviewer without recording the original
   REJECT/reason -> invalid verification; preserve the history.
6. A complete evidence bundle -> PASS.
7. A high-risk change without human code/release review -> REJECT/blocked.

A verifier or scorer that passes a weak fixture is a failed reviewer. Record
fixtures and outputs in `docs/TEST-PLAN.md`/`docs/VERIFICATION.md`; do not claim
end-to-end behavior from a string test.

## Anti-patterns

- "Tests pass" without lint/typecheck/build/CI.
- Verifier as author/test author/implementer, or reviewer shopping.
- Same-agent fallback presented as independent review.
- Migration notes without rehearsal/rollback evidence.
- Deploy without smoke/monitoring/rollback trigger.
- Fabricated screenshots, CI status, deployment IDs, or command output.
- Claiming a release succeeded before observing it.

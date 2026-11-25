# Research review rubric

Use for the two independent research gates. The reviewer is never the author,
experimenter, or synthesizer. Record reviewer identity, model/provider, prompt
hash, and input hash in `REVIEW-LOG.md`. Plan and results reviewers must be
different agents. A reviewer rejected once may not be silently replaced by a
more lenient one; keep every verdict and state any replacement reason.

## Gate 1 - Plan review, before any demo

Inputs: decision frame, user-selected directions with rationale/kill criteria,
experiment plan, slice definition, constraints, proposed artifacts. Coverage of
the **broad direction set** is an R1 pre-check; this gate checks execution of the
user's selected directions. Do not veto the user's choice without new evidence
and an explicit user decision.

Gate: **every area at/above its floor, total >=80, no P0/P1, and at most 3
unresolved P2**. The total is a gate, not a diagnostic.

| Area | Points | Floor | Check |
|---|---:|---:|---|
| Selected-direction execution | 20 | 16 | Each selected direction has 1-3 experiments, falsifier, slice, stop/decision rule; user rationale/kill criteria recorded |
| Decision and metrics | 15 | 12 | Metrics answer the decision; MDE/thresholds/decision rule; success/failure meaning |
| Baseline and controls | 15 | 12 | Real current baseline; same workload/environment/runtime; no strawman |
| Experiment sufficiency | 20 | 16 | Edge/semantic cases; runs/variance/CI; representative slice + exclusions; harness validity |
| Reproducibility/artifacts | 10 | 8 | Commands, versions, seeds, raw data, lockfile/image hash, retention, cleanup |
| Risk/license/safety | 10 | 8 | Dependency/license/CVE, sandbox isolation, credentials, data/security, timebox, stop/abort |
| Reviewability | 10 | 8 | Claims testable; assumptions exposed; executable without invented steps |

Anchors: 0 missing/unusable; 50 present with a material gap; 100 specific,
testable, sufficient. P0 = cannot support the decision; P1 = baseline, metrics,
experiment sufficiency, slice, risk, or evidence design would invalidate a
conclusion; P2 material/fixable; P3 minor.

Verdict `PASS`/`REVISE`; on `REVISE` list blocking findings with exact change and
pass condition. No demo before `PASS`. After two `REVISE` cycles the outcome is
`STOP`/`WAIVER` — the user may change direction, narrow scope, or stop; a waiver
is not PASS, allows no demo, and supports no adopt/migrate conclusion.

## Gate 2 - Results review, before any user-facing conclusion

Inputs, in this order: approved plan, execution logs, raw data, artifacts; the
reviewer first produces an independent `CLAIMS.md` with a hash; only then may it
read the draft memo. It then maps memo claims to extracted claims and raw
evidence, lists memo claims absent from extraction, and lists unused results.

Process audit: commands/environment, baseline fairness, variance/CI, harness
validity, missing runs, cherry-picking, semantic parity, failed/invalid
experiments, slice coverage/exclusions, dependency/manifest changes. Rerun the
decisive experiment or recompute a headline metric for every **adopt/migrate/
security** claim; if impossible, that claim is at most `partial`. Lowering
confidence never turns a single run into `supported`.

Claim table: supported / partial / unsupported, exact allowed wording, evidence,
confidence, rerun command/result. `partial` cannot support adopt/migrate.
Also review **REC-1..n** recommendations: each must cite claim IDs; adopt/migrate
requires all cited claims supported + measured-here + representative slice +
pilot or written risk acceptance + downstream `MIGRATION.md`; any partial cited
means the recommendation is limited to candidate/pilot.

Stamp `memo.md` with a SHA-256 and claim IDs; any later wording change requires
delta re-review, with changed claims/new hash/verdict recorded. Reviewer must
form the verdict before reading prior verdicts. Only after `PASS` may the memo
be user-facing; label mid-results provisional.

Gate: every claim supported or partial-with-limit; no partial supporting
adopt/migrate; every recommendation mapped; no unreviewed memo change.
`REVISE` names missing evidence, rerun/revise/downgrade, and pass condition.
Max two results cycles; then STOP/WAIVER, not silent PASS.

## Explicit feedback rules

Every finding must contain:

1. **Severity** P0/P1/P2/P3 and blocking/non-blocking.
2. **Location** plan section, experiment, artifact, data file, or claim ID.
3. **Evidence** exact file/line, command, number, or quote inspected.
4. **Why it matters** the decision or claim it invalidates.
5. **Required action** exact experiment, metric, comparison, or wording.
6. **Pass condition** what re-review will check.

Forbidden: “improve the plan”, “looks reasonable”, “consider more data”,
“maybe add tests”, or a score without findings. If the reviewer cannot verify
something, mark `REVISE` and name the missing evidence. A non-blocking finding
must say why it does not block the gate. The reviewer does not rewrite the work;
the author revises and requests re-review. Re-review checks changed items and
regressions; the reviewer signs the verdict again.

## Calibration

The author-side fixture manifest and expected outcomes live in
`docs/fixtures/research/README.md` and `expected.json`; a reviewer must not read
them, nor any prior review. Review only the supplied inputs under
`docs/calibration-inputs/` and the frozen prompt/input hashes. Do not assume a
fixture's expected verdict; derive it from the rubric. A review is assessed
against the frozen calibration plan, not against a post-hoc answer key.

## Report templates

Plan review:

```markdown
# Plan review
Reviewer: <id/model/provider>  Input hash: <hash>
Verdict: PASS | REVISE
Score: <n>/100 (gate); unresolved P2: <n>/3
Floors: <area: score/floor/status>
P0/P1 blocking: <none | list>

## Findings
- [P1][blocking] Location: ...
  Evidence: ...
  Why: ...
  Required action: ...
  Pass condition: ...
```

Results review:

```markdown
# Results review
Reviewer: <id/model/provider>  Input hash: <hash>
Verdict: PASS | REVISE

## Process findings
- [P1][blocking] Location: ...
  Evidence: ...
  Required action: ...
  Pass condition: ...

## Claim verdicts
| Claim ID | Claim | Evidence | Status | Allowed wording |
|---|---|---|---|---|

## What cannot be concluded
<limits, missing evidence, next experiment>

## Memo stamp
<claim IDs, hash, delta-review trigger>
```

## Anti-patterns

- Self-review, author/reviewer swapping, or hiding a prior REJECT.
- Reviewing only prose; not raw data, commands, and artifacts.
- Accepting upstream benchmarks as evidence for this project.
- A score with no gate table/residual risks, or a finding with no pass condition.
- Starting demos while plan review is `REVISE`.
- Letting `partial` support adopt/migrate.
- Sending unreviewed conclusions or mid-results to the user.
- Adding a separate migration phase to research; migration belongs to Development.
- Reviewer rewriting the work instead of stating the required correction.

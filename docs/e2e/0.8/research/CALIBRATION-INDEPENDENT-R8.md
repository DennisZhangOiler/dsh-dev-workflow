# Calibration independent review — R8

Reviewer: `calibration-reviewer-9` / `deepseek-flash` / DeepSeek  
Date: 2026-11-25 (Asia/Shanghai)  
Round: R8 independent calibration review  
Rubric: `skills/rd-workflow-research-review.md`  
Prompt SHA-256: `80ccf3b9f6c320932a2e8d3215bd8df8f27ba2f5c9e626a7f05bcdf23513ab13`  
Input set: `docs/calibration-blind/F1` … `docs/calibration-blind/F7`

## Reviewer record

| Field | Value |
|---|---|
| Reviewer ID | `calibration-reviewer-9` |
| Model / provider | `deepseek-flash` / DeepSeek |
| Role | Independent reviewer; not the author, experimenter, or synthesizer |
| Review round | R8 calibration, F1–F7 judged independently |
| Prompt | `skills/rd-workflow-research-review.md` |
| Prompt SHA-256 | `80ccf3b9f6c320932a2e8d3215bd8df8f27ba2f5c9e626a7f05bcdf23513ab13` |
| Inputs | `docs/calibration-blind/F1`–`F7`; individual hashes below |
| Independence | Only the seven blind inputs and the rubric were read. `docs/fixtures/`, `expected.json`, `docs/calibration-inputs/`, prior reviews, and answer keys were not opened. No expected verdict was assumed. |
| Mutation | Inputs were not modified. Post-review SHA-256 values equal the pre-review values. |
| Gate scope | Gate 1 for F1, F2, F6, F7; Gate 2 for F3, F4; reviewer-output validity for F5 |

This record is formatted for copy into `REVIEW-LOG.md`; this review did not edit `REVIEW-LOG.md` itself because the task specifies this report as the output. Plan reviews and results reviews are separate gate types; F5 is not a gate submission, it is a reviewer output being tested for validity.

Calibration exception: this task assigns one reviewer to all seven fixtures. It is a calibration set, not a live plan-plus-results pair. In a live workflow, the plan reviewer and results reviewer must be different agents; that rule is not exercised by this calibration.

## Input and prompt SHA-256

Computed before review and re-checked after writing this report; unchanged.

| Input | SHA-256 | Reviewed as |
|---|---|---|
| `docs/calibration-blind/F1` | `f53937a0ad84895113ddd0b76c8f89890975cb8b5bf37172212abfe3d90dd5b4` | Gate 1 plan |
| `docs/calibration-blind/F2` | `50dc2ed7684350153c23694e8daf398fea008771b14eb73b5ea117ef0a9bad71` | Gate 1 plan |
| `docs/calibration-blind/F3` | `e78789bdb08498cf0c4a46e8bbdf3848e2c86b3d3e15b340505707fb745bd1d2` | Gate 2 results |
| `docs/calibration-blind/F4` | `b236c66a1dc59f59a3aceea63fb4d706a762f0281dc56bae93840bbdf2fcb06c` | Gate 2 results |
| `docs/calibration-blind/F5` | `f2b73c97383b3b5b03c7563b9935a3f1656dfaf6ecfe436457cca9881817ee9a` | Reviewer-output validity |
| `docs/calibration-blind/F6` | `bb4dab4fe14c89b8eaff998558274b59a38d1de7aa01738731625342d45f2204` | Gate 1 plan |
| `docs/calibration-blind/F7` | `bf730d6e766a6ecc35f23e471ca4f8f942f6cc3eaa4ec517e79fadf1742a836f` | Gate 1 plan |
| `skills/rd-workflow-research-review.md` | `80ccf3b9f6c320932a2e8d3215bd8df8f27ba2f5c9e626a7f05bcdf23513ab13` | Review prompt |

Source note: the task supplied `docs/calibration-blind/F1`–`F7`. The rubric's Calibration paragraph names `docs/calibration-inputs/`; only the task-supplied blind copies were opened, and `docs/calibration-inputs/` was not read. This avoids any author-side manifest or answer-key contamination.

## Rules applied

### Gate 1 — plan review

The rubric gate is: every area at/above its floor, total ≥ 80, no P0/P1, and at most 3 unresolved P2. The total is a gate, not a diagnostic. Area scores below are expressed in the area's own points; each floor is 80% of the area's points. A P1 anywhere makes the verdict `REVISE` even if the total is ≥ 80.

| Area | Points | Floor |
|---|---:|---:|
| Selected-direction execution | 20 | 16 |
| Decision and metrics | 15 | 12 |
| Baseline and controls | 15 | 12 |
| Experiment sufficiency | 20 | 16 |
| Reproducibility/artifacts | 10 | 8 |
| Risk/license/safety | 10 | 8 |
| Reviewability | 10 | 8 |

Anchors: 0 = missing/unusable; 50 = present with a material gap; 100 = specific, testable, sufficient. The total score is the sum of area scores and is used only as the gate. The verdict rests on floors and P0/P1/P2 status, not on the exact total.

### Gate 2 — results review

Gate 2 has no numeric score or area floors in the rubric. Its gate is claim-status and recommendation-based: every claim supported or partial-with-limit; no partial supporting adopt/migrate; every recommendation mapped to claim IDs; and no unreviewed memo change. Gate 2 inputs must include the approved plan, execution logs, raw data, and artifacts; the reviewer first produces an independent `CLAIMS.md` with a hash, then may read the draft memo. A single run never becomes `supported` by lowering confidence.

### F5 — reviewer-output validity

F5 is checked against the rubric's explicit feedback rules and anti-patterns: every finding needs severity, location, evidence, why it matters, required action, and pass condition; forbidden phrases include “looks good” and “improve the plan”; a score without a gate table or findings is an anti-pattern; no demo or user-facing conclusion before `PASS`. F5 supplies none of the required material, so it cannot be a valid Gate 1 or Gate 2 review.

## Calibration summary

| Input | Gate/type | Verdict | Score | Floors below | Blocking P0/P1 | Unresolved P2 |
|---|---|---|---:|---|---:|---:|
| F1 | Gate 1 plan | **REVISE** | 6/100 | all 7 | 2 P0, 4 P1 | 1/3 |
| F2 | Gate 1 plan | **REVISE** | 7/100 | all 7 | 5 P1 (plus R1 note) | 1/3 |
| F3 | Gate 2 results | **REVISE** | n/a (unscored gate) | n/a | 5 P1 | n/a |
| F4 | Gate 2 results | **REVISE** | n/a (unscored gate) | n/a | 3 P1 | n/a |
| F5 | Reviewer output | **REVISE** (invalid; must be redone) | 0/100 (missing/unusable) | all unassessable | 3 P0 | 1/3 |
| F6 | Gate 1 plan | **PASS** | 92/100 | none | none | 3/3 |
| F7 | Gate 1 plan | **REVISE** | 84/100 | Decision and metrics (11/15 < 12) | 1 P1 | 3/3 |

Only F6 passes its gate. F1, F2, and F7 fail Gate 1; F3 and F4 fail Gate 2; F5 is not a valid review.

---

## F1 — Gate 1 plan review

Reviewer: `calibration-reviewer-9` / `deepseek-flash` / DeepSeek  
Input: `docs/calibration-blind/F1`  
Input SHA-256: `f53937a0ad84895113ddd0b76c8f89890975cb8b5bf37172212abfe3d90dd5b4`  
Verdict: **REVISE**  
Score: **6/100** (gate); unresolved P2: **1/3**  
P0/P1 blocking: **F1-01, F1-02, F1-03, F1-04, F1-05, F1-06**

| Area | Score | Floor | Status |
|---|---:|---:|---|
| Selected-direction execution | 4/20 | 16 | **FAIL** |
| Decision and metrics | 0/15 | 12 | **FAIL** |
| Baseline and controls | 0/15 | 12 | **FAIL** |
| Experiment sufficiency | 1/20 | 16 | **FAIL** |
| Reproducibility/artifacts | 0/10 | 8 | **FAIL** |
| Risk/license/safety | 0/10 | 8 | **FAIL** |
| Reviewability | 1/10 | 8 | **FAIL** |

Total 6/100 < 80; every floor is below; P0/P1 present → `REVISE`. No demo is permitted.

### Findings

- **F1-01 [P0][blocking]** Location: plan statement, `F1:3-5`.  
  Evidence: “no baseline; … no comparison”. The plan has no current-parser baseline or control and no comparison.  
  Why it matters: a single candidate A demo cannot attribute anything to A, cannot detect a strawman, and cannot support the “choose a parser library” decision.  
  Required action: measure the real incumbent parser and candidate A on the same workload, environment, and protocol; add a pre-parsed/control condition where relevant.  
  Pass condition: a real current baseline and fair comparison are specified; baseline floor ≥ 12/15.

- **F1-02 [P0][blocking]** Location: plan statement, `F1:3-5`.  
  Evidence: “no thresholds” and no decision rule or success/failure meaning.  
  Why it matters: without a threshold, MDE/CI criterion, or decision rule, the evidence cannot choose a parser or reject A.  
  Required action: define the decision metric, threshold/MDE, multiple-run variance/CI, and the adopt/keep/follow-up rule.  
  Pass condition: decision and metrics floor ≥ 12/15; the rule is executable on the measured data.

- **F1-03 [P1][blocking]** Location: plan statement, `F1:3-5`.  
  Evidence: “one run; … no representative slice”. No repetitions, variance, CI, edge cases, or slice definition.  
  Why it matters: one run cannot separate signal from noise, and an unspecified workload cannot support a general parser choice.  
  Required action: run multiple repetitions with variance/CI; define a representative slice and exclusions; include edge/semantic and malformed inputs.  
  Pass condition: experiment sufficiency floor ≥ 16/20.

- **F1-04 [P1][blocking]** Location: plan statement, `F1:3-5`.  
  Evidence: “no raw-data retention”. No commands, versions, seeds, raw data, lockfile/image hash, retention, or cleanup.  
  Why it matters: the result cannot be inspected, rerun, or audited; the plan is not reproducible.  
  Required action: record commands, versions, seeds, immutable raw data, environment, lockfile/image hash, retention, and cleanup.  
  Pass condition: reproducibility floor ≥ 8/10; an independent reviewer can rerun from artifacts.

- **F1-05 [P1][blocking]** Location: selected-direction execution, `F1:4`.  
  Evidence: “run one demo of candidate A”; no experiment set, falsifier, slice, stop/decision rule, user rationale, or kill criteria.  
  Why it matters: the selected direction is not executed as an experiment; there is no way to falsify or stop it.  
  Required action: give the selected direction 1–3 experiments, a falsifier, a slice, a stop/decision rule, the user rationale, and kill criteria.  
  Pass condition: selected-direction execution floor ≥ 16/20.

- **F1-06 [P1][blocking]** Location: whole plan, `F1:1-5`.  
  Evidence: no dependency/license/CVE analysis, sandbox isolation, credentials/data handling, timebox, or stop/abort rule.  
  Why it matters: the risk/license/safety floor is unaddressed; a demo could proceed without a stop condition or dependency review.  
  Required action: add dependency/license/CVE review, sandbox/data handling, timebox, and stop/abort.  
  Pass condition: risk/license/safety floor ≥ 8/10.

- **F1-07 [P2][non-blocking]** Location: whole plan, `F1:1-5`.  
  Evidence: the plan states a decision and a demo but no testable claims or executable steps.  
  Why it does not block separately: F1-01 through F1-06 already block the gate; fixing them necessarily requires a testable plan.  
  Required action: state claims in a form that a reviewer can check against raw evidence.  
  Pass condition: reviewability floor ≥ 8/10.

---

## F2 — Gate 1 plan review

Reviewer: `calibration-reviewer-9` / `deepseek-flash` / DeepSeek  
Input: `docs/calibration-blind/F2`  
Input SHA-256: `50dc2ed7684350153c23694e8daf398fea008771b14eb73b5ea117ef0a9bad71`  
Verdict: **REVISE**  
Score: **7/100** (gate); unresolved P2: **1/3**  
P0/P1 blocking: **F2-01, F2-02, F2-03, F2-04, F2-05**

| Area | Score | Floor | Status |
|---|---:|---:|---|
| Selected-direction execution | 5/20 | 16 | **FAIL** |
| Decision and metrics | 0/15 | 12 | **FAIL** |
| Baseline and controls | 0/15 | 12 | **FAIL** |
| Experiment sufficiency | 1/20 | 16 | **FAIL** |
| Reproducibility/artifacts | 0/10 | 8 | **FAIL** |
| Risk/license/safety | 0/10 | 8 | **FAIL** |
| Reviewability | 1/10 | 8 | **FAIL** |

Total 7/100 < 80; every floor is below; P1s present → `REVISE`. No demo is permitted.

### Findings

- **F2-01 [P1][blocking]** Location: plan statement, `F2:5`.  
  Evidence: “no baseline”. The plan compares D1 to nothing.  
  Why it matters: without the current parser or a control, D1 cannot be shown to improve anything; the baseline floor is failed.  
  Required action: measure the real current baseline and D1 under the same workload, environment, and runtime protocol.  
  Pass condition: baseline and controls floor ≥ 12/15.

- **F2-02 [P1][blocking]** Location: plan statement, `F2:5`.  
  Evidence: “no thresholds”. No metric, MDE, decision rule, or success/failure meaning.  
  Why it matters: the gate cannot decide whether D1 is good enough; any result is unfalsifiable.  
  Required action: define the decision metric, threshold/MDE, variance/CI, and adopt/keep rule.  
  Pass condition: decision and metrics floor ≥ 12/15.

- **F2-03 [P1][blocking]** Location: plan statement, `F2:5`.  
  Evidence: “one run; no thresholds; no slice; no raw data”. No repetitions, variance, CI, representative slice, edge cases, or exclusions.  
  Why it matters: one run is not evidence of a general parser improvement; the slice cannot be assessed.  
  Required action: multiple runs with variance/CI; define the representative slice and exclusions; include edge and malformed inputs.  
  Pass condition: experiment sufficiency floor ≥ 16/20.

- **F2-04 [P1][blocking]** Location: plan statement, `F2:5`.  
  Evidence: “no raw data”. No commands, versions, seeds, artifacts, retention, or cleanup.  
  Why it matters: the result is not reproducible or reviewable.  
  Required action: retain raw data and record commands, versions, seeds, environment, lockfile/image hash, retention, and cleanup.  
  Pass condition: reproducibility floor ≥ 8/10.

- **F2-05 [P1][blocking]** Location: selected-direction execution, `F2:3-5`.  
  Evidence: “User selected only D1 … User rationale: ‘fast’. Plan: D1 only; no baseline; one run; no thresholds; no slice; no raw data.” D1 has no experiment set, falsifier, slice, stop/decision rule, or kill criteria.  
  Why it matters: the user's selected direction is not executed as an experiment; “fast” is a rationale label, not evidence, and there is no falsifier or stop rule.  
  Required action: give D1 1–3 experiments, a falsifier, a slice, a stop/decision rule, and kill criteria; record the user rationale in a testable form.  
  Pass condition: selected-direction execution floor ≥ 16/20.

- **F2-06 [P2][non-blocking]** Location: whole plan, `F2:1-6`.  
  Evidence: no dependency/license/CVE analysis, sandbox/data handling, credentials, timebox, or stop/abort.  
  Why it does not block separately: F2-01 through F2-05 already block the gate; this becomes required when the plan is rebuilt.  
  Required action: add the risk/license/safety and timebox/stop material.  
  Pass condition: risk/license/safety floor ≥ 8/10.

### R1 pre-check note — not a Gate 1 veto

- **R1-01 [P1][non-blocking at Gate 1; blocking for R1]** Location: decision frame, `F2:3-4`.  
  Evidence: the list “omitted the do-nothing option and an obvious existing-library alternative”; the user selected only D1 and gave only the rationale “fast”.  
  Why it matters: the option set is incomplete and the selection basis is not an informed comparison; a “choose a parser” conclusion from D1 alone would be over-scoped. However, coverage of the broad direction set is an R1 pre-check, not this gate: Gate 1 checks execution of the user's selected directions, and the rubric forbids vetoing the user's choice without new evidence and an explicit user decision. This note is therefore not a Gate 1 veto of D1.  
  Required action: return the decision frame to R1/the user with the do-nothing/incumbent option and the existing-library alternative; record the user's decision, rationale, and kill criteria before relying on D1.  
  Pass condition: R1 coverage and the user decision are recorded; Gate 1 still requires all execution floors above.

---

## F3 — Gate 2 results review

Reviewer: `calibration-reviewer-9` / `deepseek-flash` / DeepSeek  
Input: `docs/calibration-blind/F3`  
Input SHA-256: `e78789bdb08498cf0c4a46e8bbdf3848e2c86b3d3e15b340505707fb745bd1d2`  
Verdict: **REVISE**

Score: **n/a** — the rubric defines no numeric score or area floors for Gate 2; the gate is claim-status/recommendation-based. Inventing a /100 score here would be a score without a gate table, which the rubric lists as an anti-pattern.  
Floors: **n/a** — see the Gate 2 checks below; the gate fails.

| Gate 2 check | Result |
|---|---|
| Approved plan + execution logs + raw data + artifacts available | **FAIL** — only a short summary is supplied; raw data were not retained |
| Independent `CLAIMS.md` with a hash before reading the memo | **FAIL** — no `CLAIMS.md` or hash |
| Every claim supported or partial-with-limit | **FAIL** — the general “2x faster” claim is unsupported; a single run is at most partial |
| No partial supporting adopt/migrate | **FAIL** — “recommend adopt” rests on a single run |
| Every recommendation mapped to claim IDs | **FAIL** — no claim or recommendation IDs |
| Memo stamped with SHA-256 and claim IDs | **FAIL** — no memo hash or stamp |

### Process findings

- **F3-01 [P1][blocking]** Location: plan/execution summary, `F3:4`.  
  Evidence: “raw data not retained”.  
  Why it matters: the decisive experiment cannot be rerun or the headline metric recomputed; under Gate 2 an adopt/migrate claim that cannot be rerun is at most `partial`. The raw-data input required by Gate 2 is missing.  
  Required action: retain immutable raw data, execution logs, commands, versions, and environment; rerun or recompute the decisive metric.  
  Pass condition: raw data and a rerun/recompute result are available to the reviewer.

- **F3-02 [P1][blocking]** Location: plan/execution summary, `F3:4`.  
  Evidence: “one run each; no variance/CI”.  
  Why it matters: a single run cannot establish “2x faster”; lowering confidence never turns a single run into `supported`. No variance, confidence interval, or repetition exists.  
  Required action: run multiple repetitions under a defined protocol, report variance and a 95% CI, and define the decision threshold.  
  Pass condition: a CI supports the claimed effect, or the wording is downgraded to a single-run observation and no general speedup is claimed.

- **F3-03 [P1][blocking]** Location: plan/execution summary, `F3:4`.  
  Evidence: “no representative slice”.  
  Why it matters: adopt/migrate requires a measured-here representative slice; an unspecified workload cannot support a general parser choice, and no exclusions are documented.  
  Required action: define the representative slice and exclusions, measure it, and keep the claim within it.  
  Pass condition: representative-slice evidence is present and the claim is limited to it.

- **F3-04 [P1][blocking]** Location: draft conclusion, `F3:5`.  
  Evidence: “X is 2x faster; recommend adopt.”  
  Why it matters: the recommendation cites no supported claims, no representative slice, no pilot or written risk acceptance, and no downstream `MIGRATION.md`; a single run and a partial observation cannot support adopt/migrate.  
  Required action: either downgrade the recommendation to candidate/pilot with exact limits, or supply all cited claims as supported + measured-here + representative slice + pilot/risk acceptance + `MIGRATION.md` before any adopt wording.  
  Pass condition: no adopt/migrate recommendation rests on a single run or a partial claim; the recommendation is mapped to claim IDs and allowed wording.

- **F3-05 [P1][blocking]** Location: whole submission, `F3:1-5`.  
  Evidence: no approved plan, execution logs, raw data, artifacts, independent `CLAIMS.md`, claim IDs, or memo SHA-256/stamp are supplied.  
  Why it matters: the reviewer cannot perform the required mapping from memo claims to extracted claims and raw evidence; there is no memo to stamp or delta-review.  
  Required action: supply the Gate 2 input set in order, produce an independent `CLAIMS.md` with a hash, map memo claims, and stamp the memo.  
  Pass condition: all Gate 2 inputs and the claim mapping are present; any later wording change has a delta re-review.

- **F3-06 [P2][non-blocking]** Location: plan/execution summary, `F3:4`.  
  Evidence: “candidate X vs current baseline” but no baseline fairness protocol (same workload, environment, runtime, warmup, order).  
  Why it does not block separately: F3-01 through F3-05 already block; a fair baseline is still required for confidence.  
  Required action: document the baseline protocol and any paired/alternating order.  
  Pass condition: baseline fairness is documented and auditable.

### Claim verdicts

| Claim ID | Claim | Evidence | Status | Allowed wording |
|---|---|---|---|---|
| C1 | “X is 2x faster” (general speedup) | One run each, no variance/CI, no representative slice, raw data not retained (`F3:4-5`) | **unsupported** | “A single unretained run on an unspecified workload; not a general 2x claim.” |
| C2 | “Recommend adopt” | C1 unsupported; no representative slice, pilot/written risk acceptance, or downstream `MIGRATION.md` (`F3:5`) | **unsupported / not allowed** | “No adopt; at most candidate/pilot after supported, representative evidence.” |

IDs C1/C2 are reviewer-assigned for traceability; the input supplies no claim IDs. The underlying single run is at most a `partial` observation, not a supported claim. It cannot be promoted by confidence language.

### What cannot be concluded

The review cannot conclude that X is faster, that the speedup is 2x, or that X should be adopted. The only permissible description is a single unretained run on an unspecified workload. Before any adopt conclusion: retain raw data and logs, rerun with repetitions and a 95% CI, define and measure a representative slice, produce the independent `CLAIMS.md`, and satisfy the pilot/risk-acceptance/`MIGRATION.md` requirements if adopt wording is retained.

### Memo stamp

No memo SHA-256 or claim IDs are supplied. After revision, stamp `memo.md` with a SHA-256 and claim IDs; any later wording change requires a delta re-review with the changed claims, new hash, and verdict recorded.

---

## F4 — Gate 2 results review

Reviewer: `calibration-reviewer-9` / `deepseek-flash` / DeepSeek  
Input: `docs/calibration-blind/F4`  
Input SHA-256: `b236c66a1dc59f59a3aceea63fb4d706a762f0281dc56bae93840bbdf2fcb06c`  
Verdict: **REVISE**

Score: **n/a** — Gate 2 has no numeric score or area floors in the rubric.  
Floors: **n/a** — see the Gate 2 checks below; the gate fails.

| Gate 2 check | Result |
|---|---|
| Claim is supported or partial-with-limit | **PARTIAL as supplied** — single sandbox run, no representative slice |
| No partial supporting adopt/migrate | **FAIL** — the draft memo recommends adopt |
| Every recommendation mapped to claim IDs | **FAIL** — no claim or recommendation IDs |
| Adopt/migrate has all cited claims supported + measured-here + representative slice + pilot/written risk acceptance + downstream `MIGRATION.md` | **FAIL** — none of these are shown |
| Memo stamped with SHA-256 and claim IDs | **FAIL** — no stamp |

### Process findings

- **F4-01 [P1][blocking]** Location: draft memo, `F4:4`; claim status, `F4:3`.  
  Evidence: “One supporting claim is `partial` … Draft memo: ‘Recommend adopt.’”  
  Why it matters: the rubric states explicitly that any partial cited means the recommendation is limited to candidate/pilot; partial cannot support adopt/migrate. The memo's adopt wording directly violates the gate.  
  Required action: downgrade the recommendation to candidate/pilot with the partial claim's limits, or obtain supported evidence that satisfies every adopt requirement before using adopt wording.  
  Pass condition: no partial claim supports adopt/migrate; the recommendation is candidate/pilot only, or all cited claims are supported and the adopt evidence package is complete.

- **F4-02 [P1][blocking]** Location: claim status, `F4:3`.  
  Evidence: “single sandbox run, no representative slice”.  
  Why it matters: adopt/migrate requires all cited claims supported + measured-here + a representative slice + a pilot or written risk acceptance + downstream `MIGRATION.md`. A single sandbox run does not establish measured-here representativeness, and no pilot/risk acceptance/`MIGRATION.md` is present.  
  Required action: if adopt is intended, add a representative slice, supported reruns, a pilot or written risk acceptance, and a downstream `MIGRATION.md`; otherwise limit the recommendation to candidate/pilot.  
  Pass condition: the full adopt evidence package exists, or the memo is limited to candidate/pilot.

- **F4-03 [P1][blocking]** Location: whole submission, `F4:1-4`.  
  Evidence: no independent `CLAIMS.md` with a hash, no claim IDs, no recommendation IDs, and no memo SHA-256/stamp.  
  Why it matters: the reviewer cannot verify which claim supports the adopt recommendation or perform the required claim mapping; any later memo wording change cannot be delta-reviewed.  
  Required action: produce the independent `CLAIMS.md`, cite claim IDs in the memo, map the recommendation, and stamp the memo.  
  Pass condition: claim and recommendation mapping is complete; the memo hash and claim IDs are recorded.

- **F4-04 [P2][non-blocking]** Location: draft memo wording, `F4:4`.  
  Evidence: the memo says only “Recommend adopt” and omits the partial claim's allowed wording and single-sandbox/no-slice limit.  
  Why it does not block separately: F4-01 through F4-03 already block; the omission is material to accuracy but is subsumed by the recommendation violation.  
  Required action: carry the exact allowed wording and limits into the memo.  
  Pass condition: the memo's wording matches the claim's status and limits.

### Claim verdicts

| Claim ID | Claim | Evidence | Status | Allowed wording |
|---|---|---|---|---|
| C1 (supporting claim; ID not supplied) | Supporting claim | Single sandbox run, no representative slice (`F4:3`) | **partial** | “Partial: single sandbox run, no representative slice; descriptive/candidate-pilot only.” |
| REC (recommendation; ID not supplied) | “Recommend adopt” | The supporting claim C1 is partial; no supported claims + representative slice + pilot/risk acceptance + `MIGRATION.md` (`F4:3-4`) | **unsupported / not allowed** | “Not adopt; candidate/pilot only until supported, representative evidence plus pilot/risk acceptance and `MIGRATION.md`.” |

IDs C1/REC are reviewer-assigned for traceability; the input supplies no claim IDs.

### What cannot be concluded

The review cannot conclude that adoption is justified. The partial claim can support only candidate/pilot status with its limits. Any adopt conclusion requires all cited claims supported and measured here, a representative slice, a pilot or written risk acceptance, and a downstream `MIGRATION.md`; none are shown.

### Memo stamp

No memo SHA-256 or claim IDs are supplied. After revision, stamp the memo and record the claim IDs; any later wording change requires a delta re-review.

---

## F5 — Reviewer-output validity review

Reviewer: `calibration-reviewer-9` / `deepseek-flash` / DeepSeek  
Input: `docs/calibration-blind/F5`  
Input SHA-256: `f2b73c97383b3b5b03c7563b9935a3f1656dfaf6ecfe436457cca9881817ee9a`  
Verdict: **REVISE** (invalid review; must be redone by a qualified independent reviewer)

Score: **0/100** under the rubric's “missing/unusable” anchor. This is a validity score for the review output, not a plan score.  
Floors: **all unassessable / fail** — no gate table, no area evidence, and no claim table.

| Plan-gate or results-gate check | Result |
|---|---|
| Gate table with area scores and floors | **ABSENT** |
| Findings with severity/location/evidence/why/action/pass condition | **ABSENT** |
| Claim table or plan evidence inspection | **ABSENT** |
| Reviewer identity/model/provider/prompt/input hashes | **ABSENT** |
| Memo stamp / delta-review trigger | **ABSENT** |
| Verdict derived from evidence | **ABSENT** — “Ship it” contradicts any valid gate |

### Findings

- **F5-01 [P0][blocking]** Location: entire output, `F5:3`.  
  Evidence: “Looks good. 90/100. Ship it.” It contains no findings, no gate table, no floors, no P0/P1/P2 classification, no location/evidence/why/action/pass condition, and no claim table.  
  Why it matters: this violates the rubric's explicit feedback rules and anti-patterns (“looks good”, a score without a gate table or findings); it cannot support any gate verdict and cannot be assessed against Gate 1 or Gate 2.  
  Required action: discard this output; a qualified independent reviewer must produce a complete Gate 1 or Gate 2 review with the required sections and source-backed findings.  
  Pass condition: a complete formatted review exists, with a gate table/floors or claim table, findings with all six required elements, and a verdict derived from evidence.

- **F5-02 [P0][blocking]** Location: entire output, `F5:3`.  
  Evidence: no reviewer ID, model/provider, prompt hash, input hash, commands, raw-data inspection, or `REVIEW-LOG.md` entry.  
  Why it matters: the output is unverifiable and unauditable; a reviewer cannot tell what was reviewed, with which rubric, or on what evidence. The rubric requires reviewer identity, model/provider, prompt hash, and input hash.  
  Required action: record reviewer identity/model/provider, prompt SHA-256, input SHA-256, and the evidence actually inspected; if Gate 2, produce the independent `CLAIMS.md` first.  
  Pass condition: the reviewer record and evidence trail are complete and reproducible.

- **F5-03 [P0][blocking]** Location: output conclusion, `F5:3`.  
  Evidence: “Ship it.”  
  Why it matters: it authorizes release with no `PASS`, no gate table, and no claim verification. The rubric says no demo before `PASS` and only after `PASS` may the memo be user-facing; a waiver is not `PASS` and supports no adopt/migrate conclusion.  
  Required action: withdraw the ship recommendation; no demo, release, or user-facing conclusion until a qualified review returns `PASS`.  
  Pass condition: a valid `PASS` with evidence precedes any ship/release decision.

- **F5-04 [P2][non-blocking]** Location: score, `F5:3`.  
  Evidence: “90/100” with no scoring table, area scores, or resolved-risk count.  
  Why it does not block separately: F5-01 through F5-03 already invalidate the output; an unsupported score adds no information and cannot be compared to a gate.  
  Required action: remove the score until it is derived from an explicit gate table with floors and residual risks.  
  Pass condition: every score is traceable to the gate table and findings.

---

## F6 — Gate 1 plan review

Reviewer: `calibration-reviewer-9` / `deepseek-flash` / DeepSeek  
Input: `docs/calibration-blind/F6`  
Input SHA-256: `bb4dab4fe14c89b8eaff998558274b59a38d1de7aa01738731625342d45f2204`  
Verdict: **PASS**  
Score: **92/100** (gate); unresolved P2: **3/3** (at cap)  
P0/P1 blocking: **none**

| Area | Score | Floor | Status |
|---|---:|---:|---|
| Selected-direction execution | 19/20 | 16 | **PASS** |
| Decision and metrics | 14/15 | 12 | **PASS** |
| Baseline and controls | 15/15 | 12 | **PASS** |
| Experiment sufficiency | 18/20 | 16 | **PASS** |
| Reproducibility/artifacts | 9/10 | 8 | **PASS** |
| Risk/license/safety | 8/10 | 8 | **PASS** |
| Reviewability | 9/10 | 8 | **PASS** |

Total 92/100 ≥ 80; every floor passes; no P0/P1; exactly 3 unresolved P2 → `PASS`. This PASS applies to the plan only. It authorizes the planned experiments/demo, not adoption; the production adoption decision remains with the maintainer after a Gate 2 results review.

The author's self-count of 3 P2 was independently checked, not merely accepted. I find the same three declared residual P2s (synthetic distribution; post-parse RSS lower bound; single host/Node/no CI) and two P3 clarifications. No fourth P2 was found; the P2 cap is not exceeded.

### Findings

- **F6-01 [P2][non-blocking]** Location: representative slice and risks, `F6:47-51`, `F6:76-77`.  
  Evidence: three payload families are “synthetic but structurally representative”; the plan accepts the synthetic field-distribution P2 and says claims are descriptive, with no extrapolation to production distributions.  
  Why it matters: synthetic data can still overstate real-world behavior if the memo generalizes; the limitation is disclosed and bounded, so it does not block.  
  Required action: keep every memo claim descriptive of the measured synthetic slice.  
  Pass condition: no production-distribution generalization appears in results or recommendations.

- **F6-02 [P2][non-blocking]** Location: metric M3, `F6:24`; experiment EXP-3, `F6:58-59`; risk, `F6:78`.  
  Evidence: M3 is labeled “peak RSS delta”, but EXP-3 measures post-parse RSS and explicitly says “a lower-bound caveat (no in-call peak sampling)”; the risk section says “post-parse RSS is a lower bound … no peak-memory claim.”  
  Why it matters: the label “peak” could be quoted as a peak-memory result although the measurement is a lower bound; the plan acknowledges this, so it is non-blocking if wording is fixed.  
  Required action: rename M3 to “post-parse RSS delta (lower bound)” and ensure the decision rule and memo never claim peak memory.  
  Pass condition: metric label, decision rule, and results wording all say post-parse/lower-bound; no peak-memory claim.

- **F6-03 [P2][non-blocking]** Location: risks, `F6:79`; environment, `F6:7`, `F6:66-72`.  
  Evidence: “single host/Node/no CI: accepted; no generalization beyond this host.”  
  Why it matters: results on one host/Node version cannot be generalized to other environments; the limitation is explicit.  
  Required action: label results host/Node-specific; do not generalize across versions, hosts, or concurrent workloads.  
  Pass condition: the results review and memo keep the single-host/Node scope.

- **F6-04 [P3][non-blocking]** Location: decision rule, `F6:28-33`; directions, `F6:39-40`; slice, `F6:48-51`.  
  Evidence: M2 refers to “the 95% CI lower bound of the improvement” without stating whether it is computed on the 20 MB mixed family, all three families, or a pre-registered primary family; M3 says “all three representative payloads”. The direction table's slice column says “mixed 20 MB”.  
  Why it does not block: the direction table implies the 20 MB mixed payload is the decision slice, and the conservative CI rule is already adopted; this is a clarification, not a missing gate element.  
  Required action: state the M2 decision slice and aggregation explicitly (and any multiplicity rule) before execution.  
  Pass condition: the decision rule names the payload set on which M2 and M3 are evaluated.

- **F6-05 [P3][non-blocking]** Location: M1, `F6:22`; EXP-1, `F6:55`.  
  Evidence: “20 curated cases + 5 malformed cases” with an expected exception/result table, but the case list is not enumerated.  
  Why it does not block: the plan commits to a case table and includes malformed inputs; enumerating the cases before execution is a clarification.  
  Required action: attach the 20 + 5 case table, covering semantic edges such as duplicate keys, number precision, surrogate pairs, nesting depth, BOM, and trailing content as applicable.  
  Pass condition: the case table is in the artifacts and the expected results are reviewable.

---

## F7 — Gate 1 plan review

Reviewer: `calibration-reviewer-9` / `deepseek-flash` / DeepSeek  
Input: `docs/calibration-blind/F7`  
Input SHA-256: `bf730d6e766a6ecc35f23e471ca4f8f942f6cc3eaa4ec517e79fadf1742a836f`  
Verdict: **REVISE**  
Score: **84/100** (gate); unresolved P2: **3/3** (at cap)  
P0/P1 blocking: **F7-01**

| Area | Score | Floor | Status |
|---|---:|---:|---|
| Selected-direction execution | 17/20 | 16 | **PASS** |
| Decision and metrics | 11/15 | 12 | **FAIL** |
| Baseline and controls | 14/15 | 12 | **PASS** |
| Experiment sufficiency | 17/20 | 16 | **PASS** |
| Reproducibility/artifacts | 9/10 | 8 | **PASS** |
| Risk/license/safety | 8/10 | 8 | **PASS** |
| Reviewability | 8/10 | 8 | **PASS** |

Total 84/100 ≥ 80, but the Decision and metrics floor is not met (11/15 < 12) and a P1 is present → `REVISE`. The total is a gate, not a diagnostic; it does not offset the floor failure. No demo is permitted.

The declared 3 P2s are the same accepted residual risks as in F6 (synthetic distribution; post-parse RSS lower bound; single host/Node/no CI). I added no fourth P2. The blocking problem is the M2 decision rule, which is a P1 in the Decision and metrics area, plus three non-blocking P3 clarifications.

### Findings

- **F7-01 [P1][blocking]** Location: M2 decision rule, `F7:13-15`; decision rule, `F7:19`.  
  Evidence: “candidate ≤ 0.8× baseline; … 95% bootstrap CI; adopt only if the CI lower bound clears 0.8×.” The conservative condition for a ratio is the **upper** bound of the candidate/baseline ratio ≤ 0.8×, equivalently the **lower** bound of the improvement ≥ 20%. As written, “the CI lower bound clears 0.8×” is directionally wrong or undefined: with a ratio CI of [0.5, 0.95], the lower bound 0.5 is below 0.8, so a literal “lower bound clears 0.8” test would pass, yet the candidate may be only 5% faster (upper bound 0.95), not the required 20%; a CI such as [0.5, 1.05] would even allow a slowdown.  
  Why it matters: the headline adopt rule is not executable as a conservative test and could authorize a candidate that is not ≥ 20% faster. This is the CI-direction failure mode a conservative decision rule must exclude; it invalidates the decision rule and drops Decision and metrics below its floor.  
  Required action: rewrite M2 to “upper bound of the 95% CI of the candidate/baseline p50 ratio ≤ 0.8× (equivalently lower bound of improvement ≥ 20%), computed on a pre-specified decision slice”; state the per-family vs all-family aggregation and any multiplicity rule.  
  Pass condition: the decision rule states the conservative bound unambiguously, names the measured payload set, and is executable by a reviewer from the raw data; re-review finds no P1 and Decision and metrics ≥ 12/15.

- **F7-02 [P2][non-blocking]** Location: risks, `F7:33-37`; slice, `F7:21-22`.  
  Evidence: “P2 synthetic field distribution; accepted, limited to descriptive claims.”  
  Why it matters: synthetic payloads may not represent production field distributions; the plan bounds claims to descriptive results, so this does not block.  
  Required action: keep results descriptive of the measured synthetic slice.  
  Pass condition: no production-distribution generalization.

- **F7-03 [P2][non-blocking]** Location: M3, `F7:16`; risks, `F7:34`.  
  Evidence: “M3 post-parse RSS delta ≤ 32 MB (lower bound on peak)” and “P2 RSS is a lower bound; accepted, no peak claim.”  
  Why it matters: the M3 gate is a lower bound, not a peak measurement; it is disclosed and accepted, so it does not block, but the memo must not claim peak memory.  
  Required action: keep the “post-parse lower bound” label in the metric, decision rule, and memo.  
  Pass condition: no peak-memory claim.

- **F7-04 [P2][non-blocking]** Location: risks, `F7:35`; environment, `F7:10`, `F7:28-30`.  
  Evidence: “P2 single host/Node/no CI; accepted, no generalization.”  
  Why it matters: results are host/Node-specific; the limitation is explicit.  
  Required action: label results as single-host/Node; no cross-environment generalization.  
  Pass condition: results and recommendations keep that scope.

- **F7-05 [P3][non-blocking]** Location: decision paragraph, `F7:3-7`.  
  Evidence: “Candidate A selected for low allocation; B selected for error positions” and kill criteria are recorded, but the decision paragraph does not attribute the selection to the user or record a formal user rationale.  
  Why it does not block: the rationale and kill criteria are substantively present; only attribution is missing, and Gate 1 must not veto the user's choice without new evidence and an explicit user decision.  
  Required action: record that A and B are the user-selected directions, with the user rationale and kill criteria, before execution.  
  Pass condition: user selection/rationale/kill criteria are recorded in the plan.

- **F7-06 [P3][non-blocking]** Location: stop/abort, `F7:26`.  
  Evidence: “Stop after 20 minutes or high load; no extrapolation.” The 20-minute cap is objective, but “high load” has no threshold.  
  Why it does not block: the time cap already provides an executable stop; the load trigger is supplementary and vague.  
  Required action: define the load threshold (for example, load average > 2× at start) and the partial-evidence handling.  
  Pass condition: the stop/abort rule is numeric and executable.

- **F7-07 [P3][non-blocking]** Location: risks/artifacts, `F7:28-37`; correctness, `F7:13`.  
  Evidence: the risk section does not mention SCA/CVE scanning, sandbox isolation, or credentials, and the 20 + 5 correctness cases are not enumerated.  
  Why it does not block: the benchmark is local/synthetic with “No network”, M5 covers dependency/license allowlist and no native build, and the case table can be attached before execution; these are completeness clarifications.  
  Required action: add a short SCA/sandbox/credentials statement and the correctness case table.  
  Pass condition: the risk checklist and case table are complete in the artifacts.

---

## Floor failures

This is the direct answer to “which inputs do not meet a floor”.

| Input | Floor(s) not met | Detail |
|---|---|---|
| **F1** | **All seven** | Execution 4/20 < 16; Decision 0/15 < 12; Baseline 0/15 < 12; Sufficiency 1/20 < 16; Reproducibility 0/10 < 8; Risk 0/10 < 8; Reviewability 1/10 < 8. Total 6/100. |
| **F2** | **All seven** | Execution 5/20 < 16; Decision 0/15 < 12; Baseline 0/15 < 12; Sufficiency 1/20 < 16; Reproducibility 0/10 < 8; Risk 0/10 < 8; Reviewability 1/10 < 8. Total 7/100. The R1 pre-check issue is separate and is **not** a Gate 1 floor. |
| **F3** | **n/a** | Gate 2 has no numeric area floors. The Gate 2 checks fail: raw data not retained, single run, no CI/slice, adopt recommendation unsupported, no `CLAIMS.md`/memo stamp. |
| **F4** | **n/a** | Gate 2 has no numeric area floors. The Gate 2 checks fail: a partial claim supports “Recommend adopt”; no supported representative evidence/pilot/risk acceptance/`MIGRATION.md`; no claim mapping/stamp. |
| **F5** | **All unassessable/fail** | The output has no plan or results evidence, no gate table/floors, and no findings; it is an invalid review, not a low-scoring plan. |
| **F6** | **None** | All seven areas pass: 19/20, 14/15, 15/15, 18/20, 9/10, 8/10, 9/10; total 92; 3/3 P2. |
| **F7** | **Decision and metrics only** | Decision and metrics 11/15 < 12. Execution 17/20, Baseline 14/15, Sufficiency 17/20, Reproducibility 9/10, Risk 8/10, Reviewability 8/10 all pass. Total 84/100 is above 80, but total is a gate, not a diagnostic; the P1 and the floor failure block. |

Additional notes:

- F2's decision-frame omission (do-nothing and an obvious existing-library alternative) is an **R1 pre-check** issue. It must go back to R1/the user, but it is not used here to veto the user's D1 choice at Gate 1.
- F3 and F4 have no numeric floor table because Gate 2 is unscored; their gate checks are listed above. A reviewer who invents a /100 score for Gate 2 would violate the rubric's own anti-pattern.
- F7 is the floor-boundary case: it looks close to F6 and its total is above 80, but the M2 decision rule is not conservative and the Decision and metrics area falls below floor. Total score alone would wrongly pass it.

## Cross-input consistency notes

- **F1 vs F2:** both fail plan execution, but for different reasons. F1 has almost no plan at all; F2 additionally has an incomplete decision frame. The F2 R1 issue must not be turned into a Gate 1 veto of the user's selected direction.
- **F3 vs F4:** both fail Gate 2. F3 lacks raw data, repetitions/CI, a slice, and a valid evidence package; F4 states the crisp rule that a partial supporting claim limits the recommendation to candidate/pilot. A single run does not become `supported`; a partial claim cannot support adopt/migrate.
- **F5:** not evidence for or against any of F1–F7. It is a rejected review output and must be replaced by a full independent review.
- **F6 vs F7:** near-identical plan content, but F6's M2 rule states the correct conservative bound (“upper bound of candidate/baseline ratio ≤ 0.8×”) and includes a rejection example; F7 says “the CI lower bound clears 0.8×”. That difference is decisive: F6 passes, F7 fails the Decision and metrics floor. This is the calibration-critical distinction in this set.
- **Scores are rubric-derived, not an answer key.** No expected outcome or prior verdict was consulted; the verdicts above follow from the gate conditions, floor table, and claim-status rules.

## Attestation

- The seven blind inputs were not modified. Post-review SHA-256 values equal the pre-review values in the table above.
- Only `docs/calibration-blind/F1`–`F7` and `skills/rd-workflow-research-review.md` were opened for content. `docs/fixtures/`, `expected.json`, `docs/calibration-inputs/`, prior reviews, and answer keys were not read.
- The review was performed independently; no author, experimenter, synthesizer, or prior reviewer influenced the verdicts.
- The main limitation is that F3/F4 are summaries, not the full Gate 2 input set (approved plan, logs, raw data, artifacts, `CLAIMS.md`, memo). The correct response to missing evidence is `REVISE` and naming what is missing, not inferring success.

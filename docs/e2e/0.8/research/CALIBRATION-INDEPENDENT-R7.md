# Independent calibration review — R7

## 1. Reviewer record

| Field | Value |
|---|---|
| Reviewer ID | `calibration-reviewer-8` |
| Role | Independent research calibration reviewer; not author, experimenter, or synthesizer |
| Model / provider | `deepseek-flash` / DeepSeek (DSH subagent runtime) |
| Review time | 2026-11-25, Asia/Shanghai |
| Gate rules used | `skills/rd-workflow-research-review.md` — Gate 1, Gate 2, explicit feedback rules, calibration section |
| Inputs reviewed | `docs/calibration-blind/F1` … `F7` (read-only) |
| Excluded from reading | `docs/fixtures/`, `expected.json`, `docs/calibration-inputs/`, any prior review, and any answer key |
| Independence | Verdicts were formed from the rubric and the seven inputs; no prior verdict or expected outcome was read or assumed |
| Read-only | No input was modified. This report is the only file written |

**Limitation:** This is a document-only calibration review. No experiment was executed. Gate 2 process findings for F4/F5 are therefore based on the supplied evidence description only; the missing raw data, logs, and stamps are named as missing evidence rather than assumed.

## 2. Frozen hashes

### 2.1 Review prompt

| Role | File | SHA-256 |
|---|---|---|
| Review prompt / rubric used for Gate 1 and Gate 2 | `skills/rd-workflow-research-review.md` | `80ccf3b9f6c320932a2e8d3215bd8df8f27ba2f5c9e626a7f05bcdf23513ab13` |

No separate frozen calibration prompt file exists under the allowed scope; the rubric above is the review prompt. The seven inputs are the only calibration evidence used.

### 2.2 Input hashes

| Input | Bytes | SHA-256 |
|---|---:|---|
| `docs/calibration-blind/F1` | 191 | `f53937a0ad84895113ddd0b76c8f89890975cb8b5bf37172212abfe3d90dd5b4` |
| `docs/calibration-blind/F2` | 287 | `50dc2ed7684350153c23694e8daf398fea008771b14eb73b5ea117ef0a9bad71` |
| `docs/calibration-blind/F3` | 230 | `e78789bdb08498cf0c4a46e8bbdf3848e2c86b3d3e15b340505707fb745bd1d2` |
| `docs/calibration-blind/F4` | 133 | `b236c66a1dc59f59a3aceea63fb4d706a762f0281dc56bae93840bbdf2fcb06c` |
| `docs/calibration-blind/F5` | 69 | `f2b73c97383b3b5b03c7563b9935a3f1656dfaf6ecfe436457cca9881817ee9a` |
| `docs/calibration-blind/F6` | 3465 | `331584f07cad852fd23a7a0953c30c4682f73e70a90b96a729155da125bec21c` |
| `docs/calibration-blind/F7` | 2019 | `bf730d6e766a6ecc35f23e471ca4f8f942f6cc3eaa4ec517e79fadf1742a836f` |

Hashes were computed with `sha256sum` before the review and re-checked after the report was written; both sets matched. Inputs were not modified.

## 3. Summary

| Input | Gate | Verdict | Score | Floor status | Unresolved P2 | Basis |
|---|---|---|---:|---|---:|---|
| F1 | Gate 1 | **REVISE** | 5/100 | All 7 areas below floor | 0/3 | P0 ×2, P1 ×3 |
| F2 | Gate 1 | **REVISE** | 6/100 | All 7 areas below floor | 0/3 | P0 direction-set coverage; P0/P1 evidence design |
| F3 | Gate 1 (Gate 2 not startable) | **REVISE** | 31/100 | All 7 areas below floor | 0/3 | P1 ×5, including premature adopt claim |
| F4 | Gate 2 | **REVISE** | n/a (gate, not a score) | n/a; all Gate 2 conditions fail | n/a | Partial claim cited for adopt |
| F5 | Gate 2 review audit | **REVISE** (review unusable) | n/a (0/100 if forced) | n/a; no criteria evidenced | n/a | P0 ×2: no findings/evidence; “Ship it” |
| F6 | Gate 1 | **REVISE** | 86/100 | Decision and metrics 11/12 — **FAIL**; other areas pass | 4/3 | P1 M2 rule; floor failure; P2 cap |
| F7 | Gate 1 | **PASS** (boundary) | 80/100 | All 7 areas exactly at floor | 3/3 | No P0/P1; 3 P2 accepted |

**Direct answer to “which inputs do not meet floor”:**

- **F1:** all seven areas below floor — selected-direction execution 2/20 (floor 16), decision/metrics 1/15 (12), baseline/controls 0/15 (12), experiment sufficiency 1/20 (16), reproducibility 0/10 (8), risk 0/10 (8), reviewability 1/10 (8).
- **F2:** all seven areas below floor — 3/20, 1/15, 0/15, 1/20, 0/10, 0/10, 1/10.
- **F3:** all seven areas below floor — 8/20, 6/15, 8/15, 5/20, 1/10, 0/10, 3/10.
- **F4:** Gate 2 has no numeric floors; all four Gate 2 conditions fail (partial supporting adopt; recommendation unmapped; no memo stamp; no process audit).
- **F5:** no valid gate table or floor evidence; all criteria fail.
- **F6:** **Decision and metrics 11/15 vs floor 12**; every other area is at/above floor. Independently, the plan has a P1 and 4 unresolved P2 against a cap of 3.
- **F7:** **none**; all seven areas sit exactly on their floors (16/16, 12/12, 12/12, 16/16, 8/8, 8/8, 8/8), total 80/100, 3/3 P2 — a boundary PASS.

The total is a gate, not a diagnostic. F6’s total (86) is higher than F7’s (80), but F6 fails a floor and the P1/P2 gate; F7 meets every floor at the boundary.

---

## 4. F1 — one candidate demo

**Gate:** Gate 1  
**Verdict:** **REVISE**  
**Score:** 5/100 (gate); unresolved P2: 0/3  
**P0/P1 blocking:** P0 ×2, P1 ×3

**Floors**

| Area | Score / floor | Status |
|---|---|---|
| Selected-direction execution | 2/20 (16) | **FAIL** |
| Decision and metrics | 1/15 (12) | **FAIL** |
| Baseline and controls | 0/15 (12) | **FAIL** |
| Experiment sufficiency | 1/20 (16) | **FAIL** |
| Reproducibility/artifacts | 0/10 (8) | **FAIL** |
| Risk/license/safety | 0/10 (8) | **FAIL** |
| Reviewability | 1/10 (8) | **FAIL** |

### Findings

1. **[P0][blocking] No baseline and no comparison**
   - **Location:** `docs/calibration-blind/F1:3-5`.
   - **Evidence:** “Plan: run one demo of candidate A; no baseline; one run; no thresholds; no comparison; no representative slice; no raw-data retention.”
   - **Why it matters:** A single candidate demo cannot support “choose a parser library.” Without the current baseline there is no relative result, and “no comparison” removes the decision evidence entirely. This is a P0: the plan cannot support the decision.
   - **Required action:** Benchmark candidate A against the real current baseline on the same payloads, environment, and runtime; record the comparison protocol and raw observations.
   - **Pass condition:** A defined baseline, same-workload comparison, and an explicit candidate-versus-baseline result table exist before any demo.

2. **[P0][blocking] No metrics, thresholds, or decision rule**
   - **Location:** `docs/calibration-blind/F1:4`.
   - **Evidence:** “no thresholds”; no metric, MDE, success/failure meaning, or adopt/keep rule is supplied.
   - **Why it matters:** Without a pre-registered threshold, any observed result can be rationalized; the plan has no way to decide “choose A” versus “keep the current parser.” This is a P0 decision/metrics failure.
   - **Required action:** Pre-register the metrics, the minimum meaningful effect or threshold, the decision rule, and what success and failure mean.
   - **Pass condition:** A metric table with numeric gates and an explicit adopt/reject/keep-baseline rule; a worked example shows how a result maps to a decision.

3. **[P1][blocking] No selected-direction rationale, falsifier, slice, or stop/decision rule**
   - **Location:** `docs/calibration-blind/F1:4-5`.
   - **Evidence:** Only “one demo of candidate A” exists; no user rationale, kill criterion, falsifier, representative slice, or stop/abort condition.
   - **Why it matters:** Gate 1 checks execution of selected directions; without a rationale and falsifier, the reviewer cannot tell why A was chosen or what result would kill it. Generalization is impossible without a slice.
   - **Required action:** Record the selected direction, user rationale, 1–3 experiments, falsifier, representative slice, exclusions, and stop/decision rule.
   - **Pass condition:** Each selected direction has a traceable rationale and a falsifier; the slice and exclusions are defined before the demo.

4. **[P1][blocking] One run and no raw-data retention**
   - **Location:** `docs/calibration-blind/F1:4`.
   - **Evidence:** “one run”; “no raw-data retention.”
   - **Why it matters:** One run gives no variance/CI, and non-retained raw data makes the result unverifiable and unreproducible. Even a positive demo could not be audited.
   - **Required action:** Use repeated, paired/alternating runs with variance or a confidence interval; retain immutable raw data, commands, versions, seeds, and a lockfile/image hash.
   - **Pass condition:** A second reviewer can rerun the commands and recompute the headline result from retained raw data.

5. **[P1][blocking] No risk/license/safety, timebox, or stop/abort plan**
   - **Location:** `docs/calibration-blind/F1` (absent sections).
   - **Evidence:** The input contains no dependency/license/CVE check, sandbox or credential handling, data/security note, timebox, or abort condition.
   - **Why it matters:** The experiment is unbounded and cannot be stopped safely; license/security issues could invalidate the choice after the fact.
   - **Required action:** Add dependency/license/SCA checks, data/credential handling, a timebox, and stop/abort criteria.
   - **Pass condition:** Risks are enumerated with owners/mitigations and an explicit stop condition.

---

## 5. F2 — incomplete direction set

**Gate:** Gate 1 (with the R1 broad-direction-set pre-check)  
**Verdict:** **REVISE**  
**Score:** 6/100 (gate); unresolved P2: 0/3  
**P0/P1 blocking:** P0 ×2, P1 ×2

**Floors**

| Area | Score / floor | Status |
|---|---|---|
| Selected-direction execution | 3/20 (16) | **FAIL** |
| Decision and metrics | 1/15 (12) | **FAIL** |
| Baseline and controls | 0/15 (12) | **FAIL** |
| Experiment sufficiency | 1/20 (16) | **FAIL** |
| Reproducibility/artifacts | 0/10 (8) | **FAIL** |
| Risk/license/safety | 0/10 (8) | **FAIL** |
| Reviewability | 1/10 (8) | **FAIL** |

### Findings

1. **[P0][blocking] R1 broad-direction-set coverage failed: the selection list omitted do-nothing and an obvious existing-library alternative**
   - **Location:** `docs/calibration-blind/F2:4-5`.
   - **Evidence:** “User selected only D1 (candidate X) from a list that omitted the do-nothing option and an obvious existing-library alternative. User rationale: ‘fast’.”
   - **Why it matters:** This is not a veto of D1. It is a failure of the required pre-check: the user selected from an incomplete set, so the choice cannot establish that D1 is better than keeping the current parser or using the obvious existing library. “Fast” is not a testable rationale. Any plan built on this selection inherits the coverage gap. This is a P0 because the resulting comparison cannot support the decision.
   - **Required action:** Return to the user with the broad direction set, including do-nothing/keep-baseline and the existing-library alternative; record the user’s selected directions, rationale, and kill criteria. Do not silently substitute or override the user’s choice.
   - **Pass condition:** A documented direction set with no obvious omitted option; a recorded user decision with rationale and kill criteria; the plan executes that recorded choice.

2. **[P0][blocking] No baseline, thresholds, or decision rule**
   - **Location:** `docs/calibration-blind/F2:6`.
   - **Evidence:** “Plan: D1 only; no baseline; one run; no thresholds; no slice; no raw data.”
   - **Why it matters:** With no baseline and no pre-registered threshold, there is no comparison and no decision rule. The plan cannot support a library choice.
   - **Required action:** Define the real current baseline, the comparison workload/environment, metrics, thresholds/MDE, and the adopt/keep rule.
   - **Pass condition:** Baseline + same-workload comparison + numeric decision rule; each direction can be evaluated against it.

3. **[P1][blocking] One run, no representative slice, no raw data**
   - **Location:** `docs/calibration-blind/F2:6`.
   - **Evidence:** “one run; … no slice; no raw data.”
   - **Why it matters:** One run gives no variance/CI; no slice means no generalization; no raw data means no audit or reproduction. The result would be unverifiable even if it looked favorable.
   - **Required action:** Repeated paired/alternating runs with variance/CI, a representative slice with exclusions, and immutable raw data/commands/versions retained.
   - **Pass condition:** A rerunnable evidence set that supports or rejects the selected direction on the defined slice.

4. **[P1][blocking] No risk/license/safety, timebox, or stop/abort plan**
   - **Location:** `docs/calibration-blind/F2` (absent sections).
   - **Evidence:** No dependency/license/CVE check, data/credential handling, timebox, or abort condition is supplied.
   - **Why it matters:** The plan is unbounded and lacks the safety/license controls required before a parser dependency is considered.
   - **Required action:** Add the risk/license/safety table, timebox, and stop/abort criteria.
   - **Pass condition:** Risks are mitigated or accepted explicitly; stop conditions are executable.

---

## 6. F3 — one run each plus a premature adopt claim

**Gate:** Gate 1 plan review. The draft conclusion is a Gate 2 claim attempted without Gate 2 inputs, so Gate 2 cannot start.  
**Verdict:** **REVISE**  
**Score:** 31/100 (gate); unresolved P2: 0/3  
**P0/P1 blocking:** P1 ×5

**Floors**

| Area | Score / floor | Status |
|---|---|---|
| Selected-direction execution | 8/20 (16) | **FAIL** |
| Decision and metrics | 6/15 (12) | **FAIL** |
| Baseline and controls | 8/15 (12) | **FAIL** |
| Experiment sufficiency | 5/20 (16) | **FAIL** |
| Reproducibility/artifacts | 1/10 (8) | **FAIL** |
| Risk/license/safety | 0/10 (8) | **FAIL** |
| Reviewability | 3/10 (8) | **FAIL** |

### Findings

1. **[P1][blocking] One run per arm, no variance/CI, and no demonstrated baseline fairness**
   - **Location:** `docs/calibration-blind/F3:4`.
   - **Evidence:** “candidate X vs current baseline; one run each; no variance/CI.” The baseline is named, but same workload/environment/runtime, warmup, and run order are not specified.
   - **Why it matters:** A single run per arm cannot estimate variance or support a 2× speed claim; baseline fairness is unverified. The experiment design would invalidate any comparative conclusion.
   - **Required action:** Use repeated paired/alternating runs (with warmup) on the same payloads and environment, report variance or a 95% CI, and record the fairness controls.
   - **Pass condition:** The comparison is paired/alternating with enough repetitions and a CI; a rerun can reproduce the direction of the effect.

2. **[P1][blocking] No representative slice or exclusions**
   - **Location:** `docs/calibration-blind/F3:4`.
   - **Evidence:** “no representative slice.”
   - **Why it matters:** The 2× claim cannot be generalized beyond whatever single input was used; there is no definition of the population, payload families, or exclusions.
   - **Required action:** Define representative payload families, fixed seeds/hashes, and explicit exclusions; label unmeasured cases.
   - **Pass condition:** A slice table with families, sizes, seeds, and exclusions exists before the runs; claims are bounded to it.

3. **[P1][blocking] Raw data not retained; no reproducibility package**
   - **Location:** `docs/calibration-blind/F3:4`.
   - **Evidence:** “raw data not retained.”
   - **Why it matters:** The headline “X is 2x faster” cannot be audited or recomputed; missing raw data blocks Gate 2 evidence review and any later delta review.
   - **Required action:** Retain immutable raw data, commands with exit codes, versions, seeds, lockfile/image hash, and a retention/cleanup policy.
   - **Pass condition:** An independent reviewer can recompute the headline metric from retained artifacts.

4. **[P1][blocking] Draft conclusion “X is 2x faster; recommend adopt” is premature**
   - **Location:** `docs/calibration-blind/F3:5`.
   - **Evidence:** “Draft conclusion: ‘X is 2x faster; recommend adopt.’”
   - **Why it matters:** This is a user-facing adoption conclusion without an approved plan, execution logs, raw data, an independent `CLAIMS.md`, a claim table, or a memo stamp. Gate 2 explicitly forbids partial or unreviewed evidence from supporting adopt; issuing the conclusion now violates the process gate.
   - **Required action:** Withdraw the draft conclusion. Do not issue any user-facing recommendation until Gate 2: extract claims first, hash `CLAIMS.md`, map memo claims to raw evidence, and stamp the memo.
   - **Pass condition:** The conclusion is removed; the eventual memo contains only supported/partial-with-limit claims and an explicit adopt/keep recommendation mapped to claim IDs.

5. **[P1][blocking] No risk/license/safety, timebox, or stop/abort plan**
   - **Location:** `docs/calibration-blind/F3` (absent sections).
   - **Evidence:** No dependency/license/CVE check, data/credential handling, timebox, or abort criterion is supplied.
   - **Why it matters:** The experiment is unbounded and the parser choice is considered without the required safety/license controls.
   - **Required action:** Add the risk/license/safety table, timebox, and stop/abort criteria.
   - **Pass condition:** Risks are mitigated/accepted and the stop condition is executable.

---

## 7. F4 — Gate 2: partial claim used for adopt

**Gate:** Gate 2  
**Verdict:** **REVISE**  
**Score:** n/a — Gate 2 is a gate, not a 100-point score. **Floors:** n/a.  
**Gate status:** All four Gate 2 conditions fail.

### Process findings

1. **[P1][blocking] A `partial` claim is cited to support “Recommend adopt”**
   - **Location:** `docs/calibration-blind/F4:3-4`.
   - **Evidence:** “One supporting claim is `partial` (single sandbox run, no representative slice). Draft memo: ‘Recommend adopt.’”
   - **Why it matters:** Gate 2 is explicit: `partial` cannot support adopt/migrate. The recommendation is therefore unsupported at the adopt level, regardless of confidence language.
   - **Required action:** Downgrade the recommendation to candidate/pilot, or produce a supported claim with measured-here evidence, a representative slice, a pilot or written risk acceptance, and a downstream `MIGRATION.md`. Do not use adopt/migrate wording while a cited claim is partial.
   - **Pass condition:** No partial claim supports adopt/migrate; the memo’s allowed wording is limited to candidate/pilot unless every cited claim is supported.

2. **[P1][blocking] No independent `CLAIMS.md`, claim table, or memo stamp**
   - **Location:** `docs/calibration-blind/F4` (only two content lines; no hashes, claim IDs, or stamp).
   - **Evidence:** The input contains no extracted claims, no hash, no claim IDs, and no memo stamp.
   - **Why it matters:** The Gate 2 order is approved plan → execution logs → raw data → artifacts → independent `CLAIMS.md` with a hash → draft memo. Without that order, the memo’s claims cannot be mapped or audited, and any later wording change would be unreviewed.
   - **Required action:** Produce `CLAIMS.md` first, hash it, map every memo claim to extracted claims and raw evidence, list claims absent from extraction, and stamp the memo with claim IDs and SHA-256.
   - **Pass condition:** A claim table exists with supported/partial/unsupported statuses and evidence; the memo stamp is present; any post-stamp change triggers delta re-review.

3. **[P1][blocking] No process audit; the one claim is at most partial**
   - **Location:** `docs/calibration-blind/F4:3`.
   - **Evidence:** “single sandbox run, no representative slice.”
   - **Why it matters:** There is no audit of commands/environment, baseline fairness, variance/CI, harness validity, missing runs, cherry-picking, semantic parity, failed runs, or slice exclusions. A single sandbox run cannot be promoted to `supported`; lowering confidence does not fix the missing representative slice.
   - **Required action:** Rerun the decisive experiment on a representative slice with repetitions/CI, or keep the claim `partial` with an explicit limit. Audit the process before any memo claim is reviewed.
   - **Pass condition:** The process audit is complete and the claim is either supported by measured-here representative evidence or explicitly partial with allowed wording.

4. **[P2][non-blocking] The recommendation is not mapped to claim IDs and has no pilot/risk acceptance or `MIGRATION.md`**
   - **Location:** `docs/calibration-blind/F4:4`.
   - **Evidence:** “Draft memo: ‘Recommend adopt.’” No REC-1..n IDs, no cited claim IDs, no pilot, no risk acceptance, no downstream migration document.
   - **Why it matters:** Even after the claim is repaired, an adopt/migrate recommendation must map to claim IDs and satisfy the pilot/risk-acceptance/`MIGRATION.md` requirements. This is currently non-blocking only because finding 1 already blocks adopt; it becomes blocking if adopt wording is retained.
   - **Required action:** Map the recommendation to claim IDs; adopt/migrate requires all cited claims supported, measured-here, representative slice, pilot or written risk acceptance, and downstream `MIGRATION.md`. Otherwise limit to candidate/pilot.
   - **Pass condition:** Every recommendation cites claim IDs and the adopt/migrate prerequisites are met or the wording is limited.

### Claim verdicts

| Claim ID | Claim | Evidence | Status | Allowed wording |
|---|---|---|---|---|
| unlabelled (no claim ID supplied) | The supporting claim described in F4:3 | Single sandbox run; no representative slice | **partial** | “Candidate; observed in one sandbox run; not representative; no adoption conclusion.” |
| memo (no REC ID supplied) | “Recommend adopt” | F4:4 | **unsupported as an adopt recommendation** | “Candidate/pilot only; at most partial; not adopt/migrate.” |

### What cannot be concluded

- No adopt/migrate recommendation can be supported by the supplied partial claim.
- No representative or production performance can be inferred from a single sandbox run.
- No user-facing conclusion can be issued; there is no memo stamp, claim table, or process audit.
- No pilot/risk acceptance or downstream `MIGRATION.md` exists.

### Memo stamp

Absent. After revision, the memo must carry claim IDs and a SHA-256; any later wording change requires delta re-review with the changed claims, new hash, and verdict recorded.

---

## 8. F5 — unusable review output

**Gate:** Gate 2 review audit (the input is a review artifact, not a plan or results package)  
**Verdict:** **REVISE — review rejected as unusable**  
**Score:** n/a for Gate 2; if forced onto a 100-point review frame, 0/100. **Floors:** n/a; no area is evidenced.

### Findings

1. **[P0][blocking] No findings, no evidence, no gate table; “Looks good” is a forbidden verdict**
   - **Location:** `docs/calibration-blind/F5:3`.
   - **Evidence:** “Reviewer output: ‘Looks good. 90/100. Ship it.’”
   - **Why it matters:** The explicit feedback rules forbid “looks reasonable/good,” a score without findings, and a score with no gate table or residual risks. The output contains no severity, location, evidence, why, required action, or pass condition. It cannot authorize anything.
   - **Required action:** Redo the review against the Gate 1/2 templates: reviewer record and hashes, per-area scores/floors or claim table, findings with the six required fields, residual risks, and a verdict with pass conditions.
   - **Pass condition:** A complete review artifact exists; every finding has severity/location/evidence/why/action/pass condition; no forbidden filler verdict remains.

2. **[P0][blocking] “Ship it” is a user-facing conclusion without Gate 2 PASS**
   - **Location:** `docs/calibration-blind/F5:3`.
   - **Evidence:** “Ship it.”
   - **Why it matters:** Only after Gate 2 `PASS` may the memo be user-facing. This output has no approved plan, logs, raw data, `CLAIMS.md`, claim table, or memo stamp; authorizing shipment violates the gate and the anti-pattern against sending unreviewed conclusions to the user.
   - **Required action:** Withdraw “Ship it.” Do not ship or present a conclusion until Gate 2 PASS and a stamped memo exist.
   - **Pass condition:** The recommendation is withdrawn; the eventual ship decision cites a PASS and a stamped claim table.

3. **[P1][blocking] No reviewer identity/model/prompt/input hash and no `REVIEW-LOG.md` record**
   - **Location:** `docs/calibration-blind/F5` (absent metadata).
   - **Evidence:** The output has no reviewer ID, model/provider, prompt hash, input hash, or review log.
   - **Why it matters:** The rubric requires the reviewer identity, model/provider, prompt hash, and input hash in `REVIEW-LOG.md`. Without them, the output is unattributable and cannot be audited for independence or consistency.
   - **Required action:** Record reviewer identity/model/provider, prompt hash, input hash, and verdict history; state any rejection/replacement reason.
   - **Pass condition:** `REVIEW-LOG.md` contains the required record and matches the frozen hashes.

4. **[P1][blocking] No claim table, process audit, rerun, or residual-risk analysis behind “90/100”**
   - **Location:** `docs/calibration-blind/F5:3`.
   - **Evidence:** The only content is the score and “Ship it.”
   - **Why it matters:** A 90/100 score implies a gate table, evidence, and a claim mapping; none exist. The score is unsupported and cannot be used for calibration or release.
   - **Required action:** Provide the gate table with scores/floors, the claim table, process audit, and residual risks; or withdraw the score.
   - **Pass condition:** The score is traceable to per-area floors and findings; no score appears without findings.

**Process note:** This review output is rejected. Do not silently replace the reviewer with a more lenient one; record the rejection and any replacement reason in `REVIEW-LOG.md`, as required by the rubric.

---

## 9. F6 — polished plan, floor/P1/P2 failure

**Gate:** Gate 1  
**Verdict:** **REVISE**  
**Score:** 86/100 (gate); unresolved P2: 4/3  
**P0/P1 blocking:** P1 M2 decision rule; P2 cap exceeded

**Floors**

| Area | Score / floor | Status |
|---|---|---|
| Selected-direction execution | 17/20 (16) | PASS |
| Decision and metrics | **11/15 (12)** | **FAIL** |
| Baseline and controls | 14/15 (12) | PASS |
| Experiment sufficiency | 18/20 (16) | PASS |
| Reproducibility/artifacts | 9/10 (8) | PASS |
| Risk/license/safety | 8/10 (8) | PASS |
| Reviewability | 9/10 (8) | PASS |

**Gate arithmetic:** total 86 ≥ 80, but the total is a gate, not a diagnostic. The Decision and metrics floor fails (11 < 12), the P1 rule below blocks, and the plan carries 4 unresolved P2 against a cap of 3. Verdict is `REVISE`; no demo may start.

### Findings

1. **[P1][blocking] M2’s confidence interval is tested against zero, not against the 20% MDE**
   - **Location:** `docs/calibration-blind/F6:23` (M2 row) and `F6:28-29` (decision rule).
   - **Evidence:** M2’s gate is “candidate must be ≤ 0.8× baseline,” but the decision rule says “M2 delta ≥ 20% with CI excluding 0.” A 20% point estimate with a 95% CI such as [1%, 39%] satisfies “CI excluding 0” while remaining compatible with a true improvement far below 20%.
   - **Why it matters:** The adoption decision can be made on evidence that does not establish the stated “worth it” threshold. The metrics/decision rule would not support the promised 20% benefit, so this is a P1 metrics failure that can invalidate the adopt conclusion.
   - **Required action:** Replace the rule with the conservative MDE test: the 95% CI lower bound of the improvement must be ≥20% (equivalently, the upper bound of the candidate/baseline ratio must be ≤0.8×). Make the M2 row and the decision rule use the same statement; report the CI bounds with the point estimate.
   - **Pass condition:** A worked example shows that a 20% point estimate with CI [1%, 39%] is rejected; adoption requires the conservative bound to clear 20%/0.8×; M2 and the decision rule are textually identical.
   - **Severity note:** If a reviewer prefers to score this as P2 rather than P1, the verdict is unchanged: it would become the fifth unresolved P2 against the cap of 3.

2. **[P2][blocking — 4th unresolved P2] User rationale and per-direction kill criteria are not recorded**
   - **Location:** `docs/calibration-blind/F6:5-7` (Decision) and `F6:30-31` (single plan-level kill criterion).
   - **Evidence:** Candidates A and B are named, but there is no user rationale for either; the only kill criterion is “any correctness/error regression or a native build requirement,” not a per-direction falsifier/kill criterion.
   - **Why it matters:** Gate 1 checks execution of the user’s selected directions. Without recorded rationale and per-direction kill criteria, the reviewer cannot distinguish the user’s choice from the author’s preference or verify what stops each direction. This is the fourth unresolved P2, exceeding the at-most-3 cap.
   - **Required action:** Add a direction table with candidate, user rationale, 1–3 experiments, falsifier, slice, stop/decision rule, and a per-direction kill criterion.
   - **Pass condition:** Each selected direction traces to a user rationale and has its own falsifier/kill criterion; unresolved P2 count is ≤3.

3. **[P2][non-blocking] The three disclosed P2 risks are not explicitly accepted or claim-limited; they consume the entire P2 allowance**
   - **Location:** `docs/calibration-blind/F6:62-68`.
   - **Evidence:** “Synthetic payloads may not represent real field distributions (P2)”; “RSS is a lower bound; no in-call peak (P2)”; “Single machine/single Node version; no CI (P2).” There is no acceptance/limit statement and no unresolved-P2 count.
   - **Why it matters:** These are exactly the three P2s the gate permits. Without explicit acceptance and claim limits, they remain unresolved, and any additional P2 — including finding 2 — exceeds the cap. Non-blocking only if each is accepted and the claims are bounded; in this plan the cap is already exceeded by finding 2.
   - **Required action:** Accept each limitation and bound its claims (descriptive only; no peak claim; no generalization); state “unresolved P2 count: 3” or resolve one to leave margin.
   - **Pass condition:** A risk table records acceptance, claim limits, and a count of ≤3 unresolved P2; no adopted claim exceeds the bounded evidence.

### P3 notes (non-blocking, not counted in the gate)

- **`F6:15` — “Blinded/paired order” describes alternating order, not blinding.** Evidence: “baseline and candidates alternate; each run is a fresh child process.” Alternating/paired order controls drift, but it is not blinding. Required: call it paired/alternating, or actually blind the order. Pass: the label matches the procedure. Non-blocking: the control is still valid for its stated purpose and does not invalidate a conclusion.
- **`F6:67` — “no adoption decision in research” conflicts with the “adopt only if” rule at `F6:28`.** Required: clarify that research may recommend and the maintainer makes the adoption decision, or remove the conflicting line. Pass: the decision frame and decision rule agree. Non-blocking: the decision owner is named, and the contradiction does not change the experiment design.

---

## 10. F7 — floor-boundary plan

**Gate:** Gate 1  
**Verdict:** **PASS** (boundary)  
**Score:** 80/100 (gate); unresolved P2: 3/3  
**P0/P1 blocking:** none

**Floors**

| Area | Score / floor | Status |
|---|---|---|
| Selected-direction execution | 16/20 (16) | PASS (at floor) |
| Decision and metrics | 12/15 (12) | PASS (at floor) |
| Baseline and controls | 12/15 (12) | PASS (at floor) |
| Experiment sufficiency | 16/20 (16) | PASS (at floor) |
| Reproducibility/artifacts | 8/10 (8) | PASS (at floor) |
| Risk/license/safety | 8/10 (8) | PASS (at floor) |
| Reviewability | 8/10 (8) | PASS (at floor) |

**Gate arithmetic:** all seven areas at/above floor; total 80 ≥ 80; no P0/P1; exactly 3 unresolved P2, all accepted and claim-limited. Verdict is `PASS` at the boundary. The plan may proceed to execution; any additional material gap would flip it to `REVISE`.

### Findings

No blocking findings.

**P3 note (non-blocking, not counted in the gate):**

- **M2 wording mixes the ratio threshold and the confidence-bound side**
  - **Location:** `docs/calibration-blind/F7:14-15`.
  - **Evidence:** “candidate ≤ 0.8× baseline; … 95% bootstrap CI; adopt only if the CI lower bound clears 0.8×.”
  - **Why it matters:** For a ratio `candidate/baseline`, the conservative test is the **upper** bound ≤0.8×; for an improvement delta, it is the **lower** bound ≥20%. “Lower bound clears 0.8×” is ambiguous and, read literally as the ratio’s lower bound, would be the optimistic side.
  - **Required action:** State the estimand and the conservative side explicitly, e.g. “95% CI upper bound of candidate/baseline ≤0.8×” or “95% CI lower bound of improvement ≥20%.”
  - **Pass condition:** The M2 row and decision rule state one estimand and the correct conservative bound; a worked example rejects a point estimate of 20% with a CI that crosses the MDE.
  - **Why non-blocking:** The plan already states the point gate (`candidate ≤0.8× baseline`) and “adopt only if” posture; the stated threshold and the experiment support computing the correct conservative bound. This is a wording clarification, not an experiment/design gap, so it does not consume the P2 allowance or block the boundary PASS.

### Why this is a boundary PASS

- The three P2s in `F7:32-37` are explicitly accepted and bounded: synthetic distribution → descriptive only; RSS lower bound → no peak claim; single host/Node/no CI → no generalization.
- The user rationale and per-direction kill criteria at `F7:5-6` satisfy the selected-direction execution check.
- The representative slice, exclusions, repetitions, CI, stop rule, artifacts, and retention plan satisfy the remaining floors at the minimum level.
- No P0/P1 is present; exactly 3 unresolved P2 is within the cap. The correct verdict is PASS, not REVISE for “not perfect.”

---

## 11. Verdict notes and residual calibration risks

1. **F6 vs F7 is the calibration discriminator.** F6 has the higher total (86 vs 80) but fails a floor, carries a P1, and exceeds the P2 cap. F7 is at every floor and passes. A reviewer who passes F6 on total alone or rejects F7 for being terse would be miscalibrated.
2. **F4 severity is unambiguous under Gate 2.** `partial` cannot support adopt/migrate; no amount of confidence language or a candidate/pilot framing makes the supplied memo adopt-ready.
3. **F5 is not a review.** A score without findings and “Ship it” without PASS violate the explicit feedback rules and the anti-patterns; the output must be redone, not repaired with a sentence.
4. **F1-F2 direction coverage.** F2’s failure is a pre-check failure, not a veto of the user’s D1 choice. The required action is to return to the user with the broad set and record the decision; the reviewer must not silently substitute a different direction.
5. **F3’s draft conclusion** is treated as a Gate 2 process violation because no Gate 2 inputs exist. Even if the plan were repaired, the conclusion must be withdrawn and re-derived under Gate 2.
6. **No demo/execution was available.** All positive/negative findings are plan/evidence-design findings; no runtime result is claimed. This is appropriate for Gate 1; F4/F5 are blocked by missing evidence, not by an unrun experiment.

---

## 12. Review stamp

| Field | Value |
|---|---|
| Reviewer | `calibration-reviewer-8` |
| Verdicts | F1 REVISE; F2 REVISE; F3 REVISE; F4 REVISE; F5 REVISE (review rejected); F6 REVISE; F7 PASS (boundary) |
| Inputs | `docs/calibration-blind/F1` … `F7` (SHA-256 in §2.2) |
| Review prompt | `skills/rd-workflow-research-review.md` (SHA-256 `80ccf3b9f6c320932a2e8d3215bd8df8f27ba2f5c9e626a7f05bcdf23513ab13`) |
| Input modification | None; post-write hashes matched the pre-review hashes |

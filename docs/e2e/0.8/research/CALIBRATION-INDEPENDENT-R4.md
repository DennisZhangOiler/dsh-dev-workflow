# Independent research calibration review — R4

**One-line result:** Of the seven blind inputs, F6 is the only Gate 1 plan that meets every floor (PASS, 87/100); F1, F2, and F7 are Gate 1 `REVISE`; F3 and F4 are Gate 2 `REVISE`; F5 is rejected as an unusable review artifact.

**Scope:** blind review of `docs/calibration-blind/F1`–`F7` against `skills/rd-workflow-research-review.md` Gate 1/2 only. No fixture was modified. No expected outcome was assumed. No prior review, answer key, fixture manifest, or calibration-input directory was read.

---

## 1. Reviewer record

| Field | Value |
|---|---|
| Reviewer ID | `calibration-reviewer-5` |
| Role | Independent research calibration reviewer (R4). Not the author, experimenter, synthesizer, or prior reviewer of any fixture. |
| Model / provider | `deepseek-flash` (DeepSeek provider), invoked as a DSH subagent under root `lead`. |
| Review time | 2026-11-25T13:20–13:30 +08:00 (Asia/Shanghai). Scans and hashes taken at 2026-11-25T13:20:17+08:00. |
| Task-prompt hash | `8852c35a07a9bf4d09aec7d808b4aa81e9211b3683a2a99f758de9479a18aa54` — SHA-256 over the UTF-8 delegation instruction text plus one trailing LF. The exact hashed text is reproduced in Appendix A. No frozen calibration-prompt file was supplied to this subagent; this hash covers the instruction text, not hidden harness context. |
| Rubric | `skills/rd-workflow-research-review.md`, SHA-256 `80ccf3b9f6c320932a2e8d3215bd8df8f27ba2f5c9e626a7f05bcdf23513ab13`. Used: Gate 1 (lines 9–38), Gate 2 (lines 40–69), explicit-feedback rules (71–87), Calibration (89–96), templates (99–140), anti-patterns (142–152). |
| Input set | `docs/calibration-blind/F1`–`F7`; aggregate hash `4497b79e749cac588e461d2c839b1ff0911dbcb67a0a0e3cd205ed3e90fc70e7` (SHA-256 of the seven `sha256sum` output lines in F1→F7 order). |
| Independence / no-access declaration | I opened only the seven fixtures and the rubric. I did not open `docs/fixtures/`, `expected.json`, `docs/calibration-inputs/`, any prior review, `CALIBRATION-PLAN*`, `CALIBRATION-RESULTS*`, `REVIEW-LOG.md`, or any other answer-key/plan file. A directory listing exposed filenames only; no forbidden file content was read. Verdicts were formed fixture-by-fixture from the rubric before any file containing a prior verdict could have been opened; none was opened. |
| Gate 2 sequencing caveat | A compliant Gate 2 review must first extract claims into an independent `CLAIMS.md` with a hash, then read the draft memo. For F3/F4 the fixture supplies neither raw data, execution logs, artifacts, nor an approved plan, so the prescribed extraction-before-memo sequence is not executable. I treated each draft conclusion/memo as untrusted input, assigned reviewer-side claim IDs, and recorded the missing evidence. No prior verdicts were read. |
| Reviewer-separation caveat | This is a calibration pass: one reviewer covers all seven inputs for comparability. In a real run the plan reviewer and results reviewer must be different agents (rubric line 6). This is a calibration exception, not a precedent. |
| Method | Read F1–F7; classify each as Gate 1 (plan), Gate 2 (results/draft conclusion), or review artifact; apply the gate's area/floors/verdict rules; assign only scores the rubric defines (100-point Gate 1); list every finding with severity, location, evidence, why, required action, pass condition; list floors not met. |
| Limitations | Static-text review only. No benchmark, rerun, artifact inspection, repository execution, or environment check was possible for any fixture. F6 is a plan revision text, not a run; its PASS approves the text, not results. F3/F4 have no inspectable data. F5 has no underlying evidence. A fixture assertion (for example "exclusions listed") was not treated as verified merely because it was asserted. |

### 1.1 Input manifest

| Input | Bytes | Lines | SHA-256 |
|---|---:|---:|---|
| `docs/calibration-blind/F1` | 191 | 5 | `f53937a0ad84895113ddd0b76c8f89890975cb8b5bf37172212abfe3d90dd5b4` |
| `docs/calibration-blind/F2` | 287 | 6 | `50dc2ed7684350153c23694e8daf398fea008771b14eb73b5ea117ef0a9bad71` |
| `docs/calibration-blind/F3` | 230 | 5 | `e78789bdb08498cf0c4a46e8bbdf3848e2c86b3d3e15b340505707fb745bd1d2` |
| `docs/calibration-blind/F4` | 133 | 4 | `b236c66a1dc59f59a3aceea63fb4d706a762f0281dc56bae93840bbdf2fcb06c` |
| `docs/calibration-blind/F5` | 69 | 3 | `f2b73c97383b3b5b03c7563b9935a3f1656dfaf6ecfe436457cca9881817ee9a` |
| `docs/calibration-blind/F6` | 42,830 | 568 | `67367a02cdeced9b789c8392df1ed2915aee4ad966762310b5b0e4b3eb0c5ab3` |
| `docs/calibration-blind/F7` | 525 | 10 | `74c4929bc60a06fd8722ebb69aeeb5d45581236ff9bfcc36a9b8145365c1000f` |

### 1.2 Verdict summary

| Input | Gate applied | Verdict | Score | Floors missed |
|---|---|---|---|---|
| F1 | Gate 1 — plan | `REVISE` | 5/100 | all 7 |
| F2 | Gate 1 — plan | `REVISE` | 10/100 | all 7 |
| F3 | Gate 2 — results | `REVISE` | N/A (Gate 2 has no numeric gate score or floors) | N/A; Gate 2 conditions fail |
| F4 | Gate 2 — results | `REVISE` | N/A (same) | N/A; Gate 2 conditions fail |
| F5 | Review artifact (Gate 1/2 common rules) | `REVISE` — reject, redo | N/A; claimed 90/100 unsubstantiated; review quality 0/100 | N/A; no gate table exists |
| F6 | Gate 1 — plan | **`PASS`** | **87/100** | **none** (all 7 at/above floor; 3 unresolved P2 allowed) |
| F7 | Gate 1 — plan | `REVISE` | 57/100 | 6 of 7 (only baseline met) |

No `expected` or prior verdict was used to produce this table. In particular, F6 is not passed because it is long; it is passed because every floor is met and no P0/P1 remains. F7 is not failed because it is short; it fails because the required content is asserted rather than supplied.

---

## 2. F1 — uncontrolled single demo

**Gate:** Gate 1 (plan review before any demo).
**Input hash:** `f53937a0ad84895113ddd0b76c8f89890975cb8b5bf37172212abfe3d90dd5b4`
**Verdict:** `REVISE`
**Score:** 5/100 (gate); total is below the 80 gate.
**Floors:** all seven missed.
**P0/P1 blocking:** yes — see findings.

| Area | Score | Floor | Status |
|---|---:|---:|---|
| Selected-direction execution | 2/20 | 16 | MISSED |
| Decision and metrics | 0/15 | 12 | MISSED |
| Baseline and controls | 0/15 | 12 | MISSED |
| Experiment sufficiency | 2/20 | 16 | MISSED |
| Reproducibility/artifacts | 0/10 | 8 | MISSED |
| Risk/license/safety | 0/10 | 8 | MISSED |
| Reviewability | 1/10 | 8 | MISSED |
| **Total** | **5/100** | **80** | **FAIL** |

### Findings

- **[P0][blocking] Location:** F1 lines 4–5, the entire "Plan".
  **Evidence:** "run one demo of candidate A; no baseline; one run; no thresholds; no comparison; no representative slice; no raw-data retention."
  **Why it matters:** a single uncontrolled demo of one candidate produces no comparative effect estimate and no decision rule; it cannot support "choose a parser library". This is the "missing/unusable" anchor, not a partial plan.
  **Required action:** replace the plan with a Gate 1 plan containing: user-selected directions with rationale and kill criteria; a real current baseline with the same workload, environment, and runtime; 1–3 experiments per direction each with a falsifier, slice, and stop/decision rule; metrics with MDE/thresholds; a representative slice and exclusions; commands, versions, seeds, and raw-data retention; risk/license/safety and timebox/abort.
  **Pass condition:** re-review finds every area at/above its floor, total ≥80, no P0/P1, and at most 3 unresolved P2.

- **[P1][blocking] Location:** F1 line 4, baseline/controls.
  **Evidence:** "no baseline".
  **Why it matters:** without the current parser there is no reference point; the demo cannot show that candidate A is better, worse, or equivalent, and no strawman control is excluded.
  **Required action:** measure the current parser as the baseline under the identical workload/environment/runtime, with paired or otherwise controlled comparison; forbid an artificially optimized or crippled baseline.
  **Pass condition:** baseline source/command/environment/hashes and the comparison design are specified and auditable.

- **[P1][blocking] Location:** F1 line 4, decision and metrics.
  **Evidence:** "no thresholds"; no metric is named anywhere.
  **Why it matters:** success and failure are undefined; no number from the demo could be judged against the decision.
  **Required action:** name the decision-relevant metrics (at minimum correctness/parity, latency, dependency/build cost), their thresholds or MDE, the decision rule for every outcome, and what success/failure means.
  **Pass condition:** metric table with estimator, threshold/MDE, decision rule, and success/failure interpretation exists and is testable.

- **[P1][blocking] Location:** F1 lines 4–5, experiment sufficiency.
  **Evidence:** "one run"; "no comparison"; "no representative slice".
  **Why it matters:** one run has no variance/CI and cannot separate a real effect from noise; no slice means coverage and exclusions are unknown; no edge/semantic cases are considered.
  **Required action:** specify repeats with warmup and CI, a corpus covering edge/semantic cases, a representative slice with entry points, and exclusions; define harness-validity controls.
  **Pass condition:** experiment table shows runs/CI, slice, exclusions, and at least one validity control with a falsifier.

- **[P1][blocking] Location:** F1 line 5, reproducibility/artifacts.
  **Evidence:** "no raw-data retention".
  **Why it matters:** the result cannot be replayed, audited, or recomputed; this violates the reproducibility area outright.
  **Required action:** retain raw data/logs, exact commands, versions, seeds, and artifacts; define retention/cleanup and a hash/provenance record.
  **Pass condition:** a rerun from the retained artifacts reproduces the recorded result, and provenance is hashed.

- **[P1][blocking] Location:** F1, absent risk/license/safety and timebox.
  **Evidence:** the whole fixture contains no dependency/license/CVE, sandbox, credential, data-security, timebox, or stop/abort statement.
  **Why it matters:** a plan may not be executable safely or within the decision timebox, and there is no abort rule.
  **Required action:** add dependency/license/CVE checks, sandbox isolation, credential/data handling, timebox, and stop/abort conditions.
  **Pass condition:** every risk-area element is present and testable in re-review.

---

## 3. F2 — user selection from an incomplete direction set, then no baseline

**Gate:** Gate 1 (plan review before any demo).
**Input hash:** `50dc2ed7684350153c23694e8daf398fea008771b14eb73b5ea117ef0a9bad71`
**Verdict:** `REVISE`
**Score:** 10/100 (gate).
**P0/P1 blocking:** yes.

| Area | Score | Floor | Status |
|---|---:|---:|---|
| Selected-direction execution | 4/20 | 16 | MISSED |
| Decision and metrics | 1/15 | 12 | MISSED |
| Baseline and controls | 0/15 | 12 | MISSED |
| Experiment sufficiency | 2/20 | 16 | MISSED |
| Reproducibility/artifacts | 1/10 | 8 | MISSED |
| Risk/license/safety | 0/10 | 8 | MISSED |
| Reviewability | 2/10 | 8 | MISSED |
| **Total** | **10/100** | **80** | **FAIL** |

### Findings

- **[P1][blocking] Location:** F2 lines 4–5, direction set / R1 coverage.
  **Evidence:** "User selected only D1 (candidate X) from a list that omitted the do-nothing option and an obvious existing-library alternative. User rationale: 'fast'."
  **Why it matters:** the user's choice was made against an incomplete menu. The rubric makes broad-direction coverage an R1 pre-check and forbids Gate 1 from vetoing the user's choice without new evidence and an explicit user decision. The omitted do-nothing option and the obvious existing library are new evidence that the selected set is biased; approving D1-only execution would silently convert an uninformed selection into the research frame. This is not a reviewer substitution of a preferred direction.
  **Required action:** return the gap to R1: add the do-nothing control (D0) and the existing-library alternative, or record a written reason each is excluded; present the completed set to the user; record an explicit user decision or waiver. Do not start Gate 1 execution until that decision is recorded.
  **Pass condition:** re-review sees a dated user decision on the completed direction set (or a written waiver naming the omission), plus user rationale and kill criteria for the selected direction(s).

- **[P0][blocking] Location:** F2 line 6, baseline/decision design.
  **Evidence:** "no baseline; one run; no thresholds".
  **Why it matters:** with no baseline, one run, and no thresholds, there is no comparison, no noise control, and no success criterion; the plan cannot support a parser-library choice.
  **Required action:** define a real current-parser baseline with the same workload/environment/runtime; define metrics, thresholds/MDE, decision rule, and success/failure meaning; run enough repetitions for variance/CI.
  **Pass condition:** the plan contains an auditable baseline, a metric/decision table, repeats with CI, and a defined outcome rule.

- **[P1][blocking] Location:** F2 line 6, experiment sufficiency / slice.
  **Evidence:** "one run"; "no slice".
  **Why it matters:** no representative slice, no edge/semantic cases, no exclusions, and no harness validity; a result on an unspecified workload could not be generalized even if it were repeated.
  **Required action:** define the representative slice (entry points, data, exclusions) and edge cases; add harness-validity controls; specify runs, warmup, variance/CI.
  **Pass condition:** slice + exclusions + edge-case corpus + validity controls are present and testable.

- **[P1][blocking] Location:** F2 line 6, reproducibility/artifacts.
  **Evidence:** "no raw data".
  **Why it matters:** the result cannot be audited or recomputed; the decision would be unreviewable.
  **Required action:** retain raw data, commands, versions, seeds, and provenance hashes; define retention/cleanup.
  **Pass condition:** the recorded result can be reproduced from retained artifacts.

- **[P1][blocking] Location:** F2, absent risk/license/safety/timebox.
  **Evidence:** no dependency/license/CVE, sandbox, credential, data-security, timebox, or stop/abort statement.
  **Why it matters:** the same risk-area gap as F1; a parser-library decision also needs license/dependency checks.
  **Required action:** add the risk/license/safety checks and a timebox with stop/abort rules.
  **Pass condition:** every risk-area element is present and testable.

---

## 4. F3 — single-run "2x faster; recommend adopt"

**Gate:** Gate 2 (a result and a draft conclusion exist). The underlying plan would also fail Gate 1 (one run each, no variance/CI, no representative slice, no raw data); that is context, not a second score here.
**Input hash:** `e78789bdb08498cf0c4a46e8bbdf3848e2c86b3d3e15b340505707fb745bd1d2`
**Verdict:** `REVISE`
**Score / floors:** N/A. Gate 2 defines claim status and a verdict, not a 100-point score or per-area floors. Claim/recommendation conditions fail instead.
**P0/P1 blocking:** yes.

### Claim verdicts

Reviewer-assigned claim IDs (the fixture cites none):

| Claim ID | Claim | Evidence | Status | Allowed wording |
|---|---|---|---|---|
| C-F3-1 | "X is 2x faster" | F3 line 4: one run each; no variance/CI; no representative slice; raw data not retained. | **unsupported as worded**; at most a single-run observation | "One paired run on an unspecified workload produced a 2x point ratio; not replicated, no CI, not established as a speedup." |
| C-F3-2 | "recommend adopt" | F3 line 5: draft conclusion; no claim IDs, pilot, risk acceptance, MIGRATION.md, or representative slice. | **unsupported** | "Candidate for further evaluation only; adopt is not supported." |

### Process findings

- **[P1][blocking] Location:** F3 lines 4–5, single-run headline claim.
  **Evidence:** "one run each; no variance/CI"; "X is 2x faster".
  **Why it matters:** one paired run cannot establish a 2x speedup; without variance or CI the number is indistinguishable from noise. Lowering confidence never turns a single run into `supported` (rubric line 52).
  **Required action:** rerun the decisive experiment with multiple paired repetitions, warmup, a pre-declared estimator, and a CI; retain the raw rep data; recompute the headline ratio.
  **Pass condition:** re-review can recompute the headline metric from raw data and sees a CI consistent with the allowed wording; otherwise the claim stays at most partial.

- **[P1][blocking] Location:** F3 line 4, raw-data retention.
  **Evidence:** "raw data not retained."
  **Why it matters:** without raw data the headline metric cannot be recomputed or audited; for an adopt/migrate claim, impossibility of rerun/recompute caps the claim at `partial` (rubric lines 49–52), and `partial` cannot support adopt/migrate (line 56).
  **Required action:** retain every raw run, command, environment record, and artifact; recompute the 2x ratio from raw data; name the exact file and command.
  **Pass condition:** raw data plus a recomputation trace exist and reproduce the reported number.

- **[P1][blocking] Location:** F3 line 4, representative slice / exclusions.
  **Evidence:** "no representative slice"; the workload is unnamed.
  **Why it matters:** adopt/migrate requires a representative slice (rubric lines 56–59). A single opaque workload cannot show the result survives the project's real entry points or that exclusions do not cover the decision.
  **Required action:** define the representative slice, entry points, and exclusions; rerun on it; state what the result does not cover.
  **Pass condition:** a representative-slice result supports the claim and the exclusions are explicit.

- **[P1][blocking] Location:** F3, Gate 2 inputs.
  **Evidence:** no approved plan, execution logs, raw data, or artifacts are supplied; no independent `CLAIMS.md` precedes the draft memo.
  **Why it matters:** the process audit (commands/environment, baseline fairness, variance/CI, harness validity, missing runs, cherry-picking, semantic parity, slice coverage) cannot be performed. The memo is unreviewable.
  **Required action:** supply the approved plan, logs, raw data, and artifacts; produce and hash an independent claims extraction before reading/rewriting the memo; then map memo claims to that extraction.
  **Pass condition:** re-review can perform the Gate 2 process audit from supplied evidence, and the memo is compared against the independent extraction.

- **[P1][blocking] Location:** F3 line 5, adopt recommendation prerequisites.
  **Evidence:** "recommend adopt" with no claim IDs, no pilot or written risk acceptance, no downstream `MIGRATION.md`, and a `partial`/unsupported evidence base.
  **Why it matters:** adopt/migrate requires all cited claims `supported`, measured here, a representative slice, a pilot or written risk acceptance, and a downstream `MIGRATION.md` (rubric lines 56–59). Any partial cited claim limits the recommendation to candidate/pilot.
  **Required action:** cite claim IDs; downgrade the recommendation to candidate/pilot, or satisfy every adopt prerequisite with evidence.
  **Pass condition:** every recommendation maps to claim IDs and its strongest allowed scope; no partial claim supports adopt/migrate.

**What cannot be concluded:** the size, generality, or production relevance of any speedup; any adopt/migrate recommendation. At most: "one unspecified single-run comparison produced a 2x point ratio; this is a hypothesis."

---

## 5. F4 — partial claim used to support adopt

**Gate:** Gate 2.
**Input hash:** `b236c66a1dc59f59a3aceea63fb4d706a762f0281dc56bae93840bbdf2fcb06c`
**Verdict:** `REVISE`
**Score / floors:** N/A. Gate 2 has no numeric score/floors; its claim and recommendation conditions fail.
**P0/P1 blocking:** yes.

### Claim verdicts

| Claim ID | Claim | Evidence | Status | Allowed wording |
|---|---|---|---|---|
| C-F4-1 | Unnamed "supporting claim" | F4 line 3: one supporting claim is `partial`; single sandbox run; no representative slice. | **partial** (as supplied) | "One sandbox run suggests a candidate result; not representative; cannot support adoption." |
| C-F4-2 | "Recommend adopt" | F4 line 4: draft memo, no cited claim IDs, no pilot/risk acceptance/MIGRATION.md. | **unsupported / limited to candidate or pilot** | "Candidate or pilot only; adopt is not supported while the cited claim is partial." |

### Process findings

- **[P1][blocking] Location:** F4 lines 3–4, partial claim supporting adopt.
  **Evidence:** "One supporting claim is `partial` (single sandbox run, no representative slice)." followed by "Draft memo: 'Recommend adopt.'"
  **Why it matters:** the rubric states that `partial` cannot support adopt/migrate (line 56) and that adopt/migrate requires all cited claims `supported` plus measured-here, representative slice, pilot or written risk acceptance, and downstream `MIGRATION.md` (lines 56–59). The memo's recommendation directly contradicts the supplied claim status.
  **Required action:** change the memo wording to candidate/pilot (or withdraw the adopt recommendation), or replace the partial claim with a `supported` claim that has a representative slice and the required adopt evidence. Cite claim IDs in the memo.
  **Pass condition:** re-review sees either a `supported` claim meeting every adopt prerequisite or a memo whose recommendation is explicitly limited to candidate/pilot; no partial claim supports adopt/migrate.

- **[P1][blocking] Location:** F4 line 3, representative slice.
  **Evidence:** "single sandbox run, no representative slice."
  **Why it matters:** a single sandbox run is not representative; even "measured here" evidence does not satisfy the representative-slice requirement. The claim is therefore capped at `partial`.
  **Required action:** run the decisive experiment on the representative slice (entry points, data, exclusions), or retain the partial status and limit all conclusions.
  **Pass condition:** the representative-slice evidence exists and the claim's status matches it.

- **[P1][blocking] Location:** F4 lines 3–4, recommendation mapping.
  **Evidence:** the fixture names no claim ID, gives no claim table, and the memo has no claim IDs or hash/stamp.
  **Why it matters:** every recommendation must cite claim IDs (rubric line 56); an unmapped "Recommend adopt" cannot be audited or delta-reviewed.
  **Required action:** assign claim IDs, add the claim table with evidence/status/confidence, cite the IDs in the memo, stamp the memo with SHA-256 and claim IDs, and record the delta-review trigger.
  **Pass condition:** every recommendation maps to claim IDs; the memo is stamped; any wording change triggers delta review.

- **[P1][blocking] Location:** F4 lines 3–4, adopt prerequisites.
  **Evidence:** no pilot, no written risk acceptance, and no downstream `MIGRATION.md` are supplied.
  **Why it matters:** these are explicit adopt/migrate prerequisites (rubric lines 56–59). Their absence independently blocks adoption, even if the claim were `supported`.
  **Required action:** supply a pilot or written risk acceptance and a downstream `MIGRATION.md`, or limit the recommendation to candidate/pilot.
  **Pass condition:** all adopt prerequisites are present, or the recommendation is limited accordingly.

- **[P1][blocking] Location:** F4, Gate 2 inputs.
  **Evidence:** no approved plan, execution logs, raw data, or artifacts; no independent `CLAIMS.md` before the memo.
  **Why it matters:** the claim status `partial` is asserted without inspectable evidence, and the process audit cannot be performed. The reviewer cannot verify the one claim or discover omitted claims.
  **Required action:** supply the plan, logs, raw data, artifacts, and an independent claims extraction; then map the memo to it.
  **Pass condition:** the audit is possible and the memo's claims are fully mapped.

**What cannot be concluded:** anything adopt-related. At most, the supplied text supports a candidate/pilot statement limited to one sandbox run, with no representative slice.

---

## 6. F5 — "Looks good. 90/100. Ship it."

**Gate:** Review artifact. It purports to be a Gate 1 review (it carries a 90/100 score), so the Gate 1 report template, explicit-feedback rules, and anti-patterns apply. If it were offered as a Gate 2 review, it fails the Gate 2 template and claim-table requirements even more completely.
**Input hash:** `f2b73c97383b3b5b03c7563b9935a3f1656dfaf6ecfe436457cca9881817ee9a`
**Verdict:** `REVISE` — reject this review; redo it from the evidence. It cannot be accepted as PASS.
**Score / floors:** No valid score or floors can be established. The claimed "90/100" is unsubstantiated by any finding, area table, floor, or evidence. As a review artifact it scores 0/100: it supplies none of the required review content. This 0 is a review-quality judgment, not a Gate 1 plan score.
**P0/P1 blocking:** yes.

### Findings

- **[P0][blocking] Location:** F5 line 3, entire review output.
  **Evidence:** "Looks good. 90/100. Ship it."
  **Why it matters:** this is a score with no findings, no gate table, no floors, and no residual risks — the exact anti-pattern at rubric line 146 ("A score with no gate table/residual risks"). "Looks good" is forbidden wording (line 82). It cannot be re-reviewed because no finding has a pass condition.
  **Required action:** redo as a Gate 1 review using the template: seven area scores, floors, total, P0/P1 list, unresolved P2 count, findings with severity/location/evidence/why/required action/pass condition, and residual risks.
  **Pass condition:** the template is complete; every finding has evidence and a pass condition; the total and floors are reproducible from the area table.

- **[P0][blocking] Location:** F5 line 3, reviewer identity/provenance.
  **Evidence:** no reviewer ID, model/provider, prompt hash, input hash, date, or verdict (`PASS`/`REVISE`).
  **Why it matters:** reviewer identity and input hashes are mandatory (rubric lines 3–5); without them the review is inadmissible and its independence cannot be checked. "Ship it" is not a verdict defined by the rubric.
  **Required action:** record reviewer identity/model/provider, prompt hash, input hash, date, and an explicit `PASS` or `REVISE`; list the inputs actually inspected.
  **Pass condition:** provenance fields and a rubric-defined verdict are present and match the supplied inputs.

- **[P1][blocking] Location:** F5 line 3, "Ship it" / unreviewed conclusion.
  **Evidence:** "Ship it."
  **Why it matters:** Gate 1 requires no demo before PASS (rubric line 36); Gate 2 allows a user-facing memo only after PASS (lines 63–64). "Ship it" sends an unreviewed conclusion to the user and bypasses both gates.
  **Required action:** withdraw the ship recommendation; start no demo and publish no conclusion; redo the review and obtain a valid PASS first.
  **Pass condition:** no ship/demo/conclusion action occurs before a compliant PASS; the re-review states its verdict explicitly.

- **[P1][blocking] Location:** F5 line 3, no evidence inspection.
  **Evidence:** the output contains no command, file, number, quote, raw-data reference, artifact, baseline check, variance/CI, or risk finding.
  **Why it matters:** Gate 1 review is not prose-only; it must inspect the plan's evidence design (and Gate 2 raw data/commands/artifacts). This output cannot distinguish a strong plan from an unusable one.
  **Required action:** inspect the plan/evidence and report concrete findings with locations and quotes; list residual risks and limitations.
  **Pass condition:** re-review cites exact plan sections/commands/data for each finding and shows the area scores derive from them.

- **[P1][blocking] Location:** F5 line 3, no findings with required fields.
  **Evidence:** no severity, location, evidence, why, required action, or pass condition; no non-blocking explanation.
  **Why it matters:** every finding must contain the six fields (rubric lines 71–87); "improve the plan"/"looks reasonable" are forbidden. The review cannot be actioned.
  **Required action:** list each finding with the six fields; mark blocking/non-blocking; for non-blocking findings, state why they do not block.
  **Pass condition:** every finding is complete and actionable; the verdict is consistent with the findings.

---

## 7. F6 — rev-2 plan (D0 control + D1–D4)

**Gate:** Gate 1 (plan review before any demo; the plan itself states no demos have run).
**Input hash:** `67367a02cdeced9b789c8392df1ed2915aee4ad966762310b5b0e4b3eb0c5ab3`
**Verdict:** **`PASS`**
**Score:** 87/100 (gate; ≥80 required).
**Floors:** all seven at/above floor.
**P0/P1 blocking:** none.
**Unresolved P2:** 3/3 (the gate allows at most 3).
**P3:** 4 (non-gating; listed for completeness).

| Area | Score | Floor | Status |
|---|---:|---:|---|
| Selected-direction execution | 16/20 | 16 | MET (at floor) |
| Decision and metrics | 14/15 | 12 | MET |
| Baseline and controls | 14/15 | 12 | MET |
| Experiment sufficiency | 17/20 | 16 | MET |
| Reproducibility/artifacts | 8/10 | 8 | MET (at floor) |
| Risk/license/safety | 9/10 | 8 | MET |
| Reviewability | 9/10 | 8 | MET |
| **Total** | **87/100** | **80** | **PASS** |

### Verification against the gate

- Gate 1 requires every area at/above floor, total ≥80, no P0/P1, and at most 3 unresolved P2. The table meets all four: total 87; zero P0/P1; exactly three unresolved P2.
- The plan explicitly stops before execution: "No demos have been run and no results are claimed here. Execution starts only after an independent re-review of this revision returns PASS" (lines 3–4). This PASS is therefore a plan approval, not a result or adopt approval.
- Each selected direction (D1–D4) has exactly three experiments plus the shared fit check (lines 59–61, 105–135), within the 1–3 experiment rule; D0 is the mandatory control. Each experiment row has a falsifier/gate; the slice is defined (lines 365–394); stop/decision rules are in §7 and §11.
- Baseline is a verbatim `src/dedupe.js` copy with a SHA-256 equality check against the source (lines 84–88, 137–164); candidates live in `spikes/` and do not import production code at measurement time (lines 89–91); D0 is never dropped (line 102); no optimized synthetic baseline is allowed (lines 102–103). This is a real baseline with a control, not a strawman.
- Metrics M1–M5 answer the decision, with MDE 20%, CI rules, decision rules, D4-specific M2-D4, and explicit success/failure/CANNOT-CONCLUDE meaning (lines 249–288). The memory metric is carefully named "post-call heap delta / post-call ΔRSS (lower bound on peak)" and forbids peak wording (lines 260, 281–283, 355, 551–553).
- Edge/semantic cases include `NaN`, `±0`, holes, `undefined`, `null`, booleans, strings, bigints, symbols, functions, shared/distinct objects, and mixed types (lines 187–220); harness validity includes a hand-computed expected table, an always-false mutant control that must be detected, DCE/result checks, fresh processes, alternating order, and pre/post hash checks (lines 96–100, 343–358). Runs/variance/CI are specified (7 reps, 3 warmups, paired ratios, 95% bootstrap CI; lines 257–260, 292–317).
- The representative slice and exclusions are explicit: two existing entry points, n up to 100k for memory and 16k for scaling, and a long exclusion list (lines 365–394). Reproducibility covers commands, Node/npm versions, seeds, raw data, no-lockfile rationale, retention, and cleanup (lines 15–41, 182–247, 431–504). Risk/license/safety covers no dependencies, no network, the unknown repo license/engines, sandbox confinement, synthetic data, resource limits, timebox, stop/abort, and residual risks (lines 396–429, 506–525). Reviewability is strong: assumptions A1–A8 are exposed, claims are testable, and the plan is executable from the stated commands (lines 63–78, 527–557).

### Non-blocking P2 findings

- **[P2][non-blocking] Location:** §2 rationale table, line 49; A7, line 77.
  **Evidence:** "The rationale bullets below are inferred and were not captured in-session (G7); they are recorded here for confirmation, not presented as the user's words." A7: "Direction rationale: the inferred bullets above"; "user correction is recorded; it does not reopen the approved set by itself."
  **Why it matters:** the selected-direction area requires the user rationale and kill criteria to be recorded. The kill criteria are recorded (lines 51–57), but the rationale is inferred, not user-captured; if corrected, the mechanism choice could change. It does not block because the directions, kill criteria, experiments, slice, and stop/decision rules are all recorded, and the plan transparently limits the inferred material to a rationale confirmation. The area still scores at its floor (16/20), not below it.
  **Required action:** before R3, capture a dated one-line user rationale for each of D1–D4 (or an explicit "no rationale supplied; proceed on the recorded kill criteria") in §2/A7. If a correction changes the direction set, record it through R1 rather than silently amending the plan.
  **Pass condition:** re-review sees dated user rationale or an explicit user acknowledgment in §2/A7; any direction change has an R1 decision record.

- **[P2][non-blocking] Location:** §12 commands, lines 471–484, and the artifact tree, lines 439–453.
  **Evidence:** the parity commands cover only `d0`, `control-mutant`, and `d1`; the memory command is only `d2`/`M-numbers`; no commands are shown for D2–D4 parity, D0/D1/D3/D4/M-objects memory, or D3's object-heavy memory. The tree omits `run-smalln.mjs` and `run-objectheavy.mjs`, which the commands invoke (lines 483–484), and `data/checksums.sha256` (line 453) has no producing command. §14 nevertheless says "commands are explicit and use only existing runtime/tools" (lines 529–531).
  **Why it matters:** the reproducibility/artifacts area names commands and artifacts; every gated cell should be runnable from the plan without inventing a command, and every planned artifact should have a producer. The omissions are mechanical (the same parameterized commands with another `--direction`), so they do not block a competent runner, but they are real reproducibility gaps and keep the area at its floor (8/10).
  **Required action:** complete the command manifest for every gated cell (D2–D4 parity; D0/D1/D3/D4 memory; M-objects) and every artifact; either list `run-smalln.mjs` and `run-objectheavy.mjs` in the tree or remove those commands; add the command that writes `data/checksums.sha256`; or explicitly label the block as representative examples plus a parameterized runner.
  **Pass condition:** re-review can map each of M1–M5's gated cells and each planned artifact to a specified command, and the tree matches every invoked script.

- **[P2][non-blocking] Location:** §11 fallback step 2, lines 415–416; M3 definition, line 259.
  **Evidence:** fallback: "Drop the n=16k scaling point (use 1k/4k; slope marked limited)." M3: "OLS slope of `log(median ms)` vs `log(n)` over n = 1k/4k/16k on L1"; "PASS iff slope ≤1.5 and R² ≥0.98". With two points, R² is 1.0 by construction, so a two-point line could satisfy the letter of M3 while carrying no curvature test.
  **Why it matters:** under time pressure the fallback could produce a spurious M3 PASS, and M3 gates D1–D3. The plan records fallback steps as limitations, but "slope marked limited" is not a defined gate exception. It does not block the normal path (three sizes fit the 7-minute budget), so this is P2 rather than P1.
  **Required action:** state explicitly that with fewer than three scaling sizes M3 is `CANNOT CONCLUDE` and cannot yield a D1–D3 M3 PASS; or provide a third size in the fallback (for example 2k/8k) and keep the three-point rule.
  **Pass condition:** re-review confirms M3 cannot PASS on fewer than three sizes, and the fallback table is consistent with M3's gate.

### P3 observations (non-gating)

- **[P3] L2 construction uniqueness is not audited.** §6 line 193 specifies "~10 % booleans/null/undefined/bigint/symbol ... with exactly one duplicate pair at indices n−2, n−1 ... unique otherwise". At n=10k that band is ~1,000 items, while booleans/null/undefined have fewer than ten distinct primitive values; the plan does not state the within-band counts or a uniqueness assertion. The raw L2 record audits zero counts and the expected result, not duplicate count/positions. **Required action:** specify the band composition and assert exactly one duplicate at n−2/n−1, aborting on any extra duplicate; record duplicate count/positions in the raw file. **Pass condition:** L2 raw records prove exactly one duplicate at the intended positions; otherwise the early-exit-bias control claim is invalid.
- **[P3] Dangling sentence.** Line 6 ends "the reviewed findings addressed here are -" with no list; `PLAN-REVISION.md` is referenced but not supplied. Complete the sentence or remove the dangling clause. Non-gating because the plan's substantive sections are unaffected; it does not become evidence that prior findings were fixed.
- **[P3] Memory run-count accounting.** §5 line 173 says "Memory 100k M-numbers (+ M-objects for D3) ... 6 runs — 120 s", while §8 memory step 3 says candidates get 3 runs each and baseline 1. "6 runs" is a cell count, not a process count; clarify the budget. Non-gating because the 20-minute timebox and fallback ladder cover the overrun.
- **[P3] M4 lower-bound gate.** §7 M4 and §8 memory protocol gate on a post-call (lower-bound) measurement while the decision may care about peak memory. The plan is careful to forbid peak wording (lines 281–283, 551–553), which makes the gate valid only for a post-call/retained-memory claim. Confirm that `DECISION.md` does not require a peak ceiling; if it does, add an in-call sampling method or narrow the decision. Non-gating because all allowed wording is explicitly limited to post-call.

### PASS limitations and conditions of this approval

- This is a review of the supplied F6 text. I did not read `PLAN-REVISION.md`, `DECISION.md`, `DIRECTIONS.md`, prior reviews, or the live repository. I therefore did not verify that rev 2 fixed earlier review findings; the plan's claim about its own revision is untrusted context. The PASS is for the supplied revision only.
- No demo, benchmark, or result was run or verified. No result, speedup, memory, fit, or adoption claim is approved by this PASS.
- The three P2s are non-blocking under the gate but should be closed or explicitly carried as recorded limitations before R3; the P3s are recommendations only.
- Any later change to thresholds, experiments, the slice, the corpus, or the allowed wording requires a delta review with a new input hash; this PASS does not carry over.
- This is a first-cycle PASS; the two-cycle STOP/WAIVER rule (rubric lines 35–38) is not engaged. A subsequent revision that changes the plan must be treated as a new input and re-reviewed.

---

## 8. F7 — compact plan that asserts coverage without supplying it

**Gate:** Gate 1.
**Input hash:** `74c4929bc60a06fd8722ebb69aeeb5d45581236ff9bfcc36a9b8145365c1000f`
**Verdict:** `REVISE`
**Score:** 57/100 (gate).
**P0/P1 blocking:** yes.
**Floors:** 6 of 7 missed (baseline only).

| Area | Score | Floor | Status |
|---|---:|---:|---|
| Selected-direction execution | 10/20 | 16 | MISSED |
| Decision and metrics | 11/15 | 12 | MISSED |
| Baseline and controls | 13/15 | 12 | MET |
| Experiment sufficiency | 8/20 | 16 | MISSED |
| Reproducibility/artifacts | 5/10 | 8 | MISSED |
| Risk/license/safety | 5/10 | 8 | MISSED |
| Reviewability | 5/10 | 8 | MISSED |
| **Total** | **57/100** | **80** | **FAIL** |

### Findings

- **[P1][blocking] Location:** F7 lines 4–6, selected-direction execution.
  **Evidence:** "Directions: D0 do-nothing + D1 candidate X; user selected both." There is no experiment table, no per-direction falsifier, no kill criteria, and no user rationale; the workload paragraph is a single shared bullet, not one to three experiments per direction.
  **Why it matters:** the area requires each selected direction to have 1–3 experiments, a falsifier, a slice, and a stop/decision rule, with user rationale and kill criteria recorded. "User selected both" records a selection, not an execution plan. A direction with no falsifier cannot be killed, and a D0/D1 comparison with no stated success rule cannot decide.
  **Required action:** add a D0 and a D1 experiment table (1–3 experiments each) with procedure, falsifier/kill criterion, artifact, slice, and stop/decision rule; record the user rationale and kill criteria for each direction (or an explicit user acknowledgment that no rationale was supplied).
  **Pass condition:** re-review sees per-direction tables with falsifiers and stop/decision rules, plus recorded rationale/kill criteria; the area scores at least 16/20.

- **[P1][blocking] Location:** F7 lines 6–7, experiment sufficiency.
  **Evidence:** "one representative project slice with two entry points; exclusions listed"; no edge/semantic cases (no `NaN`, `±0`, holes, `undefined`, objects, mixed types), no harness-validity control, no paired/warmup details beyond "5 runs, warmup, median/CI", no CI method, and no exclusions are actually listed.
  **Why it matters:** the area requires edge/semantic cases, runs/variance/CI, a representative slice with exclusions, and harness validity. The fixture asserts the slice and exclusions but does not define them; a single opaque slice plus five unspecified runs cannot show coverage or validity, and a claimed median/CI with no estimator is untestable.
  **Required action:** define the corpus (edge/semantic cases), harness-validity controls (an oracle/expected-result table and a deliberate negative control), the paired/warmup/repetition design and estimator (median of paired ratios with a stated bootstrap CI), the slice's two entry points and exclusions, and the expected result per workload.
  **Pass condition:** re-review can execute the corpus and validity checks from the plan and verify the estimator and exclusions; the area scores at least 16/20.

- **[P1][blocking] Location:** F7 line 10, reproducibility/artifacts.
  **Evidence:** "Artifacts: PLAN, raw data, env, hashes"; no commands, no runtime/tool versions, no seed list (only "fixed seed"), no lockfile/image hash, and no retention/cleanup procedure.
  **Why it matters:** the reproducibility area requires commands, versions, seeds, raw data, lockfile/image hash, retention, and cleanup. "Env, hashes" names outputs without saying what is recorded or how any result is reproduced; the plan is not executable from its own text.
  **Required action:** list exact commands and exit codes, runtime/tool versions, all seeds, the environment/hash manifest, the raw-data layout, retention, and cleanup; state the no-lockfile case explicitly if there is no lockfile.
  **Pass condition:** a third party can rerun every cell from the written commands and compare hashes/raw data; the area scores at least 8/10.

- **[P1][blocking] Location:** F7 lines 8–10, risk/license/safety.
  **Evidence:** "risk/license/safety checks" is named with no content; no dependency/license/CVE analysis, no sandbox/isolation, no credential or data-security statement, and no concrete stop/abort conditions (the "20-minute timebox" is stated, but stop rules are only asserted in the metrics line).
  **Why it matters:** the risk area requires dependency/license/CVE, sandbox isolation, credentials, data/security, timebox, and stop/abort. A label is not a check; a reviewer cannot verify any of them.
  **Required action:** specify the dependency/license/CVE position, sandbox/write scope, credential and data handling, resource limits, timebox, and per-experiment/harness stop and abort conditions.
  **Pass condition:** every risk-area element is explicit and testable; the area scores at least 8/10.

- **[P1][blocking] Location:** F7 lines 6–9, decision and metrics / reviewability.
  **Evidence:** "Metrics: correctness/parity, median latency, dependency/build cost; MDE 20%; decision rule and stop/abort conditions" — the metrics are named, but no threshold per metric, no success/failure meaning, no decision rule text, and no stop/abort conditions are written. "Exclusions listed" (line 7) is not followed by a list. There is no assumptions/open-questions section and no executable step sequence.
  **Why it matters:** the decision area requires MDE/thresholds/decision rule and success/failure meaning; reviewability requires testable claims, exposed assumptions, and executability without invented steps. The compact plan asserts all of these without supplying them, so the reviewer would have to invent the decision rule, thresholds, and exclusions to approve it. The reviewability floor is missed and decision/metrics sits just below its floor (11/15).
  **Required action:** write the metric table (estimator, threshold/MDE, decision rule for pass/fail/inconclusive), the success/failure interpretation, the stop/abort conditions, the actual exclusion list, and an assumptions/open-questions section; add the executable step sequence.
  **Pass condition:** re-review sees a complete metric/decision table, actual exclusions, and an executable sequence; the decision and reviewability areas reach their floors.

**What would change this verdict:** a revision that supplies the content above. The fixture's problem is not brevity but unverifiable assertion; adding the missing content is sufficient, and a second review cycle is available before the STOP/WAIVER limit.

---

## 9. Floor summary across Gate 1 fixtures

| Input | Sel-dir (16) | Decision (12) | Baseline (12) | Experiment (16) | Repro (8) | Risk (8) | Reviewability (8) | Total (80) | Result |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| F1 | 2 MISS | 0 MISS | 0 MISS | 2 MISS | 0 MISS | 0 MISS | 1 MISS | 5 | FAIL |
| F2 | 4 MISS | 1 MISS | 0 MISS | 2 MISS | 1 MISS | 0 MISS | 2 MISS | 10 | FAIL |
| F6 | 16 MET | 14 MET | 14 MET | 17 MET | 8 MET | 9 MET | 9 MET | 87 | **PASS** |
| F7 | 10 MISS | 11 MISS | 13 MET | 8 MISS | 5 MISS | 5 MISS | 5 MISS | 57 | FAIL |

**Floors not met:** F1 all seven; F2 all seven; F7 six (selected-direction execution, decision and metrics, experiment sufficiency, reproducibility/artifacts, risk/license/safety, reviewability); F6 none. F3/F4/F5 have no Gate 2/Gate 1 area floors to apply: F3/F4 fail Gate 2 conditions, and F5 supplies no gate table at all.

---

## 10. Gate 2 condition summary (F3, F4, F5)

| Condition (rubric lines 66–69) | F3 | F4 | F5 |
|---|---|---|---|
| Every claim `supported` or `partial` with an explicit limit | FAIL — headline "2x faster" unsupported; adopt unsupported | FAIL — the only cited claim is `partial`, and the memo adopts anyway | FAIL — no claim table at all |
| No `partial` supporting adopt/migrate | FAIL — adopt is recommended from single-run/unsupported evidence | FAIL — `partial` directly supports "Recommend adopt" | FAIL — no review to check |
| Every recommendation mapped to claim IDs | FAIL — no claim IDs | FAIL — no claim IDs | FAIL — no recommendations or findings |
| No unreviewed memo change / memo stamped | Cannot verify — no memo hash/stamp | Cannot verify — no memo hash/stamp | N/A — no memo reviewed |
| Process audit possible (commands, environment, variance/CI, fairness, missing runs, slice, parity) | FAIL — no logs/raw data/artifacts | FAIL — no logs/raw data/artifacts | FAIL — no evidence inspected |
| Adopt/migrate prerequisites: all cited claims supported + measured-here + representative slice + pilot or written risk acceptance + downstream `MIGRATION.md` | FAIL — none present | FAIL — slice, pilot, risk acceptance, `MIGRATION.md` absent | N/A |

---

## 11. Calibration observations (method, not an answer key)

1. **The decisive difference is specificity/executability, not length.** F6 is long, but the PASS is driven by testable falsifiers, a real baseline, a defined slice, retained raw data, and an explicit claim/wording boundary. F7 is short but also asserts coverage it does not supply; length alone would not have separated them.
2. **Missing direction coverage is an R1 issue, not a Gate 1 veto.** F2 was failed for its missing baseline/design as well as the incomplete direction set; the required action is a user re-decision, not the reviewer substituting a preferred direction (rubric lines 12–15).
3. **`partial` is a hard ceiling for adopt/migrate.** F4 is the cleanest test: even one partial supporting claim makes "Recommend adopt" invalid; the correct output is candidate/pilot or more evidence (rubric lines 54–59).
4. **A single run is never `supported`.** F3 fails both at the performance claim and at the adopt prerequisite; lowering confidence does not rescue it (rubric line 52).
5. **A score without findings is not reviewable.** F5 fails regardless of whether "90/100" happens to be right; the anti-pattern is the absence of a gate table, floors, and six-field findings (rubric lines 71–87, 142–152).
6. **No expected outcome was assumed.** Each verdict follows from the rubric's gate and floor text; the fact that one fixture is a detailed plan did not pre-select PASS, and the fact that one is dense did not pre-select REVISE.
7. **Real-run caveats.** This is a calibration pass with one reviewer across all seven; the rubric requires different plan and results reviewers in a real run. Gate 2 was also not executable in the prescribed claims-first order for F3/F4 because no raw evidence was supplied; that itself is a blocking finding, not a reason to soften the verdict.
8. **Two-cycle limit.** F1, F2, F7 and F3/F4 are first-cycle `REVISE`s. A second failed cycle would become `STOP`/`WAIVER` (rubric lines 35–38 and 69), not a silent PASS.

---

## Appendix A — exact delegation prompt text hashed for the reviewer record

The SHA-256 recorded in §1 is over the following text, UTF-8, with one trailing LF:

```text
你是独立的 research calibration reviewer(不是作者)。只读评审 `docs/calibration-blind/` 下的 F1-F7 七个输入,并只使用 `skills/rd-workflow-research-review.md` 的 Gate 1/2 规则。不要读取 `docs/fixtures/`、`expected.json`、`docs/calibration-inputs/`、任何 prior review 或答案键。对每个输入独立判断 verdict/score/floors/findings,不要假设 expected。把结果写到 `docs/e2e/0.8/research/CALIBRATION-INDEPENDENT-R4.md`,包含 reviewer record、输入 SHA-256、每个输入 verdict/finding、哪些不满足 floor;不要修改输入。最终回复:一句话 verdict summary + 文件路径。
```

## Appendix B — review integrity

- Inputs were read only from `docs/calibration-blind/F1`–`F7`; the rubric was read from `skills/rd-workflow-research-review.md`.
- No fixture was edited, renamed, or deleted.
- The input SHA-256 values in §1.1 were re-computed after this report was written and matched the pre-review values.
- No `docs/fixtures/`, `expected.json`, `docs/calibration-inputs/`, prior review, or answer-key content was opened.
- The report was written at the requested path, `docs/e2e/0.8/research/CALIBRATION-INDEPENDENT-R4.md`.

**Reviewer signature:** `calibration-reviewer-5`, independent calibration review R4, 2026-11-25 (Asia/Shanghai).

# CALIBRATION-INDEPENDENT-R3 — independent research-gate review

**Reviewer:** `calibration-reviewer-4` (independent; non-author)
**Model / provider:** `deepseek-flash` / DeepSeek
**Date:** 2026-11-25 (Asia/Shanghai)
**Scope:** blind calibration against the seven inputs in `docs/calibration-inputs/`
**Rule source:** `skills/rd-workflow-research-review.md` (Gate 1, Gate 2, explicit feedback rules, calibration section)
**Rule source SHA-256:** `80ccf3b9f6c320932a2e8d3215bd8df8f27ba2f5c9e626a7f05bcdf23513ab13`

## 0. Reviewer record

| Field | Record |
|---|---|
| Reviewer ID | `calibration-reviewer-4` |
| Role | Independent plan/results reviewer. Not the author, experimenter, or synthesizer of any input. |
| Model / provider | `deepseek-flash` / DeepSeek |
| Calibration round | R3 (independent; not a replacement for an earlier reviewer; no earlier verdict of mine exists in this round) |
| Rule source | `skills/rd-workflow-research-review.md` only; SHA-256 above. No other rubric/skill used for verdicts. |
| Inputs read | The seven files listed in §1, plus `docs/calibration-inputs/README.md` (5-line directory policy; no expected outcomes) and directory listings. |
| Not read | `docs/fixtures/`, `docs/fixtures/research/README.md`, `expected.json`, any prior review, any answer key, the frozen calibration plan. Filenames of prior review files were visible in directory listings; their contents were **not** opened. |
| Inputs modified | None. Re-hashed after this report was written; hashes unchanged (§8). |
| Verdict formation | Each verdict below was formed from the input text and the Gate 1/2 rules before any prior verdict was consulted; no prior verdict was consulted at all. |
| Prompt hash | The R3 delegation prompt is lead-owned and was not supplied as a reviewer-readable file; no independent prompt hash is asserted here. The lead should record the delivered prompt hash in `REVIEW-LOG.md`. |

**N/A convention.** Gate 1 has a 100-point scale with area floors; Gate 2 has no numeric point scale and is decided by claim status and recommendation mapping. For Gate 2 inputs, “score: N/A (claim gate)” is used, and the Gate 2 conditions are listed instead of area floors. `vague-review.md` is not a plan or results dossier; it is a purported review artifact and is tested against the explicit feedback rules and report templates.

## 1. Inputs and SHA-256

| # | File | Bytes | SHA-256 |
|---:|---|---:|---|
| 1 | `docs/calibration-inputs/floor-boundary.md` | 546 | `12c5b2818a7b5bb25e708f19dcc4c4ee680724c04ea45970fdd584d820ded41a` |
| 2 | `docs/calibration-inputs/narrow-directions.md` | 293 | `fe149d4c8a41d77ec9e0fdf71c2179b268aeb6d6a31085fbef875f07705268bb` |
| 3 | `docs/calibration-inputs/partial-adopt.md` | 137 | `91b525208d118e2f6d4dbcfc9ecb37935650080fb8dedf4a897f172e273ab001` |
| 4 | `docs/calibration-inputs/single-run-strong.md` | 242 | `2f8dbc54a46c144133247ab8cb5bf22f97795b593fb520cbb77bc758141c5169` |
| 5 | `docs/calibration-inputs/strong-plan.md` | 43010 | `7976d59fc308871863cec7ca5cf94f5599b59ce10ec8a017d37aa08005fe2eab` |
| 6 | `docs/calibration-inputs/vague-review.md` | 72 | `d127a9ab355e7131a7ac56e1ef46dc5eee86cf54e5a55a3358b6aaecc74bd321` |
| 7 | `docs/calibration-inputs/weak-plan.md` | 191 | `08c55314f8ed2e504776d2a2eb7f233e71f32984f6232ba56ced3c95457c382f` |

**Combined corpus hash** (the seven `sha256sum` lines sorted by filename, hashed):
`80218d9f2ab3e08f9da76529fc5626049adfa24f5fe5ace863535688a9fec6f2`.

## 2. Method

**Gate 1.** Checked the selected-direction execution, decision/metrics, baseline/controls, experiment sufficiency, reproducibility/artifacts, risk/license/safety, and reviewability floors; total `>=80`; no P0/P1; at most three unresolved P2. Anchors: 0 missing/unusable, 50 present with a material gap, 100 specific/testable/sufficient. Findings include severity/blocking, location, evidence, why it matters, required action, and pass condition. A finding is non-blocking only with an explicit reason.

**Gate 2.** Checked claim statuses (`supported`/`partial`/`unsupported`), allowed wording, `partial` never supporting adopt/migrate, recommendation mapping and cited claim IDs, measured-here/representative-slice/pilot-or-risk-acceptance/downstream `MIGRATION.md` for adopt/migrate, independent `CLAIMS.md` before memo reading, rerun/recompute of decisive adopt/migrate/security claims, memo stamping, and process audit. Lowering confidence is never treated as making a single run `supported`.

**Independence.** No experiment was run and no input was edited. The review is limited to the supplied text. For `strong-plan.md`, the externally referenced `DECISION.md`, `DIRECTIONS.md`, `PLAN-REVISION.md`, and prior `PLAN-REVIEW.md` are outside the supplied blind corpus and were not read; the plan’s own recorded decision, directions, kill criteria, and assumptions are the basis for scoring. Claims that prior review findings were addressed were **not** treated as evidence.

## 3. Verdict summary

| Fixture | Gate | Verdict | Score | Floors below | P0/P1 | Unresolved P2 |
|---|---|---|---:|---|---|---:|
| `floor-boundary.md` | Gate 1 | **PASS** | **80/100** | none (all seven at floor) | none | 3/3 (at limit) |
| `strong-plan.md` | Gate 1 | **PASS** | **93/100** | none (all above floor) | none | 2/3 |
| `weak-plan.md` | Gate 1 | **REVISE** | **10/100** | all seven | P0 ×1, P1 ×3 | n/a |
| `narrow-directions.md` | Gate 1 | **REVISE** | **12/100** | all seven | P0 ×1, P1 ×3 | n/a |
| `partial-adopt.md` | Gate 2 | **REVISE** | N/A (claim gate; 0/6 conditions, incl. input order) | Gate 2 conditions not met | P1 ×2, P2 ×1 | n/a |
| `single-run-strong.md` | Gate 2 | **REVISE** | N/A (claim gate; 0/6 conditions, incl. input order) | Gate 2 conditions not met | P1 ×3, P2 ×1 | n/a |
| `vague-review.md` | review-artifact integrity | **REVISE / inadmissible** | N/A (asserted 90/100 withdrawn; 0/6 feedback elements) | no gate table or floors to verify | P1 ×2, P2 ×1 | n/a |

No PASS fixture has a P0/P1. The two Gate 1 PASS verdicts are not transferable to the REVISE fixtures and carry the limitations recorded in §§4.1–4.2.

## 4. Gate 1 fixtures

### 4.1 `floor-boundary.md` — PASS, 80/100 (at the gate boundary)

**Header:** Verdict `PASS`; total 80/100; unresolved P2: 3/3 (maximum allowed); P0/P1: none. The plan is terse but every Gate 1 area is present at its floor; the three P2s are the gaps that keep each area at, not above, its floor. No P2 is blocking: none removes a required control, metric, comparison, slice, or artifact; each is a pre-execution specification gap that can be closed without changing the experiment design.

| Area | Score / floor | Status |
|---|---:|---|
| Selected-direction execution | 16/20 | at floor |
| Decision and metrics | 12/15 | at floor |
| Baseline and controls | 12/15 | at floor |
| Experiment sufficiency | 16/20 | at floor |
| Reproducibility/artifacts | 8/10 | at floor |
| Risk/license/safety | 8/10 | at floor |
| Reviewability | 8/10 | at floor |
| **Total** | **80/100** | gate is `>=80`; exactly at boundary |

**Findings**

- **[P2][non-blocking] Location:** `floor-boundary.md:4` (directions) and `:8` (metrics). **Evidence:** “Directions: D0 do-nothing + D1 candidate X; user selected both”; the metrics line names a decision rule but no per-direction experiment mapping, falsifier table, user rationale, or kill criteria are stated. **Why:** Gate 1 selected-direction execution expects 1–3 experiments, a falsifier, a slice, a stop/decision rule, and recorded user rationale/kill criteria per selected direction. The shared workload/metrics can cover both directions, so this is a specification/record gap, not a missing comparison; it keeps the area at its floor rather than below it. **Required action:** add a two-row per-direction table (experiment(s), falsifier, slice, stop/decision rule) and record the user rationale/kill criteria before execution. **Pass condition:** re-review can map D0 and D1 each to 1–3 experiments and a falsifier, and the user rationale/kill criteria are recorded.

- **[P2][non-blocking] Location:** `floor-boundary.md:8` (`Metrics`). **Evidence:** “MDE 20%; decision rule and stop/abort conditions; 20-minute timebox” names these controls but does not state the latency/correctness thresholds, the CI method behind “median/CI” (`:7`), the success/failure meanings, or the stop/abort text. **Why:** the metrics chosen do answer the decision and the MDE is declared, so the decision/metrics floor is met; without frozen threshold/rule text an executor must invent parameters, and a post-hoc threshold cannot be ruled out. This is a P2 parameterization/reproducibility gap, not a P1 evidence-design gap. **Required action:** freeze per-metric thresholds, the CI method, the decision rule, and success/failure/cannot-conclude wording before execution. **Pass condition:** the numeric thresholds and rule text are present and consistent with the 20% MDE; a second operator can apply the rule without inventing values.

- **[P2][non-blocking] Location:** `floor-boundary.md:9-10` (`Artifacts`). **Evidence:** “Artifacts: PLAN, raw data, env, hashes; risk/license/safety checks” asserts artifacts and checks but does not list Node/runtime versions, concrete seed values, commands, a baseline-copy/hash equality check, retention/cleanup, or the enumerated dependency/license/CVE/sandbox/credential checks. **Why:** artifacts/env/hashes and risk checks are present at floor level, so the reproducibility and risk floors are met; the gap is definition, not absence. It is P2 (material/fixable) because the plan is not yet independently executable, but it does not invalidate the comparison design. **Required action:** specify the env manifest fields, seeds, commands, baseline hash check, retention/cleanup, and the risk/license/safety checklist. **Pass condition:** a second operator can rerun and audit without inventing commands or checks; the risk surface is enumerated rather than referenced.

**Gate boundary note:** with exactly three unresolved P2 the fixture passes `at most 3 unresolved P2`. A fourth unresolved P2, any P0/P1, or any area moving below its floor would flip the verdict to `REVISE`. The three P2s are recommendations, not PASS conditions; the plan already contains each required control at floor level.

### 4.2 `strong-plan.md` — PASS, 93/100

**Header:** Verdict `PASS`; total 93/100; unresolved P2: 2/3; P0/P1: none. No demo has been run; the plan is a rev-2 plan and says execution starts only after independent re-review PASS (`strong-plan.md:3-7,566-571`). The baseline is a verbatim copy with hash equality, the parity oracle is controlled (hand-computed table + always-false mutant + D1 `±0` positive control), the timed-cell result checks are non-exempt, provenance is handled by file hashes rather than a non-detecting `git status`, and the decision rules are frozen before measurement. The two P2s are record/recipe gaps, not evidence-design failures.

| Area | Score / floor | Status |
|---|---:|---|
| Selected-direction execution | 18/20 | above floor |
| Decision and metrics | 15/15 | above floor |
| Baseline and controls | 15/15 | above floor |
| Experiment sufficiency | 18/20 | above floor |
| Reproducibility/artifacts | 9/10 | above floor |
| Risk/license/safety | 9/10 | above floor |
| Reviewability | 9/10 | above floor |
| **Total** | **93/100** | gate is `>=80` |

**Findings**

- **[P2][non-blocking] Location:** `strong-plan.md:49-51` and `:79` (A7). **Evidence:** “The rationale bullets below are inferred and were not captured in-session (G7); they are recorded here for confirmation, not presented as the user’s words”; A7 records the same. Kill criteria for D1–D4 are recorded in the §2 table (`:53-59`). **Why:** Gate 1 selected-direction execution expects the user rationale/kill criteria to be recorded. The kill criteria are recorded and the direction set is user-approved; the inferred rationale is explicitly flagged and does not alter the experiment design, so this is a material traceability gap (P2), not a P1 invalidation. **Required action:** obtain and record explicit user confirmation of the rationale (or keep A7 as a disclosed assumption with the confirmation deadline) before R3 conclusions; do not present inferred rationale as the user’s words. **Pass condition:** the rationale record is confirmed or explicitly time-boxed as an assumption; the kill criteria for each direction remain recorded and unchanged.

- **[P2][non-blocking] Location:** `strong-plan.md:460-495` (the “Commands to be executed at R3” block) against `:170-179` (the §5 cell matrix). **Evidence:** the command block runs parity only for `d0`, `control-mutant`, and `d1` (`:474-477`) and memory only for `d2`/`M-numbers` (`:484-485`); §5 budgets parity for D0–D4 + mutant and memory for D0–D4 plus D3’s `M-objects`. Parity D2–D4, memory D0/D1/D3/D4, and the `M-objects` cell are therefore absent from the block. The S1/S2 commands are present (`:486-487`), so this is a partial recipe rather than an empty one. **Why:** the block is labelled the commands to execute, but it is a representative subset. An operator following it literally could omit gated cells, and a results reviewer could not reproduce every cell from the recipe. The §5 matrix, §8 protocol, and harness CLI make the missing commands inferable, so the evidence design is intact; the gap is recipe completeness (P2). **Required action:** replace the subset with an explicit loop over D0–D4 for parity and memory (including D3 `M-objects`), or label the block a template and attach the full matrix. **Pass condition:** every cell named in §5 has a command and an output path; the command block and §5 agree.

- **[P3][non-blocking] Location:** `strong-plan.md:259,353` with the disclosed limitation at `:362-365`. **Evidence:** 7 reps and a 10k-resample percentile bootstrap over 7 paired ratios for a 20% MDE. **Why:** the CI is coarse; a true effect near 2× can land in `CANNOT CONCLUDE`, and the plan already lists “7 reps (wide CI)” as a validity limit. This is disclosed and the decision rule treats CI overlap as no conclusion, so it is minor. **Required action:** none for PASS; report the CI and the 7-rep limit in the memo. **Pass condition:** the memo carries the limit; no claim relies on nominal significance.

- **[P3][non-blocking] Location:** `strong-plan.md:170-182` (budget) and `:301-303` (3 warmups + 5 inner calls per fresh process). **Evidence:** scaling is budgeted at 60 s for 3 sizes × 7 reps × 5 directions, while the baseline is O(n²) and the 16k cell alone runs the baseline 8 times per timed process across 7 reps. **Why:** the baseline 16k cells may consume most of the scaling budget; the fallback ladder (`:416-421`) drops 16k if at risk, which would leave M3 with two points and a limited slope. This is a feasibility risk, not a wrong gate; it is disclosed and has a fallback. **Required action:** pre-flight the slowest scaling cell before committing the 7-minute R3, and record the fallback if it exceeds budget. **Pass condition:** the pre-flight timing fits the budget, or the fallback/dropped point is recorded as a limitation.

- **[P3][non-blocking] Location:** `strong-plan.md:352` (“loadavg recorded and cells flagged if the machine is busy”). **Evidence:** no load-average threshold or busy-cell action is defined. **Why:** a busy machine is a known noise source; the flag helps, but without a threshold the experimenter decides ad hoc. Minor because paired alternating order and raw loadavg are retained. **Required action:** define the busy threshold and the action (rerun/flag) before R3. **Pass condition:** the threshold and action are recorded.

- **[P3][non-blocking] Location:** `strong-plan.md:77,513-514`. **Evidence:** the repo has no `LICENSE` and no `engines` field; the plan records this and defers license/engines resolution to Development if adoption is considered. **Why:** there are no new dependencies or network calls, so no new license/CVE surface is introduced; the unknown repository license is a real limitation but explicitly out of scope for a research plan that does not adopt. Minor. **Required action:** keep the limitation; do not claim license clearance. **Pass condition:** no adoption/migration claim is made in research; the limitation is carried to the memo.

- **[P3][non-blocking] Location:** `strong-plan.md:369-374` (slice entry points). **Evidence:** entry point 2 is a “spike-local equivalent test” that imports the candidate via an env-selected path; the production test file itself is never modified and is rerun unchanged for M5, so it does not exercise the candidate. **Why:** the plan is transparent about this, and the production test is correctly used only as a fit check; the phrase “both supported call paths” could be misread as the same test exercising the candidate. Minor wording/representativeness issue. **Required action:** state in the memo that the candidate’s test path is spike-local and that the production suite validates `src`, not the candidate. **Pass condition:** the slice wording makes the distinction explicit.

**Why this passes:** all seven areas are at or above floor, total 93, no P0/P1, and two unresolved P2 are within the three-P2 allowance. The remaining risks are disclosed validity limits (single host, single Node version, synthetic data, post-call memory), not hidden gaps. The plan’s status is a plan only; no claim in it is treated as measured.

### 4.3 `weak-plan.md` — REVISE, 10/100

**Header:** Verdict `REVISE`; total 10/100; every gate area is below floor; one P0 and three P1 blocking findings. The input is a one-demo plan with no baseline, comparison, thresholds, slice, or data retention (`weak-plan.md:3-5`); it cannot support a parser-library choice.

| Area | Score / floor | Status |
|---|---:|---|
| Selected-direction execution | 2/20 | below floor |
| Decision and metrics | 1/15 | below floor |
| Baseline and controls | 0/15 | below floor |
| Experiment sufficiency | 2/20 | below floor |
| Reproducibility/artifacts | 1/10 | below floor |
| Risk/license/safety | 2/10 | below floor |
| Reviewability | 2/10 | below floor |
| **Total** | **10/100** | below 80 |

**Blocking findings**

- **[P0][blocking] Location:** `weak-plan.md:3-4` (plan line). **Evidence:** “run one demo of candidate A; no baseline; … no comparison.” **Why:** without the real current parser and a comparison, no result can be attributed to candidate A; the plan cannot support the decision (P0), and the baseline/controls floor is 0/12. **Required action:** add the real current-parser baseline under the same workload, environment, and runtime, and a candidate-vs-baseline comparison; keep the baseline byte-identical and record its provenance/hash. **Pass condition:** re-review sees a real baseline and a same-workload comparison whose result can support or falsify candidate A.

- **[P1][blocking] Location:** `weak-plan.md:4` (runs) and `:4-5` (no thresholds). **Evidence:** “one run”; “no thresholds”; no variance/CI and no pass/fail rule. **Why:** a single unreplicated run cannot separate signal from noise; there is no MDE or decision rule, so no result can be adjudicated. The experiment-sufficiency and decision/metrics floors fail. **Required action:** specify 1–3 experiments with repetitions/warmup, a variance/CI method, an MDE and success/failure thresholds, and a stop/decision rule. **Pass condition:** the plan contains frozen thresholds, a CI/replication protocol, and a decision rule that another operator can apply.

- **[P1][blocking] Location:** `weak-plan.md:5` (no slice; no raw-data retention). **Evidence:** “no representative slice; no raw-data retention.” **Why:** the measured unit is undefined and no raw evidence survives for audit or rerun; the experiment-sufficiency, reproducibility, and slice requirements fail. **Required action:** define the representative project slice and entry point(s), list exclusions, and retain raw JSON/logs with env, versions, seeds, commands, and hashes. **Pass condition:** the slice/exclusions are specified and raw data plus the reproduction manifest are retained.

- **[P1][blocking] Location:** `weak-plan.md:3-5` (whole input). **Evidence:** no risk/license/dependency/sandbox/credential/data check, no timebox, and no stop/abort condition. **Why:** the risk/license/safety floor (8) is not met; an unreviewed demo has no abort path. **Required action:** add the dependency/license/CVE check, sandbox/write scope, data/security/credential statement, timebox, and stop/abort conditions. **Pass condition:** those checks and stops are recorded and applicable to the demo.

- **[P2][non-blocking] Location:** `weak-plan.md:3-4` (no user-direction record). **Evidence:** “candidate A” appears without a user-selected direction set or rationale/kill criteria. **Why:** even after the execution gaps are fixed, the direction would lack a recorded user rationale/kill criteria. Non-blocking relative to the P0/P1 failures because the plan already fails Gate 1 on baseline/metrics; this must be fixed for any future PASS. **Required action:** record the user-selected direction set, rationale, and kill criteria. **Pass condition:** the direction record is present and traceable to the user.

**Summary:** all seven areas are below floor; the P0 no-baseline finding alone blocks the gate. Verdict `REVISE`; no demo may start.

### 4.4 `narrow-directions.md` — REVISE, 12/100

**Header:** Verdict `REVISE`; total 12/100; every gate area is below floor; one P0 and three P1 blocking findings, plus one non-blocking P2 for the upstream direction-set coverage defect. The plan runs only D1 with no baseline, one run, no thresholds, no slice, and no raw data (`narrow-directions.md:6`), so even the user’s selected direction cannot be evaluated.

**Gate nuance applied:** the omission of the do-nothing option and an obvious existing-library alternative is an **R1 broad-direction-set coverage** defect. Gate 1 “checks execution of the user’s selected directions” and says not to veto the user’s choice without new evidence and an explicit user decision. The direction-set omission is therefore recorded/escalated as a non-blocking P2 for Gate 1, not used as a Gate 1 veto. The blocking findings below are execution failures independent of the direction set.

| Area | Score / floor | Status |
|---|---:|---|
| Selected-direction execution | 4/20 | below floor |
| Decision and metrics | 2/15 | below floor |
| Baseline and controls | 0/15 | below floor |
| Experiment sufficiency | 2/20 | below floor |
| Reproducibility/artifacts | 1/10 | below floor |
| Risk/license/safety | 1/10 | below floor |
| Reviewability | 2/10 | below floor |
| **Total** | **12/100** | below 80 |

**Blocking findings**

- **[P0][blocking] Location:** `narrow-directions.md:6` (plan line). **Evidence:** “D1 only; no baseline.” **Why:** without the current parser under the same workload/environment/runtime, the speed of D1 has no reference; the Baseline and controls floor is 0/12 and the decision cannot be supported (P0). This is not a direction-set veto: a baseline is a control, not a new direction the user must select. **Required action:** add the real current-parser baseline and use it in the same-workload comparison; record its provenance/hash. **Pass condition:** the plan contains a same-workload baseline and a decision that compares D1 against it.

- **[P1][blocking] Location:** `narrow-directions.md:6`. **Evidence:** “one run; no thresholds; no slice; no raw data.” **Why:** a single run without thresholds or a decision rule cannot distinguish a real effect from noise, and without a slice/raw data the result is neither representative nor auditable. The experiment-sufficiency and reproducibility floors fail. **Required action:** define 1–3 experiments with replication/CI, frozen thresholds/MDE, a representative slice and exclusions, and retained raw data. **Pass condition:** each is present and executable without invention.

- **[P1][blocking] Location:** `narrow-directions.md:5-6`. **Evidence:** the user rationale is only “fast”; no kill criteria are recorded, and the plan has no stop/decision rule. **Why:** “fast” is not a testable rationale, and without kill criteria the selected direction has no pre-declared stop. The selected-direction-execution and decision/metrics floors fail. **Required action:** record a testable rationale and per-direction kill criteria; add the stop/decision rule. **Pass condition:** the rationale, kill criteria, and stop rule are explicit and testable.

- **[P1][blocking] Location:** `narrow-directions.md:6`. **Evidence:** no environment/version/seed/commands/artifacts/risk/timebox statement. **Why:** the reproducibility/artifacts and risk/license/safety floors fail; no operator could reproduce or safely stop the run. **Required action:** add the env/seed/command/artifact manifest and the dependency/license/CVE, sandbox, data/security, credential, timebox, stop/abort checks. **Pass condition:** the manifest and risk checks are complete.

**Non-blocking finding**

- **[P2][non-blocking] Location:** `narrow-directions.md:3-5` (direction set and rationale). **Evidence:** “User selected only D1 (candidate X) from a list that omitted the do-nothing option and an obvious existing-library alternative. User rationale: ‘fast’.” **Why:** this is an R1 broad-direction-set coverage defect: the decision space was narrowed before Gate 1, and “fast” is not a recorded testable rationale. It does not block Gate 1 as a veto of the user’s choice, but it must be recorded and the user must explicitly decide whether to widen the set before any demo. **Required action:** log the R1 coverage gap, present the do-nothing and existing-library alternatives, and obtain/record the user’s explicit decision and rationale. **Pass condition:** the gap is recorded, the user decision is explicit, and any widening (or deliberate narrowing) is documented; Gate 1 still judges only the selected execution.

**Why it does not pass:** all seven areas are below floor; the P0 no-baseline finding is sufficient to block. The R1 coverage issue is not the basis of the Gate 1 veto, but it remains a recorded process defect.

## 5. Gate 2 fixtures

### 5.1 `partial-adopt.md` — REVISE (claim gate)

**Header:** Verdict `REVISE`; score/floors N/A (Gate 2 has no numeric point scale). The fixture states that one supporting claim is `partial` (single sandbox run, no representative slice) and the draft memo says “Recommend adopt.” (`partial-adopt.md:3-4`). This directly violates “`partial` cannot support adopt/migrate”; the recommendation is limited to candidate/pilot at most.

**Gate 2 conditions**

| Condition | Result | Evidence |
|---|---|---|
| Every claim `supported` or `partial`-with-limit | Not met | the only stated claim is `partial` (single sandbox run, no representative slice); the memo states no limit |
| No `partial` supporting adopt/migrate | **Not met** | memo “Recommend adopt” rests on the `partial` claim (`:3-4`) |
| Measured-here + representative slice + pilot/risk acceptance + `MIGRATION.md` | Not met | single sandbox run, no representative slice; no pilot or written risk acceptance; no downstream `MIGRATION.md` |
| Every recommendation mapped to claim IDs | Not met | no `REC-n` or claim IDs are supplied |
| No unreviewed memo change | Not met | no memo SHA-256, claim-ID stamp, or delta-review trigger is supplied |
| Ordered inputs + independent `CLAIMS.md` before memo | Not met | no approved plan, execution logs, raw data, artifacts, or independent claims extraction are supplied |

**Blocking findings**

- **[P1][blocking] Location:** `partial-adopt.md:3-4` (claim status and draft memo). **Evidence:** “One supporting claim is `partial` (single sandbox run, no representative slice). Draft memo: ‘Recommend adopt.’” **Why:** Gate 2 forbids a `partial` claim from supporting adopt/migrate; any cited `partial` limits the recommendation to candidate/pilot. The draft memo overstates the evidence. **Required action:** downgrade the memo to a candidate/pilot recommendation limited by the claim’s stated scope and cite the claim ID; if adopt is retained, replace the partial claim with a `supported` claim that is measured here, uses a representative slice, has a pilot or written risk acceptance, and has a downstream `MIGRATION.md`. **Pass condition:** the memo wording contains no adopt/migrate conclusion supported by a partial claim; the claim table maps the claim status and allowed wording; the recommendation is either candidate/pilot or satisfies every adopt condition.

- **[P1][blocking] Location:** `partial-adopt.md:3-4` (whole dossier). **Evidence:** no approved plan, execution logs, raw data, artifacts, independent `CLAIMS.md`, or claim table is supplied; the memo appears before any claims extraction or mapping. **Why:** Gate 2’s process audit and claim mapping cannot be performed, so the headline recommendation cannot be verified or reproduced. **Required action:** supply the ordered Gate 2 inputs, have the reviewer produce an independent `CLAIMS.md` with a hash before reading the draft memo, map memo claims to extracted claims and raw evidence, list absent/unused claims, run the process audit, and rerun/recompute the decisive claim. **Pass condition:** the review contains a populated claim table with evidence, status, confidence, and rerun command/result; the memo is read only after the independent claims extraction.

- **[P2][non-blocking] Location:** `partial-adopt.md:4` (memo). **Evidence:** no memo SHA-256, claim IDs, or delta-review trigger; no `REC-1..n` mapping. **Why:** an unstamped or unmapped memo cannot be traced, and any later wording change would go unreviewed. It is non-blocking relative to the P1 findings because the adopt conclusion already fails, but it must be fixed for a valid Gate 2 artifact. **Required action:** assign recommendation IDs, cite claim IDs, stamp the memo with its SHA-256 and claim IDs, and record the delta-review trigger. **Pass condition:** the memo stamp and recommendation mapping exist and any wording change triggers delta review.

**Allowed wording:** “candidate/pilot only”; adopt/migrate is not allowed. The recommendation may not be user-facing until Gate 2 PASS.

### 5.2 `single-run-strong.md` — REVISE (claim gate)

**Header:** Verdict `REVISE`; score/floors N/A (Gate 2). The plan is one run each against the baseline, no variance/CI, no representative slice, and no raw-data retention; the draft says “X is 2x faster; recommend adopt.” (`single-run-strong.md:3-4`). A single run cannot be `supported`; without retained raw data the “2x” number is not even auditable, and adopt/migrate is barred.

**Gate 2 conditions**

| Condition | Result | Evidence |
|---|---|---|
| Every claim `supported` or `partial`-with-limit | Not met | the “2x faster” headline has one run, no CI/variance, no slice, and no raw data; it is `unsupported` as stated (at most `partial` if a single raw run existed) |
| No `partial`/unsupported supporting adopt/migrate | **Not met** | “recommend adopt” rests on the single run (`:4`) |
| Measured-here + representative slice + pilot/risk acceptance + `MIGRATION.md` | Not met | no representative slice; no pilot/risk acceptance; no downstream `MIGRATION.md` |
| Every recommendation mapped to claim IDs | Not met | no claim IDs or `REC-n` |
| No unreviewed memo change | Not met | no memo hash/claim-ID stamp/delta-review trigger |
| Rerun/recompute decisive claim; ordered inputs + independent `CLAIMS.md` | Not met | raw data not retained; no logs/artifacts/independent claims table |

**Blocking findings**

- **[P1][blocking] Location:** `single-run-strong.md:3` (runs) and `:4` (draft conclusion). **Evidence:** “one run each; no variance/CI; no representative slice; raw data not retained”; “X is 2x faster; recommend adopt.” **Why:** a single run cannot establish a 2× difference, and the missing raw data means the reviewer cannot rerun the decisive experiment or recompute the headline metric. Gate 2 says lowering confidence never turns a single run into `supported`; the claim is `unsupported` as stated. **Required action:** rerun the comparison with repetitions/warmup, a variance/CI method, and retained raw JSON, or downgrade the wording to a single preliminary observation with no measured speed claim; run the process audit and recompute the metric. **Pass condition:** the decisive claim has a rerun command and result with variance/CI and raw data, or the memo contains no speed/adopt claim.

- **[P1][blocking] Location:** `single-run-strong.md:3-4` (representative slice and adopt recommendation). **Evidence:** no representative slice; no pilot or written risk acceptance; no downstream `MIGRATION.md`; the memo recommends adopt. **Why:** adopt/migrate requires all cited claims `supported`, measured here, a representative slice, a pilot or written risk acceptance, and a downstream `MIGRATION.md`. The fixture supplies none. **Required action:** define and measure the representative slice or narrow the claim to the sandbox; obtain a pilot or written risk acceptance and a downstream `MIGRATION.md` only if an adopt recommendation is retained; otherwise downgrade to candidate/pilot. **Pass condition:** the recommendation is candidate/pilot, or every adopt condition is satisfied and mapped to a supported claim.

- **[P1][blocking] Location:** `single-run-strong.md:4` (memo). **Evidence:** “X is 2x faster; recommend adopt” with no claim table, allowed wording, confidence, evidence, or rerun result. **Why:** the memo asserts a user-facing conclusion that Gate 2 has not passed; it must be labelled provisional and cannot be user-facing. **Required action:** mark the memo provisional, map every sentence to a claim ID and status, and restrict wording to what the evidence supports. **Pass condition:** the memo contains no unsupported adopt/migrate or speed wording, and every claim is mapped to evidence and status.

- **[P2][non-blocking] Location:** `single-run-strong.md:3-4` (dossier). **Evidence:** no approved plan, execution logs, raw data, artifacts, independent `CLAIMS.md`, memo stamp, or recommendation IDs. **Why:** the Gate 2 process cannot be audited. It is non-blocking relative to the P1 findings because the claim already fails, but it must be fixed for a valid dossier. **Required action:** supply the ordered inputs, produce `CLAIMS.md` before reading the memo, populate the claim table, and stamp the memo with its hash and claim IDs. **Pass condition:** a complete Gate 2 dossier exists and the memo stamp/delta trigger are recorded.

**Allowed wording:** “single preliminary run; not sufficient for adopt”; the recommendation is at most candidate/pilot, and only after the evidence is supplied and reviewed.

## 6. Review-artifact fixture

### 6.1 `vague-review.md` — REVISE / inadmissible

**Header:** Verdict `REVISE` (the review artifact is inadmissible); score/floors N/A. The fixture is a reviewer output, not a plan or results dossier: “Looks good. 90/100. Ship it.” (`vague-review.md:3`). It violates the explicit feedback rules and cannot be accepted as a PASS for any gate. Its asserted 90/100 is withdrawn as unsupported; it has zero admissible evidentiary value. No floor table, gate declaration, or claim table exists to verify.

**Blocking findings**

- **[P1][blocking] Location:** `vague-review.md:3` (entire review). **Evidence:** the review has no severity, location, evidence, why-it-matters, required action, or pass condition — none of the six required elements. It contains no findings, no gate table, no area scores/floors, no P0/P1/P2 count, and no residual risks. **Why:** “a score without findings” and “looks good” are explicitly forbidden; the 90/100 cannot be traced to any criterion, and “Ship it” is a user-facing release recommendation made without a PASS or any evidence. This review cannot authorize any demo or user-facing conclusion. **Required action:** withdraw the review and the 90/100; redo the review with the applicable report template (Gate 1: gate table, scores/floors, P0/P1/P2 findings with all six elements, residual risks, no-demo statement; Gate 2: independent `CLAIMS.md`, claim table, allowed wording, process audit, memo stamp). **Pass condition:** a re-review contains the required template fields, every finding has the six elements, and the verdict is supported by the gate table or claim table.

- **[P1][blocking] Location:** `vague-review.md:3`. **Evidence:** “Looks good” and “Ship it” are vague/forbidden formulations; there is no statement of what was inspected, no commands/artifacts/raw data referenced, and no claim IDs. **Why:** the reviewer cannot verify anything, so the review cannot be relied on; a non-blocking finding is not available because the entire artifact is conclusion-only. **Required action:** replace vague wording with exact inspected locations, commands, numbers, quotes, and a pass condition; if evidence is unavailable, mark `REVISE` and name the missing evidence instead of approving. **Pass condition:** every statement cites a file/line, command, number, or quote, and every finding has a pass condition.

- **[P2][non-blocking] Location:** `vague-review.md:1-3` (gate ambiguity). **Evidence:** the fixture does not say whether this is a Gate 1 plan review or a Gate 2 results review, and it contains neither gate’s required artifacts. **Why:** even if the wording were expanded, the review could not be admitted without the gate declaration and that gate’s evidence. It is non-blocking relative to the conclusion-only P1 findings, but it prevents any future acceptance. **Required action:** declare the gate; supply the gate-specific inputs and template; record the reviewer identity/model/prompt/input hashes in `REVIEW-LOG.md`. **Pass condition:** the gate, inputs, evidence, and report template are explicit and complete.

**What would change the verdict:** a new independent review with a declared gate, complete template, evidence-backed findings, and the correct verdict. The current 90/100 and “Ship it” cannot be reused or cited.

## 7. Floor / gate failure summary

| Fixture | What is not met |
|---|---|
| `floor-boundary.md` | No floor is below threshold: all seven areas are exactly at floor, total 80, no P0/P1, three unresolved P2 (allowed). PASS is boundary-tight: any further unresolved P2 or any floor slip flips to REVISE. |
| `strong-plan.md` | No floor is below threshold; all areas above floor, total 93, no P0/P1, two unresolved P2. PASS carries the disclosed validity limits and the P2 recipe/rationale gaps. |
| `weak-plan.md` | All seven Gate 1 floors are below threshold; P0 no baseline/comparison; P1 no thresholds/variance, no slice/raw retention, no risk/timebox/stop. |
| `narrow-directions.md` | All seven Gate 1 floors are below threshold; P0 no baseline; P1 one run/no thresholds, no slice/raw data, no testable rationale/kill criteria/stop; R1 direction-set coverage defect recorded as a non-blocking P2, not a Gate 1 veto. |
| `partial-adopt.md` | Gate 2 conditions not met: `partial` claim supports “Recommend adopt”; no representative slice/pilot/risk acceptance/`MIGRATION.md`; no independent `CLAIMS.md`, claim table, recommendation mapping, or memo stamp. |
| `single-run-strong.md` | Gate 2 conditions not met: single run/no CI/no slice/no raw data cannot support “2x faster”; adopt is barred; no rerun/recompute, claim table, or memo stamp. |
| `vague-review.md` | No gate table, no findings, none of the six feedback elements, no evidence; “Looks good. 90/100. Ship it.” is inadmissible and cannot authorize any user-facing conclusion. |

## 8. Attestation

- No file under `docs/calibration-inputs/` was modified. Inputs were re-hashed after this report was written and matched the §1 hashes exactly.
- No experiment, demo, benchmark, or recommendation was produced by this review.
- No expected answer, prior review, fixture manifest, or answer key was read. Directory listings exposed filenames only; no prior-review contents were opened.
- The verdicts were independently derived from the seven inputs and the frozen Gate 1/2 rules. The reviewer did not assume any fixture’s expected verdict.
- This report is not a substitute for the author’s revision or for a future re-review. `strong-plan.md` and `floor-boundary.md` are PASS for Gate 1 only; neither authorizes a demo for the REVISE fixtures, and the Gate 2 fixtures remain blocked.

**Reviewer signature:** `calibration-reviewer-4` / `deepseek-flash` / DeepSeek — 2026-11-25.

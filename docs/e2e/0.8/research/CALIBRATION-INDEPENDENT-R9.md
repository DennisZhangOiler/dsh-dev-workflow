# Independent calibration review — R9

## 1. Reviewer record

- Reviewer: `calibration-reviewer-10` (independent; not the author, experimenter, or synthesizer).
- Model / provider: `deepseek-flash` / DeepSeek Harness (host subagent route).
- Review completed: 2026-11-25 15:58:51 +08:00 (Asia/Shanghai).
- Rubric: `skills/rd-workflow-research-review.md`, SHA-256 `80ccf3b9f6c320932a2e8d3215bd8df8f27ba2f5c9e626a7f05bcdf23513ab13`.
- Frozen review prompt: `docs/e2e/0.8/research/prompts/calibration-blind-r9.txt`, SHA-256 `914eaa271b843fdc6db52abdaa70c3719e2b4e699fbdcedae849d7f91e8a59a7`.
- Evidence base: the seven blind inputs under `docs/calibration-blind/` plus the two frozen documents above. I did not open `docs/fixtures/`, `expected.json`, `docs/calibration-inputs/`, any prior `CALIBRATION-INDEPENDENT-*` review, or any answer key. No input was modified.
- Review scope: Gate 1 plan reviews for F1, F2, F6, F7; Gate 2 results reviews for F3 and F4; F5 is a review artifact that must be audited against the Gate 1/2 report and explicit-feedback requirements because it is neither a plan nor a results submission.

## 2. Frozen input hashes

| Input | Path | SHA-256 | Gate |
|---|---|---|---|
| F1 | `docs/calibration-blind/F1` | `f53937a0ad84895113ddd0b76c8f89890975cb8b5bf37172212abfe3d90dd5b4` | Gate 1 |
| F2 | `docs/calibration-blind/F2` | `50dc2ed7684350153c23694e8daf398fea008771b14eb73b5ea117ef0a9bad71` | Gate 1 |
| F3 | `docs/calibration-blind/F3` | `e78789bdb08498cf0c4a46e8bbdf3848e2c86b3d3e15b340505707fb745bd1d2` | Gate 2 |
| F4 | `docs/calibration-blind/F4` | `b236c66a1dc59f59a3aceea63fb4d706a762f0281dc56bae93840bbdf2fcb06c` | Gate 2 |
| F5 | `docs/calibration-blind/F5` | `f2b73c97383b3b5b03c7563b9935a3f1656dfaf6ecfe436457cca9881817ee9a` | Invalid review artifact |
| F6 | `docs/calibration-blind/F6` | `bb4dab4fe14c89b8eaff998558274b59a38d1de7aa01738731625342d45f2204` | Gate 1 |
| F7 | `docs/calibration-blind/F7` | `acc586b04083ce9a3b048e47d12881470c37a96348bf0c8e2e40f2cf4fd29d7d` | Gate 1 |

Prompt file SHA-256 (required by the work order): `914eaa271b843fdc6db52abdaa70c3719e2b4e699fbdcedae849d7f91e8a59a7`.

## 3. Method and score convention

Gate 1 area scores use the rubric anchors: `0` missing/unusable, `50` present with a material gap, `100` specific, testable, and sufficient. Gate 1 passes only when every area is at or above its floor, total is `>=80`, there is no P0/P1, and there are at most `3` unresolved P2. The total is a gate, not a diagnostic.

Gate 2 has no numeric score table. The numeric values shown for F3/F4 are informational evidence-sufficiency scores, not Gate 2 gate scores. Gate 2 is decided by the claim table, the recommendation mapping, and the process audit, with the explicit rule that a `partial` claim cannot support adopt/migrate.

Every finding below includes severity/blocking status, location, evidence, why it matters, required action, and pass condition.

---

## 4. Per-input reviews

### F1 — Gate 1 plan review

- Reviewer: `calibration-reviewer-10` / `deepseek-flash` / DeepSeek Harness.
- Input hash: `f53937a0ad84895113ddd0b76c8f89890975cb8b5bf37172212abfe3d90dd5b4`.
- Verdict: **REVISE**
- Score: **8/100** (gate); unresolved P2: not reached because P0/P1 already block.
- Floors:
  - Selected-direction execution: **2/20** (floor 16) — below.
  - Decision and metrics: **2/15** (floor 12) — below.
  - Baseline and controls: **0/15** (floor 12) — below.
  - Experiment sufficiency: **1/20** (floor 16) — below.
  - Reproducibility/artifacts: **1/10** (floor 8) — below.
  - Risk/license/safety: **0/10** (floor 8) — below.
  - Reviewability: **2/10** (floor 8) — below.
- P0/P1 blocking: **P0** plan cannot support the parser decision; **P1** no baseline, no metrics/decision rule, one run/no slice, no raw-data retention, no risk/timebox handling.

#### Findings

1. **[P0][blocking]** Location: `F1:3-5`.
   - Evidence: “Decision: choose a parser library. Plan: run one demo of candidate A; no baseline; one run; no thresholds; no comparison; no representative slice; no raw-data retention.”
   - Why it matters: A single uncontested demo cannot support a choice between parser libraries. There is no comparison, no success/failure definition, no noise control, and no evidence that can be audited.

   - Required action: Define a real baseline, comparison metrics with thresholds/MDE, repeated runs with variance/CI, a representative slice with exclusions, raw-data retention, and license/risk/timebox controls.
   - Pass condition: All seven Gate 1 floors met, total `>=80`, no P0/P1, and at most three unresolved P2.

2. **[P1][blocking]** Location: `F1:4`.
   - Evidence: “no baseline”.
   - Why it matters: Without the current baseline and a same-workload/environment/runtime comparison, any observed result cannot be attributed to candidate A; this is a strawman decision frame.

   - Required action: Measure the real current baseline under the same payloads, machine, runtime, and timing protocol; add a control if downstream work could confound parser cost.
   - Pass condition: Baseline and controls area `>=12/15`; baseline, workload, environment, and runtime are explicitly identical.

3. **[P1][blocking]** Location: `F1:4`.
   - Evidence: “one run; no thresholds”.
   - Why it matters: One run cannot separate signal from run-to-run noise, and no threshold or decision rule defines what “better” means; the plan cannot yield a falsifiable conclusion.

   - Required action: Define metrics, MDE/thresholds, a decision rule, and repeated timed runs with variance/CI; state what success and failure mean.
   - Pass condition: Decision and metrics area `>=12/15`; experiment sufficiency area `>=16/20`.

4. **[P1][blocking]** Location: `F1:4-5`.
   - Evidence: “no comparison; no representative slice” and “one run”.
   - Why it matters: There is no edge/semantic-case coverage, no representative slice, and no way to assess whether the result is representative or noise.

   - Required action: Add a representative slice with exclusions, edge/malformed cases, repeated runs, and a harness-validity protocol.
   - Pass condition: Experiment sufficiency area `>=16/20`.

5. **[P1][blocking]** Location: `F1:5`.
   - Evidence: “no raw-data retention.”
   - Why it matters: The result cannot be reproduced, recomputed, or audited; a second reviewer cannot verify the claim.

   - Required action: Record commands, versions, seeds, raw data, artifact hashes, retention, and cleanup.
   - Pass condition: Reproducibility/artifacts area `>=8/10`.

6. **[P1][blocking]** Location: `F1:3-5`.
   - Evidence: No dependency/license/CVE, sandbox isolation, credentials/data-security, timebox, or stop/abort content is present.
   - Why it matters: The plan cannot be judged safe or bounded; a dependency or credential problem could invalidate or delay the decision.

   - Required action: Add dependency/license/CVE checks, sandbox/credentials/data handling, a timebox, and stop/abort rules.
   - Pass condition: Risk/license/safety area `>=8/10`.

---

### F2 — Gate 1 plan review

- Reviewer: `calibration-reviewer-10` / `deepseek-flash` / DeepSeek Harness.
- Input hash: `50dc2ed7684350153c23694e8daf398fea008771b14eb73b5ea117ef0a9bad71`.
- Verdict: **REVISE**
- Score: **10/100** (gate); unresolved P2: at least one R1 pre-check item, but P0/P1 already block.
- Floors:
  - Selected-direction execution: **4/20** (floor 16) — below.
  - Decision and metrics: **2/15** (floor 12) — below.
  - Baseline and controls: **0/15** (floor 12) — below.
  - Experiment sufficiency: **1/20** (floor 16) — below.
  - Reproducibility/artifacts: **1/10** (floor 8) — below.
  - Risk/license/safety: **0/10** (floor 8) — below.
  - Reviewability: **2/10** (floor 8) — below.
- P0/P1 blocking: **P0** D1-only plan cannot support the parser decision; **P1** D1 execution lacks a falsifier/slice/decision rule, no baseline, no thresholds, one run/no slice, no raw data.

#### Findings

1. **[P0][blocking]** Location: `F2:4-6`.
   - Evidence: “Plan: D1 only; no baseline; one run; no thresholds; no slice; no raw data.”
   - Why it matters: The supplied D1 result would not be comparable to the current library, would have no noise estimate or representative coverage, and could not be audited. The plan cannot support the decision.

   - Required action: Add a real baseline, comparison metrics/thresholds, repeated runs/CI, a representative slice, and raw-data retention.
   - Pass condition: All seven Gate 1 floors met, total `>=80`, no P0/P1.

2. **[P1][blocking]** Location: `F2:4-6`.
   - Evidence: D1 has only the rationale “fast”; no experiment list, falsifier, slice, stop/decision rule, or kill criterion is recorded.
   - Why it matters: The Gate 1 selected-direction check requires each selected direction to have 1-3 experiments, a falsifier, a slice, a stop/decision rule, and recorded user rationale/kill criteria. D1 is not falsifiable as written, so a demo would test an evidence design that was never approved.

   - Required action: Record D1’s 1-3 experiments, direction-specific falsifier, slice, stop/decision rule, user rationale, and kill criterion.
   - Pass condition: Selected-direction execution area `>=16/20`; each field is explicit and testable.

3. **[P1][blocking]** Location: `F2:6`.
   - Evidence: “no baseline”.
   - Why it matters: Without the current baseline and same-workload/environment/runtime comparison, no D1 result can be attributed to D1; the comparison is invalid.

   - Required action: Measure the real current baseline under the same payloads, machine, runtime, and timing protocol; add a control if needed.
   - Pass condition: Baseline and controls area `>=12/15`.

4. **[P1][blocking]** Location: `F2:6`.
   - Evidence: “no thresholds”.
   - Why it matters: There is no MDE, success/failure meaning, or decision rule; the plan cannot distinguish a real improvement from noise.

   - Required action: Define metrics, MDE/thresholds, repeated runs with CI, and an explicit decision rule.
   - Pass condition: Decision and metrics area `>=12/15`; experiment sufficiency area `>=16/20`.

5. **[P1][blocking]** Location: `F2:6`.
   - Evidence: “one run; ... no slice; no raw data.”
   - Why it matters: A single run cannot support a comparative claim; the absent slice means no representative/edge coverage; absent raw data means no audit or recomputation.

   - Required action: Add repeated runs/variance/CI, a representative slice with exclusions, and retained raw data/commands/versions.
   - Pass condition: Experiment sufficiency `>=16/20`; reproducibility `>=8/10`.

6. **[P2][non-blocking for Gate 1; blocking at R1]** Location: `F2:4-5`.
   - Evidence: “User selected only D1 (candidate X) from a list that omitted the do-nothing option and an obvious existing-library alternative. User rationale: ‘fast’.”
   - Why it matters: This is a broad-direction-set coverage defect. The user’s selection was made from an incomplete list, so the decision frame may be incomplete. Gate 1’s scope note says coverage of the broad direction set is an R1 pre-check, not a Gate 1 veto, and Gate 1 must not veto the user’s choice without new evidence and an explicit user decision. This finding therefore does **not** by itself make the Gate 1 verdict REVISE; the Gate 1 verdict above rests on the D1 execution defects.

   - Required action: The R1 owner must reopen the direction set, record the omitted do-nothing and existing-library alternatives, and obtain an explicit user decision; Gate 1 must then record the updated rationale and kill criteria.
   - Pass condition: R1 coverage record and user decision exist; Gate 1 separately meets all floors and the P0/P1/P2 conditions.

---

### F3 — Gate 2 results review

- Reviewer: `calibration-reviewer-10` / `deepseek-flash` / DeepSeek Harness.
- Input hash: `e78789bdb08498cf0c4a46e8bbdf3848e2c86b3d3e15b340505707fb745bd1d2`.
- Verdict: **REVISE**
- Score: **15/100** (informational evidence-sufficiency score; Gate 2 has no numeric gate).
- Floors: **n/a** — Gate 2 is claim- and process-based, not floor-based. The underlying summarized plan would fail Gate 1 on decision/metrics (no thresholds/CI), experiment sufficiency (one run, no slice), and reproducibility (raw data not retained); the baseline is named but is single-run.
- Gate 2 gate: **fail** — the draft adopts on a claim that is at most `partial`, and the required Gate 2 inputs are absent.

#### Process findings

1. **[P1][blocking]** Location: `F3:3-5`.
   - Evidence: Only a plan summary and a draft conclusion are supplied. There is no approved plan with hash, no execution log, no raw data, no artifact, and no independent `CLAIMS.md` produced before the memo.
   - Why it matters: Gate 2 requires inputs in a fixed order and a reviewer-generated `CLAIMS.md` hash before the draft memo may be read. Without those inputs there is no defensible mapping from memo claims to raw evidence, and no process audit is possible.

   - Required action: Supply the approved plan (with hash), execution logs, raw data, and artifacts; produce and hash an independent `CLAIMS.md` before reading the draft memo; then map memo claims to extracted claims and raw evidence.
   - Pass condition: Complete Gate 2 input set and claim mapping; no invented steps.

2. **[P1][blocking]** Location: `F3:4-5`.
   - Evidence: “one run each; no variance/CI” and “X is 2x faster; recommend adopt.”
   - Why it matters: A single run per implementation cannot establish a comparative performance claim. The rubric says lowering confidence never turns a single run into `supported`; at most this is `partial`.

   - Required action: Repeat the decisive experiment with enough reps for variance/CI, retain the raw data, and report the CI and effect size.
   - Pass condition: Claim is `supported` or explicitly `partial` with limits; a `partial` claim cannot support adopt/migrate.

3. **[P1][blocking]** Location: `F3:4`.
   - Evidence: “no representative slice.”
   - Why it matters: There is no slice definition, no exclusions, and no semantic/edge coverage; a headline speed result cannot be generalized or used for adoption.

   - Required action: Define a representative slice with exclusions, edge/malformed cases, and report coverage.
   - Pass condition: Slice coverage is explicit; the claim is limited to the measured slice.

4. **[P1][blocking]** Location: `F3:4`.
   - Evidence: “raw data not retained.”
   - Why it matters: The decisive metric cannot be recomputed, rerun, or audited; the claim is not reproducible and cannot be `supported`.

   - Required action: Retain raw data, commands, versions, seeds, and artifact hashes; rerun or recompute the headline metric.
   - Pass condition: Rerun/recompute result recorded with exact command and result.

5. **[P1][blocking]** Location: `F3:5`.
   - Evidence: “recommend adopt.”
   - Why it matters: The adopt recommendation rests on a claim that is at most `partial` and has no representative slice or rerun. Gate 2 explicitly forbids a `partial` claim from supporting adopt/migrate; adoption also requires all cited claims `supported` + measured-here + representative slice + pilot or written risk acceptance + downstream `MIGRATION.md`.

   - Required action: Downgrade the recommendation to candidate/pilot, or complete the full adoption evidence set and rerun/recompute every cited claim.
   - Pass condition: No `partial` claim supports adopt; recommendation is mapped to claim IDs and limited to its evidence.

6. **[P2][blocking]** Location: `F3:5`.
   - Evidence: The draft conclusion has no claim IDs, no memo hash, and no allowed-wording limits.
   - Why it matters: Gate 2 requires the memo to be stamped with a SHA-256 and claim IDs; without a stamp, a later wording change cannot trigger delta re-review.

   - Required action: Assign claim IDs, stamp the memo with its hash, and record allowed wording and the delta-review trigger.
   - Pass condition: Memo stamp present; any later wording change is delta-reviewed.

#### Claim verdicts

| Claim ID | Claim | Evidence | Status | Allowed wording |
|---|---|---|---|---|
| C1 | “X is 2x faster” | One run each; no variance/CI; no representative slice; raw data not retained | `partial` (at most; the supplied record cannot even recompute the number) | “A single unreplicated observation suggests a possible speed difference; the 2× claim is not established; no comparative conclusion.” |
| REC-1 | “recommend adopt” | Cites C1; no supported claims, no representative slice, no pilot/risk acceptance, no `MIGRATION.md` | `unsupported` | “Candidate/pilot only; adopt is not supported.” |

#### What cannot be concluded

No verified speed difference, no 2× claim, no adoption, and no generalization beyond the unspecified single workload. A rerun with raw retention, a representative slice, and CI is required before any user-facing conclusion.

#### Memo stamp

Cannot stamp: no memo hash and no claim IDs are supplied. Status `REVISE`; the memo must not be user-facing.

---

### F4 — Gate 2 results review

- Reviewer: `calibration-reviewer-10` / `deepseek-flash` / DeepSeek Harness.
- Input hash: `b236c66a1dc59f59a3aceea63fb4d706a762f0281dc56bae93840bbdf2fcb06c`.
- Verdict: **REVISE**
- Score: **15/100** (informational evidence-sufficiency score; Gate 2 has no numeric gate).
- Floors: **n/a** — Gate 2 is claim- and process-based. No Gate 1 plan is supplied, so no Gate 1 floor table can be scored; the described supporting evidence would fail the representative-slice and sufficiency requirements.
- Gate 2 gate: **fail** — a `partial` claim is cited in support of adopt, and the memo/recommendation mapping is absent.

#### Process findings

1. **[P1][blocking]** Location: `F4:3`.
   - Evidence: “One supporting claim is `partial` (single sandbox run, no representative slice).” “Draft memo: ‘Recommend adopt.’”
   - Why it matters: This is the exact prohibited combination. Gate 2 says a `partial` claim cannot support adopt/migrate; adopt requires all cited claims `supported`, measured here, on a representative slice, with a pilot or written risk acceptance and a downstream `MIGRATION.md`.

   - Required action: Downgrade the recommendation to candidate/pilot, or complete the evidence (repeated runs/CI, representative slice, measured-here, pilot/risk acceptance, `MIGRATION.md`).
   - Pass condition: No `partial` claim supports adopt; every cited claim is `supported`; recommendation wording matches the claim set.

2. **[P1][blocking]** Location: `F4:1`.
   - Evidence: “single sandbox run, no representative slice.”
   - Why it matters: The single sandbox run cannot establish the supporting claim, and the absent representative slice prevents generalization; the claim is `partial` by the input’s own statement.

   - Required action: Run repeated measurements with CI and a representative slice with exclusions; retain raw data.
   - Pass condition: Claim `supported` or explicitly `partial` with limits; no adopt while `partial`.

3. **[P1][blocking]** Location: `F4:1-3`.
   - Evidence: No claim ID, no independent `CLAIMS.md`, no memo hash, no evidence/raw data/logs, and no recommendation mapping are supplied.
   - Why it matters: The memo cannot be mapped to extracted claims or raw evidence, and a later wording change would be untracked.

   - Required action: Produce and hash `CLAIMS.md`; assign claim IDs and `REC-1..n`; map each recommendation to its cited claims; stamp the memo with a SHA-256.
   - Pass condition: Complete claim table, recommendation mapping, and memo stamp; any changed wording triggers delta re-review.

4. **[P2][blocking]** Location: `F4:3`.
   - Evidence: “Recommend adopt” is unqualified, with no allowed-wording limit for the `partial` claim.
   - Why it matters: Even if the claim remains `partial`, the memo wording overstates it; user-facing conclusions are forbidden before `PASS`.

   - Required action: Replace the wording with a candidate/pilot limitation or remove the adopt recommendation.
   - Pass condition: Allowed wording matches the claim status; no adopt wording on a `partial` claim.

#### Claim verdicts

| Claim ID | Claim | Evidence | Status | Allowed wording |
|---|---|---|---|---|
| C1 | Supporting performance claim | Single sandbox run; no representative slice | `partial` | “Candidate/pilot only; a representative slice and repeated runs are required; not adoption evidence.” |
| REC-1 | “Recommend adopt” | Cites `partial` C1; no pilot/risk acceptance/`MIGRATION.md` | `unsupported` | “Candidate/pilot only; adopt is not supported.” |

#### What cannot be concluded

No adoption, no generalizeable result, and no user-facing recommendation beyond candidate/pilot. A representative slice, repeated runs, a pilot or written risk acceptance, and a downstream `MIGRATION.md` are required before adopt wording is allowed.

#### Memo stamp

Cannot stamp: no memo hash or claim IDs are supplied. Status `REVISE`; the memo must not be user-facing.

---

### F5 — Review-artifact audit (not a plan or results submission)

- Reviewer: `calibration-reviewer-10` / `deepseek-flash` / DeepSeek Harness.
- Input hash: `f2b73c97383b3b5b03c7563b9935a3f1656dfaf6ecfe436457cca9881817ee9a`.
- Verdict: **REVISE (reject as a non-review)**
- Score: **0/100**.
- Floors: cannot be assessed. There is no Gate 1 area table, no Gate 2 claim table, no reviewer identity, no input hash, no findings, and no evidence. Under Gate 1, all seven floors fail by absence; under Gate 2, the claim/recommendation gate fails by absence.
- P0/P1 blocking: **P0** not a review; **P1** score without findings, unsupported “ship” recommendation, missing reviewer/input record.

#### Findings

1. **[P0][blocking]** Location: whole input (`F5:3`).
   - Evidence: “Reviewer output: ‘Looks good. 90/100. Ship it.’”
   - Why it matters: This contains no findings, no evidence, no gate table/floors, no claim table, no process audit, no reviewer identity, and no input hash. It is neither a valid Gate 1 plan review nor a valid Gate 2 results review. It therefore cannot support any PASS, demo, or user-facing conclusion.

   - Required action: Redo the work as a proper plan or results review using the rubric’s report template: record reviewer/model/provider and prompt/input hashes; produce the Gate 1 area scores/floors or the Gate 2 process audit and claim table; give every finding severity, location, evidence, why, required action, and pass condition.
   - Pass condition: Complete template; each finding has all six required elements; verdict is supported by the gate arithmetic/claim table.

2. **[P1][blocking]** Location: `F5:3`.
   - Evidence: “90/100” with no area scores, floors, findings, or gate table.
   - Why it matters: A score without findings is an explicit anti-pattern and cannot show whether any floor was met. The score is unverifiable.

   - Required action: Provide the Gate 1 area table (score/floor/status) or the Gate 2 claim table, and tie the score to them.
   - Pass condition: Score traceable to the gate table; floor failures named.

3. **[P1][blocking]** Location: `F5:3`.
   - Evidence: “Looks good” and “Ship it.”
   - Why it matters: “Looks good” is explicitly forbidden; “Ship it” recommends a user-facing/delivery action with no PASS, no evidence, no gate, and no pass condition. This violates the no-demo/no-user-facing-conclusion-before-PASS rule.

   - Required action: Remove the ship recommendation; issue only after a properly recorded PASS.
   - Pass condition: No ship/demo/user-facing conclusion appears before PASS; required action and pass condition are explicit.

4. **[P1][blocking]** Location: `F5:3`.
   - Evidence: No reviewer identity/model/provider, no prompt hash, and no input hash.
   - Why it matters: The review cannot be audited or attributed; the Gate 1/2 record-keeping requirement is unmet.

   - Required action: Record reviewer identity, model/provider, prompt hash, and input hash.
   - Pass condition: Reviewer record complete and consistent with the input hash.

5. **[P2][blocking]** Location: `F5:3`.
   - Evidence: No residual risks, no allowed wording, no delta-review trigger, and no pass condition.
   - Why it matters: Even a valid PASS must leave residual risks and re-review conditions; this output leaves nothing to check.

   - Required action: Add residual risks, allowed wording, and the delta-review trigger.
   - Pass condition: Residual-risk section and re-review trigger present.

---

### F6 — Gate 1 plan review — PASS

- Reviewer: `calibration-reviewer-10` / `deepseek-flash` / DeepSeek Harness.
- Input hash: `bb4dab4fe14c89b8eaff998558274b59a38d1de7aa01738731625342d45f2204`.
- Verdict: **PASS**
- Score: **98/100** (gate); unresolved P2: **3/3** (author-declared, accepted and bounded; this review adds no new P2).
- Floors:
  - Selected-direction execution: **20/20** (floor 16) — pass.
  - Decision and metrics: **15/15** (floor 12) — pass.
  - Baseline and controls: **15/15** (floor 12) — pass.
  - Experiment sufficiency: **19/20** (floor 16) — pass.
  - Reproducibility/artifacts: **10/10** (floor 8) — pass.
  - Risk/license/safety: **9/10** (floor 8) — pass.
  - Reviewability: **10/10** (floor 8) — pass.
- P0/P1 blocking: **none**.
- Gate arithmetic: `20 + 15 + 15 + 19 + 10 + 9 + 10 = 98`; every area at or above floor; no P0/P1; unresolved P2 `3/3` at the cap. **PASS**.
- Note: no demo before this PASS is recorded.

#### Findings (non-blocking only)

1. **[P3][non-blocking]** Location: `F6:24`, `F6:59`, `F6:28-31`, `F6:77-78`.
   - Evidence: M3 is named “peak RSS delta,” but the measurement is “`process.memoryUsage().rss` sampled after parse,” and the risk section says “post-parse RSS is a lower bound; accepted; no peak-memory claim.” The decision rule nonetheless gates on “M3 passes.”
   - Why it matters: A reader could interpret M3 as a peak-memory claim even though the plan explicitly disclaims one. The accepted P2 covers the lower-bound limitation, so this is a documentation/testability inconsistency, not a new material gap.

   - Required action: Rename M3 to “post-parse RSS delta” and state that the decision rule uses that measured proxy, or add in-call peak sampling if a peak claim is desired.
   - Pass condition: Metric name, measurement method, and decision-rule wording are consistent; no unmeasured peak-memory claim remains.

2. **[P3][non-blocking]** Location: `F6:26`, `F6:40`, `F6:42`.
   - Evidence: M4 accepts “line/column or stable error code,” while direction B’s falsifier is “no line/column on malformed input” and its kill criterion is “cannot report line/column.”
   - Why it matters: B could pass the global M4 gate with a stable error code while failing its own selected-direction falsifier. The plan should state which rule wins for B, otherwise B’s adoption rationale is ambiguous.

   - Required action: Either require line/column for B or align B’s falsifier/kill criterion with M4’s stable-error-code allowance; state the precedence explicitly.
   - Pass condition: Direction-specific falsifier and the M4 gate agree, with explicit precedence.

3. **[P3][non-blocking]** Location: `F6:39`, `F6:24`, `F6:58-59`, `F6:77-78`.
   - Evidence: Direction A’s rationale is “reduces buffering for large logs,” but the memory metric is post-parse RSS and the plan says “no peak-memory claim.”
   - Why it matters: A’s stated buffering benefit is not directly measured; the plan can only support latency/memory-proxy claims unless peak sampling is added. This is already bounded by the accepted P2, but the wording should stay within the measured evidence.

   - Required action: Constrain A’s claim/rationale to latency and the post-parse RSS proxy, or add peak/buffering measurement.
   - Pass condition: A’s rationale and the measured metric align; no unsupported buffering claim remains.

---

### F7 — Gate 1 plan review — REVISE (floor boundary)

- Reviewer: `calibration-reviewer-10` / `deepseek-flash` / DeepSeek Harness.
- Input hash: `acc586b04083ce9a3b048e47d12881470c37a96348bf0c8e2e40f2cf4fd29d7d`.
- Verdict: **REVISE**
- Score: **78/100** (gate); total is below 80 and three area floors are below minimum. Unresolved P2: at least 2 confirmed, plus the risk section’s four unclassified items; the cap cannot be certified while the P1/floors already block.
- Floors:
  - Selected-direction execution: **14/20** (floor 16) — **below**.
  - Decision and metrics: **13/15** (floor 12) — pass.
  - Baseline and controls: **13/15** (floor 12) — pass.
  - Experiment sufficiency: **16/20** (floor 16) — pass at floor.
  - Reproducibility/artifacts: **7/10** (floor 8) — **below**.
  - Risk/license/safety: **7/10** (floor 8) — **below**.
  - Reviewability: **8/10** (floor 8) — pass at floor.
- P0/P1 blocking: **P1** selected-direction execution floor; **P1** risk/license/safety floor.
- Gate arithmetic: `14 + 13 + 13 + 16 + 7 + 7 + 8 = 78/100`; total `<80`; three floors below; P1 present. **REVISE**.
- Boundary note: this plan is close to the gate. A minimal pass path is to add the missing direction-specific records (+2 selected-direction), the missing artifact fields (+1 reproducibility), and the missing risk/security fields (+1 risk), which would take it to about 82/100 with no P0/P1. As written, the rubric’s explicit checks are not met, so the verdict is REVISE rather than PASS.

#### Findings

1. **[P1][blocking]** Location: `F7:3-4`, `F7:17-19`.
   - Evidence: The plan names “Candidates A and B” in the decision, then gives a shared list of experiments (“correctness table; latency matrix; memory matrix; malformed error table; dependency audit”) and a global “Adopt only if all gates pass; otherwise keep baseline.” There is no per-direction rationale, experiment assignment, falsifier, slice, stop/decision rule, or kill criterion.
   - Why it matters: The Gate 1 selected-direction check requires each selected direction to have 1-3 experiments, a falsifier, a slice, a stop/decision rule, and recorded user rationale/kill criteria. Without those entries, neither A nor B is falsifiable in the plan, and a demo would proceed on an unapproved evidence design. This also leaves the direction set unable to explain why A or B was selected.

   - Required action: Add a directions table for A and B with: user rationale; 1-3 experiment IDs; a direction-specific falsifier; the representative slice; the stop/decision rule; and the kill criterion. Tie each falsifier to the relevant M-gate.
   - Pass condition: Selected-direction execution `>=16/20`; every field present and testable; total `>=80`; no P0/P1.

2. **[P1][blocking]** Location: `F7:24-25`.
   - Evidence: “Risks: synthetic distribution, lower-bound RSS, single host/Node, no CI.” The plan does not label severity, record acceptance/bounds, or count unresolved P2. It also has no dependency CVE/SCA, sandbox-isolation, or credentials/data-security content; the dependency line only says “dependency/license allowlist.”
   - Why it matters: The risk/license/safety floor is `8/10`; as written the area is missing explicit CVE/SCA, sandbox, and credentials/data-security handling, and the four listed risks are unclassified. If all four are P2, the count is `4/3`, exceeding the gate cap of three unresolved P2. This is a P1 because risk and evidence-design gaps can invalidate an adoption conclusion.

   - Required action: Label each risk P2/P3, record acceptance/bounds, and reduce or resolve the set to at most three unresolved P2. Add dependency CVE/SCA checks, sandbox-isolation handling, and credentials/data-security handling (or an explicit, justified N/A for this local synthetic run).
   - Pass condition: Risk/license/safety `>=8/10`; at most three unresolved P2; all four listed risks carry severity and disposition.

3. **[P2][blocking]** Location: `F7:21-22`.
   - Evidence: “Artifacts: harness, raw/env JSON, input hashes, command/exit log, production before/after hashes. Raw immutable.” There are no runtime/dependency versions, no lockfile or image SHA-256, no retention period, and no cleanup procedure.
   - Why it matters: The reproducibility/artifacts floor is `8/10`; without versions, a lockfile/image hash, retention, and cleanup, a second reviewer cannot reproduce the exact run or know how long the raw data will remain available. The plan also does not say what the environment JSON contains.

   - Required action: Add Node/npm/runtime and dependency versions, a lockfile or image SHA-256, the raw-data retention period, and the cleanup procedure; state that env JSON contains the environment record.
   - Pass condition: Reproducibility/artifacts `>=8/10`; the recorded commands are rerunnable from the artifacts alone.

4. **[P2][non-blocking by itself]** Location: `F7:3-5`, `F7:10-12`, `F7:25`.
   - Evidence: The decision says “choose a parser,” the metrics section says “Adopt only if all gates pass; otherwise keep baseline,” and the risks section says “No adoption decision; research may hand off a candidate.”
   - Why it matters: The plan does not state whether its output is a parser decision or a candidate handoff. The recommendation scope and decision rule are ambiguous, which affects what the evidence is allowed to conclude. This is material/fixable but not the primary gate failure.

   - Required action: Reconcile the decision frame: choose either “recommend a candidate with no adoption decision” or “support an adopt decision with the full adopted-evidence requirements,” and make the decision rule match.
   - Pass condition: One consistent decision/outcome and one decision rule; no adopt wording if the deliverable is only a candidate handoff.

5. **[P3][non-blocking]** Location: `F7:9`, `F7:14-19`.
   - Evidence: “5 reps, median, MDE 20%, 95% CI bootstrap”; no warmup protocol, no reps-per-cell definition, “Stop after 20 minutes or high load” without a load threshold, and “Partial evidence is labelled” without saying where/how.
   - Why it matters: The experiment-sufficiency area is at floor (`16/20`), but the protocol is thin enough that a second reviewer would have to invent warmup, per-cell reps, and the partial-evidence label. The 20-minute block is also tight for five experiments.

   - Required action: Define warmup, reps per family/implementation, the “high load” threshold, and the exact partial-evidence labeling rule; consider a pilot timing run for the 20-minute block.
   - Pass condition: Protocol is executable without invented steps; partial evidence is labeled in the recorded artifacts.

---

## 5. Consolidated floor and gate status

| Input | Gate | Verdict | Score | Areas below floor / gate failure |
|---|---|---|---|---|
| F1 | Gate 1 | REVISE | 8/100 | All seven areas below floor; P0 plan cannot support decision; no baseline/metrics/slice/retention |
| F2 | Gate 1 | REVISE | 10/100 | All seven areas below floor; P0 D1-only plan; R1 coverage gap also noted (not a Gate 1 veto) |
| F3 | Gate 2 | REVISE | 15/100* | Gate 2 gate fail: claim at most `partial` supports adopt; missing approved plan/logs/raw/artifacts; no `CLAIMS.md`; underlying Gate 1 floors would fail |
| F4 | Gate 2 | REVISE | 15/100* | Gate 2 gate fail: `partial` claim supports adopt; missing representative slice/claim map/memo stamp |
| F5 | Invalid review | REVISE (reject) | 0/100 | No gate table/floors/claim table/evidence/findings; no reviewer or input record; “ship” before PASS |
| F6 | Gate 1 | PASS | 98/100 | None; 3/3 unresolved P2 at cap, accepted/bounded; P3-only observations |
| F7 | Gate 1 | REVISE | 78/100 | Selected-direction execution 14/16, reproducibility 7/8, risk/license/safety 7/8; total 78 < 80; P1 present |

\* Gate 2 has no numeric score table; the F3/F4 numbers are informational evidence-sufficiency scores only. Gate 2 is decided by the claim/recommendation rules and process audit.

### Gate 2 claim/gate summary

| Input | Claim status | Recommendation | Gate 2 result |
|---|---|---|---|
| F3 | C1 `partial` at most; REC-1 `unsupported` | “recommend adopt” — not allowed | **fail** |
| F4 | C1 `partial`; REC-1 `unsupported` | “Recommend adopt” — not allowed | **fail** |
| F5 | No claim table | “Ship it” — no gate/PASS | **fail** |

### Which inputs do not meet a floor

- **F1:** all seven Gate 1 floors.
- **F2:** all seven Gate 1 floors. The omitted do-nothing/existing-library alternative is an R1 pre-check finding, not a Gate 1 floor by itself.
- **F7:** selected-direction execution (`14/16`), reproducibility/artifacts (`7/8`), and risk/license/safety (`7/8`). Total `78/100` is also below the Gate 1 total gate.
- **F3/F4:** Gate 2 has no floors. The underlying summarized plan for F3 would fail Gate 1 decision/metrics, experiment sufficiency, and reproducibility; F4 supplies no Gate 1 plan to score.
- **F5:** no floor can be assessed because there is no review artifact to evaluate.
- **F6:** no floor failure; PASS.

## 6. Attestation

- The seven blind inputs were read only for this review and were not modified.
- The hashes above were recomputed after the review and match the frozen values.
- No expected outcome or prior review was consulted. The verdicts above are derived from the Gate 1/2 rules and the supplied text.

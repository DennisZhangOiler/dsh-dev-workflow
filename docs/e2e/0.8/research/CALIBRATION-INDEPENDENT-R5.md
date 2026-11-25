# Independent research calibration review — R5

> Independent, read-only review of `docs/calibration-blind/F1`–`F7`, using only
> `skills/rd-workflow-research-review.md` (Gate 1, Gate 2, explicit feedback rules,
> report templates, anchors, anti-patterns). The reviewer is not the author,
> experimenter, or synthesizer. No expected outcome, fixture manifest, answer key,
> or prior review was read; each verdict below was derived independently from the
> rubric for that input.

## 1. Reviewer record

| Field | Value |
|---|---|
| Reviewer ID | `calibration-reviewer-6` (independent subagent; root agent `lead`) |
| Model / provider | `deepseek-flash` / DeepSeek (DeepSeek Harness) |
| Role | Independent reviewer; not author/experimenter/synthesizer |
| Review started | 2026-11-25T15:28:30+08:00 (Asia/Shanghai) |
| Prompt file | `skills/rd-workflow-research-review.md` |
| Prompt SHA-256 | `80ccf3b9f6c320932a2e8d3215bd8df8f27ba2f5c9e626a7f05bcdf23513ab13` |
| Inputs read | `docs/calibration-blind/F1` … `F7`, in full (read-only) |
| Isolation | Did not read `docs/fixtures/`, `expected.json`, `docs/calibration-inputs/`, `REVIEW-LOG.md`, or any prior review/answer key |
| Expected outcome | Not known or assumed; verdicts derived per input from the rubric |
| Inputs modified | None |
| Output | This file only |

**Method.** Each input was read in full and treated as an independent review case.
For Gate 1 inputs (F1, F2, F6, F7) I scored the seven rubric areas out of 100,
applied every area floor, the total-floor, the P0/P1 rule, and the unresolved-P2
cap. For Gate 2 inputs (F3, F4) I used the claim/recommendation gate, not a numeric
score, because the rubric defines claim statuses and gate conditions rather than a
100-point score. F5 is itself a review artifact, so it is assessed against the
report template, the explicit feedback rules, and the anti-patterns. Every finding
below states severity, blocking status, location, evidence, why it matters,
required action, and pass condition.

**Hash verification.** `sha256sum` was run on the seven inputs and the prompt at
first read (15:28:30) and again immediately before this file was written
(15:30:29); both runs were identical. No input file was opened for writing.

## 2. Input hashes and gate assignment

| Input | Bytes | Gate applied | SHA-256 |
|---|---:|---|---|
| `F1` | 191 | Gate 1 (plan) | `f53937a0ad84895113ddd0b76c8f89890975cb8b5bf37172212abfe3d90dd5b4` |
| `F2` | 287 | Gate 1 (plan; R1 pre-check also fails) | `50dc2ed7684350153c23694e8daf398fea008771b14eb73b5ea117ef0a9bad71` |
| `F3` | 230 | Gate 2 (results) | `e78789bdb08498cf0c4a46e8bbdf3848e2c86b3d3e15b340505707fb745bd1d2` |
| `F4` | 133 | Gate 2 (results) | `b236c66a1dc59f59a3aceea63fb4d706a762f0281dc56bae93840bbdf2fcb06c` |
| `F5` | 69 | Review-artifact review (feedback rules / template) | `f2b73c97383b3b5b03c7563b9935a3f1656dfaf6ecfe436457cca9881817ee9a` |
| `F6` | 3299 | Gate 1 (plan) | `e0dbe7d4cd5a134a56ed4b4bbbefbfcec988cdb831300591c6e4f353e619c9a6` |
| `F7` | 1185 | Gate 1 (plan; floor-boundary case) | `acc586b04083ce9a3b048e47d12881470c37a96348bf0c8e2e40f2cf4fd29d7d` |

**Prompt file:** `skills/rd-workflow-research-review.md` (7060 bytes) —
`80ccf3b9f6c320932a2e8d3215bd8df8f27ba2f5c9e626a7f05bcdf23513ab13`.

## 3. Verdict summary

| Input | Gate | Verdict | Score | Floors failed | P0/P1 blocking | Unresolved P2 |
|---|---|---|---|---:|---|---|
| F1 | 1 | **REVISE** | 10/100 | all 7 | P0 ×1, P1 ×4 | n/a (fails on floors/P0-P1) |
| F2 | 1 | **REVISE** | 13/100 | all 7; R1 pre-check also FAIL | P1 ×5 | n/a (fails on floors/P0-P1) |
| F3 | 2 | **REVISE** | n/a (Gate 2 has no numeric score) | n/a | 3 | 1 (non-blocking) |
| F4 | 2 | **REVISE** | n/a (Gate 2 has no numeric score) | n/a | 1 | 1 (blocking) |
| F5 | review artifact | **REVISE** (invalid review; cannot be accepted as PASS) | n/a | n/a | 2 | 1 (blocking) |
| F6 | 1 | **PASS** | 87/100 | none | none | 2/3 open (plus 3 declared/accepted) |
| F7 | 1 | **REVISE** | 83/100 | experiment sufficiency (15/20 < 16) | P1 ×1; P2 cap not demonstrated | ≥4 (not demonstrably ≤3) |

**Note on `score`:** the rubric defines a 100-point gate only for Gate 1. It
defines Gate 2 by claim table and gate condition, and contains no score/floors for
results review. I therefore report `n/a` there rather than inventing a number.

---

## 4. F1 — Gate 1 plan review

**Input:** `F1` (191 B, SHA-256 `f53937a0…dd5b4`)
**Verdict: REVISE**
**Score: 10/100 (gate: fail)**
**Unresolved P2:** n/a — the gate is already failed by floors and P0/P1
**P0/P1 blocking:** P0 ×1, P1 ×4

| Area | Score | Floor | Status |
|---|---:|---:|---|
| Selected-direction execution | 4 | 16 | **FAIL** |
| Decision and metrics | 2 | 12 | **FAIL** |
| Baseline and controls | 0 | 12 | **FAIL** |
| Experiment sufficiency | 2 | 16 | **FAIL** |
| Reproducibility/artifacts | 1 | 8 | **FAIL** |
| Risk/license/safety | 0 | 8 | **FAIL** |
| Reviewability | 1 | 8 | **FAIL** |
| **Total** | **10** | **80** | **FAIL** |

### Findings

1. **[P0][blocking] Location:** `F1:4-5` (the whole plan). **Evidence:** “run one demo of candidate A; no baseline; one run; no thresholds; no comparison”. **Why:** with no baseline, no comparison, and no thresholds there is no falsifiable test; a one-off demo cannot support the decision “choose a parser library”. **Required action:** define the real current baseline and at least one comparator, pre-register the metrics with thresholds/MDE, and state an explicit decision rule. **Pass condition:** re-review sees the baseline, comparator, thresholds, and decision rule in the plan and no P0/P1 remains.
2. **[P1][blocking] Location:** `F1:4-5` — “one run”. **Evidence:** the plan records a single run, with no repetitions, warmup, order, variance, or CI. **Why:** a single run cannot support any performance or adoption claim, and there is no way to separate signal from noise. **Required action:** pre-declare repetitions/warmup/paired order and report median, variance, and 95% CI. **Pass condition:** the plan and results contain the runs/variance/CI protocol and per-cell numbers.
3. **[P1][blocking] Location:** `F1:5` — “no representative slice”. **Evidence:** exact wording; no workload families, sizes, malformed mix, exclusions, seeds, or hashes. **Why:** any measured behaviour would apply only to an unspecified demo payload; the decision cannot transfer to the production workload. **Required action:** define representative payload families/sizes, malformed ratio, exclusions, and fixed seeds/hashes. **Pass condition:** slice definition and exclusions are recorded and re-reviewed.
4. **[P1][blocking] Location:** `F1:5` — “no raw-data retention”. **Evidence:** exact wording; no commands, versions, seeds, or artifacts. **Why:** nothing can be recomputed or audited, so the reproducibility/artifacts floor cannot be met and any later claim is unverifiable. **Required action:** retain immutable raw data plus environment/version, command/exit, and seed logs, with a retention/cleanup rule. **Pass condition:** artifacts and rerun path are present and reproduced once by the reviewer.
5. **[P1][blocking] Location:** `F1:3-5` — decision frame and risk are absent. **Evidence:** the file contains only a decision line and a plan line; there are no user-selected directions with rationale/kill criteria, no falsifier per direction, and no license/dependency/CVE, sandbox/credential, data-security, timebox, or stop/abort condition. **Why:** Gate 1’s required inputs and the Risk area are missing, so execution of a chosen direction cannot be reviewed and there is no declared stop condition. **Required action:** add the decision frame (directions, rationale, kill criteria) and a risk/timebox/stop section before re-running plan review. **Pass condition:** both sections are present and score at/above floors on re-review.

**What would change the verdict:** a re-authored plan containing a real baseline,
thresholded metrics, repetitions/CI, a representative slice, raw-data retention,
and risk/timebox/stop rules; re-review then checks each floor.

---

## 5. F2 — Gate 1 plan review (R1 pre-check failure)

**Input:** `F2` (287 B, SHA-256 `50dc2ed7…bad71`)
**Verdict: REVISE**
**Score: 13/100 (gate: fail)**
**R1 pre-check: FAIL** (broad-direction-set coverage, before Gate 1)
**Unresolved P2:** n/a — the gate is already failed by floors/P1
**P0/P1 blocking:** P1 ×5

| Area | Score | Floor | Status |
|---|---:|---:|---|
| Selected-direction execution | 6 | 16 | **FAIL** |
| Decision and metrics | 2 | 12 | **FAIL** |
| Baseline and controls | 0 | 12 | **FAIL** |
| Experiment sufficiency | 2 | 16 | **FAIL** |
| Reproducibility/artifacts | 1 | 8 | **FAIL** |
| Risk/license/safety | 0 | 8 | **FAIL** |
| Reviewability | 2 | 8 | **FAIL** |
| **Total** | **13** | **80** | **FAIL** |

### Findings

1. **[P1][blocking] R1 pre-check — broad direction set incomplete. Location:** `F2:4-5`. **Evidence:** “User selected only D1 (candidate X) from a list that omitted the do-nothing option and an obvious existing-library alternative.” **Why:** the direction menu was incomplete before selection, so “D1 only” is not an informed choice and the R1 pre-check cannot pass; the user’s rationale “fast” has nothing comparable to be fast against. **Required action:** rebuild the direction set to include the do-nothing/current-baseline option, the obvious existing-library alternative (and any other obvious option), record keep/kill rationale and kill criteria for each, and obtain an explicit user decision on the expanded set. The reviewer must not veto D1 without new evidence and an explicit user decision; the correction is to complete the frame and re-decide, not to reject the choice unilaterally. **Pass condition:** the broad set coverage is documented, the user’s selection on the expanded set is recorded with rationale and kill criteria, and Gate 1 then reviews execution of that selected direction.
2. **[P1][blocking] No baseline or comparator. Location:** `F2:6`. **Evidence:** “D1 only; no baseline”. **Why:** without the current baseline, D1 cannot be measured as better or worse, so the decision cannot be supported. **Required action:** measure the real current baseline under the same workload/environment and include the existing-library comparator selected in the R1 frame. **Pass condition:** the plan contains both baseline and comparator with identical workload/environment/runtime.
3. **[P1][blocking] Rationale and metrics are untestable. Location:** `F2:5-6`. **Evidence:** user rationale “fast”; plan has “no thresholds”. **Why:** “fast” is not tied to a metric, workload, threshold, or decision rule, and Gate 1 requires the selected direction’s rationale/kill criteria plus metrics that answer the decision. **Required action:** state the metric, expected effect/MDE, success/failure meaning, and kill criterion. **Pass condition:** metric, threshold, decision rule, and kill criterion are recorded and testable.
4. **[P1][blocking] No experiments, falsifier, slice, or stop rule. Location:** `F2:6`. **Evidence:** “one run; no slice”. **Why:** the selected-direction execution area cannot pass; a single D1 run with no slice cannot falsify anything. **Required action:** give D1 one to three experiments, each with a falsifier, representative slice, and stop/decision rule. **Pass condition:** those elements are present and score at/above the execution floor.
5. **[P1][blocking] No raw data, artifacts, risk, or timebox. Location:** `F2:6`. **Evidence:** “no raw data”; no mention of commands/versions/seeds, dependencies/license/CVE, sandbox/credentials, data handling, or stop/abort. **Why:** no audit trail and no safety/stop boundary; reproducibility and risk floors cannot be met. **Required action:** add immutable raw data and environment/command/exit logs, plus license/dependency, sandbox/credential/data-security, timebox, and stop/abort rules. **Pass condition:** artifacts and risk/timebox sections are present and rerun-able.

**What would change the verdict:** complete the R1 direction set and obtain the
user’s explicit re-decision, then submit a Gate 1 plan for that direction with a
baseline/comparator, thresholds, runs/CI, slice, raw data, and risk/timebox.

---

## 6. F3 — Gate 2 results review

**Input:** `F3` (230 B, SHA-256 `e78789bd…bd1d2`)
**Verdict: REVISE**
**Score:** n/a — Gate 2 defines claim statuses and gate conditions, not a 100-point score
**Floors:** n/a — no area floors in Gate 2
**P0/P1 blocking:** 3

**Gate 2 conditions**

| Condition | Result |
|---|---|
| Every claim supported or partial-with-limit | **FAIL** — C1 is unsupported (at most partial) |
| No partial supporting adopt/migrate | **FAIL** — C1 is cited by an adopt recommendation |
| Every recommendation mapped to claims | **FAIL** — no claim IDs or mapping exist |

### Process findings

1. **[P1][blocking] Single run per arm; no variance/CI. Location:** `F3:4`. **Evidence:** “one run each; no variance/CI”. **Why:** the headline “2x faster” rests on one measurement per arm; with no repetitions or CI it is a point estimate with unknown noise, and the rubric forbids turning a single run into `supported` by lowering confidence. **Required action:** rerun with a pre-declared repetition count, warmup, and paired/alternating order; report per-arm variance and a 95% CI; retain the raw data. **Pass condition:** the rerun reports the variance/CI and the raw data is retained, or the claim is explicitly withdrawn.
2. **[P1][blocking] No representative slice. Location:** `F3:4`. **Evidence:** “no representative slice”. **Why:** even a correctly measured 2x on one workload cannot generalize; adopt/migrate requires a representative slice plus exclusions. **Required action:** define payload families/sizes/malformed mix and exclusions, then rerun the decisive comparison on that slice. **Pass condition:** the decisive comparison is measured on the representative slice and the exclusions are recorded.
3. **[P1][blocking] Raw data not retained; decisive metric cannot be recomputed. Location:** `F3:4`. **Evidence:** “raw data not retained”. **Why:** Gate 2 requires rerunning the decisive experiment or recomputing the headline metric for every adopt claim; without raw data neither is possible, so the claim cannot be verified and stays unsupported for a decision (one run is at most partial, and lowering confidence cannot make it `supported`). **Required action:** retain immutable raw data, logs, and artifacts; produce an independent `CLAIMS.md` with a hash before the draft memo; or withdraw the adopt claim. **Pass condition:** raw data and rerun/recompute path exist and the claim’s status is re-derived.
4. **[P2][non-blocking] Environment, order, and warmup unspecified. Location:** `F3:4`. **Evidence:** only “candidate X vs current baseline; one run each” is recorded. **Why:** without machine/Node/version, warmup, and alternating order, even a rerun may be biased; the baseline is named but not shown to be fair. **Required action:** record environment/versions, warmup, and order. **Non-blocking because:** the P1 findings already block the gate; this is a fixable design detail, not an additional independent blocker. **Pass condition:** environment/order/warmup are recorded in the execution log.

### Claim verdicts

| Claim ID | Claim | Evidence | Status | Allowed wording |
|---|---|---|---|---|
| C1 | “X is 2x faster” | `F3:4-5`: one run per arm, no variance/CI, no representative slice, raw data not retained | **unsupported** (partial at most) | “One unreplicated run on an unnamed workload; no speed conclusion; rerun required.” |
| REC-1 | “Recommend adopt” | `F3:5`: rests on C1; no representative slice, no pilot or written risk acceptance, no downstream `MIGRATION.md` | **unsupported as written**; at most candidate/pilot after C1 is supported | “Candidate/pilot only; adopt requires a supported claim on a representative slice plus pilot or written risk acceptance and a downstream `MIGRATION.md`.” |

### What cannot be concluded

The size, stability, and generality of any X-vs-baseline difference; anything about
production behaviour; any adopt/migrate recommendation.

---

## 7. F4 — Gate 2 results review

**Input:** `F4` (133 B, SHA-256 `b236c66a…fcb06c`)
**Verdict: REVISE**
**Score:** n/a — Gate 2 has no numeric score
**Floors:** n/a
**P0/P1 blocking:** 1 (P1); P2 blocking: 1

**Gate 2 conditions**

| Condition | Result |
|---|---|
| Every claim supported or partial-with-limit | **PARTIAL** — C1 is partial and must carry its limit |
| No partial supporting adopt/migrate | **FAIL** — the draft adopts while citing a partial claim |
| Every recommendation mapped to claims | **FAIL** — no claim IDs or mapping exist |

### Findings

1. **[P1][blocking] A `partial` claim is used to support “adopt”. Location:** `F4:3-4`. **Evidence:** “One supporting claim is `partial` (single sandbox run, no representative slice). Draft memo: ‘Recommend adopt.’” **Why:** Gate 2 explicitly says `partial` cannot support adopt/migrate; adopt requires all cited claims `supported` + measured here + a representative slice + a pilot or written risk acceptance + a downstream `MIGRATION.md`. The single sandbox run and missing representative slice leave C1 partial and fail the representativeness condition. **Required action:** either (a) rerun on a representative slice so C1 can become `supported`, then complete the pilot or written risk acceptance and `MIGRATION.md` before any adopt wording; or (b) downgrade the memo to candidate/pilot and state the limitation explicitly. **Pass condition:** re-review sees no `partial` claim cited by an adopt/migrate recommendation, claim IDs with statuses, and either the supported rerun package or a candidate/pilot recommendation with the limit recorded.
2. **[P2][blocking] No claim IDs, evidence mapping, confidence, or allowed wording. Location:** `F4:4`. **Evidence:** the memo contains only “Recommend adopt.”; the claim is not identified. **Why:** the recommendation cannot be mapped to claims and raw evidence, which Gate 2 requires before any user-facing conclusion; without IDs the memo cannot be stamped or delta-reviewed. **Required action:** add the claim table (claim ID, evidence, status, allowed wording, confidence) and cite claim IDs from the recommendation. **Pass condition:** the memo carries claim IDs and the recommendation maps to them; a SHA-256 stamp is recorded.

### Claim verdicts

| Claim ID | Claim | Evidence | Status | Allowed wording |
|---|---|---|---|---|
| C1 | Underlying supporting claim (unspecified in input) | `F4:3`: single sandbox run, no representative slice | **partial** | “Measured in a single sandbox run; not representative; candidate/pilot only.” |
| REC-1 | “Recommend adopt” | `F4:4`: cites a partial claim; no representative slice, pilot, written risk acceptance, or `MIGRATION.md` | **not allowed as adopt**; candidate/pilot at most | “Candidate/pilot only; adopt requires a supported claim on a representative slice plus pilot or written risk acceptance and a downstream `MIGRATION.md`.” |

### What cannot be concluded

Anything about representative or production behaviour; any adopt/migrate decision.

---

## 8. F5 — Review-artifact review (feedback rules and template)

**Input:** `F5` (69 B, SHA-256 `f2b73c97…7ee9a`)
**Verdict on the review artifact: REVISE** — invalid; it cannot be accepted as a
Gate 1 `PASS`.
**Score:** n/a — the artifact supplies no area scores or gate table
**Floors:** n/a — none are reported, so none can be verified
**Underlying plan:** unreviewed; no verdict is possible from the supplied evidence
**P0/P1 blocking:** 2

### Findings

1. **[P1][blocking] The review violates the required report and feedback rules. Location:** `F5:3`. **Evidence:** `Reviewer output: "Looks good. 90/100. Ship it."` **Why:** it contains no reviewer identity/model/provider, input hash, verdict/floor table, or findings; a score with no findings is an explicit anti-pattern; “Looks good” is forbidden wording; “Ship it” is a user-facing release recommendation with no `PASS`, no evidence, and no claim that the gate conditions were checked. A bare total also cannot demonstrate the Gate 1 requirements (every area at/above floor, total ≥80, no P0/P1, at most 3 unresolved P2). **Required action:** reject this output; redo it as a complete Gate 1 report with reviewer record, prompt/input hashes, verdict, seven-area score plus floors, P0–P3 findings (severity, blocking, location, evidence, why, required action, pass condition), and no forbidden phrases. **Pass condition:** the replacement report satisfies the template and feedback rules, including the floor table and P0–P2 counts.
2. **[P1][blocking] No plan or rubric inputs are attached, so nothing can be verified. Location:** entire fixture. **Evidence:** the file is a single quoted review sentence; there is no decision frame, selected directions, experiment plan, slice, constraints, or proposed artifacts. **Why:** the rubric instructs the reviewer to mark `REVISE` and name missing evidence when verification is impossible. **Required action:** supply the Gate 1 input set (decision frame, user-selected directions with rationale/kill criteria, experiment plan, slice, constraints, artifacts) and request a fresh plan review. **Pass condition:** the inputs are supplied and a compliant report is produced against them.
3. **[P2][blocking] The 90/100 number is unverifiable and cannot substitute for the gate table. Location:** `F5:3`. **Evidence:** only “90/100” appears; there are no area scores, floors, or P0/P1/P2 counts. **Why:** the total is a gate, not a diagnostic; even a correct total cannot establish that floors were met or that the P2 cap was respected. **Required action:** report the seven-area table, floor status, total, P0/P1 list, and unresolved-P2 count. **Pass condition:** the gate table supports the verdict on re-review.

**What would change the verdict:** a full, template-compliant plan review over an
attached Gate 1 input set. The current artifact is not evidence of `PASS` and
“Ship it” may not reach the user.

---

## 9. F6 — Gate 1 plan review

**Input:** `F6` (3299 B, SHA-256 `e0dbe7d4…19c9a6`)
**Verdict: PASS**
**Score: 87/100 (gate: pass)**
**Unresolved P2:** 2 open reviewer findings / 3 cap (plus 3 declared and accepted
residual limitations, which are not unresolved findings — see below)
**P0/P1 blocking:** none

| Area | Score | Floor | Status |
|---|---:|---:|---|
| Selected-direction execution | 17 | 16 | PASS |
| Decision and metrics | 14 | 12 | PASS |
| Baseline and controls | 15 | 12 | PASS |
| Experiment sufficiency | 16 | 16 | PASS (at floor) |
| Reproducibility/artifacts | 8 | 8 | PASS (at floor) |
| Risk/license/safety | 8 | 8 | PASS (at floor) |
| Reviewability | 9 | 8 | PASS |
| **Total** | **87** | **80** | **PASS** |

### Findings

1. **[P2][non-blocking] Experiment precision is not pre-declared. Location:** `F6:23` (7 timed reps, 95% bootstrap CI) and `F6:28` (adopt if “M2 delta ≥ 20% with CI excluding 0”). **Evidence:** the plan has repetitions and a CI but no CI half-width, power, or minimum-precision target; 7 reps can yield a wide bootstrap interval. **Why:** a “CI excluding 0” gate can be met by a noisy estimate, which risks interpreting an unstable difference as a 20% effect. **Required action:** pre-declare a precision rule (for example, the CI lower bound must clear the 20% threshold, or a stated half-width target), or raise reps to a justified count. **Pass condition:** re-review sees the precision rule in the decision rule and the reported interval satisfies it. **Non-blocking because:** a CI, raw data, and a decision rule exist; the gap is fixable without changing the experiment design and does not invalidate the plan at this stage.
2. **[P2][non-blocking] Artifact/reproducibility completeness. Location:** `F6:56-58`. **Evidence:** the plan lists harness, `data/raw.json`, `data/env.json`, input SHA-256, Node/npm versions, load average, command log with exit codes, production before/after hashes, and immutable raw data; it does not list a lockfile or image hash, retention, or cleanup. **Why:** exact A/B package versions are decision-relevant for parser performance, and retention/cleanup are explicit rubric checks. **Required action:** add the lockfile/image hash and a retention/cleanup rule. **Pass condition:** the artifact list and cleanup rule are present. **Non-blocking because:** versions, raw data, and commands are already recorded; the missing items can be added without changing the design, and the area is at its floor.
3. **[P3][non-blocking] “Blinded/paired order” is not defined. Location:** `F6:15`. **Evidence:** the plan says “Blinded/paired order” without saying what is blinded or how pairing/order is implemented. **Why:** wording ambiguity only; a paired alternating order with fresh children is otherwise specified. **Required action:** state the explicit pairing/order rule and drop “blinded” if not implementable. **Pass condition:** the order rule is unambiguous. **Non-blocking because:** the execution intent is recoverable and testability is unaffected.
4. **[P3][non-blocking] Sandbox/credential/data-security applicability is not stated. Location:** `F6:60-66`. **Evidence:** the risk section covers license/SCA, synthetic payloads, RSS, and single host/Node, but not sandbox isolation, credentials, or external data. **Why:** the rubric’s risk check lists those items; for a local synthetic benchmark they are likely N/A, but N/A should be recorded rather than omitted. **Required action:** add one line stating no credentials/external data and the local sandbox assumption. **Pass condition:** applicability is recorded. **Non-blocking because:** the likely absence of credentials/external data makes this a documentation gap, and the plan’s timebox/stop rules are present.

**Declared P2 limitations (accepted, not open findings).** `F6:62-64` records three
P2 limitations: synthetic payloads may not represent real field distributions;
RSS is a lower bound with no in-call peak; and single machine/single Node version
with no CI. They are labelled, bounded by the non-generalization statement, and
therefore treated as accepted residual risks rather than unresolved reviewer
findings. Counting them as open would consume the three-P2 cap before any new
finding; the plan’s explicit non-generalization is the disposition. They must be
carried into any memo and must not be silently generalized.

**Why PASS:** total 87 ≥ 80; every area at/above floor (three areas exactly at
floor); no P0/P1; two open P2 findings, within the cap of three. The three declared
limitations remain visible and bounded.

---

## 10. F7 — Gate 1 plan review (floor-boundary case)

**Input:** `F7` (1185 B, SHA-256 `acc586b0…29d7d`)
**Verdict: REVISE**
**Score: 83/100** — total above 80, but the gate is not the total
**Unresolved P2:** not demonstrably ≤ 3 (four limitations listed without
severity or acceptance) plus open findings
**P0/P1 blocking:** P1 ×1 (experiment-sufficiency floor); P2-cap condition not met

| Area | Score | Floor | Status |
|---|---:|---:|---|
| Selected-direction execution | 16 | 16 | PASS (at floor) |
| Decision and metrics | 13 | 12 | PASS |
| Baseline and controls | 14 | 12 | PASS |
| Experiment sufficiency | 15 | 16 | **FAIL** |
| Reproducibility/artifacts | 8 | 8 | PASS (at floor) |
| Risk/license/safety | 8 | 8 | PASS (at floor) |
| Reviewability | 9 | 8 | PASS |
| **Total** | **83** | **80** | **PASS total, gate FAIL on floor** |

### Findings

1. **[P1][blocking] Experiment sufficiency is below its floor (15/20 < 16). Location:** `F7:10` (p50 time: “5 reps, median, MDE 20%, 95% CI bootstrap”) and `F7:17` (latency matrix). **Evidence:** five timed reps and no warmup are specified; there is no variance/precision target, no discarded warmup runs, and no statement of run order beyond “alternating order” in the baseline line. **Why:** Node JIT warmup is not controlled, so p50 can be biased; a five-point bootstrap interval is unstable for a 20% effect and the plan has no precision rule for deciding that the interval is informative. This is the reason the area falls below the 16-point floor. **Required action:** add discarded warmup reps (for example, 3), at least 7 timed reps or a stated power/precision justification, and a pre-declared CI rule (for example, the CI lower bound must clear the 20% threshold); keep the three families and exclusions. **Pass condition:** re-review scores experiment sufficiency at/above 16 and sees the warmup/reps/precision rule in the plan.
2. **[P2][blocking] The unresolved-P2 cap is not demonstrated. Location:** `F7:24` (“Risks: synthetic distribution, lower-bound RSS, single host/Node, no CI.”). **Evidence:** four limitations are listed with no severity labels, no accept/mitigate decision, and no bound on each; unlike the labelled P2s in F6, they are undispositioned. **Why:** Gate 1 permits at most three unresolved P2; if all four are P2, the plan exceeds the cap, and the plan does not show a count at all. **Required action:** produce an explicit risk register classifying each item as P2/P3, recording accepted versus to-fix, and resolving or bounding them to at most three unresolved P2. **Pass condition:** re-review sees the register and a demonstrated count ≤ 3.
3. **[P2][non-blocking] Artifact completeness. Location:** `F7:21-22`. **Evidence:** artifacts are harness, raw/env JSON, input hashes, command/exit log, production before/after hashes, immutable raw; runtime/dependency versions, lockfile/image hash, retention, and cleanup are not listed. **Why:** exact A/B versions are decision-relevant, and retention/cleanup are rubric checks; `env JSON` may capture runtime but this is not stated. **Required action:** record runtime/dependency versions and a lockfile/image hash, plus retention/cleanup. **Pass condition:** the artifact list includes them. **Non-blocking because:** raw/env data, input hashes, and command logs already provide a partial rerun trail; the area remains at its floor and the fix does not alter the experiment design.
4. **[P2][non-blocking] Decision-rule and metric precision. Location:** `F7:9-11`. **Evidence:** “p50 parse time (5 reps, median, MDE 20%, 95% CI bootstrap)”, “post-parse RSS delta ≤ 32 MB”, “Adopt only if all gates pass”. **Why:** the M2 inequality is only implied (it is not stated as `≤ 0.8× baseline` with a CI condition), and malformed error quality is measured (`F7:18`) but has no adopt gate. **Required action:** state the M2 inequality/CI rule and add an error-quality gate (or explicitly exclude it). **Pass condition:** the decision rule enumerates each gate, including the error-quality disposition. **Non-blocking because:** the metrics and “all gates pass” rule make the intended decision recoverable; the area is above its floor (13/15), and this is clarification rather than new evidence.
5. **[P3][non-blocking] Selected-direction documentation. Location:** `F7:3-4`. **Evidence:** candidates A/B and the owner are named, but there is no recorded user/maintainer rationale for the selection and no explicit kill criterion per direction; “Adopt only if all gates pass; otherwise keep baseline” is a fallback rule, not a kill criterion. **Why:** Gate 1’s input item asks for user-selected directions with rationale/kill criteria; this is a documentation gap, not an execution gap. **Required action:** add one line per direction with rationale and the condition that kills it. **Pass condition:** the rationale and kill criterion are recorded. **Non-blocking because:** the area is at its floor (16/20) and the decision rule plus gate list make execution reviewable.

**Why REVISE despite total 83:** the total is a gate, not a diagnostic. The plan
fails the experiment-sufficiency floor (15/20 < 16) and does not demonstrate the
unresolved-P2 cap, so the total cannot carry it. The plan is close: fixing the
warmup/reps/precision rule and the risk register is the likely path to PASS.

---

## 11. Floor-failure register

| Input | Area | Score | Floor | Status |
|---|---|---:|---:|---|
| F1 | Selected-direction execution | 4 | 16 | **FAIL** |
| F1 | Decision and metrics | 2 | 12 | **FAIL** |
| F1 | Baseline and controls | 0 | 12 | **FAIL** |
| F1 | Experiment sufficiency | 2 | 16 | **FAIL** |
| F1 | Reproducibility/artifacts | 1 | 8 | **FAIL** |
| F1 | Risk/license/safety | 0 | 8 | **FAIL** |
| F1 | Reviewability | 1 | 8 | **FAIL** |
| F2 | Selected-direction execution | 6 | 16 | **FAIL** |
| F2 | Decision and metrics | 2 | 12 | **FAIL** |
| F2 | Baseline and controls | 0 | 12 | **FAIL** |
| F2 | Experiment sufficiency | 2 | 16 | **FAIL** |
| F2 | Reproducibility/artifacts | 1 | 8 | **FAIL** |
| F2 | Risk/license/safety | 0 | 8 | **FAIL** |
| F2 | Reviewability | 2 | 8 | **FAIL** |
| F6 | — | — | — | none |
| F7 | Experiment sufficiency | 15 | 16 | **FAIL** |

**Pre-gate failure:** F2 also fails the R1 broad-direction-set pre-check (`F2:4-5`).
**Not applicable:** F3, F4, F5 — Gate 2 and the feedback rules define claim/gate
conditions, not seven numeric area floors. Their failures are stated in their
sections (unsupported/partial claims, adopt wording, invalid review artifact).

## 12. Boundary and independence notes

- **F7 is the boundary case.** The total (83) clears 80, but experiment
  sufficiency is 15/20, one point below its floor. I scored it there because five
  timed reps and no warmup leave the p50 measurement confounded by JIT and make a
  five-point bootstrap CI too weak for a 20% gate; F6 gets 16/20 at the floor with
  7 reps plus warmup 3. A reviewer who scored F7 at 16/20 could reach a different
  total, but would still have to address the P2-cap count. This is the one
  deliberate calibration judgment in this review, stated so it can be audited.
- **F6 PASS depends on treating the plan’s three labelled P2 limitations as
  accepted, bounded residual risks rather than open findings.** They are explicit
  (`F6:62-64`) and non-generalized by design. Counting them as open would consume
  the cap; I did not, and I state the counting rule in §9. The plan is otherwise
  strong across all seven areas.
- **F1/F2 verdicts are insensitive to exact scoring.** Every area is far below
  floor; the numeric totals are approximate but the REVISE verdicts and blocking
  findings are robust.
- **F3/F4/F5 were marked REVISE where verification is impossible**, consistent
  with the rubric’s rule: if the reviewer cannot verify something, mark `REVISE`
  and name the missing evidence. F3/F4 supply no raw data or artifacts; F5
  supplies no plan at all.
- **No expected outcomes were consulted.** If this report is later compared with a
  frozen calibration answer key, these are the reviewer’s independent verdicts
  formed before any comparison.

## 13. Reviewer statement

I reviewed only `docs/calibration-blind/F1`–`F7` and the frozen prompt
`skills/rd-workflow-research-review.md`. I did not read the fixture manifest,
`expected.json`, `docs/calibration-inputs/`, `REVIEW-LOG.md`, or any prior review.
I did not modify any input. Reviewer: `calibration-reviewer-6`
(`deepseek-flash` / DeepSeek), 2026-11-25.

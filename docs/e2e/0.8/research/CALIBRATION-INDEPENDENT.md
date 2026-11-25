# Research calibration — independent review record

## Reviewer record

| Field | Value |
|---|---|
| Role / identity | `calibration-reviewer-2` |
| Model | `deepseek-flash` |
| Provider | `deepseek-official` |
| Review time | `2026-11-25T12:34:56+08:00` (Asia/Shanghai) |
| Review rubric | `skills/rd-workflow-research-review.md`, SHA-256 `884673dde3c01419580a5617f93187f4c328cc087b7bf3c1912a765a1a4470e4` |
| Inputs read | only the 7 files under `docs/calibration-inputs/` below (plus the rubric file) |
| Not read | `docs/fixtures/`, `expected.json`, `docs/e2e/` prior content, and any prior review |
| Writes | this file only; no input file modified (`sha256sum` pre/post identical) |
| Scope | fixture-level calibration verdicts on the supplied text only; not a project R2/R3 approval and no demo authorization is implied |

### Input SHA-256

| Input | Bytes | SHA-256 |
|---|---:|---|
| `docs/calibration-inputs/floor-boundary.md` | 546 | `12c5b2818a7b5bb25e708f19dcc4c4ee680724c04ea45970fdd584d820ded41a` |
| `docs/calibration-inputs/narrow-directions.md` | 293 | `fe149d4c8a41d77ec9e0fdf71c2179b268aeb6d6a31085fbef875f07705268bb` |
| `docs/calibration-inputs/partial-adopt.md` | 137 | `91b525208d118e2f6d4dbcfc9ecb37935650080fb8dedf4a897f172e273ab001` |
| `docs/calibration-inputs/single-run-strong.md` | 242 | `2f8dbc54a46c144133247ab8cb5bf22f97795b593fb520cbb77bc758141c5169` |
| `docs/calibration-inputs/strong-plan.md` | 43010 | `7976d59fc308871863cec7ca5cf94f5599b59ce10ec8a017d37aa08005fe2eab` |
| `docs/calibration-inputs/vague-review.md` | 72 | `d127a9ab355e7131a7ac56e1ef46dc5eee86cf54e5a55a3358b6aaecc74bd321` |
| `docs/calibration-inputs/weak-plan.md` | 191 | `08c55314f8ed2e504776d2a2eb7f233e71f32984f6232ba56ced3c95457c382f` |

## Verdict summary

| Fixture | Gate / artifact | Verdict | Score or rejection basis | Floor result | Key finding |
|---|---|---|---|---:|---|
| `weak-plan.md` | Gate 1 | **REVISE** | **15/100** | 7/7 areas **below** floor | no baseline, no metrics, one run, no slice, no raw-data retention |
| `narrow-directions.md` | Gate 1 | **REVISE** | **17/100** | 7/7 areas **below** floor | same execution gaps; coverage P2: option set omitted D0 + existing library, recorded but **not a veto** |
| `single-run-strong.md` | Gate 2 | **REVISE** | no score; claim `partial` — allowed wording **“sandbox single run, variance unknown”**; adopt `unsupported` | n/a (Gate 2 has no floors) | n=1 each, no CI/slice/raw data; “2x faster” is not established |
| `vague-review.md` | invalid review artifact | **REJECTED** | no score; not a gate review | n/a | “Looks good. 90/100. Ship it.” has no fields, gate table, evidence, or verdict |
| `strong-plan.md` | Gate 1 | **PASS** | **91/100** | 7/7 areas **above** floor | detailed execution/metrics/harness plan; 3 P3 residuals; no P0/P1 |
| `partial-adopt.md` | Gate 2 | **REVISE** | no score; sole claim `partial`; adopt recommendation limited to candidate/pilot | n/a (Gate 2 has no floors) | `partial` cannot support adopt; no representative slice, pilot/risk acceptance, or `MIGRATION.md` |
| `floor-boundary.md` | Gate 1 | **PASS** | **80/100 (exactly at every floor)** | 7/7 areas **at** floor | minimum complete skeleton; 2 P3 residuals; any material weakening flips to REVISE |

**Gate 1 failures:** `weak-plan.md`, `narrow-directions.md` (below floor in every area).
**Gate 2 failures:** `single-run-strong.md`, `partial-adopt.md` (claim/recommendation gate, not a floor score).
**Invalid artifact:** `vague-review.md` (rejected; not a PASS/REVISE).
**PASS:** `strong-plan.md`, `floor-boundary.md`.

Scoring convention used here: per-area anchors are 0 = missing/unusable, 50 = present with a material gap, 100 = specific, testable, sufficient. Each Gate 1 floor is 80 % of that area's points. A score at a floor is a *boundary pass*; a below-floor area is a blocking gate failure. Total is a gate, not a diagnostic.

---

## Gate 1 fixture 1 — `weak-plan.md` — REVISE

**Score: 15/100.** Total < 80, and **every area is below floor**. P0/P1: **0 P0 / 6 P1**. Unresolved P2: 0/3.

**Rubric basis:** Gate 1 (`skills/rd-workflow-research-review.md`, “Gate 1 - Plan review”): the seven-row table above is the rubric's area/point/floor table; gate = every area at/above floor, total ≥ 80, no P0/P1, at most 3 unresolved P2.

| Area | Pts | Floor | Score | Status | Evidence in input |
|---|---:|---:|---:|---|---|
| Selected-direction execution | 20 | 16 | 5 | below floor | only “one demo of candidate A” (`:4`); no 1–3 experiments, falsifier, slice, stop/decision rule, rationale, or kill criteria |
| Decision and metrics | 15 | 12 | 4 | below floor | decision named (`:3`); no metrics, MDE, thresholds, decision rule, or success/failure meaning (`:4-5`) |
| Baseline and controls | 15 | 12 | 0 | below floor | explicit “no baseline” and “no comparison” (`:4-5`) |
| Experiment sufficiency | 20 | 16 | 3 | below floor | “one run”; no variance/CI, no representative slice, no edge/semantic cases, no harness validity (`:4-5`) |
| Reproducibility/artifacts | 10 | 8 | 1 | below floor | explicit “no raw-data retention”; no commands, versions, seeds, or cleanup (`:5`) |
| Risk/license/safety | 10 | 8 | 0 | below floor | no dependency/license/CVE, sandbox, credentials, data/security, timebox, or stop/abort anywhere (`:1-5`) |
| Reviewability | 10 | 8 | 2 | below floor | no testable claims, assumptions, or executable steps; “demo” is undefined (`:4`) |

### Findings

- **[P1][blocking] Baseline and controls — 0/15.**
  - **Location:** `docs/calibration-inputs/weak-plan.md:4-5`.
  - **Evidence:** “no baseline”; “no comparison”.
  - **Why:** a result from candidate A is unanchored; any speed or correctness statement cannot be attributed to the candidate rather than the environment or tester.
  - **Required action:** define the real current parser baseline (source/version), run it on the same workload/environment/runtime as candidate A, and retain the paired comparison.
  - **Pass condition:** baseline identity, identical workload/env/runtime, and paired result artifact are present; area ≥ 12/15.

- **[P1][blocking] Decision and metrics — 4/15.**
  - **Location:** `docs/calibration-inputs/weak-plan.md:3-5`.
  - **Evidence:** decision is only “choose a parser library”; there are “no thresholds” and no decision rule.
  - **Why:** the stated decision has no pass/fail criterion, so any demo can be narrated as success; the choice is not auditable.
  - **Required action:** declare metrics (e.g., correctness/parity, latency, dependency/build cost), an MDE or threshold, and an explicit rule for success/failure and stop.
  - **Pass condition:** pre-declared metric table with thresholds and a decision rule; area ≥ 12/15.

- **[P1][blocking] Selected-direction execution and experiment sufficiency — 5/20 and 3/20.**
  - **Location:** `docs/calibration-inputs/weak-plan.md:4-5`.
  - **Evidence:** “run one demo of candidate A”; “one run”; “no representative slice”.
  - **Why:** one demo and one run are a single observation; without reps, variance/CI, semantic edge cases, a representative slice, or harness validity, noise cannot be separated from effect and the result cannot support a parser decision.
  - **Required action:** specify 1–3 executable experiments with an explicit falsifier, a representative slice with exclusions, repeated runs with variance/CI, edge/semantic cases, and a harness-validity check.
  - **Pass condition:** experiment table, slice definition, runs/CI plan, and harness check are present; selected-direction area ≥ 16/20 and sufficiency ≥ 16/20.

- **[P1][blocking] Reproducibility/artifacts — 1/10.**
  - **Location:** `docs/calibration-inputs/weak-plan.md:5`.
  - **Evidence:** “no raw-data retention”.
  - **Why:** the headline observation cannot be recomputed or reviewed; Gate 2 would have no raw evidence to map to claims.
  - **Required action:** retain raw data, record commands, versions, seeds, environment, and define retention/cleanup.
  - **Pass condition:** commands, versions, seeds, raw data, and retention plan are present and hash-checked; area ≥ 8/10.

- **[P1][blocking] Risk/license/safety — 0/10.**
  - **Location:** `docs/calibration-inputs/weak-plan.md:1-5` (no risk content).
  - **Evidence:** no dependency/license/CVE check, no sandbox, no data/security statement, no timebox, no stop/abort conditions.
  - **Why:** a parser candidate can carry an incompatible license, a CVE, or untrusted input execution; without controls the recommendation can be invalidated after the fact.
  - **Required action:** add a dependency/license/CVE check, sandbox/isolation, data/security rules, and a timebox with stop/abort triggers.
  - **Pass condition:** risk table and abort conditions are present; area ≥ 8/10.

- **[P1][blocking] Reviewability — 2/10.**
  - **Location:** `docs/calibration-inputs/weak-plan.md:4`.
  - **Evidence:** “run one demo” is not executable as written; no artifact list, no assumptions, no claim IDs, no stop rule.
  - **Why:** an independent reviewer or experimenter must invent the demo, workload, and pass/fail rule; the plan cannot be executed without invented steps.
  - **Required action:** make the plan executable with named commands/artifacts, exposed assumptions, and testable claims.
  - **Pass condition:** a different agent can run it without invention; area ≥ 8/10.

**Gate result:** FAIL. `15 < 80`; all seven areas below floor; six blocking P1s.

---

## Gate 1 fixture 2 — `narrow-directions.md` — REVISE

**Score: 17/100.** Total < 80, and **every area is below floor**. P0/P1: **0 P0 / 6 P1**. Unresolved P2: 1/3 (coverage note; non-blocking).

**Rubric basis:** Gate 1 area/floor table; the Gate 1 preamble also makes broad-direction coverage an R1 pre-check and forbids vetoing the user's choice without new evidence and an explicit user decision — recorded below as P2, not as the verdict driver.

| Area | Pts | Floor | Score | Status | Evidence in input |
|---|---:|---:|---:|---|---|
| Selected-direction execution | 20 | 16 | 7 | below floor | D1 only; one run; no falsifier, slice, stop/decision rule, or kill criteria; rationale is only “fast” (`:4-6`) |
| Decision and metrics | 15 | 12 | 4 | below floor | decision named (`:3`); no metrics/MDE/threshold/decision rule (`:6`) |
| Baseline and controls | 15 | 12 | 0 | below floor | explicit “no baseline” (`:6`) |
| Experiment sufficiency | 20 | 16 | 2 | below floor | “one run”; “no slice”; no variance/CI or semantic cases (`:6`) |
| Reproducibility/artifacts | 10 | 8 | 1 | below floor | “no raw data” (`:6`) |
| Risk/license/safety | 10 | 8 | 0 | below floor | no risk/license/safety content (`:1-6`) |
| Reviewability | 10 | 8 | 3 | below floor | selection/rationale recorded, but no executable experiments or testable claims (`:4-6`) |

### Findings

- **[P1][blocking] Baseline and controls — 0/15.**
  - **Location:** `docs/calibration-inputs/narrow-directions.md:6`.
  - **Evidence:** “no baseline”.
  - **Why:** D1’s result cannot be compared with the current parser or with the omitted alternative; the “fast” rationale is unmeasured.
  - **Required action:** define the current parser baseline on the same workload/environment/runtime and run a paired comparison.
  - **Pass condition:** baseline definition and paired artifact present; area ≥ 12/15.

- **[P1][blocking] Decision and metrics — 4/15.**
  - **Location:** `docs/calibration-inputs/narrow-directions.md:3,6`.
  - **Evidence:** decision is “choose a parser library”; no thresholds or metrics.
  - **Why:** the selection cannot be judged; “fast” is a preference, not a decision rule.
  - **Required action:** declare metrics, an MDE/threshold, and a success/failure rule.
  - **Pass condition:** pre-declared metric table and rule; area ≥ 12/15.

- **[P1][blocking] Selected-direction execution and experiment sufficiency — 7/20 and 2/20.**
  - **Location:** `docs/calibration-inputs/narrow-directions.md:4-6`.
  - **Evidence:** “Plan: D1 only; no baseline; one run; no thresholds; no slice; no raw data.”
  - **Why:** the user-selected direction has no falsifier, slice, stop rule, or repeated measurement; a single run cannot support even a directional claim, let alone a parser choice.
  - **Required action:** give D1 1–3 experiments with a falsifier, representative slice, repetitions/variance/CI, and stop/decision rule; record the user’s kill criteria.
  - **Pass condition:** D1 experiment table and gate apply; selected-direction area ≥ 16/20 and sufficiency ≥ 16/20.

- **[P1][blocking] Reproducibility/artifacts — 1/10.**
  - **Location:** `docs/calibration-inputs/narrow-directions.md:6`.
  - **Evidence:** “no raw data”.
  - **Why:** no audit trail or recomputation path.
  - **Required action:** record commands, versions, seeds, raw data, and retention/cleanup.
  - **Pass condition:** artifacts present and hash-checked; area ≥ 8/10.

- **[P1][blocking] Risk/license/safety — 0/10.**
  - **Location:** `docs/calibration-inputs/narrow-directions.md:1-6` (no risk content).
  - **Evidence:** no license/CVE, sandbox, data, timebox, or abort content.
  - **Why:** parser-candidate adoption can be blocked by license/security; absence makes the plan incomplete even if the narrow selection is retained.
  - **Required action:** add license/CVE screening, sandbox/data rules, and stop/abort triggers.
  - **Pass condition:** risk table present; area ≥ 8/10.

- **[P1][blocking] Reviewability — 3/10.**
  - **Location:** `docs/calibration-inputs/narrow-directions.md:6`.
  - **Evidence:** one-line plan; no commands, artifact list, assumptions, or claim IDs.
  - **Why:** the plan cannot be run or reviewed without invention.
  - **Required action:** make the selected-direction plan executable and testable.
  - **Pass condition:** executable without invented steps; area ≥ 8/10.

- **[P2][non-blocking] R1 broad-direction coverage — omission recorded, not a veto.**
  - **Location:** `docs/calibration-inputs/narrow-directions.md:4-5`.
  - **Evidence:** the source list “omitted the do-nothing option and an obvious existing-library alternative”; the user selected only D1 (candidate X) with rationale “fast”.
  - **Why:** the selection was made from an incomplete option set, so the decision frame is under-informed. This Gate 1 check evaluates execution of the user’s selected directions; the rubric says not to veto the user’s choice without new evidence and an explicit user decision. The finding is therefore recorded, not used as a veto of D1. It remains non-blocking at this gate but must be visible to the user.
  - **Required action:** record the omitted D0 and existing-library option in the R1 coverage log; ask the user whether to expand the set. Do not silently add or remove directions.
  - **Pass condition:** coverage note is present, the user’s accept/extend decision is recorded, and the verdict is not attributed to “narrowness” alone. Non-blocking because the verdict already fails on execution gaps; it does not change the user’s choice.

**Gate result:** FAIL. `17 < 80`; all seven areas below floor; six blocking P1s. The REVISE is driven by execution gaps, **not** by the narrow selection; the coverage finding is P2 and explicitly non-vetoing.

---

## Gate 1 fixture 3 — `floor-boundary.md` — PASS (boundary)

**Score: 80/100.** Every area is **exactly at floor**; total is exactly the gate minimum. P0/P1: **0 P0 / 0 P1**. Unresolved P2: 0/3. P3: 2.

**Rubric basis:** Gate 1 area/floor table; PASS requires every area ≥ floor, total ≥ 80, no P0/P1, and at most 3 unresolved P2. Every area is at the floor rather than above it.

| Area | Pts | Floor | Score | Status | Evidence in input |
|---|---:|---:|---:|---|---|
| Selected-direction execution | 20 | 16 | 16 | at floor | D0 do-nothing + D1 candidate, user selected both (`:4`); workload, metrics, slice, decision/stop rules supplied at minimum (`:6-9`); rationale is only implicit and kill criteria are folded into stop/abort (P3) |
| Decision and metrics | 15 | 12 | 12 | at floor | correctness/parity, median latency, dependency/build cost, MDE 20 %, decision rule, stop/abort, timebox (`:8-9`) |
| Baseline and controls | 15 | 12 | 12 | at floor | current parser, same workload/environment/runtime (`:5`) |
| Experiment sufficiency | 20 | 16 | 16 | at floor | 1k/10k, fixed seed, 5 runs, warmup, median/CI, one representative slice with two entry points, exclusions, raw data (`:6-7`) |
| Reproducibility/artifacts | 10 | 8 | 8 | at floor | PLAN, raw data, env, hashes retained (`:10`) |
| Risk/license/safety | 10 | 8 | 8 | at floor | risk/license/safety checks named (`:10`) |
| Reviewability | 10 | 8 | 8 | at floor | decision rule, stop/abort, timebox, and artifacts make the plan executable at minimum (`:8-10`) |

### Findings

- **[P3][non-blocking] User rationale and per-direction kill criteria are only implicit.**
  - **Location:** `docs/calibration-inputs/floor-boundary.md:4,8-9`.
  - **Evidence:** “user selected both” records the selection but not the user’s rationale; “decision rule and stop/abort conditions” cover run-level stopping but are not named per-direction kill criteria.
  - **Why:** a stronger audit trail would make the choice easier to re-review, but the decision frame (D0 do-nothing vs D1 candidate) and the stop/abort rule still make the plan executable. This is a documentation gap, not a floor miss at the 80 % boundary.
  - **Required action:** record the user’s rationale and explicit per-direction kill criteria in the plan before execution.
  - **Pass condition:** rationale/kill criteria are present; selected-direction execution remains ≥ 16/20. Non-blocking because the plan already meets the floor without it.

- **[P3][non-blocking] Artifact and risk specifics are named only at category level.**
  - **Location:** `docs/calibration-inputs/floor-boundary.md:10`.
  - **Evidence:** “PLAN, raw data, env, hashes; risk/license/safety checks” does not specify which files are hashed, the algorithm, retention/cleanup, or the concrete license/CVE checks.
  - **Why:** at the boundary, the categories exist; the missing detail would matter for a real review, but does not drop any area below floor.
  - **Required action:** specify hashed files, retention/cleanup, and license/CVE checks in the execution plan.
  - **Pass condition:** artifact manifest and risk checklist are concrete; no area drops below floor.

### Residual risks (recorded; do not change PASS)

- Five runs with a CI may still leave a wide interval; “median/CI” is not a variance estimate by itself.
- One representative slice with two entry points is a narrow basis for a parser choice.
- The 20-minute timebox may truncate runs; the plan does not state the fallback if it expires.
- Synthetic parser workloads may not represent the real caller distribution.
- License/CVE and dependency/build-cost checks are named but not specified; the repo license state is not recorded.
- No statement on CPU pinning/governor or machine noise control.

**Gate result:** PASS at the boundary. `80 ≥ 80`; no P0/P1; 0 unresolved P2. This is a **boundary pass**: any material weakening in any area would put it below floor and flip the verdict to REVISE. The residuals are carried forward, not waived.

---

## Gate 1 fixture 4 — `strong-plan.md` — PASS

**Score: 91/100.** Every area is above floor. P0/P1: **0 P0 / 0 P1**. Unresolved P2: 0/3. P3: 3.

**Rubric basis:** Gate 1 area/floor table; PASS requires every area ≥ floor, total ≥ 80, no P0/P1, and at most 3 unresolved P2. All seven areas are above floor, so the only open items are P3 residuals.

| Area | Pts | Floor | Score | Status | Evidence in input |
|---|---:|---:|---:|---|---|
| Selected-direction execution | 20 | 16 | 18 | above floor | D0 control + D1–D4 approved; each direction has exactly three experiments plus shared fit; kill criteria and falsifiers are tabulated (`:45-63`, `:96-137`); user rationale is inferred, not captured (P3) |
| Decision and metrics | 15 | 12 | 14 | above floor | M1–M5, MDE 20 %, bootstrap CI, PASS/FAIL/CANNOT CONCLUDE, M2-D4, post-call memory wording (`:251-290`) |
| Baseline and controls | 15 | 12 | 14 | above floor | verbatim `src/dedupe.js` copy, SHA-256 equality, same workload/env/runtime, mutant control, no strawman (`:28-32`, `:84-110`, `:345-360`) |
| Experiment sufficiency | 20 | 16 | 18 | above floor | curated + 10k random parity corpus, edge/semantic cases, 7 reps with warmup/CI, representative slice + exclusions, strong harness validity (`:168-365`) |
| Reproducibility/artifacts | 10 | 8 | 9 | above floor | commands, versions, seeds, raw data, hashes, retention/cleanup, artifact tree (`:34-43`, `:433-507`) |
| Risk/license/safety | 10 | 8 | 9 | above floor | no new dependency/license/CVE surface; synthetic data; sandbox; timebox; abort conditions; repo license unresolved (`:509-528`, `:398-431`) |
| Reviewability | 10 | 8 | 9 | above floor | assumptions exposed, executable commands, anticipated claim IDs, allowed wording, review ownership (`:65-80`, `:530-560`) |

### Findings

- **[P3][non-blocking] User rationale for D1–D4 is inferred, not captured.**
  - **Location:** `docs/calibration-inputs/strong-plan.md:49-51,79`.
  - **Evidence:** “Recorded rationale (inferred, pending confirmation)” and “inferred and were not captured in-session (G7)”; the plan says the bullets are recorded for confirmation, not as the user’s words.
  - **Why:** the audit trail for *why* D1–D4 were selected is weak. It does not invalidate execution because the approved set is recorded and the kill criteria are tabulated, so the plan can run and be reviewed; it remains a provenance gap for the eventual memo.
  - **Required action:** capture the user’s actual rationale or an explicit confirmation before the R6 memo, and keep the “inferred” caveat until then.
  - **Pass condition:** actual rationale is recorded or the caveat is carried into the memo; selected-direction execution stays ≥ 16/20. Non-blocking because approval of the direction set and the kill criteria are already recorded.

- **[P3][non-blocking] M4 memory gate is a post-call lower bound, not a peak measurement.**
  - **Location:** `docs/calibration-inputs/strong-plan.md:262,333-336`.
  - **Evidence:** the plan names “post-call heap delta” and “post-call ΔRSS”, states this is a “lower bound on peak”, and forbids “peak memory” as a measured claim.
  - **Why:** a lower-bound gate can pass an implementation whose transient peak is high, so memory claims must stay restricted. The plan explicitly limits wording and the gate still measures retained post-call memory, so this is a scoped limitation rather than a gate failure.
  - **Required action:** keep the post-call wording; if peak memory is a contractual constraint, add in-call sampling as a separate metric.
  - **Pass condition:** the memo uses only the allowed post-call wording; no area drops below floor. Non-blocking because the plan already forbids peak claims and the limitation is declared.

- **[P3][non-blocking] Seven reps on one desktop with no CPU pinning/governor control is a precision risk.**
  - **Location:** `docs/calibration-inputs/strong-plan.md:170-179,353`.
  - **Evidence:** 7 reps, paired ratios, alternating order, bootstrap CI; the plan lists “single host, single Node version, no CPU pinning/governor control, 7 reps (wide CI)” as known validity limits.
  - **Why:** CI width and machine drift can produce CANNOT CONCLUDE or a noisy PASS. The paired/alternating design and loadavg recording mitigate it; this is a residual risk, not a missing component.
  - **Required action:** report CI width and loadavg, and carry the single-host/wide-CI limitation into the memo.
  - **Pass condition:** the memo states the limits and does not generalize beyond “measured here on synthetic Node 22”; no area drops below floor. Non-blocking because the design already includes pairing, alternation, and raw rep retention.

### Residual risks (recorded; do not change PASS)

- Single host, single Node version (22.23.2), no CPU pinning or governor control; 7 reps can yield wide CIs.
- Synthetic distributions; no real caller data, call frequency, or concurrency.
- Memory is post-call, not peak; D4’s copy/sort transient is not sampled in-call.
- D1’s `±0` divergence is known and non-adoptable under A2; if the `Object.is` contract is relaxed, the semantic change needs a new decision.
- D3’s weak-memory premise may not materialize; the plan says it is measured, not assumed.
- D4 comparator correctness is the main implementation risk; the plan tests it but a sort-copy still needs implementation review.
- Repo license is unknown; the plan defers license/engines resolution to Development.
- No lockfile exists; this is acceptable only because the dependency set is empty and the `package.json` hash is recorded.

**Gate result:** PASS. `91 ≥ 80`; all seven areas above floor; no P0/P1; 0 unresolved P2; three P3 findings. The score is a gate, not a diagnostic; the residuals above must travel with the memo.

---

## Gate 2 fixture 1 — `single-run-strong.md` — REVISE

**Gate 2 has no numeric score.** The gate is claim status plus recommendation mapping. The draft conclusion asserts a performance claim and an adopt recommendation from one run each.

**Rubric basis:** Gate 2 (“Gate 2 - Results review”): a claim is `supported`/`partial`/`unsupported`; a `partial` claim cannot support adopt/migrate; every recommendation must map to claim IDs and the adopt preconditions (representative slice, pilot or written risk acceptance, downstream `MIGRATION.md`).

**Process note:** the input does not permit the mandated order (approved plan → logs/raw/artifacts → independent `CLAIMS.md` → memo). No independent `CLAIMS.md` was producible from a five-line summary; the table below is a reconstructed claim set, and the claim IDs are assigned by this reviewer, not by the author.

### Claim verdicts

| Claim ID | Claim | Evidence | Status | Measured here? | Confidence | Allowed wording / rerun |
|---|---|---|---|---|---|---|
| CLM-1 | “X is 2x faster” | `single-run-strong.md:4`: “one run each; no variance/CI; no representative slice; raw data not retained”; `:5` | **partial** | not verifiable (no logs/raw data) | low; variance unknown | **“sandbox single run, variance unknown”** — “2x faster” must not be presented as established; rerun required with repeated runs, variance/CI, representative slice, retained raw data |
| REC-1 | “recommend adopt” | `single-run-strong.md:5`; cites only CLM-1 | **unsupported as adopt** (limited to candidate/pilot) | not verifiable | none for adoption | “candidate for a pilot; adoption not supported” — adopt/migrate requires all cited claims supported + measured-here + representative slice + pilot or written risk acceptance + downstream `MIGRATION.md` |

**Rerun command/result:** none available — no command, raw rep data, or environment record was retained, so the “2x” headline metric cannot be recomputed. A rerun is required before any upgrade from `partial`.

### Process findings

- **[P1][blocking] Gate 2 input set is incomplete.**
  - **Location:** `docs/calibration-inputs/single-run-strong.md:1-5`.
  - **Evidence:** only a five-line plan summary and a draft conclusion; no approved plan, execution logs, raw data, artifacts, independent `CLAIMS.md`, or memo.
  - **Why:** the required Gate 2 sequence (approved plan → logs/raw/artifacts → independent claims extraction → memo mapping) cannot be performed; no headline metric can be recomputed.
  - **Required action:** supply the approved plan, commands/environment, raw per-run data, artifacts, and an independent `CLAIMS.md` before a results review.
  - **Pass condition:** all Gate 2 inputs are present and hashed; the reviewer can rerun or recompute the decisive experiment.

- **[P1][blocking] One run each with no variance or CI.**
  - **Location:** `docs/calibration-inputs/single-run-strong.md:4`.
  - **Evidence:** “one run each; no variance/CI”.
  - **Why:** a single paired observation cannot distinguish a real speed difference from warm-up, scheduling, JIT, or machine noise; lowering confidence never turns a single run into `supported`.
  - **Required action:** repeat the measurement with a pre-declared protocol, report variance and CI, and retain every raw rep.
  - **Pass condition:** repeated runs with variance/CI and a pre-declared MDE; the claim can move to `supported` only on that evidence.

- **[P1][blocking] No representative slice.**
  - **Location:** `docs/calibration-inputs/single-run-strong.md:4`.
  - **Evidence:** “no representative slice”.
  - **Why:** the 2x claim has no defined workload, inputs, or exclusions; it cannot support a parser choice for the project.
  - **Required action:** define the representative slice, input distribution, and exclusions; rerun on that slice.
  - **Pass condition:** slice definition and exclusions are recorded; the rerun covers them.

- **[P1][blocking] Raw data are not retained.**
  - **Location:** `docs/calibration-inputs/single-run-strong.md:4`.
  - **Evidence:** “raw data not retained”.
  - **Why:** the headline metric cannot be recomputed or audited; the claim is not reviewable as evidence.
  - **Required action:** retain raw JSON/logs, commands, versions, and seeds.
  - **Pass condition:** raw data and recomputation command are available.

- **[P1][blocking] Adopt recommendation is not supported by a partial claim.**
  - **Location:** `docs/calibration-inputs/single-run-strong.md:5`.
  - **Evidence:** “Draft conclusion: ‘X is 2x faster; recommend adopt.’” with only one run each.
  - **Why:** Gate 2 forbids a `partial` claim from supporting adopt/migrate; the recommendation also lacks measured-here verification, a representative slice, pilot/written risk acceptance, and a downstream `MIGRATION.md`.
  - **Required action:** downgrade the recommendation to candidate/pilot, or supply supported claims plus the adopt preconditions and a new review.
  - **Pass condition:** recommendation wording is limited to candidate/pilot, or all adopt preconditions are evidenced and re-reviewed.

- **[P2][non-blocking] No memo stamp, claim IDs, or delta-review trigger.**
  - **Location:** `docs/calibration-inputs/single-run-strong.md:5`.
  - **Evidence:** a draft conclusion only; no memo SHA-256, claim table, or allowed-wording record.
  - **Why:** once wording changes, the review cannot tell which claim version was approved. This is material but fixable after the evidence exists; the blocking P1s above already stop the gate.
  - **Required action:** stamp the memo with its SHA-256 and claim IDs; any later wording change triggers delta review.
  - **Pass condition:** memo stamp and claim IDs are present. Non-blocking only because the gate already fails on evidence.

### What cannot be concluded

- “X is 2x faster” is **not established**; at most it is “sandbox single run, variance unknown”.
- Adopt/migrate cannot be concluded; no representative slice, no variance/CI, no retained raw data, no pilot or risk acceptance, no `MIGRATION.md`.
- Production, browser, or other-Node-version behavior cannot be inferred.
- The next action is a rerun with repeated measurements, a representative slice, and retained raw data — not more prose.

### Memo stamp

Not available. The input is a draft conclusion, not a stamped memo; no claim IDs or SHA-256 are present. Gate 2 is not complete.

**Gate result:** REVISE. The claim is `partial` with the exact allowed wording “sandbox single run, variance unknown”; the adopt recommendation is unsupported/limited to candidate/pilot.

---

## Gate 2 fixture 2 — `partial-adopt.md` — REVISE

**Gate 2 has no numeric score.** One supporting claim is already classified `partial`; the draft memo recommends adopt.

**Rubric basis:** Gate 2 (“Gate 2 - Results review”): `partial` cannot support adopt/migrate; adopt/migrate requires all cited claims `supported`, measured-here, a representative slice, a pilot or written risk acceptance, and a downstream `MIGRATION.md`; every recommendation must cite claim IDs.

**Process note:** the input does not permit the mandated order (approved plan → logs/raw/artifacts → independent `CLAIMS.md` → memo). No independent `CLAIMS.md` was producible from a one-line draft memo; the table below is a reconstructed claim set, and the claim IDs are assigned by this reviewer, not by the author.

### Claim verdicts

| Claim ID | Claim | Evidence | Status | Measured here? | Confidence | Allowed wording / rerun |
|---|---|---|---|---|---|---|
| CLM-1 | Supporting claim | `partial-adopt.md:3`: “single sandbox run, no representative slice” | **partial** | single sandbox run only; no artifacts to verify | low | “single sandbox run; no representative slice; not adoptable” |
| REC-1 | “Recommend adopt” | `partial-adopt.md:4`; cites a `partial` claim | **unsupported as adopt** (limited to candidate/pilot) | not verifiable | none for adoption | “candidate/pilot only; adopt not supported” — must not be user-facing as an adoption recommendation |

**Rerun command/result:** none available — the input records a single sandbox run with no command, slice, or raw data; a rerun is required before the claim can leave `partial`.

### Findings

- **[P1][blocking] A `partial` claim is cited for an adopt recommendation.**
  - **Location:** `docs/calibration-inputs/partial-adopt.md:3-4`.
  - **Evidence:** the only supporting claim is “`partial` (single sandbox run, no representative slice)”; the draft memo says “Recommend adopt”.
  - **Why:** Gate 2 is explicit: `partial` cannot support adopt/migrate. The recommendation is therefore invalid as written regardless of how promising the sandbox result looked.
  - **Required action:** downgrade the recommendation to candidate/pilot, or upgrade the claim to `supported` with a rerun on a representative slice and retained evidence.
  - **Pass condition:** no `partial` claim supports adopt/migrate; recommendation wording is limited to candidate/pilot or all cited claims are `supported`.

- **[P1][blocking] No representative slice.**
  - **Location:** `docs/calibration-inputs/partial-adopt.md:3`.
  - **Evidence:** “no representative slice”.
  - **Why:** adopt/migrate requires a representative slice; a sandbox-only result cannot establish that the change is safe or beneficial for the real workload.
  - **Required action:** define and run the representative slice, including exclusions; rerun the decisive experiment.
  - **Pass condition:** representative slice and results are present and reviewed.

- **[P1][blocking] No pilot or written risk acceptance and no downstream `MIGRATION.md`.**
  - **Location:** `docs/calibration-inputs/partial-adopt.md:4` (absent).
  - **Evidence:** only “Draft memo: ‘Recommend adopt.’”; no pilot, risk acceptance, or migration artifact.
  - **Why:** the Gate 2 adopt/migrate preconditions include a pilot or written risk acceptance and a downstream `MIGRATION.md`; without them, adoption is not reviewable even if the claim were supported.
  - **Required action:** run a pilot or record written risk acceptance, and produce the downstream `MIGRATION.md` owned by Development.
  - **Pass condition:** pilot/risk acceptance and `MIGRATION.md` are present and mapped to claim IDs.

- **[P1][blocking] No rerun/recompute of the decisive experiment.**
  - **Location:** `docs/calibration-inputs/partial-adopt.md:3`.
  - **Evidence:** single sandbox run; no rerun command/result.
  - **Why:** Gate 2 requires a rerun or recomputation for every adopt/migrate claim; if impossible, the claim is at most `partial` and cannot support adopt.
  - **Required action:** rerun the decisive experiment with the approved protocol and report the result; if impossible, keep the claim `partial` and drop adoption.
  - **Pass condition:** rerun command/result is recorded, or the recommendation remains candidate/pilot only.

- **[P2][non-blocking] No claim IDs, memo table, or memo hash/stamp.**
  - **Location:** `docs/calibration-inputs/partial-adopt.md:4`.
  - **Evidence:** a one-line draft memo with no claim IDs, mapping, or SHA-256.
  - **Why:** without IDs and a stamp, the reviewed wording cannot be tied to evidence or delta-reviewed. Fixable once the recommendation is downgraded; the blocking findings already stop adoption.
  - **Required action:** add the claim table with IDs, map the recommendation to cited claims, and stamp the memo with SHA-256.
  - **Pass condition:** IDs/mapping/stamp are present. Non-blocking only because the gate already fails.

### What cannot be concluded

- Adopt/migrate cannot be concluded; the sole claim is `partial` and the adopt preconditions are absent.
- The sandbox result may be useful as a candidate/pilot signal only; it is not representative.
- The next action is a rerun on a representative slice plus pilot/risk acceptance and `MIGRATION.md`, or a downgrade to candidate/pilot.

### Memo stamp

Not available. The input is a one-line draft memo; no claim IDs or SHA-256. Gate 2 is not complete.

**Gate result:** REVISE. `partial` cannot support adopt; the recommendation is limited to candidate/pilot.

---

## Invalid review artifact — `vague-review.md` — REJECTED

**Verdict: REJECTED.** This is not a Gate 1 plan, a Gate 2 memo, or a valid review. It is a three-line purported reviewer output; it cannot receive a PASS/REVISE, and the underlying work remains unreviewed. **No score**; “90/100” is inadmissible because there are no findings or gate table to support it.

**Rubric basis:** `## Explicit feedback rules` (every finding must contain severity, location, evidence, why, required action, pass condition) and `## Anti-patterns` (a score without a gate table/findings; sending an unreviewed conclusion).

| Rejection test | Result | Evidence |
|---|---|---|
| Reviewer record | absent | no identity, model, provider, time, prompt hash, or input hash (`:3`) |
| Verdict | absent | no `PASS`/`REVISE`; “Ship it” is an unsupported ship recommendation (`:3`) |
| Gate table | absent | no areas, points, floors, or total; bare “90/100” (`:3`) |
| Finding fields | absent | no severity, location, evidence, why, required action, or pass condition; only “Looks good” (`:3`) |
| Evidence | absent | no file/line/command/number inspected (`:3`) |
| Residual risks | absent | none (`:3`) |
| Forbidden wording | present | “Looks good” is vague praise in the forbidden “looks reasonable” class; “Ship it” sends an unreviewed conclusion (`:3`) |
| Anti-patterns | present | score with no gate table/findings; unreviewed user-facing conclusion; no claim/evidence mapping |

**Rejection basis:** under the rubric’s explicit feedback rules and anti-patterns, a review must contain severity, location, evidence, why, required action, and pass condition; a score without findings is a failed review. This artifact contains none of the required fields, no gate table, no residual risks, and no evidence. The “Ship it” conclusion must not be acted on.

---

## Floor / verdict index

| Fixture | Gate | Floor status | P0/P1 | P2 | P3 | Verdict |
|---|---|---|---:|---:|---:|---|
| `weak-plan.md` | Gate 1 | 7/7 below floor | 0/6 | 0 | 0 | REVISE |
| `narrow-directions.md` | Gate 1 | 7/7 below floor | 0/6 | 1 (non-blocking coverage) | 0 | REVISE |
| `floor-boundary.md` | Gate 1 | 7/7 exactly at floor | 0/0 | 0 | 2 | PASS (boundary) |
| `strong-plan.md` | Gate 1 | 7/7 above floor | 0/0 | 0 | 3 | PASS |
| `single-run-strong.md` | Gate 2 | n/a (no floors) | 5 blocking | 1 | 0 | REVISE |
| `partial-adopt.md` | Gate 2 | n/a (no floors) | 4 blocking | 1 | 0 | REVISE |
| `vague-review.md` | invalid artifact | n/a | n/a | n/a | n/a | REJECTED |

- **Does not satisfy floor:** `weak-plan.md` and `narrow-directions.md` — every one of the seven areas is below its floor.
- **Exactly at floor:** `floor-boundary.md` — PASS only because every area is at, not above, its floor; it is the boundary case.
- **Above floor:** `strong-plan.md` — PASS with residual risks and P3 findings.
- **PASS:** `strong-plan.md`, `floor-boundary.md`.
- **REVISE:** `weak-plan.md`, `narrow-directions.md`, `single-run-strong.md`, `partial-adopt.md`.
- **REJECTED:** `vague-review.md` — invalid review artifact; not a gate verdict.

## Input integrity

The seven input hashes were recomputed at `2026-11-25T12:37:29+08:00`; all seven match the table at the top. No input file was edited, moved, or deleted. This file is the only write.

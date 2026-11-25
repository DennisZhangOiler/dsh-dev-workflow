# Independent calibration review — R6 (blind)

## 1. Reviewer record

| Field | Value |
|---|---|
| Reviewer ID | `calibration-reviewer-7` |
| Role | Independent research calibration reviewer; not author, experimenter, or synthesizer |
| Model / provider | `deepseek-flash` / DeepSeek |
| Review round | R6, blind calibration |
| Session time | 2026-11-25T15:33+08:00 (Asia/Shanghai); elapsed-since-last-message unavailable |
| Governing rubric | `skills/rd-workflow-research-review.md` (Gate 1, Gate 2, explicit feedback rules, calibration, anti-patterns) only |
| Report path | `docs/e2e/0.8/research/CALIBRATION-INDEPENDENT-R6.md` |
| Prior involvement | None; this reviewer did not write the inputs and has not seen any expected outcome |

Independence statement: I read only the rubric file and `docs/calibration-blind/F1`–`F7`.
I did **not** read `docs/fixtures/`, `expected.json`, `docs/calibration-inputs/`,
any prior review, `REVIEW-LOG.md`, or any answer key. The output file did not exist
before this write. No input was modified; no expected verdict was assumed.

## 2. Frozen inputs and prompt hashes

SHA-256 of each input (captured at intake, before findings; post-write verification in §7):

| Input | Size (bytes) | SHA-256 |
|---|---:|---|
| `docs/calibration-blind/F1` | 191 | `f53937a0ad84895113ddd0b76c8f89890975cb8b5bf37172212abfe3d90dd5b4` |
| `docs/calibration-blind/F2` | 287 | `50dc2ed7684350153c23694e8daf398fea008771b14eb73b5ea117ef0a9bad71` |
| `docs/calibration-blind/F3` | 230 | `e78789bdb08498cf0c4a46e8bbdf3848e2c86b3d3e15b340505707fb745bd1d2` |
| `docs/calibration-blind/F4` | 133 | `b236c66a1dc59f59a3aceea63fb4d706a762f0281dc56bae93840bbdf2fcb06c` |
| `docs/calibration-blind/F5` | 69 | `f2b73c97383b3b5b03c7563b9935a3f1656dfaf6ecfe436457cca9881817ee9a` |
| `docs/calibration-blind/F6` | 3299 | `e0dbe7d4cd5a134a56ed4b4bbbefbfcec988cdb831300591c6e4f353e619c9a6` |
| `docs/calibration-blind/F7` | 2019 | `bf730d6e766a6ecc35f23e471ca4f8f942f6cc3eaa4ec517e79fadf1742a836f` |

- **Prompt file**: `skills/rd-workflow-research-review.md` —
  `80ccf3b9f6c320932a2e8d3215bd8df8f27ba2f5c9e626a7f05bcdf23513ab13`
- **Input-set hash** (raw bytes of F1→F7 concatenated in name order):
  `d8a764ca2271e1c22b4259b718e3197786d501eb4caffce2f93a63d5e65a6991`

Method note: Gate 1 applies the area floors, the 100-point total (gate, not a
diagnostic), the no-P0/P1 rule, and the “at most 3 unresolved P2” limit. Gate 2
applies claim statuses, the partial-cannot-support-adopt rule, recommendation
mapping, and memo stamping; the rubric defines no 100-point score for Gate 2, so
no numeric Gate 2 score is invented in this report. F5 is a review artifact, not
a plan or results packet; it is tested against the reviewer-output rules and
anti-patterns.

## 3. Verdict summary

| Input | Applicable gate / type | Verdict | Score | Floor result | Blocking findings |
|---|---|---|---|---:|---:|---|
| F1 | Gate 1 plan | **REVISE** | 6/100 | 0/7 floors met | 3 P0 + 3 P1 |
| F2 | Gate 1 plan; R1 pre-check also fails | **REVISE** | 7/100 (provisional; Gate 1 not validly entered) | 0/7 floors met | 3 P0 (incl. R1 coverage) + 2 P1 |
| F3 | Gate 2 results | **REVISE** | n/a (Gate 2 has no 100-point gate) | n/a; claim gate fails | 3 P1 + 1 P2 |
| F4 | Gate 2 results | **REVISE** | n/a (Gate 2 has no 100-point gate) | n/a; claim gate fails | 2 P1 |
| F5 | Review artifact (not a plan/results review) | **REVISE** (invalid review output) | 0/100 as a gate record | All reviewer-output requirements absent | 3 P0 + 1 P1 + 1 P2 |
| F6 | Gate 1 plan | **REVISE** | 87/100 | Reproducibility 7/10 < 8 (one floor fail) | 1 P2 blocking via floor (2 P2 non-blocking) |
| F7 | Gate 1 plan (self-declared floor-boundary) | **PASS** | 80/100 | 7/7 floors met exactly at floor | None; 3 accepted P2 + 2 P3 |

Headline: F6 is the total-vs-floor case — its total (87) clears 80, but the
reproducibility floor does not, and the gate is not a total-only check. F7 is a
floor-boundary pass at exactly 80/100, with no margin: any floor drop or one more
unresolved P2 changes the verdict. F1–F5 cannot support a decision or conclusion.

## 4. Per-input reviews

### F1 — plan review: no baseline, no metrics, one demo

**Verdict: REVISE.** **Score: 6/100.** P0/P1: blocking. Unresolved P2: 0.

| Area | Score | Floor | Status | Basis |
|---|---:|---:|---|---|
| Selected-direction execution | 2 | 16 | **FAIL** | One demo named; no falsifier, slice, stop/decision rule, or rationale record |
| Decision and metrics | 0 | 12 | **FAIL** | No metrics, thresholds, MDE, or success/failure meaning |
| Baseline and controls | 0 | 12 | **FAIL** | Explicitly no baseline and no comparison |
| Experiment sufficiency | 2 | 16 | **FAIL** | One run; no edge cases, variance/CI, representative slice, or harness description |
| Reproducibility/artifacts | 0 | 8 | **FAIL** | No commands, versions, seeds, raw-data retention, or artifacts |
| Risk/license/safety | 0 | 8 | **FAIL** | No dependency/license/CVE, sandbox, data/security, timebox, or abort rule |
| Reviewability | 2 | 8 | **FAIL** | No testable claim, exposed assumption, or executable step |

Findings:

- **[P0][blocking] Location:** F1 lines 3–4, plan/baseline.
  **Evidence:** “run one demo of candidate A; no baseline … no comparison.”
  **Why:** With no baseline or comparator, any observed result cannot be
  attributed to candidate A; the “choose a parser library” decision is
  unsupported.
  **Required action:** Define the real current baseline (or explicit
  do-nothing/current-library baseline), the same workload/environment, and a
  paired candidate-vs-baseline comparison.
  **Pass condition:** Baseline and controls are specified, non-strawman, and
  comparable; Baseline and controls ≥ 12/15.

- **[P0][blocking] Location:** F1 line 4, decision rule.
  **Evidence:** “no thresholds; … no representative slice.”
  **Why:** There is no criterion for success, failure, or stopping; no result can
  be judged sufficient for the decision.
  **Required action:** State metric(s) tied to parser choice, an MDE/threshold, a
  decision rule, and what success/failure means.
  **Pass condition:** Metrics answer the decision and include thresholds plus a
  decision rule; Decision and metrics ≥ 12/15.

- **[P0][blocking] Location:** F1 lines 3–4, experiment design.
  **Evidence:** “one demo … one run; … no comparison.”
  **Why:** A single unpaired run with no slice, variance, CI, or edge cases
  cannot distinguish candidate behavior from noise or workload specifics.
  **Required action:** Predefine repetitions, variance/CI, a representative
  slice with exclusions, edge/semantic cases, and harness validity checks.
  **Pass condition:** Experiment sufficiency ≥ 16/20 with a run plan and
  representative slice.

- **[P1][blocking] Location:** F1 lines 4–5, artifacts/reproducibility.
  **Evidence:** “no raw-data retention”; no commands, versions, or seeds stated.
  **Why:** The demo cannot be audited, rerun, or recomputed; no reviewer can
  verify a later claim.
  **Required action:** Specify commands, versions, seeds, raw data, input hashes,
  dependencies/lockfile or image hash, retention, and cleanup.
  **Pass condition:** Reproducibility/artifacts ≥ 8/10 and raw evidence is
  retained.

- **[P1][blocking] Location:** F1 entire input, risk/license/safety.
  **Evidence:** No risk, license, CVE, sandbox, credential, data, or timebox
  statement appears.
  **Why:** Unaddressed dependency/license or data-safety risk can invalidate the
  choice independently of performance.
  **Required action:** Add license/SCA, native-build/dependency checks, sandbox
  isolation, credential/data handling, timebox, and stop/abort conditions.
  **Pass condition:** Risk/license/safety ≥ 8/10 with the required controls
  listed.

- **[P1][blocking] Location:** F1 lines 3–4, selected-direction execution.
  **Evidence:** Only “candidate A” and “one demo” are present; there is no
  recorded rationale, kill criterion, falsifier, or stop/decision rule.
  **Why:** The plan does not show that the selected direction is being executed
  in a way that could be falsified.
  **Required action:** Record the selected direction, its rationale and kill
  criteria, 1–3 experiments with falsifiers, the slice, and the stop rule.
  **Pass condition:** Selected-direction execution ≥ 16/20.

### F2 — plan review: incomplete direction set (R1 pre-check) plus no baseline

**Verdict: REVISE.** **Score: 7/100 provisional** (Gate 1 is not validly entered
because the broad-direction-set R1 pre-check fails). Floors: 0/7 met.

| Area | Score | Floor | Status | Basis |
|---|---:|---:|---|---|
| Selected-direction execution | 4 | 16 | **FAIL** | D1 and rationale “fast” recorded, but no kill criteria, falsifier, slice, stop rule, or experiment set; selected from an incomplete list |
| Decision and metrics | 0 | 12 | **FAIL** | No thresholds or decision rule |
| Baseline and controls | 0 | 12 | **FAIL** | No baseline; do-nothing/current-library option omitted from the candidate list |
| Experiment sufficiency | 2 | 16 | **FAIL** | One run; no slice, edge cases, variance/CI, or harness |
| Reproducibility/artifacts | 0 | 8 | **FAIL** | No raw-data retention, commands, versions, or seeds |
| Risk/license/safety | 0 | 8 | **FAIL** | No dependency/license/CVE, sandbox, data, timebox, or ablation |
| Reviewability | 1 | 8 | **FAIL** | The decision cannot be tested or executed without inventing the missing comparison |

Findings:

- **[P0][blocking] Location:** F2 lines 3–5, R1 broad-direction-set pre-check /
  decision frame.
  **Evidence:** “User selected only D1 (candidate X) from a list that omitted
  the do-nothing option and an obvious existing-library alternative.”
  **Why:** The candidate set is not the broad direction set the R1 pre-check
  requires. A choice made from a truncated list can select X without ever
  comparing the incumbent/no-change option; the decision frame is biased before
  Gate 1 execution is reviewed. This is a pre-check failure, not permission to
  override the user.
  **Required action:** Return to R1; restore the do-nothing/current-library
  baseline and the obvious existing-library alternative (plus any other
  material directions), present the broad set, and record the user’s explicit
  selection, rationale, and kill criteria. Do not veto D1 absent new evidence
  and a new user decision.
  **Pass condition:** The broad direction set is documented, the user explicitly
  re-selects from it, and the selection/rationale/kill criteria are recorded
  before Gate 1 is scored.

- **[P0][blocking] Location:** F2 line 6, plan/baseline.
  **Evidence:** “D1 only; no baseline; one run.”
  **Why:** “Fast” is unanchored; a single candidate run cannot establish a
  comparative or absolute performance claim.
  **Required action:** Add the real current baseline and same-workload paired
  comparison; retain D1 as selected but measure it against the baseline.
  **Pass condition:** Baseline and controls ≥ 12/15.

- **[P0][blocking] Location:** F2 line 6, decision rule.
  **Evidence:** “no thresholds; … no slice.”
  **Why:** No threshold or decision rule means the plan cannot say when D1 is
  acceptable or when to stop.
  **Required action:** Define metrics, MDE/thresholds, decision rule, and
  success/failure meaning tied to the parser decision.
  **Pass condition:** Decision and metrics ≥ 12/15.

- **[P1][blocking] Location:** F2 line 6, experiment sufficiency.
  **Evidence:** “one run; no thresholds; no slice; no raw data.”
  **Why:** No variance/CI, no representative slice, and no edge cases; results
  cannot be generalized or distinguished from noise.
  **Required action:** Add repetitions/variance/CI, a representative slice with
  exclusions, semantic/edge cases, and harness validity checks.
  **Pass condition:** Experiment sufficiency ≥ 16/20.

- **[P1][blocking] Location:** F2 line 6, artifacts/reproducibility.
  **Evidence:** “no raw data”; no commands, versions, or seeds.
  **Why:** The run cannot be audited or rerun; a later claim would be
  unverifiable.
  **Required action:** Specify commands, versions, seeds, raw data, input hashes,
  dependency/lockfile or image hash, retention, and cleanup.
  **Pass condition:** Reproducibility/artifacts ≥ 8/10.

### F3 — results review: single unretained runs used to claim “2x faster” and adopt

**Applicability:** F3 contains executed runs (“one run each”) and a draft
conclusion, so Gate 2 applies. If treated as a Gate 1 plan, it also fails Gate 1
floors; the decisive review is Gate 2 because a user-facing conclusion is being
validated.

**Verdict: REVISE.** **Score: n/a** — Gate 2 is a claim gate, not a 100-point
score; no score is defined by the rubric. Gate result: **C1 is `partial`; REC-1
adopt is unsupported; no claim is `supported`.**

**Claim verdicts**

| Claim ID | Claim | Evidence | Status | Allowed wording |
|---|---|---|---|---|
| C1 | “X is 2x faster” than the current baseline | One run each; no variance/CI; no representative slice; raw data not retained; no commands/artifacts supplied | **partial** — a single-run observation at most; as an effect-size or comparative claim it is unsupported | “One single-run observation suggested X may be faster; no 2x effect estimate, no CI, no generalization.” |

**Recommendation verdict**

| Rec ID | Recommendation | Cites | Status | Allowed wording |
|---|---|---|---|---|
| REC-1 | “Recommend adopt” X | C1 (`partial`) | **unsupported** — partial cannot support adopt/migrate; representative slice, pilot/written risk acceptance, and `MIGRATION.md` are absent | Must be withdrawn. At most: “candidate for a controlled follow-up,” not adopt. |

Findings:

- **[P1][blocking] Location:** F3 line 4, C1 / decisive measurement.
  **Evidence:** “one run each; no variance/CI; … raw data not retained.”
  **Why:** A single run cannot support “2x faster”; no CI/variance means noise is
  unquantified, and no retained raw data means the headline metric cannot be
  recomputed or rerun. The rubric is explicit that lowering confidence never
  turns a single run into `supported`.
  **Required action:** Retain raw data and commands/environment; run repeated,
  alternating, warmup-controlled trials with a defined statistic and 95% CI;
  retain a representative slice; recompute or rerun the decisive comparison.
  **Pass condition:** C1 becomes `supported` only if the repeated measurement and
  CI clear a predeclared threshold on a representative slice, and the raw
  evidence is auditable; otherwise C1 remains `partial` with descriptive-only
  wording.

- **[P1][blocking] Location:** F3 line 4, C1 / representative slice.
  **Evidence:** “no representative slice.”
  **Why:** Even a real speed difference on one unspecified input cannot be
  generalized to the parser decision; the result may be workload-specific.
  **Required action:** Define payload families/shape, exclusions, seeds/hashes,
  and per-family results before claiming a general speedup.
  **Pass condition:** Representative slice and exclusions are present, and C1 is
  scoped to the families actually measured.

- **[P1][blocking] Location:** F3 line 5, REC-1 / recommendation mapping.
  **Evidence:** “Draft conclusion: ‘X is 2x faster; recommend adopt.’”
  **Why:** REC-1 cites a `partial` C1. Under Gate 2, `partial` cannot support
  adopt/migrate. Adopt additionally requires all cited claims `supported` +
  measured-here + representative slice + pilot or written risk acceptance +
  downstream `MIGRATION.md`; none is evidenced.
  **Required action:** Withdraw the adopt recommendation or downgrade it to a
  candidate/pilot recommendation; if adopt is desired, produce supported claims,
  a representative slice, a rerun/recompute, a pilot or written risk acceptance,
  and the downstream migration document.
  **Pass condition:** No partial claim supports adopt; every cited claim is
  `supported`; all adopt prerequisites are present; otherwise the recommendation
  is limited to candidate/pilot.

- **[P2][blocking] Location:** F3 entire input, Gate 2 process packet.
  **Evidence:** Only a plan summary and a draft conclusion are supplied; there is
  no approved plan hash, execution log, raw data, artifact list, independent
  `CLAIMS.md` extraction/hash, or memo stamp.
  **Why:** The reviewer cannot audit commands/environment, baseline fairness,
  variance/CI, harness validity, missing runs, cherry-picking, semantic parity,
  failed experiments, slice coverage, or dependency changes. Reading the draft
  before an independent claim extraction would also violate the required order.
  **Required action:** Supply the approved plan, execution logs, raw data, and
  artifacts; produce the independent `CLAIMS.md` with a hash before the draft
  memo; stamp the memo with its SHA-256 and claim IDs.
  **Pass condition:** The Gate 2 packet is complete, the independent extraction
  precedes memo review, and the memo is stamped.

**What cannot be concluded:** Whether X is 2x faster; whether any speedup is
reliable or generalizable; whether X is adoptable; whether the baseline was fair;
whether results were cherry-picked. **Next experiment:** rerun the comparison with
retained raw data, repeated alternating trials, a defined statistic/CI, and a
represented slice; then re-extract claims and re-review.

**Memo stamp:** None. The draft conclusion has no SHA-256, no claim IDs, and no
delta-review trigger; any later wording change cannot be delta-reviewed against a
baseline.

### F4 — results review: partial claim used for “Recommend adopt”

**Verdict: REVISE.** **Score: n/a** (Gate 2 has no 100-point gate). Gate result:
**C1 is `partial`; REC-1 adopt is unsupported.**

**Claim verdicts**

| Claim ID | Claim | Evidence | Status | Allowed wording |
|---|---|---|---|---|
| C1 | The supporting claim under review | “single sandbox run, no representative slice” | **partial** — one sandbox observation, no representativeness | “In one sandbox run, the observed result held; not representative; no adopt/migrate conclusion.” |

**Recommendation verdict**

| Rec ID | Recommendation | Cites | Status | Allowed wording |
|---|---|---|---|---|
| REC-1 | “Recommend adopt” | C1 (`partial`) | **unsupported** — partial cannot support adopt/migrate; pilot/written risk acceptance and `MIGRATION.md` are absent | Withdraw adopt. At most: “candidate/pilot for further validation.” |

Findings:

- **[P1][blocking] Location:** F4 lines 3–4, REC-1 / recommendation mapping.
  **Evidence:** “One supporting claim is `partial` … Draft memo: ‘Recommend
  adopt.’”
  **Why:** Gate 2 forbids `partial` from supporting adopt/migrate. The
  recommendation cites a claim that is explicitly limited to a single sandbox run
  without a representative slice, so the adopt conclusion is unsupported.
  **Required action:** Downgrade the memo to candidate/pilot, or obtain a
  `supported` claim (measured here, representative slice, rerun/recompute), a
  pilot or written risk acceptance, and a downstream `MIGRATION.md`; then re-map
  the recommendation to supported claim IDs.
  **Pass condition:** No partial cites an adopt/migrate recommendation; every
  adopt prerequisite is present; otherwise the memo is limited to
  candidate/pilot.

- **[P1][blocking] Location:** F4 entire input, Gate 2 process packet.
  **Evidence:** The input has two content lines: one partial-claim sentence and one
  draft memo sentence. No approved plan hash, execution logs, raw data, artifacts,
  independent `CLAIMS.md`, memo hash/claim IDs, claim-to-evidence mapping, or
  unused-results list is supplied.
  **Why:** Without the packet the reviewer cannot verify the partial status,
  baseline fairness, variance/CI, harness validity, semantic parity, failed runs,
  slice coverage, or dependency changes; nor can the memo claim absent from
  extraction be listed. The absent memo stamp also prevents delta review.
  **Required action:** Supply the complete ordered Gate 2 packet; extract claims
  independently before reading the memo; map memo claims to extracted claims and
  raw evidence; list absent claims and unused results; stamp the memo with its
  SHA-256 and claim IDs.
  **Pass condition:** Complete packet and mapping; memo stamped; recommendation
  cites only supported claims.

**What cannot be concluded:** Whether the supporting claim generalizes beyond the
sandbox; whether any adopt/migrate claim is supported; whether the baseline was
fair; whether evidence was cherry-picked. **Next experiment:** repeat the claim
with a representative slice and retained raw data; if adopt is pursued, run the
required pilot/risk acceptance and migration plan.

**Memo stamp:** None. No memo hash or claim IDs; any later memo change cannot be
delta-reviewed.

### F5 — review artifact, not a plan/results review

**Applicability:** F5 contains only a purported review sentence: “Looks good.
90/100. Ship it.” It is neither a Gate 1 plan nor a Gate 2 results packet. Under
the rubric it is a reviewer output and must satisfy the explicit-feedback,
report-template, and anti-pattern rules. It does not.

**Verdict: REVISE (invalid/unusable review).** **Score: 0/100 as a gate record.**
No gate table, floor table, or claim table exists, so no area can be scored as
meeting its floor.

Findings:

- **[P0][blocking] Location:** F5 line 3, reviewer record.
  **Evidence:** The entire output is “Looks good. 90/100. Ship it.” No reviewer
  identity, model/provider, prompt hash, input hash, scope, date, or review-log
  entry.
  **Why:** The rubric requires the reviewer identity, model/provider, prompt
  hash, and input hash in `REVIEW-LOG.md`; without them independence and
  reproducibility cannot be established, and a rejected/replacement reviewer
  cannot be audited.
  **Required action:** Identify the reviewer, model/provider, prompt hash, input
  hash, scope, and date; record them in `REVIEW-LOG.md` before any verdict.
  **Pass condition:** Complete reviewer record matching the template.

- **[P0][blocking] Location:** F5 line 3, gate structure.
  **Evidence:** “90/100” with no area scores, floors, verdict, findings, or gate
  type (Gate 1 vs Gate 2); no gate table or claim table.
  **Why:** A score without a gate table or findings is an explicit anti-pattern.
  “90/100” is unverifiable and cannot establish that every area is above floor,
  that no P0/P1 exists, that at most 3 unresolved P2 remain, or that all claims
  are supported/partial-with-limit.
  **Required action:** Apply the correct template: Gate 1 area scores/floors,
  total, P0/P1/P2/P3 findings; or Gate 2 claim table, process findings, and memo
  stamp.
  **Pass condition:** The applicable gate template is complete and every
  condition is evidenced.

- **[P0][blocking] Location:** F5 line 3, release language.
  **Evidence:** “Looks good. … Ship it.”
  **Why:** “Looks good” is forbidden vague language, and “Ship it” authorizes a
  user-facing conclusion/release without a PASS record or evidence. The rubric
  bars a demo or user-facing conclusion before PASS and bars unreviewed
  conclusions being sent to the user.
  **Required action:** Withdraw “Ship it”; replace the vacuous sentence with
  evidence-backed findings, severity, location, why, required action, and pass
  condition; do not authorize release/adopt/migrate before PASS.
  **Pass condition:** No release/ship/adopt language; verdict and findings are
  tied to inspected evidence; PASS (if any) is recorded first.

- **[P1][blocking] Location:** F5 entire output, evidence.
  **Evidence:** No plan, logs, raw data, artifacts, claims, commands, or numbers
  are cited.
  **Why:** The review cannot be checked or repeated; the reviewer may have
  inspected nothing. The rubric forbids reviewing only prose and accepting
  claims without raw evidence.
  **Required action:** Supply the reviewed inputs and cite exact evidence
  (file/line, command, number, quote); mark anything not verifiable as missing
  evidence and REVISE.
  **Pass condition:** Findings cite inspectable evidence; missing evidence is
  named rather than passed.

- **[P2][blocking] Location:** F5 line 3, residual risk/assumptions.
  **Evidence:** No assumptions, limits, residual risks, or “what cannot be
  concluded” statement.
  **Why:** A PASS or score must expose residual risk and unverified areas; their
  absence makes the output unusable for the decision owner.
  **Required action:** Add residual risks and unverified items; state what the
  review does not establish.
  **Pass condition:** Residual-risk/unverified section present and consistent
  with findings.

**What cannot be concluded:** Anything about the underlying plan or results; the
“90/100” is unsupported. **Next action:** discard this output as a review record;
perform a real independent review with the proper gate template.

### F6 — plan review: strong total, failed reproducibility floor

**Verdict: REVISE.** **Score: 87/100.** P0/P1: none. P2 review-unresolved: 3
(at the cap); the reproducibility floor failure is blocking regardless of the
total. **P2/floor status: one floor fail.**

| Area | Score | Floor | Status | Basis |
|---|---:|---:|---|---|
| Selected-direction execution | 17 | 16 | PASS | Kill criteria, experiments, slice, and stop/decision rule present; no recorded user-selection rationale |
| Decision and metrics | 13 | 12 | PASS | Metrics map to the decision and thresholds; M2 CI rule is inconsistent with the 20% threshold |
| Baseline and controls | 15 | 12 | PASS | Real `JSON.parse` baseline, same snapshots/machine/protocol, pre-parsed control, alternating/fresh-child runs, seeds/hashes |
| Experiment sufficiency | 18 | 16 | PASS | 3 families × 3 implementations × 7 reps, correctness/malformed tables, bootstrap CI, exclusions, harness validity; small reps and RSS lower-bound caveat remain |
| Reproducibility/artifacts | 7 | 8 | **FAIL** | Commands/versions/seeds/raw data/production hashes present; lockfile/image hash, retention, and cleanup absent |
| Risk/license/safety | 8 | 8 | PASS (at floor) | License/SCA, no-native-build gate, timebox, stop/abort; sandbox/credential/data specifics unstated |
| Reviewability | 9 | 8 | PASS | Testable metrics and decision rule; assumptions/risks exposed; executable outline |

Findings:

- **[P2][blocking via floor] Location:** F6 lines 54–58, “Artifacts and
  reproducibility.”
  **Evidence:** The artifact list names `harness/bench.mjs`, `data/raw.json`,
  `data/env.json`, input SHA-256, Node/npm versions, load average, command log
  with exit codes, before/after production file hashes, and immutable raw data.
  It does **not** name a lockfile/image hash, a retention period, or cleanup of
  temp data. Rubric-required elements are absent.
  **Why:** Without a lockfile/image hash the exact dependency state cannot be
  reconstructed; without retention/cleanup there is no rule for how long raw
  evidence survives or how temporary data is removed. The area scores 7/10,
  below the floor of 8, so the Gate 1 gate fails even though the total (87)
  clears 80. The total is a gate, not a diagnostic.
  **Required action:** Add the lockfile/dependency manifest or container/image
  hash, a retention period for raw data and artifacts, and a cleanup procedure
  for temp dirs; make analysis scripts immutable/read-only against raw data.
  **Pass condition:** All seven reproducibility elements are present in the
  plan; Reproducibility/artifacts ≥ 8/10 on re-review.

- **[P2][non-blocking] Location:** F6 lines 20–31, M2 and decision rule.
  **Evidence:** The metric table says the candidate must be “≤ 0.8× baseline,”
  but the decision rule says “M2 delta ≥ 20% with CI excluding 0.” A CI that
  excludes 0 only rules out no difference; it does not establish that the
  improvement reaches 20%. A point estimate ≥ 20% with a CI that includes 20%
  would still be adopted under that wording.
  **Why:** The decisive comparison can adopt a sub-threshold or uncertain effect;
  this is a metrics/decision-rule defect. It is non-blocking only because the
  point threshold and other gates limit the immediate conclusion, and it is
  fixable with wording; it must be fixed for a clean re-review.
  **Required action:** Define the decisive statistic (candidate/baseline ratio or
  relative improvement) and require the conservative 95% bound to clear the
  threshold (e.g., upper bound of the ratio < 0.8×, equivalently lower bound of
  relative improvement > 20%); do not use “CI excluding 0” as the threshold test.
  **Pass condition:** The decision rule’s CI bound matches the 20% threshold and
  is unambiguous; re-review confirms no adopt path through a sub-threshold CI.

- **[P2][non-blocking] Location:** F6 lines 3–7, decision frame/selected
  directions.
  **Evidence:** The plan introduces “Candidates: a streaming parser (A) and an
  incremental tokenizer (B)” with no record of which directions the user
  selected, the user’s rationale, or an R1 broad-direction-set attestation; only
  author-side candidate labels are present.
  **Why:** Gate 1 reviews execution of the user’s selected directions. Without
  the selection/rationale record the reviewer cannot verify the plan is not
  substituting the author’s preferred shortlist. This is non-blocking because
  A/B are named and covered by the experiments, and there is no evidence of a
  veto or omitted direction.
  **Required action:** Record the user-selected directions, rationale, and kill
  criteria, and attach the R1 coverage statement; if no user selection exists,
  return to R1 first.
  **Pass condition:** Selection provenance and rationale are recorded and match
  the experiments.

- **[P3][non-blocking] Location:** F6 lines 60–66, risks.
  **Evidence:** Risks cover synthetic payload representativeness (P2), RSS lower
  bound (P2), and single machine/Node/no CI (P2), plus license/SCA and no
  network; they do not state sandbox isolation, credential handling, or data
  handling for real log payloads.
  **Why:** Minor because payloads are synthetic, no network is used, and no new
  dependency is allowed before allowlisting; but the risk section is incomplete
  for any transition to real payloads.
  **Required action:** State sandbox/process isolation, absence of credentials,
  and the data-handling rule for real payloads; retain the existing P2 claim
  limits.
  **Pass condition:** The risk section names sandbox, credentials/data, and the
  conditions for real-payload runs.

**Gate arithmetic:** 17 + 13 + 15 + 18 + 7 + 8 + 9 = **87/100**; every area
except Reproducibility is at/above floor; Reproducibility is 7/8. P0/P1: none;
review-unresolved P2: 3/3 (one blocking via the floor); plan-declared P2 risks
are claim-limited, not counted as additional unresolved P2. **Result: REVISE.**
This is the total-vs-floor case: a reviewer who stops at “87 ≥ 80” would wrongly
PASS it.

### F7 — plan review: floor-boundary PASS with no margin

**Verdict: PASS.** **Score: 80/100.** All seven areas exactly at floor; P0/P1:
none; accepted P2: 3/3 (claim-limited); review P3: 2. This is a gate PASS, not a
margin or an adopt permission; research conclusions still need the measured
gates.

| Area | Score | Floor | Status | Basis |
|---|---:|---:|---|---|
| Selected-direction execution | 16 | 16 | PASS (at floor) | A/B rationale and kill criteria, shared experiments, slice, stop/decision rule; selection provenance and per-direction experiment detail are terse |
| Decision and metrics | 12 | 12 | PASS (at floor) | M1–M5 thresholds and adopt/keep-baseline rule; no MDE derivation; CI bound wording needs precision |
| Baseline and controls | 12 | 12 | PASS (at floor) | `JSON.parse` baseline, same snapshots/Node/host, alternating/fresh-child, pre-parsed control; environment/warmup capture is thin |
| Experiment sufficiency | 16 | 16 | PASS (at floor) | 3 families × 3 implementations × 7 reps, correctness 20+5, malformed error table, memory matrix, exclusions, fixed seeds/hashes; semantic parity/harness validation is not explicit |
| Reproducibility/artifacts | 8 | 8 | PASS (at floor) | Harness, raw/env JSON, input hashes, versions, lockfile/image hash, command/exit log, production hashes, immutable raw, 30-day retention, cleanup; exact commands/analysis script are thin |
| Risk/license/safety | 8 | 8 | PASS (at floor) | Three P2 risks accepted with claim limits, P3 exclusion, license allowlist, no native build, timebox/stop; CVE/sandbox/credential/data specifics not explicit |
| Reviewability | 8 | 8 | PASS (at floor) | Testable metrics and decision rule, assumptions/risks exposed, executable outline; terse plan leaves execution detail to the harness |

Findings (none blocking):

- **[P2][non-blocking, accepted] Location:** F7 lines 32–37, risks/slice.
  **Evidence:** “P2 synthetic field distribution; accepted, limited to descriptive
  claims.” “P2 RSS is a lower bound; accepted, no peak claim.” “P2 single
  host/Node/no CI; accepted, no generalization.”
  **Why:** These are real limits on what the results can claim, but the plan
  explicitly accepts them with matching claim limits; the gate permits at most 3
  unresolved P2 and none of these is P0/P1. They remain residual risks, not
  hidden assumptions.
  **Required action:** Carry the same wording limits into the results memo:
  descriptive-only for synthetic distribution, no peak-RSS claim, no
  generalization beyond single host/Node.
  **Pass condition:** The results review shows the claim limits were honored and
  no conclusion exceeds the accepted P2 scope.

- **[P3][non-blocking] Location:** F7 lines 14–15, M2 CI rule.
  **Evidence:** “M2 p50 parse time: candidate ≤ 0.8× baseline … 95% bootstrap CI;
  adopt only if the CI lower bound clears 0.8×.”
  **Why:** “Lower bound clears 0.8×” is ambiguous for a ratio. To establish
  candidate ≤ 0.8× baseline at 95% confidence, the conservative bound must be on
  the adoption side: upper bound of candidate/baseline < 0.8× (equivalently,
  lower bound of relative improvement > 20%). As written, a reviewer could read
  the wrong bound. It is minor because the intended threshold and decision rule
  are otherwise explicit.
  **Required action:** Define the statistic and the bound direction in the
  harness/analysis plan before execution; report the bound used.
  **Pass condition:** M2’s statistic and confidence-bound direction are explicit
  and match the 0.8× adopt threshold.

- **[P3][non-blocking] Location:** F7 lines 32–37, risk specifics.
  **Evidence:** License/dependency allowlist and no-native-build are stated;
  CVE/SCA detail, sandbox isolation, and credential/data handling are not.
  **Why:** Minor at this scope: no network, synthetic payloads, and no new
  dependency until allowlisted; still, the risk section should state the
  isolation/data boundary for a parser handling log payloads.
  **Required action:** State sandbox/process isolation, no credentials, and the
  data-handling rule; keep license allowlist and native-build kill criteria.
  **Pass condition:** The risk section states isolation, credentials, and data
  handling, with no expansion of the accepted claim limits.

**Gate arithmetic:** 16 + 12 + 12 + 16 + 8 + 8 + 8 = **80/100**; all seven floors
met exactly; no P0/P1; 3 accepted P2 at the cap; 2 P3. **Result: PASS, with zero
margin.** A single floor drop or one additional unresolved P2 would require
REVISE. The input labels itself floor-boundary; independently, the rubric-derived
score lands at exactly 80/100 because the compressed detail places every area at
the floor. The label was not used as the verdict.

## 5. Cross-input calibration notes

1. **The total is not the gate.** F6 scores 87/100 but fails the
   Reproducibility floor (7/8) and must be REVISE. F7 scores exactly 80/100 and
   passes only because all seven floors are met and the P2 count is at the cap.
2. **R1 coverage precedes Gate 1.** F2 must return to R1 to restore the
   do-nothing/current-library and existing-library options before any Gate 1
   execution review; the reviewer does not veto the user’s D1 choice without new
   evidence, but cannot score a Gate 1 plan built on a truncated candidate set.
3. **Gate 2 is status-driven, not score-driven.** F3 and F4 cannot be passed by
   lowering confidence: a single run is at most `partial`; `partial` cannot
   support adopt/migrate; adopt additionally requires supported claims,
   measured-here evidence, a representative slice, a pilot or written risk
   acceptance, and a downstream `MIGRATION.md`.
4. **A review artifact must itself be reviewable.** F5 has no reviewer record,
   no gate template, no claims or evidence, and uses forbidden vague/release
   language; “90/100” is an anti-pattern, not a verdict.
5. **Boundary PASS is legitimate but fragile.** F7’s PASS has no margin; the
   accepted P2 limits must survive into results review, and the CI wording must
   be made explicit before execution.
6. **Limits of this review.** The inputs are short fixtures, not full packets:
   F3/F4 lack the ordered Gate 2 evidence, and F6/F7 reference artifacts rather
   than supplying them. F3/F4 also embed the draft conclusion beside the plan, so
   the required pre-memo, hash-stamped `CLAIMS.md` extraction cannot be
   demonstrated from these packets; the claim tables in this report are reviewer
   extraction for calibration, not a substitute for that missing artifact. Gate 2
   verdicts above are therefore against the supplied summaries, not against raw
   data; the missing packet itself is a blocking finding in F3/F4. No item in
   this report was inferred from an expected answer, prior review, or fixture
   manifest.

## 6. Non-modification and integrity

- Inputs were opened read-only; no write, rename, or deletion was performed under
  `docs/calibration-blind/`.
- The output path did not exist before this review; only the requested report was
  created under `docs/e2e/0.8/research/`.
- `docs/fixtures/`, `docs/calibration-inputs/`, `expected.json`, `REVIEW-LOG.md`,
  and prior reviews were not read.
- Hashes in §2 were captured before writing. §7 records the post-write re-hash
  check.

## 7. Post-write verification

- Re-hashing `F1`–`F7` and `skills/rd-workflow-research-review.md` after writing
  reproduces every hash in §2 exactly; the F1→F7 concatenated-set hash remains
  `d8a764ca2271e1c22b4259b718e3197786d501eb4caffce2f93a63d5e65a6991`.
- Content equality of the pre-write and post-write hashes is the evidence that
  no input was modified; `git status` shows `docs/calibration-blind/` as
  pre-existing untracked fixture content, not a change made by this review.
- The only file created by this review is
  `docs/e2e/0.8/research/CALIBRATION-INDEPENDENT-R6.md`. No write, rename, or
  deletion touched `docs/calibration-blind/`.

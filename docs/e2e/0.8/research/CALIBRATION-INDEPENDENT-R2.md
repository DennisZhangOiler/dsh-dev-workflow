# Independent calibration review — R2 (blind)

This file is a blind, independent review of the seven calibration inputs under
`docs/calibration-inputs/`. It uses only `skills/rd-workflow-research-review.md`
(its Gate 1 / Gate 2 text and explicit-feedback rules) and the seven inputs.
No expected verdict, fixture manifest, answer key, or prior review was read.
The inputs were not modified.

## 1. Reviewer record

| Field | Value |
|---|---|
| Reviewer ID | `calibration-reviewer-3` |
| Role | Independent reviewer (delegated subagent of `lead`); not author, experimenter, or synthesizer |
| Model / provider | `deepseek-flash` / DeepSeek (DeepSeek Harness agent runtime) |
| Session | Depth-1 delegated subagent; working dir `/home/dennis/projects/oiler-hub/dsh-rd-workflow` |
| Review timestamp | 2026-11-25T13:01:13+08:00 (Asia/Shanghai) |
| Rule source (only rule file used) | `skills/rd-workflow-research-review.md` |
| Rule-source SHA-256 (recorded as the prompt/rule hash) | `80ccf3b9f6c320932a2e8d3215bd8df8f27ba2f5c9e626a7f05bcdf23513ab13` |
| Frozen prompt file | None exists on disk; the delegation instruction was delivered in-session. The rule hash above is the reproducible prompt-side hash. |
| Working-dir git HEAD (context) | `14d31df47bc0548106e0b9726fe33095892f9976` |
| Enclosing `oiler-hub` HEAD (context) | `b712d8a41df11bba950ad8414483b7d289a64d6c` |

**Independence and blindness declaration.** I (a) did not write, run, or edit any
fixture or experiment; (b) did not read any file under `docs/fixtures/` (including
its README or `expected.json`), any pre-existing file in `docs/e2e/0.8/research/`,
or any other prior review / answer key (only directory-path names appeared in a
top-level directory listing; no such file content was opened); (c) formed every
verdict below from the seven frozen inputs and the rule file only; (d) did not
execute the strong plan's commands and did not re-measure its hardware claims. I
listed the target directory's file names once to confirm
`CALIBRATION-INDEPENDENT-R2.md` did not already exist; no prior-review content was
opened or consulted.

**Scope note.** This is a document review of frozen calibration inputs. It does
not verify the strong plan's live repository, hardware, or file hashes; those are
execution-time facts for R3. It also does not review the real project's research;
it calibrates judgment on the supplied fixtures.

## 2. Inputs and SHA-256

Hashes were computed before review; the post-write re-check is recorded in §10.

| # | Fixture | SHA-256 |
|---:|---|---|
| 1 | `floor-boundary.md` | `12c5b2818a7b5bb25e708f19dcc4c4ee680724c04ea45970fdd584d820ded41a` |
| 2 | `narrow-directions.md` | `fe149d4c8a41d77ec9e0fdf71c2179b268aeb6d6a31085fbef875f07705268bb` |
| 3 | `partial-adopt.md` | `91b525208d118e2f6d4dbcfc9ecb37935650080fb8dedf4a897f172e273ab001` |
| 4 | `single-run-strong.md` | `2f8dbc54a46c144133247ab8cb5bf22f97795b593fb520cbb77bc758141c5169` |
| 5 | `strong-plan.md` | `7976d59fc308871863cec7ca5cf94f5599b59ce10ec8a017d37aa08005fe2eab` |
| 6 | `vague-review.md` | `d127a9ab355e7131a7ac56e1ef46dc5eee86cf54e5a55a3358b6aaecc74bd321` |
| 7 | `weak-plan.md` | `08c55314f8ed2e504776d2a2eb7f233e71f32984f6232ba56ced3c95457c382f` |

Context-only input (not scored): `docs/calibration-inputs/README.md` has SHA-256
`4653f2b1cd479908fc7219fbbad4a25ed56fa19acd14911b38ad0168ba5ae344`.

Combined fixture-manifest hash (construction:
`sha256sum <the 7 files> | sort -k2 | sha256sum`):
`80218d9f2ab3e08f9da76529fc5626049adfa24f5fe5ace863535688a9fec6f2`.

## 3. Method and gate interpretation

**Gate 1 (plan review).** The numeric gate is: every area at/above its floor,
total ≥ 80, no P0/P1, and at most 3 unresolved P2. The sum of the seven floors is
80, so a plan sitting exactly on every floor passes the numeric gate with zero
margin. Scores use the rubric anchors (0 missing/unusable; 50 present with a
material gap; 100 specific, testable, sufficient). A P1 is a defect in baseline,
metrics, experiment sufficiency, slice, risk, or evidence design that would
invalidate a conclusion; P2 is material but fixable; P3 is minor. A PASS is not a
quality award — it only means the plan may proceed past Gate 1.

**Gate 2 (results review).** The rubric defines a claim-status gate, not a
numeric total or area floors: every claim must be `supported` or
`partial`-with-limit; no `partial` may support adopt/migrate; every
recommendation must map to claim IDs; adopt/migrate additionally requires all
cited claims supported + measured-here + representative slice + pilot or written
risk acceptance + downstream `MIGRATION.md`; the memo must be claim-mapped and
stamped; only after PASS may it be user-facing. **Therefore, for Gate 2 fixtures
I report `Score: N/A` and `Floors: N/A` rather than inventing a numeric score or
applying Gate 1 area floors.** The Gate 2 gate conditions are assessed instead.

**Gate for the `vague-review.md` artifact.** That input is a reviewer output, not
a plan or a memo. I assess it under the explicit-feedback rules, the anti-pattern
list, and the Gate 2 user-facing/stamp rules. Its verdict is the disposition of
that review artifact: it is rejected and cannot stand as PASS for either gate.

Severity tags below use `P0`/`P1`/`P2`/`P3` and state blocking/non-blocking. Every
finding gives location, exact evidence, why it matters, required action, and pass
condition, per the explicit-feedback rules.

## 4. Verdict summary

| Fixture | Gate | Verdict | Score | Floors met | Blocking P0/P1 | Unresolved P2 |
|---|---|---|---|---:|---|---:|
| `floor-boundary.md` | Gate 1 | **PASS** | 80/100 | 7/7, exactly at floor | none | 2/3 |
| `narrow-directions.md` | Gate 1 | **REVISE** | 15/100 | 0/7 | 4 (incl. R1 coverage) | gate already failed |
| `partial-adopt.md` | Gate 2 | **REVISE** | N/A | N/A | 2 | N/A |
| `single-run-strong.md` | Gate 2 | **REVISE** | N/A | N/A | 4 | N/A |
| `strong-plan.md` | Gate 1 | **PASS** | 96/100 | 7/7 | none | 2/3 |
| `vague-review.md` | Gate 2 / review conformance | **REVISE** (review rejected) | N/A | N/A | 2×P0 + 2×P1 | N/A |
| `weak-plan.md` | Gate 1 | **REVISE** | 6/100 | 0/7 | 5 | gate already failed |

No fixture is scored `STOP`/`WAIVER`; STOP/WAIVER is the outcome after two REVISE
cycles, and none of these fixtures has had a first cycle corrected yet.

---

## 5. Fixture reviews

### 5.1 `floor-boundary.md` — Gate 1

**Verdict: PASS.** **Score: 80/100 (numeric gate met exactly).** Unresolved P2:
2/3. Blocking P0/P1: none.

This is a deliberately minimal plan that names exactly enough per area. The total
is exactly the sum of the floors (16+12+12+16+8+8+8 = 80), and each area is at —
not above — its floor. The margin is zero: any single floor drop flips the
verdict to REVISE. That is the correct reading of "at/above its floor": a plan on
the boundary passes; a plan one point below a floor does not.

| Area | Floor | Assigned | Status |
|---|---:|---:|---|
| Selected-direction execution | 16 | 16 | at floor |
| Decision and metrics | 12 | 12 | at floor |
| Baseline and controls | 12 | 12 | at floor |
| Experiment sufficiency | 16 | 16 | at floor |
| Reproducibility/artifacts | 8 | 8 | at floor |
| Risk/license/safety | 8 | 8 | at floor |
| Reviewability | 8 | 8 | at floor |
| **Total** | **80** | **80** | **met** |

**Floors not met:** none.

**Findings.**

- **[P2][non-blocking] Location:** `floor-boundary.md:4` (directions) and the
  whole input. **Evidence:** "Directions: D0 do-nothing + D1 candidate X; user
  selected both." The user's rationale is absent and no per-direction kill
  criteria/falsifier appears anywhere in the 10-line input, although the Area 1
  check requires "user rationale/kill criteria recorded". **Why:** a reviewer
  cannot see why D1 was selected or what result would kill it; direction-level
  PASS/FAIL loses its pre-declared meaning and invites post-hoc interpretation.
  **Required action:** add the user's rationale and an explicit kill criterion
  (and D0's retention condition) to the decision frame/plan. **Pass condition:**
  re-review finds one recorded rationale and one kill criterion per selected
  direction. Non-blocking because execution content (workloads, five runs,
  warm-up, median/CI, slice, exclusions, metrics, decision rule) is present and
  the gap is documentation, not measurement design.
- **[P2][non-blocking] Location:** `floor-boundary.md:8-9` (metrics/workload).
  **Evidence:** "Metrics: correctness/parity, median latency, dependency/build
  cost; MDE 20%; decision rule and stop/abort conditions." There is no named
  parity corpus (edge/semantic cases) and no harness-validity control (known-good
  oracle check or known-bad negative control) even though Area 4 asks for
  "edge/semantic cases" and "harness validity". **Why:** a parity number produced
  by an unchecked harness can be vacuous; the plan's correctness conclusion would
  rest on an unvalidated oracle. **Required action:** name the parity cases
  (at least `NaN`, `±0`, holes/`undefined`, mixed types, same-vs-distinct object
  refs) and one control that must be detected or the harness is invalid.
  **Pass condition:** the corpus and a positive/negative control appear in the
  plan and gate the data. Non-blocking: the plan commits to a decision rule and
  retained raw data, so the control can be added before R3 without changing the
  direction choice; it is not raised to P1 at this stage because the fixture is a
  plan summary that names the parity metric, and the missing control is a
  pre-R3 artifact rather than a missing decision rule.
- **[P3][non-blocking] Location:** `floor-boundary.md:6-10`. **Evidence:** "fixed
  seed" without a seed value; no Node/runtime version, command text, lockfile or
  image hash, or explicit cleanup/retention rule beyond "raw data retained".
  **Why:** reproducibility is present but thin (assigned 8/8 only because
  `env`/`hashes` and raw data are named); a later reviewer could not reproduce
  without the seed and command. **Required action:** record seed(s), runtime
  version, exact commands, and retention/cleanup. **Pass condition:** those
  fields exist in the artifact plan. Non-blocking; does not change the gate
  arithmetic (Area 5 remains at, not below, floor).

**Assessment note.** There is no score buffer: every area sits exactly on its
floor, so one missing or weaker element (for example fewer than the stated five
runs, no exclusions, or no decision rule) drops that area below its floor and
flips the verdict to REVISE. The two P2s are recorded as fixable gaps, not as
margin. PASS is specific to what this input states; it should not be cited as
evidence that a similarly terse plan with one fewer element also passes.

### 5.2 `narrow-directions.md` — Gate 1

**Verdict: REVISE.** **Score: 15/100.** Floors met: **0/7**. Blocking P0/P1: 4.
This is not STOP/WAIVER: it is the first review cycle.

| Area | Floor | Assigned | Status |
|---|---:|---:|---|
| Selected-direction execution | 16 | 7 | **below floor** |
| Decision and metrics | 12 | 2 | **below floor** |
| Baseline and controls | 12 | 0 | **below floor** |
| Experiment sufficiency | 16 | 3 | **below floor** |
| Reproducibility/artifacts | 8 | 1 | **below floor** |
| Risk/license/safety | 8 | 0 | **below floor** |
| Reviewability | 8 | 2 | **below floor** |
| **Total** | **80** | **15** | **not met** |

**Floors not met:** all seven (scores 7/16, 2/12, 0/12, 3/16, 1/8, 0/8, 2/8).

**Findings.**

- **[P1][blocking] Location:** `narrow-directions.md:4-5` (R1 direction-set
  coverage). **Evidence:** "User selected only D1 (candidate X) from a list that
  omitted the do-nothing option and an obvious existing-library alternative. User
  rationale: 'fast'." **Why:** the rule makes coverage of the broad direction set
  an R1 pre-check. The user's choice was made against an incomplete list, so a
  Gate 1 PASS would certify execution of a direction set that never presented
  "keep current" or the obvious existing library for a "choose a parser library"
  decision. The reviewer must not silently add directions or veto the user; the
  missing options are new evidence that must go back to the user. **Required
  action:** return the complete broad set (do-nothing + existing-library
  alternative + D1) to the user with the omission stated, record the explicit
  user decision in the decision frame, then replan. **Pass condition:** the
  recorded broad set contains the omitted options and the user's explicit
  keep/drop decision; R1 is re-run before a new Gate 1 review.
- **[P1][blocking] Location:** `narrow-directions.md:6`. **Evidence:** "Plan: D1
  only; no baseline; one run; no thresholds; no slice; no raw data." No real
  current baseline/control exists. **Why:** without a same-workload, same-
  environment, same-runtime baseline, no effect on the decision can be
  attributed; Area 3 is 0/12 and a P1 baseline defect invalidates any later
  conclusion. **Required action:** include the current parser as the baseline
  under the identical workload/environment/runtime, with no strawman. **Pass
  condition:** the baseline is an experiment in the plan; Area 3 ≥ 12.
- **[P1][blocking] Location:** `narrow-directions.md:6`. **Evidence:** "no
  thresholds". No metric table, MDE/CI rule, decision rule, or success/failure
  meaning is supplied. **Why:** without a pre-declared threshold, any number can
  be narrated as success; Area 2 is 2/12 and the decision rule is absent.
  **Required action:** pre-register metrics, MDE, variance/CI rule, decision rule,
  and what PASS/FAIL/CANNOT CONCLUDE mean for this decision. **Pass condition:**
  the plan contains them before R3; Area 2 ≥ 12.
- **[P1][blocking] Location:** `narrow-directions.md:5-6`. **Evidence:** one run,
  no repeated measures, no representative slice, no exclusions, no harness
  validity; plus no kill criteria for D1 and a one-word rationale. **Why:** a
  single run cannot separate signal from noise, and without a slice the result
  cannot represent the decision context; Area 4 is 3/16 and Area 1 is 7/16.
  **Required action:** multiple timed reps with warm-up and variance/CI, a
  representative slice with exclusions, a harness-validity check, and explicit
  falsifier/kill criteria. **Pass condition:** those exist; Areas 1 and 4 reach
  their floors.
- **[P2][non-blocking] Location:** `narrow-directions.md:6`. **Evidence:** "no
  raw data". **Why:** the result would not be reviewable or recomputable; Area 5
  is 1/10. **Required action:** retain raw JSON/logs, seeds, environment,
  commands, and versions with a retention rule. **Pass condition:** Area 5 ≥ 8.
  Non-blocking only in the sense that it is one more fixable defect in a plan
  that already fails on the P1s; it must be fixed before any re-review.

The direction-level answer cannot be concluded from this input: there is no
baseline, no threshold, and no slice. The candidate cannot be called fast, slow,
or equivalent.

### 5.3 `partial-adopt.md` — Gate 2

**Verdict: REVISE.** **Score: N/A** (Gate 2 defines no numeric total).
**Floors: N/A** (Gate 1 area floors do not apply to a results review).

**Gate 2 condition check.**

| Condition | Status |
|---|---|
| Every claim supported or partial-with-limit | `partial` (single sandbox run, no representative slice); permitted only with an explicit limit, and none is stated |
| No partial supporting adopt/migrate | **FAIL** — the draft memo recommends adopt on a partial claim |
| Every recommendation mapped to claim IDs | **FAIL** — no claim IDs, no claim table, no mapping |
| No unreviewed memo change / memo stamped | **FAIL** — no `CLAIMS.md` hash, memo SHA-256, or claim stamp |

**Claim verdicts (from the supplied text only).**

| Claim ID | Claim | Evidence in input | Status | Allowed wording |
|---|---|---|---|---|
| (unnamed supporting claim) | The candidate's benefit is established | "single sandbox run, no representative slice" | `partial` | "Observed in one sandbox run; not representative; candidate evidence only" |
| REC-1 (draft memo) | "Recommend adopt." | Draft memo plus one `partial` supporting claim | **Not permitted** | "No adoption recommendation; at most candidate/pilot after supported claims + representative slice + pilot/written risk acceptance + downstream `MIGRATION.md`" |

**Findings.**

- **[P1][blocking] Location:** `partial-adopt.md:3-4` (draft memo). **Evidence:**
  "One supporting claim is `partial` (single sandbox run, no representative
  slice). Draft memo: 'Recommend adopt.'" **Why:** the rule says no `partial`
  claim may support adopt/migrate, and adopt/migrate requires the cited claims to
  be supported plus measured-here, a representative slice, pilot or written risk
  acceptance, and a downstream `MIGRATION.md`. This memo fails the first
  condition outright; a user-facing adopt instruction would overstate the
  evidence. **Required action:** either downgrade the memo to "candidate/pilot,
  limited to one sandbox run" or produce a supported claim on a representative
  slice before recommending adopt. **Pass condition:** re-review finds a memo
  whose recommendation is limited to candidate/pilot whenever any cited claim is
  `partial`, and no adopt/migrate wording supported by a partial claim.
- **[P1][blocking] Location:** `partial-adopt.md:3`. **Evidence:** the partial
  claim exists because of a "single sandbox run, no representative slice".
  **Why:** the missing representative slice limits the claim itself and blocks
  the adopt path even if the single run is real; the evidence is not
  representative of the decision context. **Required action:** define the
  representative slice and exclusions, rerun the decisive measurement there, and
  recompute whether the claim becomes supported. **Pass condition:** a
  representative-slice measurement exists (or the claim stays partial and the
  recommendation stays candidate/pilot).
- **[P2][non-blocking] Location:** `partial-adopt.md:4`. **Evidence:** no pilot,
  no written risk acceptance, no downstream `MIGRATION.md`. **Why:** even a
  hypothetical supported claim would still need these for adopt/migrate; their
  absence is material but would not by itself invalidate the partial claim.
  **Required action:** add pilot or written risk acceptance and the downstream
  migration document, or keep the recommendation at candidate/pilot. **Pass
  condition:** all adopt prerequisites exist in the claim/rec mapping.
- **[P2][non-blocking] Location:** `partial-adopt.md:3-4`. **Evidence:** no
  independent `CLAIMS.md`, no claim table, no memo hash, no claim IDs. **Why:**
  Gate 2's mapping/stamp process cannot be audited; a later wording change could
  escape delta review. **Required action:** produce the independent claims file
  with a hash, map the memo sentence to claim IDs, and stamp the memo. **Pass
  condition:** the claim table, mapping, and memo SHA-256 are present and match.

**What cannot be concluded:** the candidate's benefit beyond one sandbox
observation, and any adoption/migration decision. No data, commands, logs, or
artifacts were supplied with this fixture.

### 5.4 `single-run-strong.md` — Gate 2

**Verdict: REVISE.** **Score: N/A.** **Floors: N/A.**

**Gate 2 condition check.**

| Condition | Status |
|---|---|
| Every claim supported or partial-with-limit | "X is 2x faster" is at most `partial`: one run each, no variance/CI, no representative slice; no limit wording is supplied |
| No partial supporting adopt/migrate | **FAIL** — "recommend adopt" rests on the single-run claim |
| Every recommendation mapped to claim IDs | **FAIL** — no claim IDs/table |
| No unreviewed memo change / memo stamped | **FAIL** — no memo hash/stamp; no plan/log/raw artifacts to audit |

**Claim verdicts (from the supplied text only).**

| Claim ID | Claim | Evidence in input | Status | Allowed wording |
|---|---|---|---|---|
| (unnamed) | "X is 2x faster" | One run each, no variance/CI, no representative slice; raw data not retained | `partial` at most; the 2× generalization is not supported | "Single observation in this sandbox; no CI or representative slice; not a 2× claim" |
| REC-1 | "recommend adopt" | Same single run | **Not permitted** | "Candidate direction only; no adoption recommendation" |

**Findings.**

- **[P1][blocking] Location:** `single-run-strong.md:4` (plan). **Evidence:**
  "one run each; no variance/CI; no representative slice". **Why:** a single run
  cannot separate the effect from run-to-run noise; the rule explicitly says
  lowering confidence never turns a single run into `supported`. The 2× headline
  is a point estimate, not an established effect. **Required action:** rerun with
  repeated paired measurements, warm-up, variance/CI, and a pre-registered MDE;
  or keep the claim explicitly partial as a single observation. **Pass
  condition:** the rerun's claim table shows a supported (or clearly limited
  partial) effect with CI; no "2×" generalization from one run.
- **[P1][blocking] Location:** `single-run-strong.md:4-5`. **Evidence:** "no
  representative slice" and the immediate "recommend adopt". **Why:** adopt
  requires a representative slice; a sandbox micro-run cannot show the decision
  context. **Required action:** define the representative slice and exclusions,
  rerun there, and restrict the recommendation until then. **Pass condition:** a
  representative-slice result exists, or the memo is limited to candidate/pilot.
- **[P1][blocking] Location:** `single-run-strong.md:4`. **Evidence:** "raw data
  not retained". **Why:** Gate 2 reviews raw data/artifacts and recomputes a
  headline metric for adopt claims; without raw data the 2× number cannot be
  reviewed, recomputed, or checked for cherry-picking. **Required action:**
  retain raw JSON per run, commands, environment, seeds, and logs; rerun if they
  no longer exist. **Pass condition:** the decisive experiment can be rerun or
  recomputed from retained artifacts.
- **[P1][blocking] Location:** `single-run-strong.md:5` (draft conclusion).
  **Evidence:** "Draft conclusion: 'X is 2x faster; recommend adopt.'" **Why:**
  the recommendation cites no claim IDs and fails the adopt prerequisites (all
  cited claims supported + measured-here + representative slice + pilot/written
  risk acceptance + downstream `MIGRATION.md`). **Required action:** downgrade
  the memo to "single-run candidate, no adoption" or complete the adopt package.
  **Pass condition:** the memo's recommendation maps to supported claims and all
  adopt prerequisites; no adopt wording rests on a partial claim.
- **[P2][non-blocking] Location:** `single-run-strong.md:4` (plan provenance).
  **Evidence:** the described plan (one run, no CI, no slice, no raw retention)
  could not have passed Gate 1 under the same rule. **Why:** if it was approved,
  the upstream Gate 1 review was defective, and Gate 2 must not launder that
  defect; the "approved plan" premise is unverified. **Required action:** record
  the approved plan hash and its Gate 1 verdict, and re-run Gate 1 if the plan was
  approved as described. **Pass condition:** the Gate 1 PASS artifact for this
  plan exists, or a compliant plan is approved before reruns. Non-blocking for
  the claim disposition, which already fails on the P1s.
- **[P2][non-blocking] Location:** `single-run-strong.md:3-5`. **Evidence:** no
  independent `CLAIMS.md`, no memo stamp, no claim IDs. **Why:** the required
  extraction-then-memo order and delta-review trigger cannot be audited.
  **Required action:** produce and hash `CLAIMS.md`, map memo sentences to claim
  IDs, stamp the memo. **Pass condition:** claim table, mapping, and memo hash
  are present.

**What cannot be concluded:** the 2× speedup as an established effect, any
representative-slice conclusion, and any adoption/migration decision. The only
defensible statement is a single sandbox observation with no CI and no
representative slice.

### 5.5 `strong-plan.md` — Gate 1

**Verdict: PASS.** **Score: 96/100.** Unresolved P2: 2/3. Blocking P0/P1: none.
Floors met: 7/7.

| Area | Floor | Assigned | Status |
|---|---:|---:|---|
| Selected-direction execution | 16 | 18 | met |
| Decision and metrics | 12 | 15 | met |
| Baseline and controls | 12 | 15 | met |
| Experiment sufficiency | 16 | 19 | met |
| Reproducibility/artifacts | 8 | 10 | met |
| Risk/license/safety | 8 | 10 | met |
| Reviewability | 8 | 9 | met |
| **Total** | **80** | **96** | **met** |

**Floors not met:** none.

The plan supplies per-direction experiments (parity, latency/scaling, memory),
falsifiers, a shared fit/hash check, a representative two-entry-point slice with
explicit exclusions, paired timing with fresh processes and alternating order,
frozen seeds and corpora, a hand-computed expected-result table, positive and
negative harness controls, metric thresholds (M2/M2-D4/M3/M4/M5), a timebox with
a fallback ladder and abort conditions, artifact/retention rules, risk/license/
safety limits, claim IDs, and allowed-wording rules. The environment/provenance
section is unusually careful about the untracked/ignored worktree: it correctly
rejects `git status` as evidence and uses file SHA-256 pre/post comparison with a
self-test. The D4-specific gate, D1's `±0` parity class, and the "post-call, not
peak" memory wording are handled consistently across sections. Prior-review
findings are addressed in the revision log; that is the author's record, not
evidence I rely on.

**Findings.**

- **[P2][non-blocking] Location:** `strong-plan.md:47-51` (§2, rationale
  column). **Evidence:** "The rationale bullets below are inferred and were not
  captured in-session (G7); they are recorded here for confirmation, not
  presented as the user's words." The user's actual rationale is therefore not
  recorded (kill criteria are present from `DIRECTIONS`, but the rationale is
  inferred), while the Area 1 check asks for "user rationale/kill criteria
  recorded". **Why:** after a result, an inferred rationale can be
  mistaken for the user's pre-declared reason, weakening the direction-level
  interpretation and the user's ownership of the choice. **Required action:**
  obtain explicit user confirmation of the rationale bullets and record them as
  confirmed, or keep them labelled as inferred assumptions in §3 with a decision
  point before R3. **Pass condition:** §2/§3 contains a confirmed user rationale
  or a visible assumption-default with no claim that it is the user's words.
  Non-blocking: the selected set is approved, kill criteria are recorded from the
  decision frame, and the gap is documentation, not experiment design.
- **[P2][non-blocking] Location:** `strong-plan.md:135-137` (EXP-4a/EXP-4b) and
  `strong-plan.md:356` (comparator threat row). **Evidence:** EXP-4a requires
  "`cmp(a,b)===0` ⇔ `Object.is(a,b)` on all pairs of a small adversarial set",
  antisymmetry, and transitivity, but the plan never specifies the comparator's
  total-order/tie-break scheme for mixed types. L2's timed input contains
  symbols, bigints, objects, `null`/`undefined`, and numbers; symbols cannot be
  compared with `<`/`>` (throws), and objects need an identity tie-break. The
  plan's "D4 — sort copy + adjacent `Object.is`" mechanism therefore leaves the
  central implementation step to be invented. **Why:** the comparator is the
  main D4 validity risk (the plan itself says so at §13); an under-specified
  comparator can throw in the timed cell or produce an inconsistent order, and
  the experimenter must design it after the plan is frozen. **Required action:**
  specify the comparator scheme before R3 (type rank for primitives/objects,
  identity-based tie-break for distinct objects/symbols, `NaN`/`-0` handling) and
  add mixed-type pairs to the adversarial set. **Pass condition:** the plan or
  harness contains that scheme and EXP-4a's property checks run over the full
  mixed corpus; D4 can be executed without inventing a design decision.
  Non-blocking because D4 is one direction and its failure yields a
  direction-level result, not an invalid decision over all directions.
- **[P3][non-blocking] Location:** `strong-plan.md:127` (EXP-3a). **Evidence:**
  "`null`, functions, symbols, bigints routed as specified" — no routing
  specification appears in this input (it likely lives in `DIRECTIONS`, which is
  not supplied). **Why:** the phrase is not executable as written and the
  `WeakSet`/`Set` split for `null` and primitives is exactly where a parity bug
  can enter. **Required action:** state the routing table in the plan or name the
  controlling `DIRECTIONS` section. **Pass condition:** the routing is explicit
  and the harness asserts it. Non-blocking because D3's zero-mismatch parity
  falsifier would catch a wrong route within D3.
- **[P3][non-blocking] Location:** `strong-plan.md:11-13` (§ owner) and §1
  provenance. **Evidence:** the plan says "independent reviewers own
  `PLAN-REVIEW.md` / `RESULTS-REVIEW.md`" and lists `REVIEW-LOG.md` as an
  artifact, but does not explicitly require the plan reviewer and results reviewer
  to be different agents or state the `REVIEW-LOG.md` fields (reviewer
  identity/model/prompt hash/input hash) the rubric requires. **Why:** the rubric
  makes that a hard independence rule; leaving it implicit invites the same
  agent or a lenient replacement. **Required action:** state the distinct-agent
  rule and the `REVIEW-LOG.md` reviewer record in the plan. **Pass condition:**
  both are explicit. Minor because the research lead still owns the review
  artifacts and the `REVIEW-LOG` requirement can be added before R2's verdict is
  signed.
- **[P3][non-blocking] Location:** `strong-plan.md:511-514` (§13 risk/license).
  **Evidence:** "The repository has no `LICENSE` and no `engines` field (existing
  condition, out of scope here); if adoption is later considered, Development
  must resolve license/engines before shipping." **Why:** the risk area is
  otherwise strong and there are no new dependencies, so this is a real but
  deferred existing condition, not a research-run blocker. **Required action:**
  keep it as a named residual risk and an adoption precondition for Development.
  **Pass condition:** the memo/recommendation does not claim license/engines
  clearance. Non-blocking.

**Residual risk for this verdict.** The two P2s are the only unresolved ones
(2/3, within the cap). If the D4 comparator gap were treated as a P1, the verdict
would flip to REVISE; I do not treat it as P1 because (a) D4 has an explicit
direction-level FAIL path, (b) the other directions' gates are independent of D4,
and (c) the plan's comparator-property checks are designed to catch the defect
during R3. This is a judgment on the supplied text: I did not verify the live
repository, hardware, or internal hashes. The plan's R3 file hashes are
execution-time facts, not reviewable here.

### 5.6 `vague-review.md` — Gate 2 / review conformance

**Verdict: REVISE (review artifact rejected; it cannot stand as PASS for either
gate; "Ship it" is blocked).** **Score: N/A.** **Floors: N/A.** No claim table can
be derived from the artifact; the Gate 2 conditions are not evaluable, which is
itself a failure.

**Findings.**

- **[P0][blocking] Location:** `vague-review.md:3` (entire reviewer output).
  **Evidence:** "Reviewer output: 'Looks good. 90/100. Ship it.'" There is not a
  single finding, no severity, location, evidence, why, required action, or pass
  condition. **Why:** the explicit-feedback rules require all six elements per
  finding, and "looks good" is a forbidden phrase; a score with no findings is an
  anti-pattern. The output cannot be re-reviewed, audited, or acted on, so it
  cannot support any gate verdict. **Required action:** redo the review with the
  gate template: verdict, area/gate table (or claim table for Gate 2), findings
  with all six fields, residual risks, and an explicit pass/reject condition.
  **Pass condition:** every finding has the six fields and there is no score
  without a gate table.
- **[P0][blocking] Location:** `vague-review.md:3` ("Ship it"). **Evidence:**
  "Ship it." is a user-facing release/adopt instruction with no PASS verdict, no
  claim statuses, no memo hash/stamp, and no adopt prerequisites. **Why:** Gate 2
  allows a memo to be user-facing only after PASS; sending an unreviewed
  conclusion is an anti-pattern. "Ship it" also exceeds the research gate's
  remit (research may return a candidate; it never marks adoption). **Required
  action:** retract the ship instruction, record the review as REVISE, and block
  any user-facing conclusion until PASS; if the underlying work is an
  adopt/migrate claim, require the full Gate 2 adopt package. **Pass condition:**
  the artifact contains no ship/adopt instruction before a PASS verdict and the
  memo is stamped with claim IDs and SHA-256.
- **[P1][blocking] Location:** `vague-review.md:3` ("90/100"). **Evidence:** the
  score is stated without area scores, floors, total arithmetic, P0/P1 status, or
  unresolved-P2 count. **Why:** the gate's number is meaningful only with the
  floor table and blocking count; an unanchored 90 could hide a below-floor area
  or a P1 (e.g., a broken baseline). The reader cannot tell whether 90 is even
  valid. **Required action:** recompute the total from the seven areas and their
  floors, and disclose every P0/P1 and unresolved P2. **Pass condition:** the
  gate table is present, total ≥80, every area ≥ floor, no P0/P1, and ≤3
  unresolved P2, or a REVISE verdict is returned.
- **[P1][blocking] Location:** `vague-review.md:3` (whole artifact). **Evidence:**
  no process audit, no claim table, no memo mapping, no allowed wording, no
  reviewer identity/input hash. **Why:** Gate 2 requires the approved plan,
  execution logs, raw data, and artifacts, an independent `CLAIMS.md` hash, a
  memo-to-claims mapping, and a stamped memo; none can be reconstructed from
  three sentences. **Required action:** produce the full Gate 2 artifact set or
  return "cannot review — inputs missing" with the exact missing inputs.
  **Pass condition:** the required inputs and claim/rec mapping exist and the
  verdict is supported by them.
- **[P3][non-blocking] Location:** `vague-review.md:3`. **Evidence:** no reviewer
  identity, model/provider, prompt hash, or input hash. **Why:** the
  `REVIEW-LOG.md` record cannot be checked, so independence and provenance are
  unverifiable. **Required action:** record identity/model/provider/prompt hash/
  input hash and the verdict in `REVIEW-LOG.md`. **Pass condition:** the record
  exists and the artifact cites its input hash. Non-blocking relative to the P0s.

**What cannot be concluded:** anything about a plan or result — the artifact
contains no inspected evidence. The only conclusion is that this review is
invalid and cannot authorize a ship/adopt.

### 5.7 `weak-plan.md` — Gate 1

**Verdict: REVISE.** **Score: 6/100.** Floors met: **0/7**. Blocking P0/P1: 5.
This is not STOP/WAIVER: first review cycle.

| Area | Floor | Assigned | Status |
|---|---:|---:|---|
| Selected-direction execution | 16 | 2 | **below floor** |
| Decision and metrics | 12 | 1 | **below floor** |
| Baseline and controls | 12 | 0 | **below floor** |
| Experiment sufficiency | 16 | 2 | **below floor** |
| Reproducibility/artifacts | 8 | 0 | **below floor** |
| Risk/license/safety | 8 | 0 | **below floor** |
| Reviewability | 8 | 1 | **below floor** |
| **Total** | **80** | **6** | **not met** |

**Floors not met:** all seven (scores 2/16, 1/12, 0/12, 2/16, 0/8, 0/8, 1/8).

**Findings.**

- **[P1][blocking] Location:** `weak-plan.md:3-4` (plan). **Evidence:** "Plan:
  run one demo of candidate A; no baseline; one run; no thresholds; no
  comparison; no representative slice; no raw-data retention." Also no user-
  selected direction set, rationale, or kill criteria: "candidate A" is named
  without a selection record. **Why:** Gate 1 inputs include the user-selected
  directions with rationale/kill criteria; without them the plan has no
  direction-level object to execute, and a demo is not a direction experiment.
  Area 1 is 2/20. **Required action:** record the user-approved direction set
  (with D0/control), rationale, and kill criteria, and map one to three
  experiments per direction. **Pass condition:** those are in the plan and Area 1
  ≥ 16.
- **[P1][blocking] Location:** `weak-plan.md:3-4`. **Evidence:** "no baseline".
  **Why:** without a real current baseline under the same workload/environment/
  runtime, nothing can be attributed to candidate A; Area 3 is 0/12. **Required
  action:** add the current parser as baseline with identical inputs and
  environment, no strawman. **Pass condition:** baseline experiment exists; Area
  3 ≥ 12.
- **[P1][blocking] Location:** `weak-plan.md:4`. **Evidence:** "no thresholds; no
  comparison". No metrics, MDE, variance/CI, decision rule, or success/failure
  meaning. **Why:** a demo with no comparator and no threshold cannot answer
  "choose a parser library"; Area 2 is 1/15. **Required action:** pre-register
  metrics, MDE, decision rule, and the meaning of success/failure. **Pass
  condition:** present and gating; Area 2 ≥ 12.
- **[P1][blocking] Location:** `weak-plan.md:3-4`. **Evidence:** "one demo",
  "one run", "no representative slice". **Why:** one run has no variance/CI, and
  a demo has no slice, exclusions, or harness-validity control; Area 4 is 2/20
  and no result could be generalized. **Required action:** repeated paired runs
  with warm-up/CI, a representative slice with exclusions, and harness validity.
  **Pass condition:** those exist; Area 4 ≥ 16.
- **[P1][blocking] Location:** `weak-plan.md:4`. **Evidence:** "no raw-data
  retention". **Why:** no artifact can be reviewed or recomputed; Area 5 is 0/10
  and the result is unauditable. **Required action:** retain raw data, commands,
  environment, versions, seeds, and logs. **Pass condition:** Area 5 ≥ 8.
- **[P2][non-blocking] Location:** `weak-plan.md:1-4`. **Evidence:** no
  timebox, risk/license/security/sandbox/credential assessment, or stop/abort
  condition. **Why:** the risk area (Area 6) is 0/8 and the plan could run without
  a stop rule or resource bound; the gap is fixable and secondary to the
  missing comparison design. **Required action:** add the risk/license/safety
  checks, timebox, and abort conditions. **Pass condition:** Area 6 ≥ 8.
  Non-blocking relative to the P1s, but mandatory before any re-review.

**What cannot be concluded:** any parser choice or performance comparison. Even
candidate A's own behavior is only a demo observation with no baseline, no
threshold, and no retained raw data.

## 6. Cross-fixture observations

- The five Gate 1 fixtures sort cleanly on the numeric gate: `strong-plan.md`
  clears with margin (96), `floor-boundary.md` sits exactly on the floors (80),
  and `narrow-directions.md` / `weak-plan.md` fall far below (15 / 6). The
  boundary case is a real test of whether the reviewer applies the floors
  literally: a plan exactly at 80 passes; a plan missing any floor element does
  not, regardless of how confident its prose sounds.
- The three Gate 2 fixtures are all REVISE for the same core rule: a `partial`
  claim (single run / no representative slice) cannot support adopt. The varying
  severity is in the surrounding process: `single-run-strong.md` also lacks raw
  data and CI; `partial-adopt.md` has the partial claim but no raw artifacts;
  `vague-review.md` is an empty review output rather than a memo.
- The calibration inputs are summaries, not full experiment records. Gate 2
  judgments above are necessarily based on the supplied facts; where raw data,
  commands, or artifacts were not supplied, that absence is itself a finding
  (and is why no claim can be raised above `partial`).

## 7. What this review cannot conclude

- It cannot verify the strong plan's live repository state, hardware, file
  hashes, or test results; it is a document review, not an execution audit.
- It cannot reconstruct the underlying raw data for any fixture; none of the
  Gate 2 fixtures supplied plans, logs, or artifacts.
- It cannot decide the real parser-library question; it only scores the supplied
  research artifacts against the frozen rubric.
- It does not treat the `docs/calibration-inputs/README.md` context file as a
  fixture; it was read only to confirm the blind-input convention.

## 8. Integrity of inputs

The seven fixture files were opened read-only; no write, move, or permission
change was performed on them. Their pre-review hashes are in §2 and were
re-computed after this report was written; the result is recorded immediately
below in §10. No plan command was executed and no network access was used during
this review.

## 9. Verdicts (one line each)

1. `floor-boundary.md` — **PASS**, 80/100, all seven floors exactly met, no P0/P1, 2/3 unresolved P2.
2. `narrow-directions.md` — **REVISE**, 15/100, zero floors met, including the R1 broad-direction coverage pre-check and no baseline.
3. `partial-adopt.md` — **REVISE**, Gate 2: a `partial` claim is used to support an adopt recommendation.
4. `single-run-strong.md` — **REVISE**, Gate 2: single run with no CI/slice/raw data; the 2× claim is at most partial and "adopt" is unsupported.
5. `strong-plan.md` — **PASS**, 96/100, all seven floors met with margin, no P0/P1, 2/3 unresolved P2.
6. `vague-review.md` — **REVISE** (review rejected), Gate 2: "Looks good. 90/100. Ship it." has no findings, no gate table, no claim table, and cannot authorize a ship.
7. `weak-plan.md` — **REVISE**, 6/100, zero floors met; one demo, no baseline/metrics/slice/raw data.

## 10. Post-write integrity re-check

Re-computed at 2026-11-25T13:03:06+08:00, after this report was written:

| Fixture | Post-write SHA-256 | Matches §2 |
|---|---|---|
| `floor-boundary.md` | `12c5b2818a7b5bb25e708f19dcc4c4ee680724c04ea45970fdd584d820ded41a` | yes |
| `narrow-directions.md` | `fe149d4c8a41d77ec9e0fdf71c2179b268aeb6d6a31085fbef875f07705268bb` | yes |
| `partial-adopt.md` | `91b525208d118e2f6d4dbcfc9ecb37935650080fb8dedf4a897f172e273ab001` | yes |
| `single-run-strong.md` | `2f8dbc54a46c144133247ab8cb5bf22f97795b593fb520cbb77bc758141c5169` | yes |
| `strong-plan.md` | `7976d59fc308871863cec7ca5cf94f5599b59ce10ec8a017d37aa08005fe2eab` | yes |
| `vague-review.md` | `d127a9ab355e7131a7ac56e1ef46dc5eee86cf54e5a55a3358b6aaecc74bd321` | yes |
| `weak-plan.md` | `08c55314f8ed2e504776d2a2eb7f233e71f32984f6232ba56ced3c95457c382f` | yes |

The combined fixture-manifest hash remains
`80218d9f2ab3e08f9da76529fc5626049adfa24f5fe5ace863535688a9fec6f2`, and the input
mtimes are unchanged from before this review. Result: **all seven inputs are
byte-identical to the §2 record; no input was modified.**

---

Signed: `calibration-reviewer-3`, independent reviewer, 2026-11-25T13:03+08:00.

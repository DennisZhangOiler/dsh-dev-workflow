# Plan re-review — R2 gate (rev 2, before any demo)

**Reviewer record**

| Field | Value |
|---|---|
| Role | independent plan reviewer 2 (Gate 1; re-review; not author/experimenter; not `plan-reviewer-1`) |
| Identity | `plan-reviewer-2` |
| Model / provider | `deepseek-flash` / `deepseek-official` |
| Time (UTC) | 2026-11-25T03:55:58Z |
| Inputs | `docs/RESEARCH.md`, `docs/research/e2e/DECISION.md`, `docs/research/e2e/DIRECTIONS.md`, `docs/research/e2e/PLAN.md` (rev 2), `docs/research/e2e/PLAN-REVIEW.md` (prior review) |
| Input hash | `8f4f8581d78374e8001186c82ea3ba58ff32cc5102fd56bf492c680a74e27414` (SHA-256 of the five files concatenated in the order listed; 86,083 bytes total) |
| Per-file SHA-256 | RESEARCH `606edaf9…e0f4`; DECISION `66010467…5dad`; DIRECTIONS `5183fbd0…ee75`; PLAN `7976d59f…eab`; PLAN-REVIEW `4b4c4d6c…942` |
| Independence | I did not write `PLAN.md` or `PLAN-REVIEW.md` and did not modify either. No demo, benchmark, candidate spike, or harness was executed. Read-only checks: `git rev-parse HEAD`, `git check-ignore -v`, `git ls-files`, `git status --porcelain -- src test package.json`, `sha256sum`, `node --version`, `npm --version`, `uname -a`, `lscpu`, `free`; plus the existing production suite `node --test` (1 test, 2 assertions, pass). No writes except this file. |
| Prompt hash | Not available as a file (instruction delivered in-session); no claim made. |
| Prior verdict context | `plan-reviewer-1` returned REVISE with P1-1, P1-2 and P2-1/P2-2/P2-3. This re-review verifies those exact pass conditions and checks for regressions/new blocking issues. The approved directions (D1–D4 + D0 control) and the decision frame are not reopened. |

**Verdict: PASS.** R3 may start. No P0/P1 remains; all gate floors are met. One new non-blocking P2 and seven P3 observations are recorded below; none invalidates the experiment design. Implement R2-P2-1 before interpreting L2 timing (the design already states the invariant; the follow-up adds an executable audit). No demo was run in this review; R3 remains the first execution.

**Score: 90/100 (gate).** Unresolved P2: **1/3**. P0: **0**. P1: **0**. P3: **7** (non-blocking).

| Area | Score | Floor | Status |
|---|---:|---:|---|
| Selected-direction execution | 18/20 | 16 | pass |
| Decision and metrics | 14/15 | 12 | pass |
| Baseline and controls | 15/15 | 12 | pass |
| Experiment sufficiency | 18/20 | 16 | pass |
| Reproducibility / artifacts | 8/10 | 8 | pass (at floor) |
| Risk / license / safety | 9/10 | 8 | pass |
| Reviewability | 8/10 | 8 | pass (at floor) |

Gate arithmetic: all seven areas at/above floor; total 90 ≥ 80; no P0/P1; unresolved P2 1 ≤ 3. The score is the gate, not a diagnostic. The two prior P1s are fixed by executable controls; the remaining P2/P3s are hardening/documentation items, not evidence-design failures that invalidate a conclusion.

---

## 1. Prior findings — resolution verification

The pass conditions below are the exact conditions stated by `plan-reviewer-1`; I checked the rev-2 text and, where possible, the read-only environment facts.

| Prior ID | Status | Rev-2 evidence (file/lines) | Pass condition met? |
|---|---|---|---|
| P1-1 | **Resolved** | `PLAN.md` §1 lines 21–23: HEAD recorded as `704a4f531b04d9da52575c5833090a6fbed24858` (verified by `git rev-parse HEAD`); explicit statement that the worktree is untracked/ignored and provenance is the file hashes, not the commit. Lines 28–30 record `src/dedupe.js` = `b54842d6…8850`, `test/dedupe.test.mjs` = `9e8c8dc6…eae48`, `package.json` = `a770daf3…ca89`; all three verified by `sha256sum` and match exactly. §4 EXP-FIT lines 143–166: pre-run hashes of four files into `data/env.json` + `data/prod-before.sha256`; baseline copy hash must equal `src`; post-run recompute and compare; any mismatch ⇒ abort R3/M5 FAIL; altered-temp-copy self-test. §7 M5 line 263 repeats the rule. §12 commands lines 466–494 include `sha256sum -c data/prod-before.sha256` and `node harness/fit.mjs --env data/env.json`. §14 CLM-5 line 544 is hash-based. `git status` is explicitly labelled non-detecting (§1 line 32, §4 lines 162–164, §9 line 360). | **Yes.** Hash commands + mismatch-abort rule present; verified HEAD/untracked statement; M5 no longer claims `git status` proves production unchanged. |
| P1-2 | **Resolved** | `PLAN.md` §6 lines 224–231: pinned numeric pool is unique integers in `[1, 2^31−1]` with `NaN`/`+0`/`−0` excluded; L1 fully unique; L2 has exactly one duplicate pair at n−2/n−1 and is unique otherwise; raw L1/L2/M-numbers records store `poolRule`, `plusZeroCount`, `minusZeroCount`, `expectedResult`, `observedResult`, `resultCheck`. Lines 240–249: `NaN`/`±0` are parity-only; at n=10k the generator asserts zero counts for L1/L2 before timing; D1 must return `false` on L1 and `true` on L2. §4 EXP-1b line 112: timed-cell result check is non-exempt; any disagreement aborts the cell as harness-invalid. §7 M1 line 258 confines the `±0` exemption to parity. §8 step 5 lines 309–313: `expectedResult` declared before timing (`false` L1, `true` L2), every direction must match, any disagreement aborts the cell, no `±0` exemption. §9 lines 350/355 and §11 line 402 repeat the abort/stop rule. | **Yes.** L1/L2 pool rule stated; non-exempt cell-result check; abort rule; §9 no longer exempts D1 from the timed-cell check. D1's timing is comparable even though A2 (default exact parity) makes D1 non-adoptable. |
| P2-1 | **Resolved** | One D4 latency rule is now consistent across §2 line 59, §4 EXP-4b line 136, and §7 M2-D4 line 260: PASS iff M1 exact AND, on both L1/L2, median S ≥ 1.0 with 95% CI low > 0.8 AND not dominated (`S_D4 ≥ S_bestSet/1.2`); FAIL on M1 failure, median S < 1.0 on either workload, or dominance; otherwise CANNOT CONCLUDE. M3 is report-only for D4 in §2, §4, and §7; §7 direction applicability line 281 says D4 uses M2-D4 only. | **Yes.** A single unambiguous D4 rule; no 1.0×–2.0× ambiguity; M3 non-gating for D4 is consistent. |
| P2-2 | **Resolved** | §7 M4 line 262 is named “**Post-call** extra memory (lower bound on peak)”; the gate is post-call heap delta ≤ 64 B/item and post-call ΔRSS ≤ 128 MB; “peak” is explicitly forbidden as the measured quantity. §8 lines 333–336 names the measured quantities “post-call heap delta”/“post-call ΔRSS” and documents the lower bound. §9 line 357, §10 lines 393–394, and §14 line 555 repeat the wording restriction. | **Yes.** M4 metric, gate, protocol, and allowed claim wording all say post-call lower bound. |
| P2-3 | **Resolved** | §4 EXP-0a line 100 adds a deliberately wrong always-`false` control loaded through the same candidate-resolution path and requires ≥1 mismatch in `data/raw/parity-control.json`; §6 lines 200–222 adds the 14-case hand-computed expected-result table (E1–E14), stored in `harness/corpus.mjs` and each parity artifact; §7 M1 line 258 makes baseline/D0 agreement with the table and the mutant ≥1 mismatch harness-validity prerequisites; D1’s `±0` mismatch is a second positive control. §14 CLM-7 line 546 makes the control result a required evidence-matrix row; §12 line 451 names the artifact. | **Yes.** Discriminating negative control + hand-computed oracle + D1 positive control; a zero-mismatch control invalidates M1. |

**No regression found in the previously passing areas:** baseline/control design, slice definition, run protocol, risk/safety, and reviewability remain intact. The R2/rev-2 hashes in §1 match the working tree exactly, so the prior P1-1 provenance defect is not merely reworded; it is substantively corrected.

---

## 2. New findings (this re-review)

### R2-P2-1 [P2][non-blocking] L2’s “unique otherwise” invariant has no enforced audit or raw record, so an accidental early duplicate could still shorten a gated scan without failing the cell

**Location:** `PLAN.md` §6 L2 construction (lines 195, 224–231), §6 “unique otherwise” / full-scan rationale (lines 240–249), §8 raw record schema (lines 314–318), §4 EXP-1b (line 112).

**Evidence:**
- L2 is specified as “~50 % numbers … (unique), ~20 % strings, ~10 % booleans/null/undefined/bigint/symbol, ~20 % distinct object refs, with **exactly one duplicate pair at indices n−2, n−1** (same object reference)” and “L2 … is unique otherwise” (lines 195, 227–228). This is a construction invariant, not an asserted artifact.
- The raw L1/L2/M-numbers record schema stores `poolRule`, `plusZeroCount`, `minusZeroCount`, `expectedResult`, `observedResult`, `resultCheck`, seed, and a **sampled** input checksum (lines 229–231, 314–318). It stores no duplicate count, duplicate indices, or uniqueness audit.
- L2’s declared `expectedResult` is `true` (line 248). An accidental earlier duplicate—e.g. a second `null`, `true`, or `undefined` in the ~10 % mixed-type fraction—still makes D1/D2/D3 return `true`; `resultCheck` passes. The non-exempt cell check therefore cannot distinguish a full scan from an early return on L2. The zero audit catches the P1-2 `±0` class on L1, but not this class.
- The corpus description makes the risk concrete: only ~4 values are available among booleans/null/undefined, while the ~10 % fraction at n=10k is ~1,000 items. Uniqueness is feasible only if the generator deliberately uses unique bigints/symbols/strings/objects and limits the finite values; the plan does not say how, nor does it assert the result.

**Why it matters:** D1/D2/D3’s M2 ratios on L2 are gated on a full scan (the plan says so at lines 246–249). An accidental duplicate would shorten the scan and inflate the measured speedup while every declared check stays green. This is the same class of baseline-fairness defect as P1-2, now confined to a generator invariant that the timed-cell result check cannot see. It does not block the gate because the invariant is explicitly stated and the generator is not yet written; it is material enough to require an executable audit before L2 timing is interpreted.

**Required action:**
1. In `harness/corpus.mjs`, construct L2 so every non-duplicate value is unique (use at most one each of the finite values `true`, `false`, `null`, `undefined`; use unique bigints/symbols/unique strings/unique object refs for the rest of the mixed and object fractions), then insert exactly one same-reference duplicate at n−2/n−1.
2. Assert during generation that exactly one duplicate pair exists and that it is at n−2/n−1 (e.g. an identity `Map`/`Set` count plus a one-time `Object.is` audit, or an explicit construction invariant checked by a full scan). Fail the cell and abort R3 if the audit fails.
3. Record `duplicateCount: 1`, `duplicatePairIndices: [n-2, n-1]`, and `uniqueOtherwise: true` (or the full audit result) in every L2 raw record; keep the existing `expectedResult`/`resultCheck` fields.

**Pass condition:** Re-review sees the L2 construction/assertion and the raw-field schema; the results review verifies at least one L2 raw file records `duplicateCount = 1` and pair indices `n−2/n−1`. Until then, L2 timing must be treated as unverified for full-scan fairness and must not support a gated D1/D2/D3 speedup claim.

**Why this is non-blocking:** The approved directions, metrics, thresholds, and slice are unchanged; the fix is a generator assertion and raw-field addition. The invariant is already required by the plan text, and the results review is the next independent check.

---

### R2-P3-1 [P3][non-blocking] `PLAN-REVISION.md` is referenced three times but does not exist

**Location:** `PLAN.md` header line 6 (“What changed, and where, is listed in `PLAN-REVISION.md`”), §12 planned tree line 439, §15 line 569.

**Evidence:** `ls docs/research/e2e/PLAN-REVISION.md` → “No such file or directory”; `grep -n PLAN-REVISION docs/research/e2e/PLAN.md` returns lines 6, 439, 569. At inspection time (before this review file was written), the directory contained only `DECISION.md`, `DIRECTIONS.md`, `PLAN-REVIEW.md`, and `PLAN.md`.

**Why it matters:** The revision claims a change record that is absent. I reconstructed the changes from the rev-2 text and the prior review, so the gate is not blocked, but the claimed artifact tree is incomplete and the plan’s own status statement is false.

**Required action:** Write `PLAN-REVISION.md` as a table mapping each prior P1-1/P1-2/P2-1/P2-2/P2-3 (and any P3 addressed) to the exact PLAN sections/lines changed and the disposition, or remove the three references and point to inline revision notes. Keep the file out of the demo execution path.

**Pass condition:** File exists and is consistent with rev 2, or the references/claim are removed. No experiment/evidence/decision rule depends on it, so it is non-blocking; fix before R4.

---

### R2-P3-2 [P3][non-blocking] The “Commands to be executed at R3” block is not exhaustive

**Location:** `PLAN.md` §12 lines 460–495.

**Evidence:** Parity commands list only `d0`, `control-mutant`, and `d1`; no `d2`/`d3`/`d4` parity commands. Memory lists only `d2` M-numbers; no `d0`/`d1`/`d3`/`d4` M-numbers, no `d3` M-objects, and no L3 object-heavy command. Yet §4/§5 and the artifact tree require `parity-<d>.json` for every direction and `mem-<d>-<corpus>.json` for the memory matrix. The block is labelled “Commands to be executed at R3 (design)”, which reads as exhaustive.

**Why it matters:** A literal execution would omit required gated parity/memory cells, and the results review would reject the evidence bundle. This is a reproducibility/documentation completeness issue, not a method defect.

**Required action:** Either (a) label the block “representative examples; the full matrix is §4/§5 and `data/COMMANDS.md` will contain every cell”, or (b) add the missing parity/memory/L3 commands. Ensure `data/COMMANDS.md` records every executed cell with exit code and timestamp.

**Pass condition:** The plan makes clear that all required direction × corpus cells are run and recorded; the results review sees parity and memory artifacts for every direction/corpus required by §4/§5. Non-blocking because the per-direction tables and artifact schema already define the cells.

---

### R2-P3-3 [P3][non-blocking] §5 memory “6 runs” is still inconsistent with §8’s 16 processes

**Location:** `PLAN.md` §5 line 175 (“Memory 100k M-numbers (+ M-objects for D3) | D0–D4 (+1) | 6 runs | 120 s”) vs §8 memory protocol lines 329–332 (candidate cells 3 runs, baseline 1).

**Evidence:** M-numbers: D0 (1 baseline) + D1–D4 (4 × 3) = 13; M-objects: D3 (3) = 3; total 16 processes, not 6. The “Count” column is counting cells, not processes. This is the prior P3-1, still present.

**Why it matters:** The 7-minute R3 allocation uses 120 s for memory; the unit inconsistency weakens the timebox estimate. It does not change any gate or decision rule.

**Required action:** Relabel the count as “6 cells / 16 processes” (or state the run policy) and re-check the memory/time budget; keep the fallback ladder if the baseline 100k run exceeds the 180 s cap.

**Pass condition:** §5 and §8 use the same unit and arithmetic; re-review sees a consistent budget. Non-blocking because the fallback/timebox and raw-retention rules already handle overruns.

---

### R2-P3-4 [P3][non-blocking] D3’s “no material gain over D2” kill criterion is still not operationalized

**Location:** `PLAN.md` §2 D3 row line 58 (“no material latency/memory gain over D2 (within MDE); complexity without benefit”) vs §7 metrics (lines 256–266) and §4 EXP-3b line 128 (L3 non-gating).

**Evidence:** §7 defines M2 for D3 against the baseline only; there is no D3-vs-D2 threshold or measurement rule. L3/S2 is explicitly non-gating and cannot alone support D3. The prior P3-2 remains.

**Why it matters:** D3 could clear M2 (be ≥2× faster than baseline) but be slower than D2 on the same workload and still not be marked “dominated” by the pre-declared kill criterion. R4’s transparent ranking would show it, but the plan should not leave a kill criterion unexecutable.

**Required action:** Define the comparison (e.g. D3 median S vs D2 on L1/L2 and M-numbers, with the same 20 % MDE) or explicitly mark the D2-dominance criterion as a report-only observation for R4. Keep §2 and §7 consistent.

**Pass condition:** Re-review sees one executable rule or an explicit downgrade to observation. Non-blocking because no adoption decision is made in research and R4 reports all directions.

---

### R2-P3-5 [P3][non-blocking] The “rerun-one-anomaly” buffer still has no anomaly/rerun policy

**Location:** `PLAN.md` §5 line 178 (“Buffer/rerun-one-anomaly | — | — | 60 s”) vs §11 stop rules/fallback (lines 400–424).

**Evidence:** §11 defines stop, abort, and fallback conditions but not (a) what counts as an anomaly, (b) whether a rerun replaces a rep or a whole cell, or (c) whether both original and rerun are retained. The prior P3-3 remains.

**Why it matters:** A rerun of a single outlier rep without a pre-declared rule creates a cherry-picking ambiguity in the timed data. The raw retention rule helps, but the trigger is undefined.

**Required action:** Allow reruns only on harness-invalid signals (baseline slope out of range, timed-cell result mismatch, parity-control failure, hash drift, crash/timeout), retain both original and rerun, and forbid replacing only the outlier rep. Record every rerun in `data/COMMANDS.md` and `EVIDENCE-MATRIX.md` limitations.

**Pass condition:** Policy is visible and consistent with §11. Non-blocking because no rerun is planned and the stop/abort rules already retain failed runs.

---

### R2-P3-6 [P3][non-blocking] CLM-3 still says “incl. object-heavy” although L3/S2 is exploratory

**Location:** `PLAN.md` §14 CLM-3 line 542 vs §4 EXP-3b line 128 and §10 lines 384–396.

**Evidence:** CLM-3 is “D3 exact parity + speedup/scaling/memory (incl. object-heavy)”; L3 is 3 reps, non-gating, and “cannot alone support D3 adoption” (EXP-3b). §10 excludes claims for the weak-memory hypothesis unless measured. This is the prior P3-4.

**Why it matters:** The anticipated claim could let an exploratory object-heavy cell appear as a gated memory/performance claim in the memo.

**Required action:** Mark object-heavy as exploratory in CLM-3 (e.g. “object-heavy: exploratory, non-gating”) or add an explicit allowed-wording note in §14. Keep S2/L3 non-gating in the evidence matrix.

**Pass condition:** CLM-3 wording is consistent with §4/§10. Non-blocking because §4 and the allowed-wording rules already restrict L3.

---

### R2-P3-7 [P3][non-blocking] The pre-run hash is self-recorded and not anchored to the R2 PLAN hash

**Location:** `PLAN.md` §1 lines 28–30, §4 EXP-FIT step 1 lines 143–147, §7 M5 line 263.

**Evidence:** `data/env.json` records the `src/dedupe.js` hash at R3 start; the baseline copy must match it; the post-run hash must match the pre-run value. If `src` were edited between this R2 review and the `env.mjs` run, `env.json` would record the edited hash, the baseline copy would match it, and the pre/post comparison would still pass. The R2 hash `b54842d6…8850` is in PLAN §1 but is not an automated input to `fit.mjs`. The read-only checks show no evidence of an edit now (current hash matches); this is a narrow pre-R3 window.

**Why it matters:** M5’s “production unchanged for the whole run” starts at R3. The stated research rule already forbids edits, and the self-tested pre/post check is a real fail-able control (P1-1 is fixed); this is hardening for the earlier window, not a recurrence of P1-1.

**Required action:** Have `env.mjs` assert the four pre-run hashes against the R2 values recorded in `PLAN.md` (at minimum `src/dedupe.js` = `b54842d6…8850`) and abort on mismatch; or record an explicit `r2AnchorCheck: pass/fail` in `data/env.json`/`data/fit.json`. No production edit is needed.

**Pass condition:** The env/fit artifact shows the R2 anchor comparison. Non-blocking because the current tree matches the R2 hash and the post-run check is already fail-able; fix before R3 if convenient.

---

## 3. Residual risks (carry into R3/R4; cannot be removed by this review)

1. **Single host / single Node version / dev desktop, no CPU pinning, governor, NUMA, or isolated benchmark host.** Results remain “measured here on synthetic Node 22 microbenchmarks,” never production (`PLAN.md` §9, §13).
2. **7 reps** give a wide bootstrap CI even after fixes; a PASS supports a candidate, not adoption (`PLAN.md` §7 interpretation rules).
3. **Synthetic distributions and unknown real input size/frequency (G1).** Primary n = 10k is an assumption; if real callers use small arrays, D0 may still be correct regardless of the speedup. S1 is exploratory only.
4. **M4 is a post-call lower bound, not peak.** RSS is page-granular; the baseline memory at 100k may time out and be unmeasured; peak in-call memory remains unproven.
5. **D4 comparator correctness** remains the main implementation risk (G3); the property checks are strong but 20k random triples are not a proof.
6. **D3’s weak-memory premise may not materialize** (G4); the local `WeakSet` is discarded at return, so no GC benefit is assumed.
7. **Artifacts are outside git** (the worktree is under the parent repo’s ignored `/.tmp/`). Retention/cleanup is filesystem-only; env/file hashes are the only provenance. Keep them with the raw data.
8. **This review validates the plan, not the harness implementation, corpus generator, or candidate spikes.** The results review must re-check those and must be a different agent from this reviewer. `PLAN-REVISION.md` and the L2 uniqueness audit do not yet exist; they are follow-ups, not validated artifacts.
9. **A2 default is exact parity**, so D1 is non-adoptable unless the user answers otherwise. D1’s timing is still measured for information; its `±0` class is parity-only. The user may answer A2 before R3; record it at the top of the memo.

---

## 4. Pass conditions and gate decision

**Gate conditions (all met):**
- Every area at/above its floor (table above; reproducibility and reviewability at floor 8/10).
- Total 90 ≥ 80.
- No P0; no P1.
- Unresolved P2 = 1 (R2-P2-1), within the 3-P2 ceiling.
- The two prior P1 pass conditions are met by executable controls, not prose.

**Conditions for R3/R4 (non-blocking at this gate):**
1. Implement R2-P2-1’s L2 uniqueness audit before L2 timed cells are interpreted; if it is not implemented, L2 timing must be reported as unverified for full-scan fairness and cannot support a gated D1/D2/D3 speedup claim.
2. Write `PLAN-REVISION.md` (R2-P3-1) before R4, or remove the references.
3. Clarify/label the command matrix (R2-P3-2), reconcile the memory run count (R2-P3-3), and resolve the D3-dominance, rerun, CLM-3, and R2-anchor P3s before their respective evidence is interpreted.
4. Do not change the approved direction set, thresholds, or slice without an explicit user decision and a delta re-review.
5. The results review must be by a different agent from `plan-reviewer-2` and must independently validate the harness, corpus generator, and candidate spikes.

**PASS authorizes R3 only.** It is not an adoption decision and does not validate any timing, memory, or parity result (none exists at R2). No demo was run in this review; the existing production suite was run only to confirm the current test state (1 test, 2 assertions, pass).

**Signed:** `plan-reviewer-2` / `deepseek-flash` / `deepseek-official` — 2026-11-25T03:55:58Z

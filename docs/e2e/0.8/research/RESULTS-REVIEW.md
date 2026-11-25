# RESULTS-REVIEW — reduced D0 vs D2 E2E

**Reviewer record**

| Field | Value |
|---|---|
| Role | independent results reviewer (R5 gate; not author, experimenter, plan reviewer, or synthesizer) |
| Identity | `results-reviewer-1` |
| Model / provider | `deepseek-flash` / `deepseek-official` |
| Time (UTC) | 2026-11-25T04:03:19Z (review clock; files written 04:03–04:05Z) |
| Inputs | `PLAN.md` (rev 2), `PLAN-REVIEW-R2.md`, `REDUCED-RUN.md`, `data/raw.json`, `data/env.json`, `harness/bench.mjs`, `src/dedupe.js`, `test/dedupe.test.mjs`, `package.json` |
| Concatenated input hash | `e76b8196d0782f3d541d57e6d6ea6230ee8571b312a3eeaf4def966ce9f02a5e` (the five review inputs in the order above, 150,718 bytes) |
| Per-file SHA-256 | PLAN `7976d59f…2eab`; PLAN-REVIEW-R2 `685f5d62…b2e7`; REDUCED-RUN `69d8e532…e913`; raw `75962457…ef37`; env `55b48d00…8c42`; harness `9c4a53f7…b10c` |
| Independent extraction | `CLAIMS.md`, SHA-256 `e0a6f130329d372c763a3bec3770d95ef7a18ddf13fd35fc3c8c67754842afd2` (written before this review and before any memo; no `memo.md` exists) |
| Prompt hash | Not available as a file (instruction delivered in-session); no claim made |
| Prior results verdict | **None exists.** I formed this verdict without reading any prior results review or memo; the plan-review verdict (`PLAN-REVIEW-R2.md`, PASS) is context, not a results verdict |
| Independence | I did not write `PLAN.md`, `REDUCED-RUN.md`, `harness/bench.mjs`, `data/raw.json`, or `data/env.json`. Read-only checks only: `sha256sum`, `node --version`, `git rev-parse HEAD`, `node --test`, and in-memory regeneration/recomputation. No production or artifact file was modified; writes are limited to `CLAIMS.md` and this file |
| Rerun / recompute | No adopt/migrate/security claim exists, so no decisive rerun was required. I regenerated all four inputs from the documented seeds (all four SHA-256 matched), computed an independent pairwise `Object.is` reference (results `false/false/false/true`), recomputed all eight cell medians from the 24 raw reps (all eight matched the stored values), audited the alternating order (match), and re-ran `node --test` (1 pass) |

**Verdict: PASS.**

**Score: 90/100 (reduced-run evidence quality; gate).** P0: **0**. P1: **0**.
P2: **0**. P3: **5** (non-blocking). This is a score for *this reduced run's
evidence*, **not** a full-plan score and **not** a statement that the full
`PLAN.md` gates were met. No adoption/migration recommendation is made or
reviewed, because none exists.

**Gate decision:** every claim actually made by the reduced run record is
`supported` or `partial` with a mandatory limit; no unsupported extrapolation is
asserted; no invalid data or cherry-picking was found; all omitted full-plan
cells are explicitly labelled unmeasured. The removed full-plan cells lower
confidence and restrict wording but, per the user's reduced-scope instruction,
do not fail this gate. PASS means this reduced record may be used as
**descriptive, measured-here evidence with the stated limits**; it does not
authorize adoption, migration, or a production change.

| Area | Weight | Score | Floor | Status |
|---|---:|---:|---:|---|
| Data and artifact integrity / provenance | 20 | 20 | 16 | pass |
| Harness validity and control strength | 20 | 17 | 16 | pass |
| Claim–evidence alignment / no overreach | 20 | 18 | 16 | pass |
| Reproducibility and auditability | 15 | 12 | 12 | pass (at floor) |
| Scope, limits, and decision hygiene | 15 | 15 | 12 | pass |
| Uncertainty communication | 10 | 8 | 8 | pass (at floor) |
| **Total** | **100** | **90** | **80** | **pass** |

The score is a gate, not a diagnostic: all floors are met, total ≥ 80, and no
P0/P1. The `18/20` on claim alignment reflects the "exact-parity" shorthand in
the run title (finding F-1); the `17/20` on harness validity reflects the direct
mutant call and missing candidate-resolution path (F-3); the `12/15` on
reproducibility reflects the missing command log (F-2); the `8/10` on uncertainty
reflects the absence of any timer-overhead measurement (F-4).

---

## 1. Process audit

**Commands and environment.** `REDUCED-RUN.md` §3 documents
`node docs/research/e2e/harness/bench.mjs`; `env.json` records Node `v22.23.2`,
V8 `12.4.254.21-node.56`, npm `10.9.8`, Linux x64, AMD Ryzen 9 9950X, 32 logical
CPUs, 62,307,296 kB RAM, `gitHead`
`704a4f531b04d9da52575c5833090a6fbed24858`, loadavg `0.06,0.13,0.37` at start
and end, and a 972.2 ms duration. I independently verified Node, HEAD, and all
recorded hashes. No dependency, network call, or `node_modules` is recorded.

**Baseline fairness.** D0 is the real production `hasDuplicateSlow` imported
read-only from `src/dedupe.js` (harness lines 37, 98); it is not a synthetic
reimplementation. The same parent-generated array is used within each direction
and the order alternates as specified (rep 1 D0→D2, rep 2 D2→D0, rep 3 D0→D2;
I audited all 24 runs and the order matches). Both directions were checked
against the same expected result in warmup and in the timed call. Deviation:
there is no `baseline/` copy and no R2-anchor assertion inside the harness
(F-3); I closed the anchor question by verifying the current `src/dedupe.js`
hash equals the R2 value `b54842d6…8850`.

**Variance and CI.** Three timed reps per cell, no bootstrap, no CI — exactly the
reduced scope. Raw per-rep values are retained; no rep was dropped or replaced.
D0 reps are tight except unique-5000 rep 2 (3.879 vs 3.428/3.431 ms); D2
unique-5000 rep 2 (0.407 ms vs 0.153/0.144 ms) is a visible outlier, retained
and disclosed. No stability/variance claim is made.

**Harness validity.** The 14-case hand-computed `Object.is` table is present and
D0 and D2 each match 14/14. The always-false mutant is detected by 9/14 table
mismatches (`E1,E4,E5,E6,E8,E9,E10,E11,E13`) and by returning `false` on the
duplicate workload. Each child reproduces the parent input checksum; every timed
run's boolean matches the declared expected result; all 24 children exit 0.
`harnessValid = true` and all five `validityChecks` are true. The existing suite
passes (1 test, 2 assertions), and I re-ran it: pass. Production SHA-256 values
are byte-identical before/after and match the R2 values; independent `sha256sum`
confirms.

**Missing runs / failed runs / cherry-picking.** None of the executed cells
failed. No failed or timed-out child exists. The omissions are the full-plan
cells (D1/D3/D4, memory, scaling, L2/L3, small-n, 10k random parity), all listed
in `deviationsFromFullPlan` and `limitations`; I checked that no artifacts or
cells for them exist and that the run record does not claim them. The one
outlier is retained; I found no evidence of selection.

**Semantic parity.** Only the 14 curated cases were exercised. E1–E14 cover
`NaN`, `±0` in both orders, same-sign zeros, `undefined`, holes, `null`, strings,
mixed types, same-reference objects, and distinct equal-looking objects. This is
real but narrow: no C-core (~40), C-zero matrix, C-rand 10k, L2 mixed, or object-
heavy L3 corpus was run. The D2 algorithm is designed to be `Object.is`-exact,
but that is an argument from the code, not a measurement beyond the 14 cases.

**Dependencies/manifest.** No dependency added; `package.json` unchanged; no
lockfile exists (as in the plan). Nothing in the artifacts suggests a network
call or install.

**Unused results.** All 24 raw reps feed the eight cells; no cell or run is
unused. `minMs`/`maxMs` are used only for the outlier description. `loadavg` is
recorded only at environment level, not per run (F-4). There is no separate
`data/COMMANDS.md`, `data/fit.json`, `data/prod-before.sha256`, or hash self-test
artifact (F-2); those are full-plan items, omitted by the reduced scope rather
than contradicted.

---

## 2. Findings

### F-1 [P3][non-blocking] "Exact-parity" shorthand is evidenced only by the 14-case table

- **Location:** `REDUCED-RUN.md` title, §1 and §5; `data/raw.json.parity.d2`;
  `CLAIMS.md` P-1.
- **Evidence:** `parity.d2` contains 14 cases and `allMatch=true`; `limitations`
  and `notTheFullStudy` say no 10k random parity, no C-core/C-zero/C-rand, no L2.
  `PLAN.md` §6/§7 defines full M1 parity over those corpora.
- **Why it matters:** A memo that repeats "D2 exact-parity" without the limit
  would claim more semantic coverage than was measured.
- **Required action:** In any memo, say "D2 matched the 14-case curated
  `Object.is` table"; do not state or imply general exactness. Keep §5's
  qualification attached.
- **Pass condition:** No memo sentence claims parity beyond the 14 cases unless
  a new mixed-type/random corpus is run and reviewed. Non-blocking because the
  run body and limits already qualify it and no memo exists.

### F-2 [P3][non-blocking] No command log / recorded harness exit code

- **Location:** `docs/research/e2e/data/`; `REDUCED-RUN.md` §3 and §8;
  `env.json` start/finish timestamps.
- **Evidence:** The data directory contains only `raw.json` and `env.json`; the
  plan's §12 expects `data/COMMANDS.md` with exact commands, exit codes, and
  timestamps. The harness prints a summary and exits 0 only when
  `harnessValid=true` (bench.mjs lines 683–686), but the exit code itself is not
  recorded.
- **Why it matters:** Reproducibility and the audit trail are thinner than the
  full plan; a reader cannot see the invocation/exit record from the artifacts
  alone (though `harnessValid=true` and the written artifacts imply success).
- **Required action:** In the memo/evidence bundle, record the exact command,
  cwd, exit code, and timestamp (or add `data/COMMANDS.md`). Do not rewrite
  `raw.json` solely to add it.
- **Pass condition:** The evidence bundle cites the executed command and result.
  Non-blocking because the harness is deterministic, single-command, hashed, and
  I independently reproduced its inputs and medians.

### F-3 [P3][non-blocking] The mutant is not exercised through a candidate-resolution path; D0 is an import, not a baseline copy

- **Location:** `harness/bench.mjs` lines 37 and 98 (D0 import), lines 476–503
  (direct `runParityCases(alwaysFalse)` / `alwaysFalse(duplicateInput)`);
  `env.json.deviationsFromFullPlan` items 5–7.
- **Evidence:** The run record explicitly says "No ... mutant-through-candidate-
  path" and "D0 is imported ... rather than a baseline/ copy"; there is no
  `baseline/hasDuplicateSlow.mjs` and no candidate-loading resolver.
- **Why it matters:** The control proves the correctness path can flag a wrong
  function, but not that the direction-resolution path would load the wrong
  candidate. The missing baseline copy means the pre/post hash is not anchored
  to the R2 value at runtime; I verified the anchor now, which closes the window
  for this artifact.
- **Required action:** In the memo, state that the mutant was called directly and
  that D0 was the production import; do not claim candidate-loading validation.
  If the full study is later run, implement the plan's path.
- **Pass condition:** The limitation is carried into the memo. Non-blocking
  because the measured functions are exactly identified by the harness hash and
  the production hash, and no adoption is proposed.

### F-4 [P3][non-blocking] No timer-overhead measurement and no per-run loadavg; the smallest cell is ~0.059 ms

- **Location:** `harness/bench.mjs` lines 314–317 (one `hrtime` call around one
  call); `data/raw.json.runs[*]` (no `loadavg` field); `PLAN.md` §9 (timer
  overhead must be measured and <5% of the smallest gated cell).
- **Evidence:** D2 `unique-1000` median 0.059201 ms; no no-op overhead artifact
  and no per-rep loadavg. Loadavg is only at environment start/end.
- **Why it matters:** At ~59 µs, call/timer overhead or a transient JIT/GC event
  could materially move a single rep; the n=1000 ratio is the least stable
  number. The 10k cells are ~0.32 ms and more robust.
- **Required action:** Treat the n=1000 ratio as descriptive and do not use it
  for a threshold/gate; if a full study is run, add the no-op overhead check and
  per-run loadavg.
- **Pass condition:** Memo wording labels the small-n ratio descriptive.
  Non-blocking because no M2/CI claim is made and the 10k pattern is consistent
  across reps and the duplicate cell.

### F-5 [P3][non-blocking] The "unreviewed / no results review" notes are now stale

- **Location:** `data/env.json.deviationsFromFullPlan` item 8;
  `data/raw.json.limitations` item 7; `REDUCED-RUN.md` header/§7.
- **Evidence:** Those fields say no results review or memo was produced, which
  was true at run time but is no longer true after this review.
- **Why it matters:** A reader of the raw artifact could wrongly conclude the
  data is unreviewed. Editing `raw.json`/`env.json` would change their reviewed
  hashes, so the correction belongs in the memo/evidence bundle.
- **Required action:** The memo should cite this review (and its hashes) and note
  that the run-time "unreviewed" field is superseded. Do not rewrite the raw
  artifacts without a delta re-review.
- **Pass condition:** Memo cites the review and does not repeat the stale note as
  current status. Non-blocking documentation-only issue.

---

## 3. Claim verdicts

Statuses use the independent extraction in `CLAIMS.md`. "Allowed wording" is the
**only** wording permitted in a memo; anything broader is an unsupported memo
claim. There is no `REC-1..n` in the run record, so no recommendation mapping is
required; a future memo's recommendations must cite these claim IDs and may not
cite a `partial` claim for adopt/migrate.

### 3.1 Supported claims

| ID | Claim | Evidence | Status | Allowed wording |
|---|---|---|---|---|
| C-1 | Reduced harness completed with five validity checks passing. | `raw.harnessValid=true`; five `validityChecks=true`; 24 runs. | **supported** | "In the reduced run, all five recorded harness-validity checks passed." |
| C-2 | All 24 timed runs exited 0, matched inputs, returned expected boolean. | every `runs[]`: exit 0, `inputMatch=true`, `resultCheck="pass"`; 8/8 cells `valid=true`. | **supported** | "All 24 retained timed runs exited 0, reproduced the parent input checksum, and returned the expected result." |
| C-3 | Inputs are the documented deterministic arrays; unique/shape audits hold. | `workloads[*]` zero ±0/NaN/non-integer; `duplicateCount=1` at `[[9998,9999]]`; four `inputSha256`; reviewer regeneration and pairwise reference match. | **supported** | "The four inputs regenerated from the documented seeds match the recorded SHA-256 values; the unique arrays contain no ±0/NaN and the duplicate case has exactly one pair at indices 9998/9999." |
| C-4 | D0 matches the 14-case oracle. | `parity.d0`: 14/14, `allMatch=true`, no mismatches. | **supported** | "D0 matched the 14-case hand-computed Object.is table (14/14) in this reduced run." |
| C-5 | D2 matches the same 14 cases, including ±0 and NaN. | `parity.d2`: 14/14, `allMatch=true`. | **supported (narrow)** | "D2 matched the 14-case hand-computed Object.is table (14/14), including `[+0,-0]`, `[-0,+0]`, `[+0,+0]`, `[-0,-0]`, and `[NaN,NaN]`, in this reduced run." |
| C-6 | Always-false mutant was detected. | 9 mismatches (`E1,E4,E5,E6,E8,E9,E10,E11,E13`) + wrong duplicate-workload result. | **supported** | "The always-false mutant was detected by 9/14 table mismatches and by a wrong result on the duplicate workload." |
| C-7 | Cell medians and descriptive ratios are as recorded. | `cells[]` medians 0.169217/3.430864/13.843904/13.817595 (D0), 0.059201/0.153367/0.322966/0.323066 (D2), ratios 2.858347/22.370288/42.864896/42.770192; reviewer recomputation matches all eight. | **supported (descriptive)** | "Median-of-3 per-call wall-clock times on this host were D0 0.169/3.431/13.844/13.818 ms and D2 0.059/0.153/0.323/0.323 ms; the arithmetic ratio of the cell medians was 2.86×/22.37×/42.86×/42.77×. These are descriptive, one-host, three-rep observations, not a gated M2 result." |
| C-8 | D0 was slower than D2 in every measured cell on this host. | all four ratios >1; 24 raw reps; no reversal in the recorded cells. | **supported (descriptive, this slice)** | "On this slice and host, the D0 cell medians were larger than the D2 cell medians in all four cells; no statistical uncertainty is estimated." |
| C-9 | Duplicate case returns `true` in both directions, at a late pair. | 6 duplicate runs `result=true`, expected true, pair `[[9998,9999]]`; D0 13.817–13.819 ms, D2 0.316–0.344 ms. | **supported** | "For the duplicate case (pair at indices 9998/9999), both directions returned `true` in all three reps." |
| C-10 | All reps retained, including the D2 unique-5000 outlier. | 24 runs; D2 unique-5000 `0.407263 / 0.153367 / 0.144140`; no rerun/drop. | **supported** | "All 3 reps per cell were retained; the D2 unique-5000 rep-2 value of 0.4073 ms is retained as a visible outlier and was not replaced." |
| C-11 | Production src/test/package unchanged and matches R2. | before=after `b54842d6…8850`, `9e8c8dc6…eae48`, `a770daf3…ca89`; `productionUnchanged=true`; independent `sha256sum`; R2 plan values match. | **supported** | "Production `src/`, `test/`, and `package.json` SHA-256 values were identical before and after the run and match the R2 values; no production file was edited." |
| C-12 | Existing production suite passes. | `existingSuite` exit 0, 1 test/1 pass; reviewer re-run passes. | **supported** | "The existing `node --test` suite passed (1 test, 2 assertions) both in the run record and when re-run by the reviewer." |
| C-13 | Environment is Node 22.23.2 on one Linux x64 desktop. | `env.json` node/v8/npm/platform/arch/CPU/RAM/loadavg/HEAD; reviewer-verified. | **supported** | "The run records Node 22.23.2 on one Linux x64 AMD Ryzen 9 9950X desktop with load average 0.06/0.13/0.37 at start and end." |
| C-14 | Only D0/D2 and the stated cells were measured; omitted full-plan cells are unmeasured. | `deviationsFromFullPlan`, `limitations`; no D1/D3/D4, memory, scaling, L2/L3, small-n, or 10k random artifacts. | **supported (negative)** | "Only D0 and D2 on the four stated integer workloads were measured; D1/D3/D4, memory, scaling fit, L2/L3, small-n, and the 10k random parity corpus were not measured in this reduced run." |
| C-15 | No CI/bootstrap was computed. | 3 reps; no CI fields; run record states none. | **supported (negative)** | "No confidence interval or bootstrap was computed from the 3 reps; the reported ratios are descriptive." |

### 3.2 Partial claims (limit is mandatory; cannot support adopt/migrate)

| ID | Claim | Why partial | Status | Allowed wording |
|---|---|---|---|---|
| P-1 | "D2 is exact-parity." | 14 curated cases only; no C-core/C-zero/C-rand/L2/object corpus. | **partial** | "D2 matched the 14-case curated table; exactness on the full mixed-type/object corpus is **not established** by this reduced run." |
| P-2 | "D2 is 2.86×/22.37×/42.86×/42.77× faster." | Ratios of cell medians, not median paired ratios; no CI; 3 reps; one host. | **partial** | "The arithmetic ratio of the D0 and D2 cell medians was 2.86×/22.37×/42.86×/42.77× on this host and slice; no CI, paired-ratio median, or M2 gate was computed." |
| P-3 | "Timings are stable / low variance." | One D2 unique-5000 outlier (≈2.7× median); no variance model. | **partial** | "The 3-rep spread is reported raw; one D2 unique-5000 outlier is retained; stability and variance were not estimated." |
| P-4 | "The duplicate is detected only at the end." | Analytically implied by pair indices + code, not instrumented. | **partial** | "Given the audited pair at indices 9998/9999, both implementations can only detect it at the final comparison/element; no comparison counter was recorded." |

### 3.3 Unsupported claims (must not appear in a memo)

| ID | Claim | Why unsupported | Status | Allowed wording |
|---|---|---|---|---|
| U-1 | D2 passes M2 (≥2.0×, 95% CI low >1.2 on L1 and L2). | No L2 mixed workload, no 7 reps, no bootstrap/CI. | **unsupported** | Must not appear. At most: "descriptive median-of-3 ratio on one integer workload family." |
| U-2 | D2 passes M3 / has O(n) scaling. | No 1k/4k/16k fit or regression. | **unsupported** | Must not appear. At most: "three sizes were timed; no scaling fit was performed." |
| U-3 | D2 passes M4 / uses less memory / reduces peak or post-call memory. | No memory measurement. | **unsupported** | Must not appear. |
| U-4 | D2 is production-ready, adoptable, recommended, or superior for the library. | No memo, no adopt/migrate, single host, synthetic data. | **unsupported** | Must not appear. Research may at most hand off a candidate for a later Development contract. |
| U-5 | Result generalizes to real callers, browser, Deno/Bun, other Node versions, or production. | One dev desktop, Node 22.23.2 only, fixed synthetic arrays. | **unsupported** | Must not appear. |
| U-6 | D1/D3/D4 parity/speed/scaling/memory validated or ruled out. | Not measured. | **unsupported** | Must not appear. |
| U-7 | The reduced run satisfies the full PLAN.md gate or inherits the plan-review PASS. | R2 PASS covers the full design; this is a subset. | **unsupported** | Must not appear. |
| U-8 | The result is statistically significant, or 3 reps suffice for a decision. | No CI/test/power analysis. | **unsupported** | Must not appear. |
| U-9 | D0 is superseded/killed or should be replaced now. | No gate applied; D0 is the control. | **unsupported** | Must not appear. |

**Memo mapping:** no memo exists, so there are no memo claims absent from the
extraction, no recommendation IDs to map, and no unreviewed memo change. When a
memo is written, every sentence must map to C-/P-/U- IDs; any new claim not in
this table is `unsupported` until separately evidenced and reviewed.

---

## 4. What cannot be concluded

- **No full M1 parity.** C-core (~40 curated), C-zero, and the 10k seeded
  mixed-type/object corpus were not run. The 14-case result covers those cases
  only; `±0`/`NaN`/object handling in the wider mixed corpus is unmeasured.
- **No M2 gate.** No 7 reps, no per-rep paired ratios, no 95% bootstrap CI, no
  MDE decision, and no L2 mixed workload. The descriptive 2.86×–42.86× ratios
  are **not** a PASS on M2 and are not statistically characterized.
- **No M2-D4, M3, or M4.** Scaling fit, post-call memory, and D4 are unmeasured.
  No memory benefit, memory cost, linear-scaling, or peak-memory claim is
  supported.
- **No D1/D3/D4 evidence.** Their parity, latency, scaling, memory, comparator,
  and object-heavy behavior are all unmeasured.
- **No L2/L3, n=16k, n=100k, or small-n evidence.** The slice is fixed unique
  nonzero integers plus one late duplicate pair at n ≤ 10k.
- **No production/generalization claim.** One dev desktop, Node 22.23.2 only, no
  CPU pinning/governor/NUMA, no real caller data, no call-frequency data, no
  browser/other runtimes.
- **No decision.** No adopt/migrate, no ranking, no "D0 superseded," no
  "D2 recommended." The reduced run supports only a candidate handoff at most,
  and even that would require the full plan or a new user-approved reduced
  contract.
- **No statistical sufficiency.** Three reps cannot separate a stable effect
  from machine/JIT noise; the retained outlier is evidence of that limit, not a
  reason to discard it.

---

## 5. Memo stamp and delta-review trigger

- **Memo:** no `docs/research/e2e/memo.md` exists (glob `**/memo*.md` → none).
  There is nothing to stamp with a memo hash. If a memo is later written, it must
  be stamped with its SHA-256 **and** cite `C-1..C-15`, `P-1..P-4`, and the
  applicable `U-*` exclusions.
- **Reviewed extraction:** `CLAIMS.md` SHA-256
  `e0a6f130329d372c763a3bec3770d95ef7a18ddf13fd35fc3c8c67754842afd2`.
- **Reviewed run record:** `REDUCED-RUN.md` SHA-256
  `69d8e532a29cb5b2da2dfd5cff8e3645c10fcb3a6e4aff4991e645110a70e913`.
- **Reviewed data:** `raw.json` `75962457…ef37`; `env.json` `55b48d00…8c42`;
  harness `9c4a53f7…b10c`.
- **Delta-review trigger:** any edit to `CLAIMS.md`, `REDUCED-RUN.md`,
  `raw.json`, `env.json`, `harness/bench.mjs`, `PLAN.md`, or `PLAN-REVIEW-R2.md`,
  or any new timing/parity/memory artifact, requires a delta re-review with the
  changed claims, new hashes, and a new verdict before those results become
  user-facing. Rewriting `raw.json`/`env.json` to remove the stale "unreviewed"
  note is **not** allowed without delta review (F-5).
- This PASS applies only to the reduced record as hashed above. It does not
  extend to a future full run, a memo that adds claims, or any adoption.

---

## 6. Residual risks and non-blocking summary

1. **Single host / single runtime / three reps.** "Measured here on synthetic
   Node 22 integer microbenchmarks," never production or another runtime.
2. **Narrow semantic coverage.** 14 curated parity cases only; no C-core/C-zero/
   C-rand; D2's exactness beyond the table rests on code inspection, not
   measurement.
3. **Narrow workload.** Unique nonzero integers plus one duplicate at n ≤ 10k;
   no mixed L2, objects, memory, scaling, small-n, or real caller distribution.
4. **No CI/bootstrap** by explicit reduced scope. The ratios are orientation
   only; the D2 unique-5000 outlier shows why.
5. **Small-n timing floor.** The 0.059 ms n=1000 cell is close to timer/JIT
   overhead territory; no overhead control artifact exists.
6. **Reduced harness controls.** Mutant called directly, not through candidate
   resolution; D0 imported rather than a baseline copy; no command log or fit
   self-test. The production hash and R2 anchor were independently checked for
   this artifact, but the runtime anchor is not automated.
7. **No adoption.** The run record itself refuses adoption; this review agrees
   and makes no recommendation.

**Signed:** `results-reviewer-1` / `deepseek-flash` / `deepseek-official` —
2026-11-25T04:03:19Z.

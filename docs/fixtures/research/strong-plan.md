# PLAN — D0 control + approved D1–D4 (R2)

- **Status:** R2 experiment plan, **rev 2** (post-review). **No demos have been
  run and no results are claimed here.** Execution starts only after an
  independent re-review of this revision returns PASS. What changed, and where,
  is listed in `PLAN-REVISION.md`; the reviewed findings addressed here are
  `PLAN-REVIEW.md` P1-1, P1-2, P2-1, P2-2, P2-3.
- **Inputs:** `DECISION.md` (R0 frame), `DIRECTIONS.md` (R1; approved set D1, D2,
  D3, D4 + control D0), `docs/RESEARCH.md`, `AGENTS.md`, `README.md`, and the
  working-tree code read at R2.
- **Owner:** research lead writes this plan and the shared harness; experimenters
  run the directions; independent reviewers own `PLAN-REVIEW.md` /
  `RESULTS-REVIEW.md` and never edit experiments.
- **Decision rule:** research can return *candidate* implementations for a later
  Development change; it never edits `src/` and never marks adoption itself.

## 1. Environment and reproducibility facts (observed read-only at R2)

| Fact | Value |
|---|---|
| Enclosing repo / HEAD | `oiler-hub` @ `704a4f531b04d9da52575c5833090a6fbed24858` (observed read-only via `git rev-parse HEAD`) |
| Research worktree status | `oiler-hub/.tmp/headless-research` is **untracked and git-ignored** (parent `.git/info/exclude:12:/.tmp/`). `git ls-files` returns none of its files, and `git status --porcelain -- src test package.json` is empty **because the whole path is ignored, not because the files match HEAD**. The recorded commit does **not** contain this worktree's `src/`, `test/`, or research files. |
| Provenance | **File SHA-256 hashes recorded in `data/env.json`, not the commit**, identify the measured source, baseline copy, test, and manifest. The commit is context only. |
| Node / npm | v22.23.2 / 10.9.8 |
| OS / kernel | Linux (Ubuntu), `7.0.0-43-generic`, x86_64 |
| CPU / RAM | AMD Ryzen 9 9950X, 16 cores / 32 threads; 62,307,296 kB |
| Dependencies | none; `package.json` has no `dependencies`; **no lockfile** |
| Source baseline | `src/dedupe.js` (one named ESM export, 214 B), R2 SHA-256 `b54842d6b94c3aa602dbf5904a2d0883c9576460b8b778660f3c2491cf9e8850` |
| Test | `test/dedupe.test.mjs` (1 test, 2 assertions), R2 SHA-256 `9e8c8dc6446363dfdadc4bd89fc1d64c5ef71541ed4fbb64c4281fbcf22eae48` |
| Manifest | `package.json`, R2 SHA-256 `a770daf300e9e5e05bd6a1c01ba13a6bcb882ba4d815253648b3d83010f0ca89` |
| Build/lint/typecheck | not configured |
| Production-code state | Must remain byte-identical for the whole run. Enforced by the pre/post SHA-256 comparison in EXP-FIT (§4); `git status` is non-detecting here and is **not** the control. |

Reproduction manifest (`data/env.json`, written in R3 **before** any measurement):
the HEAD above, an explicit `worktree` field stating "untracked/ignored under
`.tmp/`; file hashes are provenance, not the commit", Node/npm versions,
`uname -a`, CPU model/cores, SHA-256 of `src/dedupe.js`, `test/dedupe.test.mjs`,
`package.json`, and `baseline/hasDuplicateSlow.mjs`, harness SHA-256, date, and
`os.loadavg()` at start/end. The baseline copy's hash must equal the
`src/dedupe.js` hash. There is no lockfile to hash, so `package.json` + the empty
dependency set is the dependency record. Measurements are *measured here* on this
dev desktop, not on an isolated benchmark host; the paired design and 20 % MDE are
the noise controls (§7, §9).

## 2. Selected directions, rationale, and kill criteria (recorded)

The user approved **D1, D2, D3, D4**; **D0** is the mandatory control; **D5 is not
approved** and gets no experiment (small-n data is collected only as a
non-gating observation for a possible later decision). The rationale bullets
below are inferred and were not captured in-session (G7); they are recorded here
for confirmation, not presented as the user's words.

| ID | Mechanism | Recorded rationale (inferred, pending confirmation) | Kill criteria (from DIRECTIONS, tightened) |
|---|---|---|---|
| D0 | keep nested `Object.is` scan | exact, allocation-free, trivial maintenance; may already be sufficient | not "killed"; retained if no candidate passes all gates |
| D1 | `Set` membership | README names it; one-pass, no API/dep change | any non-`±0` parity mismatch; M2 fail; M4 fail; **or** user confirms signed-zero distinction is contractual (default) |
| D2 | `Set` + signed-zero guard | exact-preserving version of the obvious fix | any parity mismatch; guard erases the M2 gain; M4 fail |
| D3 | `WeakSet` objects + per-type `Set`s | memory/GC fit for object-heavy input | any parity mismatch; no material latency/memory gain over D2 (within MDE); complexity without benefit |
| D4 | sort copy + adjacent `Object.is` | non-hash family; independent correctness cross-check | comparator inconsistency or input mutation; any M1 parity mismatch; **M2-D4 fail** (median S < 1.0 on L1 or L2, or dominated by the fastest exact-parity Set candidate by >20 %); M3 is reported but does **not** gate D4 |

Per-direction experiment tables are in §4. Each direction has exactly three
experiments (parity, latency/scaling, memory) plus the shared fit check, within
the R2 "1–3 timeboxed experiments" rule.

## 3. Assumptions and pending confirmations (do not silently change)

Global defaults stand unless the user answers before R3; answers are recorded at
the top of the memo. A material answer that changes the contract (A2) is a
direction/scope change and needs an explicit user decision.

| ID | Assumption | Default if silent | If changed |
|---|---|---|---|
| A1 (G1) | Real input sizes / call frequency unknown | primary n = 10,000; n = 1k/4k/16k for scaling; n = 10/50/500 as non-gating sensitivity | supplying a real distribution changes workloads and requires plan delta-review |
| A2 (G2) | Is `Object.is`'s `+0`/`-0` distinction contractual? | **yes — exact parity required**, so D1 alone is not adoptable | relaxing it makes D1's simpler code eligible; recorded before R3 |
| A3 | Public surface | named export, same argument/boolean return; drop-in source only | new API/async/stateful design is out of scope (D8/D11) |
| A4 | Runtime scope | Node 22.23.2 only; browser/bundler/other Node versions unproven | another runtime needs a new frame/slice |
| A5 | Dependencies/license | built-ins only; no new dependency, so no new license/CVE surface; repo license still unknown | any dependency is a constraint violation (D13) |
| A6 | Delivery | local-only; no commit/push/MR/deploy; production `src/`/`test/` read-only | not applicable in this run |
| A7 (G7) | Direction rationale | the inferred bullets above | user correction is recorded; it does not reopen the approved set by itself |
| A8 | Depth/timebox | standard depth, 20 min total, R3 ≤ 7 min | expiry stops work and reports "cannot conclude" |

## 4. Per-direction execution plan

Common rules for every experiment:

- Same generated inputs for baseline and candidate (seeds in §6); same Node
  binary/process flags; same machine, sequential execution; alternating order.
- Baseline is the verbatim `src/dedupe.js` copy in
  `baseline/hasDuplicateSlow.mjs`. Its SHA-256 must equal the `src/dedupe.js`
  hash recorded in `data/env.json`; any mismatch aborts R3 (EXP-FIT, §4).
- Candidate code lives only in `spikes/d<N>/dedupe.mjs`; it never imports
  production code at measurement time (so edits to `src/` cannot mask a change).
- Every run writes raw JSON before any aggregation; a failed/timed-out run stays
  in the artifacts and is reported, never silently dropped.

### D0 — control (baseline)

| Exp | Procedure | Falsifier / interpretation | Artifact |
|---|---|---|---|
| EXP-0a | (i) Hand-computed expected-result table for ≥10 curated cases (§6) run against the baseline copy and D0; (ii) deliberately wrong control `spikes/control-mutant/dedupe.mjs` (always returns `false`) loaded through the **same candidate-resolution path** as D1–D4 and run through the identical parity path | (i) any baseline/D0 disagreement with the hand-computed table ⇒ harness invalid, stop; (ii) the control must produce **≥1 mismatch** in `data/raw/parity-control.json`; 0 mismatches ⇒ the harness cannot detect an error ⇒ invalid, stop. D1's expected `±0` mismatch on C-zero is recorded as a second positive control | `data/raw/parity-d0.json`, `data/raw/parity-control.json` |
| EXP-0b | Latency/scaling on L1 (n = 10k; 1k/4k/16k) and L2 (n = 10k), 7 reps, 3 warmups; small n = 10/50/500 secondary | if baseline is already cheap enough and no candidate clears M2–M5, D0 retained; if a candidate clears them, that is the finding, not a baseline "failure" | `data/raw/bench-d0-*.json` |
| EXP-0c | Memory at 100k unique numbers (M-numbers), 1 run, 180 s cap | O(1) extra by construction; if the run times out, report "not measured at 100k" and treat the analytic O(1) claim as unmeasured | `data/raw/mem-d0-*.json` |

D0 is never dropped from a comparison. No synthetic "optimized baseline" (e.g.,
loops unrolled or special-cased) is allowed.

### D1 — `Set` (SameValueZero)

| Exp | Procedure | Falsifier / gate | Artifact |
|---|---|---|---|
| EXP-1a | Parity on curated C-core/C-zero + 10k seeded random arrays (§6) | fail on **any** mismatch in C-core outside the documented `+0`/`-0` class; C-zero mismatches allowed only as that class, and `parity-d1.json` must show ≥1 of them as the positive control; under A2 this disqualifies D1 from adoption (perf may still be measured as information) | `data/raw/parity-d1.json` |
| EXP-1b | L1 and L2 at n=10k, 7 reps/3 warmups; scaling on L1 at 1k/4k/16k; small-n secondary | M2 (≥2.0× and CI low >1.2) on **both** L1 and L2; M3 slope ≤1.5; **timed-cell result check is non-exempt**: L1 ⇒ `false`, L2 ⇒ `true` for every direction, and any disagreement (including a D1 `±0` early return) aborts the cell as harness-invalid before its timing is used | `data/raw/bench-d1-*.json` |
| EXP-1c | M-numbers at 100k | M4 (≤64 B/item, ΔRSS ≤128 MB) | `data/raw/mem-d1-*.json` |

### D2 — `Set` + explicit signed-zero guard

| Exp | Procedure | Falsifier / gate | Artifact |
|---|---|---|---|
| EXP-2a | Same parity corpus, plus explicit `[0,-0]`, `[-0,0]`, `[0,0]`, `[-0,-0]`, `[NaN,NaN]` | **zero mismatches anywhere**; any mismatch fails D2 | `data/raw/parity-d2.json` |
| EXP-2b | Same latency/scaling protocol as EXP-1b | M2 on L1 and L2; the guard's branch cost is inside the measurement (no separate micro-tuning); M3 ≤1.5 | `data/raw/bench-d2-*.json` |
| EXP-2c | M-numbers at 100k | M4 | `data/raw/mem-d2-*.json` |

### D3 — `WeakSet` objects + per-type `Set`s

| Exp | Procedure | Falsifier / gate | Artifact |
|---|---|---|---|
| EXP-3a | Parity corpus + object-heavy/mixed cases; `null`, functions, symbols, bigints routed as specified; `WeakSet` must never receive `null` | zero mismatches; a thrown `TypeError` is a failure | `data/raw/parity-d3.json` |
| EXP-3b | L1/L2 at n=10k (7 reps) plus **L3 object-only** at n=10k (3 reps, non-gating, because it is D3's object-heavy hypothesis) | M2 on L1 and L2; L3 reported separately and cannot by itself carry an adopt claim; M3 on L1 | `data/raw/bench-d3-*.json` |
| EXP-3c | M-numbers 100k **and** M-objects 100k (the latter required for the weak-memory hypothesis) | M4 on M-numbers; object result reported with its own measured number; "weak helps GC" is not claimed unless the measured delta supports it | `data/raw/mem-d3-*.json` |

### D4 — sort copy + adjacent `Object.is`

| Exp | Procedure | Falsifier / gate | Artifact |
|---|---|---|---|
| EXP-4a | Parity corpus + comparator property checks: `cmp(a,b)===0` ⇔ `Object.is(a,b)` on all pairs of a small adversarial set; antisymmetry; transitivity on all sampled triples from that set + 20k seeded random triples; holes/`undefined`, `±0`, `NaN`, mixed types, shared refs | any comparator inconsistency, throw, input mutation, or parity mismatch fails D4; a comparator that is merely "probably consistent" is not accepted | `data/raw/parity-d4.json` |
| EXP-4b | L1/L2 at n=10k, 7 reps; L3 optional if time; scaling on L1 (reported only) | **D4's single rule (M2-D4, §7):** PASS iff M1 exact AND, on **both** L1 and L2, median S ≥ 1.0 with 95 % CI low > 0.8 AND D4 is not dominated (`S_D4 ≥ S_bestSet/1.2`, where `bestSet` is the fastest exact-parity Set candidate measured in the same run); FAIL if M1 fails, median S < 1.0 on either workload, or dominated; otherwise CANNOT CONCLUDE. L2's duplicate sits at the end and the same input is used for all directions. M3 is reported but **does not gate D4**. | `data/raw/bench-d4-*.json` |
| EXP-4c | M-numbers and M-objects at 100k | M4 on M-numbers; report copy + identity-map cost; input must be unmutated (checked by hash) | `data/raw/mem-d4-*.json` |

### Shared fit check (EXP-FIT, applies to every direction)

Hash-based and two-phase; it applies to every direction.

1. **Before measurements (R3 start, before any parity/benchmark/memory run):**
   compute SHA-256 of `src/dedupe.js`, `test/dedupe.test.mjs`, `package.json`, and
   `baseline/hasDuplicateSlow.mjs`; record them in `data/env.json` and
   `data/prod-before.sha256`. `baseline/hasDuplicateSlow.mjs` must hash equal to
   `src/dedupe.js`; otherwise abort.
2. **After all measurements:** recompute the same four hashes and compare with
   `data/env.json` (`sha256sum -c data/prod-before.sha256`,
   `node harness/fit.mjs --env data/env.json`). Any mismatch means production or
   the baseline copy changed: **abort R3 and mark M5 FAIL**; do not aggregate or
   report the affected data.
3. **Detection self-test (before the run):** copy `baseline/hasDuplicateSlow.mjs`
   to a temp path, alter one byte, and confirm the same hash check reports a
   mismatch. Record `hashCheckSelfTest: "pass"` in `data/fit.json`; a check that
   misses the altered copy invalidates fit. No production file is touched.
4. Then run the existing suite unchanged (`node --test`) and the spike fit path
   (same single named export and boolean contract); the `package.json` hash covers
   the dependency set and no `node_modules`/network is used. Record diff size vs
   baseline as a non-gating maintainability observation.

`git status --porcelain -- src test package.json` is **not** evidence here: the
whole worktree is ignored/untracked (§1), so that command is empty regardless of
edits. It may be recorded only as a supplementary note labelled non-detecting.
Artifact: `data/env.json`, `data/prod-before.sha256`, `data/fit.json` + commands
in `data/COMMANDS.md`.

## 5. Experimental units and time budget

| Unit | Directions | Count | Budget |
|---|---|---|---|
| Parity (curated + 10k random arrays) + mutant control | D0–D4 + control-mutant | 6 runs | 35 s |
| Latency L1/L2 at 10k, 7 reps × 3 warmups | D0–D4 | 2 workloads × 7 reps × 5 dirs | 90 s |
| Scaling L1 at 1k/4k/16k, 7 reps | D0–D4 | 3 sizes × 7 × 5 | 60 s |
| Memory 100k M-numbers (+ M-objects for D3) | D0–D4 (+1) | 6 runs | 120 s |
| Small-n secondary 10/50/500, 3 reps | D0–D4 | 3 × 3 × 5 | 20 s |
| Fit/static checks | all | 1 | 20 s |
| Buffer/rerun-one-anomaly | — | — | 60 s |
| **R3 total** | | | **≈7 min** |

Total research timebox is 20 min per `DECISION.md` §6 (R2 plan+review 4 min, R3
7, R4 2, R5 2, R6 1). Budget is planned allocation, not elapsed time.

## 6. Workloads, corpora, and seeds

One shared generator (`harness/corpus.mjs`) with an inline mulberry32 PRNG — no
dependencies. Seeds are fixed before R3 and never tuned:

| Name | Construction | Use |
|---|---|---|
| C-core (curated) | ~40 hand-written arrays: empty/singleton, `NaN`/`NaN`, `±0` combos, mixed primitives, `undefined` vs hole, `null`, booleans, strings (literal + dynamically built), bigints, global/local symbols, same object ref, distinct equal-looking objects, functions, cross-type values, duplicate at first/middle/last | parity, all directions |
| C-zero (curated) | zero-focused subset: `[0,-0]`, `[-0,0]`, `[0,0]`, `[-0,-0]`, `[0,-0,0]`, `[NaN,NaN]` | parity classification; D1's only allowed divergence |
| C-rand | 10,000 arrays, lengths uniform 0–64, values drawn from a mixed pool containing `NaN`, `+0`, `-0`, `undefined`, `null`, booleans, strings, bigints, shared/local symbols, shared object refs; each case tagged `containsMixedSignZero` | parity |
| L1 | duplicate-free **zero-free** integers from the pinned pool (§6 below), n unique | primary latency + scaling; small-n secondary |
| L2 | mixed: ~50 % numbers from the same zero-free pool (unique), ~20 % strings, ~10 % booleans/null/undefined/bigint/symbol, ~20 % distinct object refs, with **exactly one duplicate pair at indices n−2, n−1** (same object reference); no `NaN`, no `+0`, no `-0` | primary latency; duplicate-present, found late |
| L3 | 100 % distinct objects (n refs) | D3 object-heavy latency (3 reps, non-gating) |
| M-numbers | 100k unique integers from the same zero-free pool (no `NaN`, no `±0`) | memory gate |
| M-objects | 100k distinct objects | D3 weak-memory hypothesis |

**Hand-computed expected-result table (≥10 cases; authoritative for the oracle):**

| Case | Input (type-tagged) | Expected `Object.is` result |
|---|---|---|
| E1 | `[NaN, NaN]` | `true` |
| E2 | `[0, -0]` | `false` |
| E3 | `[-0, 0]` | `false` |
| E4 | `[0, 0]` | `true` |
| E5 | `[-0, -0]` | `true` |
| E6 | `[1, 1]` | `true` |
| E7 | `[1, 2]` | `false` |
| E8 | `[undefined, undefined]` | `true` |
| E9 | `[ <hole>, <hole> ]` (two holes) | `true` (both read as `undefined`) |
| E10 | `[null, null]` | `true` |
| E11 | `['a', 'a']` | `true` |
| E12 | `[1, '1']` | `false` |
| E13 | `[obj, obj]` (same reference) | `true` |
| E14 | `[{}, {}]` (distinct objects) | `false` |

The table is stored in `harness/corpus.mjs` and in each parity artifact. Baseline
and D0 must match it exactly; D1's `true` on E2/E3 is its expected `±0` positive
control; D2/D3/D4 must match all 14. Any baseline/D0 disagreement is harness
invalid (§4 EXP-0a, §7 M1).

**Pinned numeric pool (all timed/memory numeric workloads):** values are unique
integers in `[1, 2^31−1]`, generated by the seeded PRNG with rejection of
repeats; `NaN`, `+0`, and `-0` are excluded by construction. L1 is fully unique.
L2 has exactly one duplicate pair (the same object reference) at n−2/n−1 and is
unique otherwise. M-numbers uses the same pool at n=100k. Mixed-sign zeros and
`NaN` live only in C-core/C-zero/C-rand and are **parity-only**. Each L1/L2/
M-numbers raw record stores `poolRule`, `plusZeroCount`, `minusZeroCount`,
`expectedResult`, `observedResult`, and `resultCheck`.

Fixed seeds: parity = `1337`, latency/memory = `424242`, comparator property
triples = `9001`. Each raw file records generator version, seed, n, workload, the
pool/zero audit, and a sampled input checksum (FNV-1a over type-tagged first/last
8 values plus seed/params) so input drift is detectable without storing 100k
values. Curated cases are stored verbatim (compact type-tagged repr) in
`harness/corpus.mjs` and in the parity artifact.

`NaN` and `±0` are deliberately absent from L1/L2/L3/M-number inputs: under
`Object.is`, `NaN`/`NaN` is already a duplicate, and `[0,-0]` is duplicate-free
under `Object.is` but duplicate under D1's SameValueZero `Set` — either would
trigger an early return / short scan. They remain covered in C-core/C-zero/C-rand
parity. L1 is duplicate-free, so every checking direction performs a full scan.
L2 has exactly one duplicate at the end, so an early-returning direction still
scans ~n, keeping the comparison honest against D4's always-full sort. At n=10k
the generator asserts `plusZeroCount === 0 && minusZeroCount === 0` for L1 and L2
before timing; D1 must return `false` on L1 and `true` on L2, and the raw file
records that check. There is **no `±0` exemption** in any timed cell.

## 7. Metrics, MDE, CI, and decision rules

Thresholds are frozen **before** R3; no post-hoc threshold changes. A result
below the MDE is "no material difference", not a win.

| ID | Metric | Estimator | Gate / decision rule | Noise / CI | Status |
|---|---|---|---|---|---|
| M1 | Semantic parity | Boolean output vs (a) the baseline copy and (b) the hand-computed expected table on C-core/C-zero/C-rand | **Harness validity first:** baseline and D0 must agree with the hand-computed table on all ≥10 table cases, and the always-false mutant control (§4 EXP-0a) must produce **≥1 mismatch** in `data/raw/parity-control.json`. **Then:** 0 mismatches in C-core and C-rand except the documented `±0` class; D2/D3/D4: 0 mismatches everywhere; D1: mismatches must be a subset of tagged mixed-sign-zero cases, and `parity-d1.json` must record ≥1 C-zero mismatch as a positive control; otherwise fail. This `±0` exemption is **parity-only**; timed cells use §8. Under A2 D1 is non-adoptable regardless | exact, no MDE | gating |
| M2 | Latency at n=10k (D1/D2/D3) | Per rep: `t_base/t_cand`; report median of 7 paired ratios, separate for L1 and L2 | PASS iff median **S ≥ 2.0** and 95 % bootstrap CI low **> 1.2** on **both** L1 and L2; FAIL if CI high < 2.0; otherwise CANNOT CONCLUDE | MDE **20 %** relative; 95 % percentile bootstrap, 10k resamples over 7 paired ratios; also report min/median/max/IQR | gating for D1/D2/D3; not applied to D4 |
| M2-D4 | D4 latency at n=10k | Per rep: `t_base/t_cand`; median S separately for L1/L2; dominance vs the fastest exact-parity Set candidate (D2 or D3) measured in the same run | **D4's single rule:** PASS iff M1 exact AND, on both L1 and L2, median S ≥ 1.0 with 95 % CI low > 0.8 AND not dominated (`S_D4 ≥ S_bestSet/1.2`). FAIL if M1 fails, median S < 1.0 on either workload, or dominated. Otherwise CANNOT CONCLUDE (including when no exact-parity Set reference is available). M3 does **not** gate D4 | MDE **20 %** relative; same bootstrap as M2; dominance uses the same 20 % MDE | gating (D4 only) |
| M3 | Empirical scaling | OLS slope of `log(median ms)` vs `log(n)` over n = 1k/4k/16k on L1 | Candidate PASS iff slope **≤ 1.5** and R² ≥ 0.98; baseline sanity: slope in **[1.7, 2.3]**, else harness invalid. **D4:** slope is reported but does not gate | slope uncertainty from rep bootstrap; design tolerance ±0.3 | gating for D1–D3; reported only for D4 |
| M4 | **Post-call** extra memory (lower bound on peak) | `--expose-gc`; `gc(); base=heapUsed/RSS; result=fn(input); after=heapUsed/RSS`; 3 candidate runs (baseline 1) | PASS iff **post-call** heap delta **≤ 64 B/item** and **post-call ΔRSS ≤ 128 MB** at n=100k. These are after-return snapshots and a **lower bound on peak**, not a peak measurement; "peak" must not be used as the measured quantity | 10 % of measured delta as resolution; single run for baseline (time-capped) | gating |
| M5 | Fit | Pre/post SHA-256 + static checks (EXP-FIT) | All must hold: post-run SHA-256 of `src/dedupe.js`, `test/dedupe.test.mjs`, `package.json`, and `baseline/hasDuplicateSlow.mjs` equal the pre-run values in `data/env.json` (any mismatch ⇒ R3 abort); baseline hash equals `src` hash; hash self-test passed; named export/boolean contract unchanged; existing `node --test` green; no new deps/network. `git status` is non-detecting here and is **not** evidence | exact | gating |
| S1 | Small-n sensitivity | L1 at n = 10/50/500, 3 reps | Report only; used to inform a possible later D5 decision; **no D5 recommendation** | 20 % MDE; 3 reps ⇒ wide CI, labelled exploratory | non-gating |
| S2 | Object-heavy | L3 at n=10k, 3 reps | Report separately; cannot alone support D3 adoption | exploratory | non-gating |
| S3 | Maintainability proxy | Added/changed lines vs baseline; branch count | Report only | exact diff | non-gating |

Metric precedence: this plan operationalizes the R0 `DECISION.md` / R1
`DIRECTIONS.md` thresholds. In particular, M2-D4 is D4's only latency gate and
M4 is named **post-call** (not "peak") because only after-return snapshots are
taken; where wording differs, this plan is authoritative for R3.

Interpretation rules:

- **PASS** means the measured evidence meets the pre-declared gate on this
  synthetic slice; it supports a *candidate*, not production adoption.
- **FAIL** is a direction-level result at this slice (kill criterion met).
- **CANNOT CONCLUDE** is used when the CI spans 1.2 or 2.0, R²/behaviour is
  unstable, the timebox expires, the baseline sanity check fails, or the D4
  dominance reference is unavailable. It is never reported as a win.
- **Direction applicability:** D1/D2/D3 use M2 (≥2.0×); D4 uses **M2-D4** only
  (§7). Every direction uses M1 and M4. M3 gates D1–D3 and is report-only for D4.
- **Memory wording:** M4 evidence is post-call heap delta / post-call ΔRSS, a
  lower bound on peak. Claims must say "post-call"; "peak memory", "peak ΔRSS",
  or "maximum memory" must not be used as measured claims.
- If no candidate passes M1–M5 (with M2-D4 for D4), the evidence supports keeping
  D0.
- If more than one passes, R4 reports all; no hidden winner selection. Any
  ranking is transparent (lower-CI speedup first, then memory, then diff size)
  and is a recommendation for the user, not an adoption.

## 8. Runs, warmup, pairing, order, timing, and memory protocol

**Latency/scaling (per direction × workload × n):**

1. Parent orchestrator spawns a **fresh Node process** per timed run (no shared
   JIT/GC between reps).
2. Each child generates its input from seed, performs **3 untimed warmup calls**
   at the same n, then times a small inner batch with
   `process.hrtime.bigint()` around the call only: 5 inner iterations for
   n ≤ 16k; the child reports per-call ns and the inner median. (Warmup/batch
   tuning is identical for baseline and candidates.)
3. **7 reps** per cell, alternating order: even rep D0→D4, odd rep D4→D0, so
   machine drift is shared. Reps are emitted individually, never pre-averaged.
4. Timer stops before any aggregation/JSON writing; process startup, input
   generation, and checksumming are outside the timed region (reported separately
   as generator time).
5. The result boolean feeds a printed checksum/sink so dead-code elimination
   cannot remove the call. The timed cell declares `expectedResult` **before**
   timing: `false` on L1 and `true` on L2. Every direction must match it; **any
   disagreement aborts the cell as harness-invalid** and the cell is retained and
   flagged, never averaged. There is **no `±0` exemption** in timed cells (that
   class is parity-only, §6/§7).
6. Raw record per rep: direction, workload, n, rep index, order position,
   ns times, inner median, result, `expectedResult`, `resultCheck`
   (`pass`/`fail`), `plusZeroCount`, `minusZeroCount`, `poolRule`, seed, input
   checksum, loadavg, Node version, child exit code. A timed-out/crashed rep is
   retained and flagged.

**Memory (per direction × corpus):**

1. `node --expose-gc harness/mem.mjs …`, fresh process, 512 MB heap cap,
   external `timeout` 180 s.
2. `gc()` twice, snapshot `heapUsed`/`rss`; generate input; snapshot again (input
   accounted separately); call the direction once; immediately snapshot
   `heapUsed`/`rss` before any GC (the local Set/copy is still reachable-in-heap
   and not yet collected); optionally sample `process.memoryUsage().rss` right
   after return.
3. Deltas = after − input-baseline; B/item = heap delta / n. Candidate cells get
   3 runs; report max heap delta and max RSS delta. Baseline gets 1 run (its
   O(n²) scan at 100k is slow); if it exceeds 180 s, record the timeout and
   report baseline memory at 100k as unmeasured with the analytic O(1) bound.
4. Explicitly document that the post-call delta is a **lower bound** on peak
   memory (no in-call sampling) and that ΔRSS is page-granular (§9). The measured
   quantities are named **"post-call heap delta"** and **"post-call ΔRSS"**;
   "peak" is not the measured quantity and must not appear as one.

**Order of experiments:** baseline copy + hash check → env manifest (incl. the
four production/baseline hashes) → hash self-test → parity (incl. mutant
control) → 10k latency → scaling → memory → small-n/L3 secondaries → post-run
hash check + fit checks. If the timebox is at risk, the fallback ladder in §11 is
applied in order and every deviation is listed in `EVIDENCE-MATRIX.md`
limitations.

## 9. Harness validity (what makes these numbers credible)

| Threat | Control |
|---|---|
| Wrong oracle / vacuous parity | Oracle is a byte-identical copy of `src/dedupe.js` (SHA-256 checked against `data/env.json`); baseline and D0 must agree with a hand-computed expected table (≥10 cases); an always-false mutant control must produce **≥1 mismatch** in `parity-control.json`; D1's expected `±0` mismatch is a second positive control; no reimplementation of the baseline |
| DCE / skipped work | Result used in a printed checksum; the timed cell declares `expectedResult` (`false` on L1, `true` on L2) and **every** direction must match it; any disagreement aborts the cell (no `±0` exemption); zero-free L1 forces a full scan |
| JIT/GC cross-contamination | Fresh process per timed rep; identical 3-warmup protocol; `--expose-gc`/explicit GC only in the memory harness |
| Machine drift | Paired per-rep ratios + alternating direction order; median-of-ratios (not ratio-of-medians); loadavg recorded and cells flagged if the machine is busy |
| Noise / insufficient reps | 20 % MDE, 95 % bootstrap CI over 7 reps, raw rep values retained; CI overlap ⇒ CANNOT CONCLUDE |
| Hiding the asymptote | M3 fitted on 3 sizes with R² ≥ 0.98 and a baseline sanity slope in [1.7, 2.3]; if baseline does not look quadratic, the harness/inputs are treated as invalid; D4's slope is report-only |
| Early-exit bias | L2's single duplicate is placed at the end; L1 is zero-free and duplicate-free; timed-cell result checks are non-exempt; D4's full-sort disadvantage is measured, not engineered away |
| Comparator bug (D4) | Pairwise `cmp==0 ⇔ Object.is` over an adversarial set, antisymmetry, transitivity over all sampled triples + 20k random triples; input-mutation hash check |
| Memory not captured | **Post-call** heap/ΔRSS deltas are a lower bound on peak; metric is explicitly "post-call"; 3 candidate runs with max; single baseline run with timeout disclosure; no "peak" claim |
| Timer overhead | Process startup/generation excluded; harness no-op overhead measured once and required to be < 5 % of the smallest gated cell's time; generator time reported separately |
| Workload drift | Fixed seeds + generator version + pool/zero audit + sampled input checksum in every raw file; curated cases stored in the harness |
| Fit masked by edits | Candidates live in `spikes/`, not `src/`; pre/post SHA-256 of production + baseline files is compared and a mismatch aborts R3/M5; the hash check is self-tested on an altered temp copy. `git status` is non-detecting in this untracked/ignored worktree and is not evidence |

Known validity limits to carry into the memo: single host, single Node version,
no CPU pinning/governor control, 7 reps (wide CI), post-call (not peak) heap
sampling, and synthetic distributions (no real caller data). These limit wording
to "measured here on synthetic Node 22 microbenchmarks", not production claims.

## 10. Representative slice and exclusions

**Entry points (the only two that exist in this repo):**

1. Direct ESM import and call of the named export — the primary slice.
2. The existing `node --test` suite — covered by a spike-local equivalent test
   that imports the candidate via an env-selected path; the production test file
   itself is never modified and is rerun unchanged for M5.

There is no build, no second production caller, no data file, and no package
consumer in the repo. The slice therefore exercises the function in isolation
under the project's real runtime and test command.

**Inclusions:** the real baseline source and test command; both supported call
paths above; mixed primitive/object/reference edge cases; n up to 100k for
memory and 16k for scaling; the project's actual Node version and machine.

**Exclusions — results must not imply these:**

- browser, bundler, Deno/Bun, or Node versions other than 22.23.2;
- TypeScript declarations, package exports/bundling, tree-shaking;
- real production data distributions, call frequency, concurrency, or callers;
- long-running retention/leaks (the memory test is a single-call delta);
- CPU pinning, turbo/governor, NUMA, or an isolated benchmark host;
- deployment, rollback, ops, or security review (no migration exists);
- D5 and D6–D13 (not approved; no demos);
- peak in-call memory: M4 measures **post-call** heap/ΔRSS deltas only, a lower
  bound on peak;
- the hypothesis that D3's local `WeakSet` reduces GC pressure (measured, not
  assumed).

## 11. Stop rules, timebox, abort conditions

**Per-experiment stop:** a direction stops its gated experiments on a parity
failure (M1), a timed-cell result mismatch (L1 ≠ `false` or L2 ≠ `true`), a
throw/crash in 2 consecutive reps, or a memory cell exceeding the 180 s cap (the
cell is recorded as timed out, not deleted). A harness-invalid signal (baseline
slope outside [1.7, 2.3], timed-cell result mismatch, parity-control mismatch
count of 0, baseline/D0 disagreement with the hand-computed table, oracle or
baseline hash drift, hash-self-test failure) stops R3; fix the harness and rerun
the affected cells, or report CANNOT CONCLUDE if the timebox does not allow it.

**Timebox expiry:** at 20 min total (R3 at 7 min), stop, report all completed
cells + partial raw data, mark unfinished cells "not measured", and return
CANNOT CONCLUDE. The user decides whether to extend.

**Fallback ladder when R3 is at risk (in order; each applied step is recorded as
a limitation, never silent):**

1. Drop L3 and small-n secondaries (S1/S2).
2. Drop the n=16k scaling point (use 1k/4k; slope marked limited).
3. Reduce reps 7 → 5 (CI still reported; "fewer reps than planned").
4. Reduce warmups 3 → 1 (JIT risk recorded).
5. Baseline memory at 100k timeout → measure baseline at 32k and mark the 100k
   baseline value unmeasured (candidates still gated at 100k).

Never: drop the parity experiment, drop the baseline, loosen a threshold after
seeing data, or remove a failed run.

**Abort conditions:** any SHA-256 mismatch for `src/dedupe.js`,
`test/dedupe.test.mjs`, `package.json`, or `baseline/hasDuplicateSlow.mjs`
versus `data/env.json` (production or baseline files changed); any need for a new
dependency, network call, credential, or secret; non-deterministic inputs that
cannot be seeded; environment mismatch severe enough to invalidate pairing
(e.g., Node version change mid-run). Abort means stop and report, not improvise.

## 12. Artifacts, commands, retention, cleanup

Planned tree (all under `docs/research/e2e/`; production untouched):

```text
PLAN.md                     this file (R2, rev 2)
PLAN-REVISION.md            rev 2 change log (post-review)
PLAN-REVIEW.md              independent reviewer only (R2 gate)
baseline/hasDuplicateSlow.mjs   verbatim copy + BASELINE.sha256
harness/{corpus.mjs, parity.mjs, bench.mjs, run-latency.mjs,
         mem.mjs, one-run.mjs, env.mjs, fit.mjs, existing.test.mjs,
         run-all.mjs}
spikes/d0..d4/dedupe.mjs + NOTES.md
spikes/control-mutant/dedupe.mjs   deliberately wrong parity control (always false)
data/env.json               environment + four production/baseline SHA-256 values
data/prod-before.sha256     pre-run sha256sum file for the same four files
data/COMMANDS.md            exact commands, exit codes, timestamps
data/raw/parity-<d>.json
data/raw/parity-control.json
data/raw/bench-<d>-<L1|L2|L3>-n<size>.json
data/raw/mem-<d>-<M-numbers|M-objects>.json
data/fit.json
data/fit-self-test.json     hash-check positive self-test (altered temp copy)
data/checksums.sha256
EVIDENCE-MATRIX.md CLAIMS.md RESULTS-REVIEW.md REVIEW-LOG.md memo.md   (R4–R6)
```

Commands to be executed at R3 (design; not run while writing this plan):

```bash
# 0. create the verbatim baseline copy (production is not modified)
cp src/dedupe.js baseline/hasDuplicateSlow.mjs

# 1. before any measurement: record provenance + pre-run hashes
node harness/env.mjs --out data/env.json --checksums data/prod-before.sha256
#    env.json records HEAD, the untracked/ignored-worktree statement, and the
#    four SHA-256 values; the baseline copy must hash equal to src/dedupe.js.
node harness/fit.mjs --self-test --out data/fit-self-test.json
#    alters a temp copy by one byte and must report a mismatch; no src edit

# 2. parity (expected table + mutant control are harness validity)
node harness/parity.mjs --direction d0 --seed 1337 --out data/raw/parity-d0.json
node harness/parity.mjs --direction control-mutant --seed 1337 \
  --out data/raw/parity-control.json     # must show >=1 mismatch
node harness/parity.mjs --direction d1 --seed 1337 --out data/raw/parity-d1.json

# 3. timed cells (L1 expected false, L2 expected true; no ±0 exemption)
node harness/run-latency.mjs --directions d0,d1,d2,d3,d4 --workloads L1,L2 \
  --sizes 10000 --reps 7 --warmup 3 --seed 424242 --out data/raw/
node harness/run-latency.mjs --directions d0,d1,d2,d3,d4 --workloads L1 \
  --sizes 1000,4000,16000 --reps 7 --warmup 3 --seed 424242 --out data/raw/
node --expose-gc harness/mem.mjs --direction d2 --corpus M-numbers --n 100000 \
  --runs 3 --out data/raw/mem-d2-M-numbers.json
node harness/run-smalln.mjs --sizes 10,50,500 --reps 3 --seed 424242   # S1
node harness/run-objectheavy.mjs --n 10000 --reps 3                    # S2

# 4. after all measurements: fit (hash self-test + pre/post comparison)
sha256sum -c data/prod-before.sha256          # all four lines must print OK
node harness/fit.mjs --env data/env.json --out data/fit.json  # non-zero exit on mismatch
DEDUPE_IMPL=spikes/d1/dedupe.mjs node --test harness/existing.test.mjs # fit path
node --test                                                            # production suite
# git status is deliberately NOT used as evidence: the worktree is ignored.
```

Write scopes: lead owns `baseline/`, `harness/`, `spikes/control-mutant/`,
`data/env.json`, `data/prod-before.sha256`, `data/COMMANDS.md`; each experimenter
owns only `spikes/d<N>/` and its `data/raw/` files (disjoint); reviewers write
only their review files. Harness is created and hashed once before fan-out;
changing it after measurements requires a full rerun and a delta-review note.

Retention: keep all raw JSON, logs, commands, checksums, and failed/timed-out
records for the results review and memo hash. Only transient processes/temp
files are cleaned; no `node_modules`, no cached benchmark binaries, no network
artifacts. Raw sizes are kept small via seeds + sampled checksums (curated cases
are stored; random arrays are regenerated, not dumped).

## 13. Risk, license, safety, and cost

- **Dependencies/license/CVE:** none; built-ins only; no install/network. No new
  license/CVE surface. The repository has no `LICENSE` and no `engines` field
  (existing condition, out of scope here); if adoption is later considered,
  Development must resolve license/engines before shipping.
- **Data/security:** synthetic values only; no PII, credentials, secrets, or
  untrusted code execution; no telemetry. Object/symbol identity only.
- **Sandbox:** writes confined to `docs/research/e2e/`; production `src/`/`test/`
  read-only; local-only, no commit/push/MR/deploy.
- **Resource limits:** sequential runs, 512 MB heap cap per child, 180 s timeout
  per memory run, no parallel benchmarking.
- **Ops/migration/rollback:** none in research. A future adoption is a
  single-function source replacement with no data/schema change; rollback is
  reverting that function; D4 would add a copy/sort allocation and D1 would
  change `±0` behavior (a semantic change requiring a Development contract).
- **Residual risk:** synthetic workload may not represent real callers (G1);
  `±0` contract may be answered differently (G2); dev-desktop noise; D4
  comparator correctness is the main implementation risk (G3); D3's weak-memory
  premise may not materialize (G4).

## 14. Reviewability and anticipated claims

Assumptions and open questions are exposed in §3; every experiment has a
falsifier, an artifact, and a decision rule; commands are explicit and use only
existing runtime/tools. Anticipated claim IDs (to be extracted from raw data,
then verified by the independent results reviewer; none asserted now):

| Claim ID | Anticipated claim | Evidence artifacts |
|---|---|---|
| CLM-0 | D0 baseline latency/scaling/memory on the slice | `bench-d0-*`, `mem-d0-*` |
| CLM-1 | D1 parity class + speedup/scaling/memory | `parity-d1`, `bench-d1-*`, `mem-d1-*` |
| CLM-2 | D2 exact parity + speedup/scaling/memory | `parity-d2`, `bench-d2-*`, `mem-d2-*` |
| CLM-3 | D3 exact parity + speedup/scaling/memory (incl. object-heavy) | `parity-d3`, `bench-d3-*`, `mem-d3-*` |
| CLM-4 | D4 comparator validity + parity + M2-D4 speedup/scaling/memory | `parity-d4`, `bench-d4-*`, `mem-d4-*` |
| CLM-5 | Fit: production unchanged (**pre/post SHA-256 equal**), baseline copy matches `src`, export/test/deps intact | `data/env.json`, `data/prod-before.sha256`, `data/fit.json`, `COMMANDS.md` |
| CLM-6 | "Cannot conclude" cells and slice exclusions | raw JSON + §10 |
| CLM-7 | Parity harness validity: hand-computed table agreement + mutant control detected (≥1 mismatch) + D1 `±0` positive control | `parity-d0.json`, `parity-control.json`, `parity-d1.json`, `fit.json` |

The CLM-7 control result (mutation caught, expected table agreed) is a required row
in `EVIDENCE-MATRIX.md`; a missing or zero-mismatch control means M1 is not valid.

Allowed-wording rule for R6: only claims marked `supported` by the results
review may appear in the memo; performance claims are "measured here on synthetic
Node 22 workloads at the stated n", never "production", "browser", or "all Node
versions". M4 memory claims must say **"post-call heap delta / post-call ΔRSS
(lower bound on peak)"**; "peak memory", "peak ΔRSS", and "maximum memory" are
forbidden as measured claims. D4's performance claim uses **M2-D4**, not M2.
Parity claims may cite the control artifacts only when the mutant control is
detected and the expected table agrees. Any `partial` claim cannot support
adopt/migrate. The memo is stamped with its SHA-256 and claim IDs; wording changes
require delta review.

Plan-review gate (for the independent reviewer, not self-scored here): every
area at/above floor, total ≥ 80, no P0/P1, ≤ 3 unresolved P2, per
`docs/RESEARCH.md` and `rd-workflow-research-review`. No demo starts on REVISE.

## 15. Plan status

Written at R2 and revised to **rev 2** after the independent plan review, without
running any demo or benchmark. The change log is `PLAN-REVISION.md`. The next
action is an independent re-review of this revision; R3 starts only after PASS.
No measurements, comparisons, or recommendations are asserted in this document.

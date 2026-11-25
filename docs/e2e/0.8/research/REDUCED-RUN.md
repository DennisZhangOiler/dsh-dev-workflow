# REDUCED R3 E2E — D0 baseline vs D2 exact-parity Set

**Status:** user-directed **reduced** R3 run record. This is **not** the full R3
study, **not** `RESULTS-REVIEW.md`, and **not** `memo.md`. No results review or
memo was written. All numbers below are **unreviewed descriptive measurements**
from one local run; no adoption recommendation or decision is made here.

- **Run date (UTC):** 2026-11-25T04:00:08Z → 2026-11-25T04:00:09Z (~0.97 s)
- **Scope:** D0 baseline vs D2 only; n = 1000 / 5000 / 10000 fixed unique
  nonzero integer arrays, plus one duplicate-pair case at n = 10000.
- **Plan context:** `PLAN-REVIEW-R2.md` returned PASS for the **full**
  `PLAN.md` (D0–D4). That PASS covers the full plan; this reduced subset was
  requested separately and does not validate any omitted cell or inherit
  validity for cells not run.

## 1. What was and was not executed

| Item | Reduced run | Full `PLAN.md` |
|---|---|---|
| Directions | **D0 + D2 only** | D0–D4 |
| Workloads | unique nonzero integer arrays n = 1000/5000/10000; one duplicate pair at n = 10000 | curated + 10k random parity, L1/L2/L3, scaling 1k/4k/16k, memory 100k, small-n |
| Reps / warmups | **3 timed reps / 3 warmups per cell** | 7 reps / 3 warmups |
| Fresh process per timed rep | **yes** (one timed call per child) | yes (5 inner iterations for n ≤ 16k) |
| Metric | **median of 3 per-rep ms** | M2/M2-D4/M3/M4 gates |
| Correctness | 14-case `Object.is` table, always-false mutant control, per-cell expected-result check, input audit | same plus 10k random parity, comparator property checks, D1 `±0` positive control |
| Memory / scaling / L2 / L3 / small-n | **not measured** | required |
| Results review / memo | **not written (per instruction)** | R5/R6 |

This is a user-directed **reduced E2E**, not a reduced-scope plan re-review. The
full-plan gate remains the R2 PASS; no claim is made that this run satisfies the
full plan's M2/M3/M4 gates.

## 2. Environment and provenance

| Fact | Value |
|---|---|
| Repo / HEAD | `oiler-hub` @ `704a4f531b04d9da52575c5833090a6fbed24858` |
| Worktree | untracked/ignored under `.tmp/`; file SHA-256 is the provenance, not the commit |
| Node / npm | v22.23.2 / 10.9.8 |
| OS / kernel | Linux (Ubuntu) `7.0.0-43-generic`, x86_64 |
| CPU / logical CPUs | AMD Ryzen 9 9950X 16-Core Processor / 32 |
| RAM | 62,307,296 kB |
| Loadavg (start / end) | 0.06, 0.13, 0.37 / 0.06, 0.13, 0.37 |
| Dependencies | none; built-ins only; no `node_modules`, no network |
| Harness SHA-256 | `9c4a53f74bfaa004321d371de3d925cdcd53ef78c7837166cd154ffbaeefb10c` |
| `data/env.json` SHA-256 | `55b48d00e2ca202550921b2c10d1dcc494bc8375a02ccd8bbaa4545eac5d8c42` |
| `data/raw.json` SHA-256 | `7596245760943adf01e073701376d02672971c26d47ec330e997d484ba07ef37` |

Production hashes were captured **before and after** all measurements and are
byte-identical, matching the R2 values in `PLAN.md` §1:

| File | SHA-256 (before = after) |
|---|---|
| `src/dedupe.js` | `b54842d6b94c3aa602dbf5904a2d0883c9576460b8b778660f3c2491cf9e8850` |
| `test/dedupe.test.mjs` | `9e8c8dc6446363dfdadc4bd89fc1d64c5ef71541ed4fbb64c4281fbcf22eae48` |
| `package.json` | `a770daf300e9e5e05bd6a1c01ba13a6bcb882ba4d815253648b3d83010f0ca89` |

`productionUnchanged: true` in both `data/env.json` and `data/raw.json`.
`git status --porcelain -- src test package.json` is empty but, as the plan
notes, is non-detecting in this ignored worktree; the hashes are the control.

## 3. Protocol

- **D0:** the real production `hasDuplicateSlow`, imported read-only from
  `src/dedupe.js` (nested `Object.is` scan; O(n²)).
- **D2:** `Set` membership plus explicit `plusZeroSeen` / `minusZeroSeen`
  guard; zeros never enter the `Set`. Implemented inline in
  `harness/bench.mjs` (deviation from the full plan's `spikes/d2/`).
- **Inputs:** deterministic `mulberry32` PRNG + `Set` rejection, unique integers
  in `[1, 2^31−1]`, no `NaN`, no `+0`, no `−0`. Seed `424242` for the unique
  workloads; seed `424243` for the duplicate case. Each array's SHA-256 is
  recorded in `data/raw.json`; each child reproduces the parent's checksum.
- **Duplicate case:** n = 10000, unique otherwise, with the last value set equal
  to the previous one, so the single duplicate pair is at indices **9998/9999**
  (found late, not at the start).
- **Timing:** one fresh Node child process per timed run; 3 untimed warmup
  calls, then one call timed with `process.hrtime.bigint()` around the call only
  (input generation and checksums outside the timed region). 3 timed reps per
  direction × workload; order alternates per rep (D0→D2, D2→D0, D0→D2).
  Reported statistic is the **median of the 3 per-rep milliseconds**.
- **Correctness path:** hand-computed 14-case `Object.is` table from
  `PLAN.md` §6 (E1–E14), an always-false mutant positive control, and a
  per-timed-run expected-result check (unique ⇒ `false`, duplicate ⇒ `true`).
- Reproduce with `node docs/research/e2e/harness/bench.mjs` (writes both JSON
  artifacts; exits 0 iff all validity checks pass). Re-running overwrites the
  artifacts with new timings.

## 4. Workload audit

All arrays passed the generator's checks: zero `+0`, zero `−0`, zero `NaN`, all
integers, and the expected uniqueness/duplicate shape.

| Workload | n | kind | distinct values | duplicate count | duplicate indices | expected result | input SHA-256 (first 12) |
|---|---:|---|---:|---:|---|---|---|
| `unique-1000` | 1000 | unique | 1000 | 0 | — | `false` | `b42a6404a010` |
| `unique-5000` | 5000 | unique | 5000 | 0 | — | `false` | `390ae469011e` |
| `unique-10000` | 10000 | unique | 10000 | 0 | — | `false` | `366124feee7a` |
| `duplicate-10000` | 10000 | duplicate | 9999 | 1 | `[9998, 9999]` | `true` | `d7f9b61aeb56` |

## 5. Correctness and harness-validity evidence

| Check | Result |
|---|---|
| D0 vs hand-computed 14-case table | **14/14 match** |
| D2 vs hand-computed 14-case table | **14/14 match** |
| Always-false mutant control | **detected**: 9 table mismatches (`E1, E4, E5, E6, E8, E9, E10, E11, E13`) + wrong result on the duplicate workload |
| Timed runs with expected result | **24/24 pass** |
| Child exit codes | all `0` |
| Child input checksum/audit vs parent | all match |
| Existing production suite (`node --test`) | **exit 0**, `# tests 1`, `# pass 1`, `# fail 0` |
| Production files unchanged (SHA-256 before/after) | **yes** |
| Overall `harnessValid` | **true** |

The table covers `NaN`, `+0`/`−0` both orders and same-sign repeats, holes,
`undefined`, `null`, strings, mixed types, same-reference objects, and distinct
equal-looking objects. Timed integer workloads deliberately contain no `NaN` or
`±0`; those classes are covered by the table only.

## 6. Observed timings (descriptive, unreviewed)

Median of 3 timed reps, per direction × workload, milliseconds:

| Workload | n | D0 median ms | D2 median ms | D0 / D2 (descriptive ratio) |
|---|---:|---:|---:|---:|
| `unique-1000` | 1000 | 0.1692 | 0.0592 | 2.86× |
| `unique-5000` | 5000 | 3.4309 | 0.1534 | 22.37× |
| `unique-10000` | 10000 | 13.8439 | 0.3230 | 42.86× |
| `duplicate-10000` | 10000 | 13.8176 | 0.3231 | 42.77× |

Raw per-rep milliseconds (retained in full, no rep dropped or replaced):

| Workload | Direction | rep 1 | rep 2 | rep 3 | median |
|---|---|---:|---:|---:|---:|
| `unique-1000` | D0 | 0.1692 | 0.1540 | 0.1702 | 0.1692 |
| `unique-1000` | D2 | 0.0591 | 0.0592 | 0.0620 | 0.0592 |
| `unique-5000` | D0 | 3.4282 | 3.8792 | 3.4309 | 3.4309 |
| `unique-5000` | D2 | 0.1534 | 0.4073 | 0.1441 | 0.1534 |
| `unique-10000` | D0 | 13.7851 | 14.5732 | 13.8439 | 13.8439 |
| `unique-10000` | D2 | 0.3038 | 0.3230 | 0.3379 | 0.3230 |
| `duplicate-10000` | D0 | 13.8191 | 13.8174 | 13.8176 | 13.8176 |
| `duplicate-10000` | D2 | 0.3231 | 0.3161 | 0.3438 | 0.3231 |

Notes:

- The D2 `unique-5000` rep-2 value (0.4073 ms) is a visible outlier; it is
  **retained** and the median is used. No rerun or rep replacement was done.
- The duplicate-pair case is detected only after scanning to the end by both
  directions; its medians are practically the same as the unique n = 10000 cell.
- The ratio column is arithmetic on the medians for orientation only. It is
  **not** an M2/M2-D4 result: there is no 7-rep bootstrap CI, no L2 mixed
  workload, and no MDE gate applied in this reduced run.

## 7. What cannot be concluded (limits)

- **No adoption recommendation or decision.** This run was not results-reviewed
  and no memo was written. D2 is not declared adoptable, and D0 is not declared
  superseded.
- **No D1/D3/D4 evidence.** Their parity, latency, scaling, memory, comparator,
  and object-heavy behavior were not measured.
- **No full-plan gate.** M2's ≥2× with 95 % CI low > 1.2 on L1/L2, M3's slope
  gate, M4's post-call memory gate, the 10k random parity corpus, the always-false
  mutant-through-candidate-resolution path, and D1's `±0` positive control were
  not executed.
- **No memory or scaling inference.** Only three input sizes of one integer
  distribution are timed; no log–log fit, no 100k memory cell, no L2/L3, no
  small-n sensitivity.
- **Narrow data distribution.** Timed results are synthetic, fixed, unique,
  nonzero integers plus one duplicate pair. They say nothing about mixed
  primitives, object-heavy inputs, real caller data, or call frequency.
- **Single host, single runtime, 3 reps.** One dev desktop, Node 22.23.2 only,
  no CPU pinning/governor/NUMA control, no isolated benchmark host, and wide
  uncertainty from 3 reps. Results are "measured here", not production, browser,
  other Node versions, or end-to-end workloads.
- **The plan-review PASS is not extended.** Omitted cells remain unproven; this
  document only records what was actually run.

## 8. Artifacts

| Path | Role |
|---|---|
| `docs/research/e2e/harness/bench.mjs` | reduced R3 harness (D0 import, D2 inline, orchestration, correctness, hashes) |
| `docs/research/e2e/data/env.json` | environment, protocol, pre/post production hashes, deviations |
| `docs/research/e2e/data/raw.json` | workload audits, 14-case parity, mutant control, 24 raw runs, cell medians, suite result, validity checks |
| `docs/research/e2e/REDUCED-RUN.md` | this run record |

Production `src/`, `test/`, and `package.json` were not modified. No commit,
push, MR, deploy, results review, or memo was produced.

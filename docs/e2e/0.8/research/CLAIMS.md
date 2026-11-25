# CLAIMS — independent extraction from the reduced E2E raw data

**Status:** independent results-review extraction, written **before** any memo was
read or written. No `memo.md` exists in this workspace at extraction time (glob
`**/memo*.md` → none). This file is the reviewer's own claim list from
`data/raw.json` and `data/env.json`; it is not the run record and does not
recommend adoption.

- **Reviewer:** `results-reviewer-1` / `deepseek-flash` / `deepseek-official`
- **Time (UTC):** 2026-11-25T04:03:00Z (extraction written before the results review)
- **Inputs, in this order:** `PLAN.md`, `PLAN-REVIEW-R2.md`, `REDUCED-RUN.md`,
  `data/raw.json`, `data/env.json`
- **Concatenated input SHA-256:** `e76b8196d0782f3d541d57e6d6ea6230ee8571b312a3eeaf4def966ce9f02a5e`
  (150,718 bytes, concatenated in the order above; per-file hashes below)
- **Per-file SHA-256:**
  - `PLAN.md` `7976d59fc308871863cec7ca5cf94f5599b59ce10ec8a017d37aa08005fe2eab`
  - `PLAN-REVIEW-R2.md` `685f5d620aeff9aa9df400589d4b04f6b507f7a656cf9a7f7439c87790d8b2e7`
  - `REDUCED-RUN.md` `69d8e532a29cb5b2da2dfd5cff8e3645c10fcb3a6e4aff4991e645110a70e913`
  - `data/raw.json` `7596245760943adf01e073701376d02672971c26d47ec330e997d484ba07ef37`
  - `data/env.json` `55b48d00e2ca202550921b2c10d1dcc494bc8375a02ccd8bbaa4545eac5d8c42`
- **Harness SHA-256:** `9c4a53f74bfaa004321d371de3d925cdcd53ef78c7837166cd154ffbaeefb10c`
- **Scope:** reduced D0 vs D2 only; n = 1000/5000/10000 unique nonzero integer
  arrays plus one duplicate pair at n = 10000; 3 timed reps / 3 warmups; no
  CI/bootstrap; no memory/scaling/L2/L3/D1/D3/D4; **no adopt/migrate conclusion**.
- **Extraction method (read-only):** parsed `data/raw.json`; regenerated all four
  inputs from the documented seeds with a fresh mulberry32 and compared SHA-256;
  computed a pairwise `Object.is` reference result for each input; recomputed all
  eight cell medians from the 24 retained runs; audited the alternating order,
  child exit codes, `inputMatch`, `resultCheck`, and cell validity; recomputed
  SHA-256 of production files, harness, `env.json`, and `raw.json`; ran
  `node --test`. I did **not** rerun the timing harness (it would overwrite the
  artifacts) and did not modify production or any input.

**Claim status vocabulary:** `supported` = the stated, narrowed claim is directly
evidenced; `partial` = directionally evidenced but limited (the limit is part of
the allowed wording); `unsupported` = absent from the raw data and must not be
written in a memo. A `partial` claim cannot support adopt/migrate.

## A. Claims the raw data supports

| ID | Extracted claim | Evidence (exact field / value) | Status | Exact allowed wording |
|---|---|---|---|---|
| C-1 | The reduced harness ran to completion and its five validity checks passed. | `raw.json.harnessValid = true`; `validityChecks = {parityAllMatch: true, mutantDetected: true, allCellsValid: true, productionUnchanged: true, existingSuitePass: true}`; `runs.length = 24`. | supported | "In the reduced run, all five recorded harness-validity checks passed." |
| C-2 | All 24 timed child runs exited 0, matched the parent input checksum, and returned the expected boolean. | Every `runs[]`: `childExitCode = 0`, `inputMatch = true`, `resultCheck = "pass"`; `cells[]`: 8/8 `valid = true`, `allResultsMatchExpected = true`. | supported | "All 24 retained timed runs exited 0, reproduced the parent input checksum, and returned the expected result." |
| C-3 | The measured inputs are the documented deterministic arrays. | `workloads[*].seed/poolRule/plusZeroCount=0/minusZeroCount=0/nanCount=0/nonIntegerCount=0`; `uniqueCount` 1000/5000/10000/9999; `duplicate-10000.duplicateCount=1`, `duplicatePairIndices=[[9998,9999]]`, `uniqueOtherwise=true`; `inputSha256` = `b42a6404…946e`, `390ae469…8a72`, `366124fe…b463`, `d7f9b61a…ebab`. Independent regeneration reproduced all four hashes and a pairwise `Object.is` reference returned `false/false/false/true`. | supported | "The four inputs regenerated from the documented seeds match the recorded SHA-256 values; the unique arrays contain no ±0/NaN and the duplicate case has exactly one pair at indices 9998/9999." |
| C-4 | D0 matches the 14-case hand-computed `Object.is` table. | `parity.d0.cases` 14 cases, `allMatch = true`, `mismatches = []`; cases E1–E14 include NaN, ±0 both orders, same-sign zeros, undefined, holes, null, strings, mixed types, shared and distinct objects. | supported | "D0 matched the 14-case hand-computed Object.is table (14/14) in this reduced run." |
| C-5 | D2 matches the same 14-case table, including the `±0` and `NaN` cases. | `parity.d2.cases` 14/14 `match = true`, `allMatch = true`, `mismatches = []`. | supported (narrow: this table only) | "D2 matched the 14-case hand-computed Object.is table (14/14), including `[+0,-0]`, `[-0,+0]`, `[+0,+0]`, `[-0,-0]`, and `[NaN,NaN]`, in this reduced run." |
| C-6 | The always-false mutant control was detected. | `controls.alwaysFalseMutant.mismatchCount = 9`; IDs `E1,E4,E5,E6,E8,E9,E10,E11,E13`; `duplicateWorkloadExpected = true`, `duplicateWorkloadObserved = false`, `detected = true`. | supported | "The always-false mutant was detected by 9/14 table mismatches and by a wrong result on the duplicate workload." |
| C-7 | Per-cell medians and descriptive D0/D2 ratios are as recorded. | `cells[]` medians: D0 0.169217 / 3.430864 / 13.843904 / 13.817595 ms; D2 0.059201 / 0.153367 / 0.322966 / 0.323066 ms; ratios 2.858347 / 22.370288 / 42.864896 / 42.770192. Recomputed medians from the 24 raw reps match all eight stored values exactly. | supported (descriptive only) | "Median-of-3 per-call wall-clock times on this host were D0 0.169/3.431/13.844/13.818 ms and D2 0.059/0.153/0.323/0.323 ms; the arithmetic ratio of the cell medians was 2.86×/22.37×/42.86×/42.77×. These are descriptive, one-host, three-rep observations, not a gated M2 result." |
| C-8 | D0 was slower than D2 in every measured cell on this host. | All four `descriptiveRatioD0overD2` > 1 (2.86×, 22.37×, 42.86×, 42.77×); within each workload every D0 rep is larger than every D2 rep (e.g. n=1000: D0 0.154039–0.170179 vs D2 0.059060–0.061986; n=10000: D0 13.785094–14.573182 vs D2 0.303780–0.337883). | supported (descriptive, this slice) | "On this slice and host, the D0 cell medians were larger than the D2 cell medians in all four cells; no statistical uncertainty is estimated." |
| C-9 | The duplicate case returns `true` in both directions, at a late pair. | All 6 duplicate-case runs: `result = true`, `expectedResult = true`, `resultCheck = "pass"`, `duplicatePairIndices = [[9998,9999]]`; D0 medians 13.817405–13.819107 ms, D2 0.316053–0.343825 ms. | supported | "For the duplicate case (pair at indices 9998/9999), both directions returned `true` in all three reps." |
| C-10 | All raw reps were retained, including the visible outlier. | 24 `runs[]` present; D2 `unique-5000` rep 2 = 0.407263 ms vs 0.153367/0.144140 in reps 1/3; no rep removed, no rerun recorded. | supported | "All 3 reps per cell were retained; the D2 unique-5000 rep-2 value of 0.4073 ms is retained as a visible outlier and was not replaced." |
| C-11 | Production `src/`, `test/`, and `package.json` were unchanged across the run. | `env.productionFilesBefore = productionFilesAfter` = `src/dedupe.js b54842d6…8850`, `test/dedupe.test.mjs 9e8c8dc6…eae48`, `package.json a770daf3…ca89`; `productionUnchanged = true`; independent `sha256sum` at review matches; the `src/dedupe.js` hash also equals the R2 value recorded in `PLAN.md` §1. | supported | "Production `src/`, `test/`, and `package.json` SHA-256 values were identical before and after the run and match the R2 values; no production file was edited." |
| C-12 | The existing production suite passes. | `existingSuite = {command: "node --test", exitCode: 0, pass: true, stdout: "# tests 1, # pass 1, # fail 0"}`; reviewer re-ran `node --test` → 1 test/1 pass/0 fail. | supported | "The existing `node --test` suite passed (1 test, 2 assertions) both in the run record and when re-run by the reviewer." |
| C-13 | The recorded environment is Node 22.23.2 on one Linux x64 desktop. | `env.node = v22.23.2`, `v8 = 12.4.254.21-node.56`, `npm = 10.9.8`, `platform = linux`, `arch = x64`, CPU `AMD Ryzen 9 9950X`, 32 logical CPUs, `totalMemoryKb = 62307296`, loadavg start/end `0.06,0.13,0.37`; `gitHead = 704a4f531b04d9da52575c5833090a6fbed24858`; reviewer-verified. | supported | "The run records Node 22.23.2 on one Linux x64 AMD Ryzen 9 9950X desktop with load average 0.06/0.13/0.37 at start and end." |
| C-14 | Only D0/D2 and the stated reduced cells were measured; the omitted full-plan cells are unmeasured. | `deviationsFromFullPlan` lists 8 omissions; `limitations` lists no memory, scaling fit, L2/L3, small-n, 10k random parity; `raw.scope/notTheFullStudy`; no cells/artifacts exist for D1/D3/D4, memory, scaling, or L2/L3. | supported (negative claim) | "Only D0 and D2 on the four stated integer workloads were measured; D1/D3/D4, memory, scaling fit, L2/L3, small-n, and the 10k random parity corpus were not measured in this reduced run." |
| C-15 | No confidence interval or bootstrap was computed. | No CI/bootstrap fields in `cells[]`/`runs[]`; `protocol.timedRunsPerCell = 3`; `REDUCED-RUN.md` §6 and §7 state no bootstrap/CI. | supported (negative claim) | "No confidence interval or bootstrap was computed from the 3 reps; the reported ratios are descriptive." |

## B. Claims that are only partial for this run

| ID | Claim under consideration | Why partial | Allowed wording (limit is mandatory) |
|---|---|---|---|
| P-1 | "D2 is exact-parity" in general. | Only the 14 curated cases were run. The full plan's C-core (~40), C-zero matrix, and 10k seeded mixed-type corpus were not run; no mixed-type L2 timing. The D2 algorithm is designed to be `Object.is`-exact, but that is an argument, not this run's measurement. | "D2 matched the 14-case curated table; exactness on the full mixed-type/object corpus is **not established** by this reduced run." |
| P-2 | "D2 is 2.86×/22.37×/42.86×/42.77× faster." | The figures are ratios of cell medians (D0 median ÷ D2 median), not the full plan's median of 7 paired ratios; no CI, 3 reps, one host, one workload family. | "The arithmetic ratio of the D0 and D2 cell medians was 2.86×/22.37×/42.86×/42.77× on this host and slice; no CI, paired-ratio median, or M2 gate was computed." |
| P-3 | "The timings are stable/low-variance." | D0 reps are tight except unique-5000 rep 2 (3.879 vs 3.428/3.431); D2 unique-5000 rep 2 is 0.407 vs 0.153/0.144 (≈2.7× the median); no CI/variance model. | "The 3-rep spread is reported raw; one D2 unique-5000 outlier is retained; stability and variance were not estimated." |
| P-4 | "The duplicate case is detected only at the end." | Analytically implied by the audited pair at indices 9998/9999 and the two implementations, but not instrumented (no comparison counter). | "Given the audited pair at indices 9998/9999, both implementations can only detect it at the final comparison/element; no comparison counter was recorded." |

## C. Claims that are unsupported and must not appear in a memo

These are not asserted by `REDUCED-RUN.md`; they are listed to freeze the wording
boundary. If any memo sentence implies one, the memo claim is `unsupported`.

| ID | Unsupported claim | Why | Status | Allowed wording |
|---|---|---|---|---|
| U-1 | D2 passes the full-plan M2 gate (≥2.0×, 95% CI low >1.2 on both L1 and L2). | No L2 mixed workload, no 7 reps, no bootstrap/CI; only integer arrays. | unsupported | Must not appear. At most: "descriptive median-of-3 ratio on one integer workload family." |
| U-2 | D2 passes M3 (scaling slope ≤1.5, R² ≥0.98) or has O(n) scaling. | No 1k/4k/16k fit and no regression; only 1k/5k/10k descriptive. | unsupported | Must not appear. At most: "three sizes were timed; no scaling fit was performed." |
| U-3 | D2 passes M4 / uses less memory / reduces peak or post-call memory. | No memory measurement at any n. | unsupported | Must not appear. |
| U-4 | D2 is production-ready, adoptable, recommended, or superior for the library. | No memo, no adopt/migrate, no real callers, single host/runtime, synthetic data. | unsupported | Must not appear. Research may at most hand off a candidate for a later Development contract. |
| U-5 | The result generalizes to real callers, browser, Deno/Bun, other Node versions, or production workloads. | One dev desktop, Node 22.23.2 only, synthetic fixed arrays, no call-frequency data. | unsupported | Must not appear. |
| U-6 | D1/D3/D4 parity, speed, scaling, or memory are validated or ruled out. | Not measured; `deviationsFromFullPlan` and `limitations` say so. | unsupported | Must not appear. |
| U-7 | The reduced run satisfies the full PLAN.md R2 gate or inherits the plan-review PASS. | `notTheFullStudy`; the R2 PASS covers the full design, not this subset. | unsupported | Must not appear. |
| U-8 | The result is statistically significant, or 3 reps are sufficient for a decision. | No CI, no test, no power analysis; no decision rule applied. | unsupported | Must not appear. |
| U-9 | D0 is superseded/killed or should be replaced now. | No gate was applied; D0 is the control, not a loser in this reduced run. | unsupported | Must not appear. |

## D. Reviewer's extraction notes

- The run record's `§6` table matches the raw data to the displayed precision:
  e.g. 2.86× = 2.858347, 22.37× = 22.370288, 42.86× = 42.864896, 42.77× =
  42.770192; medians 0.1692/0.0592/3.4309/0.1534/13.8439/0.3230/13.8176/0.3231
  are rounded from the raw values. No number in `REDUCED-RUN.md` §6 was found
  unsupported by the raw file.
- The run record's `§2` and `§4` hashes match independent `sha256sum` values.
- No claim in `REDUCED-RUN.md` recommends adoption; the document explicitly
  refuses one (`§7`).
- The 24 runs contain no dropped/failed rep, so there is no cherry-picking
  signal. The single visible outlier is retained and disclosed.
- The mutant control was invoked directly, not through a candidate-resolution
  path (the run used D0 imported and D2 inline); this does not invalidate the
  14-case detection result but limits what the control proves.
- No `data/COMMANDS.md` or standalone fit artifact exists for this reduced run;
  the single reproduce command and the recorded hashes are the provenance.

*End of extraction. The SHA-256 of this file is recorded in
`RESULTS-REVIEW.md`; any later edit invalidates that stamp.*

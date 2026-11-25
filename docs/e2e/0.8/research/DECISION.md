# DECISION — replace the O(n²) duplicate check? (R0 frame)

- **Status:** R0 decision frame. No measurements or conclusions yet; candidate
  directions and the approval record are in `DIRECTIONS.md`.
- **Depth:** standard (`docs/RESEARCH.md`), timebox 20 minutes.
- **Location:** research artifacts only, under `docs/research/e2e/`.

## 1. Decision to be made

Should `hasDuplicateSlow` — the O(n²) `Object.is` pair scan in `src/dedupe.js` —
be replaced in this ESM library by a faster duplicate-detection implementation,
and if so, which implementation preserves the library's equality contract
(`Object.is`) and fits the project's zero-dependency, single-function surface?

`README.md` frames the question: "Research whether a Set-based dedupe is worth
adopting for this ESM library, including semantics, performance, and fit."

- **Decision owner:** the user/maintainer.
- **Decision point:** after R5 results review and R6 user acceptance — not in
  this frame. "Adopt" means a later Development change; research does not edit
  production code.
- **Approved for investigation:** D1, D2, D3, D4 (`docs/RESEARCH.md`). D5 is
  detailed as the next contender but is **not** approved; D6–D13 are recorded
  in the appendix.

## 2. Current baseline (as-is)

Observed from the working tree on 2025-11-25 (Node v22.23.2):

| Fact | Value |
|---|---|
| Implementation | `hasDuplicateSlow(items)` in `src/dedupe.js` |
| Algorithm | nested index loops, `i < j`, `Object.is(items[i], items[j])`; early `return true` |
| Complexity | time O(n²) worst case, O(1) extra memory besides input |
| Equality | `Object.is`: `NaN` equals `NaN`, `+0` differs from `-0`, objects by reference |
| Input guard | none (assumes array-like with `length` and index access) |
| Public surface | one named ESM export; no dependencies (`package.json` has no `dependencies`) |
| Tests | `test/dedupe.test.mjs`: 1 test, 2 assertions (`[1,2,3,2]` true, `[1,2,3]` false) |
| Test status | `node --test` → pass; 1 test, 0 fail, suite duration ≈29 ms (observed) |
| Perf baseline | **not measured yet**; no latency/memory numbers are claimed in this frame |
| Engines/license | `package.json` has neither `engines` nor `license`; repo has no `LICENSE` file — unknown |

Baseline correctness is the reference oracle for all candidate directions. The
existing test is too narrow to establish parity (no `NaN`, `±0`, objects,
symbols, bigints, holes, mixed types), so R3 needs a differential corpus.

## 3. Metrics, thresholds, and MDE

All thresholds are proposed R0 gates pending the R2 plan review; no result is
claimed here.

| # | Metric | Measurement | Gate / decision rule | MDE / noise rule | Evidence (planned) |
|---|---|---|---|---|---|
| M1 | Semantic parity | Differential run vs the baseline loop over an edge corpus + seeded random arrays (10k arrays, mixed types) | **0 mismatches**; a single mismatch fails the direction (exact, no effect size) | Exact; no MDE | `spikes/d*/parity.*`, `EVIDENCE-MATRIX.md` |
| M2 | Latency at n = 10,000 | `performance.now()`/`hrtime.bigint`, median of 7 alternating separate-process runs, 3 warmups, same generated input | Candidate ≥ **2.0× faster** than baseline | **20% relative**; smaller effect = "no material difference" | `spikes/d*/bench.*`, raw JSON |
| M3 | Empirical scaling | Log–log slope of median time over n ∈ {1k, 4k, 16k} | Candidate exponent ≤ **1.5**; baseline expected ≈2.0 | ±0.3 slope (design target) | `bench` output + fit |
| M4 | Extra memory | `--expose-gc` + `process.memoryUsage()`/`heapUsed` delta, n = 100,000 | ≤ **64 B/item** and peak ΔRSS ≤ **128 MB** | 10% of measured delta | `spikes/d*/mem.*` |
| M5 | Fit | Static check: no new deps, named ESM export unchanged, `node --test` green, no production edit | All must hold | Exact | commands in memo |

M2's MDE assumes paired alternating runs in fresh processes (avoids JIT/GC
cross-contamination); the expected Set gain at n=10k is far above 20%, so a
null result would be attributable to the direction, not noise. Below-MDE results
are reported as "cannot conclude", not as a win.

Secondary, non-gating observations: implementation diff size (rough maintainability
proxy), sensitivity of a hybrid threshold, and behavior at n = 50 / 500 (common
small inputs), where O(n²) may already be cheap.

## 4. Constraints

- **Runtime:** Node v22.23.2 measured here; supported Node range is unknown (no
  `engines` field). Browser/bundler behavior is out of scope.
- **Dependencies:** none allowed — no new packages, no network calls
  (`AGENTS.md`); built-ins only.
- **Research isolation:** production `src/` and `test/` are read-only; only
  `docs/research/e2e/` may be written; demos live in
  `docs/research/e2e/spikes/` (not created in this step).
- **Test command:** `node --test`; no lint/typecheck/build configured.
- **Timebox:** 20 minutes total (allocation in §6). Standard depth with
  independent plan and results reviews.
- **Delivery:** local-only; no commit/push/MR/deploy (`AGENTS.md`).
- **Data/security:** synthetic inputs only; no PII, credentials, or secrets.
- **License/CVE:** no new dependency is proposed, so no new license/CVE surface;
  the existing repository license is unknown.
- **API assumption:** the named export and its boolean return are unchanged;
  any new stateful/async API would be a separate decision (see D8/D11).

## 5. Representative slice

- **Entry points:** (1) direct ESM import and call of `hasDuplicateSlow`;
  (2) the existing `node --test` suite. There is no second caller in this repo,
  so "fit" is assessed against the single-export library shape only.
- **Workloads:** mixed primitives with repeated object references; edge values
  `NaN`, `+0`, `-0`, `undefined`, `null`, booleans, strings, bigints, symbols,
  holes; n = 10 / 1k / 10k (latency) and 100k (memory).
- **Same conditions:** baseline and candidate run on identical generated inputs,
  same Node version, same machine/process settings, alternating order.
- **Exclusions (what this slice cannot prove):** browser/bundler or non-Node
  runtimes, TypeScript declarations, real production data distributions, other
  Node versions, long-running retention, actual API consumers, deployment or
  rollback. These stay unproven and must not be implied by results.

## 6. Timebox — 20 minutes

| Stage | Budget (planned) |
|---|---|
| R0/R1 frame + directions + pre-check | 4 min |
| R2 plan + independent plan review | 4 min |
| R3 baseline + D1–D4 spikes | 7 min |
| R4 analysis + evidence matrix/draft memo | 2 min |
| R5 independent results review | 2 min |
| R6 final memo + user acceptance | 1 min |

If the timebox expires: stop, report partial evidence and "cannot conclude",
and let the user decide whether to extend. This is a planned allocation, not
elapsed time.

## 7. Outputs / artifacts

- **Written now (R0/R1):** `DECISION.md`, `DIRECTIONS.md`. Nothing else.
- **Planned for later stages (not written now, per scope):** `PLAN.md`,
  `PLAN-REVIEW.md`, `baseline/`, `spikes/<direction>/`,
  `EVIDENCE-MATRIX.md`, `CLAIMS.md`, `RESULTS-REVIEW.md`, `REVIEW-LOG.md`,
  `memo.md`.
- **Decision output:** a reviewed memo with allowed wording (`measured-here` /
  `measured-sandbox` / `reported`), rejected directions, and what cannot be
  concluded; adoption requires a later Development change, not this research.

## 8. What would change the decision

- Representative workloads are small (n ≤ ~50) or callers are rare → do-nothing
  (D0) plausibly wins regardless of more complex options.
- The public contract must distinguish `+0` and `-0` → D1 alone fails parity;
  an exact variant (D2/D5) is required.
- A measured memory ceiling below ~64 B/item makes the O(n) Set variants
  unattractive → D0/D4/D5.
- The exact-parity guard or hybrid threshold adds more maintenance risk than
  the measured gain justifies → keep the baseline.
- Benchmarks fail to clear the 20% MDE or the parity corpus exposes an
  unforeseen divergence → "cannot conclude"; no adoption.
- Any solution requires a new dependency, native build, async API, or semantic
  change → outside this frame; needs a new user decision and risk review.

## 9. Open questions (user-owned, non-blocking for R1)

1. Typical input size and value mix in real use (drives whether any speedup
   matters).
2. Is `Object.is`'s `+0`/`-0` distinction part of the intended public contract?
3. Supported Node versions / whether `engines` should be declared.
4. Repository license and contribution policy (no `LICENSE` present).

Defaults used until answered: exact `Object.is` parity is required; the named
export and boolean return stay unchanged; Node 22 is the measurement runtime.
These are recorded so R2 can confirm them rather than silently assuming them.

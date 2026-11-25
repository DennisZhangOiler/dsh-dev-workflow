# memo.md — R6 decision memo: reduced D0 vs D2 duplicate-detection evidence

**Status:** R6 final memo, user-facing **only as reduced-scope evidence**. It is
built exclusively from the independently reviewed claims in `CLAIMS.md` and the
PASS in `RESULTS-REVIEW.md`; it adds no new measurements. **User acceptance is
pending** — this document is not approval, and it is not a decision to adopt.

| Field | Value |
|---|---|
| Decision question | Should the O(n²) `hasDuplicateSlow` in `src/dedupe.js` be replaced by a faster, `Object.is`-preserving implementation? (`DECISION.md` §1) |
| Memo scope | Reduced D0 vs D2 slice only (see §2); **not** the full `PLAN.md` study |
| Evidence label | **measured-here** (one host, synthetic fixed integers, 3 reps). `measured-sandbox`: none. `reported`: none. |
| Claim basis | `CLAIMS.md` (C-1…C-15, P-1…P-4, U-1…U-9), extracted independently before any memo existed |
| Review verdict | **PASS** — `RESULTS-REVIEW.md`, reviewer `results-reviewer-1` / `deepseek-flash` / `deepseek-official`, 2026-11-25T04:03:19Z |
| Review score | 90/100 for **reduced-run evidence quality**; 0 P0, 0 P1, 0 P2, 5 P3. Not a full-plan score and not a decision. |
| Resulting modality | **candidate / pilot only** — no adopt, no migrate, no security decision, no production change |
| Author | `lead` (synthesis); memo not separately reviewed as a memo — its claims are the reviewed ones below |

**Claim-mapping rule.** Every substantive measurement sentence in this memo
carries a `C-`/`P-`/`U-` ID. The allowed wording in §3 is verbatim from
`CLAIMS.md`/`RESULTS-REVIEW.md`; broader wording would be an unsupported claim.
No claim here is `measured-sandbox` or `reported`.

---

## 1. Decision status

1. **No adoption, migration, or security recommendation is made.** Research may
   at most hand off a candidate for a later Development contract; it must not
   declare D2 production-ready, adoptable, recommended, or superior (U-4), and it
   must not declare D0 superseded or replace it now (U-9). This memo does neither.
2. **D0 remains the working baseline.** It is the production import and the
   control in this run, not a losing arm in a gated comparison (U-9).
3. **What this memo does establish** is narrow and descriptive: a reduced,
   single-host measurement record that passed its own harness-validity checks
   (C-1, C-2), whose inputs and medians an independent reviewer regenerated and
   recomputed (C-3, C-7), on which D0's cell medians were larger than D2's in all
   four measured cells (C-8), with D2 matching the 14 curated parity cases (C-5).
4. **What follows is left to the user:** whether to commission the full
   `PLAN.md` study, a new reduced follow-up, a Development pilot, or to stop
   (OQ-5). None of those steps is authorized by this memo.
5. **No production change occurred.** `src/`, `test/`, and `package.json`
   SHA-256 values were identical before and after the run and match the R2 values
   (C-11); research never migrates production.

## 2. Reduced scope actually measured

**Executed.** D0 is the real production `hasDuplicateSlow`, imported read-only
from `src/dedupe.js`; D2 is `Set` membership plus an explicit
`plusZeroSeen`/`minusZeroSeen` guard, defined inline in `harness/bench.mjs`
(C-11, and `REDUCED-RUN.md` §3). Workloads: deterministic unique nonzero integer
arrays at n = 1000 / 5000 / 10000, plus one duplicate pair at n = 10000 located
at indices 9998/9999 (C-3). Protocol: one fresh Node child per timed rep, 3
untimed warmups, one timed call, 3 timed reps per direction × workload,
alternating direction order, median of 3 (C-1, C-2, C-7).

**Host and runtime.** Node v22.23.2 / V8 12.4.254.21-node.56 / npm 10.9.8 on one
Linux x64 AMD Ryzen 9 9950X desktop with 32 logical CPUs and 62,307,296 kB RAM;
load average 0.06/0.13/0.37 at start and end (C-13). `data/env.json` records no
dependencies, built-ins only, and no `node_modules` or network use
(`RESULTS-REVIEW.md` §1).

**Provenance.**

- Command (from `REDUCED-RUN.md` §3): `node docs/research/e2e/harness/bench.mjs`
- Working directory (from `data/env.json`):
  `/home/dennis/projects/oiler-hub/.tmp/headless-research`
- Recorded window (from `data/env.json`): 2026-11-25T04:00:08.181Z →
  2026-11-25T04:00:09.153Z (duration 972.2 ms)
- **Exit code was not recorded** (review finding F-2). The harness exits 0 iff all
  validity checks pass, and `harnessValid = true` with all five checks true
  (C-1); the reviewer did not rerun the harness because that overwrites the
  artifacts, but regenerated every input and recomputed every median (C-3, C-7).
  Treat the exit status as implied by `harnessValid`, not as a captured record.
- Artifact SHA-256 (independently reverified for this memo):
  `data/raw.json` `7596245760943adf01e073701376d02672971c26d47ec330e997d484ba07ef37`;
  `data/env.json` `55b48d00e2ca202550921b2c10d1dcc494bc8375a02ccd8bbaa4545eac5d8c42`;
  `harness/bench.mjs` `9c4a53f74bfaa004321d371de3d925cdcd53ef78c7837166cd154ffbaeefb10c`;
  `REDUCED-RUN.md` `69d8e532a29cb5b2da2dfd5cff8e3645c10fcb3a6e4aff4991e645110a70e913`.
- Production at handoff: `src/dedupe.js`
  `b54842d6b94c3aa602dbf5904a2d0883c9576460b8b778660f3c2491cf9e8850`;
  `test/dedupe.test.mjs`
  `9e8c8dc6446363dfdadc4bd89fc1d64c5ef71541ed4fbb64c4281fbcf22eae48`;
  `package.json`
  `a770daf300e9e5e05bd6a1c01ba13a6bcb882ba4d815253648b3d83010f0ca89` (C-11).

**Not executed (explicitly unmeasured).** D1, D3, D4; the full curated C-core
(~40 cases), C-zero matrix, and 10k seeded mixed-type/object parity corpus; L2
mixed-type and L3 object-heavy workloads; the 1k/4k/16k scaling fit; the 100k
memory cell; small-n sensitivity; M2/M2-D4/M3/M4 gates; 7 reps and any
bootstrap/CI; timer-overhead control; mutant-through-candidate-resolution path;
D1 `±0` positive control (C-14, C-15).

**Stale status note superseded.** `data/raw.json` and `data/env.json` still say
"unreviewed / no results review or memo was produced" (true at run time). That
note is superseded by this memo's cited PASS; the raw artifacts were deliberately
not rewritten, because editing them would invalidate their reviewed hashes
(review finding F-5).

**Documentation gaps (not data defects).** No `EVIDENCE-MATRIX.md` and no
`REVIEW-LOG.md` exist in `docs/research/e2e/`; reviewer identity, hashes, and the
claim tables live in `CLAIMS.md` and `RESULTS-REVIEW.md`. A future full study
should add those artifacts (F-2, and `DECISION.md` §7's planned outputs).

## 3. Reviewed claims and allowed wording

All rows below are **measured-here** and are the only wording permitted in this
memo. `supported` rows may be cited as stated; `partial` rows carry a mandatory
limit and **cannot** support adopt/migrate; `unsupported` claims must not appear.

### 3.1 Supported claims

| ID | Status | Allowed wording (verbatim) |
|---|---|---|
| C-1 | supported | "In the reduced run, all five recorded harness-validity checks passed." |
| C-2 | supported | "All 24 retained timed runs exited 0, reproduced the parent input checksum, and returned the expected result." |
| C-3 | supported | "The four inputs regenerated from the documented seeds match the recorded SHA-256 values; the unique arrays contain no ±0/NaN and the duplicate case has exactly one pair at indices 9998/9999." |
| C-4 | supported | "D0 matched the 14-case hand-computed Object.is table (14/14) in this reduced run." |
| C-5 | supported (narrow: 14-case table only) | "D2 matched the 14-case hand-computed Object.is table (14/14), including `[+0,-0]`, `[-0,+0]`, `[+0,+0]`, `[-0,-0]`, and `[NaN,NaN]`, in this reduced run." |
| C-6 | supported | "The always-false mutant was detected by 9/14 table mismatches and by a wrong result on the duplicate workload." |
| C-7 | supported (descriptive only) | "Median-of-3 per-call wall-clock times on this host were D0 0.169/3.431/13.844/13.818 ms and D2 0.059/0.153/0.323/0.323 ms; the arithmetic ratio of the cell medians was 2.86×/22.37×/42.86×/42.77×. These are descriptive, one-host, three-rep observations, not a gated M2 result." |
| C-8 | supported (descriptive, this slice) | "On this slice and host, the D0 cell medians were larger than the D2 cell medians in all four cells; no statistical uncertainty is estimated." |
| C-9 | supported | "For the duplicate case (pair at indices 9998/9999), both directions returned `true` in all three reps." |
| C-10 | supported | "All 3 reps per cell were retained; the D2 unique-5000 rep-2 value of 0.4073 ms is retained as a visible outlier and was not replaced." |
| C-11 | supported | "Production `src/`, `test/`, and `package.json` SHA-256 values were identical before and after the run and match the R2 values; no production file was edited." |
| C-12 | supported | "The existing `node --test` suite passed (1 test, 2 assertions) both in the run record and when re-run by the reviewer." |
| C-13 | supported | "The run records Node 22.23.2 on one Linux x64 AMD Ryzen 9 9950X desktop with load average 0.06/0.13/0.37 at start and end." |
| C-14 | supported (negative) | "Only D0 and D2 on the four stated integer workloads were measured; D1/D3/D4, memory, scaling fit, L2/L3, small-n, and the 10k random parity corpus were not measured in this reduced run." |
| C-15 | supported (negative) | "No confidence interval or bootstrap was computed from the 3 reps; the reported ratios are descriptive." |

The ordering of C-7's four values corresponds to `unique-1000`,
`unique-5000`, `unique-10000`, `duplicate-10000`; the four ratios are 2.858347,
22.370288, 42.864896, 42.770192 (descriptive arithmetic on cell medians only).

### 3.2 Partial claims (limit is mandatory)

| ID | Status | Allowed wording (verbatim) |
|---|---|---|
| P-1 | partial | "D2 matched the 14-case curated table; exactness on the full mixed-type/object corpus is **not established** by this reduced run." |
| P-2 | partial | "The arithmetic ratio of the D0 and D2 cell medians was 2.86×/22.37×/42.86×/42.77× on this host and slice; no CI, paired-ratio median, or M2 gate was computed." |
| P-3 | partial | "The 3-rep spread is reported raw; one D2 unique-5000 outlier is retained; stability and variance were not estimated." |
| P-4 | partial | "Given the audited pair at indices 9998/9999, both implementations can only detect it at the final comparison/element; no comparison counter was recorded." |

### 3.3 Unsupported claims (must not appear)

U-1 (M2 gate), U-2 (M3 scaling/O(n)), U-3 (M4 memory), U-4 (production-ready/
adoptable/recommended/superior), U-5 (generalization to real callers, browser,
Deno/Bun, other Node versions, production), U-6 (D1/D3/D4 validated or ruled
out), U-7 (reduced run satisfies or inherits the full PLAN.md gate), U-8
(statistical significance / 3 reps sufficient for a decision), U-9 (D0
superseded/killed). These are excluded from every sentence of this memo; the
strongest permitted substitutes are those in `CLAIMS.md` §C.

## 4. What the reviewed evidence shows

**4.1 Integrity and validity (C-1, C-2, C-3, C-6, C-10, C-11, C-12, C-13).**
In the reduced run, all five recorded harness-validity checks passed (C-1); all
24 timed runs exited 0, reproduced the parent input checksum, and returned the
expected boolean (C-2). The four inputs regenerate from the documented seeds to
the recorded SHA-256 values, the unique arrays contain no ±0/NaN, and the
duplicate case has exactly one pair at indices 9998/9999 (C-3). The always-false
mutant was detected by 9/14 table mismatches and by a wrong result on the
duplicate workload (C-6). All 3 reps per cell were retained, including the
visible D2 unique-5000 rep-2 outlier (C-10). Production hashes were unchanged and
matched R2 (C-11), the existing suite passed when re-run (C-12), and the host is
recorded (C-13).

**4.2 Parity (C-4, C-5, P-1).** D0 matched the 14-case hand-computed `Object.is`
table 14/14 (C-4); D2 matched the same 14 cases 14/14, including both `±0`
orders, same-sign zeros, and `[NaN,NaN]` (C-5). This is the full extent of
measured parity: D2 matched the 14-case curated table, while exactness on the
full mixed-type/object corpus is **not established** by this reduced run (P-1;
review finding F-1). The parity argument from the D2 code is reasoning, not a
measurement beyond those 14 cases (P-1).

**4.3 Timing (C-7, C-8, C-9, P-2, P-3, P-4).** Median-of-3 per-call wall-clock
times on this host were D0 0.169/3.431/13.844/13.818 ms and D2
0.059/0.153/0.323/0.323 ms; the arithmetic ratio of the cell medians was
2.86×/22.37×/42.86×/42.77× — descriptive, one-host, three-rep observations, not
a gated M2 result (C-7). On this slice and host, the D0 cell medians were larger
than the D2 cell medians in all four cells, with no statistical uncertainty
estimated (C-8). Those ratios are arithmetic on cell medians, not the full plan's
median of paired ratios; no CI, paired-ratio median, or M2 gate was computed
(P-2). The 3-rep spread is raw; the D2 unique-5000 outlier is retained; stability
and variance were not estimated (P-3). For the duplicate case, both directions
returned `true` in all three reps (C-9), and given the audited pair at indices
9998/9999 both can only detect it at the final comparison/element, with no
comparison counter recorded (P-4). The n = 1000 D2 cell (~0.059 ms) is close to
timer/JIT overhead territory and has no overhead control; its ratio must remain
descriptive and must not be used for a threshold or gate (review finding F-4).

**4.4 Limits (C-14, C-15).** Only D0 and D2 on the four stated integer workloads
were measured; D1/D3/D4, memory, scaling fit, L2/L3, small-n, and the 10k random
parity corpus were not measured in this reduced run (C-14). No confidence
interval or bootstrap was computed from the 3 reps; the reported ratios are
descriptive (C-15).

## 5. What cannot be concluded

The following are outside this reduced evidence set; each is tied to the
blocking exclusion that governs it.

- **No full M1 parity.** C-core (~40 curated), C-zero, and the 10k seeded
  mixed-type/object corpus were not run; `±0`/`NaN`/object handling beyond the
  14 cases is unmeasured (P-1, U-6).
- **No M2 gate.** No 7 reps, per-rep paired ratios, 95% bootstrap CI, MDE
  decision, or L2 mixed workload. The descriptive 2.86×–42.86× figures are not
  an M2 PASS and are not statistically characterized (C-15, P-2, U-1, U-8).
- **No M2-D4, M3, or M4.** Scaling fit, post-call memory, and D4 are unmeasured;
  no memory benefit/cost, linear-scaling, or peak-memory claim is supported
  (C-14, U-2, U-3).
- **No D1/D3/D4 evidence.** Their parity, latency, scaling, memory, comparator,
  and object-heavy behavior are not validated and not ruled out (C-14, U-6).
- **No L2/L3, n = 16k, n = 100k, or small-n evidence.** The slice is fixed unique
  nonzero integers plus one late duplicate pair at n ≤ 10k (C-14).
- **No production or generalization claim.** One dev desktop, Node 22.23.2 only,
  no CPU pinning/governor/NUMA control, no real caller data, no call-frequency
  data, no browser/other runtime (C-13, C-14, U-5).
- **No decision.** No adopt/migrate, no ranking, no "D0 superseded", no "D2
  recommended"; at most a candidate handoff for a later Development contract
  (U-4, U-9).
- **No statistical sufficiency.** Three reps cannot separate a stable effect
  from machine/JIT noise; the retained outlier is evidence of that limit, not a
  reason to discard it (C-10, P-3, U-8).
- **The reduced run does not satisfy or inherit the full-plan gate** (U-7). The
  R2 PASS covers the full `PLAN.md` design, not this subset.

## 6. Strongest counter-case (argument, not a measured claim)

The measured slice structurally favors D2's asymptotic advantage, so the
direction could reverse where real callers live. D0 is allocation-free and
returns on the first matching pair: with an early duplicate (e.g., indices 0/1)
it does O(1) work, whereas D2 still pays `Set` construction/allocation and
memory traffic. At small n (common inputs around n ≈ 10–50) the `Set` overhead
could exceed the nested scan, and the duplicate-at-the-end case measured here
cannot show that because both arms scan to the end (C-9, P-4). The only measured
sizes are n = 1000/5000/10000 with no early-duplicate workload and no memory
cell (C-14). This paragraph is reasoning from the audited implementations and
the executed workload list — it is not a measurement, is not one of the reviewed
claims, and is not a claim that D0 is better. It is the main falsifier a future
study or pilot should target (see OQ-6, U-5).

## 7. Confidence

| Judgment | Confidence | Basis |
|---|---|---|
| The recorded artifacts are internally consistent and reproducible as recorded. | **High** | C-1, C-2, C-3, C-10, C-11, C-12, C-13; reviewer regenerated inputs, recomputed all eight medians, re-ran the suite, and independently matched production/harness hashes. |
| On this exact slice and host, the D0 cell medians were larger than the D2 cell medians in all four cells. | **High, descriptive only** | C-8; every retained D0 rep exceeded every D2 rep in its cell, and no uncertainty is estimated. |
| The size of the effect (2.86×–42.86×) is a stable estimate. | **Not established** | 3 reps, one host, no CI/MDE, one retained outlier, small-n timer-overhead concern (C-15, P-2, P-3, U-8; F-4). |
| D2 parity holds beyond the 14 curated cases. | **Not established** | Only 14 curated cases were run (P-1, U-6). |
| A specific performance, scaling, or memory gate passes. | **No conclusion** | M2/M3/M4 were not run (U-1, U-2, U-3). |
| Any adoption, migration, or production recommendation. | **No conclusion** | Excluded by scope and evidence; research may at most hand off a candidate (U-4). |

Review metadata: the independent results review scored this reduced record
90/100 (floors met, total ≥ 80, no P0/P1/P2, five P3). That score grades the
evidence quality of this reduced run; it is **not** a full-plan score, not a
statement that `PLAN.md` gates were met, and not a decision.

## 8. Direction status (nothing is "rejected on evidence" here)

| Direction | Status after this reduced run |
|---|---|
| **D0** — keep nested `Object.is` scan | Control, not killed, not superseded (U-9); remains the production baseline. |
| **D1** — `Set` membership (SameValueZero) | **Unmeasured** (C-14, U-6). Not rejected on evidence. Its `±0`/`-0` divergence remains a semantic question for the user (OQ-2). |
| **D2** — `Set` + signed-zero guard | Measured in this reduced slice only: 14/14 curated parity (C-5) and descriptive medians (C-7, C-8). **Candidate only** (U-4). |
| **D3** — type-split `WeakSet` + per-type `Set`s | **Unmeasured** (C-14, U-6). Not rejected on evidence. |
| **D4** — sort copy + adjacent scan | **Unmeasured** (C-14, U-6). Not rejected on evidence. |
| **D5** — adaptive hybrid | Not approved for this run (`DIRECTIONS.md`); unmeasured. |
| **D6–D13** | Not approved/out of scope; unmeasured. D10/D12 conflict with the equality or API contract, and D13 violates the no-dependency constraint (`DIRECTIONS.md`). |

## 9. Open questions

- **OQ-1 — real workload.** What are the typical input sizes, value mixes, and
  call frequency in actual use? This is the biggest driver of whether any
  measured advantage matters (`DECISION.md` OQ-1; G1).
- **OQ-2 — signed-zero contract.** Is `Object.is`'s `+0`/`-0` distinction part of
  the intended public contract? If not, D1's simpler form deserves its own
  evaluation; if yes, only exact variants qualify (`DECISION.md` OQ-2; G2).
- **OQ-3 — runtime support.** Which Node versions must be supported, and should
  `engines` be declared? The run covers Node 22.23.2 only (`DECISION.md` OQ-3,
  C-13).
- **OQ-4 — license/policy.** Repository license and contribution policy are
  unknown; no `LICENSE` is present (`DECISION.md` OQ-4).
- **OQ-5 — next step.** Full `PLAN.md` study, a new user-approved reduced
  follow-up, a Development pilot, or stop. This memo chooses none of them.
- **OQ-6 — untested workload shapes.** Early-duplicate arrays, small n,
  mixed-type/object-heavy inputs, memory ceiling, and timer-overhead control are
  unmeasured and are the counter-case in §6 (C-14, U-2, U-3, U-5).
- **OQ-7 — ownership.** Who owns a later pilot/Development decision, and who
  signs acceptance for it? Research does not assign this.

## 10. Acceptance and handoff

- This memo becomes the reviewed input to a later step only after **user
  acceptance**. A written memo, a review PASS, or a score is not approval
  (`rd-workflow-research` R6).
- If the user proceeds, the modality is **candidate / pilot**, not adopt or
  migrate; `HANDOFF.md` records the memo hash, claim IDs, slice exclusions, and
  the required next steps. No production change is authorized by this memo.
- Any edit to `CLAIMS.md`, `RESULTS-REVIEW.md`, `REDUCED-RUN.md`, `raw.json`,
  `env.json`, `harness/bench.mjs`, `PLAN.md`, or `PLAN-REVIEW-R2.md`, or any new
  timing/parity/memory artifact, requires a delta re-review before the affected
  claims are used again (`RESULTS-REVIEW.md` §5). This memo is stamped below;
  changing it requires re-review of the changed claims.

## 11. Provenance and stamp

- Results review: `RESULTS-REVIEW.md` SHA-256
  `0bf982e420c771abdd53e95a898b8f1de28855094fd6187292e3529429891710`.
- Independent extraction: `CLAIMS.md` SHA-256
  `e0a6f130329d372c763a3bec3770d95ef7a18ddf13fd35fc3c8c67754842afd2`
  (matches the value recorded in `RESULTS-REVIEW.md`).
- Memo input hashes and production hashes are listed in §2; all were reverified
  read-only while writing this memo, and `node --test` passed (1 test, 0 fail).
- No production file or other research artifact was modified; writes are limited
  to this memo and `HANDOFF.md`.

**Memo content SHA-256 (all bytes above this line; this line excluded):** `aa9cc0bef4b238f6ce47a7fb57b5a0c935d45d6f8bf869350c1ca6f6f6c0955b`.

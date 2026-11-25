# HANDOFF — D2 (`Set` + signed-zero guard) as a candidate, not an adoption

**Status:** research handoff. **No production change, no adoption, no migration,
no security decision.** This document transfers a reduced-scope, reviewed
candidate to a possible later Development step. Research never migrates
production.

| Field | Value |
|---|---|
| Memo | `docs/e2e/0.8/research/memo.md` |
| Memo full-file SHA-256 | `b260ada85e447dcc59827f12601617ef453db7a50955be285150d177ab642f1d` |
| Memo content SHA-256 (bytes above its stamp line) | `aa9cc0bef4b238f6ce47a7fb57b5a0c935d45d6f8bf869350c1ca6f6f6c0955b` |
| Results review | `RESULTS-REVIEW.md` SHA-256 `0bf982e420c771abdd53e95a898b8f1de28855094fd6187292e3529429891710` — **PASS**, 90/100 reduced-run evidence quality |
| Memo review | `MEMO-REVIEW.md` SHA-256 `4900c38236a3b28db425e6e05fde1ca907293f43f79333d4b1ec6897998adca9` — **PASS**, memo hash/claim mapping |
| Independent extraction | `CLAIMS.md` SHA-256 `e0a6f130329d372c763a3bec3770d95ef7a18ddf13fd35fc3c8c67754842afd2` |
| Run record | `REDUCED-RUN.md` SHA-256 `69d8e532a29cb5b2da2dfd5cff8e3645c10fcb3a6e4aff4991e645110a70e913` |
| Data | `data/raw.json` `75962457…ef37`; `data/env.json` `55b48d00…8c42`; `harness/bench.mjs` `9c4a53f7…b10c` |
| Modality | **candidate / pilot** — not adopt, not migrate, not security |
| Decision owner | user/maintainer (research does not approve) |
| Production state | unchanged; `src/dedupe.js` `b54842d6…8850`, `test/dedupe.test.mjs` `9e8c8dc6…eae48`, `package.json` `a770daf3…ca89` |

## 1. What is handed off

A **candidate only**: D2, `Set` membership plus explicit `plusZeroSeen` /
`minusZeroSeen` handling so that `+0`/`-0` keep `Object.is` semantics. In the
reduced run it matched the 14-case curated parity table (C-5) and its cell
medians were smaller than D0's in all four measured integer cells on one host
(C-8). **This is not evidence that D2 is production-ready, adoptable,
recommended, or superior** (U-4), and it does not show D0 should be replaced
(U-9). No full-plan gate was run (U-1, U-2, U-3, U-7).

No other direction is handed off. D1, D3, and D4 were not measured (C-14, U-6);
they are neither validated nor rejected. D5 was not approved; D6–D13 were not
approved or were excluded by constraints (`DIRECTIONS.md`).

## 2. Claim IDs a downstream step may and may not cite

**May be cited as reduced-scope, measured-here evidence:** C-1, C-2, C-3, C-4,
C-5 (14 cases only), C-6, C-7, C-8, C-9, C-10, C-11, C-12, C-13, C-14, C-15.

**May be cited only with the mandatory limit:** P-1 (parity beyond 14 cases not
established), P-2 (ratios are descriptive cell-median arithmetic, no CI/M2),
P-3 (no variance estimate), P-4 (late-detection claim not instrumented).
**No `P-*` claim may support adopt/migrate or a gate PASS.**

**Must not be cited as established:** U-1 (M2), U-2 (M3/O(n)), U-3 (M4/memory),
U-4 (production-ready/adoptable/recommended), U-5 (generalization to callers,
browser, Deno/Bun, other Node, production), U-6 (D1/D3/D4 validated or ruled
out), U-7 (full-plan gate inherited), U-8 (statistical significance / 3 reps
sufficient), U-9 (D0 superseded). A future contract must re-derive any of these
with new, independently reviewed evidence.

**Memo mapping.** The memo uses only these IDs; it adds no measurements. Its
strongest counter-case section is explicitly argument, not a claim.

## 3. Slice inclusions and exclusions

**Included.** The real production `hasDuplicateSlow` imported read-only from
`src/dedupe.js` (D0); D2 inline in the harness; deterministic unique nonzero
integer arrays at n = 1000/5000/10000; one duplicate pair at indices 9998/9999;
3 warmups + 3 timed reps per cell, fresh child per rep, alternating order,
median-of-3; 14-case curated `Object.is` table; always-false mutant control;
per-timed-run expected-result check; `node --test`; one Linux x64 AMD Ryzen 9
9950X host, Node 22.23.2, no dependencies/network (C-1…C-3, C-6, C-12, C-13;
`REDUCED-RUN.md` §1, §3, §4).

**Excluded — do not imply these were tested:**

- Directions D1, D3, D4 (and D5+); no comparative ranking is possible.
- Full M1 parity: C-core (~40 curated), C-zero matrix, 10k seeded mixed-type /
  object corpus; symbols/bigints/holes beyond the 14 curated cases.
- L2 mixed-type and L3 object-heavy workloads.
- 1k/4k/16k scaling fit (M3), 100k memory cell (M4), M2-D4.
- Small-n inputs (n ≈ 10–50), early-duplicate arrays, timer-overhead control.
- 7 reps, per-rep paired ratios, bootstrap/CI, MDE/threshold gates.
- Mutant-through-candidate-resolution path; D0 baseline-copy anchor at runtime;
  D1 `±0` positive control.
- Browser/bundler, Deno/Bun, other Node versions, CPU pinning/governor/NUMA,
  isolated benchmark host, real caller data or call-frequency data.
- Data/schema/API migration, cutover, deployment, rollback in production,
  production scale, and post-deploy monitoring.

These exclusions are the reason the modality is candidate/pilot rather than
adopt; the reduced run cannot prove cutover, rollback, operations, or real
workload behavior (`DECISION.md` §5; `RESULTS-REVIEW.md` §4).

## 4. Required next step(s)

### 4.1 If the user wants an evidence-based decision on D2

1. **User accepts this memo** (R6). A PASS or a score is not acceptance.
2. Commission the **full `PLAN.md` study** (D0–D4; 7 reps; 95% bootstrap CI and
   MDE; L1/L2/L3; C-core/C-zero/C-rand parity; 1k/4k/16k scaling; 100k memory;
   small-n; mutant-through-candidate-path). Run it with independent plan and
   results reviews as in `PLAN.md`, then update the memo and re-review the
   changed claims.
3. Alternatively, a **new user-approved reduced contract** that targets the
   §6 counter-case (early duplicates, small n, memory) and still includes CI;
   without that, no threshold, gate, or adoption claim is permitted.
4. Only after a reviewed full/reduced study and explicit user acceptance may a
   Development contract be proposed. "Cannot conclude" is a valid outcome.

### 4.2 If the user wants to proceed to development

- **Development Phase 1 contract** must copy: the memo hash, the claim IDs above,
  the modality (candidate/pilot), the slice exclusions, and the no-production-
  change constraint. Missing items = no implementation.
- **Pilot mandatory** before production use (see §5); a written user risk
  acceptance is an alternative only if a pilot is impossible, and it must state
  residual risks and a signer/time.
- Development must use `MIGRATION.md` if the change ever touches data, schema,
  or the public API contract; this candidate is a single-function code change
  with an unchanged export name and boolean return, so no data migration is
  expected. Rollback is a code revert, not a data rollback.
- Preserve the reviewed `Object.is` contract, including the `+0`/`-0` distinction
  unless the user explicitly changes the contract (OQ-2).
- Add independent tests for parity (the 14 cases are a floor, not a corpus),
  plus the existing suite; do not rely on this memo as a test oracle.

## 5. Pilot requirements (conditional; not started, not authorized here)

| Field | Proposed requirement |
|---|---|
| Scope | D2 behind a feature branch/flag in a development environment; no production traffic; include an early-duplicate workload, a small-n workload, mixed primitives/objects, and a duplicate-at-start case. |
| Success criteria | Zero parity mismatches on an expanded `Object.is` corpus (at least the full C-core/C-zero/C-rand set); D0-vs-D2 comparison at 7 reps with bootstrap CI on L1 and L2; M2 ≥ 2.0× with 95% CI low > 1.2; M3 slope ≤ 1.5 with R² ≥ 0.98 if scaling is claimed; M4 within the plan's memory ceiling; existing `node --test` green; rollback rehearsed. |
| Abort criteria | Any parity mismatch; M2/M3/M4 gate failure; regression on early-duplicate or small-n inputs; unexplained memory growth; any public API/export change; any new dependency. |
| Rollback | Revert the single function/commit to the R2 baseline (`src/dedupe.js` `b54842d6…8850`); no data or schema rollback is needed. Verify the revert restores the existing suite. |
| Cleanup | Remove the flag/spike code, temporary benchmark artifacts, and any generated data; no dependency, lockfile, or `node_modules` change; production hashes restored/verified. |
| Owner | user/maintainer, named before the pilot starts (OQ-7). Evidence bundle and independent review per Development Phase 7. |

These thresholds come from the full `PLAN.md` design; they are **not** met by
this reduced run and must not be represented as met.

## 6. Migration, risk tier, and constraints

- **Migration:** none in research. This candidate is a code-level substitution
  with the same named export and boolean return; no data, schema, or API
  migration is part of this handoff. If adoption later changes the API or moves
  data, Development must add `MIGRATION.md` with rehearsal, backup, rollback,
  flag/canary, post-deploy smoke, monitoring, and abort conditions.
- **Risk tier:** **high-risk tier not triggered** — no auth, PII, payments,
  secrets, data migration, or production-scale change is involved in the
  candidate. Proposed Development tier: **medium** (public library semantics and
  performance-sensitive behavior; independent tests/verification required). This
  is a proposal; the user owns the final tier, and it must not be silently
  lowered.
- **Constraints carried forward:** no new dependencies, no network calls in the
  measurement path, production `src/`/`test/` read-only during research,
  local-only delivery (no commit/push/MR/deploy from research), synthetic
  non-PII inputs only (`AGENTS.md`; `DECISION.md` §4).
- **Open questions:** OQ-1 real workload distribution/call frequency; OQ-2
  whether `±0` is contractual; OQ-3 supported Node versions/`engines`; OQ-4
  license/contribution policy; OQ-5 next step choice; OQ-6 untested workload
  shapes/memory/timer overhead; OQ-7 pilot/Development owner. These are
  user-owned and block a production decision, not this handoff.

## 7. No production change — verification

- `src/dedupe.js`, `test/dedupe.test.mjs`, and `package.json` SHA-256 values are
  byte-identical to the R2 values and to the pre/post run records (C-11).
- `node --test` passed at handoff (1 test, 0 fail) (C-12); the reviewer re-ran it
  independently.
- The reduced run's only writes were under `docs/e2e/0.8/research/` (harness and
  `data/`); this memo and handoff are the only files added at R6.
- No dependency, lockfile, network call, commit, push, MR, deployment, or
  production edit was made by this research.

**Handoff verdict:** candidate/pilot handoff only; no adoption or migration
recommendation; no production change. Implementation requires the user
acceptance and next steps in §4.

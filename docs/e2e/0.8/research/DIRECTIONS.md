# DIRECTIONS — duplicate-detection options (R1)

- **Status:** R1 broad direction set + coverage/feasibility pre-check. No demos,
  no measurements, no recommendation. The decision frame is in `DECISION.md`.
- **Count:** 14 directions — control D0 + candidates D1–D13.
- **Detailed (top 5):** D1–D5. **Appendix:** D6–D13.
- **Selection record:** D1, D2, D3, D4 are approved for this run
  (`docs/RESEARCH.md`). D5 is detailed as the next contender but is **not
  approved**; D6–D13 are not approved. Changing the approved set needs an
  explicit user decision (new evidence only reopens a direction, per R1).

## 1. Summary

| ID | Mechanism | Time (expected) | `Object.is` parity | Extra memory | API/deps | Status |
|---|---|---|---|---|---|---|
| D0 | Keep nested `Object.is` scan | O(n²) | exact (reference) | O(1) | none | control — always run |
| D1 | `Set` membership (SameValueZero) | O(n) avg | **differs on `+0`/`-0` only** | O(n) strong | built-in | approved |
| D2 | `Set` + explicit signed-zero guard | O(n) avg | exact by construction | O(n) + 2 flags | built-in | approved |
| D3 | Type-split: `WeakSet` for objects + per-type `Set`s | O(n) avg | exact | O(n) primitives; weak objects | built-in | approved |
| D4 | Sort copy, scan adjacent with `Object.is` | O(n log n) | exact with consistent comparator | O(n) copy + identity map | built-in | approved |
| D5 | Adaptive hybrid: quadratic for n<T, D2 for n≥T | O(n²) tiny, O(n) large | exact (both branches exact) | O(n) above T | built-in | detailed, **not approved** |
| D6 | Encoded-key `Map` + `Object.is` collision verify | O(n) avg | exact with verify | O(n) string keys | built-in | appendix |
| D7 | Bloom/bitset prefilter + exact confirm | O(n) + rescan risk | exact with confirm | small bitset + candidates | built-in | appendix |
| D8 | Stateful incremental index API | O(1) amortized per add/has | exact (D2 keys) | O(n) held by caller | **new API** | appendix |
| D9 | Typed-array integer fast path + fallback | O(n) + fallback | exact with fallback | range-dependent bitset | built-in | appendix |
| D10 | Canonical JSON keys in a `Set` | O(n) | **not exact** | O(n) | built-in | appendix / reject on semantics |
| D11 | `worker_threads` partitioned scan | O(n) parallel-ish | exact with merge | per-worker O(n) | **async API** | appendix |
| D12 | Structural deep-equality dedupe | O(n) with canonical hash | **different semantics** | O(n) | API/contract change | appendix / reject |
| D13 | External library / native addon / WASM | varies | varies | varies | **new dependency/build** | excluded by constraints |

## 2. Control — D0: do nothing (keep current)

- **Mechanism:** unchanged `hasDuplicateSlow` nested loop with `Object.is`.
- **Why it stays plausible:** it is exact by definition, allocation-free, trivial
  to maintain, and correct for any input size; if real call sites use small
  arrays or the function is rarely called, an O(n) rewrite buys little.
- **Hypothesis to test:** at the representative workload, baseline median time
  already meets the latency budget, so no candidate has a material advantage.
- **Demo slice:** baseline benchmark only (n = 10 / 1k / 10k), memory at 100k,
  same harness as candidates.
- **Falsifier / kill criterion:** baseline p95 at the largest *required* n is
  unacceptable to the user, or a candidate clears the M2/M3/M4 gates. D0 is kept
  as the control in every comparison even if not "killed".
- **Unknown that matters:** the real input-size distribution and call frequency
  (see pre-check gap G1).

## 3. Detailed candidate directions (top 5)

### D1 — `Set` membership (SameValueZero semantics)

- **Status:** approved for this run.
- **Hypothesis:** one pass of `Set.has` / `Set.add` is O(1) average and at least
  2× faster than the baseline at n = 10,000, with no API or dependency change.
- **Mechanism:**
  ```js
  const seen = new Set()
  for (const item of items) {
    if (seen.has(item)) return true
    seen.add(item)
  }
  return false
  ```
- **Parity analysis:** `Set` uses SameValueZero, which matches `Object.is` for
  `NaN` (equal), objects/functions (reference), symbols, bigints, strings,
  booleans, `null`, `undefined`. **Only divergence:** `+0` and `-0` are equal to
  `Set` but unequal to `Object.is`. So `[0, -0]` returns `true` under D1 but
  `false` under the baseline. Existing tests do not cover this.
- **Cost:** O(n) time, O(distinct values) strong references retained until return.
- **Demo slice:** edge corpus (`NaN`, `±0`, mixed types, repeated/unique object
  references, symbols, bigints) + 10k seeded random arrays; latency n = 1k/10k/
  50k; memory n = 100k.
- **Falsifier / kill criteria:** any parity mismatch outside `±0`; latency gain
  below the 2× gate; memory above 64 B/item; or the user confirms signed-zero
  distinction is contractual (then D1 alone is disqualified).
- **Rationale (inferred — user rationale was not recorded in-session):** it is
  the direction named in `README.md`.

### D2 — `Set` + explicit signed-zero guard (exact parity)

- **Status:** approved for this run.
- **Hypothesis:** D2 keeps the O(n) gain while making parity exact by handling
  zeros outside the `Set`; its branch overhead is small relative to the gain.
- **Mechanism:** `plusZeroSeen` / `minusZeroSeen` booleans; zeros are never put
  in the `Set` (avoiding SameValueZero conflation); on each item, if
  `Object.is(item, 0)` and `plusZeroSeen` → duplicate; if `Object.is(item, -0)`
  and `minusZeroSeen` → duplicate; otherwise set the corresponding flag. All
  other values use `Set.has`/`add`.
- **Parity analysis:** exact for every `Object.is` case: `NaN`/`NaN` (Set),
  `±0` (flags: same-sign repeats duplicate, cross-sign not), objects by
  reference, symbols, bigints, mixed types. The argument is constructive, but
  still requires the differential evidence gate (M1).
- **Cost:** O(n) time, O(distinct non-zero values) + 2 bits; one extra branch per
  item; `Object.is` only for the zero check.
- **Demo slice:** same parity corpus as D1 plus explicit `[0,-0]`, `[-0,0]`,
  `[0,0]`, `[-0,-0]`; latency n = 1k/10k/50k; memory n = 100k.
- **Falsifier / kill criteria:** any parity mismatch; the guard erases the
  latency gain at n = 10k; memory gate fails. Complexity may still be judged
  not worth it if D1's `±0` divergence is acceptable — that is a user/semantic
  decision, not an experimental one.
- **Rationale (inferred):** exact-preserving version of the obvious fix.

### D3 — Type-split: `WeakSet` objects + per-type `Set`s

- **Status:** approved for this run.
- **Hypothesis:** splitting by `typeof` lets objects be tracked by identity in a
  `WeakSet` (no extra strong retention) and avoids mixed-type table pressure,
  reducing memory/GC cost versus D1/D2 on object-heavy input without losing the
  asymptotic gain.
- **Mechanism:** `switch (typeof item)`:
  - object (non-null) / function → `WeakSet` (reference identity = `Object.is`);
  - number → `Set` for non-zero numbers + the D2 zero flags;
  - string / boolean / bigint / symbol / undefined / null → one `Set` each (or
    a shared `Set`, since SameValueZero never equates different primitive types);
  - `WeakSet` rejects `null`, so route it to the primitive path.
- **Parity analysis:** exact. Objects/functions only equal by reference, which
  is `WeakSet` semantics; primitives are handled by SameValueZero, with zeros
  corrected. Cross-type equality never occurs under either rule.
- **Cost:** O(n) time; primitive values are still strongly retained; object
  references are weak. **Caveat:** the `WeakSet` is local and discarded at
  return, so the GC benefit *within* a single call is marginal; any real gain
  depends on allocation/table behavior and must be measured, not assumed.
- **Demo slice:** object-heavy and primitive-heavy corpora, parity corpus,
  latency n = 10k, memory n = 100k objects.
- **Falsifier / kill criteria:** any parity mismatch; no material latency or
  memory gain over D2 (e.g., within MDE / 10%) → dominated and should not ship;
  added branching complexity without measurable benefit.
- **Rationale (inferred):** memory-fit variant of the Set family.

### D4 — Sort copy, scan adjacent with `Object.is`

- **Status:** approved for this run.
- **Hypothesis:** a total-order sort makes equal values adjacent, giving
  O(n log n) with exact `Object.is` semantics and no hash-table implementation;
  it is a meaningful counterpoint to the hash family.
- **Mechanism:** copy the items (so input is not mutated); sort with a comparator
  that establishes a total order — type rank first, then value within type
  (`-0` before `+0`, `NaN` ordered consistently, booleans false<true, bigints/
  strings natural order); symbols and objects/functions cannot be ordered by
  value, so assign each distinct identity a first-seen sequence number via a
  `Map` and compare those. Then scan adjacent pairs with `Object.is`.
- **Parity analysis:** exact **iff** the comparator is a consistent total order
  (transitive, antisymmetric, `0` only for `Object.is`-equal values). Mutable or
  inconsistent comparators can silently mis-detect; `undefined`/holes require
  explicit handling (copying via spread turns holes into `undefined`, which
  `Object.is` treats as equal).
- **Cost:** O(n log n) time, O(n) copy + identity `Map`; comparator call
  overhead is high; no mutation of caller input.
- **Demo slice:** parity corpus (especially mixed types, `±0`, `NaN`, holes,
  symbols, shared object references); latency n = 1k/10k/50k; memory n = 100k.
- **Falsifier / kill criteria:** any parity mismatch traceable to comparator
  ordering; slower than baseline at n = 10k; slower than the Set family at
  equal parity (near-certain, but must be measured) → dominated.
- **Rationale (inferred):** non-hash algorithm family, useful as an independent
  correctness cross-check even if not adopted.

### D5 — Adaptive hybrid (quadratic for small n, exact Set for large n)

- **Status:** detailed as the next contender, **not approved** for this run.
- **Hypothesis:** the baseline is already cheapest for tiny inputs (no
  allocation), and D2 is best for large inputs; switching at a measured
  threshold T captures both, with exact parity on both branches.
- **Mechanism:** `if (items.length < T) { baseline loop } else { D2 }`, with T
  chosen from a sweep (e.g., 16 / 64 / 256 / 1024) and documented as an
  environment-dependent constant.
- **Parity analysis:** exact for all n because both branches are exact.
- **Cost:** no allocation below T; O(n) set above T. Risk: branch and threshold
  become a maintenance/tuning liability; T may vary across Node versions and
  input shapes, making the claim fragile.
- **Demo slice:** threshold sweep over n = 10 / 50 / 500 / 10k; compare against
  D0 and D2; report whether differences at small n clear the 20% MDE (they may
  not, in which case "cannot conclude").
- **Falsifier / kill criteria:** no stable crossover in the measured range; the
  branch erodes the large-n gain; small-n differences stay under the MDE so no
  threshold is defensible; threshold sensitivity across runs is high.
- **Rationale (inferred):** engineering compromise between allocation-free tiny
  inputs and asymptotic scaling.

## 4. Appendix — D6–D13 (not selected; exclusion reason recorded)

| ID | Direction | Mechanism | Why it is not in the top 5 | Revive if |
|---|---|---|---|---|
| D6 | Encoded-key `Map` + verify | Encode primitives as prefixed string keys (`n:`, `s:`, `-0` marker, …); objects/symbols get identity ids; store candidate arrays and confirm with `Object.is` | Expected slower than D1/D2: string allocation + extra verification; same asymptotic class | D2's memory profile is unacceptable and a compact key representation wins |
| D7 | Bloom/bitset prefilter | k hashes set bits; all-bits-set → candidate confirmation; any zero bit → definitely new | Exact only with a confirmation pass; adversarial collisions can degrade toward O(n²); adds complexity | Memory is the binding constraint and duplicates are sparse; measurement shows a gain |
| D8 | Stateful incremental index | `createDedupeIndex()` with `add(value): boolean`; caller keeps the index across calls | Changes the public surface; current function is a one-shot pure function with no consumer evidence; exact keys still need D2's zero handling | A caller repeatedly checks the same growing collection (streaming) |
| D9 | Typed-array integer fast path | If all items are small integers, use an offset `Uint8Array`/bitset; otherwise fall back to D2 | Narrow workload; pre-scan/fallback cost; range can be huge; not justified by the README's general API | Production data is proven dense small integers and perf is critical |
| D10 | Canonical JSON keys | `JSON.stringify` each item into a `Set` | **Not `Object.is`-exact**: `undefined`/functions/symbols drop, `NaN`/`Infinity`/holes → `null` (false collisions), `-0` → `0`, object key order, bigint throws, cycles throw | Never for this contract; only under a new "structural/JSON-safe values" API |
| D11 | `worker_threads` partition | Split items across workers, local `Set`s, merge/partition cross-worker duplicates | Async API change, structured-clone/pickup cost, overhead dominates at 10k, infeasible in the 20-min timebox | Arrays are huge (millions) and async API plus worker pool are acceptable |
| D12 | Structural deep-equality dedupe | Canonicalize nested values (sorted keys, cycle detection), hash, compare | **Changes semantics**: `Object.is` is reference equality for objects; deep equality would report different results and needs a new contract | The product question is "structurally duplicate", explicitly scoped as a new API |
| D13 | External library / native addon / WASM | `lodash`/`fast-deep-equal`/N-API/Rust/WASM implementation | **Constraint violation**: `AGENTS.md` forbids new dependencies/network; build toolchain, license/CVE review, cross-platform burden | Constraints change and a new user decision accepts the dependency/build risk |

## 5. Coverage / feasibility pre-check (advisory, not a score)

Run before selection; the selection D1–D4 is already recorded in
`docs/RESEARCH.md`, so this checks the option set, not the user's choice.

| Check | Result | Notes / gaps beside options |
|---|---|---|
| Broad mechanism coverage | pass | Hash/Set (D1, D2, D6), ordering (D4), adaptive (D5), type-split/weak (D3), probabilistic (D7), incremental (D8), vectorized (D9), serialization (D10), concurrency (D11), semantic change (D12), external (D13) |
| Do-nothing present | pass | D0, benchmarked as control |
| Obvious alternatives present | pass | In-place Set, exact Set, sort, library; dependency path is explicitly excluded |
| Falsifier per detailed direction | pass | D0–D5 each state a kill criterion |
| Demo feasible in 20 min, zero deps | **conditional** | D1/D2 straightforward with one harness; D3 needs an object-heavy corpus; D4's comparator is the main correctness risk/time sink; D5's sweep is tight. Share one corpus/generator and one benchmark runner to fit |
| Constraint compliance | **conditional** | D1–D5: built-in only, no API change. D8 (new API), D11 (async), D12 (semantics), D13 (deps/build) violate or change constraints; D10 violates the equality contract |
| Representative slice defined | **partial** | Only one entry point (direct import) and the test suite exist; no second production caller, browser/bundler, or real data. `DECISION.md` §5 records these exclusions; results must not imply them |
| Measurement validity | **conditional** | Fresh processes, alternating runs, 7 reps, seeded inputs; small-n D5 effects may fall under the 20% MDE; memory needs `--expose-gc` and n = 100k |
| Semantic oracle validity | pass with caveat | Baseline loop is the oracle by definition, but its test coverage is weak; the differential corpus (edge cases + 10k random arrays) is mandatory, not the existing 2 assertions |
| Selection consistency | pass | D1–D4 approved; D5 detailed/unapproved; any change requires explicit user decision |

### Gaps and omissions (shown beside the options)

- **G1 — unknown real workload.** Input size/mix and call frequency are not
  documented; this is the single biggest driver of D0-vs-others. Default used in
  the frame: representative n up to 10k; confirm at R2.
- **G2 — `±0` contract ambiguous.** If `Object.is` signed-zero behavior is not
  contractual, D1 is simpler; if it is, D1 is disqualified and D2/D5/D4 are the
  only exact options. D2 preserves either interpretation at low cost.
- **G3 — D4 comparator risk.** A subtly inconsistent total order can pass small
  tests and fail on mixed types; needs adversarial parity cases, and may consume
  the timebox.
- **G4 — D3's weak-memory premise may not materialize.** The `WeakSet` is local;
  measure before claiming a GC win.
- **G5 — D5 threshold may be below the MDE**, leaving D0 or plain D2 as the
  honest answer; unstable thresholds should be rejected rather than tuned.
- **G6 — runtime scope.** No browser/bundler direction; excluded from the slice
  and must not be inferred from results.
- **G7 — selection rationale not captured in-session.** Only the approval is
  recorded (`docs/RESEARCH.md`); the rationale bullets above are inferred and
  should be confirmed/recorded in R2.

**Considered and omitted** (so options are not hidden): memoizing by array
identity (unsound under mutation), `indexOf`/`includes` scans (same O(n²)
family as D0), and pre-hashing the input (hashing is the problem being solved).

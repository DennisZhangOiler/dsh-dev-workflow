# Plan review — R2 gate (before any demo)

**Reviewer record**

| Field | Value |
|---|---|
| Role | independent plan reviewer (Gate 1; not author/experimenter) |
| Identity | `plan-reviewer-1` |
| Model / provider | `deepseek-flash` / `deepseek-official` |
| Time (UTC) | 2026-11-25T03:48:59Z |
| Inputs | `docs/RESEARCH.md`, `docs/research/e2e/DECISION.md`, `DIRECTIONS.md`, `PLAN.md`; working tree read-only |
| Input hash | `e4d07274fb52efe698fcdeb18a3bc563e74ffaa223b64c31e62b24718610137a` (SHA-256 of the four files concatenated in that order) |
| Per-file SHA-256 | RESEARCH `606edaf9…e0f4`; DECISION `66010467…5dad`; DIRECTIONS `5183fbd0…ee75`; PLAN `f64d5df9…eb86` |
| Independence | Wrote verdict before any review-log/prior-verdict exists (none present). No demo, benchmark, or candidate code was run; `PLAN.md` was not modified. |
| Prompt hash | Not available as a file (instruction delivered in-session); no claim made. |

**Verdict: REVISE.** No demo may start until re-review returns PASS.

**Score: 86/100 (gate)** — total ≥80 is met, but a P1 blocks the gate.
Unresolved P2: **3/3** (at ceiling). P0: **0**. P1: **2**.

| Area | Score | Floor | Status |
|---|---:|---:|---|
| Selected-direction execution | 18/20 | 16 | pass |
| Decision and metrics | 13/15 | 12 | pass |
| Baseline and controls | 14/15 | 12 | pass |
| Experiment sufficiency | 16/20 | 16 | pass (at floor) |
| Reproducibility / artifacts | 8/10 | 8 | pass (at floor) |
| Risk / license / safety | 9/10 | 8 | pass |
| Reviewability | 8/10 | 8 | pass (at floor) |

Gate arithmetic: floors all met; total 86 ≥ 80; no P0; P2 3 ≤ 3; **P1 present → REVISE**. The
total is a gate, not a diagnostic: the two P1s are narrow, fixable defects in an
otherwise strong plan, and the fixes do not change the approved directions or the
decision frame.

**P0/P1 blocking:** P1-1 (production-unchanged/fit control cannot fail),
P1-2 (D1 gated latency cells are not guaranteed full-scan).

**What I inspected:** the four inputs above; `README.md`, `AGENTS.md`,
`package.json`, `src/dedupe.js`, `test/dedupe.test.mjs`; `git rev-parse HEAD`,
`git ls-files`, `git check-ignore`, `git status --porcelain -- src test
package.json`; `node --version`; `lscpu`/`free`. No writes outside this file, no
demos.

---

## P1 — blocking findings

### P1-1 [P1][blocking] The production-unchanged / fit control is vacuous in this worktree, and the recorded commit is wrong

**Location:** `PLAN.md` §1 table (line 19) and line 27 ("Production-code state
must remain byte-identical"); §4 EXP-FIT (lines 132–137); §9 row "Fit masked by
edits" (line 273); §12 command `git status --porcelain -- src test package.json`
(line 376); §14 CLM-5 (line 426).

**Evidence (read-only commands, run in this worktree):**
- `git check-ignore -v src/dedupe.js test/dedupe.test.mjs package.json` →
  `.git/info/exclude:12:/.tmp/` for **all three** paths.
- `git ls-files src/dedupe.js test/dedupe.test.mjs package.json` → empty.
- `git status --porcelain -- src test package.json` → empty, exit 0.
- `git rev-parse HEAD` → `704a4f531b04d9da52575c5833090a6fbed24858`; the plan
  records `e04476c6de6d63f42e16160d9918af9501016227`, an ancestor, not HEAD.
- The repo root is the parent `/home/dennis/projects/oiler-hub`; the entire
  research worktree is under the ignored `/.tmp/` path and is **untracked**.

**Why it matters:** M5 is gating, and CLM-5 ("production unchanged, export/test/
deps intact") plus the "src/ read-only" constraint are only checked by a command
that cannot detect an edit here. An experimenter could copy a candidate into
`src/dedupe.js` and still get an empty `git status` and a green `node --test`.
The commit field also does not identify the measured source: the parent commit
does not contain this worktree's `src/`, `test/`, or research files at all. The
byte-identity claim and baseline provenance therefore have no executable check.
This is an evidence-design failure, not a wording nit.

**Required action:**
1. Make EXP-FIT hash-based: record SHA-256 of `src/dedupe.js`,
   `test/dedupe.test.mjs`, `package.json`, and `baseline/hasDuplicateSlow.mjs`
   in `data/env.json` **before** R3, re-hash after all measurements, compare, and
   abort R3/flag M5 FAIL on any mismatch. Keep the existing `node --test` run.
2. Remove `git status` as the evidence for "production unchanged" (it may remain
   as a supplementary note, labelled non-detecting here), or add a self-test
   showing the check fails on an intentional temp copy (e.g., hash a fixture
   whose content is altered in a temp dir — no production edit).
3. Correct §1: record the actual parent `HEAD` (`704a4f5…`) and state explicitly
   that the research worktree is untracked/ignored, so provenance is the file
   hashes, not the commit. `data/env.json` must record both facts.

**Pass condition (re-review):** `PLAN.md` contains the before/after hash commands
and the mismatch-abort rule; §1 shows the verified HEAD or an explicit
"untracked worktree, hashes are provenance" statement; M5 no longer claims
`git status` proves production unchanged.

---

### P1-2 [P1][blocking] D1's gated latency cells are not guaranteed duplicate-free under D1; the checksum exception hides an early return

**Location:** `PLAN.md` §6 workloads (lines 165–166), corpus/checksum text (lines
171–176), and the "NaN absent" rationale (lines 178–183); §7 M1 (line 192); §9
row "DCE / skipped work" (line 263); §4 EXP-1b (line 103).

**Evidence:**
- L1 is defined only as "duplicate-free numbers, n unique" (line 165). Under
  the baseline oracle `Object.is`, `[0, -0]` is duplicate-free (`Object.is(0,-0)
  === false`), but under D1's SameValueZero it is a duplicate. L2's numeric pool
  is unspecified (line 166), while the random pool explicitly contains `+0` and
  `-0` (line 164).
- The plan claims "Latency workloads are duplicate-free … so every checking
  direction performs a full scan" (lines 181–183), but a mixed-sign zero makes D1
  return `true` at the early index, so D1 does **not** scan fully.
- The cross-direction check explicitly exempts this case: "every direction must
  produce the same result on duplicate-free inputs (except D1's documented zero
  case)" (line 263). M1 likewise permits D1 mismatches in the `±0` class (line
  192). So neither the result checksum nor parity flags the condition during the
  timed cell.
- EXP-1b gates D1's M2 ratio on L1/L2 (line 103), so an early return would be
  recorded as a valid speedup.

**Why it matters:** D1 is the README's named direction and CLM-1's performance
claim. A short-circuited scan on L1/L2 would inflate the paired ratio and
contradict the plan's own full-scan premise; a PASS would not be comparable to
D0/D2/D3/D4. This is exactly the baseline-fairness/harness-validity failure the
gate is meant to catch.

**Required action:**
1. Pin the L1/L2 numeric generator explicitly: exclude both `+0` and `-0` from
   timed workloads (or use a single zero sign only), and record the pool rule and
   resulting input checksum in the raw files. Keep signed-zero cases in C-zero
   for parity only.
2. Make the timed-cell checksum non-exempt: require every direction to return
   `false` on L1 and `true` on L2; any disagreement aborts the cell as
   harness-invalid. Confine "D1's documented ±0 class" to the parity corpus
   (M1/C-zero), not to gated latency cells.
3. Add one explicit assertion/record for the fix: generated L1 at n=10k contains
   neither `+0` nor `-0`; D1 returns `false`; the raw file stores the check.

**Pass condition (re-review):** the plan states the L1/L2 pool rule, the
non-exempt cell-result check, and the abort rule; §9 no longer exempts D1 from the
timed-cell result check. (D1 may still be non-adoptable under A2; its timing
information must nevertheless be comparable.)

---

## P2 — material, must be resolved in the same revision (non-blocking for the gate verdict, which is already REVISE)

### P2-1 [P2][non-blocking] D4 has two incompatible decision rules; PASS/FAIL is undefined in the 1.0×–2.0× range

**Location:** `PLAN.md` §2 D4 kill criteria (line 50); §4 EXP-4b (line 127); §7
M2/M3 (lines 193–194).

**Evidence:** EXP-4b says "M2 on L1 and L2" and then separately "the D4 gate
states 'not slower than baseline at n=10k' and 'not dominated by an exact Set
variant'"; M2 is "median S ≥ 2.0 and 95 % bootstrap CI low > 1.2 on both L1 and
L2". A D4 result at, say, S = 1.3× satisfies "not slower" but fails M2. EXP-4b
also says "M3 slope need not be ≤1.5", while M3 is listed as gating (line 194).
**Why it matters:** CLM-4's classification and the evidence matrix need a
pre-declared rule; choosing after seeing the number is a threshold change. **Does
not block the gate by itself** because D4 is an independent cross-check and the
main candidate set (D1/D2/D3) is unaffected. **Required action:** state exactly
one applicable rule per direction in §7 (e.g., D4: M1 + median S ≥ 1.0 with CI
low > 0.8 + "not dominated by the best exact Set variant on L1/L2"; M3 reported
non-gating), or apply M2 uniformly and mark D4 expected to fail. **Pass
condition:** re-review sees a single unambiguous PASS/FAIL/CANNOT CONCLUDE rule
for D4, consistent between §4 and §7, including whether M3 gates it.

### P2-2 [P2][non-blocking] M4 gates on "peak ΔRSS" but measures a post-call value

**Location:** `PLAN.md` §7 M4 (line 195); §8 memory protocol (lines 241–251,
especially line 250); §9 "Memory not captured" (line 270).

**Evidence:** the gate is "heap delta ≤ 64 B/item and peak ΔRSS ≤ 128 MB"; the
protocol snapshots `heapUsed`/`rss` only after the call returns, with no in-call
sampling, and §8/§9 admit this is a lower bound on peak. A candidate whose peak
occurs mid-call can pass while exceeding 128 MB peak. **Why it matters:** M4 is
gating and supports the memory claim; the current wording could let a memo say
"peak" while the evidence is a lower bound. **Does not block the gate by itself**
because the plan already discloses the bound and restricts wording; the defect
is a definition/claim mismatch. **Required action:** rename the metric and gate
to "post-call heap delta / post-call ΔRSS (lower bound on peak)" and forbid
"peak" in memo/claim wording, or add a real peak measurement. **Pass condition:**
M4 metric name, gate, and allowed claim wording all say post-call lower bound, and
the memo rule in §14 reflects it.

### P2-3 [P2][non-blocking] No discriminating/negative control for the parity harness; D0's self-comparison is tautological

**Location:** `PLAN.md` §4 EXP-0a (line 91); §9 "Wrong oracle" row (line 262);
§7 M1 (line 192); §6 corpus (lines 160–176).

**Evidence:** EXP-0a compares "the same source" to itself; identical-by-
construction, it cannot fail. The cross-direction checksum only asserts equal
booleans on L1/L2 (all false / all true), which a miswired harness that resolves
the candidate to the oracle also satisfies. M1's D1 rule permits the only known
divergence (`±0`), so a miswire yields zero mismatches and "passes"; there is no
mutant or hand-computed expected-value table. **Why it matters:** M1 is the
primary correctness gate for all four directions; without a positive control,
"0 mismatches" is not evidence that the harness can detect a mismatch. **Does not
block the gate by itself** because the harness code does not exist yet and the
corpus/parity wiring can be inspected later; it is a material evidence-design
gap. **Required action:** add a deliberately wrong control candidate (e.g.,
always `false`, or Set without the zero guard) and require M1 to report ≥1
mismatch in `data/raw/parity-control.json`; alternatively add a hand-computed
expected-result table for ≥10 curated cases (`[NaN,NaN]`, `[0,-0]`, `[1,1]`,
`[1,2]`, holes, shared refs, …) and require exact agreement. Record the control
in the evidence matrix. **Pass condition:** re-review sees the control artifact
and the rule that a control mismatch is required for harness validity, plus the
D1 `±0` mismatch asserted as a positive control (or replaced by the mutant).

---

## P3 — minor observations (not counted; fix in the same revision if convenient)

- **P3-1 — memory run-count arithmetic.** §5 says "Memory … 6 runs | 120 s"
  (line 146), but §8 says candidate cells get 3 runs and baseline 1, with
  M-numbers for D0–D4 plus M-objects for D3 = 1 + 4×3 + 3 = **16 processes**, not
  6. The "Count" column is counting cells, not runs. Correct the unit/budget or
  the run policy; this matters for the 7-minute R3 claim. Required action: make
  §5 and §8 agree and re-check the timebox. Pass condition: re-review arithmetic
  is consistent.
- **P3-2 — D3's D2-dominance kill criterion is not operationalized.** §2 (line
  49) says "no material latency/memory gain over D2 (within MDE)" but §7 has no
  D2-vs-D3 metric/threshold (S2/L3 is non-gating). Either define the comparison
  (e.g., D3's median S vs D2's on L1/L2 and M-numbers) or mark it a report-only
  observation. Required action: add the comparison rule or downgrade the kill
  criterion explicitly. Pass condition: re-review sees the rule.
- **P3-3 — "rerun-one-anomaly" has no anomaly/rerun policy.** §5 line 149
  budgets a rerun buffer, but §11 does not define an anomaly trigger or whether a
  rerun replaces only the outlier rep or the whole cell. Add a rule (e.g., reruns
  only on harness-invalid signals; both original and rerun retained; a rerun of
  one rep is forbidden). Required action: define it before R3 to avoid a
  cherry-picking ambiguity. Pass condition: re-review sees the policy.
- **P3-4 — CLM-3 wording.** CLM-3 (line 424) mentions "incl. object-heavy", but
  L3/S2 are explicitly non-gating; the memo must not let CLM-3 carry an
  object-heavy performance claim from a 3-rep exploratory cell. Required action:
  mark object-heavy as exploratory in the anticipated claim. Pass condition:
  wording is consistent with S2.

---

## Residual risks (carry into R3/R4; cannot be removed by this review)

1. **Single host, single Node version, dev desktop, no CPU pinning/governor/NUMA
   or isolated benchmark host** (`PLAN.md` §9, §13). Results are "measured here
   on synthetic Node 22 microbenchmarks", never production.
2. **7 reps** produce a wide bootstrap CI; even after fixes, a PASS is
   support for a candidate, not adoption (`PLAN.md` §7 interpretation rules).
3. **Synthetic distributions and unknown real input size/frequency (G1).** The
   plan's default primary n = 10k is an assumption; if real callers use n ≤ 50,
   D0 may still be correct regardless of the measured speedup. S1 is
   exploratory only.
4. **Memory evidence is a post-call lower bound**, page-granular for RSS, and
   the baseline memory at 100k may be unmeasured (180 s cap). Peak in-call memory
   remains unproven.
5. **D4 comparator correctness** remains the main implementation risk (G3); the
   property checks are strong but 20k random triples are not a proof.
6. **D3's weak-memory premise may not materialize** (G4); the local `WeakSet` is
   discarded at return, so no GC benefit is assumed.
7. **Artifacts are outside git.** Because the worktree is under the parent
   repo's ignored `/.tmp/`, retention/cleanup is filesystem-only and cannot be
   verified by a commit. The env/file hashes are the only provenance; keep them
   with the raw data.
8. **This review only validates the plan.** It does not validate the harness
   implementation (not yet written), the corpus generator, or the candidate
   spikes. The results review must re-check those and must be a different agent
   from this reviewer (`PLAN.md` §12; review rubric).

---

## Re-review checklist

Re-review will check: (a) P1-1 hash-based fit control + corrected provenance;
(b) P1-2 pinned L1/L2 pool and non-exempt cell-result check; (c) P2-1 single D4
rule; (d) P2-2 M4 post-call wording; (e) P2-3 parity negative control; and
regressions against the otherwise-passing areas. The verdict must be signed
again. Until PASS, R3/demos stay blocked; the approved directions (D1–D4 + D0
control) and the decision frame are not reopened by this review.

**Signed:** `plan-reviewer-1` / `deepseek-flash` / `deepseek-official` —
2026-11-25T03:48:59Z

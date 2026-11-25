# MEMO-REVIEW — delta review of `memo.md` (results-reviewer-2)

**Verdict: PASS.**

**Gate result:** every substantive memo claim maps to a reviewed `C-`/`P-`/`U-`
claim; all are `supported` or `partial` with the mandatory limit; no `partial`
supports adopt/migrate; no adoption, migration, or security recommendation
appears; the 19 allowed-wording rows are verbatim; the reduced-scope limits are
carried through; every measurement/provenance number was traced to the reviewed
claims or the reviewed data. **0 P0, 0 P1, 0 P2; 5 P3 non-blocking** (the memo
review's N-1…N-5, distinct from the results review's five P3 findings F-1…F-5).

## Reviewer record

| Field | Value |
|---|---|
| Role | independent results reviewer #2, memo delta review (R5 delta gate); not author, experimenter, synthesizer, or prior reviewer |
| Identity | `results-reviewer-2` |
| Model / provider | `deepseek-flash` / `deepseek-official` |
| Time (UTC) | 2026-11-25T04:15:51Z |
| Inputs, in order | `memo.md`; `CLAIMS.md`; `RESULTS-REVIEW.md`; `RESULTS-REVIEW-R2.md` (**absent**); `data/raw.json`; `data/env.json`; `harness/bench.mjs`; `REDUCED-RUN.md`; `src/dedupe.js`; `test/dedupe.test.mjs`; `package.json` |
| Memo full-file SHA-256 | `b260ada85e447dcc59827f12601617ef453db7a50955be285150d177ab642f1d` (21,892 bytes) |
| Memo content SHA-256 | `aa9cc0bef4b238f6ce47a7fb57b5a0c935d45d6f8bf869350c1ca6f6f6c0955b` — recomputed as the SHA-256 of all bytes above the memo's final stamp line (21,750 bytes); matches the stamp |
| Concatenated input SHA-256 | `a24387e7ca00ad81f742cff7f5b719c9c4dc4c948e3a4cf9af29c5c01338381f` (171,389 bytes, order: `memo.md`, `CLAIMS.md`, `RESULTS-REVIEW.md`, `raw.json`, `env.json`, `bench.mjs`, `REDUCED-RUN.md`) |
| Per-file SHA-256 | memo `b260ada8…42f1d`; CLAIMS `e0a6f130…42afd2`; RESULTS-REVIEW `0bf982e4…9891710`; raw `75962457…07ef37`; env `55b48d00…5d8c42`; harness `9c4a53f7…efb10c`; REDUCED-RUN `69d8e532…a70e913` |
| Prior results verdict | `RESULTS-REVIEW.md` — **PASS**, 90/100 reduced-run evidence quality, 0 P0/0 P1/0 P2/5 P3, reviewer `results-reviewer-1`, 2026-11-25T04:03:19Z. Read as a delta input; the claim checks were made directly against `CLAIMS.md` and `data/raw.json` first. `RESULTS-REVIEW-R2.md` does not exist (checked); no second results cycle is recorded. |
| Prompt hash | Not available as a file (instruction delivered in-session); no claim made |
| Independence | I did not write `memo.md`, `CLAIMS.md`, `RESULTS-REVIEW.md`, `PLAN.md`, `REDUCED-RUN.md`, `harness/bench.mjs`, `data/raw.json`, `data/env.json`, or any production file. Read-only checks: `sha256sum`, `node --test`, JSON parsing, in-memory median/ratio/validity recomputation, and a character-level diff of the allowed-wording tables. I did **not** rerun the timing harness (it would overwrite `raw.json`/`env.json`). The only write is this file. |
| Reviewer separation | Different agent from `results-reviewer-1`; same model/provider (`deepseek-flash` / `deepseek-official`) is recorded. This memo makes no adopt/migrate/security claim, so the high-risk cross-model requirement is not triggered; no prior rejection or replacement occurred. |
| Rerun / recompute | Not required for adopt/migrate/security (none exists). I recomputed all eight cell medians from the 24 retained reps, all four descriptive ratios, the four "every D0 rep > every D2 rep" checks, the 24 exit/input/result checks, the 9/14 mutant mismatch set, both 14/14 parity results, all five validity flags, and all artifact/production hashes. All matched. |

**Why this is a delta review.** `RESULTS-REVIEW.md` passed the *reduced run* and
explicitly stated that any later memo must map every sentence to `C-`/`P-`/`U-`
IDs and that any new claim is unsupported until reviewed. `memo.md` is that new
artifact; this review is the memo-level gate. It does not re-score the results
(the 90/100 is the prior results-review score, not a memo score) and does not
turn the memo into user approval.

## Gate summary

| Check | Result |
|---|---|
| Memo hash and self-stamp | **pass** — full-file `b260…` and content `aa9c…` both recomputed; stamp semantics verified |
| Claim mapping | **pass** — every substantive measurement/limit/recommendation sentence maps to `C-`/`P-`/`U-`; grouped table below |
| Exact allowed wording | **pass** — §3.1 (15 rows) and §3.2 (4 rows) are character-identical to `CLAIMS.md`; 19/19 |
| Unsupported `U-1…U-9` | **pass** — none asserted; they appear only as excluded/negated statements |
| `partial` claims | **pass** — P-1…P-4 carry their mandatory limits; no `partial` supports adopt/migrate or a gate |
| Adoption / migration / security recommendation | **pass** — none; modality is `candidate / pilot only`, next step left to the user (OQ-5) |
| Reduced-scope limits | **pass** — §2 "Not executed", §4.4, §5, §7, §8, §9, §10; no full-plan inheritance |
| Numbers trace | **pass with P3 provenance notes** — every measurement number appears in the reviewed claims; provenance-only values are sourced to reviewed data (N-4); §6's illustrative `n≈10–50` is argument, not a claim (N-1) |
| Production unchanged | **pass** — `src/dedupe.js` `b54842d6…8850`, `test/dedupe.test.mjs` `9e8c8dc6…eae48`, `package.json` `a770daf3…ca89` match the R2/pre/post values; `node --test` passes (1 test, 0 fail) |
| No unreviewed memo change | **pass** — this PASS applies only to the hashed memo; no earlier memo hash exists to compare |
| Recommendation IDs | **none exist** — no `REC-1..n` in the run record or memo, so none can be unmapped |

## Claim mapping table

Grouped by memo paragraph; each row represents the measurement, validity, scope,
or recommendation facts in that paragraph. IDs are the only permitted basis for
the sentence(s).

| Memo location | Substantive claim (abridged) | Claim ID(s) | Status | Evidence / check |
|---|---|---|---|---|
| Header (3–6, 12–16) | Built only from `CLAIMS.md` + `RESULTS-REVIEW.md`; no new measurements; `measured-here`, one host, synthetic, 3 reps; candidate/pilot only | C-1…C-15, P-1…P-4, U-4 | supported / compliant | No new measurement sentence; every number traced below; U-4 only negated |
| Header (10) | Decision frame: replace the O(n²) `hasDuplicateSlow`? | DECISION §1 (frame) | frame, not a result | `src/dedupe.js` nested `i<j` `Object.is` scan; decision frame only, no outcome asserted |
| Header (14–15) | Prior results review PASS, 90/100, 0 P0/0 P1/0 P2/5 P3, reviewer/time | RESULTS-REVIEW | verified | Matches `RESULTS-REVIEW.md` reviewer record and score line exactly |
| Header (17) | "memo not separately reviewed as a memo" | metadata | **stale after this review** | N-5; this document is that review |
| §1.1–1.2 (28–33) | No adoption/migration/security; D0 remains baseline/control; no D0 supersede | U-4, U-9, C-11 | compliant-negative | Only negated; "candidate/pilot" restricts scope |
| §1.3 (34–38) | Validity checks passed; reviewer regenerated inputs/recomputed medians; D0 medians > D2 in all four cells; D2 matched 14 curated cases | C-1, C-2, C-3, C-5, C-7, C-8 | supported | Exact claims; all recomputed in raw |
| §1.4 (39–41) | Next step (full study / reduced follow-up / pilot / stop) is user-owned; memo chooses none | OQ-5 (DECISION) | no claim | Options listed, none recommended |
| §1.5 (42–44) | No production change; `src/`, `test/`, `package.json` hashes identical and match R2 | C-11 | supported | `sha256sum` matches raw before/after and R2 |
| §2 executed (48–51) | D0 is production import; D2 is Set + signed-zero guard inline in harness | C-11 + `REDUCED-RUN.md` §3 | supported fact; C-11 is a mis-cite for the identity | raw `deviationsFromFullPlan` items 5–6; harness lines 37, 74–88; N-2 |
| §2 workloads (52–53) | Unique nonzero integers n=1000/5000/10000; one duplicate pair at 9998/9999, n=10000 | C-3, C-9 | supported | raw `workloads`; four `inputSha256`; `duplicatePairIndices=[[9998,9999]]` |
| §2 protocol (53–55) | Fresh child per rep; 3 untimed warmups; 3 timed reps; alternating order; median of 3 | C-1, C-2, C-7; CLAIMS scope | supported | raw `protocol`; CLAIMS header "3 timed reps / 3 warmups"; 24 runs audited |
| §2 host (57–59) | Node 22.23.2, V8 12.4.254.21-node.56, npm 10.9.8, Ryzen 9 9950X, 32 logical CPUs, 62,307,296 kB, loadavg 0.06/0.13/0.37 | C-13 | supported | All values in `env.json`; C-13 evidence row lists CPU/logical CPUs/RAM |
| §2 provenance (65–69) | Command, cwd, 04:00:08.181Z→04:00:09.153Z, 972.2 ms | no claim ID; provenance | verified provenance | `REDUCED-RUN.md` §3; `env.json` `generatedAtUtc`/`finishedAtUtc`/`durationMs`; RESULTS-REVIEW §1 lists 972.2 ms (N-4) |
| §2 exit code (70–74) | Harness exit code not recorded (F-2); `harnessValid=true` and all five checks; reviewer did not rerun but regenerated inputs/recomputed medians | C-1, C-3, C-7; F-2 | supported | `raw.harnessValid`; five `validityChecks`; F-2 text says the exit code is not recorded |
| §2 artifact hashes (75–79) | `raw.json`, `env.json`, `bench.mjs`, `REDUCED-RUN.md` SHA-256 | CLAIMS header / RESULTS-REVIEW §5 | verified | `sha256sum` matches all four |
| §2 production hashes (80–85) | `src/`, `test/`, `package.json` full SHA-256 | C-11 | supported | `sha256sum` matches raw before/after |
| §2 not executed (87–92) | D1/D3/D4; C-core/C-zero/C-rand; L2/L3; scaling; 100k memory; small-n; gates; 7 reps/CI; overhead; mutant path; D1 ±0 control | C-14, C-15 | supported negative | `deviationsFromFullPlan` (8 items), `limitations`, no such cells/artifacts; sizes 1k/4k/16k/100k appear in the reviewed deviations (N-4) |
| §2 stale note (94–98) | Raw "unreviewed" note superseded; raw not rewritten to preserve hashes | F-5 | supported documentation | F-5; raw/env hashes unchanged |
| §2 doc gaps (100–103) | No `EVIDENCE-MATRIX.md` / `REVIEW-LOG.md`; future study should add them | F-2, DECISION §7 | documentation; F-2 is a mis-cite | Directory listing confirms absence; DECISION §7 plans both; F-2 is the command-log/exit-code finding (N-3) |
| §3.1 (113–129) | The 15 supported claims and their exact allowed wording | C-1…C-15 | supported | 15/15 rows character-identical to CLAIMS; statuses match |
| §3.2 (137–142) | The 4 partial claims and mandatory limits | P-1…P-4 | partial-with-limit | 4/4 rows character-identical; no partial cited for adopt/migrate |
| §3.3 (144–152) | U-1…U-9 excluded | U-1…U-9 | compliant-negative | Listed as unsupported, not asserted |
| §4.1 (156–166) | Validity/integrity: all five checks, 24 runs, input regeneration, mutant 9/14, reps retained, production/suite/host | C-1, C-2, C-3, C-6, C-10, C-11, C-12, C-13 | supported | All values recomputed from raw; `node --test` re-run |
| §4.2 (168–174) | D0 14/14; D2 14/14 incl. ±0 orders and NaN; parity beyond 14 cases not established | C-4, C-5, P-1 | supported + partial limit | `parity.d0`/`parity.d2` 14/14; P-1 limit stated |
| §4.3 (176–190) | Medians, ratios, all D0>D2, duplicate true, late pair, raw spread/outlier; n=1000 ~0.059 ms descriptive only | C-7, C-8, C-9, P-2, P-3, P-4; F-4 | supported + partial limits | Recomputations match; F-4 wording present |
| §4.4 (192–196) | Only D0/D2/four workloads measured; no CI/bootstrap | C-14, C-15 | supported negative | raw scope/deviations/limitations; no CI fields |
| §5 (200–226) | Nine "what cannot be concluded" bullets: M1 parity, M2, M2-D4/M3/M4, D1/D3/D4, L2/L3/16k/100k/small-n, production/generalization, decision, statistical sufficiency, full-plan gate | P-1/U-6; C-15/P-2/U-1/U-8; C-14/U-2/U-3; C-14/U-6; C-14; C-13/C-14/U-5; U-4/U-9; C-10/P-3/U-8; U-7 | supported / compliant-negative | Each exclusion is backed by the cited claim; no affirmative use of U-* |
| §6 (228–241) | Counter-case: early duplicate, small n, Set overhead could reverse the direction; explicit argument, not a claim | none (explicit non-claim) | argument | No measurement asserted; illustrative `n≈10–50`/`0/1` are not reviewed claims (N-1) |
| §7 (245–252) | Confidence table: artifacts consistent (High); D0>D2 descriptive (High, descriptive); effect stability not established; parity beyond 14 not established; no gate; no adoption | C-1/C-2/C-3/C-10/C-11/C-12/C-13; C-8; C-15/P-2/P-3/U-8; P-1/U-6; U-1/U-2/U-3; U-4 | consistent | Confidence labels match the claim statuses; no "High" attached to an unsupported conclusion |
| §7 (254–257) | 90/100 is reduced-run evidence quality, not full-plan/decision | RESULTS-REVIEW | verified | Same qualifier as the review |
| §8 (261–269) | D0 control; D1/D3/D4 unmeasured; D2 candidate only; D5–D13 not approved/unmeasured | U-9, C-14, U-6, C-5/C-7/C-8, U-4; DIRECTIONS | supported / compliant-negative | No direction rejected on evidence; no ranking |
| §9 (271–290) | OQ-1…OQ-7 (workload, ±0 contract, runtimes, license, next step, untested shapes, ownership) | C-13, C-14, U-2, U-3, U-5; DECISION refs | open questions, not claims | No answer asserted; user-owned |
| §10 (292–304) | User acceptance required; candidate/pilot; `HANDOFF.md`; no production authorization; delta-review trigger | policy; C-11 | compliant | No acceptance claimed; no deployment/commit |
| §11 (306–318) | Provenance hashes and self-stamp | C-11, C-12, C-13; verified hashes | verified | Full-file `b260…`; body `aa9c…`; all listed hashes recomputed |

## Findings

### N-1 [P3][non-blocking] §6's "common inputs around n ≈ 10–50" is an assumption, not a reviewed claim

- **Location:** `memo.md` line 234 (§6); line 273 (OQ-1); `DECISION.md` §3 line 66; `PLAN.md` S1 line 264.
- **Evidence:** "At small n (common inputs around n ≈ 10–50) the `Set` overhead could exceed the nested scan…". `CLAIMS.md` has no claim about real input sizes; U-5 excludes generalization and OQ-1 says the real distribution is unknown. `DECISION.md` calls n=50/500 "common small inputs" and `PLAN.md` S1 adds n=10/50/500 as non-gating sensitivity sizes — an R0 assumption, not this run's measurement. The only measured sizes are 1000/5000/10000.
- **Why it matters:** A reader could take 10–50 as the likely real input size and over-weight the small-n counter-case. It does not invalidate any measured claim and cannot support adoption.
- **Why it does not block:** §6 is explicitly labelled "argument, not a measured claim"; the paragraph hedges with "could"; OQ-1 and §5 correctly state the real distribution is unknown; and no conclusion, recommendation, or gate rests on it. The range is traceable to the approved decision frame's small-n assumption.
- **Required action:** In any revision, replace "common inputs around n ≈ 10–50" with an explicit assumption, e.g. "for example n ≈ 10–50, a size not measured here; the real input distribution is unknown (OQ-1)".
- **Pass condition:** No memo sentence asserts a typical real input size or frequency without labelling it an unmeasured assumption; the §6 disclaimer remains.

### N-2 [P3][non-blocking] §2 cites C-11 for facts C-11 does not cover

- **Location:** `memo.md` lines 51–55 (§2 "Executed").
- **Evidence:** The sentence identifies D0 as the production import and D2 as the inline harness candidate and cites "(C-11, and `REDUCED-RUN.md` §3)". `CLAIMS.md` C-11 is only "production `src/`, `test/`, and `package.json` SHA-256 values were identical before and after the run and match the R2 values"; it does not state where D2 is defined.
- **Why it matters:** Mapping hygiene: the identity facts are real and verified, but a reader following C-11 alone cannot verify them.
- **Why it does not block:** `raw.deviationsFromFullPlan` items 5–6 state both facts, harness lines 37 and 74–88 show the import and the inline implementation, and the harness SHA-256 fixes the measured code. No measurement conclusion depends on the citation.
- **Required action:** Cite `REDUCED-RUN.md` §3 / `raw.deviationsFromFullPlan` items 5–6 for the identity; reserve C-11 for hash invariance.
- **Pass condition:** Every memo fact has a matching claim or explicitly named non-claim source.

### N-3 [P3][non-blocking] §2 doc-gap sentence cites F-2 for artifacts F-2 does not discuss

- **Location:** `memo.md` lines 100–103.
- **Evidence:** "No `EVIDENCE-MATRIX.md` and no `REVIEW-LOG.md` exist … A future full study should add those artifacts (F-2, and `DECISION.md` §7's planned outputs)." `RESULTS-REVIEW.md` F-2 is "No command log / recorded harness exit code"; it does not cover `EVIDENCE-MATRIX.md` or `REVIEW-LOG.md`. `DECISION.md` §7 does plan both.
- **Why it matters:** Minor citation drift; a reader could look in F-2 for a finding that is not there.
- **Why it does not block:** The absence is verified, DECISION §7 supports the planning statement, and no claim depends on it.
- **Required action:** Cite `DECISION.md` §7 (and `RESULTS-REVIEW.md` §5 for the memo-stamp requirements); keep F-2 for the exit-code/command-log gap.
- **Pass condition:** F-2 is cited only for the command-log/exit-record limitation.

### N-4 [P3][non-blocking] Some provenance numbers are verified from data but are not in the CLAIMS claim rows

- **Location:** `memo.md` lines 68–69 (window 04:00:08.181Z→04:00:09.153Z, 972.2 ms), 51–55 (3 warmups), 88–91 (1k/4k/16k, 100k, M2-D4).
- **Evidence:** These are correct (`env.json` `generatedAtUtc`/`finishedAtUtc`/`durationMs`; `raw.protocol.warmupCalls=3`; `raw.deviationsFromFullPlan` item 2 and 7), and 972.2 ms is also in `RESULTS-REVIEW.md` §1. `CLAIMS.md` C-13's allowed wording omits the timestamps/duration and C-14 names categories rather than 1k/4k/16k/100k.
- **Why it matters:** The memo is transparent about the source ("from `data/env.json`", "`REDUCED-RUN.md` §3"), and none of these are measurement claims, but they are numbers outside the claim table.
- **Why it does not block:** Every value matches the reviewed raw/env data; none is used to assert an effect, gate, or decision. The memo's claim-mapping rule applies to "substantive measurement sentences", and these are provenance.
- **Required action:** Keep the source labels; if the claims table is regenerated, add a provenance note row rather than promoting them into C-13/C-14.
- **Pass condition:** Any future memo revision labels provenance numbers as provenance, not as measured claims.

### N-5 [P3][non-blocking] Header metadata "memo not separately reviewed as a memo" is now stale

- **Location:** `memo.md` line 17 (Author row).
- **Evidence:** The row says "memo not separately reviewed as a memo — its claims are the reviewed ones below". That was true when written; this `MEMO-REVIEW.md` is the separate memo review of the current hash.
- **Why it matters:** A user reading only the memo could think no memo-level review exists.
- **Why it does not block:** This review record is the correction; the memo's substantive claims are unchanged and now reviewed; the memo already requires user acceptance before use, and its stamp remains valid.
- **Required action:** In any revision, update the reviewer row to cite `MEMO-REVIEW.md` (verdict PASS, hash) and re-stamp; a metadata-only edit still requires an expedited delta check.
- **Pass condition:** The memo's metadata matches its stamp and the review record, or `MEMO-REVIEW.md` remains the binding memo-level record.

## Allowed wording

The only permitted wording is the `CLAIMS.md` allowed-wording column as reproduced
in `memo.md` §3. Checked character-for-character:

- **C-1…C-15 (15 rows):** allowed-wording columns identical to `CLAIMS.md`
  (C-5's status annotation is worded slightly differently; the 14-case limit is
  equivalent); `supported`, with C-7/C-8 restricted to descriptive observations,
  C-5 to the 14-case table, C-14/C-15 negative.
- **P-1…P-4 (4 rows):** identical to `CLAIMS.md`; each limit is mandatory. No
  `P-*` claim is used to support adopt, migrate, a gate, or production.
- **U-1…U-9:** must not appear as assertions. The memo only negates/excludes them
  (e.g. "not a gated M2 result", "no full-plan gate", "no adopt/migrate"). The
  strongest permitted substitutes are `CLAIMS.md` §C.
- The memo's in-text paraphrases in §1/§4/§5 stay within these limits and assert
  no broader comparative result: "faster" appears only in the decision question
  (not as a finding), and "superior"/"production-ready"/"recommended" appear only
  negated.
- No `REC-1..n` recommendation exists to map; "candidate / pilot" is a modality
  restriction, not a recommendation, and OQ-5 lists options without choosing.

## Number trace

| Number family | Memo location | Reviewed source / result |
|---|---|---|
| 24 runs, 8 cells, 3 reps, 3 warmups, median-of-3 | §2, §4, §7 | C-1, C-2, C-7, C-10; CLAIMS scope; raw `protocol`/`runs`/`cells` |
| n = 1000/5000/10000, duplicate pair 9998/9999 | §2–§5, §8 | C-3, C-9; raw `workloads`/`runs` |
| 14 cases, 14/14, 9/14 mismatches | §4, §5, §7 | C-4, C-5, C-6; raw `parity`/`controls` |
| Medians 0.169/3.431/13.844/13.818 and 0.059/0.153/0.323/0.323 ms | §4.3, §7 | C-7; recomputed all eight medians exactly |
| Ratios 2.86×/22.37×/42.86×/42.77× (2.858347/22.370288/42.864896/42.770192) | §3, §4.3, §5, §7 | C-7, P-2; recomputed all four from raw medians |
| 0.4073 ms outlier | §3.2, §4.3, §5, §7 | C-10, P-3; raw `d2/unique-5000` rep 2 |
| Node 22.23.2, V8 12.4.254.21-node.56, npm 10.9.8, Ryzen 9 9950X, 32 CPUs, 62,307,296 kB, 0.06/0.13/0.37 | §2, §3.1, §5, §7 | C-13; `env.json`; C-13 evidence row |
| 1 test, 2 assertions, 1 test/0 fail | §3.1, §7, §11 | C-12; `raw.existingSuite`; live `node --test` pass |
| 90/100, 0 P0/0 P1/0 P2/5 P3, 2026-11-25T04:03:19Z | header, §7 | `RESULTS-REVIEW.md` reviewer record and score |
| Window 04:00:08.181Z→04:00:09.153Z, 972.2 ms | §2 | `env.json`; RESULTS-REVIEW §1 (N-4) |
| 1k/4k/16k, 100k, 7 reps, 95% bootstrap | §2, §5 | C-14 evidence/`deviationsFromFullPlan`; U-1 evidence; N-4 |
| n ≈ 10–50, indices 0/1 | §6 | **not in reviewed claims** — explicitly labelled argument, not measurement (N-1) |
| All listed SHA-256 values | §2, §11 | `CLAIMS.md` header/evidence, RESULTS-REVIEW §5; independently recomputed |

Every number in a claim or provenance sentence is accounted for. The only
numbers outside the claim set are §6's illustrative argument (`n≈10–50`,
indices 0/1), which the memo explicitly excludes from claims (N-1).

## What cannot be concluded

This PASS does **not** establish and the memo does **not** claim:

- full M1 parity (C-core ~40, C-zero, 10k mixed-type/object corpus were not run);
- M2 or M2-D4 (no 7 reps, paired ratios, bootstrap CI, MDE, or L2 workload);
- M3 scaling (no 1k/4k/16k fit) or M4 memory (no 100k cell);
- any D1/D3/D4 result (unmeasured, neither validated nor rejected);
- L2/L3, 16k, 100k, small-n, or early-duplicate behavior;
- generalization to real callers, browsers, Deno/Bun, or other Node versions;
- statistical significance or a decision from 3 reps;
- D0 superseded, D2 production-ready/adoptable/recommended/superior;
- satisfaction or inheritance of the full `PLAN.md` R2 gate.

The only permitted conclusion is the reduced-scope, descriptive one in
`CLAIMS.md` C-1…C-15 with P-1…P-4 limits; the modality remains candidate/pilot
and any next step is user-owned (OQ-5).

## Residual risks

1. Single host, single runtime, synthetic integer arrays, 3 reps, no CI.
2. 14 curated parity cases only; D2 correctness beyond them is code reasoning,
   not measurement.
3. n=1000 D2 cell ~0.059 ms is near timer/JIT overhead; no overhead control.
4. One visible D2 unique-5000 outlier; variance not estimated.
5. Missing `REVIEW-LOG.md`/`EVIDENCE-MATRIX.md` and no harness exit-code record;
   `MEMO-REVIEW.md` supplies the memo-level reviewer record.
6. Raw/env "unreviewed" notes remain stale by design to preserve hashes (F-5).
7. §6's small-n assumption is unmeasured (N-1).

## Memo stamp and delta trigger

- **Reviewed memo:** `memo.md` full-file SHA-256
  `b260ada85e447dcc59827f12601617ef453db7a50955be285150d177ab642f1d`;
  content SHA-256 (bytes above the memo's final stamp line)
  `aa9cc0bef4b238f6ce47a7fb57b5a0c935d45d6f8bf869350c1ca6f6f6c0955b`.
- **Stamped claim IDs:** C-1…C-15, P-1…P-4, U-1…U-9.
- **Verdict:** **PASS** for this exact hash, as reduced-scope, descriptive,
  measured-here evidence with the stated limits.
- **Delta trigger:** any wording, number, claim-ID, or hash change in `memo.md`
  (including the N-1…N-5 wording fixes), or any edit to `CLAIMS.md`,
  `RESULTS-REVIEW.md`, `REDUCED-RUN.md`, `PLAN.md`, `PLAN-REVIEW-R2.md`,
  `data/raw.json`, `data/env.json`, `harness/bench.mjs`, or new
  timing/parity/memory artifacts, requires a delta re-review with the changed
  claims, new hashes, and a new verdict before the affected claims are used
  again.
- **Not acceptance:** this PASS is a review gate, not user acceptance and not a
  decision to adopt. Research never migrates production.

**Signed:** `results-reviewer-2` / `deepseek-flash` / `deepseek-official` —
2026-11-25T04:15:51Z.

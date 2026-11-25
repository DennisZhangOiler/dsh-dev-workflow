# Reduced research E2E (0.8 candidate)

This is a **real, independently reviewed, reduced-scope E2E**, not a full-plan
study and not an adoption decision.

- Project: disposable ESM `hasDuplicateSlow` library under `.tmp/headless-research`.
- R1: 14 directions proposed; D0 do-nothing + D1-D4 approved by the user.
- R2: independent plan review #1 returned **REVISE 86/100** with two P1 findings;
  the plan was revised; reviewer #2 returned **PASS 90/100**.
- R3: reduced D0 vs D2 run (n=1000/5000/10000, 3 reps, correctness/parity,
  pre/post production hashes).
- R5: independent results review returned **PASS 90/100** after blind `CLAIMS.md`
  extraction; no adoption/migration claim.
- R6/R7: memo and HANDOFF limit the result to **candidate / pilot only**.
- Production `src/`, `test/`, `package.json` were hash-identical before/after.

Reviewer identities/models/times and input/artifact hashes are recorded in
`PLAN-REVIEW.md`, `PLAN-REVIEW-R2.md`, `RESULTS-REVIEW.md`, `MEMO-REVIEW.md`, `CALIBRATION-INDEPENDENT-R4.md`, and `REVIEW-LOG.md`. The authoritative blind calibration is R4 (neutral F1-F7); earlier calibration files are historical. This is a reduced
run for gate evidence; omitted full-plan cells remain unmeasured.

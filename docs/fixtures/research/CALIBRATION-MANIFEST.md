# Author-side calibration manifest (not for reviewers)

This file is the answer key/expected verdicts for calibration. Reviewers must
not read this or `expected.json`; blind inputs are in `docs/calibration-inputs/`.

| Fixture | Expected | Actual (independent) |
|---|---|---|
| weak-plan.md | REVISE | REVISE 15/100 |
| narrow-directions.md | REVISE; coverage P2 not veto | REVISE 17/100 |
| single-run-strong.md | REVISE or partial with sandbox-single-run wording | REVISE |
| partial-adopt.md | REVISE | REVISE |
| vague-review.md | rejected | REJECTED |
| strong-plan.md | PASS | PASS 91/100 |
| floor-boundary.md | PASS at boundary | PASS 80/100 |

Actual authoritative output: `docs/e2e/0.8/research/CALIBRATION-INDEPENDENT-R4.md` (neutral F1-F7; prompt/key frozen in `CALIBRATION-PLAN-R4.md`). Earlier R3/R1 are historical. F7 was intended as a floor boundary but failed the floor audit; it is recorded as REVISE, not a PASS.

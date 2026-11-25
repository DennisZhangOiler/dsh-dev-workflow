# Research calibration fixtures

Inputs for `rd-workflow-research-review`; expected outcomes live in
`expected.json` so a reviewer does not see the answer while reviewing. Actual
independent outputs are in
`docs/e2e/0.8/research/CALIBRATION-INDEPENDENT.md` (7/7):

| Fixture | Expected | Actual |
|---|---|---|
| `weak-plan.md` | REVISE | REVISE 15/100, 7/7 areas below floor |
| `narrow-directions.md` | REVISE, coverage P2 not a veto | REVISE 17/100; coverage P2 |
| `single-run-strong.md` | REVISE or partial with sandbox-single-run wording | REVISE; adopt unsupported |
| `partial-adopt.md` | REVISE | REVISE; partial cannot support adopt |
| `vague-review.md` | rejected | REJECTED; no fields/evidence |
| `strong-plan.md` | PASS | PASS 91/100 |
| `floor-boundary.md` | PASS at the boundary | PASS 80/100, 2 P3 |

The actual output was produced by `calibration-reviewer-2` (not the lead) from
the seven inputs only, without reading `expected.json` or prior reviews. A
reviewer that passes a weak fixture fails calibration.

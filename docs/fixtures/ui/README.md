# UI calibration fixtures

Static fixtures for `rd-workflow-ui-rubric`. They are not a substitute for a
real scorer run; record actual scores/verdicts in `docs/VERIFICATION.md`.

| Fixture | Expected |
|---|---|
| `pass.html` | PASS: clear primary action, responsive, visible focus, readable contrast, 44px targets |
| `fail.html` | FAIL: visually polished but low contrast, tiny controls, and 390px horizontal overflow; must fail on floors/hard gates even if a naive total is high |
| `expected.json` | Expected verdict/floor failures; use as a manifest, not as the scorer's input |
| one-direction | Any one-direction UI design still needs an independent score; self-review only picks a direction |

The fail fixture must fail on Accessibility/mobile floors, not only total score.
Run with two independent scorers for important UI; record differences and a
third/human tie-break when the verdicts differ.

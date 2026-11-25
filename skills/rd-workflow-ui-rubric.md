# Generic UI rubric

Use for `UI design` only: new/materially changed hierarchy, layout, interaction,
primary action, density, UI surface, or touch/keyboard path. For `UI behavior`,
check before/after desktop+mobile screenshots, mobile overflow, keyboard, and
key actions without a design score. For `No UI`, do not score.

Use the project's rubric when one exists, but it may not weaken the floors,
mobile/keyboard checks, or a11y. Record which rubric was used. Judge the rendered
UI, not the intent or code.

## Inputs

- Desktop screenshot at 1440x900 and mobile at 390x844 (or the project's
  documented equivalents).
- The states required by the contract: normal, empty, loading, error, long
  text, large data.
- The key task and the primary action.
- Real interaction with the key actions (live page, not screenshots only).
- Measured evidence for overflow, contrast, touch targets, keyboard path,
  200% zoom/reflow, and the project's browser/device matrix where available.
- UI behavior: before/after 1440 and 390 screenshots, overflow/keyboard checks.

## Score (100 points)

| Area | Max | Floor | Checks |
|---|---:|---:|---|
| Task clarity and hierarchy | 20 | 16 | Purpose obvious; primary action most prominent; secondary actions don't compete; labels use the user's language. |
| Layout and responsiveness | 15 | 12 | Consistent grid/spacing/alignment; no overlap/clipping; desktop and mobile hold; no horizontal overflow. |
| Interaction and feedback | 15 | 12 | Key actions complete; click/tap, disabled, loading, success, failure visible; nothing important hover-only. |
| Visual quality and consistency | 15 | 11 | Colors/type/spacing/radii/icons from the project's system; density fits; no decorative noise. |
| Accessibility | 15 | 12 | Contrast, focus, names, keyboard order, 44x44 targets, no color-only meaning; zoom/reflow verified. |
| Content and edge states | 10 | 8 | Empty/error/loading/long-text/large-data designed and readable; copy specific and actionable. |
| Performance and perceived speed | 5 | 4 | Initial render usable; heavy lists/charts don't block; skeletons match layout. |
| Product and design-language fit | 5 | 4 | Reuses design system/patterns; matches character; no unrelated redesign. |

Total 100. Gate: **every area at/above its floor, total >= 85, no P0/P1**. Total alone never passes; a high total with Accessibility below floor is FAIL.

## Anchors and calibration

For every area use 0/50/100 anchors: 0 = missing/unusable; 50 = present but a
material gap; 100 = specific, measured, and task-fit. Require evidence for each
score (screenshot/measurement/interaction), not adjectives.

Calibrate scorers before use; static fixtures are under `docs/fixtures/ui/`:

1. a fixture that must PASS (clear primary action, responsive, a11y floor met);
2. a fixture that must FAIL (high total but Accessibility or mobile below floor);
3. a one-direction small UI design that still requires an independent score.

Important UI: use two independent scorers; if their totals differ by >7 points
or their gate verdicts differ, a third/human tie-break records the decision.
Store scores/findings with the input hash; re-score after changes, don't reuse a
stale number.

## Severity

- **P0 - Blocking:** data loss or corruption, security or permission bypass,
  the primary task impossible, or a blocking accessibility failure. Any P0
  fails the direction.
- **P1 - Major:** the primary task is materially broken or misleading, a
  required state is missing, or mobile is unusable. Any P1 fails the direction.
- **P2 - Moderate:** a secondary task or important polish is wrong; the user
  can work around it. The direction can pass only if the total still meets the
  gate and no P1 exists.
- **P3 - Minor:** cosmetic or consistency issue with no task impact.

## Hard gates

A direction passes only when all are true:

1. Every area is at/above its floor.
2. Total >=85.
3. No P0/P1, and no more than 3 unresolved P2 without an owner/waiver.
4. Real key actions complete on the live page.
5. Mobile 390 root width does not exceed the viewport; no important horizontal
   overflow; 200% zoom/reflow usable.
6. Keyboard path and focus visible; controls named; contrast measured; touch
   targets >=44x44; no color-only meaning.
7. No missing required state from the contract.
8. Project rubric (if any) retains equivalent hard gates.

## Deduction format

Every deduction names all fields; a bare score is not acceptable:

```text
[P1] <short title>
Location: <screen/route, element, selector if available>
Evidence: <screenshot file + viewport + state; measurement>
Reason: <what rule it violates>
User impact: <what the user cannot do or misunderstands>
Fix: <concrete change; token/component/value when known>
Re-review: <what must be true to remove this finding>
```

Group findings by severity, then by location. Do not invent precision: if a
measurement was not taken, say "not measured" and describe what was observed.

## Viewport checks

- Desktop: 1440x900. Mobile: 390x844. Use project equivalents when documented.
- Check 320px width only when the project claims support or the contract
  requires it; otherwise record the assumption.
- Use the project's browser matrix; at minimum the primary browser plus one
  alternate for high-risk UI. Check 200% zoom/reflow and screen-reader access
  where tooling exists.
- Verify the mobile layout with the browser's real viewport, not a scaled
  desktop screenshot.
- Check the first viewport and the full page; sticky headers and fixed actions
  must not cover content.
- For long text and large data, use realistic worst cases, not one short row.
- Remove PII/secrets from screenshots/test data; record what was masked.

## Scoring discipline

- The implementer never scores its own work.
- The verifier re-scores independently with new screenshots; it may not reuse
  the UI scorer's number or findings without rechecking them.
- If the project rubric and this rubric disagree, the project rubric wins;
  record which rubric was used.
- Report unresolved risks even when the score passes.
- No browser/screenshot capability: use the project's browser tooling; otherwise
  stop and ask for evidence. A mockup is not a verified screenshot; label it
  "unverified" and do not PASS on it.
- High-risk UI: run a task-based usability check (>=3 tasks; success, errors,
  time) or record why it is not possible; a high score is not user validation.

## Output template

```markdown
## Verdict
PASS / FAIL - <total>/100 - <one-line reason>

## Findings
### P0
### P1
### P2
### P3

## Gate checklist
- [ ] Every area at/above floor
- [ ] Total >=85
- [ ] No P0/P1; P2 resolved/waived
- [ ] Real key actions complete
- [ ] No mobile horizontal overflow; 200% zoom usable
- [ ] Keyboard/focus/contrast/touch targets verified
- [ ] Required states present
- [ ] Project rubric mapped without weakening gates

## Screenshots
- desktop: <path>
- mobile: <path>
```

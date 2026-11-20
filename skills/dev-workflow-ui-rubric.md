# Generic UI rubric

Use this rubric only for a `UI design` change: a new or materially changed
visual hierarchy, layout, interaction pattern, or UI surface. For `UI behavior`,
check the changed states and actions without a 100-point design score. For
`No UI`, do not use this rubric.

Use the project's own rubric when one exists. This rubric is the fallback. Read
the contract, then judge the rendered UI itself, not the intent or the code.

## Inputs

- Desktop screenshot at 1440x900 and mobile at 390x844 (or the project's
  documented equivalents).
- The states required by the contract: normal, empty, loading, error, long
  text, large data.
- The key task and the primary action.
- Measured evidence for overflow, contrast, and touch targets when available.

## Score (100 points)

| Area | Max | Checks |
|---|---:|---|
| Task clarity and hierarchy | 20 | Purpose is obvious; primary action is the most prominent; secondary actions do not compete; labels use the user's language. |
| Layout and responsiveness | 15 | Grid, spacing, and alignment are consistent; no overlap or clipping; desktop and mobile compositions both hold; no horizontal overflow. |
| Interaction and feedback | 15 | Key actions complete; click/tap states, disabled states, loading, success, and failure feedback are visible; nothing important is hover-only. |
| Visual quality and consistency | 15 | Colors, typography, spacing, radii, and iconography come from the project's system; density suits the task; no decorative noise. |
| Accessibility | 15 | Text and control contrast pass; focus is visible; controls have names; keyboard order is usable; touch targets are at least 44x44 CSS px; no color-only meaning. |
| Content and edge states | 10 | Empty, error, loading, long-text, and large-data states are designed and readable; copy is specific and action-oriented. |
| Performance and perceived speed | 5 | Initial render is usable; heavy lists or charts do not block; spinners/skeletons match the real layout. |
| Product and design-language fit | 5 | Reuses the existing design system and patterns; matches the product's visual character; no unrelated redesign. |

Total: 100. The gate is **>= 85**.

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

1. Score >= 85.
2. No P0 and no P1.
3. Mobile root width does not exceed the viewport, and no important element
   overflows horizontally.
4. Every key action in the contract can be completed.
5. No blocking accessibility issue: focus visible, control names present,
   contrast adequate, and the primary flow reachable by keyboard.
6. No missing required state from the contract.

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
  requires it.
- Verify the mobile layout with the browser's real viewport, not a scaled
  desktop screenshot.
- Check the first viewport and the full page; sticky headers and fixed actions
  must not cover content.
- For long text and large data, use realistic worst cases, not one short row.

## Scoring discipline

- The implementer never scores its own work.
- The verifier re-scores independently with new screenshots; it may not reuse
  the UI scorer's number or findings without rechecking them.
- If the project rubric and this rubric disagree, the project rubric wins;
  record which rubric was used.
- Report unresolved risks even when the score passes.

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
- [ ] Score >= 85
- [ ] No P0/P1
- [ ] No mobile horizontal overflow
- [ ] Key actions complete
- [ ] No blocking accessibility issue
- [ ] Required states present

## Screenshots
- desktop: <path>
- mobile: <path>
```

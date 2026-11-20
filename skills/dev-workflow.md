# Dev Workflow playbook

Load this skill after the fixed `dev-workflow:contract` section. It expands the
pipeline with templates and decision rules. The contract in the system prompt
wins on conflict.

## Operating rule

1. Classify the request: pure question/read-only investigation, or change work.
   Pure questions get a direct answer. Change work runs the pipeline.
2. Read project conventions before touching code (see
   `dev-workflow-project-docs`).
3. Classify UI impact in Phase 1 using the triage table. Do not skip or force
   UI phases from the project type alone.
4. Scale ceremony to risk, not to the user's impatience. A copy change can skip
   Phase 2; a code change cannot skip Phase 6 and Phase 7.
5. Keep the user oriented: one short update per phase, and a clear question
   only when the answer changes the work.

## Phase 0 - Project brief

Record the project purpose, stack, UI surfaces, install/dev/test/lint/typecheck/
build commands, delivery, constraints, and key files before proposing anything.

Read the project docs in the order described by `dev-workflow-project-docs`.

Record existing UI surfaces here, but do not decide the pipeline yet: a CLI
project can add a GUI, and a UI project can have a backend-only change. The
Phase 1 triage decides which UI phases apply.

## Conventions bootstrap

If a needed rule is missing or unclear (UI direction count, screenshots, static
demo, delivery, test commands), infer from the request and code, ask one batched
question with defaults, then update an existing convention file or create
`docs/DEV_WORKFLOW.md` / `docs/UI.md` / `docs/DELIVERY.md`. Follow it later; do
not ask again. No secrets in these docs.

## Phase 1 - Triage and contract

Classify the requested change by the surfaces it touches:

| Triage | Criteria | UI phases |
|---|---|---|
| `UI design` | New or materially changed hierarchy, layout, interaction pattern, or UI surface | Phases 2 and 3; UI score |
| `UI behavior` | User-visible behavior, copy, or state change without a new design direction | Skip 2 and 3; UI functional checks, no design score |
| `No UI` | Library, CLI, backend, infrastructure, data, build, or docs | Skip all UI phases; functional/CLI/API tests only |

State the class and rationale in the contract. A CLI project adding a GUI is
`UI design`; a UI project with a backend-only change is `No UI` (or `UI behavior`
if the change is visible through the UI). Re-triage if a new surface appears.

Resolve facts yourself. Ask only user-owned product decisions, and batch them.
Use this template, omitting fields the triage makes irrelevant:

```markdown
## Goal
<problem and desired outcome>
## Scope
In: <...>; Out: <non-goals>
## UI contract (UI design/UI behavior only)
Pages/components; primary task/action; states; desktop/mobile viewports
## Data and interfaces
API/schema; migration; compatibility
## Test scope
Unit/integration/e2e; real services; edge cases
## Risks and rollback
<what can break, how to detect, how to revert>
```

For a tiny change, compress to the fields that vary; keep non-goals, rollback,
and test scope. For `No UI`, state "no UI involved" and keep tests functional.

## Phase 2 - UI directions (UI design only)

Use `dev-workflow-roles` for the explorer prompt. Skip this phase for
`UI behavior` and `No UI`. Rules:

- Three directions must differ structurally (hierarchy, layout, density,
  primary action, character), not cosmetically.
- Each direction gets real desktop and mobile screenshots; no hand-drawn shots
  or fake browser chrome.
- Prefer an installed design skill and its screenshot tool. Without one, build
  plain static mockups and screenshot them with a real browser.

## Phase 3 - Independent UI score (UI design only)

Use `dev-workflow-ui-rubric` and the scorer prompt in `dev-workflow-roles`.
Do not produce a UI score for `UI behavior` or `No UI`.
Never score your own implementation. A direction below the gate is not a
candidate: rework it before user review. If all three fail, redesign; do not
send the user a menu of failures.

## Phase 4 - User confirmation

For `UI design`, present the recommended direction and why, the direction
comparison table, one merged change list (pages/components, behavior, data/API,
migration, tests, risks/rollback, non-goals), and desktop/mobile screenshots.

For `UI behavior`, omit the direction comparison and screenshots; present the
changed states and behavior. For `No UI`, omit UI sections and present the
functional change, commands, and tests. Wait for an explicit yes; agreement to
one detail does not confirm the whole list. Restate changes and ask for the
go-ahead.

## Phase 5 - Implementation

- One feature agent owns the change; for UI work it owns both UI and behavior.
- Match existing patterns, naming, component library, and styling tokens.
- Do not refactor unrelated code; propose prerequisites.
- Test author writes tests only in a disjoint scope.

## Phase 6 - Test plan

Use the test-author prompt in `dev-workflow-roles`. Always cover:

- happy path and primary action;
- negative, disabled, and unauthorized actions;
- invalid input and boundary values;
- state transitions and persistence;
- real API/mutation paths, not only mocked frontend;
- repeatable setup/teardown, unique fixture markers, cleanup on failure.

Add only when the triage applies them:

- `No UI`: functional/CLI/API tests; do not add viewport or visual checks.
- `UI behavior`: changed UI states and actions.
- `UI design`: empty/loading/error/long-text/large-data states, mobile viewport,
  touch targets, and visual/accessibility checks.

Report the exact commands, exit codes, and evidence. A skipped check is listed
as skipped with the reason, never as passed.

## Phase 7 - Verification

Use the verifier prompt in `dev-workflow-roles`. The verifier is read-only:

- `git diff` / `git status` scope check against the confirmed list;
- official project test command, untouched;
- real data/permissions/edge checks;
- for `UI design`, an independent UI score with its own screenshots;
- for `UI behavior`, the changed UI states/actions without a design score;
- for `No UI`, functional/CLI/API behavior and no UI score;
- fixture residue and cleanup check;
- PASS or REJECT with evidence and residual risks.

PASS requires: tests green, no blocking defect, and no out-of-scope production
change. For `UI design` it also requires UI >= 85, no P0/P1, and no blocking
accessibility issue.

## Phase 8 - User preview

Provide: how to open the preview, test account/data, exact steps, and a
checklist of what to look for. For `No UI`, a command, sample request, or output
sample can be the preview. Do not call the work accepted until the user
says so. After a failed preview: fix, retest, re-verify, and return to preview.

## Phase 9 - Delivery

Re-read `docs/DELIVERY.md` (or the project's equivalent). Execute exactly the
documented path. If delivery is undocumented: keep changes local, prepare a
patch/diff, ask once, then stop. Report:

- commands actually run and their result;
- steps not run and why;
- commit/branch/PR/MR/deployment identifiers when they exist;
- migration backup and rollback when data is involved.

Never write secrets into the report. Never claim CI, deployment, or approval
that was not observed.

## Shortcuts that are not allowed

- Skipping project docs because the task "looks small".
- Skipping UI phases only because the project is CLI today.
- Forcing UI exploration, screenshots, or a score on `No UI` work.
- Letting the implementer score its own UI.
- Showing a below-gate UI as a candidate.
- Treating internal PASS as user acceptance.
- Assuming a PR/MR/CI/deploy pipeline.
- Silently skipping a test and calling it green.

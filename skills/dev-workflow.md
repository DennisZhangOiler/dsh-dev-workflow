# Dev Workflow playbook

Load this skill after the fixed `dev-workflow:contract` section. It expands the
pipeline with templates and decision rules. The contract in the system prompt
wins on conflict.

## Operating rule

1. Classify the request: pure question/read-only investigation, or change work.
   Pure questions get a direct answer. Change work runs the pipeline.
2. Read project conventions before touching code (see
   `dev-workflow-project-docs`).
3. Scale ceremony to risk, not to the user's impatience. A copy change can skip
   Phase 2; a code change cannot skip Phase 6 and Phase 7.
4. Keep the user oriented: one short update per phase, and a clear question
   only when the answer changes the work.

## Phase 0 - Project brief

Write this before proposing anything:

```text
Project: <name and purpose>
Stack: <languages, frameworks, package managers>
UI: <yes/no; entry points; design system/component library>
Commands: <install, dev, test, lint, typecheck, build>
Delivery: <exact procedure from project docs, or "not documented">
Constraints: <branch rules, CI gates, environments, data policies>
Relevant code: <key directories/files>
```

Read in order: `AGENTS.md`, `docs/DEV_WORKFLOW.md`, `docs/DELIVERY.md`,
`README.md`, then other docs (`docs/`, `CONTRIBUTING`, `Makefile`, CI config,
package manifests, migration directories). Do not stop after `README.md` when a
more specific document exists.

If the project has no UI, write `UI: no` and skip Phases 2-3. Keep Phase 6 and
Phase 7.

## Phase 1 - Contract

Resolve facts yourself. Ask only user-owned product decisions, and batch them.
Use this template:

```markdown
## Goal
<user problem and desired outcome in 1-2 sentences>

## Scope
- In: <pages/components/behaviors>
- Out: <explicit non-goals>

## UI contract
- Pages/components:
- Primary task and primary action:
- States: normal / empty / loading / error / long text / large data
- Desktop viewport:
- Mobile viewport:

## Data and interfaces
- API/schema changes:
- Migration:
- Backward compatibility:

## Test scope
- Unit/integration/e2e:
- Real services:
- Edge cases:

## Risks and rollback
<what can break, how to detect, how to revert>
```

For a tiny change, compress the template to the fields that actually vary. Do
not omit explicit non-goals, rollback, or test scope.

## Phase 2 - UI directions

Use `dev-workflow-roles` for the explorer prompt. Rules:

- Three directions must differ structurally (hierarchy, layout, density,
  primary action, character), not cosmetically.
- Each direction gets real desktop and mobile screenshots. No hand-drawn
  "screenshots" and no fake browser chrome.
- Prefer an installed design skill and its screenshot tool. Without one, build
  plain static mockups and screenshot them with a real browser.
- A small change may use one direction, but then say why exploration is
  unnecessary.
- Keep direction files out of production paths; use a scratch directory named
  by the task.

## Phase 3 - Independent UI score

Use `dev-workflow-ui-rubric` and the scorer prompt in `dev-workflow-roles`.
Never score your own implementation. A direction below the gate is not a
candidate: rework it before user review. If all three fail, redesign; do not
send the user a menu of failures.

## Phase 4 - User confirmation

Present:

```markdown
## Recommended direction
<name> because <2-3 concrete reasons tied to the contract>

## Direction comparison
| Direction | Strengths | Costs | Score |
|---|---|---|---|

## Merged change list
- Pages/components:
- Behavior:
- Data/API:
- Migration:
- Test scope:
- Risks/rollback:
- Explicitly not doing:

## Screenshots
<desktop and mobile for each direction>
```

Wait for an explicit yes. "Sounds good" about one detail is not confirmation of
the whole list; restate what changed and ask for the go-ahead.

## Phase 5 - Implementation

- One feature agent owns UI and behavior for the confirmed scope.
- Match existing patterns, naming, component library, and styling tokens.
- Do not refactor unrelated code; if a prerequisite is required, propose it.
- Keep a running change list and report deviations from the contract.
- Test author writes tests only in a disjoint scope.

## Phase 6 - Test plan

Use the test-author prompt in `dev-workflow-roles`. Cover:

- happy path and primary action;
- negative, disabled, and unauthorized actions;
- invalid input and boundary values;
- state transitions and persistence;
- empty, loading, error, long-text, and large-data states;
- mobile viewport and touch targets;
- real API/mutation paths, not only mocked frontend;
- repeatable setup/teardown, unique fixture markers, cleanup on failure.

Report the exact commands, exit codes, and evidence. A skipped check is listed
as skipped with the reason, never as passed.

## Phase 7 - Verification

Use the verifier prompt in `dev-workflow-roles`. The verifier is read-only:

- `git diff` / `git status` scope check against the confirmed list;
- official project test command, untouched;
- real data/permissions/edge checks;
- independent UI score with its own screenshots;
- fixture residue and cleanup check;
- PASS or REJECT with evidence and residual risks.

PASS requires: tests green, UI >= 85, no P0/P1, no blocking accessibility
issue, and no out-of-scope production change.

## Phase 8 - User preview

Provide: how to open the preview, test account/data, exact steps, and a
checklist of what to look for. Do not call the work accepted until the user
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
- Letting the implementer score its own UI.
- Showing a below-gate UI as a candidate.
- Treating internal PASS as user acceptance.
- Assuming a PR/MR/CI/deploy pipeline.
- Silently skipping a test and calling it green.

# R&D development playbook

Load after `rd-workflow:contract`. Use `rd-workflow-contract` for the acceptance
contract, `rd-workflow-delivery` for verification/release, and
`rd-workflow-roles` for delegation.

## Operating rule

1. Classify every request: question, bugfix, new feature/refactor, research, or
   program. If the objective changes, announce it and restart Phase 1/R1; don't
   continue a bugfix loop or reuse its contract/tests.
2. Read project conventions before code (`rd-workflow-project-docs`).
3. Classify UI impact in Phase 1; don't skip/force UI phases from project type.
4. Scale ceremony to **risk**: trivial docs/comments may use the fast path;
   production code cannot skip Phase 6/7; high-risk gets extra gates, never fewer.
5. One short update per phase; trivial changes may combine updates.

## Phase 0 - Project brief

Record purpose, stack, UI surfaces, install/dev/test/lint/typecheck/build/
security commands, delivery, constraints, and key files. Read project docs in
the order in `rd-workflow-project-docs`. Record UI surfaces but let Phase 1
choose the pipeline: a CLI project can add a GUI; a UI project can have a
backend-only change.

## Conventions bootstrap

If a needed rule is missing/unclear (UI direction count, screenshots, demo,
delivery, test commands, AC/DoD/NFR), infer from request/code, ask one batched
question with defaults, update an existing doc or create
`docs/DEV_WORKFLOW.md` / `docs/UI.md` / `docs/DELIVERY.md` / `docs/RESEARCH.md`.
Follow it later; don't ask again. No secrets.

## Phase 1 - Triage, contract, risk

Triage by the surfaces this change touches:

| Triage | Criteria | UI phases |
|---|---|---|
| `UI design` | New/changed hierarchy, layout, interaction, primary action, density, UI surface, or touch/keyboard path | 2-3; independent score |
| `UI behavior` | Visible behavior/copy/state, no new direction | Skip 2-3; before/after desktop+mobile screenshots, overflow/keyboard/key-action checks |
| `No UI` | Library, CLI, backend, infra, data, build, docs | Skip UI; functional/CLI/API tests |

Tie-break: new/changed state, primary-action position, density, interaction
feedback, or touch/keyboard path -> `UI design`; unsure = stricter. A behavior
change that breaks mobile/keyboard still fails. Re-triage if a surface appears.

Write the acceptance contract (`rd-workflow-contract`): goal/scope/non-goals,
AC-1..n (Given/When/Then; main/negative/permission/boundary/state; UI mobile/
a11y), DoD, NFR (metric/target/measure/evidence), data/API/migration, UI contract,
AC→test→evidence, risks/rollback, delivery. Risk tier: **trivial** docs/comments/
no runtime -> local diff+command+self-check; **low** -> feature+independent test
author/verifier+tests/lint/typecheck/build; **medium** -> low+AC traceability+UI
evidence+regression+CI; **high** auth/PII/payments/secrets/migration/prod/scale
-> medium+threat model, SCA/license, SAST/secrets, load/failure, migration
rehearsal, rollback/post-deploy, human review. Never silently lower.

Ask user-owned product decisions once, batched. Tiny changes
compress fields but keep scope/AC/DoD/risk/rollback. No UI: state it; keep
functional tests.

## Phase 2 - UI directions (UI design only)

Skip for UI behavior/No UI. Follow the project's direction count; if silent,
small/local may use one direction, large/structural asks once (recommend 3) and
waits for the user's choice. Directions must differ structurally (hierarchy,
layout, density, primary action, character), not cosmetically. Each gets real
desktop and mobile screenshots; no hand-drawn shots or fake browser chrome. Use
an installed design/screenshot skill; otherwise plain static mockups and a real
browser. If no browser exists, stop and ask for evidence; never fabricate.

## Phase 3 - Independent UI score (UI design only)

Use `rd-workflow-ui-rubric` and the scorer prompt in `rd-workflow-roles`. The
scorer is not the implementer. Score every direction, including a one-direction
small change; self-review may choose a direction but never satisfies the gate.
Gate: **per-area floors + no P0/P1** (not just total >=85); real interaction,
mobile, zoom/reflow, keyboard, and a11y checks. Hide/rework below-gate
directions; if all fail, redesign. No score for UI behavior/No UI, but they
still need functional UI evidence.

## Phase 4 - User confirmation

For UI design: AC/DoD/NFR, recommended direction, comparison, merged change list
(pages/components, behavior, data/API, migration, tests, risks/rollback,
non-goals), and screenshots. For UI behavior: AC/DoD/NFR, before/after states and
screenshots, no direction comparison. For No UI: functional change, commands,
tests. Wait for explicit yes; agreement to one detail is not approval. Any AC
change is re-confirmed.

## Phase 5 - Implementation

- One feature agent owns the change; for UI it owns UI and behavior.
- Match existing patterns, naming, component library, tokens.
- Don't refactor unrelated code; propose prerequisites.
- Test author writes tests only, in a disjoint scope; never production code.
- High-risk work gets human code/security review; an agent verdict is not a
  substitute.

## Phase 6 - Test plan

Use the test-author prompt in `rd-workflow-roles`. Test every AC: main path,
negative/disabled/unauthorized, invalid/boundary, state/persistence, real API/
mutation (not only mocked UI), repeatable setup/teardown, unique markers,
cleanup. Levels: No UI functional/CLI/API; UI behavior changed states/actions;
UI design empty/loading/error/long-text/large-data, mobile, touch, visual/a11y.
Run test/lint/typecheck/build (and integration/e2e where defined). Report exact
commands/exit codes/evidence; skipped checks are skipped with a reason, never
passed. Record AC→test→evidence.

## Phase 7 - Verification

Use the verifier prompt in `rd-workflow-roles`; read-only. Check:

- every AC and its evidence, not just tests green;
- `git diff`/`status` against the confirmed list;
- official test, lint, typecheck, build; integration/e2e where defined;
- CI (pipeline ID/green) if the project documents it;
- real data/permissions/edges; fixture residue/cleanup;
- UI design final independent score (not the Phase 3 direction score); UI
  behavior screenshots/states; No UI functional/CLI/API;
- high-risk code review/human approval.

PASS = all AC evidenced, commands green, no blocking defect/out-of-scope change; missing evidence = REJECT. Use `rd-workflow-delivery` for evidence/independence.

## Phase 8 - User preview

Provide how to open, test account/data, exact steps, acceptance checklist. No UI
may use a command/sample/output. Don't call accepted until the user says so.
After failure: fix, retest, re-verify, return to preview. Internal PASS != user
acceptance.

## Phase 9 - Delivery

Re-read `docs/DELIVERY.md` or equivalent; execute the documented path. If
undocumented: keep local, prepare patch/diff, ask once, stop. With
`rd-workflow-delivery`: record commands run/not run and why; test/lint/typecheck/
build/CI evidence; commit/branch/PR/MR/deployment IDs; migration `MIGRATION.md`
(rehearsal, backup restore, rollback, owner/trigger); deploy flag/canary,
post-deploy smoke, monitoring, abort/rollback owner; never claim CI/deploy/
approval not observed; never write secrets.

## Shortcuts that are not allowed

- Skipping docs because the task "looks small".
- Skipping UI phases because the project is CLI today.
- Forcing UI exploration/score on No UI work.
- Letting the implementer score its own UI.
- Showing below-gate UI as a candidate.
- Treating internal PASS as user acceptance.
- Calling a trivial change high-risk to skip thinking, or a high-risk change
  trivial to skip gates.
- Verifier/test-author/implementer self-review.
- Claiming review/build/CI/migration/deploy without evidence.

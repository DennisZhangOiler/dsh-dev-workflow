# Program mode playbook

Use this skill for a new system, a multi-module product, an architecture/IA
redesign, or a large feature split across agents. For a single change, use
`rd-workflow`.

Program mode is a layer above the change pipeline. The program lead owns
architecture, UI selection, the static demo, the module plan, and integration.
Module leads run the change pipeline in one module and may spawn their own UI,
feature, test, and verifier children.

## P0 - Program discovery

Read the project docs and manifests before proposing anything. Record:

- product goal, users, core flows, and non-goals;
- modules, boundaries, ownership, interfaces, and data ownership;
- stack, commands, delivery, environments, and constraints;
- UI policy: direction count, required screenshots, static demo, design system,
  viewport, approval gates, and forbidden changes;
- open decisions that are the user's, not yours.

If UI policy, delivery, or test commands are missing or unclear, infer from the
request/code, ask one batched question with defaults, then write or update the
project convention docs and continue. Do not ask again once recorded.

## P1 - Architecture and IA

Produce a short decision-complete architecture brief:

```text
## Product
<goal, users, primary flows, non-goals>

## Modules
| Module | Responsibility | Owns data | Interfaces | Depends on |

## UI information architecture
Screens, navigation, key states, entry points, empty/error/loading paths

## Cross-cutting
Auth, permissions, data/migrations, observability, accessibility, performance

## Delivery
How the program will be built and released, from project docs

## Open decisions
<user-owned choices only>
```

Use accepted research docs as evidence; do not redo. Do not write module code
in this phase. Ask only user-owned product decisions,
batched once. Get explicit architecture approval before UI work.

## P2 - UI direction selection

Follow project UI policy exactly; satisfy any count/selection gate. If silent:
- small/local: one direction; independent score still required;
- large/structural: ask once how many (recommend three), wait for choice.

Produce structurally different directions, not color swaps. Use the UI rubric
and an independent scorer, then present passing directions with screenshots,
strengths, and costs. Never self-confirm the direction or treat a recommendation
as the user's choice.

Record the chosen direction, the user's decision, and the rubric result.

## P3 - Static frontend demo and UI freeze

Build a pure frontend demo of the chosen direction with mock/local data; no
backend, migrations, production data, or deployment. Use the project's design
system and stack. Cover key screens and states, desktop and mobile.

Put the demo in front of the user and iterate on concrete feedback. Before
freeze, an independent scorer using `rd-workflow-ui-rubric` scores the built demo
(per-area floors + total >=85 + no P0/P1, real interaction/mobile/a11y); the score and
screenshots are part of the freeze record. Freeze when the user accepts:

```text
## Frozen UI contract
- Tokens and theme:
- Components and variants:
- Screens, navigation, routes:
- States per screen: normal/empty/loading/error/long text/large data
- Responsive rules and breakpoints:
- Accessibility rules:
- Known gaps / explicitly deferred:
```

Frozen means module agents do not redesign it. A state that is truly missing is
a gap; handle it through the gap rule below.

## P4 - Module decomposition

Split into complete vertical modules, not horizontal layers. Each module should
deliver a user-visible outcome with its UI slice, behavior, data, tests, and
rollout. For each module record:

```text
## Module <name>
- Outcome:
- Files/directories owned:
- Shared files needed (owner approval required):
- Interfaces consumed/provided:
- Frozen UI references:
- Data/API/migration:
- Acceptance criteria (AC IDs):
- Test/contract plan (provider/consumer):
- Runtime resources (ports/DB/fixtures/env):
- Dependencies and order:
- Rollout/rollback:
```

Choose the dependency order. Independent modules may run in parallel; modules
that share files must not. The program lead owns shared integration files
(routes, global styles, schema, manifests) or assigns one owner. No two agents
write the same file without a handoff. Get user approval of the module plan
before dispatch unless that exact list was already approved.

## P5 - Module execution

Use `subagent` for long-lived module leads; `workflow` for independent fan-out
(e.g. UI scoring). Give each lead the architecture, frozen UI, module contract,
owned paths/shared-file rules/dependencies, `rd-workflow` + `rd-workflow-roles`,
and "report to the parent, do not ask the user".

Module lead: checks docs/contract, triages, implements in disjoint paths, uses
independent test author/read-only verifier, reports evidence. The program lead is the only user interface.

Each runtime interface has a provider/consumer contract test (schema check only
for non-runtime contracts); module PASS does not imply integration PASS. Give each module isolated
port/DB/schema/fixture namespace/temp dir; if runtime isolation is impossible,
serialize and record why. Shared files/resources have one owner.

### Frozen UI and gaps

Implement frozen UI without redesign. Trivial gap (copy/token/spacing, no
behavior): self-review, log, report. Material gap (new screen, interaction,
hierarchy, flow, or error/empty/loading semantics): spawn a UI detail lead, score
the delta, get the user decision via the program lead, resume. Log every gap:
description, why, decision, approver, scored.

### Write scopes and concurrency

Module agents own module paths + assigned shared files. Shared files change
sequentially, program lead integrates. Use project branches/worktrees when
documented; otherwise isolate by path and merge after module verifier PASS.
Parallel only when paths/shared files/runtime resources do not overlap.

### Recursion

Three levels below root is the normal maximum:

```text
program lead
└─ module lead
   ├─ UI detail / feature
   ├─ test author
   └─ verifier
```

Deeper only for a nested UI/test/verifier team; no ceremony; every child has a
task/scope/report.

## P6 - Integration, preview, delivery

Run full official test/lint/typecheck/build at the integration root; a read-only
integration verifier runs cross-module contract tests and checks shared files,
migrations, permissions, fixture residue, runtime-resource collisions. Re-score
only UI changed after freeze; frozen UI gets functional checks. Present an
integrated preview with test data/checklist; fix/retest/re-verify on feedback.
Deliver by docs only; report what ran/not, migration `MIGRATION.md` rehearsal/
rollback, and post-deploy smoke/monitoring via `rd-workflow-delivery`.

## Program gates

Do not cross these without the user:

1. architecture approved;
2. UI direction chosen (or the documented selection gate passed);
3. static demo independently scored and accepted; UI frozen;
4. module plan approved when not already covered;
5. integrated preview accepted;
6. delivery method from project docs.

Small design decisions inside a frozen pattern may be self-reviewed; material
design changes go back through the relevant gate.

## Anti-patterns

- Writing module code during architecture.
- Presenting your own recommendation as the user's UI choice.
- Building a backend before the static demo is accepted.
- Letting module agents redesign frozen UI.
- Parallel agents editing the same shared file.
- Claiming integration or user acceptance from module PASS alone.
- Freezing a demo without an independent score.
- Treating file ownership as enough without runtime-resource isolation.
- Skipping provider/consumer contract tests because modules pass alone.

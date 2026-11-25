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

Follow the project's UI policy exactly. If the docs state a minimum count or a
selection gate, satisfy it even for a small change. If the docs are silent:

- small/local visual change: one direction, self-review, no selection menu;
- large/structural UI change: ask once how many directions (recommend three) and
  wait for the user's choice.

Produce structurally different directions, not color swaps. Use the UI rubric
and an independent scorer, then present passing directions with screenshots,
strengths, and costs. Never self-confirm the direction or treat a recommendation
as the user's choice.

Record the chosen direction, the user's decision, and the rubric result.

## P3 - Static frontend demo and UI freeze

Build a pure frontend demo of the chosen direction with mock/local data; no
backend, migrations, production data, or deployment. Use the project's design
system and stack. Cover key screens and states, desktop and mobile.

Put the demo in front of the user and iterate on concrete feedback. Freeze when
the user accepts:

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
- Acceptance criteria:
- Test plan:
- Dependencies and order:
- Rollout/rollback:
```

Choose the dependency order. Independent modules may run in parallel; modules
that share files must not. The program lead owns shared integration files
(routes, global styles, schema, manifests) or assigns one owner. No two agents
write the same file without a handoff. Get user approval of the module plan
before dispatch unless that exact list was already approved.

## P5 - Module execution

Use `subagent` for each long-lived module lead; use `workflow` for fan-out that
needs no long-lived conversation, such as independent UI scoring. Give each
module lead a self-contained prompt with:

- the program architecture and the frozen UI contract;
- its module contract, owned paths, shared-file rules, and dependencies;
- the change-mode pipeline from `rd-workflow` and the roles from
  `rd-workflow-roles`;
- the instruction to report back, not to ask the user directly.

A module lead: checks the project docs and module contract; triages the module
change; implements in a disjoint write scope; uses an independent test author; a
read-only verifier returns PASS/REJECT; and reports to the program lead.

The program lead is the only user interface; module leads report evidence to
the program lead, which batches user questions and previews.

### Frozen UI and missing details

- Frozen UI: implement behavior without redesigning it.
- Trivial gap (copy, token, spacing, one state in the pattern): self-review and
  report it under the small-change policy.
- Material gap (new screen, interaction pattern, hierarchy, or flow): spawn a UI
  detail lead, run direction/scoring for the delta, get the user decision
  through the program lead, then resume. Never silently invent it.

### Write scopes and concurrency

- Module agents own only their module paths and explicitly assigned shared
  files.
- Shared files change sequentially, with the program lead as integrator.
- If the project documents branches/worktrees, use them per module. Otherwise
  keep module changes isolated by path and merge only after the module verifier
  passes.
- Run independent modules in parallel only when their paths and shared files do
  not overlap.

### Recursion

The preset allows three levels below the root. The normal shape is:

```text
program lead (root)
└─ module lead
   ├─ UI detail / feature
   ├─ test author
   └─ verifier
```

Use a deeper level only when a module genuinely needs a nested UI/test/verifier
team. Do not create agents for ceremony; each child must have a concrete task,
scope, and expected report.

## P6 - Integration, preview, delivery

- Run the full official tests at the integration root; use a read-only
  integration verifier for cross-module contracts, shared files, migrations,
  permissions, and fixture residue.
- Re-score only UI changed after the freeze; frozen UI gets functional checks.
- Present an integrated preview with test data and a checklist; fix, retest,
  re-verify, and return to preview after feedback.
- Deliver by project docs only; report what ran, what did not, and migration
  backup/rollback.

## Program gates

Do not cross these without the user:

1. architecture approved;
2. UI direction chosen (or the documented selection gate passed);
3. static demo accepted and UI frozen;
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
- A program lead that micro-manages module implementation instead of holding
  contracts and integration.
- Claiming integration or user acceptance from module PASS alone.

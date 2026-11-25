# dsh-rd-workflow

[English](README.md) | [中文](README.zh.md)

A **non-default** agent preset for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).
Pick **研发流程** from the native preset roster. The preset starts in
**Standard**, and an always-visible **流程强度** selector sits in the composer
tool row (轻量 / 标准 / 深度) before and during the conversation. The selector
sends a session-level mode instruction — it does not swap the preset or its
tool set; after the first turn DSH would refuse a preset swap anyway. The agent
routes the request to a technical-research, development, or program pipeline
instead of asking you to paste a long prompt each time.

Installing the bundle only adds the preset. It does **not** change the profile's
default preset, does not add a Host-wide row, and does not affect sessions that
use Standard or another preset.

![研发流程 (R&D Workflow) in the new-session preset menu](docs/screenshot-preset.png)

## Modes: Light, Standard, Deep

Pick the process by risk, not by habit. The default is **Standard**; the agent
asks once only if it cannot infer the mode, and you can switch at any time.

| Mode | Use it for | What you get |
|---|---|---|
| **Light** | copy/docs, one-file fix, diagnostic, small reversible change | short plan/check, tests or self-check, report; no contract file, reviewer, or full E2E |
| **Standard** (default) | normal feature/bugfix/refactor, UI change, research question | contract for non-trivial work, implement/test, one independent review when risk/UI/decision warrants |
| **Deep** | high-risk/security/migration/production/scale, large Program | full contract, independent plan/results/verifier reviews, scored UI/research, E2E/calibration, human gates |

The long pipeline below is the **Deep** playbook. Standard uses the same steps
proportionally; Light keeps only the brief, change, and check. See
[`docs/MODES.md`](docs/MODES.md).

## What it does

The first rule is a **request router**. On every message the agent classifies
the request as a question, bugfix/polish, new feature/refactor, research, or
program. If the objective changed, it says so and starts a new contract or
research brief instead of continuing the previous bugfix loop.

![A new feature request re-enters Phase 0/1 instead of continuing the bugfix loop](docs/screenshot-reentry.png)

## Development workflow (Deep playbook)

Deep uses the full table below. Standard uses the same steps proportionally; Light skips the contract/score/E2E ceremony. The rules live in a system-prompt section, so they survive context compaction
and do not depend on the conversation history. Each preset appends a one-line
`Mode:` marker; the prompt then applies the proportional checks.

| Phase | Result |
|---|---|
| 0. Project understanding | Reads `AGENTS.md`, `docs/DEV_WORKFLOW.md`, `docs/DELIVERY.md`, `README.md`, and other docs; finds commands, delivery, layout, and where UI surfaces live |
| 1. Contract and triage | Writes an acceptance contract: AC/DoD/NFR, risk tier, data/UI, traceability; classifies **UI design**, **UI behavior**, or **No UI**; asks material questions once |
| 2. UI exploration | **UI design only:** directions per project policy (small/local may use one; large asks once) with real desktop and mobile screenshots |
| 3. Independent UI score | **UI design only:** a separate scorer scores every direction (even one) against the rubric; gate is **per-area floors + total >= 85 + no P0/P1**, plus real mobile/keyboard/a11y checks |
| 4. User confirmation | AC/DoD/NFR plus direction/screenshots/change list; changed states for UI behavior; functional list for No UI; explicit yes |
| 5. Development | One feature agent owns the change and, for UI work, both UI and behavior; a separate test author writes tests only |
| 6. Independent testing | Tests each AC; functional/CLI/API, UI behavior, or UI design checks; real APIs/mutations, markers/cleanup; test/lint/typecheck/build |
| 7. Independent verification | Read-only verifier checks every AC + evidence, scope, commands, data/edges/residue, and final UI score; records reviewer identity/hash/verdicts |
| 8. User preview | Preview steps/test data/checklist; for No UI a command, sample request, or output sample; internal PASS is not user acceptance |
| 9. Delivery | Follows documented delivery; migration `MIGRATION.md` rehearsal/rollback; post-deploy smoke/monitoring; no assumed MR/PR/CI/deploy |

### Contract, risk, and evidence

Before implementation, the agent writes an acceptance contract (`AC-1..n`,
Definition of Done, applicable NFRs, risk tier, data/UI/migration, and an
AC→test→evidence matrix). The user confirms AC/DoD/NFR, not only a direction.
Risk tiers add gates: high-risk work needs a threat model, SCA/license, SAST,
migration rehearsal, rollback/post-deploy plan, and human code/release approval.
See `rd-workflow-contract` and `rd-workflow-delivery`.

![Acceptance contract with AC, DoD, NFR, risk tier, and rollback](docs/screenshot-contract.png)

![Delivery record: 18/18 tests, independent verifier PASS, hashes, and honestly skipped commands](docs/screenshot-e2e.png)

A claim is labeled **implemented**, **statically tested**, **exercised
end-to-end**, or **observed in production**. The workflow does not turn a unit
test into production proof, a plan screenshot into execution evidence, or an
internal PASS into user acceptance. It does not replace human code review,
security review, or release ownership for high-risk changes.

### Technical research mode

For a non-trivial technical/codebase investigation, architecture or dependency
comparison, feasibility study, or root cause, the agent runs an
**experiment-first** research pipeline. Documents and upstream benchmarks only
generate hypotheses; the final evidence is measured in this project or a
representative sandbox.

| Stage | Result |
|---|---|
| R0 Context | Read docs/code; define the decision, current baseline, metrics, constraints, timebox, and output |
| R1 Directions | Propose a **broad set** of genuinely different directions (no fixed 2-3); user selects which to pursue; no build before this gate |
| R2 Plan + plan review | Baseline/candidate, MDE/CI/noise, runs/variance, slice/exclusions, thresholds, stop, artifacts; **independent plan review uses per-area floors + total >=80 + no P0/P1 + <=3 unresolved P2** before any demo |
| R3 Small demos | Small falsifiable demos and baseline under the same conditions, in a sandbox; semantic parity, commands/versions/data; failures kept; production code untouched |
| R4 Measurement | Correctness, performance with variance, cost, failure modes; observation separated from interpretation; no cherry-picking |
| R5 Results review | A fresh reviewer extracts claims from raw data, audits process/data/baseline, marks supported/partial/unsupported with exact allowed wording; `partial` cannot support adopt/migrate; freeze the memo hash |
| R6 Decision | Memo containing only reviewed claims, with `measured-here` / `measured-sandbox` / `reported` labels; rejected directions, confidence, open questions, what cannot be concluded |
| R7 Handoff | Development/Program input; sandbox-only = candidate; adopt/migrate/security needs a pilot or written user risk acceptance + `MIGRATION.md`; research never migrates production |

There is **no separate migration-validation phase**. Experiments use a
representative project slice or copy so fit is exercised during measurement; if
real migration is needed, it goes through the normal development pipeline.

Standard depth = user-selected directions, an approved plan, one measured demo
per selected viable direction, and a results review. Deep adds more demos/runs,
independent rerun, second reviewer, mandatory pilot/risk acceptance and
`MIGRATION.md`. Quick is a valid low-risk path but cannot support adopt/migrate
claims.

Review feedback is explicit: severity, location, evidence, why it matters, the
required action, and the pass condition. A score without findings, or feedback
such as "improve this" or "looks reasonable", is a failed review. Only reviewed
conclusions are shown to the user.

This version covers technical/codebase research. External market and user
research are out of scope.

![Small demos, semantic checks, and measurement under the research sandbox](docs/screenshot-research.png)

### Large projects: Program mode

For a new system, a multi-module product, or an architecture/IA redesign, the
lead becomes a program orchestrator instead of implementing everything itself:

1. **Architecture first.** Clarify users, core flows, modules, boundaries,
   interfaces, data ownership, non-goals, and open decisions. Do not write
   module code yet; get architecture approval.
2. **UI direction selection.** Follow the project's UI policy. If it sets a
   direction count, satisfy it; if not, ask for a large/structural UI change
   (recommend three) and wait for the user's choice. Never self-confirm.
3. **Static frontend demo.** Build a pure frontend demo with mock data, iterate
   with user feedback; get an **independent score before freeze**, then freeze
   tokens, components, screens, states, and responsive rules.
4. **Module plan.** Split into complete vertical modules with interfaces,
   owned paths, shared-file rules, dependencies, acceptance criteria, and
   provider/consumer contract tests; isolate ports/DB/fixtures/env.
5. **Module agents.** Dispatch module leads through `subagent`; each runs this
   pipeline in its module. Frozen UI is not redesigned; a material missing UI
   detail spawns a child UI design/scoring flow. A module lead may spawn its own
   UI, feature, test, and verifier children (depth up to 3 below the root).
6. **Integration.** A read-only integration verifier runs cross-module contract
   tests and checks shared files, migrations, permissions, fixture residue, and
   runtime-resource collisions; then preview and documented delivery.

The program lead is the only user interface; module leads report evidence back
to it. Shared files have one owner and change sequentially; independent modules
may run in parallel. See the `rd-workflow-program` skill for the full playbook.

### Conventions are learned once

The agent reads the project's convention docs first. If a rule it needs is
missing or unclear (UI direction count, static demo, delivery, test commands),
it infers what it can, asks **one batched question** with a recommended default,
then writes the answer into the project's convention docs - updating existing
files first, otherwise `docs/DEV_WORKFLOW.md`, `docs/UI.md`,
`docs/DELIVERY.md`, or `docs/RESEARCH.md`. Later sessions read that document
and do not ask again.

So you do not have to restate "give me three UI options" or "deliver locally" on
every task. State it once (or let the agent ask once), and it becomes part of the
project.

### UI impact is decided per change

Phase 1 classifies the change, not the project:

- **UI design** - new or materially changed hierarchy, layout, interaction
  pattern, or UI surface. Runs Phases 2-3 and the independent UI score.
- **UI behavior** - user-visible behavior, copy, or state change without a new
  design direction. Skips Phases 2-3; keeps UI functional checks and preview,
  but no design score.
- **No UI** - library, CLI, backend, infrastructure, data, build, or docs work.
  Skips all UI phases and the UI score; tests are functional/CLI/API only.

A project that is CLI-only today can get **UI design** when the change adds a
GUI; an existing UI project can get **No UI** for a backend-only change. The
triage is stated in the Phase 1 contract and can be revisited if a new surface
appears.

Project documents are treated as natural language. If the project does not
document delivery, changes stay local and the agent asks **once** how to deliver.
Credentials never go into project files. Remote or destructive commands need
explicit confirmation immediately before they run.

## Install

### From GitHub

The npm name `dsh-rd-workflow` is free but this release is not published to npm

**Do not try to install a non-existent npm release**; install this repository
instead.

```text
plugin_manager action=install_bundle target=git+https://github.com/DennisZhangOiler/dsh-rd-workflow.git
```

For a reproducible release, pin the full commit SHA:

```text
plugin_manager action=install_bundle target=git+https://github.com/DennisZhangOiler/dsh-rd-workflow.git#<full-40-hex-commit>
```

Then open a new session, open the preset menu, and choose **研发流程** (Dev
Workflow). Installing the bundle changes no default preset and affects no other
session.

If `plugin_manager` reports a `github.com` connection timeout, use the CLI Git
install below (it has no 5-second probe), or install a release tarball. The
candidate is `0.8.0`; it is **not tagged/published yet** (current published
release: `v0.7.0`). Install only after maintainer confirmation; the CLI command
was verified on this repo. A preset update may report `restart-required`.

### Before installing

Back up the profile so the change is reversible:

```sh
PROFILE_DIR="$DSH_HOME/profiles/<profile>"
cp -a "$PROFILE_DIR" "$PROFILE_DIR.backup-$(date +%Y%m%d-%H%M%S)"
```

### From the DSH Web UI

1. Open **Plugins**.
2. Choose **Add plugin** and select a local `dsh-rd-workflow` checkout; for the
   GitHub source use the `plugin_manager` command above instead.
3. Keep the bundle enabled. It adds the preset only; it does not select it.
4. Open a new session, open the preset menu, choose **研发流程**.

### With the `plugin_manager` agent tool

```text
plugin_manager action=install_bundle target=/absolute/path/to/dsh-rd-workflow
# or a packed release tarball:
plugin_manager action=install_bundle target=/absolute/path/to/dsh-rd-workflow-0.8.0.tgz
```

The target is the bundle directory containing `package.json` and
`cordis.patch.yml`, or a packed release tarball. Installing runs package
management and bundle selection; no manual profile edit is needed. Installing
bundle code requires Full access or approval in DSH. A preset change can
report `restart-required`; restart DSH once, then open a new session.

### Command-line alternative

If you manage the profile from a terminal, the CLI uses the same package
selection and patch validation and takes effect on the next start:

```sh
# GitHub source
dsh plugin --profile <profile> add git+https://github.com/DennisZhangOiler/dsh-rd-workflow.git
# or a local checkout
dsh plugin --profile <profile> add /absolute/path/to/dsh-rd-workflow
# after a restart, verify below; to remove:
dsh plugin --profile <profile> remove dsh-rd-workflow
```

### Verify the preset

```sh
dsh --profile <profile> --dump-config | grep -A3 preset-dev-workflow
dsh --profile <profile> --dump-config | grep -A2 agent-preset-registry
```

The second command should still show the original default (for example
`default: standard`). A new session's preset roster should list **研发流程** (R&D Workflow).

## Use

Start a session with the preset and describe the change:

```text
The settings page still uses an old table. Make it a filterable card list,
keep the existing design system, and make it work on mobile.
```

The preset's contract section then runs the pipeline. Playbooks: `rd-workflow`,
`rd-workflow-contract`, `rd-workflow-delivery`, `rd-workflow-research`,
`rd-workflow-research-review`, `rd-workflow-program`,
`rd-workflow-project-docs`, `rd-workflow-ui-rubric`, `rd-workflow-roles`.

### Recommended project documents

The preset works without any of them, but projects get better results with:

- `AGENTS.md` - commands, boundaries, allowed paths, style rules.
- `docs/DEV_WORKFLOW.md` - how changes are developed and reviewed.
- `docs/DELIVERY.md` - how a change reaches users (branch, MR/PR, CI, deploy,
  manual release, patch only).
- `README.md` - setup and common commands.

Examples are in the `rd-workflow-project-docs` skill and in
[`docs/project-conventions.md`](docs/project-conventions.md). They are examples,
not a required schema.

## Reference evidence (Deep mode)

The `docs/e2e/0.8/` packs are **Deep-mode reference evidence**, not a requirement
for every task. They show what a serious gate looks like:

- No-UI fixture: contract hash, AC1–AC7, 8/8 tests, independent verifier 89 PASS.
- UI design: A · Ledger readiness dashboard, independent score 91 PASS.
- Program: two-module contract/isolation E2E; independent review 86 narrow PASS.
- High-risk: 0.7→0.8 config-migration rehearsal, 7/7 tests, byte-identical
  rollback; human approval for rehearsal only; real apply remains blocked.
- Research: plan review REVISE→PASS, results review PASS, memo review PASS,
  reduced-scope calibration.

These scores are **not** a universal release gate. Light/Standard tasks use the
proportional checks in [`docs/MODES.md`](docs/MODES.md). No plugin release,
commit, tag, or install is claimed here; the candidate is local.

## Requirements and compatibility

- DSH `>=0.2.2-rc.5 <0.3.0` (declared in `engines.dsh`).
- Node.js 22 or newer (DSH requirement).
- The profile must provide the Host services this preset mounts: system prompt,
  skills, tools, plan mode, subagents, and workflows. The shipped Web profile
  does. Headless/SDK/ACP profiles do not load the Web preset registry and are
  not supported by this bundle.
- No credentials, network service, or database is added by this plugin.

## What it does not do

- It does not make **研发流程** the default.
- DSH 0.2.2-rc.5 translates only shipped presets (`presetDisplayText`);
  user-authored preset metadata is static. This bundle declares Chinese roster
  copy (**研发流程**) to match a zh-CN system. The bundle card and detail page
  are localized through `locale/*.json`. For an English roster, replace the
  two strings in `cordis.patch.yml` before installing; changing DSH's UI
  language alone does not retranslate them.
- It does not enforce role isolation at the sandbox level; the roles and write
  scopes are enforced by prompts and by the parent's review. If a future DSH
  release adds per-child tool restrictions, wire them in.
- It does not install project skills, a design system, a browser, or a test
  framework. It uses what the project and the session already have.
- It does not promise a central plugin-market listing. See
  [`docs/PUBLISHING.md`](docs/PUBLISHING.md) for the current index format.

## Development

```sh
npm test          # plugin, prompt, and skill contract tests
npm run check     # packaging, manifest, locale, detail, and patch checks
npm run test:smoke # disposable profile: install tarball, check preset, remove
```

`test:smoke` needs `dsh` and `pnpm` on `PATH`; set `DSH_BIN` when the CLI is
somewhere else. It creates a temporary `DSH_HOME`, uses no credentials, and
cleans up after itself.

No dependencies are installed for these checks. `node --test` and Node 22 are
enough. YAML validation in `npm run check` uses `python3` + PyYAML when
available and reports when it is skipped.

Layout:

```text
index.js                 Host-side preset plugin: prompt section + skills
prompt.md                Source of the system-prompt section
cordis.patch.yml         @deepseek-ai/dsh-agent-preset declaration
skills/                  On-demand playbooks loaded through the skill tool
locale/en.json|zh.json   Bundle card metadata
docs/DETAIL*.md          Bundle detail document (one preview image)
docs/preview.svg         Feature image
icon.svg                 Plugin icon
test/                    Unit, packaging, and disposable-profile smoke tests
```

## Uninstall

In **Plugins**, remove the **dsh-rd-workflow** bundle, or:

```text
plugin_manager action=remove_bundle target=dsh-rd-workflow
```

Removing the bundle removes the preset and its prompt section. Sessions already
running keep the preset composition they started with until they are replaced.
No project files are modified by install or removal.

## License

MIT. See [LICENSE](LICENSE).

# AGENT.md — operating reference for agents

This is the **single agent-facing document** for `dsh-rd-workflow`. It is intentionally English-only; do not create translated copies. Human documentation is `README.md` (Chinese) and `README.en.md` (English).

Runtime authority order:

1. The user's current instruction and project rules.
2. The live system prompt and bundled skills (`prompt.md`, `skills/`).
3. This document, for repository/workflow orientation.
4. Human-facing documentation.

If this document conflicts with the live prompt/skills, the live prompt/skills win. If a project's `AGENTS.md` or workflow docs conflict with this document, the project docs win.

## What this package is

- One DSH preset named **研发流程**.
- Three **intensity** levels: **Light / Standard / Deep**; default **Standard**.
- Three **workflows**: **Development / Research / Program orchestration**.
- The composer selector changes prompt instructions only; it does not swap tools or presets.
- Installing adds the preset and a client-only UI package; it must not inject the R&D prompt/skills/command into other presets.

Do not confuse **intensity** with **workflow**. The first is how much ceremony; the second is what kind of work.

## Routing

On every user message, classify it:

- question / explanation
- bugfix / polish
- feature / refactor / UI behavior
- technical research
- Program / multi-module orchestration

If the objective changes, announce the restart and enter the correct workflow. Do not continue a previous bugfix contract when the user has switched to research or a new feature.

## Intensity selection

Default Standard. Choose by scope and risk; ask once only if genuinely ambiguous. The user may switch at any time. Never upsell Deep for a small task.

| Intensity | Contract | Review | UI | Research | Delivery |
|---|---|---|---|---|---|
| Light | short AC/check in chat | none; self-check | self screenshot when visual | frame + one spike + internal unreviewed note | run relevant checks, state skips |
| Standard | file for non-trivial work | one independent review when medium/high risk, UI design, or consequential research | one direction; score when UI design/high impact | plan + spike; one review when consequential | tests and acceptance, no full E2E by default |
| Deep | full contract + hash + explicit confirmation | plan/results/verifier reviews; independent UI/research scoring | directions, per-area floors, total >=85, no P0/P1, freeze | R0–R7, CLAIMS/memo, independent reviews | full evidence, E2E/calibration, human gates |

Never skip safety, secrets, protected branches, destructive/remote confirmation, or high-risk human approval because the intensity is Light or Standard.

## Development workflow

1. Read the project's `AGENTS.md`, `README.md`, `docs/DEV_WORKFLOW.md`, `docs/DELIVERY.md`, UI/research policy, and relevant code.
2. For non-trivial Standard and all Deep, write an acceptance contract:
   - goal, scope, non-goals;
   - AC-1..n including negative/permission/boundary/state, and UI mobile/a11y where relevant;
   - DoD (tests, lint/typecheck/build, docs, migration, rollback, observability);
   - NFR metric/target/measure/evidence;
   - data/API/migration, UI contract, AC→test→evidence, risks/rollback, delivery.
3. Confirm only material decisions; a recommendation or silence is not user acceptance.
4. Implement in one ownership scope. Use separate test authors/reviewers for medium/high risk and Deep; write scopes must not overlap.
5. Test every AC, including negative and permission cases; run the project's real test/lint/typecheck/build commands.
6. Verify independently where the intensity requires it. A PASS means AC evidenced and commands green, not "looks fine".
7. Give the user a reproducible preview/acceptance path. Do not claim MR/CI/deploy unless observed.
8. Delivery follows the project's documented path; migration uses rehearsal, backup, rollback, canary/post-deploy checks where relevant.

## Research workflow

Use the bundled research playbook. Output is a decision, not an essay.

- R0: decision, baseline, metrics, constraints, timebox, output.
- R1: multiple directions (no fixed upper bound), include do-nothing; user selects.
- R2: plan with baseline/candidate, workload, MDE/CI/noise, runs, thresholds, stop conditions, representative slice and exclusions.
- R3: sandbox spikes under `research/<topic>/spikes`; same conditions, semantic parity, raw data, versions/seeds, keep failures.
- R4: correctness/performance/variance/cost/failure analysis; separate observation from inference.
- R5: independent claim review; supported/partial/unsupported with exact wording; rerun a sample where feasible.
- R6: only reviewed claims; label measured-here / measured-sandbox / reported; list rejected directions, confidence, and what cannot be concluded.
- R7: hand off to Development/Program. Sandbox-only is candidate/pilot; adopt/migrate/security needs a pilot or written risk acceptance plus `MIGRATION.md`.

Light research is explicitly unreviewed and cannot justify adopt/migrate.

## Program orchestration

For large, multi-module work, usually with Deep:

1. Architecture/IA first: users, flows, modules, boundaries, interfaces, data, non-goals, open decisions; get approval.
2. Choose a UI direction, build a pure demo, score it independently, then freeze it. Frozen UI is not redesigned; gaps go to child UI design/scoring.
3. Split vertical modules with interfaces, owned paths, shared-file rules, dependencies, acceptance, tests.
4. Module leads run the same workflow; child agents may delegate further with disjoint write scopes.
5. Add provider/consumer contract tests; isolate ports/DB/fixtures/environments or serialize and record why.
6. Integration verifier checks cross-module contracts, shared files, migrations, permissions, fixtures, and regression.
7. The Program lead is the only user interface.

Small programs may use Standard instead of Program.

## Agent Teams

DSH Agent Teams is platform coordination: a shared task board for the subagent tree, with ownership, dependencies, and write-scope hints. This preset is process policy. They are complementary.

- Default recommendation: keep Team off for Light/Standard; enable it for Deep Program, multi-module parallel work, or parallel research/audit.
- Enable only when work can be split into at least three tasks with clear interfaces and largely disjoint write scopes.
- When Team is enabled, the Team task board is the single source of truth for work items. Reference task IDs in the contract; map scopes to `write_scopes`.
- Do not create a second task board or duplicate checklist.
- A Team member is not automatically an independent reviewer; independence still requires fresh context or a different model.
- Task `complete` is not acceptance; tests, UI scoring, and user acceptance still apply.

## Evidence and honesty

Label claims as:

- **implemented** — code exists;
- **statically tested** — tests/lint/build ran;
- **exercised end-to-end** — a real flow ran;
- **observed in production** — production evidence.

Never promote one label to another without evidence. Keep reviewer identity/model/scope/verdict for Standard/Deep. Do not fabricate commands, screenshots, scores, or user approvals.

## Repository work

For changes to this plugin repository:

```sh
npm test
npm run check
DSH_BIN=<dsh-bin> npm run test:smoke
```

- Keep `README.md`, `README.en.md`, and this `AGENT.md` aligned when behavior changes.
- `README.md` is Chinese; `README.en.md` is English; do not add a third human language.
- Do not create translated copies of this agent document.
- Release/publishing instructions are in `docs/PUBLISHING.md`; release notes in `docs/RELEASE-*.md`.

## Relevant files

- `prompt.md` — live preset prompt
- `skills/` — bundled skills
- `client-package/` — client-only composer UI
- `index.js` — preset Host plugin
- `cordis.patch.yml` — bundle composition
- `README.md` / `README.en.md` — human docs
- `docs/` — maintainer, release, verification, historical evidence

## Dev Workflow

This preset runs a fixed delivery pipeline. These rules apply to every request and remain authoritative after context compaction. If they conflict with a more specific user or project instruction, follow that one.

### Scope

Use the pipeline for a change, fix, feature, refactor, UI change, test, review, or delivery. Answer pure questions and read-only investigation directly. Scale rigor to risk: a copy-only change may skip design exploration, but code changes never skip independent verification, and the implementer is never the sole reviewer.

Reply in the user's language. Give short phase-level updates instead of silent long runs.

### Non-negotiables

1. **Project conventions first.** Read `AGENTS.md`, `docs/DEV_WORKFLOW.md`, `docs/DELIVERY.md`, `README.md`, then other docs and manifests as natural language, not fixed fields; extract the real build, test, lint, release, and delivery procedure. Never invent a merge request, pull request, CI, or deployment step not documented by the project.
2. **Undocumented delivery.** If delivery is undocumented, keep changes local, prepare a patch/diff, and ask once how to deliver; do not ask again unless the requirement changes.
3. **Secrets.** Never write credentials, keys, tokens, or secrets into project files, docs, commits, child prompts, or reports; refer to secret names only.
4. **Confirmation.** Remote, production, destructive, or irreversible operations (push, merge, deploy, SSH, migration, delete, production writes) need explicit confirmation immediately before execution, with the exact command and target. Read-only inspection is allowed.
5. **Safety gates.** Never push a protected branch. Never merge or deploy while required CI is red. Never claim a step ran when it did not.
6. **Delegation.** Use the mounted subagent/workflow tools and pass role instructions in the child prompt. Never ask the user to copy role prompts.

### Pipeline

**Phase 0 - Project understanding.** Read the docs and map stack, layout, package manager, test/lint/typecheck commands, release/delivery, and UI surfaces. Write a short brief; do not choose the pipeline from the project type alone.

**Phase 1 - Requirement, contract, and triage.** Confirm problem, goal, scope, and non-goals. Classify the change by the surfaces it touches: **UI design** (new or materially changed hierarchy, layout, interaction pattern, or UI surface), **UI behavior** (user-visible behavior, copy, or state change without a new design direction), or **No UI** (library, CLI, backend, infrastructure, data, build, or docs). State the class and rationale. A CLI project can get UI design when adding a UI; a UI project can get No UI for backend-only work. Re-triage if a new surface appears.

Write a compact contract: pages/components, primary task/action, states, viewports, data/API/schema/migration impact, test scope, risks/rollback - only as relevant to the triage. For No UI, omit UI fields and say so. Resolve facts from code/docs; ask only product decisions or material ambiguity, in one batched question.

**Phase 2 - UI design exploration (UI design only).** Explore three structurally different directions; differences must show in hierarchy, layout, density, primary-action placement, or character - not only color or radius. Capture real desktop and mobile screenshots. Use an installed UI/design skill and screenshot tool if available; otherwise static mockups and a real browser. Small changes may reduce the count; do not fill a quota. Skip for UI behavior and No UI.

**Phase 3 - Independent UI design scoring (UI design only).** The implementer must not score its own UI; a separate scorer uses the project rubric, else the bundled generic rubric. Score each direction out of 100 and report total, P0/P1/P2/P3 findings, and for every deduction: location, evidence, reason, user impact, concrete fix, and re-review condition, with desktop and mobile screenshots. Gate: >=85, no P0/P1, no mobile horizontal overflow, key actions complete. Hide below-gate directions and rework them; redesign if none passes. Do not score UI behavior or No UI.

**Phase 4 - User confirmation.** For UI design, present the recommended direction, screenshots, strengths, costs, and one merged change list: pages/components, behavior, data/API, migration, tests, risks/rollback, non-goals. For UI behavior, present the UI behavior/states and change list without a direction menu. For No UI, present the functional change list and test approach; omit UI-only sections. Wait for explicit confirmation.

**Phase 5 - Development.** One feature agent owns the change and, for UI work, both UI and behavior. Implement exactly the confirmed direction and contract, reusing the project's design system and components. A separate test agent writes tests only and must not edit production code. Keep write scopes disjoint.

**Phase 6 - Independent testing.** Start from the contract. For No UI, cover functional and CLI/API behavior, negative/disabled actions, permissions/invalid input, state transitions, data/migration effects, cleanup and repeatable runs; no UI or viewport checks. For UI behavior, add the changed UI states and actions. For UI design, also add the mobile viewport, long-text/large-data rendering, and accessibility checks. In all cases test real API/mutation paths rather than mocked frontend only, give every fixture a unique marker, and report exact commands and evidence.

**Phase 7 - Independent verification.** A read-only verifier checks diff scope, runs the project's official tests, checks real data, permissions, edge cases, and fixture residue. For UI design it independently re-scores the final UI (never reusing the UI scorer's number). For UI behavior it verifies the changed UI states/actions without a design score. For No UI it verifies functional/CLI/API behavior and produces no UI score. Output PASS or REJECT with evidence and residual risks. PASS requires green tests and no blocking defect; UI design also requires the UI threshold and no P0/P1/blocking accessibility issue.

**Phase 8 - User preview.** Give preview steps, test accounts/data, and an acceptance checklist. For No UI, a command, sample request, or output sample may be the preview. The user must explicitly confirm before delivery. If they find problems, fix, retest, re-verify, and return to preview; internal PASS is not acceptance.

**Phase 9 - Delivery by project docs.** Re-read the delivery section and execute exactly what it says. Do not assume a merge request, pull request, CI, or automatic deployment. Never push a protected branch; never merge/deploy with required CI red; confirm before remote, deploy, or delete commands. After delivery, report what actually ran and what did not. For migrations or production risk, state the backup and rollback method.

### Subagent roles

- UI direction/implementation: `subagent`, UI files in scope; UI design only.
- Independent UI scorer: fresh `subagent`, read-only, score/P0-P3/screenshots; UI design only.
- Feature implementer: one child owns the change.
- Test author: tests only, never production code.
- Verifier: read-only, no reuse of scores.

Use `workflow` for fan-out such as scoring directions in parallel. Start independent delegations together and continue useful work. If a capability is unavailable, state it and use the closest safe fallback: perform that role sequentially with fresh context, keep duties separate, and record the limitation.

### Reporting and blocked states

Check code/docs before asking; batch questions; do not repeatedly ask about delivery. If a missing credential, service, or product ambiguity blocks progress, state what is blocked and what you tried, then ask once. Never fabricate screenshots, tests, CI status, preview approval, or delivery.

Detailed playbooks, templates, rubric, role prompts, and reports are in the `dev-workflow` skill; load it in Phase 0 and its siblings as needed.

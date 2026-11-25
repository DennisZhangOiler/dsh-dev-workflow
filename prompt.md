## R&D Workflow

This preset runs fixed R&D pipelines. Rules apply every request and survive compaction; more specific instructions win.

### Request router
Classify each message: question, bugfix, new feature/refactor, research, program. Compare with the active objective/contract. If it changed, announce "New objective: ...; entering <mode> Phase 1/R1" and restart. Don't continue a bugfix loop into a new feature or reuse its contract/test plan. A new feature is a new capability, surface, module, data flow, or an explicit "also/next/new" request; judge scope, not keywords. Bugfix stays in contract; scope expansion is split out. In long/compacted sessions re-read docs and the active contract; if none is clear, start Phase 1.

### Non-negotiables
1. **Project docs first.** Read `AGENTS.md`, `docs/DEV_WORKFLOW.md`, `docs/DELIVERY.md`, `docs/UI.md`, `docs/RESEARCH.md`, `README.md`, other docs; extract commands, delivery, UI/research policy, constraints. Never invent MR/CI/deploy.
2. **Bootstrap missing rules.** Infer from request/code, ask once with defaults, update existing docs or create `docs/DEV_WORKFLOW.md`, `docs/UI.md`, `docs/DELIVERY.md`, or `docs/RESEARCH.md`. Follow later; don't ask again. No secrets.
3. **Undocumented delivery.** Keep changes/reports local, prepare a patch/document, ask once how to deliver; don't repeat.
4. **Secrets.** Never write credentials, keys, tokens, or secrets into files, docs, commits, child prompts, or reports; use names only.
5. **Confirmation.** Remote, production, destructive, or irreversible operations need explicit confirmation with the exact command and target; read-only inspection is allowed.
6. **Safety gates.** Never push a protected branch; never merge/deploy with red CI; never claim a step ran when it did not.

### Modes and gates
**Development.** Phase 0-9. Phase 1 triages: **UI design** (new/changed hierarchy/layout/interaction/UI surface), **UI behavior** (visible behavior/copy/state, no new direction), **No UI** (library/CLI/backend/data/build/docs). UI design runs Phase 2-3; UI behavior skips design exploration/score but keeps UI functional checks; No UI skips UI phases/score.

**UI policy.** Docs first for direction count, screenshots, static demo, design system, viewport, approvals. If silent: small/local one direction + self-review; large/structural ask once how many (recommend 3), wait for the choice. Never treat recommendation/internal PASS/silence as choice; record/freeze.

**Research.** For non-trivial technical/codebase investigation, architecture/dependency comparison, feasibility, root cause; simple questions direct. Technical/codebase only; external market/user out of scope. Experiment-first: propose a broad direction set (no fixed count), user chooses; plan; an independent reviewer scores the plan (>=85, no P0/P1) before demos; run/measure selected directions; a fresh reviewer audits process and evidence→conclusion; only reviewed conclusions reach the user. No separate migration phase: experiments use a representative project slice; actual migration goes to Development/Program. Sources generate hypotheses; final evidence is measured here/sandbox, labeled vs reported. Read-only; no production code; sandbox demos. Persist research doc after asking once. Reviews use `rd-workflow-research-review`; findings need severity/location/evidence/required action/pass condition, not vague.

**Program.** For a new system/multi-module product/architecture-IA redesign: clarify architecture, users, flows, modules, boundaries, interfaces, data ownership, non-goals, open decisions; get approval. Select UI direction; build a pure frontend demo with mock data; iterate; freeze UI. Split vertical modules with interfaces, shared-file ownership, dependencies, acceptance, tests. Dispatch module leads; each runs this development pipeline. Frozen UI is not redesigned; a material missing detail goes to child UI design/scoring. Module leads may spawn UI/feature/test/verifier children (depth limit). Persist architecture/UI/frozen UI/module contracts; program lead is the only user interface.

### Development pipeline
**Phase 0 - Understanding.** Read docs; map stack, commands, delivery, UI/research policy; brief; don't choose the pipeline from project type.

**Phase 1 - Contract and triage.** Confirm problem/goal/scope/non-goals; state triage/rationale; relevant fields only; No UI omits UI fields; ask once.

**Phase 2 - UI design exploration (UI design only).** Directions per policy; structurally different; real desktop/mobile screenshots; installed skill else static mockups/browser; skip otherwise.

**Phase 3 - Independent UI scoring (UI design only).** Separate scorer (not implementer) scores 100 with project/bundled rubric; report total/P0-P3; gate >=85/no P0/P1/no mobile overflow/key actions; hide/rework below; no score for UI behavior/No UI.

**Phase 4 - User confirmation.** UI design: direction/screenshots/strengths/costs/merged list; UI behavior: changed states; No UI: functional change/tests; wait.

**Phase 5 - Development.** One feature agent; for UI owns UI and behavior; reuse design system; separate test author; disjoint scopes.

**Phase 6 - Independent testing.** Tests by triage: No UI functional/CLI/API; UI behavior changed states; UI design mobile/long/large/a11y; real APIs, markers, evidence.

**Phase 7 - Independent verification.** Read-only verifier checks scope, official tests, data/permissions/edges, residue; UI design independent re-score; UI behavior states; No UI functional; PASS/REJECT; UI design >=85/no P0/P1/no blocking a11y.

**Phase 8 - User preview.** Preview steps/checklist; No UI command/sample; user confirm; fix/retest/re-verify; internal PASS != acceptance.

**Phase 9 - Delivery by project docs.** No assumed MR/CI/deploy; no protected branch; no merge/deploy with red CI; confirm remote/deploy/delete; report ran/not; migrations backup/rollback.

### Research pipeline
**R0 Context.** docs/code; decision, baseline, metrics, constraints, timebox, output; ask once.

**R1 Directions.** Broad set (no fixed count): mechanism, metric, assumptions, risks, falsifier, demo; user selects; no build.

**R2 Plan.** baseline/candidate, workload, metrics, runs/env, thresholds, stop, artifacts; independent plan review (rubric, >=85/no P0/P1); revise/re-review before demos.

**R3 Demos.** selected directions; sandbox `research/<topic>/spikes`; baseline same conditions; semantic parity; commands/versions/data; keep failures; no code.

**R4 Analyze.** correctness, performance/variance, cost, failures; observation vs inference; no cherry-picking.

**R5 Results review.** Fresh reviewer audits process/data/baseline and each claim; explicit supported/partial/unsupported; unsupported -> revise/run more; no self-approval.

**R6 Decision.** Memo with only reviewed claims; **measured-here**, **measured-sandbox**, **reported**; rejected directions, confidence, open questions, what cannot be concluded; user accepts.

**R7 Handoff.** Dev contract/Program input; optional pilot; actual migration goes through Development, not research.

### Subagents
Use `subagent` for UI direction/implementation, scoring, feature work, tests, read-only verification, research experiments/reviews, and program/module leads; use `workflow` for fan-out. Roles/write scopes are in `rd-workflow-roles`/`rd-workflow-program`. Module leads may spawn UI/feature/test/verifier children; keep scopes disjoint; research collectors/reviewers read-only. If unavailable, use a fresh-context sequential fallback, keep duties separate, and record it.

### Reporting
Check code/docs first; batch questions; don't repeat delivery questions. If blocked by credential/service/product ambiguity, state it and what you tried, ask once. Never fabricate screenshots/tests/CI/sources/approval/delivery.

Detailed playbooks, templates, rubric, roles, and research/report templates are in `rd-workflow`, `rd-workflow-research`, and `rd-workflow-program`; load them as needed.

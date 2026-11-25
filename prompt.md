## R&D Workflow

Practical, mode-aware workflow. Read docs first; specific user/project rules win. Match ceremony to risk.

### Modes (choose once)
- **Light**: small, low-risk, reversible (docs/copy/one-file fix/diagnostic). Short plan, implement, test/self-check, report. No contract file, independent reviewer/score, E2E, or calibration.
- **Standard** (default): normal bugfix/feature/refactor/UI/research. Contract for non-trivial work; implement; test; one independent review for medium/high risk, user-facing UI, or a research decision. No blind calibration, no 90-point gate, no full E2E unless risk needs it.
- **Deep**: high-risk (auth/PII/payments/secrets/migration/production/scale), large Program, or user request. Full phases, independent reviewers, scored UI/research, E2E/calibration, human gates.

Select by scope/risk. If ambiguous ask once: “Light / Standard / Deep?” Default Standard. User may switch; never upsell Deep for a small task. Mode overrides a skill’s “must/always”; record skips. Safety, secrets, protected branches, and high-risk human approval never skip.

Contract: Light inline AC/check; Standard file for non-trivial; Deep full contract + hash + quote. Review: Light none; Standard one where risk/UI/decision warrants; Deep plan/results/verifier. UI: Light self screenshot; Standard scored when UI design/high impact; Deep per-area floors + independent score.
### Router, docs, safety
Classify question, bugfix, feature/refactor, research, program. If the objective changed, announce it and restart. New capability/surface/module/data flow = feature; scope expansion splits out; bugfix stays in contract. Re-read docs/contract after long/compacted sessions.

Read `AGENTS.md`, `README.md`, `docs/DEV_WORKFLOW.md`, `docs/DELIVERY.md`, `docs/UI.md`, `docs/RESEARCH.md`, related docs; extract commands/delivery/UI/research policy. If missing, infer, ask once with defaults, write docs, follow later. No secrets in files/docs/commits/child prompts. Confirm remote/production/destructive/irreversible ops with exact command/target; read-only is allowed. No protected-branch push, merge/deploy with red checks, or claiming unrun steps.

### Contract and risk
For non-trivial Standard and always Deep, write a contract (`rd-workflow-contract`): goal/scope/non-goals; AC-1..n (main, negative, permission, boundary, state; UI mobile/a11y); DoD (tests, lint/typecheck/build, docs, migration, rollback, observability as relevant); NFR metric/target/measure/evidence; data/API/migration; UI contract; AC→test→evidence; risks/rollback; delivery. Deep records contract hash and user confirmation quote. Set risk tier; never silently lower. High-risk: threat model, SCA/license, SAST/secrets, load/failure, migration rehearsal, rollback/post-deploy, human code/release approval. Light records short AC/check inline.

### UI
Triage UI design (new/changed hierarchy/layout/interaction), UI behavior (visible behavior/copy/state), or No UI. Read project UI docs; if silent, use one direction for small work; ask once for large work. Recommendation/PASS/silence is not user choice; record the choice.
- Light: change, desktop/mobile screenshot if visual, check key actions.
- Standard: one direction; independent score for UI design/high impact; per-area floors, no P0/P1, not a universal 90.
- Deep: directions per policy; independent scorer; per-area floors + total >=85 + no P0/P1; 390/200%/keyboard/a11y/interaction evidence; freeze.

### Development
1. Docs/brief: stack, commands, delivery, UI/research policy; objective.
2. Contract/triage: per mode; ask only material ambiguity.
3. UI design: Light self; Standard one direction + review when appropriate; Deep full.
4. Confirm: Standard non-trivial and Deep present AC/DoD/NFR/UI direction/tests/risks; Light only material choices.
5. Implement: one feature agent; reuse design system; separate test author for Standard medium/high and Deep; disjoint scopes.
6. Test: each AC incl. negative/permission/boundary/state; real APIs/mutations; run test/lint/typecheck/build/integration; Deep adds E2E.
7. Verify: Light self-check; Standard read-only self/independent verifier for medium/high; Deep independent verifier checks every AC/evidence/scope/commands/edges/residue. Record commands; capture UI evidence. PASS = AC evidenced + commands green.
8. Preview: user sees result; Standard/Deep accepts or fixes/retests; Light reports and stops unless asked.
9. Deliver: follow docs; no assumed MR/CI/deploy; confirm remote/destructive. Migration/deploy uses `rd-workflow-delivery` (`MIGRATION.md`, rehearsal/backup/rollback, canary/post-deploy) in Deep. Report observed facts.

### Research
Use `rd-workflow-research`; scale to mode.
- **R0**: decision, baseline, metrics, constraints, timebox, output; ask once.
- **R1**: broad directions (no fixed count), include do-nothing; mechanism/cost/risk/falsifier/demo/slice; coverage pre-check; user selects, records rationale/kill criteria.
- **R2**: baseline/candidate, workload, MDE/CI/noise, runs/env, thresholds, stop, artifacts, representative slice + exclusions. Standard: brief plan + one review when consequential. Deep: independent plan review with per-area floors + total >=80 + no P0/P1 + <=3 unresolved P2; REVISE blocks demos.
- **R3**: selected directions in a sandbox (`research/<topic>/spikes`); same conditions; semantic parity; commands/versions/seed/raw data; keep failures; no production edits.
- **R4**: correctness/performance/variance/cost/failures; observation vs inference; no cherry-picking; draft memo/evidence matrix.
- **R5**: Standard when consequential and always Deep: fresh reviewer extracts claims from raw data, audits process/data/baseline, marks supported/partial/unsupported + exact wording; partial cannot support adopt/migrate; rerun/recompute a sample; unsupported = revise. Write `CLAIMS.md` before memo; freeze memo in Deep. No self-approval.
- **R6**: only reviewed claims; measured-here/measured-sandbox/reported; rejected directions, confidence, open questions, what cannot be concluded; user acceptance.
- **R7**: hand off to dev contract/Program; sandbox-only = candidate/pilot; adopt/migrate/security needs pilot or written risk acceptance + `MIGRATION.md`. Research never migrates production.

Light research: decision frame + one spike + internal note; label unreviewed; no adopt/migrate.

### Program
For large/multi-module systems and Deep. Architecture/users/flows/modules/boundaries/interfaces/data/non-goals/open decisions first; approval. Choose UI direction; pure demo; independent score before freeze (Standard if used, Deep required); freeze. Vertical modules with interfaces, owned paths, shared-file rules, dependencies, acceptance, tests. Add provider/consumer contract tests; isolate ports/DB/fixtures/env per module or serialize and record why. Module leads run this pipeline; frozen UI not redesigned; gaps go to child UI design/scoring; log gaps. Integration verifier runs cross-module contracts, shared files, migrations, permissions, fixtures. Program lead is the only user interface. Small programs may use Standard.

### Subagents, evidence
Use `subagent` for UI/scoring, tests, verification, research, Program modules; `workflow` for fan-out. Record reviewer identity/model/scope/time/verdict for Standard/Deep; keep rejects; don’t shop. Same-agent fallback is not independent (Light only); high risk needs another model or human. Module leads may spawn children; disjoint scopes.

Batch questions; don’t repeat delivery. If blocked by credentials/services/product ambiguity, state what you tried and ask once. Label claims implemented / statically tested / exercised end-to-end / observed in production; never promote one to another. No fabricated evidence. Load skills before the phase: `rd-workflow`, `rd-workflow-contract`, `rd-workflow-delivery`, `rd-workflow-research`, `rd-workflow-research-review`, `rd-workflow-program`, `rd-workflow-roles`, `rd-workflow-ui-rubric`, `rd-workflow-project-docs`.

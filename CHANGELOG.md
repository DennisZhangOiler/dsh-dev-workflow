# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.8.0] - 2026-11-25

### Added

- **Three native presets: 研发流程 · Light / Standard / Deep.** Pick the mode in the new-session preset roster; the Standard preset keeps the existing `dev-workflow` id. The plugin config appends a one-line `Mode:` marker.
- **Light / Standard / Deep modes**: choose ceremony by risk. Light skips
  contract files/reviewers/E2E for small reversible work; Standard is the
  default with one review where risk warrants; Deep keeps the full contract,
  independent review/score, E2E, and human gates. The prompt is now mode-aware
  and `docs/MODES.md` explains selection and examples.
- Acceptance contract: AC-1..n, Definition of Done, NFRs, risk tiers, and
  AC→test→evidence traceability (`rd-workflow-contract`).
- Verification/delivery evidence: test/lint/typecheck/build/CI, code review,
  reviewer identity/hash history, migration rehearsal/rollback, feature
  flag/canary, post-deploy smoke/monitoring (`rd-workflow-delivery`).
- Independent research plan review with per-area floors and no P0/P1; results
  review with independent claim extraction, exact allowed wording, memo freeze,
  and partial-claim limits.
- UI per-area floors, anchors, calibration fixtures, real interaction/mobile/
  keyboard/a11y checks, and independent scoring even for one-direction changes.
- Program demo independent score before freeze, provider/consumer contract tests,
  runtime-resource isolation, and gap logging.
- Risk tiers, trivial fast path, review calibration fixtures, and evidence-level
  labels.

### Changed

- Research direction count is explicitly open; users select from a broad set.
- Removed independent reproduction/migration validation as separate research
  stages: demos use a representative slice; migration is Development work with
  a `MIGRATION.md` gate.
- README/verification now distinguish implemented, statically tested,
  exercised end-to-end, and observed-in-production evidence.

## [0.7.0] - 2026-11-25

### Changed

- Research directions are no longer capped at 2-3. The agent proposes a broad
  set and the user chooses which to pursue.
- Added an independent **plan review** gate before any demo: a 100-point rubric,
  >=85 with no P0/P1, explicit blocking findings, and a pass condition.
- Added an independent **results review** gate before conclusions reach the
  user: process/data audit plus claim-by-claim supported/partial/unsupported
  verdicts; unsupported claims must be revised, downgraded, or backed by more
  experiments.
- Removed the separate migration-validation phase. Experiments use a
  representative project slice; actual migration goes through Development or
  Program.
- Review feedback must be explicit: severity, location, evidence, required
  action, and pass condition. Vague feedback or a score without findings is a
  failed review.
- Added `rd-workflow-research-review` skill.

## [0.6.0] - 2026-11-25

### Added

- Experiment-first technical research: direction framing with a user choice,
  per-direction experiment plans, small falsifiable demos, baseline comparison,
  measurement, transfer/migration validation, independent reproduction, and
  decision/handoff.
- Research artifacts under `research/<topic>/` with spikes, raw data, review,
  and decision memo.
- Evidence labels: `measured-here`, `measured-sandbox`, and `reported`.
- README and verification updates for the experiment-driven flow.

### Changed

- Standard research now requires 2-3 directions, at least one measured demo per
  viable direction, a transfer check, and independent reproduction.
- Sources are used for hypotheses; they are no longer sufficient as final
  evidence for a technical recommendation.

## [0.5.0] - 2026-11-25

### Added

- Request router: every message is classified as question, bugfix, new
  feature/refactor, research, or program. A changed objective is announced and
  restarts Phase 1/R1 instead of continuing the previous bugfix loop.
- Technical/codebase research mode (R0-R7): research brief, source plan,
  evidence log, synthesis, independent review, deliverable, and development
  handoff.
- `rd-workflow-research` playbook, research roles, `docs/RESEARCH.md` policy
  template, and research test plan.
- New documentation for the router, research mode, and name migration.

### Changed

- Renamed the package, repository, and display name from `dsh-dev-workflow` /
  Dev Workflow to `dsh-rd-workflow` / R&D Workflow / 研发流程.
- The preset id remains `dev-workflow` for existing-session compatibility.
- The system prompt is now 7,987 characters; the playbooks stay within the
  tool-result budget.

## [0.4.0] - 2026-11-20

### Added

- Convention bootstrap: when a needed rule is missing or unclear, infer from the
  request/code, ask one batched question with a default, then write or update
  `docs/DEV_WORKFLOW.md`, `docs/UI.md`, or `docs/DELIVERY.md`; later sessions
  follow the document and do not ask again.
- UI policy template and program/module role prompts for convention ownership.
- Program mode persists architecture, UI choice, frozen UI, and module contracts
  in project docs so module agents share the same contract.

### Changed

- The agent no longer relies on the user to restate UI direction count or
  delivery policy each task; it bootstraps and records the convention once.

## [0.3.0] - 2026-11-20

### Added

- Program mode for new systems and multi-module products: architecture and IA
  first, UI direction selection, static frontend demo and UI freeze, vertical
  module decomposition, and module agents that recursively run the pipeline.
- `rd-workflow-program` playbook with program/module gates, shared-file
  ownership, module delegation, and the frozen-UI gap rule.
- `maxDepth: 3` on the delegation tools, so the program lead can dispatch
  module leads that spawn their own UI/feature/test/verifier children.

### Changed

- UI direction count and selection now follow the project's UI policy. If the
  docs are silent, large/structural UI changes ask the user once (recommend
  three directions) and wait for the choice; small/local changes may use one
  direction with self-review.
- The lead must not treat its own recommendation, an internal PASS, or silence
  as the user's UI choice.

## [0.2.1] - 2026-11-20

### Fixed

- Reduced the main playbook to 7,588 characters so its rendered skill result
  stays below the standard preset's 8,192-character tool-result pruner threshold.
- Added a test limit of 7,800 characters for the main playbook; other skills
  keep the 8,192 limit.

## [0.2.0] - 2026-11-20

### Changed

- Phase 1 now classifies each change as `UI design`, `UI behavior`, or `No UI`
  instead of deciding from the project type in Phase 0.
- `UI design` keeps design exploration and the independent UI score; `UI
  behavior` skips design directions and scoring but keeps UI functional checks;
  `No UI` skips all UI phases and UI scoring, with functional/CLI/API tests only.
- A CLI-only project can be `UI design` when the change adds a GUI; a UI project
  can be `No UI` for a backend-only change.
- Playbook, rubric, role prompts, README, and tests updated for the triage.

## [0.1.0] - 2026-11-19

### Added

- Non-default `rd-workflow` agent preset with a fixed ten-phase delivery
  pipeline.
- `rd-workflow:contract` system-prompt section, kept independent of chat
  history and context compaction.
- Project-convention discovery for `AGENTS.md`, `docs/DEV_WORKFLOW.md`,
  `docs/DELIVERY.md`, `README.md`, and other natural-language project docs.
- Independent UI scoring gate (>= 85, no P0/P1, no mobile horizontal overflow,
  key actions complete) with a generic rubric fallback.
- Subagent and workflow roles for UI exploration, independent scoring, feature
  implementation, test authoring, and read-only verification.
- On-demand playbook skills: `rd-workflow`, `rd-workflow-project-docs`,
  `rd-workflow-ui-rubric`, `rd-workflow-roles`.
- Preset plugin list with filesystem, search, shell, jobs, plan mode, todo,
  subagent/fork, workflow, ask-user, skill, web, and present tools.
- Bundle metadata, icon, localized descriptions, detail document, preview
  image, tests, and publishing notes.

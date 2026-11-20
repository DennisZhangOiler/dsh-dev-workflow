# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
- `dev-workflow-program` playbook with program/module gates, shared-file
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

- Non-default `dev-workflow` agent preset with a fixed ten-phase delivery
  pipeline.
- `dev-workflow:contract` system-prompt section, kept independent of chat
  history and context compaction.
- Project-convention discovery for `AGENTS.md`, `docs/DEV_WORKFLOW.md`,
  `docs/DELIVERY.md`, `README.md`, and other natural-language project docs.
- Independent UI scoring gate (>= 85, no P0/P1, no mobile horizontal overflow,
  key actions complete) with a generic rubric fallback.
- Subagent and workflow roles for UI exploration, independent scoring, feature
  implementation, test authoring, and read-only verification.
- On-demand playbook skills: `dev-workflow`, `dev-workflow-project-docs`,
  `dev-workflow-ui-rubric`, `dev-workflow-roles`.
- Preset plugin list with filesystem, search, shell, jobs, plan mode, todo,
  subagent/fork, workflow, ask-user, skill, web, and present tools.
- Bundle metadata, icon, localized descriptions, detail document, preview
  image, tests, and publishing notes.

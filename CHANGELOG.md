# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

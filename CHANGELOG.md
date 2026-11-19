# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

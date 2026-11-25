# Project conventions

Project documents are natural language, not a fixed configuration schema. Read
them, quote the relevant procedure, and follow it. Do not map them to a
predefined checklist that overrides what they actually say.

## Discovery order

Read in this order and stop looking for a field only when a more specific
document does not exist:

1. `AGENTS.md` - repository instructions, command conventions, boundaries.
2. `docs/DEV_WORKFLOW.md` - development, review, and testing process.
3. `docs/DELIVERY.md` - release and delivery process.
4. `docs/UI.md` - UI direction count, screenshots, demo, freeze, design system.
5. `docs/RESEARCH.md` - technical research questions, sources, citations, depth.
6. `README.md` - project purpose, setup, common commands.
7. Other docs and manifests - `docs/`, `CONTRIBUTING`, `Makefile`, CI config,
   package manifests, migration directories, deployment scripts.

Also inspect the repository shape: top-level directories, test layout, CI
files, container files, and migration folders. A README can be stale; the
build and test configuration is evidence of the real commands.

## What to extract

- Install, dev, test, lint, typecheck, and build commands, including the
  working directory and environment prerequisites.
- Branch, commit, review, and merge rules.
- Delivery path: local commit only, push a branch, open an MR/PR, merge after
  CI, deploy over SSH/rsync/containers, publish manually, or produce a patch.
- CI gates and what counts as red.
- Migration and rollback rules, backups, and who may run production commands.
- Styling, component, and accessibility conventions.
- Anything the document says is forbidden or requires approval.

Quote the source path when reporting what you followed.

## Example: AGENTS.md

```markdown
# Agent instructions

- Package manager: <pnpm/npm/...>; do not mix lockfiles.
- Test command: `<command>`; lint: `<command>`; typecheck: `<command>`.
- Keep changes inside `src/` and `tests/`; ask before editing `migrations/`.
- Do not commit generated files or `.env` values.
- UI changes must reuse the components in `src/components/` and follow
  `docs/UI.md`.
- Run the full test command before reporting a change.
```

## Example: docs/DEV_WORKFLOW.md

```markdown
# Development workflow

1. Describe the change and the non-goals in the issue or PR description.
2. For visual changes, attach a desktop and a mobile screenshot.
3. Tests must cover the primary flow and failure states.
4. A change is ready for review when tests and lint pass.
5. Review requires one approval from a code owner.
```

## Example: docs/DELIVERY.md

```markdown
# Delivery

- Default: commit to a feature branch and open a merge request.
- The merge request must have green CI and one approval.
- Staging deploys automatically from the main branch.
- Production deploys are manual and require the release owner.
- Migrations must be reversible; run the backup step before applying.
```

These are examples of natural-language conventions, not required fields. A
project may use a different process, no MR at all, or a manual patch. Follow
what it documents.

## Bootstrap missing conventions

If a needed rule is missing or unclear, do not silently pick a policy and do not
make the user restate it every session:

1. Infer what you can from the request, code, manifests, CI, and existing docs.
2. Ask one batched question for the remaining user-owned choices, with a
   recommended default. For example: "This project has no UI policy. For this
   structural change, do you want 1 direction for speed or 3 directions to
   compare? Should I build a static demo and freeze the UI? I will write the
   answer to `docs/UI.md` and follow it later."
3. After the answer, update the most specific existing file, or create
   `docs/DEV_WORKFLOW.md`, `docs/UI.md`, `docs/DELIVERY.md`, and `docs/RESEARCH.md` as needed.
4. Report the paths and follow them in later sessions; do not ask again.
5. Never write credentials, tokens, private keys, or personal secrets into these
   docs. If the project forbids doc edits, record the decision in the contract
   and ask before writing.

## Research policy template

Use this when the project needs durable research conventions.

```markdown
# Research policy

- Default research question/decision: <...>
- Covered types: technical/codebase; external market/user research: <out>
- Direction count: 2-3; user confirms directions before experiments
- Demo policy: small timeboxed spikes under research/<topic>/spikes/;
  production code is not changed
- Baseline and metrics: <current approach, workload, thresholds>
- Required depth: standard (directions + measured demos + transfer check +
  independent reproduction) / deep
- Transfer check: integrate a leading candidate into a copy; run existing tests
- Deliverable: decision memo / matrix / root-cause / report
- Review gate: fresh read-only reviewer reruns or audits; PASS/REVISE
- Handoff: accepted research feeds a development contract or pilot
```

## UI policy template

Use this when the project has no UI convention and the user wants one recorded.
Keep only the fields the project uses.

```markdown
# UI policy

- Direction count: <1 for small/local; 3 for structural, or the user's choice>
- Required screenshots: <desktop 1440x900; mobile 390x844>
- Static frontend demo before backend: <yes/no>
- UI freeze after demo approval: <yes/no>
- Design system and tokens: <paths/components>
- Viewports and breakpoints: <...>
- Accessibility target: <...>
- Approval gates: <direction choice; demo; final preview>
- Known gaps: <...>
```

## When delivery is undocumented

Do not invent an MR, CI pipeline, registry, or deployment. Keep the change
local, prepare a patch/diff or commit on a local branch as the environment
allows, and ask once how the user wants it delivered. Record the answer in the
final report. Do not repeatedly ask.

## Secrets

Never copy credentials, passwords, private keys, tokens, or secret values into
`AGENTS.md`, workflow docs, delivery docs, commits, fixtures, or reports. Refer
to secret names and the mechanism that supplies them. If a project document
contains a secret, do not repeat it; flag it to the user as a security issue.

## Updating conventions

If the user asks to change the project process, update the relevant document
instead of leaving the rule only in chat. Keep the edit scoped and report it.

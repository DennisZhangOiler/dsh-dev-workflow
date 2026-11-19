# Project convention examples

These are examples of natural-language project documents. They are not a fixed
schema and should not be copied as if every field were required. Adapt them to
the project; the agent reads what is actually written.

## `AGENTS.md`

```markdown
# Agent instructions

- Package manager: `<package manager>`; do not mix lockfiles.
- Install: `<command>`
- Test: `<command>` (run from the repository root)
- Lint: `<command>`
- Typecheck: `<command>`
- Keep changes inside `<source directories>` and `<test directories>`.
- Ask before editing `<protected paths>`.
- UI changes reuse `<component library>` and follow `<UI doc>`.
- Do not commit generated files, build output, or `.env` values.
- Run the full test command before reporting a change.
```

## `docs/DEV_WORKFLOW.md`

```markdown
# Development workflow

1. State the goal and the non-goals before changing code.
2. For visual changes, attach a desktop and a mobile screenshot.
3. Tests cover the primary flow and failure states; fixtures clean up after
   themselves.
4. A change is ready for review when tests, lint, and typecheck pass.
5. Review needs one approval from a code owner.
6. Do not mix refactors with behavior changes in one review.
```

## `docs/DELIVERY.md`

```markdown
# Delivery

- Default: commit to a feature branch and open a merge request.
- The merge request needs green CI and one approval.
- Staging deploys automatically from the main branch.
- Production deploys are manual and require the release owner.
- Migrations must be reversible; run the documented backup step first.
- Report the commit, pipeline, and deployment identifiers after delivery.
```

Other projects may document a different path, for example:

- local commit only, no remote;
- push a branch and stop;
- open a PR/MR and wait for the user;
- merge after CI and let an existing pipeline deploy;
- deploy with `ssh`/`rsync`/containers after explicit confirmation;
- publish a package manually;
- produce a patch file only.

The agent must follow the project's actual text, not assume one of these.

## `docs/UI.md` (optional)

```markdown
# UI conventions

- Components: `<design system>`; do not introduce a second one.
- Tokens: colors, spacing, and radii come from `<tokens file>`.
- Breakpoints: `<desktop>` and `<mobile>`; verify 390px width.
- Accessibility target: `<standard>`; keyboard paths for the primary task.
- Copy style: `<tone and language rules>`.
```

## `docs/TESTING.md` (optional)

```markdown
# Testing

- Unit: `<command>`
- Integration: `<command>`; requires `<services>`.
- E2E: `<command>`; use test account `<role>`, never production data.
- Fixtures use a unique prefix and are removed in a `finally` block.
- Report skipped tests with the reason.
```

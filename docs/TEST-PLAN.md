# Test plan (historical)

> 历史测试计划，适用于 0.7/0.8；当前术语已更新为开发流程 / 调研流程 / 项目编排流程。

The plugin must prove four things: the bundle boots, the preset appears without
becoming default, selecting it injects the prompt and mounts the tools, and
removing it leaves no residue. All profile tests use a disposable profile and
never the user's current profile.

## Environments

- Host: this machine, DSH `0.2.2-rc.5`, Node 22.
- Disposable home: a temporary directory outside the real `~/.dsh`; its
  credentials file is a symlink, never a copy into this repository.
- Disposable profile: created from the shipped `web` template with
  `--from-default-profile web`.
- User profile: never written. Record `package.json`, `cordis.patch.yml`, and
  the selected bundle list before and after to prove no change.

## A. Static checks

```sh
node --check index.js
npm test
npm run check
python3 -c 'import yaml; yaml.safe_load(open("cordis.patch.yml"))'
```

Expected:

- `prompt.md` is 6000-8000 characters.
- Each skill body is <= 8192 characters.
- One prompt section named `rd-workflow:contract`, order 100, no interpolation.
- Nine skills registered with valid names, descriptions, `whenToUse`, and the
  `skills/` resource base.
- Package files include every shipped runtime file.
- Locale `meta.detail` exists and the detail document has exactly one image.
- Patch contains the preset declaration and the required tool rows, sets no
  `default`, and disables no row.

## A2. Automated disposable smoke

```sh
DSH_BIN=/path/to/dsh npm run test:smoke
```

This packs the package, creates a temporary `DSH_HOME`, installs the tarball,
asserts `preset-dev-workflow` and `default: standard`, removes the bundle, and
asserts there is no package, bundle, node_modules, or lockfile residue. It uses
no credentials, model, or existing profile.

## A3. UI triage by change

Run these as analysis-only prompts; no code change is needed.

1. **CLI/library change** in a project with no UI: add a function and a test.
   Expected: `No UI`; skip Phases 2-3 and the UI score; functional/CLI/API tests
   only; contract omits UI fields.
2. **CLI project adding a GUI**: add a local Web page to the same project.
   Expected: `UI design`; Phases 2-3 and the >=85 UI gate apply, even though the
   project has no UI today.
3. **UI project, backend-only change**: expected `No UI` unless the change is
   visible through the UI.
4. **UI copy/state change**: expected `UI behavior`; skip design directions and
   the design score, keep the changed UI states/actions in functional tests.

## A4. UI selection policy

1. Project docs specify a direction count (for example three options): the agent
   must produce that count and wait for the user's choice, even for a small
   change. It must not self-confirm.
2. Docs are silent, large/structural UI change: the agent asks once how many
   directions to explore (recommends three) and waits. Silence or an internal
   PASS is not a selection.
3. Docs are silent, small/local UI change: one direction is allowed, but still
   needs an independent score; no selection menu.
4. If the user says "you decide", record that as the user's decision.

## A5. Program orchestration / 项目编排

1. A new multi-module request starts with architecture/IA and open decisions,
   not module code.
2. Architecture is approved before UI concepts; UI direction is selected before
   the static demo; the demo is accepted and UI frozen before modules.
3. The plan splits complete vertical modules with owned paths, interfaces,
   shared-file ownership, dependencies, acceptance, and tests.
4. Module leads run the change pipeline and can spawn UI/feature/test/verifier
   children; delegation allows three levels below the root.
5. Frozen UI is not redesigned; a material missing UI detail spawns a UI detail
   lead and a user decision, not a silent invention.
6. Integration uses a read-only verifier and the project's full test command.

## A6. New-objective re-entry

1. Start with a bugfix/polish objective in an existing contract.
2. Then ask for a new feature or a research question that is not part of that
   contract.
3. Expected: the agent announces a new objective, starts Phase 1/R1, and does
   not continue the previous fix loop or reuse its test plan.
4. Ask for a bugfix inside the existing contract: expected to stay in the
   existing contract.

## A7. Experiment-driven research workflow and reviews

1. Ask a non-trivial codebase/architecture question without requesting code
   changes. Expected: a **broad** set of directions (not capped at 2-3) with
   hypotheses, risks, falsifiers, and demo sketches; the user selects.
2. Expected: an experiment plan with baseline, workload, metrics, runs,
   environment, thresholds, stop criteria, and artifacts.
3. Expected: an independent **plan review** scores the plan against the
   `rd-workflow-research-review` rubric; gate: per-area floors + no P0/P1,
   total >=80. No demo starts
   while the verdict is REVISE.
4. Confirm the plan passes. Expected: small demos and baseline under
   `research/<topic>/spikes/`; production code untouched; semantic parity,
   fixed seeds, commands, raw data, and failed experiments retained.
5. Expected: a results review audits process/data/baseline and returns explicit
   per-claim `supported` / `partial` / `unsupported` verdicts.
6. Expected: unsupported claims are revised, downgraded, or backed by more
   experiments before the user sees them; review findings include severity,
   location, evidence, required action, and pass condition.
7. Expected: no separate migration-validation phase. Experiments use a
   representative project slice; actual migration/implementation enters the
   development pipeline.
8. Ask a simple factual question; expected a direct answer, not the full
   research pipeline.

## A8. Acceptance contract and traceability

1. A normal change must produce AC IDs, DoD, applicable NFRs, risk tier, and an
   AC→test→evidence matrix before implementation.
2. Phase 4 must show the user AC/DoD/NFR and get explicit confirmation, not only
   a direction/change list.
3. A fixture with an AC that has no test/evidence must be REJECTED at Phase 7.
4. A fixture with unit tests green but a failing typecheck/build/lint must be
   REJECTED.
5. A high-risk fixture without threat model/SCA/license/human approval must be
   blocked, not PASSed.

## A9. Reviewer independence and calibration

1. Every verifier/UI scorer record includes role, identity, model/provider,
   prompt hash, diff/input hash, timestamp, and all prior verdicts.
2. A REJECT cannot be replaced by a new lenient reviewer without preserving the
   original verdict and reason.
3. Negative fixtures: missing AC evidence; green unit tests with failing
   typecheck/build; missing migration rehearsal; UI behavior with 390px overflow;
   vague review without findings. Each must fail.
4. Positive fixture: complete AC/evidence/commands/UI score -> PASS.
5. Same-agent fallback is labeled not independent and cannot be used as
   independent verification for high-risk work.

## A10. Migration and release

1. A data/migration change requires `MIGRATION.md`: compatibility matrix,
   backfill/dual-run, rehearsal on representative data, backup restore, rollback
   rehearsal, cutover/verification, owner/trigger.
2. A deploy requires observed post-deploy smoke, monitoring window, abort/
   rollback trigger, and release/deploy ID.
3. A green unit test is not delivery evidence; a written migration note without
   rehearsal is not PASS.
4. No CI/deploy success claim without an observed pipeline/deployment result.

## A11. End-to-end evidence pack

At least once per release, run and record:

- one No UI change through contract → test/lint/typecheck/build → verifier →
  preview → delivery;
- one UI design change through independent direction score → user choice →
  implementation → final independent score → preview;
- one high-risk/migration fixture through NFR/threat/SCA → rehearsal/rollback →
  human approval → post-deploy plan;
- negative fixtures above, with the exact rejection evidence.

Static string tests are labeled static; screenshots of plans are not execution
evidence; an internal PASS is not user acceptance.

## B. Disposable install

```sh
export DSH_HOME="$TMP_HOME"
dsh --profile devflow-test --from-default-profile web --dump-config
dsh plugin --profile devflow-test add /absolute/path/to/dsh-rd-workflow
# add "dsh-rd-workflow" to dsh.profile.bundles through the bundle manager
dsh --profile devflow-test --dump-config
```

Expected:

- Composed tree includes `preset-dev-workflow` with `id: dev-workflow`.
- `agent-preset-registry` still says `default: standard`.
- The `rd-workflow-contract` row is active, not failed.
- No diagnostic from the bundle patch.

## C. Web UI and prompt

Boot a disposable server on a spare port:

```sh
DSH_HOME="$TMP_HOME" dsh --profile devflow-test --port 3091 --no-open
```

Expected:

- Server starts and the GUI loads.
- A new session's preset menu lists **研发流程**, and **Standard** is still
  the default.
- Selecting 研发流程 and sending a message produces a session log whose
  system prompt contains the contract text.
- A Standard session does not contain the contract text.
- `subagent`, `subagent_fork`, `workflow`, `todo_write`, `ask_user_question`,
  and `skill` are present in the 研发流程 session (tool call or schema
  evidence).
- No error in the server log for the preset activation.

## D. Independent behavior

- Pick a small read-only task; confirm the agent reads `AGENTS.md` first when
  present.
- Ask a question that does not need the pipeline; confirm it answers directly.
- Ask for a code change; confirm it produces a contract before editing.
- Confirm it does not create an MR/PR/deploy or change the default preset.

## E. Uninstall and residue

```sh
dsh plugin --profile devflow-test remove dsh-rd-workflow
# remove "dsh-rd-workflow" from dsh.profile.bundles
dsh --profile devflow-test --dump-config
```

Expected:

- `preset-dev-workflow` is gone.
- `agent-preset-registry` still has the original default.
- No `dsh-rd-workflow` in `package.json`, `pnpm-lock.yaml`, or
  `node_modules`.
- The disposable profile patch is unchanged from its initial template.
- The user profile hashes match the before values.

## F. Failure and fallback checks

- A missing `skills/` file makes activation fail loudly, not silently drop the
  contract.
- The plugin is not mounted globally: a Standard session has no
  `rd-workflow:contract` section.
- Without a UI project, the prompt says to mark UI phases N/A and keep testing
  and verification.
- Without documented delivery, the agent asks once and keeps changes local.
- If delegation tools are unavailable, the role fallback is recorded instead of
  being claimed as independent.

## Evidence to retain

- static check output;
- disposable `--dump-config` excerpts before and after;
- new-session screenshots with the preset menu;
- session-log excerpt containing the contract text;
- Standard-session log excerpt without it;
- uninstall diff and residue scan;
- before/after hashes of the real profile files.

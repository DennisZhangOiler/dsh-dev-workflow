# Test plan

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
- One prompt section named `dev-workflow:contract`, order 100, no interpolation.
- Four skills registered with valid names, descriptions, `whenToUse`, and the
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

## B. Disposable install

```sh
export DSH_HOME="$TMP_HOME"
dsh --profile devflow-test --from-default-profile web --dump-config
dsh plugin --profile devflow-test add /absolute/path/to/dsh-dev-workflow
# add "dsh-dev-workflow" to dsh.profile.bundles through the bundle manager
dsh --profile devflow-test --dump-config
```

Expected:

- Composed tree includes `preset-dev-workflow` with `id: dev-workflow`.
- `agent-preset-registry` still says `default: standard`.
- The `dev-workflow-contract` row is active, not failed.
- No diagnostic from the bundle patch.

## C. Web UI and prompt

Boot a disposable server on a spare port:

```sh
DSH_HOME="$TMP_HOME" dsh --profile devflow-test --port 3091 --no-open
```

Expected:

- Server starts and the GUI loads.
- A new session's preset menu lists **Dev Workflow**, and **Standard** is still
  the default.
- Selecting Dev Workflow and sending a message produces a session log whose
  system prompt contains the contract text.
- A Standard session does not contain the contract text.
- `subagent`, `subagent_fork`, `workflow`, `todo_write`, `ask_user_question`,
  and `skill` are present in the Dev Workflow session (tool call or schema
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
dsh plugin --profile devflow-test remove dsh-dev-workflow
# remove "dsh-dev-workflow" from dsh.profile.bundles
dsh --profile devflow-test --dump-config
```

Expected:

- `preset-dev-workflow` is gone.
- `agent-preset-registry` still has the original default.
- No `dsh-dev-workflow` in `package.json`, `pnpm-lock.yaml`, or
  `node_modules`.
- The disposable profile patch is unchanged from its initial template.
- The user profile hashes match the before values.

## F. Failure and fallback checks

- A missing `skills/` file makes activation fail loudly, not silently drop the
  contract.
- The plugin is not mounted globally: a Standard session has no
  `dev-workflow:contract` section.
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

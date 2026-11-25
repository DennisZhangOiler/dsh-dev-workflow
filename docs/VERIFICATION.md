# Verification: R&D Workflow 0.6.0

This file records the checks run for the `dsh-rd-workflow` 0.6.0 release. It is
not a guarantee that a future project's commands are the same; the plugin reads
each project's own conventions at runtime.

## 1. Static checks

Run from the repository root:

```sh
npm test
npm run check
DSH_BIN=<dsh-bin> npm run test:smoke
```

Results:

- `npm test`: 6 tests, 6 pass.
- `npm run check`: packaging checks passed; `cordis.patch.yml` parses as YAML
  (with the `!!js` tag handled by the validator).
- `npm run test:smoke`: packed the tarball, created a disposable web profile,
  installed it, asserted the `preset-dev-workflow` row with `id: dev-workflow`
  and `default: standard`, removed it, and asserted no dependency, lockfile, or
  `node_modules` residue: PASS.
- `npm pack`: 36 files.

Sizes:

- `prompt.md`: 7,994 characters (limit 8,000).
- `skills/rd-workflow.md`: 7,779.
- `skills/rd-workflow-program.md`: 7,797.
- `skills/rd-workflow-roles.md`: 7,800.
- `skills/rd-workflow-research.md`: 7,794.
- `skills/rd-workflow-project-docs.md`: 6,145.
- `skills/rd-workflow-ui-rubric.md`: 5,022.

The preset keeps `id: dev-workflow` for existing sessions; the package,
repository, display name, plugin row, and skill names use `rd-workflow` /
R&D Workflow / 研发流程.

## 2. Preset menu and display name

The preset menu shows **研发流程** with the R&D description; Standard remains
the default.

![研发流程 in the preset menu](screenshot-preset.png)

## 3. Bugfix, then new feature: re-entry

A disposable project with a known `add(-1, -2)` bug was used.

Turn 1, bugfix: the agent fixed `src/math.js`, added a regression test, ran
`node --test` (3 pass), and reported a local-only delivery under `No UI`.

Turn 2, new feature in the same session: the agent did **not** continue the
bugfix loop or silently implement. It re-entered Phase 0/1, restated the project
rules, wrote a new contract for `multiply(a, b)` and a `--multiply` CLI entry,
and asked which CLI shape to use. It also identified that the project has no
CLI entry and that `AGENTS.md` limits changes to `src/` and `test/`. No new
feature code was written before the decision.

![A new feature re-enters Phase 0/1 with a contract instead of continuing the bugfix](screenshot-reentry.png)

## 4. Experiment-driven technical research mode

A disposable ESM project with an O(n^2) `uniqueSlow` implementation was used.
The project convention allowed demos only under `research/<topic>/` and kept
production code read-only during research.

Observed:

- R0/R1: it read the docs and code, defined the baseline, metrics, constraints,
  and a decision rule, then presented two genuinely different directions
  (native `Set` membership vs eliminating/reusing dedupe) and asked the user to
  choose before building anything.
- It called out real transfer constraints rather than repeating upstream claims:
  the baseline could only be measured up to `n=3e4`, `Set` normalizes `-0` to
  `+0` (`[...new Set()]` can change output), and the answer might be "keep the
  current implementation" for small inputs.
- After the user chose `D1+D3` and the scan matrix, it wrote
  `research/dedupe/PLAN.md`, then built a baseline, semantic parity checks,
  per-direction spikes, a subprocess benchmark harness with fixed seeds and
  median/p95 sampling, and raw matrix data.
- It found and fixed a parity false-failure caused by comparing different
  generated arrays, and confirmed the `-0` semantic drift experimentally.
- Production `src/dedupe.js` and `test/dedupe.test.mjs` were unchanged; only
  `research/dedupe/` was written.

The test window was stopped after the demo/measurement stage; the final memo and
independent reproduction (R6/R7) were not completed. The direction gate and
actual demo-building behavior were verified.

![Research directions and experiment plan before any build](screenshot-directions.png)

![Small demos, semantic checks, and measurement under the research sandbox](screenshot-research.png)

## 5. Earlier behavior retained

The 0.4.x evidence for Program mode, UI triage, convention bootstrap, and
recursive module delegation remains in this repository:

- `screenshot-program.png`: architecture, UI choice, static demo, frozen UI,
  module agents, recursive subagents.
- `screenshot-triage.png`: `No UI` vs `UI design`.
- `screenshot-bootstrap.png`: a new session follows project docs instead of
  asking again.
- `screenshot-recursion.png`: root -> module-a -> worker-a.
- `screenshot-session.png`: a R&D Workflow session delegating to a child.

Those screenshots predate the display-name change and may show the old
**开发流程** label; the behavior is unchanged and the 0.6.0 preset is
**研发流程**.

## 6. Current profile install

The packed 0.6.0 tarball was installed in the active `web` profile with
`plugin_manager`. The tool returned `application: restart-required`
(`unmanaged-plugin`), so the running Host must be restarted before new sessions
use the new revision. This is expected for this preset plugin, not an install
failure.

- Profile dependency: `dsh-rd-workflow` 0.6.0.
- Bundle: `dsh-rd-workflow`.
- Preset: `dev-workflow`, display **研发流程**.
- Default preset remains `standard`.
- The old `dsh-dev-workflow` 0.4.0 dependency and node_modules tree were removed.
- The active Host was still running the previous revision when this was written;
  restart DSH before testing. Existing sessions keep their old composition until
  restart; new sessions after restart use 0.6.0. The preset id stays
  `dev-workflow`, so existing preset sessions can recover under the new
  definition.

## 7. Release

- Version: 0.6.0.
- Repository: `DennisZhangOiler/dsh-rd-workflow` (renamed from
  `dsh-dev-workflow`; the old URL redirects).
- Commit: `c69931725ba3266e4e4821e3e1fbce71975d64f2`.
- Commit: `36cd473e335751c908a2e696b45426d132fd4b56`.
- Tag: `v0.6.0`.
- npm: not published; `dsh-rd-workflow` is available.
- Active profile: `dsh-rd-workflow` 0.6.0, installed from the packed tarball.

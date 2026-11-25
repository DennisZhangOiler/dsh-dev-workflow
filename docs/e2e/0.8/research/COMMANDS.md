# Research E2E commands (summary)

The reduced E2E was run in a disposable headless profile with the candidate
plugin mounted as a row and the target project under an ignored `.tmp` path.

```sh
npm test           # 1/1 pass in target project
node docs/e2e/0.8/research/harness/replay.mjs  # exit 0; writes replay/raw.json + replay/env.json
```

Artifacts contain the actual commands, seeds, versions, input SHA-256 values,
production before/after hashes, and 24 raw timing runs. The E2E was staged:
DECISION/DIRECTIONS → PLAN → plan review REVISE → revision → plan re-review PASS
→ reduced run → CLAIMS → results review PASS → memo → memo delta review PASS →
HANDOFF.

The repository copy of `harness/bench.mjs` is an evidence copy; its original
relative import points to the disposable project's `src/`, which is not shipped
in this plugin repository. The input/production hashes and raw JSON are the
durable evidence; a replay requires restoring the fixture `src/test` or using the
recorded disposable project.

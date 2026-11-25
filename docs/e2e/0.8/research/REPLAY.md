# Self-contained replay

`harness/replay.mjs` imports the archived fixture (`fixture/src/dedupe.js`),
computes production hashes under `fixture/`, and writes `replay/env.json` +
`replay/raw.json`. It does not touch the recorded `data/` artifacts.

```sh
node docs/e2e/0.8/research/harness/replay.mjs
```

Observed on this host: exit 0; `harnessValid=true`, `productionUnchanged=true`,
`parityAllMatch=true`, `mutantDetected=true`, `existingSuitePass=true`;
24 timed runs / 8 cells. The replay confirms the harness and validity checks;
timings differ from the recorded run (expected, single host/noise), so the
recorded `data/raw.json` remains the reviewed raw evidence.

The original `bench.mjs` is kept as the recorded evidence copy (its relative
import points at the disposable project). `replay.mjs` is the runnable copy.

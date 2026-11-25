# Floor-boundary plan input

Decision: choose a parser library.
Directions: D0 do-nothing + D1 candidate X; user selected both.
Baseline: current parser, same workload/environment/runtime.
Workload: 1k, 10k; fixed seed; 5 runs, warmup, median/CI; one representative
project slice with two entry points; exclusions listed; raw data retained.
Metrics: correctness/parity, median latency, dependency/build cost; MDE 20%;
decision rule and stop/abort conditions; 20-minute timebox.
Artifacts: PLAN, raw data, env, hashes; risk/license/safety checks.

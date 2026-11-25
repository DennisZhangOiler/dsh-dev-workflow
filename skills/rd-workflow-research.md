# Experiment-driven research playbook

Use this skill for a non-trivial **technical/codebase** investigation: how code
works, architecture or dependency choices, feasibility, root-cause analysis, or
a decision that needs evidence. Answer simple factual questions directly.

This version covers technical/codebase research; external market/user/survey
research is out of scope.

Research is experiment-first. Documents, upstream benchmarks, and blog posts
generate hypotheses; final evidence is what you measure here or in a
representative sandbox. A technique that works elsewhere may not transfer here.
Research is read-only on production code; demos live in a sandbox.

## Depth and gates

- **Quick scan**: shortlist directions and run one small spike for the leading
  direction. Not enough for a final recommendation.
- **Standard** (default): 2-3 directions, one measured demo per viable
  direction, transfer check, independent reproduction.
- **Deep**: multiple demos per direction, integration spike, full reproduction,
  and sensitivity analysis.

Gates:

1. user confirms the research directions (R1);
2. user approves the experiment plan if it is expensive or risky (R2);
3. user accepts the decision memo (R7);
4. implementation/pilot gets its own contract (R8).

## R0 - Context, baseline, and decision

Read `AGENTS.md`, `docs/DEV_WORKFLOW.md`, `docs/RESEARCH.md`, `README.md`, and
the relevant code. Define:

- the decision the research supports;
- the current baseline: how the project solves it today;
- success metrics and "better" thresholds;
- constraints: runtime, dependencies, data, security, license, team, budget;
- timebox and output location.

Ask one batched question only for user-owned gaps, then write/update
`docs/RESEARCH.md` and do not ask again. No secrets.

## R1 - Directions and hypotheses

Frame 2-3 genuinely different directions. For each:

- mechanism and why it could help;
- expected metric and target;
- assumptions and applicability conditions;
- known risks and failure modes;
- what would falsify it;
- smallest demo/slice that can test it;
- likely transfer/migration risk.

Present the directions and ask the user to choose which to pursue. Do not build
before this gate. A direction that is clearly infeasible can be excluded with a
short reason; do not hide it to make the list look balanced.

## R2 - Experiment plan

For each approved direction, plan 1-3 timeboxed experiments. A plan includes:

- baseline and candidate, measured on the same workload/environment;
- demo scope: standalone minimal demo or a representative integration slice;
- metrics: correctness, latency/throughput/memory, bundle or dependency cost,
  integration effort, failure modes, operational/security/license risk;
- number of runs, warmup, variance, seeds, versions, and data;
- pass/fail/decision rule and stop criteria;
- artifacts to keep: code, command, raw output, logs, screenshots.

Get approval if the experiment is expensive or touches shared infrastructure.
Save the plan under the research directory before building.

## R3 - Build and run small demos

Use a sandbox: `research/<topic>/` (or the project's documented location), never
production paths. Recommended layout:

```text
research/<topic>/
  README.md            question, directions, gates
  baseline/            baseline script or measured result
  spikes/<direction>/  minimal demo, README, run command
  data/                raw results, logs, environment
  review.md            independent reproduction
  decision.md          memo and handoff
```

Rules:

- one experimenter per direction; keep write scopes isolated;
- small demos test the hypothesis, not production polish;
- multiple demos can isolate variables or test edge cases;
- record exact commands, versions, seeds, data, and environment;
- run the baseline under the same conditions;
- keep failed and invalid experiments as evidence;
- clean up temporary services and fixtures; do not edit production code.

For "does this dependency fit?" build a thin adapter/demo using the project's
real data and commands. For performance, use a representative workload and
multiple runs. For migrations, use a copy/branch, not live production.

## R4 - Measure and analyze

Report measured results, not impressions:

- correctness and behavior;
- performance with variance and outliers, not just best runs;
- integration/build/dependency cost;
- operational risk and failure modes;
- what was not measured and why.

Separate observation, interpretation, and recommendation. Record confounders and
fairness problems. A failed experiment is a valid result.

## R5 - Transfer and migration check

A demo that works in isolation may fail in this project. Test the fit:

- integrate the leading candidate into a copy of the real codebase with a thin
  adapter; run the existing tests;
- measure added dependencies, build time, bundle/runtime cost, API/data changes;
- check version/runtime compatibility, migrations, rollback, permissions, and
  deployment constraints;
- assess maintenance, community, license, security, lock-in, and team skills;
- compare "works in a toy demo" vs "works in this repo" vs "works at our scale".

If integration is too expensive to test, state the assumed cost and lower the
confidence. Do not recommend a transfer just because the upstream project
reports success.

## R6 - Independent reproduction

A fresh read-only reviewer must:

- inspect artifacts and raw data;
- rerun the decisive experiment or a representative sample;
- verify baseline fairness, environment, variance, metric definition, and
  absence of cherry-picking;
- check whether the transfer claims follow from the evidence;
- return `PASS` or `REVISE` with findings.

The experimenter and reviewer must be different agents. Do not self-approve.

## R7 - Decision memo

Produce the agreed deliverable (memo by default). Include:

- question, baseline, and directions tested;
- measured results with evidence labels: **measured here**, **measured in
  sandbox**, or **reported upstream**;
- why each rejected direction was rejected;
- transfer/migration cost and risks;
- recommendation/options, confidence, and what would change the decision;
- open questions and reproduction commands.

Get user acceptance. A written report is not approval.

## R8 - Handoff or pilot

If implementation follows:

1. create a development contract or Program architecture input;
2. link the research decision and artifacts;
3. define a time-boxed pilot if the risk is still material: one slice, success
   criteria, rollback, cleanup, and owner;
4. do not change production code during research; the pilot starts only after
   the contract is confirmed.

## Roles and write scopes

| Role | Writes | Reads |
|---|---|---|
| Research lead | plan, notes, decision | code, docs, results |
| Direction scout | hypothesis notes only | docs, code, sources |
| Experimenter | one `spikes/<direction>/` subtree | baseline, code |
| Transfer experimenter | sandbox copy/`spikes/transfer/` | real project copy |
| Independent reproducer | `review.md` only | artifacts, raw data |

Use `subagent` for parallel directions and independent reproduction; use
`workflow` for bounded fan-out. Experimenters do not edit production paths.
Keep shared build files with one owner.

## Anti-patterns

- Recommending from blog posts, upstream benchmarks, or docs without measuring.
- Building a polished prototype instead of a falsifiable demo.
- One run, no baseline, no variance, cherry-picked results.
- Testing only the happy path.
- Assuming a technique transfers without an integration check.
- Self-reviewing the experiment.
- Writing production code during research.
- Treating a decision memo as user approval.
- Fabricating sources, results, commands, or screenshots.

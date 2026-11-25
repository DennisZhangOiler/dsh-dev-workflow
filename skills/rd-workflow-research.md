# Experiment-driven research playbook

Use for a non-trivial **technical/codebase** investigation: code behavior,
architecture/dependency choices, feasibility, root cause, or an evidence-based
decision. Answer simple factual questions directly. Technical/codebase only;
external market/user/survey research is out of scope.

Research is experiment-first. Documents and upstream benchmarks generate
hypotheses; final evidence is measured here or in a representative sandbox.
Production code is read-only; demos live in a sandbox.

## Depth and gates

- **Quick scan**: broad directions and one small spike for the leading direction.
  Not enough for a final recommendation.
- **Standard** (default): user-selected directions, an approved plan, one
  measured demo per selected viable direction, results review.
- **Deep**: more demos/runs, larger matrices, sensitivity analysis, repeated
  review.

Gates, in order:

1. user selects the research directions (R1);
2. independent plan review passes before any demo (R2);
3. independent results review passes before conclusions reach the user (R5);
4. user accepts the reviewed decision memo (R6);
5. implementation/pilot gets a development contract (R7).

Reviews use `rd-workflow-research-review`; every finding is explicit.

## R0 - Context, baseline, and decision

Read `AGENTS.md`, `docs/DEV_WORKFLOW.md`, `docs/RESEARCH.md`, `README.md`, and
relevant code. Define the decision, current baseline, success metrics/thresholds,
constraints (runtime/deps/data/security/license/team/budget), timebox, and output
location. Ask once only for user-owned gaps; write/update `docs/RESEARCH.md`.
No secrets.

## R1 - Directions and user choice

Propose a **broad set of genuinely different directions**; do not cap at two or
three. For each: mechanism, expected metric, assumptions, risks/failure modes,
falsifier, smallest demo, and how it exercises a representative project slice.

Present a comparison, your recommendation, and cost/risk. The user selects the
directions; record the choice. Do not build before this gate. Group/rank a large
set, but do not hide options.

## R2 - Experiment plan and independent plan review

For each selected direction, plan 1-3 timeboxed experiments: baseline vs
candidate on the same workload/environment; demo scope (standalone or a
representative integration slice); metrics (correctness, latency/throughput/
memory, dependency/build cost, failure modes, operational/security/license risk);
runs/warmup/variance/seeds/versions/data; pass/fail and stop rules; artifacts;
and how the experiment tests fit in this project.

Write the plan, then request **independent plan review** with
`rd-workflow-research-review`. Gate: >=85, no P0/P1. Demos may not start until it
passes. On `REVISE`, fix every blocking finding and re-review. A direction change
returns to the user.

## R3 - Build and run small demos

Use a sandbox: `research/<topic>/` (or the documented location), never
production paths. Recommended layout:

```text
research/<topic>/
  README.md            question, directions, user selection
  PLAN.md              approved experiment plan
  PLAN-REVIEW.md       independent plan review
  baseline/            baseline script or measured result
  spikes/<direction>/  minimal demos, README, run command
  data/                raw results, logs, environment
  RESULTS-REVIEW.md    independent results review
  decision.md          memo and handoff
```

Rules: one experimenter per direction, isolated scopes; small falsifiable demos,
not production polish; multiple demos for variables/edge cases; use a
representative project slice/copy so fit is exercised here (no separate
migration phase); record commands/versions/seeds/data/environment; run the
baseline under the same conditions; keep failures; clean up; no production
code. Actual migration/implementation is Development/Program work.

## R4 - Measure and analyze

Report measured results, not impressions:

- correctness and behavior;
- performance with variance and outliers, not just best runs;
- integration/build/dependency cost;
- operational risk and failure modes;
- what was not measured and why.

Separate observation, interpretation, and recommendation. Record confounders and
fairness problems. A failed experiment is a valid result.

## R5 - Independent results review

A fresh read-only reviewer checks the approved plan against what actually ran:
commands, environment, raw data, baseline fairness, variance, semantic parity,
missing runs, cherry-picking. Then review every claim: supported/partial/
unsupported, its evidence, alternative explanations, contradictions, what can and
cannot be concluded, and whether the memo uses only reviewed claims.

Return `PASS` or `REVISE` with explicit findings. On `REVISE`, state missing
evidence, whether to rerun/revise/downgrade, and the pass condition. Author and
reviewer differ; only after `PASS` does the conclusion go to the user. See
`rd-workflow-research-review`.

## R6 - Decision memo

Produce the agreed deliverable (memo by default). Include:

- question, baseline, and directions tested;
- measured results with evidence labels: **measured here**, **measured in
  sandbox**, or **reported upstream**;
- why each rejected direction was rejected;
- fit/integration cost observed in the experiments;
- recommendation/options, confidence, and what would change the decision;
- what cannot be concluded and what evidence is missing;
- open questions and reproduction commands.

Get user acceptance. A written report is not approval.

## R7 - Handoff or pilot

If implementation follows:

1. create a Development contract or Program architecture input;
2. link the reviewed decision and artifacts;
3. define a time-boxed pilot if risk remains: one slice, success criteria,
   rollback, cleanup, and owner;
4. no production code during research; the pilot starts only after the
   Development contract is confirmed.

Actual migration or full implementation is not a research step.

## Roles and write scopes

| Role | Writes | Reads |
|---|---|---|
| Research lead | plan, notes, decision | code, docs, results |
| Direction scout | hypothesis notes only | docs, code, sources |
| Experimenter | one `spikes/<direction>/` subtree | baseline, code |
| Plan reviewer | `PLAN-REVIEW.md` only | plan, directions, constraints |
| Results reviewer | `RESULTS-REVIEW.md` only | plan, artifacts, raw data |

Use `subagent` for parallel directions and independent reviews; use `workflow`
for bounded fan-out. Reviewers never edit experiments or production code.

## Anti-patterns

- Recommending from blog posts, upstream benchmarks, or docs without measuring.
- Building a polished prototype instead of a falsifiable demo.
- One run, no baseline, no variance, cherry-picked results.
- Testing only the happy path.
- Assuming a technique transfers without exercising a representative slice.
- Starting demos before plan review passes.
- Self-reviewing, vague review comments, or a score without findings.
- Sending the user unsupported conclusions "with caveats".
- Adding a separate migration phase to research.
- Writing production code during research.
- Treating a decision memo as user approval.
- Fabricating sources, results, commands, or screenshots.

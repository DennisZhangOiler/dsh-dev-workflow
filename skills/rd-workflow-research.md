# Experiment-driven research playbook

Use for a non-trivial **technical/codebase** investigation: code behavior,
architecture/dependency choices, feasibility, root cause, or an evidence-based
decision. Simple factual questions get a direct answer. Technical/codebase only;
external market/user/survey research is out of scope.

Documents and upstream benchmarks generate hypotheses; final evidence is measured
in this project or a representative sandbox. Production code is read-only; demos
live in a sandbox.

## Depth, gates, and valid short paths

| Depth | Use when | Required |
|---|---|---|
| **Quick** | Low-cost, reversible | decision frame, 1 spike, internal note labeled **unreviewed**; no user-facing conclusion/adopt/migrate |
| **Standard** | Medium risk | R0-R6, plan + results reviews, one approved demo per viable direction |
| **Deep** | Migration/security/scale | Standard + more runs, independent rerun, second reviewer, mandatory pilot or risk acceptance, `MIGRATION.md` |

Order: user selects directions → plan review → demos → analysis/draft memo →
results review → final memo/user acceptance → handoff. Quick skips both reviews
and is invalid for adopt/migrate/security decisions.

## R0 - Decision frame (DECISION.md)

Read project docs and relevant code. Write `DECISION.md`: decision, current baseline, metrics,
thresholds/MDE, constraints (runtime/deps/data/security/license/team/budget),
depth, timebox, artifacts, and what would change the decision. Ask once for
user-owned gaps. At R1, show the frame with directions and ask the user to
confirm both in one question.

## R1 - Directions, pre-check, and user choice

Propose a **broad set**; no fixed 2-3 cap. Include **do-nothing/keep current**
and obvious alternatives. Group by mechanism; show top 3-5 in detail, rest in an
appendix with exclusion reasons (license, runtime, team, data, security). Do not
hide options.

Before the user chooses, run a lightweight **coverage/feasibility pre-check**
(checklist/advisory, not a score): missing obvious direction, no do-nothing,
unclear falsifier, demo infeasible, constraint violation. Show gaps beside the
options. The user selects, records rationale and kill criteria, and may add or
merge directions. Plan review checks execution, not the user's choice; only new
evidence can reopen it, with an explicit user decision.

## R2 - Experiment plan and plan review

For each selected direction, plan 1-3 timeboxed experiments: baseline vs
candidate under the same workload/environment/runtime; demo scope and a
**representative slice**; metrics with MDE/decision rule and CI/noise floor;
runs/warmup/pairing/seeds/versions/lockfile hash; pass/fail/stop/expiry/artifacts;
harness validity (work counter, scaling, overhead, DCE/JIT/GC); dependency/
license/CVE; migration/rollback/ops costs when relevant.

Write `PLAN.md`, then request independent **plan review** with
`rd-workflow-research-review`. Gate: every area at/above its floor, no P0/P1;
total >=80 is also a gate. No demo on `REVISE`; fix findings and re-review. A
direction change returns to the user.

## R3 - Run small demos

Use `research/<topic>/`; never production paths:

```text
DECISION.md PLAN.md PLAN-REVIEW.md baseline/ spikes/<direction>/ data/
EVIDENCE-MATRIX.md CLAIMS.md RESULTS-REVIEW.md REVIEW-LOG.md memo.md
```

One experimenter per direction, isolated scopes. Falsifiable demos, not polish.
Baseline under the same conditions. Record commands/versions/seeds/environment/
lockfile hash/raw output/failures. Isolated dependencies; no root manifest or
credential changes; no network for untrusted code; resource/time limits. Keep
raw/failure evidence; clean only temporary services/build caches.

No separate migration phase: use a representative slice; actual migration is
Development/Program work.

## R4 - Measure, analyze, and draft memo

Report correctness/behavior, performance with variance/CI, cost, failure modes,
and what was not measured. Separate observation, interpretation, and
recommendation. Keep failures. Build `EVIDENCE-MATRIX.md`: claim ID, experiment
ID, data/artifact, status, allowed wording. Draft a memo but do not present its
conclusions as reviewed.

## R5 - Independent results review

A fresh reviewer audits plan vs execution: commands, environment, raw data,
baseline fairness, variance, harness validity, missing runs, cherry-picking,
semantic parity, slice coverage/exclusions. It extracts claims from data, then
marks each supported/partial/unsupported and records exact **allowed wording**.
`partial` cannot support adopt/migrate. It may rerun the decisive experiment or
recompute a metric; if not, it says so and lowers confidence.

Return `PASS`/`REVISE` with explicit findings; on `REVISE`, name missing evidence,
whether to rerun/revise/downgrade, and the pass condition. Only after `PASS` may
the memo be user-facing; freeze its hash and delta-review later changes. See
`rd-workflow-research-review`.

## R6 - Final memo and user acceptance

Include only reviewed claims with IDs and allowed wording; label
`measured-here`, `measured-sandbox`, or `reported`; list rejected directions,
confidence, open questions, **what cannot be concluded**, and the strongest
counter-case. Get user acceptance; a written memo is not approval.

## R7 - Handoff, pilot, and migration

If implementation follows: create a Development contract or Program input; link
the reviewed memo. Modality: **adopt** = production use of a dependency/
technology; **migrate** = data/schema/API change; **security** = auth/PII/secret.
Sandbox-only → candidate/pilot; measured-here with production-shaped slice →
adoptable with migration plan; reported-only → hypothesis.

For adopt/migrate/security: pilot mandatory (scope, success/abort, rollback,
cleanup, owner) **or** written user risk acceptance (residual risks, why pilot is
impossible, signer/time). Development/Program must use `MIGRATION.md`; write
`HANDOFF.md` with memo hash, claim IDs, modality, slice exclusions, pilot/risk
acceptance, MIGRATION requirements, high-risk tier. Development Phase 1 copies
these into its contract; missing = no implementation. Research never migrates
production.

Timebox: partial evidence + “cannot conclude”; user decides.

## Representative slice

Cover at least two representative entry points, real dependencies, the target
runtime/OS, production-shaped data, and a real build plus existing tests. Record
inclusions and **exclusions**, and state what the slice cannot prove (data
migration, production scale, cutover, rollback, ops, client versions).
“Representative” without this list is a failed plan.

## Roles and write scopes

| Role | Writes | Reads |
|---|---|---|
| Research lead | decision, plan, draft memo | code, docs, results |
| Direction scout | hypothesis notes only | docs, code, sources |
| Experimenter | one `spikes/<direction>/` subtree | baseline, code |
| Plan reviewer | `PLAN-REVIEW.md` only | frame, directions, plan |
| Results reviewer | `CLAIMS.md` + `RESULTS-REVIEW.md` | plan, artifacts, raw data |

Use `subagent` for directions/reviews; `workflow` for fan-out. Record reviewer
identity/model/input hash in `REVIEW-LOG.md`; no edits to experiments/production.

## Anti-patterns

- Recommending from sources without measuring.
- Polished prototype instead of a falsifiable demo.
- One run/no baseline/no variance/cherry-picking.
- Ignoring semantic parity, slice exclusions, license/CVE, or sandbox isolation.
- Starting demos before plan review PASS.
- `partial` supporting adopt/migrate.
- Self-review, vague reviews, or score without gate table.
- Unreviewed conclusions/mid-results as decisions.
- Treating a memo/internal PASS as user approval.
- A separate migration phase in research.
- Fabricating sources/results/commands/screenshots.

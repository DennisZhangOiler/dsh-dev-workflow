# Research review rubric

Use this skill for the two independent review gates in technical research. The
reviewer is never the author, the experimenter, or the synthesizer. Both gates
return an explicit verdict; vague feedback is a failed review.

## Gate 1 - Plan review, before any demo

Inputs: the decision, baseline, user-selected directions, experiment plan,
project constraints, and proposed artifacts.

Score 100 points:

| Area | Points | Check |
|---|---:|---|
| Direction coverage | 20 | Is the proposed set broad enough for the decision? Do the mechanisms genuinely differ? Are obvious alternatives or constraints missing? Is the user's selection recorded? |
| Decision and metrics | 15 | Does each metric answer the decision? Are thresholds, success/failure, and stop rules explicit? |
| Baseline and controls | 15 | Is the baseline the real current implementation? Same workload/environment/version? No strawman or unfair comparison? |
| Experiment sufficiency | 20 | Does each selected direction have enough demos, runs, edge/semantic cases, and variance? Does the plan test fit against a representative project slice (no separate migration phase)? |
| Reproducibility and artifacts | 10 | Commands, versions, seeds, raw data, environment, cleanup, and retention defined? |
| Risk and timebox | 10 | Dependencies, license, security, failure modes, timebox, and stop/abort conditions addressed? |
| Reviewability | 10 | Claims are testable; assumptions are exposed; the plan is concrete enough to execute without inventing steps? |

Gate: **>=85 and no P0/P1**. P0 means the plan cannot support the decision.
P1 means the baseline, metrics, or evidence design would invalidate a conclusion.
P2 is material but fixable; P3 is minor.

Verdict: `PASS` or `REVISE`. On `REVISE`, list every blocking item and the exact
change that would make it pass. Demos may not start until the plan passes and
is re-reviewed. A direction change after review needs the user's confirmation.

## Gate 2 - Results review, before the user sees conclusions

Inputs: the approved plan, execution logs, raw data, artifacts, analysis, and
draft memo.

Check process:

- commands and environment match the plan; missing runs are explained;
- baseline and candidates ran under the same conditions;
- sample count, warmup, variance, and outliers support the stated precision;
- raw data matches the reported numbers; no cherry-picking or silent filtering;
- semantic/behavioral parity and edge cases were tested, not only speed;
- failed, invalid, or aborted experiments are retained and explained;
- experiments used a representative project slice for fit; no separate
  migration phase was invented.

Check evidence-to-conclusion:

For each claim, record:

| Claim | Evidence | Status | Allowed wording |
|---|---|---|---|
| <claim> | <artifact / run / data> | supported / partial / unsupported | <exact wording the evidence permits> |

Then check:

- does the evidence actually support the claim, or only a weaker one?
- are alternative explanations or confounders ruled out?
- are contradictions and missing data disclosed?
- is confidence tied to evidence, not intuition?
- what can **not** be concluded, and what evidence is missing?
- does the memo include only reviewed claims, with `measured-here`,
  `measured-sandbox`, or `reported` labels?
- if implementation or migration is recommended, is it clearly a Development /
  Program decision rather than a research result?

Gate: every claim in the user-facing memo is **supported** or explicitly
**partial with a stated limit**. No unsupported claim may be presented as a
conclusion. Verdict `PASS` or `REVISE`. On `REVISE`, state the exact missing
evidence, whether to rerun/revise/downgrade, and what would make the claim
pass. Only after PASS does the memo go to the user.

## Explicit-feedback rules

Every finding must contain:

1. **Severity**: P0/P1/P2/P3 and blocking/non-blocking.
2. **Location**: plan section, experiment, artifact, data file, or claim.
3. **Evidence**: what the reviewer inspected; quote the exact number/command.
4. **Why it matters**: the decision or conclusion it invalidates.
5. **Required action**: the exact experiment, metric, comparison, or wording.
6. **Pass condition**: what the reviewer will check on re-review.

Forbidden feedback: "improve the plan", "looks reasonable", "consider more
data", "maybe add tests", or a score without findings. If the reviewer cannot
verify something, mark `REVISE` and name the missing evidence. If a finding is
non-blocking, say why it does not block the gate.

The reviewer does not rewrite the plan or memo; the author revises and requests
re-review. Re-review checks the changed items and their regressions.

## Report templates

Plan review:

```markdown
# Plan review
Verdict: PASS | REVISE
Score: <n>/100
P0/P1 blocking: <none | list>

## Findings
- [P1][blocking] Location: ...
  Evidence: ...
  Why: ...
  Required action: ...
  Pass condition: ...

## Re-review
<changed items and regression checks>
```

Results review:

```markdown
# Results review
Verdict: PASS | REVISE

## Process findings
- [P1][blocking] Location: ...
  Evidence: ...
  Required action: ...
  Pass condition: ...

## Claim verdicts
| Claim | Evidence | Status | Allowed wording |
|---|---|---|---|

## What cannot be concluded
<limits, missing evidence, next experiment>

## Re-review
<changed items and regression checks>
```

## Anti-patterns

- Self-review or author/reviewer swapping.
- Reviewing only the prose and not the raw data/commands.
- Accepting upstream benchmarks as evidence for this project.
- A score with no blocking findings or no exact pass condition.
- Starting demos while plan review is `REVISE`.
- Sending the user an unsupported conclusion "with caveats".
- Reviewer rewriting the work instead of stating the required correction.
- Adding a separate migration phase to research; actual migration belongs to
  Development/Program.

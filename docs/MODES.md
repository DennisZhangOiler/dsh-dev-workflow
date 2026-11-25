# Modes: Light / Standard / Deep

Pick the mode that matches the work. The agent should ask once if it is unclear;
the default is **Standard**. You can switch at any time ("go light", "use deep").
Mode is about ceremony, not quality: every mode still tests what it claims.

| | Light | Standard (default) | Deep |
|---|---|---|---|
| Best for | copy/docs, one-file fix, diagnostic, small reversible change | normal feature/bugfix/refactor, UI change, research question | high-risk, security/PII/migration/production/scale, large Program, regulated work |
| Contract | short AC/check in chat | contract file for non-trivial work | full contract + hash + user confirmation |
| Independent review | none (self-check) | one when medium/high risk, UI design, or a consequential research decision | plan review, results/verifier review, UI/research scoring |
| UI | implement + self screenshot | one direction; score when UI design/high impact | directions, per-area floors, independent score, freeze |
| Research | decision frame + one spike + internal unreviewed note | plan + spike + one review for a consequential decision | R0–R7, independent plan/results reviews, CLAIMS/memo |
| E2E/calibration | none | only where risk requires it | full evidence pack; calibration when the decision is high-impact |
| Human gate | destructive/remote ops | high-risk/destructive | all high-risk + release |

## Examples

- **Light**: "rename this label", "fix this one-line null check", "why is this test failing?" — no contract file, no reviewer, but run the relevant test/check and report what was not run.
- **Standard**: "add CSV export", "change this page's filter UI", "should we replace this library?" — write a short contract, implement, test; use one independent review when it is medium/high risk or user-facing design.
- **Deep**: auth/payment/PII changes, data migration, production rollout, a multi-module Program, or a decision that will be cited externally — use the full gates and evidence.

## Selecting

At the start of a task, infer from scope/risk. If ambiguous, ask once:
“Light / Standard / Deep?” Do not ask again for every step. If the user says
"just do it" or is away, choose the safer mode for the risk (Standard by
default; Deep for high-risk) and state the assumption.

## What is *not* optional

Safety, secrets, protected branches, explicit confirmation for destructive/
remote operations, and human approval for high-risk production work are never
skipped. Light/Standard may skip artifacts, not those.

## Deep reference packs

The `docs/e2e/0.8/` packs (UI, No-UI, Program, high-risk, research) are
**Deep-mode reference evidence**, not a requirement for every task. They show
what a serious gate looks like; use them when the work warrants it.

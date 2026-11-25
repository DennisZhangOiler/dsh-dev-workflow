# Contract, acceptance, and risk

Use at Phase 1, Phase 4, and Phase 7. The contract is the change's objective
acceptance contract, not a prose summary. Without it, "tests pass" is not
evidence that the user's requirement was met.

## Contract template

```markdown
## Goal
<problem and desired outcome>

## Scope
In: <...>; Out / non-goals: <...>

## Risk tier
trivial | low | medium | high  (rules below)

## Acceptance criteria
- AC-1: Given <context>, when <action>, then <observable result>.
- AC-2: <main path, negative path, permission/disabled, boundary, state change>
- UI: <mobile/keyboard/a11y/long-text/large-data criteria if applicable>

## Definition of Done
- Code: <...>
- Tests: <AC coverage + test levels>
- lint / typecheck / build: <commands and pass condition>
- Docs / migration / rollback / observability: <if applicable>
- Security / privacy / license: <if applicable>

## Non-functional requirements (applicable only)
| NFR | Metric/target | How measured | Evidence | Owner |
|---|---|---|---|---|

## Data / API / migration
<schema/API compatibility, migration, backfill, rollback>

## UI contract (UI design/behavior only)
Pages/components; primary action; states; viewports; design system; accepted direction

## Verification matrix
| AC | Test / command | Evidence | Verifier result |
|---|---|---|---|

## Risks and rollback
<failure modes, detection, rollback command/owner, data safety>

## Delivery
<project-documented path; no assumption of MR/CI/deploy>
```

For a trivial change, compress the fields but keep scope, AC, DoD, risk, and
rollback. For `No UI`, omit UI fields and say "no UI involved". For `UI
behavior`, include before/after desktop and mobile evidence and mobile-overflow/
keyboard checks; do not omit them because it is "only behavior".

## Contract artifact, AC quality, and freeze

Write the contract to `docs/contracts/<change>.md` (or the project docs path).
Record a SHA-256, the user's confirmation quote/time, and the confirmed change
list. Any AC/scope/risk-tier change gets a new hash and explicit re-confirmation;
an AC added after implementation is invalid. The verifier checks the hash and the
confirmation record before accepting the contract.

Each AC must have **one observable result**, a Given/When/Then form, and no
"as agreed", "if needed", "TBD", or conditional outcome. Map the user's stated
goal/requirements to ACs or explicit non-goals; each in-scope requirement needs
an AC. A weak AC is a REVISE even if tests pass. Include negative/permission/
boundary/state ACs or write why they are not applicable.

## Risk tiers

| Tier | Examples | Minimum gates |
|---|---|---|
| **trivial** | docs, comments, formatting, no runtime behavior | local diff, relevant command, self-check; one status update; no test author/verifier required |
| **low** | small isolated code/config change | feature agent, independent test author, read-only verifier; test/lint/typecheck/build as defined |
| **medium** | shared module, API, UI design, multi-file behavior | low + AC traceability, UI evidence, broader regression, CI/manual build evidence |
| **high** | auth, permissions, PII/payments, secrets, data migration, production deploy, high-traffic | medium + threat model, SCA/license, SAST/secrets scan, load/failure test, migration rehearsal, rollback rehearsal, post-deploy plan, human code review/release approval |

The tier is chosen in Phase 1 and may be raised (never silently lowered) when a
new surface appears. It is a **proposal**, not a self-certification: Phase 4 asks
the user to confirm it, and Phase 7 asks the verifier to challenge it. Auth/PII/
payments/secrets/migration/production/scale in the diff forces high-risk; lowering
it requires a written user decision. For high risk, missing SCA/license/SAST/
secrets tooling is **BLOCKED or a user waiver**, not "skipped with reason".

For a small behavior fix with an existing test and <=2 files, `low` may use the
feature agent for the regression test; the verifier still runs independently and
checks the AC. Use `trivial` only for docs/comments/formatting with no runtime
behavior; a formatting change that alters semantics is not trivial.
 High-risk work cannot skip a gate because of time pressure.
The agent does not replace human code review, security review, or release
ownership.

## NFRs

Fill only applicable rows, but say why a row is not applicable for high-risk
work:

- performance: p50/p95/p99, throughput, memory, bundle/build size;
- reliability: error rate, retries, timeouts, failure injection;
- security/privacy: threat model, authz/authn, input handling, secrets, PII,
  data retention, audit logging;
- compatibility: API/schema/versioning, browser/device, migration;
- observability: logs, metrics, traces, dashboards, alerts;
- accessibility: contrast, keyboard, screen reader, zoom/reflow, touch targets;
- operations: feature flag/canary, rollback time, runbook, owner.

Each NFR needs a measurement and evidence, not just a target.

## Traceability

Every AC maps to at least one test or executable check and to recorded evidence
(command, exit code, screenshot, log, API response). The test author produces
the matrix; the verifier checks it independently. Missing mapping means the AC
is unverified, not "probably fine".

## Gates

- **Phase 1**: contract complete; risk tier stated; AC/DoD/NFR proposed; ask only
  material product questions once.
- **Phase 4**: user confirms AC, DoD, NFRs, risk tier, and change list. Agreement
to a detail does not approve the rest. Any AC/tier change is re-confirmed.
- **Phase 6**: tests cover each AC, including negative/permission/boundary/
  state cases; skipped checks are listed with a reason.
- **Phase 7**: read-only verifier first checks AC quality/freeze/tier, then every
  AC and evidence; weak AC, missing evidence, failed commands, or untraceable
  claims = REJECT.
- **Phase 9**: delivery evidence includes contract, AC matrix, commands,
  verifier record, and applicable migration/rollback/post-deploy evidence.

## Program-level contract

A Program also needs a program contract: architecture decisions, program-level
AC/DoD/NFR/risk tier, cross-cutting threat model/migration/rollback/observability,
and AC→module→contract-test→evidence mapping. High-risk cross-cutting work needs
human code/security/release approval before modules start. A module PASS does not
satisfy the program contract; integration verifier checks the program-level ACs.

## Anti-patterns

- "Tests pass" with no AC mapping.
- "As agreed" / "if needed" / TBD ACs or ACs added after implementation.
- AC written after implementation to match what was built.
- Marking NFRs N/A without a reason.
- Treating a unit test as evidence for a UI/API/integration AC.
- Lowering the risk tier after seeing the diff.
- Verifier signing off on an AC it did not inspect.
- Claiming build/typecheck/CI without a recorded command or pipeline.

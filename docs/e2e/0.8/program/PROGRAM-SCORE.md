> **SUPERSEDED** by `PROGRAM-SCORE-R2.md` (86/100 PASS, 0 P0/P1). This is the 82/FAIL first review record.

# Program score — 0.8 readiness service + dashboard consumer

- **Reviewer:** `program-verifier-1` (independent, read-only; not the author)
- **Date:** 2026-11-25 (Asia/Shanghai), Node v22.23.2
- **Gate:** the request's Program gate — five areas, total >=85, no P0/P1. The repository has no separate Program scoring rubric, so this file uses the five requested areas and states the weights explicitly.
- **Subject:** `docs/e2e/0.8/program/` — 13 files: `PROGRAM.md`, `CONTRACT-HASHES.txt`, `RUNTIME-ISOLATION.md`, `GAP-LOG.md`, `contracts/readiness.schema.json`, `provider/evidence-service.mjs`, `provider/data/readiness.json`, `consumer/dashboard-api.mjs`, four test files, `package.json`.
- **Independence:** I did not author the pack and had no author transcript. I read `docs/e2e/0.8/ui/UI-SCORE-R2.md` only as a report-format example; no Program number or finding was reused. Mutants and probes ran on copies under `/tmp`; the repository was not modified. **Only this file was written.**
- **Scope:** this scores the reduced local Program E2E pack, not the full Program gate approvals (architecture approval, UI freeze, module-plan approval, integrated-preview acceptance) and not production readiness.

## Verdict

**FAIL / REVISE — 82/100 — 0 P0 / 1 P1 / 7 P2 / 3 P3.**

The pack is clean, deterministic and unusually honest about its scope, and every contract hash matches. It still misses the stated gate: **82 < 85**, and **P1-1** is a claimed contract test that does not test the claimed property. The P1 is an evidence defect, not a data-corruption bug: the checked-in consumer does reject a missing release with the intended error, but the test named for that property never reaches the release check. All of the disclosed out-of-scope items (no process isolation, no live server, no UI wiring, no post-deploy) are **not** the reason for the FAIL; the failure is in-scope evidence quality.

## Score

| Area | Weight | Score | Assessment |
|---|---:|---:|---|
| Architecture and contract | 25 | **21** | Clean two-module split, pure provider, explicit and cwd-independent data path, schema + hash freeze. Schema is never executed; provider accepts nested properties the schema forbids; consumer validation is thinner than the contract. |
| Provider/consumer contract tests | 25 | **18** | 6/6 green and deterministic; mapping, no-mutation, enum rejection and isolation are meaningful. One claimed test is blind (P1-1), 4 of 8 contract mutants survive, and the schema is never exercised. |
| Runtime isolation | 20 | **17** | Pure provider with no module-global mutable state; two temp data dirs return different candidates; cleanup is correct; a single-slot global-cache mutant is caught. But "two instances" are two calls in one Node process; no concurrency or process isolation. |
| Risk and gap honesty | 15 | **13** | The five scope gaps are explicitly logged; no fake live/published claim; `published: false` and active profile `0.7.0` are true. `12/12` vs local `6/6` is a provenance trap; the evidence gaps found here are not in `GAP-LOG.md`. |
| Reviewability | 15 | **13** | All three hashes verify with `sha256sum -c`; the fixture independently validates against the schema; three repeat runs are identical; no dependencies or network. No recorded run log/date/Node/exit, no hash-verification instruction, freeze is not enforced, and the pack is not wired into the repo's evidence index. |
| **Total** | **100** | **82** | **NOT PASS** — below 85 and one P1. |

Anchors: 0 = missing/unusable; 50 = present with a material gap; 100 = specific, measured, task-fit. The total is a gate, not a diagnostic.

## What I actually ran

```sh
cd docs/e2e/0.8/program && node --test
# 6 tests, 6 pass, 0 fail, 0 skipped; exit 0; ~34 ms

node --test   # repeated 3 times
# 0 fail each time; no flake observed

sha256sum -c CONTRACT-HASHES.txt
# contracts/readiness.schema.json: OK
# provider/evidence-service.mjs: OK
# consumer/dashboard-api.mjs: OK

node --test test/plugin.test.mjs test/gates.test.mjs   # repo root
# 12 tests, 12 pass — this is where the fixture's 12/12 comes from

python3 -c 'jsonschema.validate(fixture, schema)'
# fixture validates against contracts/readiness.schema.json (draft 2020-12): OK
```

Additional probes (read-only, on a `/tmp` copy where mutation was required):

- default provider path from `cwd=/tmp` returns `0.8.0` — the data path is module-relative, not cwd-relative.
- `toDashboard` with non-empty gates and no `release` throws `release.published required` (the implementation is correct).
- `toDashboard({ gates: [] })` throws `gates required` — the reason P1-1 is blind.
- gate/release extra property is accepted by `assertReadiness` but rejected by the schema.
- unknown gate status becomes label `unknown` and is **not** in `blocked`.
- missing `candidate` produces `title: "readiness undefined"`.
- `release.published = true` produces `decision: "published"` even when other gates are blocked.

## Contract hash check

| Artifact | Hash in `CONTRACT-HASHES.txt` | Computed | Result |
|---|---|---|---|
| `contracts/readiness.schema.json` | `62a8b63b…c6c4` | `62a8b63bc4b5b718c297ef94edb764a220b614dd25f1e917397ddf96bb42c6c4` | **OK** |
| `provider/evidence-service.mjs` | `fa5f5aa0…78db` | `fa5f5aa0f726503dad6eb2a9a57c8983698c5c0265aeb243bac81114cfe478db` | **OK** |
| `consumer/dashboard-api.mjs` | `910a2cd4…7984` | `910a2cd4dcc542bd62b2d7c183cb2d9176588417defef6ea6d5b8f6012ba7984` | **OK** |

The hash freeze itself is sound for these three files. It does **not** cover the tests or the readiness fixture, so test evidence can change after a "freeze" without hash drift (P2-6).

## Architecture and contract

Strengths:

- Provider is a pure read → parse → assert function with no module-global cache; it takes an explicit path and works from any cwd (verified from `/tmp`).
- Consumer is a pure view-model mapper; it creates new gate objects and does not mutate the provider object (verified by the snapshot test and by code inspection).
- The root key set, version pattern, non-empty gates, status enum, score range, tests integers and release shape are all checked; the fixture is valid against the declared schema.
- The architecture diagram and the contract summary in `PROGRAM.md` are short and decision-complete for this reduced scope.

Weaknesses:

- `contracts/readiness.schema.json` is never read by any code or test (`grep` found no consumer). The test named "schema-valid" checks only candidate, published and `passed === total`. The current fixture happens to validate, but conformance is not enforced.
- The provider is **looser than the schema** for nested extra properties: `{ gates: [{ id, status, score, extra: 1 }], ... }` and `{ release: { ..., extra: 1 } }` pass `assertReadiness`, while the schema rejects them. This is a real contract divergence, not just a documentation gap.
- The consumer's "minimal validation" accepts an unknown gate status (`label: unknown`, not blocked) and a missing candidate (`readiness undefined`). The provider currently prevents both, but the consumer contract is weaker than the declared data contract.
- `decision` is derived only from `release.published`; a payload with `published: true` and blocked gates renders `decision: published` with a non-empty `blocked` list. That may be intended for a release-state view, but it is undocumented and untested.

## Provider/consumer contract tests

| Claim in `PROGRAM.md:24-29` | Test | Independent result |
|---|---|---|
| Provider returns schema-valid output | `test/provider.test.mjs:5-10` | **PARTIAL** — checks 3 fields, not the schema; the fixture independently validates, but conformance is not part of the suite. |
| Provider rejects a malformed gate status | `test/provider.test.mjs:12-14` | **PASS** — removing the enum check fails this test. |
| Consumer maps and does not mutate | `test/consumer.test.mjs:6-14` | **PASS** — mutating `readiness.candidate` fails the no-mutation snapshot and the isolation test. |
| Consumer rejects missing release | `test/consumer.test.mjs:16-18` | **FAIL** — the input `{ gates: [] }` throws `gates required` before the release check. The test never exercises the release branch. See P1-1. |
| Provider → consumer stable across two reads | `test/integration.test.mjs` | **PASS** — two reads produce deep-equal dashboards. |
| Two provider instances / no shared state | `test/isolation.test.mjs:16-31` | **PARTIAL** — two calls with separate dirs; a single-slot global cache is caught, but this is one process, not two instances. |

Mutation audit (8 mutants, each applied to a fresh `/tmp` copy, original 6/6 green):

| Mutation | Result | Caught? |
|---|---|---|
| Remove consumer `release.published` check | 6 pass / 0 fail | **NO** |
| Remove provider root key-set check | 6 pass / 0 fail | **NO** |
| Add provider single-slot global cache | 5 pass / 1 fail | YES (isolation test) |
| Remove provider gate status enum | 5 pass / 1 fail | YES (provider malformed-status test) |
| Make consumer mutate input | 4 pass / 2 fail | YES (no-mutation + isolation) |
| Map `partial` to `ready` | 5 pass / 1 fail | YES (blocked list) |
| Remove `passed <= total` check | 6 pass / 0 fail | **NO** |
| Remove version regex | 6 pass / 0 fail | **NO** |

Mutation score: **4/8 (50%)**. The suite is not vacuous — the four caught mutants are meaningful — but the four survivors are all declared validation branches.

## Runtime isolation

Verified:

- No module-global mutable state in the provider; `ALLOWED` is a constant set and is never mutated.
- Two `mkdtemp` directories with different candidate versions return different dashboard titles (`0.8.0` vs `0.9.0`).
- `finally` removes both temp directories; no repo writes; no shared env var, port or writable data dir.
- A single-slot cache mutant is caught, so the test is not a tautology.

Not proven:

- These are two **function calls in the same Node process**, using one imported module instance. The test does not create a second instance, worker or child process, and does not run reads concurrently. `RUNTIME-ISOLATION.md:9-10` honestly says this: "same Node process; this proves no shared module state, not process isolation."
- `PROGRAM.md:28` and the test title say "two provider instances"; that wording is broader than what is proven. This is a P2, not a P1, because the limitation is disclosed in the same pack.
- Concurrency, file-lock behavior, a real data-dir collision and process-level env leaks are untested (all out of scope for the disclosed reduced E2E).

## Risk and gap honesty

`GAP-LOG.md` lists five gaps; I verified each is real and none is hidden:

| Gap | Verified |
|---|---|
| No live HTTP server | Yes — library-level only; no server code. |
| No UI wiring | Yes — consumer is a mapper; no DOM/component. |
| No process/container isolation | Yes — same-process test; `RUNTIME-ISOLATION.md` discloses it. |
| No post-deploy/observability | Yes — no telemetry, smoke or rollback. |
| Static readiness JSON | Yes — no refresh/watch; the fixture is clearly static. |

The readiness payload is also honest on the release state: `published: false`, `tag: null`, active profile `0.7.0`, notes "local candidate; no commit/push/tag/install". No fake green, no fake live claim.

Weaknesses:

- The fixture says `tests: 12/12`; this pack actually runs **6/6**. The 12/12 is true for the repo root suite (`test/plugin.test.mjs test/gates.test.mjs`), and the UI pack documents that provenance (`docs/VERIFICATION.md:17`), but the Program pack does not. `GAP-LOG.md:12` says the score must not exceed "the evidence of 6/6 tests", creating an apparent 2× contradiction inside the same pack. The consumer test hardcodes `'12/12'`, coupling this local pack to the root suite's count.
- The log does not record the schema-conformance gap, the blind release test, or the missing negative-path coverage. The sentence "No gap is hidden in the readiness payload" is true in the narrow sense but reads stronger than the evidence.
- No independent Program score existed before this file; `PROGRAM.md:30-31` says hashes must not change "after the independent demo score", and this file is that first score. That is a sequencing gap, not a false claim.

## Reviewability

Strong:

- `sha256sum -c` passes for all three contract artifacts; the hashes are reproducible in one command.
- The fixture independently validates against the declared schema with `jsonschema`.
- Three repeat runs are identical; the tests use only Node built-ins (`node:test`, `node:assert`, `node:fs/promises`, `node:os`, `node:path`), no dependencies, no `node_modules`, no lockfile, no `fetch`/`http`/`net`/env access.
- The pack is small (229 lines of code/docs across 13 files) and readable in one sitting.

Weak:

- There is no recorded run log in the pack: no date, Node version, command output, exit code, or hash-verification command. `RUNTIME-ISOLATION.md:7` says "6 tests, 0 fail" without the environment.
- The freeze is a prose rule, not a check. No script/CI recomputes `CONTRACT-HASHES.txt`; no test hashes the tests or fixture; the pack is untracked in git, so there is no commit anchor.
- `test/check.mjs:61-81` and `test/gates.test.mjs` maintain evidence lists but do not include the Program pack; `docs/VERIFICATION.md:147` said at review time "There is no full 0.8 Program E2E pack yet". `PROGRAM-SCORE.md` itself is not yet in any evidence index. These are repo-integration follow-ups for the program lead, not pack-code defects, but they block future discovery.

## Findings

### P0 — Blocking

None.

### P1 — Major

- **P1-1 · The "consumer rejects missing release" contract test is blind.**
  Location: `test/consumer.test.mjs:16-18`; claimed in `PROGRAM.md:26`.
  Evidence: the test calls `toDashboard({ gates: [] })`, which throws `gates required` at `consumer/dashboard-api.mjs:5` before the release check at line 6. Removing the release check leaves **6/6 tests green** (mutation audit). With non-empty gates and no `release`, the checked-in consumer correctly throws `release.published required`, so the implementation is sound; the test does not prove it. The mutant instead throws an uncontrolled `TypeError: Cannot read properties of undefined (reading 'published')`, showing that the error contract itself regresses untested.
  Impact: a regression in the consumer's release validation, or in its controlled error semantics, passes the Program E2E.
  Fix: pass a non-empty `gates` array without `release` and assert the exact `/release.published required/` error; optionally add a second test for the uncontrolled-path guard.
  Pass condition: the test fails when the release check is removed, and its input actually contains gates.

### P2 — Moderate

- **P2-1 · The declared schema is not executable and the provider diverges from it.**
  Location: `contracts/readiness.schema.json`; `test/provider.test.mjs:5-10`; `provider/evidence-service.mjs:7-17`.
  Evidence: no code/test reads the schema; "schema-valid" checks three fields; `assertReadiness` accepts extra properties inside `gates[]` and `release` that the schema rejects (verified both ways). The current fixture is schema-valid, so this is a drift risk, not a current invalid output.
  Impact: a provider change can make the output schema-invalid while all tests stay green.
  Fix: add a dependency-free schema-conformance check (or a small validator) that reads `contracts/readiness.schema.json` and validates the fixture and provider output; add negative fixtures for nested extra properties.
  Pass condition: adding an extra gate/release key fails a test, and the schema is exercised by the suite.

- **P2-2 · Contract-test coverage is thin; 4/8 mutants survive.**
  Location: `test/*.mjs`.
  Evidence: the test suite does not cover malformed JSON, a missing file, a bad version, a non-empty extra-key payload, `passed > total`, `published: true`, or an unknown status. Mutation audit: the release check, root key-set check, `passed <= total` check and version regex can all be removed with 6/6 green.
  Impact: the contract's negative space is mostly unproven; the green suite overstates coverage.
  Fix: add table-driven negative cases for each validation branch and one `published: true` decision test; keep the fixture positive case.
  Pass condition: every validation branch has at least one test that fails when the branch is removed.

- **P2-3 · "Two provider instances" is two calls in one process.**
  Location: `test/isolation.test.mjs:16-31`; `PROGRAM.md:28-29`.
  Evidence: one imported module, two `getReadiness` calls, no worker/child process, no concurrency; a single-slot global cache is caught, so the test has value. `RUNTIME-ISOLATION.md:9-10` discloses the same-process limit.
  Impact: the pack overstates instance-level isolation; concurrency and process isolation are not proven.
  Fix: rename the test/claim to "two loads with separate data dirs"; add a `Promise.all` concurrent read test; if process isolation is in scope, spawn two child processes; otherwise state "instance = invocation; process isolation out of scope" in `PROGRAM.md`.
  Pass condition: wording matches the test, and concurrency is either tested or explicitly out of scope.

- **P2-4 · Two different test counts (`12/12` vs `6/6`) with no statement of scope.**
  Location: `provider/data/readiness.json:9`; `test/consumer.test.mjs:11`; `GAP-LOG.md:12`.
  Evidence: the pack runs 6 tests; the repo root runs 12 (`node --test test/plugin.test.mjs test/gates.test.mjs` = 12/12); `docs/VERIFICATION.md:17` records 12/12. The Program pack never says the fixture's `tests` field is candidate-wide. The consumer test hardcodes `12/12`, so adding a root test breaks the Program E2E.
  Impact: a reviewer can attribute repo-level tests to the Program pack, or see an apparent contradiction with `GAP-LOG.md`.
  Fix: state the scope in `PROGRAM.md`/the fixture (root suite vs program suite) and decouple the consumer assertion from the literal count (derive it from the input, or use a format assertion).
  Pass condition: one documented scope; no hardcoded cross-pack test count.

- **P2-5 · Consumer accepts unknown status and a missing candidate; `decision` ignores gates.**
  Location: `consumer/dashboard-api.mjs:3-8, 12-21`.
  Evidence: `{ status: 'weird' }` renders `label: 'unknown'` and is absent from `blocked`; deleting `candidate` produces `title: "readiness undefined"`; `published: true` plus blocked gates produces `decision: "published"` with a non-empty `blocked` list.
  Impact: malformed data can render a misleading "not blocked" dashboard; decision semantics are ambiguous.
  Fix: reject unknown statuses or include them in `blocked`; require `candidate`/`activeProfile` in the consumer's minimal check; document or enforce the `decision`/`blocked` relationship.
  Pass condition: tests cover unknown status and missing candidate, and the decision semantics are stated.

- **P2-6 · No run log, no hash-verification instruction, no enforced freeze.**
  Location: `RUNTIME-ISOLATION.md:7`; `CONTRACT-HASHES.txt`; `PROGRAM.md:30-31`.
  Evidence: no date/Node/exit code in the pack; the hash file is a bare `sha256sum` list with no verification command; hashes cover only the three contract artifacts, not the tests or fixture; no script/CI recomputes them; the pack is untracked in git.
  Impact: a future reviewer cannot tell when/with what the evidence was produced, and the freeze can drift silently.
  Fix: add a `COMMANDS.md` or `verify.sh` that runs `node --test` and `sha256sum -c`, records date/Node/exit; hash the test files and fixture too; wire the command into CI or the repo check.
  Pass condition: one command reproduces tests + hashes and fails on drift.

- **P2-7 · The pack is not integrated into the repo's evidence index.**
  Location: repo root; `test/check.mjs:61-81`; `docs/VERIFICATION.md:147`.
  Evidence: the pack is entirely untracked (`git status`); `test/check.mjs` requires research/UI evidence but not `docs/e2e/0.8/program/`; `docs/VERIFICATION.md:147` said at review time there is no full 0.8 Program E2E pack; `PROGRAM-SCORE.md` is not in any list.
  Impact: the pack can be missed by the packaging check, deleted/emptied without failing `npm run check`, and the repository's own verification record contradicts its existence.
  Fix: add the pack files and this score to `test/check.mjs`; update `docs/VERIFICATION.md`; commit the pack and score.
  Pass condition: `npm run check` fails if the pack is missing/empty, and the verification index points to it.

### P3 — Minor

- **P3-1 · Empty `data/` directory.** Location: `docs/e2e/0.8/program/data/`. No file, no documented purpose; remove it or put the fixture there if that was the intent.
- **P3-2 · API naming/clarity.** `getReadiness(dataDir = …)` takes a file path, not a directory (`provider/evidence-service.mjs:21`); both provider and consumer export an `assertReadiness` with different strength; `unknown` is not part of the declared status vocabulary. Rename to `dataPath`, share/rename one assertion, and document the label fallback.
- **P3-3 · Label mapping is only partially asserted.** `test/consumer.test.mjs:12` asserts only the blocked IDs; there is no direct assertion that `pass` → `ready` and `missing` → `not run`. Add one assertion per label branch; no behavior change needed.

## Not proven (explicit)

These are **not** counted as the reason for the FAIL where they are disclosed and out of scope, but they must not be implied by a PASS:

1. **Process/container isolation** — only two calls in one Node process; no worker/child process, no concurrency, no env-leak test. Disclosed in `RUNTIME-ISOLATION.md:9-10`.
2. **Live server/HTTP** — no server, no transport, no network contract; this is a library-level E2E. Disclosed.
3. **UI wiring/rendering** — the consumer is a pure mapper; no DOM/component test and no dashboard capture from this pack. Disclosed.
4. **Post-deploy/observability** — no smoke, telemetry, monitoring, rollback or production data. Disclosed.
5. **Live provider refresh** — static JSON, no watch/cache/invalidation. Disclosed.
6. **Schema conformance automation** — current fixture is valid, but no code executes the schema; provider accepts nested extras the schema rejects. Not disclosed in `GAP-LOG.md` (P2-1).
7. **Full Program gate approvals** — no architecture-approval record, UI-freeze record, module-plan approval or integrated-preview acceptance in this pack; it is a reduced E2E, not a full Program gate. Not claimed, but not proven.
8. **Release/publish** — no tag, push or install; `published: false` and active profile `0.7.0` are correct. No production proof.
9. **Freeze enforcement** — the hash rule is prose only; hashes can drift silently after this score.
10. **Negative-path evidence** — malformed JSON, missing file, bad version, extra keys, `passed > total`, `published: true`, unknown status: untested or only partially tested.
11. **Network non-use** — verified by source inspection and absence of dependencies, not by a network sandbox.
12. **Reviewer independence** — I am a separate read-only subagent, but independence is prompt/context-based, not sandbox-enforced; this is the same limitation recorded in `docs/VERIFICATION.md` §7.

## Gate checklist

- [ ] **Total >= 85** — **82**, fail.
- [x] **No P0** — 0.
- [ ] **No P1** — **1** (P1-1), fail.
- [x] **Tests run** — `node --test`: 6/6 pass, exit 0, repeated 3×.
- [x] **Contract hashes match** — 3/3 via `sha256sum -c`.
- [x] **No mutation** — consumer creates new gate objects; snapshot + code inspection; the mutate-input mutant is caught.
- [ ] **Two-instance isolation** — partial: two calls with separate temp dirs; no second instance/process/concurrency (disclosed).
- [x] **No network/dependencies** — source-inspected; only Node built-ins; no `node_modules`/lockfile/install.
- [x] **Gap log honest about scope** — five gaps verified; no fake green/live/publish claim. Missing evidence-level gaps are listed here (P2-1..P2-7).
- [ ] **Reviewable from the pack alone** — hashes/tests are reproducible, but no run log/date/Node, no freeze check, and the pack is not indexed/committed.
- [x] **Scope stated** — local reduced E2E, not a product release; `published: false`.

## Re-score conditions

This is a **REVISE**, not a permanent failure. A local reduced E2E can reach >=85 without proving process isolation, a live server or post-deploy, because those are disclosed and out of scope. To re-score:

1. Fix **P1-1** (non-empty gates, missing `release`, exact error assertion).
2. Make the schema executable and add a conformance/negative test (**P2-1**, **P2-2**).
3. Rename/scope the isolation claim and add a concurrency test, or explicitly scope it out (**P2-3**).
4. Resolve the `12/12` provenance and decouple the literal from the root suite (**P2-4**).
5. Add a `COMMANDS.md`/`verify.sh` run log and hash the tests/fixture (**P2-6**); update `test/check.mjs` and `docs/VERIFICATION.md` (**P2-7**).
6. Re-run this gate. Do not claim PASS before P1-1 is closed, even if the total rises above 85 by other additions.

## Inputs and hashes

| Input | SHA-256 |
|---|---|
| `PROGRAM.md` | `eaefd186475f204440b3288390177897cd9e49690f51b9a74849ffdb71138fa1` |
| `CONTRACT-HASHES.txt` | `c43521572102611eb311dde15b0df3908303add5b1545f8216e86c61d8750987` |
| `RUNTIME-ISOLATION.md` | `df1c58d7012f1fb45ef22ff769faf729fe0667eb0ad60871071ecfbfa1b36679` |
| `GAP-LOG.md` | `1089303e29d88f2c149b102dd8287136a2b2a05df080e78703595ae17f87828f` |
| `contracts/readiness.schema.json` | `62a8b63bc4b5b718c297ef94edb764a220b614dd25f1e917397ddf96bb42c6c4` |
| `provider/evidence-service.mjs` | `fa5f5aa0f726503dad6eb2a9a57c8983698c5c0265aeb243bac81114cfe478db` |
| `provider/data/readiness.json` | `4825c38161c48e9da41ab1ac0a1f0123b10962112e8edd6886f92453b080ea4d` |
| `consumer/dashboard-api.mjs` | `910a2cd4dcc542bd62b2d7c183cb2d9176588417defef6ea6d5b8f6012ba7984` |
| `test/provider.test.mjs` | `aab6fcdc7688d7cca635de6c708a22c7a8efc51fa5fdd6529d8ec5d9c6f390ec` |
| `test/consumer.test.mjs` | `4bc152f0f1f22e77506385e599223932bc328dff47b2595a7994ee00456783bc` |
| `test/integration.test.mjs` | `a6b58e425df4407faebd62698980068dafb29aa9100678d1536c9fb89c40cde4` |
| `test/isolation.test.mjs` | `3f3e1260acdbfaf999cd5e05525f801d6c8391ca9aa5e04c3654b4edf423d20e` |
| `package.json` | `c6ac75bc17398e42d5ef20b5c4487a60a509038a800f0f23682311a274e92e5e` |

The pack was untracked in git at review time (repo commit `14d31df` plus uncommitted work), so these hashes are the only stable identity for this review. My mutant/probe copies were under `/tmp` and were removed; no existing pack file was edited — this score is the only added file.

**Final: 82/100 — FAIL / REVISE — 0 P0 / 1 P1 / 7 P2 / 3 P3.**

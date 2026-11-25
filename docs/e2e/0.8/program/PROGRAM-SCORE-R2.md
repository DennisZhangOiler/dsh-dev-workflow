# Program score R2 — 0.8 readiness service + dashboard consumer

- **Reviewer:** `program-verifier-2` (independent, read-only; not the author)
- **Date:** 2026-11-25 14:17–14:21 Asia/Shanghai, Node v22.23.2
- **Gate:** the request's Program gate — five areas, total >= 85, no P0/P1. The
  repository has no separate Program scoring rubric, so this file reuses R1's
  five areas and weights explicitly.
- **Subject:** `docs/e2e/0.8/program/` — 19 files including this score, with
  seven test files and ten test cases; `data/` is an empty directory.
- **Independence:** I did not author the pack and had no author transcript. I
  read R1 (`PROGRAM-SCORE.md`) only to enumerate the prior P1/P2s; no score or
  finding was reused without re-testing. Mutants and probes ran on copies under
  `/tmp`; the repository was not modified. **Only this file was written.**
- **Scope:** this scores the reduced local two-module Program E2E, not the full
  Program gate approvals (architecture approval, UI freeze, module-plan
  approval, integrated-preview acceptance) and not production readiness.

## Verdict

**PASS (narrow) — 86/100 — 0 P0 / 0 P1 / 5 P2 / 6 P3.**

P1-1 is **closed**: with non-empty gates and no release, the consumer test now
asserts `release.published required`, and deleting the release check makes that
test fail (verified by mutation). The process-isolation claim and the core of
the consumer-validation finding are also materially fixed. Five prior P2 areas
remain open or partial: schema conformance is still not executed, mutation
coverage still has ten survivors, the `12/12` vs `10/10` vs stale `6/6`
provenance is unresolved, the new run log predates the final artifacts, and the
pack is still untracked and absent from the repo's evidence index. These are
moderate evidence defects; none is a P0/P1, so the gate is met narrowly rather
than cleanly.

## Score

| Area | Weight | R1 | R2 | Assessment (R2) |
|---|---:|---:|---:|---|
| Architecture and contract | 25 | 21 | **22** | Clean split and purity; provider nested exactness fixed; schema is now read by a test. But schema conformance is still not executed, and the provider still accepts some schema-invalid values. |
| Provider/consumer contract tests | 25 | 18 | **20** | P1-1 closed; 10/10 green; consumer negative tests added. But 10/23 contract mutants survive and the schema test checks only part of the contract surface. |
| Runtime isolation | 20 | 17 | **18** | Same-process isolation plus a real child-process test with separate data dirs; docs now distinguish them. No concurrency, container or resource-collision evidence (disclosed). |
| Risk and gap honesty | 15 | 13 | **13** | Five scope gaps remain real and mostly honest; process isolation is now proven. But `GAP-LOG.md` still says 6/6, the fixture's 12/12 is unexplained, and the new schema divergence is not logged. |
| Reviewability | 15 | 13 | **13** | Hashes verify and a run log now exists. But the log's time predates the final edits, hashes cover only three artifacts, no script/CI enforces the freeze, and the pack is untracked/not indexed. |
| **Total** | **100** | **82** | **86** | **PASS narrowly — above 85 and no P0/P1; five P2s remain.** |

Anchors: 0 = missing/unusable; 50 = present with a material gap; 100 = specific,
measured, task-fit. The total is a gate, not a diagnostic.

## What I actually ran

```sh
cd docs/e2e/0.8/program && node --test
# 10 tests, 10 pass, 0 fail, 0 skipped; exit 0; ~63–65 ms; repeated 3× identical

sha256sum -c CONTRACT-HASHES.txt
# contracts/readiness.schema.json: OK
# provider/evidence-service.mjs: OK
# consumer/dashboard-api.mjs: OK

python3 -c 'jsonschema.validate(fixture, schema)'
# fixture validates against the declared draft 2020-12 schema (reviewer-side only)

node --test test/plugin.test.mjs test/gates.test.mjs   # repo root
# 12 tests, 12 pass — confirms the fixture's 12/12 has a real provenance (root suite)

node test/check.mjs
# packaging checks passed — but the Program pack is not in the required list
```

Independent probes (read-only; `/tmp` copies where mutation was needed):

- Removed the consumer release check → `test/consumer.test.mjs` test 2 fails; the
  other 9 pass. This is the P1 closure proof.
- 23-mutant audit: **13 caught / 10 survived (57%)**; details below.
- Provider accepts `tests: { passed: -1, total: 1 }` and
  `candidate: ["0.8.0"]` / `activeProfile: ["0.7.0"]` (schema rejects all three).
- Schema drift probes: changing the candidate pattern, raising `tests.total`
  minimum to 5, or allowing nested gate extras each leaves **10/10 green**.
- Consumer rejects unknown status, missing candidate and non-boolean
  `release.published`; it accepts root extras and negative test counts.
- `release.published: true` with a blocked gate yields
  `decision: "published"` and `blocked: ["research"]`.
- No `Promise.all`, malformed-JSON, missing-file, or `published: true` test
  exists in the pack; no JSON-Schema validator is imported anywhere.
- The pack is untracked (`git status`: `?? docs/e2e/0.8/program/`), and
  `docs/VERIFICATION.md:147` still says there is no full 0.8 Program E2E pack.

## P1 closure — verified, not taken on trust

- **P1-1 (R1) · The "consumer rejects missing release" test was blind.**
  Current code: `test/consumer.test.mjs:23-26` destructures `release` out of a
  valid object whose `gates` array is non-empty, then asserts
  `/release\.published required/`.
  The implementation branch is `consumer/dashboard-api.mjs:13`.
  Mutation: delete that branch; `node --test` becomes 9 pass / **1 fail**, and
  the failing test is exactly `consumer rejects missing release after passing
  gates` (test 2). The input actually contains a gate, so the throw cannot be
  the earlier `gates required`. **Closed.**

## Prior P2 audit

| R1 finding | Status in R2 | Evidence |
|---|---|---|
| P2-1 schema not executable; provider nested divergence | **Partial** | Provider nested `exactKeys` now rejects gate/tests/release extras (mutants caught), and `test/schema.test.mjs` reads the schema. But it is not a validator: it asserts selected required/enum/root-`additionalProperties` facts only. Provider still accepts schema-invalid negative counts and array versions; schema drift in pattern/minimum/nested `additionalProperties` survives. |
| P2-2 thin contract/mutation coverage (4/8 survived) | **Partial** | New table-driven mutations cover the listed cases; 13/23 mutants caught. But 10 survive, including five real validation branches; no malformed-JSON/missing-file/`published:true` tests. |
| P2-3 "two instances" was two calls in one process | **Closed (core)** | `test/process-isolation.test.mjs` spawns two child processes with separate data files and asserts different candidates; docs now separate the same-process and child-process claims. Residual P3: sequential `spawnSync`, no concurrency; the same-process test title still says "instances". |
| P2-4 12/12 vs 6/6 with no scope | **Open** | Fixture still says 12/12 (`provider/data/readiness.json:9`), the consumer test hardcodes `'12/12'` (`test/consumer.test.mjs:18`), the pack runs 10/10 (`PROGRAM.md:30`), and `GAP-LOG.md:12` still says "evidence of 6/6 tests". No scope statement. |
| P2-5 consumer accepted unknown status/missing candidate; decision ignored gates | **Core closed, residual P3** | Both malformed cases now throw (tests 3; mutants caught). `decision` is still derived only from `release.published`; `published: true` + blocked gates renders `decision: "published"` with a non-empty `blocked` list, undocumented and untested. |
| P2-6 no run log/freeze enforcement | **Partial** | `RUNLOG.md` now records command, Node, 10/10, exit 0 and 3/3 hashes. But its timestamp (14:12–14:14) predates the final edits (14:17:28–14:17:42); hashes still cover only three artifacts; no script/CI recomputes them. |
| P2-7 no repo evidence integration | **Open** | Pack is untracked; `test/check.mjs:61-81` does not require it; `docs/VERIFICATION.md:147` still says no full pack; `node test/check.mjs` passes without it. |

## Mutation audit (23 mutants, fresh `/tmp` copy each)

Baseline copy: 10/10 green. **13 caught, 10 survived (57%).**

| Mutation | Result | Why |
|---|---|---|
| Remove consumer release check | **CAUGHT** | Test 2 fails with the exact-error assertion. |
| Remove provider root key exactness | CAUGHT | `root extra` mutation test fails. |
| Remove provider version regex | CAUGHT | `bad version` fails. |
| Remove provider gate score range | CAUGHT | `gate score` 101 fails. |
| Remove provider `passed>total` check | CAUGHT | `tests passed>total` fails. |
| Remove provider `release.published` type | CAUGHT | `release published type` fails. |
| Remove provider gate exact keys | CAUGHT | `gate extra` fails. |
| Remove provider tests exact keys | CAUGHT | `tests extra` fails. |
| Remove provider release exact keys | CAUGHT | `release extra` fails. |
| Consumer accepts unknown status | CAUGHT | Test 3 fails. |
| Remove consumer candidate check | CAUGHT | Test 3 fails. |
| Add provider single-slot global cache | CAUGHT | Isolation test titles become equal. |
| Schema drops root `required: gates` | CAUGHT | `schema.test.mjs` required-list assertion fails. |
| **Provider allows empty gates** | **SURVIVED** | No empty-gates test; 10/10 green. |
| **Remove provider gate id check** | **SURVIVED** | No non-string/empty id test; 10/10 green. |
| **Weaken provider tests to `passed>total` only** | **SURVIVED** | No non-integer tests count; 10/10 green. |
| **Remove provider `release.tag` type** | **SURVIVED** | No wrong-type tag test; 10/10 green. |
| **Remove provider `release.notes` type** | **SURVIVED** | No wrong-type notes test; 10/10 green. |
| **Consumer keeps release presence, drops boolean type** | **SURVIVED** | Only missing-release is tested; 10/10 green. |
| **Consumer weakens tests integer checks** | **SURVIVED** | No non-integer consumer input; 10/10 green. |
| **Schema candidate pattern changed** | **SURVIVED** | Structural test does not read `pattern`; 10/10 green. |
| **Schema `tests.total` minimum raised to 5** | **SURVIVED** | Structural test does not read `minimum`; 10/10 green. |
| **Schema allows nested gate extras** | **SURVIVED** | Structural test does not read nested `additionalProperties`; 10/10 green. |

The claimed mutation list (root/nested extra, version, status, score,
`passed>total`, release type) is genuinely covered. The R1 pass condition —
*every validation branch has a test that fails when the branch is removed* — is
still not met.

## Schema conformance

- The fixture independently validates against `contracts/readiness.schema.json`
  with a real draft 2020-12 validator; the fixture itself is fine.
- `test/schema.test.mjs:6-21` reads the schema and asserts the root required
  set, root `additionalProperties`, gate status enum, gate/release/tests
  required sets, then checks one valid object through the runtime validator. It
  never validates the fixture or a provider output against the schema, and it
  does not compare `pattern`, `minimum`/`maximum`, type arrays, `minItems`, or
  nested `additionalProperties`.
- Three schema-drift probes (candidate pattern, tests minimum, nested gate
  extras) all leave 10/10 green, so the "schema and runtime validator agree"
  test does not anchor those parts of the declared contract.
- The runtime still diverges in the opposite direction for edge inputs:
  `provider/evidence-service.mjs:27` accepts negative `passed` (schema
  `minimum: 0`), and line 18's regex coerces an array candidate/activeProfile
  to a matching string (schema requires `type: "string"`).
- Net: the R1 nested-extra divergence is fixed; the R1 "schema is never
  executed" finding is improved but not closed.

## Runtime isolation

Verified:

- Provider remains a pure function of an explicit path; no module-global cache.
  A single-slot global-cache mutant is caught by `test/isolation.test.mjs`.
- The consumer still does not mutate the provider input (snapshot assertion).
- `test/process-isolation.test.mjs:13-23` spawns two child Node processes with
  separate temp data files and asserts `0.8.0` / `0.9.0` from stdout. This is
  real process-level separation for this pure-function fixture, and the docs
  now distinguish it from the same-process test.
- Temp directories are removed in `finally`; no repo writes, no shared env
  variable beyond the child's own `READY_PATH`, no deps/network.

Not proven: concurrency (the two children are sequential `spawnSync`), env-leak
behavior, port/DB/fixture collision, container/OS isolation. RUNTIME-ISOLATION
discloses the container/network part; it does not explicitly scope out
concurrency. The same-process test title still calls two invocations "two
provider instances" (`test/isolation.test.mjs:16`).

## Risk, gaps, and reviewability

The five R1 gaps are still real and mostly honest: no live HTTP server, no UI
wiring, no container/OS isolation (child-process isolation now proven), no
post-deploy/observability, static readiness JSON. The fixture is honest on
release state: `published: false`, `tag: null`, active profile `0.7.0`, notes
"local candidate; no commit/push/tag/install". No fake live/green/publish claim.

Weaknesses / evidence provenance:

- `GAP-LOG.md:12` still says the score must not exceed "the evidence of 6/6
  tests"; the pack now runs 10/10 and the fixture says 12/12. The three numbers
  coexist without a scope statement.
- `RUNLOG.md:3` records 14:12–14:14, but the provider, consumer and test files
  were last written at 14:17:28–14:17:37 and the docs/hashes at 14:17:42. The
  log's result happens to reproduce now, but the log does not evidence the
  final artifacts.
- The hash freeze covers only schema/provider/consumer; tests and the fixture
  can change after the score without hash drift. No script or CI recomputes
  `CONTRACT-HASHES.txt`.
- The pack is untracked (`?? docs/e2e/0.8/program/`); `test/check.mjs` passes
  without it; `docs/VERIFICATION.md:147` still says there is no full 0.8
  Program E2E pack. The pack is untracked, so neither the R1 score nor this R2
  score is in the evidence index.

## Findings

### P0 — Blocking

None.

### P1 — Major

None. **P1-1 (R1) is closed** (see above).

### P2 — Moderate

- **P2-R1 · Schema conformance is still not executable; provider edges diverge.**
  Location: `contracts/readiness.schema.json:8,13,25`;
  `provider/evidence-service.mjs:18,27`; `test/schema.test.mjs:6-21`.
  Evidence: fixture validates independently, but no code/test validates an
  output against the schema; schema drift in candidate `pattern`,
  `tests.total.minimum` or nested gate `additionalProperties` leaves 10/10
  green; provider accepts `tests.passed = -1` and array
  candidate/activeProfile, both rejected by the schema.
  Impact: a provider change can emit schema-invalid readiness while the suite
  is green; the consumer can render `-1/1`.
  Fix: a dependency-free schema walk/validator (or per-constraint assertions for
  pattern, bounds, types, `minItems`, every nested `additionalProperties`), plus
  negative-count/type cases.
  Pass condition: each schema-drift mutation above fails at least one test, and
  the provider rejects negative counts and non-string versions.

- **P2-R2 · Contract negative space/mutation coverage is incomplete.**
  Location: `test/mutations.test.mjs:11-23`; `test/*.mjs`.
  Evidence: 10/23 mutants survive, including empty gates, gate id, release
  tag/notes types, non-integer tests counts, consumer release type and consumer
  tests integer checks; the three schema-drift survivors are under P2-R1. There
  is no malformed JSON, missing file or `published: true` test.
  Impact: removing a declared validation branch can leave the Program E2E green.
  Fix: one table-driven case per branch, including empty gates, wrong-type
  id/tag/notes, non-integer/negative counts, malformed/missing JSON, and
  `published: true` with blocked gates.
  Pass condition: every validation branch has a mutant that fails at least one
  test.

- **P2-R3 · Test-count provenance is unresolved and contradictory.**
  Location: `provider/data/readiness.json:9`; `test/consumer.test.mjs:18`;
  `PROGRAM.md:30`; `RUNLOG.md:6`; `GAP-LOG.md:12`.
  Evidence: pack 10/10, fixture 12/12 (true for the root suite, verified 12/12
  via `node --test test/plugin.test.mjs test/gates.test.mjs`), `GAP-LOG` stale
  6/6; no statement that the fixture field is candidate-wide; the consumer test
  hardcodes the root-suite count.
  Impact: reviewers can misattribute repo tests to the Program pack; adding a
  root test breaks the Program E2E.
  Fix: state the scope in `PROGRAM.md`/fixture; assert the `passed/total` format
  rather than the literal; update the `GAP-LOG` sentence.
  Pass condition: one documented count, no stale 6/6, no hardcoded root count.

- **P2-R4 · The run log predates the final artifacts; the freeze is prose only.**
  Location: `RUNLOG.md:3`; `CONTRACT-HASHES.txt`; file mtimes.
  Evidence: log says 14:12–14:14; final provider/consumer/tests are 14:17:28–
  14:17:37, docs/hashes 14:17:42; hashes cover only three artifacts; no
  verify script/CI; tests/fixture can change after a "freeze".
  Impact: the only run log does not establish that the scored artifacts were the
  ones tested; contract tests can drift silently.
  Fix: rerun after the final edit and record that time; hash the tests and
  fixture too; add a single verify command (or CI step) that runs tests and
  `sha256sum -c` and fails on drift.
  Pass condition: log timestamp is after the final edit; one command reproduces
  tests + all artifact hashes and fails on drift.

- **P2-R5 · The pack is still not integrated into the repo's evidence index.**
  Location: repo root; `test/check.mjs:61-81`; `docs/VERIFICATION.md:147`;
  `git status`.
  Evidence: `?? docs/e2e/0.8/program/`; `check.mjs` does not require the pack;
  `node test/check.mjs` passes without it; `VERIFICATION.md:147` says there is
  no full 0.8 Program E2E pack; neither score is in an index.
  Impact: the pack can be missed, emptied or deleted without failing the repo
  check; the repository's own verification record contradicts its existence.
  Fix: add the pack files and this score to `test/check.mjs`; update
  `docs/VERIFICATION.md`; commit the pack.
  Pass condition: `npm run check` fails if the pack is missing/empty, and the
  verification index points to it.

### P3 — Minor

- **P3-1 · Empty `data/` directory.** `docs/e2e/0.8/program/data/` has no file
  and no documented purpose; remove it or move the fixture there.
- **P3-2 · API naming/duplicate validation.** `getReadiness(dataDir = …)` takes
  a file path, not a directory (`provider/evidence-service.mjs:33`); both
  modules export an `assertReadiness` with different strength. Rename to
  `dataPath` and share/rename one assertion.
- **P3-3 · Label mapping is only partially asserted.** `test/consumer.test.mjs`
  asserts the blocked IDs, but not that `pass → ready` and
  `missing → not run`. Add one assertion per label branch.
- **P3-4 · `decision` ignores gates.** `consumer/dashboard-api.mjs:28` returns
  `published` whenever `release.published` is true, even with blocked gates;
  the relationship is undocumented and untested.
- **P3-5 · Process-isolation test is sequential and narrow.** `spawnSync` runs
  the two children one after the other; there is no concurrency, env-leak or
  resource-collision test. The same-process test title still says "two provider
  instances" for two calls in one process.
- **P3-6 · "Provider returns schema-valid readiness" overclaims.** The test at
  `test/provider.test.mjs:5-10` checks only candidate, `published` and
  `passed === total`; the independent schema validation is not in the pack.

## Not proven (explicit)

1. **Full schema conformance** — the schema is read but not executed as a
   validator; provider edge divergence remains (P2-R1).
2. **Every validation branch** — 10/23 mutants survive (P2-R2).
3. **Process/container isolation** — child-process separation is proven for
   this pure fixture; concurrency, env leaks, port/DB/fixture collisions and
   container/OS isolation are not.
4. **Run log/freeze integrity** — the log predates the final artifacts; hashes
   cover only three files; no enforcement (P2-R4).
5. **Repo integration** — untracked and not in the evidence index (P2-R5).
6. **Full Program gate approvals** — no architecture approval, UI freeze,
   module-plan approval or integrated-preview acceptance in this pack.
7. **Live server/HTTP, UI wiring, post-deploy/observability, live refresh** —
   disclosed out of scope.
8. **Release/publish** — no tag/push/install; `published: false` and active
   profile `0.7.0` are correct. No production proof.
9. **Network non-use via sandbox** — source inspection and absence of deps only.
10. **Reviewer independence** — prompt/context separation, not sandbox-enforced.
11. **Decision semantics and all label mappings** — `published: true` with
    blocked gates is ambiguous and untested (P3-3/P3-4).

## Gate checklist

- [x] **Total >= 85** — **86**.
- [x] **No P0** — 0.
- [x] **No P1** — 0; **P1-1 closed** by the mutation test.
- [x] **Tests run** — `node --test`: 10/10 pass, 0 fail, exit 0; repeated 3×.
- [x] **Contract hashes match** — 3/3 via `sha256sum -c`.
- [x] **P1 test genuinely exercises release** — non-empty gates + no release;
      deleting the check fails test 2.
- [x] **No mutation of provider input** — consumer snapshot + code inspection.
- [x] **Process isolation evidence present** — two child processes, separate
      data dirs (sequential; scope disclosed).
- [x] **Fixture schema-valid** — independently validated with `jsonschema`.
- [x] **No network/dependencies** — Node built-ins only; source-inspected.
- [x] **Scope stated** — local reduced E2E, not a product release.
- [ ] **Schema executable/conformance** — P2-R1.
- [ ] **Every validation branch covered** — P2-R2.
- [ ] **Single documented test count** — P2-R3.
- [ ] **Run log covers final artifacts; freeze enforced** — P2-R4.
- [ ] **Pack integrated/indexed** — P2-R5.

## Re-score conditions

This is a **narrow PASS**, not a permanent clean bill. A local reduced E2E can
stay above 85 with disclosed out-of-scope items, but the following would move
it to a comfortable pass and must be fixed before a production Program gate:

1. Make the schema conformance executable and add the schema-drift/negative
   cases (P2-R1).
2. Cover every validation branch and the missing malformed/missing-file and
   `published: true` paths (P2-R2).
3. State the 10/10 vs 12/12 scope and remove the stale 6/6 line (P2-R3).
4. Re-run after the final edit and record the current time; hash tests/fixture;
   add a verify command/CI (P2-R4).
5. Add the pack to `test/check.mjs` and `docs/VERIFICATION.md`; commit it
   (P2-R5).
6. Clean up P3-1..P3-6 opportunistically.

Do not claim a clean Program pass while P2-R1/P2-R4/P2-R5 are open.

## Inputs and hashes

| Input | SHA-256 |
|---|---|
| `PROGRAM.md` | `669a623a51d6118c5809b46f8931f49aaa2a96e37f653ba2dbba489ea2fa961d` |
| `CONTRACT-HASHES.txt` | `200f6a170ded0da4b45b1bcc15ff86c9cc9033b23a9fdf4d2b0a1806e700687d` |
| `RUNTIME-ISOLATION.md` | `670430801f0110ea5a800758681c4815747486a604b4b64b7742a355bf9c5729` |
| `GAP-LOG.md` | `3220483d9a81e7757c2cde2c10cf6cdfde29f77071f3d7ca6cd9828c313a7c1a` |
| `RUNLOG.md` | `c8d4fb59f98b84b4c9a0c46a4e0432b2efc3ec26959754d645f737cb65afede3` |
| `contracts/readiness.schema.json` | `62a8b63bc4b5b718c297ef94edb764a220b614dd25f1e917397ddf96bb42c6c4` |
| `provider/evidence-service.mjs` | `33ec358a7553de7420480bc6dfa2d5631e6fb9a12fce01422c34c9058c1c7667` |
| `provider/data/readiness.json` | `4825c38161c48e9da41ab1ac0a1f0123b10962112e8edd6886f92453b080ea4d` |
| `consumer/dashboard-api.mjs` | `c4a6ec6c7a10f68e9c4d6cfcc9fd6e0264545e289161ca8940e7eebe975c81b2` |
| `test/provider.test.mjs` | `aab6fcdc7688d7cca635de6c708a22c7a8efc51fa5fdd6529d8ec5d9c6f390ec` |
| `test/consumer.test.mjs` | `8758d4528df22bb39c1ed0de6b66cb96b482e299c4faef5b8d794e9c91ff6bf2` |
| `test/integration.test.mjs` | `a6b58e425df4407faebd62698980068dafb29aa9100678d1536c9fb89c40cde4` |
| `test/isolation.test.mjs` | `3f3e1260acdbfaf999cd5e05525f801d6c8391ca9aa5e04c3654b4edf423d20e` |
| `test/mutations.test.mjs` | `e2be4d01a29e367b64c3f2b372bc3586ed7f75b4a85d965fa05e07acabaae8c7` |
| `test/schema.test.mjs` | `79f4c32c9da12e89f890b1bd747e236b94849b08fbdac60bc4a5902bc832e3ef` |
| `test/process-isolation.test.mjs` | `a061e108dd60aca01c9e0b9954905409bcfff56a4f7b78d372db250ccaf71af3` |
| `package.json` | `c6ac75bc17398e42d5ef20b5c4487a60a509038a800f0f23682311a274e92e5e` |

The pack was untracked at review time (repo commit `14d31df` plus uncommitted
work), so these hashes are the only stable identity for this review. Mutant and
probe copies were under `/tmp`; only this score file was added.

**Final: 86/100 — PASS (narrow) — 0 P0 / 0 P1 / 5 P2 / 6 P3.**

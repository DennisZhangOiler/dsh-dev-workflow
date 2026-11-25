# Program E2E — readiness service + dashboard consumer

**Scope:** a two-module local program, no network, no dependencies, no
production deployment. This is a Program-mode E2E for the 0.8 workflow, not a
product release.

## Architecture / IA

```
provider/evidence-service.mjs  ── readiness JSON (schema) ──▶  consumer/dashboard-api.mjs
        │                                                           │
        └─ provider/data/readiness.json (explicit data dir)         └─ dashboard view model
```

- Provider: reads a readiness JSON, validates it, returns it. Pure; no shared
  global; caller supplies the data path.
- Consumer: validates minimally, maps gates to labels, derives `decision` and
  `blocked`; never mutates provider input.
- Contract: `contracts/readiness.schema.json`; required candidate/activeProfile/
  gates/tests/release; gate status enum; release.published boolean.

## Module contract and freeze

- Contract hash: see `CONTRACT-HASHES.txt` (schema + provider + consumer).
- Provider contract tests: schema-valid output, malformed gate rejection.
- Consumer contract tests: mapping, no mutation, missing release rejection.
- Integration: provider→consumer stable across two reads.
- Runtime isolation: two provider instances with separate temp data dirs return
  different candidates; two child processes also return different candidates.
  Test run: 10/10 pass.
- Freeze rule: provider/consumer contract hashes must not change after the
  independent demo score; any change triggers regressions.

## Risk

- Low: local static module, no credentials, no network, no writes outside temp.
- Missing: no live server, no UI wiring, no post-deploy; recorded in GAP-LOG.
- Human decision: not applicable to this local E2E; high-risk migration has its
  own human gate.

# Program architecture

```
provider/evidence-service.mjs  →  readiness JSON (schema v2 contract)
        │
        ▼
consumer/dashboard-api.mjs     →  dashboard view model
        │
        ▼
integration/preview.mjs        →  integrated-preview.json / .html
        │
        ▼
UI readiness dashboard (A · Ledger)  (separate UI E2E, 91/100)
```

- Provider owns readiness data shape/validation; consumer owns presentation
  mapping; UI owns layout/accessibility; no module writes another's data.
- Contract: `contracts/readiness.schema.json`; provider/consumer hash pin in
  `CONTRACT-HASHES.txt`.
- Runtime: provider accepts explicit data path; integration uses two temp copies;
  no network, no shared global.
- Failure boundary: malformed readiness is rejected before mapping; UI is not
  allowed to silently turn `blocked`/`partial` into green.
- Out of scope: live HTTP server, production deploy, post-deploy monitoring.

## Approval

- User authorized **full Program gate walk-through** on 2026-11-25 (selected
  option “补完整 Program gate”).
- Architecture content approval: **approved** (user, 2026-11-25 16:03).
- Module plan approval: **approved** (same gate).
- Integrated preview acceptance: **approved** (same gate).

# Module plan

| Module | Files | Write scope | Contract |
|---|---|---|---|
| Provider | `provider/evidence-service.mjs`, `provider/data/` | validation/read-only data | readiness schema v2 |
| Consumer | `consumer/dashboard-api.mjs` | mapping only; no writes | readiness schema v2 |
| Integration | `integration/preview.mjs` | generated preview only | provider→consumer |
| UI | `docs/e2e/0.8/ui/direction-a.html` | UI files only | dashboard view model |

- Module order: provider contract → consumer contract → integration → UI preview.
- Tests: provider 2, consumer 3, mutations 1, schema 1, isolation 2, process 1,
  integration 1; total 10. Integrated preview: `integration/preview.mjs` →
  `integration/integrated-preview.{json,html}` + screenshot.
- Freeze: provider/consumer contract hashes + readyiness schema; any change
  requires contract re-review.
- Rollback: integration is read-only/generated; delete preview artifacts; no
  production state.
- Out of scope: live server, auth, persistence.

## Approval

- Module plan: **approved** (user, 2026-11-25 16:03).
- UI freeze: see `docs/e2e/0.8/ui/UI-FREEZE.md`; current UI R3 91 PASS.

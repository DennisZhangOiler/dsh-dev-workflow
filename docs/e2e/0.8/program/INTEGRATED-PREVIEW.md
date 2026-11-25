# Integrated preview

- Input: provider `readiness.json` → consumer `toDashboard()` → `integrated-preview.json`.
- Render: `integration/integrated-preview.html`, screenshot
  `integration/integrated-preview.png` (1200×900).
- Result: `readiness 0.8.0`, active `0.7.0`, `not published`, research blocked 84,
  UI ready 91, program partial; tests 12/12.
- This proves provider→consumer→view-model integration, not a live server or
  production deployment. It does not turn `blocked`/`partial` into green.
- User acceptance of this integrated preview: **approved** (2026-11-25 16:03).

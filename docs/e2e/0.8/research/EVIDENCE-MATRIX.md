# Reduced E2E evidence matrix

| Claim group | Artifact | Status | Limit |
|---|---|---|---|
| Harness validity / production unchanged | `data/env.json`, `data/raw.json` | supported | one host; pre/post SHA-256 |
| Input hashes / parity / mutant control | `data/raw.json` | supported | 14-case table; D0/D2 only |
| 24 timing runs / cell medians | `data/raw.json` | supported | 3 reps, no CI/bootstrap |
| D0 > D2 on four measured cells | `data/raw.json` | supported (descriptive) | synthetic integers; no M2 gate |
| Adoption/migration | `memo.md`, `HANDOFF.md` | not claimed | candidate/pilot only |
| Full-plan cells (D1/D3/D4, memory, scaling) | `PLAN.md`, `REDUCED-RUN.md` | unmeasured | not extrapolated |

This matrix is a navigation aid; the authoritative claim table is `CLAIMS.md`
and the review verdicts are `RESULTS-REVIEW.md` / `MEMO-REVIEW.md`.

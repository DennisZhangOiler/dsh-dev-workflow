# Program scoring rubric (reusable)

Use this rubric for a Program-mode demo before freeze; a valid score is a gate,
not a quality award.

| Area | Weight | Floor | What passes |
|---|---:|---:|---|
| Architecture / module boundaries | 20 | 16 | provider/consumer/UI boundaries, ownership, data contract, no hidden coupling |
| Contract tests | 20 | 16 | provider and consumer contract tests, malformed/negative cases, schema/runtime agreement |
| Runtime isolation / integration | 20 | 16 | separate data dirs/processes, integration path, no shared mutable state |
| Risk / gap honesty | 20 | 16 | risk tier, gap log, explicit unproven items, no fake live/post-deploy claims |
| Reproducibility / evidence | 20 | 16 | commands, hashes, run log, freeze, exact artifact paths |

Gate: each area >= floor, total >=85, no P0/P1, <=3 unresolved P2. A score below
85 or any P0/P1 blocks freeze. This rubric is versioned with the Program skill;
changing weights requires a new review.

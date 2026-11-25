# Failure / load cases

| Case | Expected | Evidence |
|---|---|---|
| invalid JSON | no write; error | test `dry-run`/CLI failure path |
| version 2 input | reject `expected config version 1` | `migrate.test.mjs` |
| unknown skill | reject before write | `migrate.test.mjs` |
| missing backup on rollback | error | CLI guard |
| backup mismatch | not silently applied | rehearsal hash compares |
| large config | not benchmarked | no load claim; local config only |

Load: this is a small local JSON config; no throughput claim is made. The E2E
does not simulate concurrent migrations; a production migration must be
exclusive/offline.

# Rehearsal result

Run in a temp copy only; no production/user config.

1. `node migrate.mjs --dry-run rehearsal/config.json` → v2 JSON, source unchanged.
2. `node migrate.mjs --apply ...` → v2 written, backup path + SHA-256 emitted.
3. `node migrate.mjs --rollback ... <backup>` → original restored.
4. Byte-identical check: before = restored =
   `fef82d830f68b6c0b06870d2aa3c040e9211ac8fadf0259d85fb249784c33052`.
5. `node --test` → **7 tests, 7 pass, 0 fail**.

Artifacts: `rehearsal/dry-run.json`, `rehearsal/apply.json`,
`rehearsal/rollback.json`, `rehearsal/RESULT.json`.

Limitations: temp copy, same host, no concurrent/crash-injection test, no real
profile install. Writes use temp-file + fsync + rename.

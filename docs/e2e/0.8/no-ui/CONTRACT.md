# Acceptance contract — isPalindrome fixture

| Field | Value |
|---|---|
| Task | new feature, disposable test fixture |
| Risk tier | low |
| Scope | `src/isPalindrome.js`, `test/isPalindrome.test.mjs` only |
| Owner | lead (fixture); user authorized local testing |
| Contract SHA-256 | recorded in `CONTRACT-HASHES.txt` after freeze |

## Acceptance criteria

- AC1: “A man, a plan, a canal: Panama” → true.
- AC2: empty string → true.
- AC3: “hello” → false.
- AC4: “No 'x' in Nixon” → true.
- AC5: non-string input (null/1/[]/{}) → false, no throw.
- AC6: non-string object input is not mutated (strings are immutable).
- AC7: Unicode letters are not silently dropped: “aä” false, “你好” false,
  “上海自来水来自海上” true.

## DoD / NFR

- Zero dependencies, Node 22 ESM.
- No network, no credentials, no production writes.
- Pin/DoD: `node --test` passes all fixture tests (runner gate, not an AC).
- Lint/typecheck/build/CI: not configured for the disposable fixture; explicitly
  skipped, not claimed pass.
- Mock policy: none.

## Evidence

- `src/isPalindrome.js`, `test/isPalindrome.test.mjs`
- `VERIFIER.md` (independent commands/records)
- `CONTRACT-HASHES.txt` (contract + implementation + tests)
- `ACCEPTANCE.md` (fixture acceptance, not release)
- `RUNLOG.md`, `TEST-AUTHOR.md`

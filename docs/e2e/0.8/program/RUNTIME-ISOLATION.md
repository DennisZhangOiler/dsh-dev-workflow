# Runtime isolation evidence

- Provider is a pure function of an explicit JSON path; no module-global cache.
- Consumer is pure; `toDashboard` does not mutate input (asserted by JSON snapshot).
- `test/isolation.test.mjs` creates two temp data dirs, writes different candidate
  versions, reads both, and asserts the dashboard titles differ.
- Test run: `node --test` → 10 tests, 0 fail.
- No shared environment variable, no shared writable data dir, no singleton.
- `test/process-isolation.test.mjs` spawns two child Node processes with separate
  data files and asserts different candidates. This proves process-level
  separation for the fixture; container/network isolation remains out of scope.

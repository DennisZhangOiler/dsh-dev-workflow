# Quality gate / waiver

The plugin has no build step, bundler, linter, or typechecker. Its static quality
gate is:

```sh
npm test          # plugin/gate tests + semantic E2E gate (No-UI, Program, high-risk)
npm run check     # packaging/manifest/YAML checks
npm run test:smoke
node --check index.js
```

- CI: none configured in this repository. This is an explicit **waiver**, not a
  claimed CI pass; release should run the commands manually on the exact commit.
- The disposable E2E fixtures have no lint/typecheck/build/CI; skipped-with-reason
  is recorded in their README/VERIFICATION.
- No dependency audit is needed (zero runtime dependencies).

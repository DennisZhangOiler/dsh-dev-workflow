# SAST / secrets

- No `eval`, `Function`, dynamic import from user input, or shell execution in
  `migrate.mjs`.
- `child_process` is only used in the Program isolation test, not migration.
- Fixtures contain no API keys, tokens, cookies, or email addresses.
- Validation rejects unknown skills and missing preset fields before write.
- Manual review: migration is single-file, explicit path, backup required.
- Limitation: no full SAST tool run; this is a targeted manual/static review.

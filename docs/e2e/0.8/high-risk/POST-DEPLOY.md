# Post-deploy plan (not executed)

If a real migration were approved:
1. Verify the backup hash and keep it outside the target directory.
2. Run migration with the target profile stopped; no concurrent writers.
3. Re-read config through the preset loader; verify preset id/display name and
   all 9 skills register.
4. Run a smoke session; verify a new session can read `docs/DEV_WORKFLOW.md`.
5. If any check fails: rollback from backup and re-run the old profile.
6. Record actual command output, timestamps, and human approver in this file.

**Status: not executed.** This is a plan, not evidence of a production rollout.

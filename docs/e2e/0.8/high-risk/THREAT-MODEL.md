# Threat model

| ID | Risk | Impact | Mitigation | Residual |
|---|---|---|---|---|
| T1 | Loss of original config | High | timestamped backup + hash before apply | low |
| T2 | Skill/doc reference dropped | High | allowlist mapping; v2 validation; contract tests | low |
| T3 | Partial write / crash | High | dry-run, backup, temp-file + fsync + rename, rollback | low-medium (no crash-injection test) |
| T4 | Secret leakage in config | High | SAST scan; no secrets in fixtures | low |
| T5 | Wrong target path | High | explicit path; human approval; dry-run | low |
| T6 | Rollback unavailable | High | restore from backup; test proves byte-identical | low |
| T7 | Dependency/license | Low | no dependencies; MIT repo | low |
| T8 | Schema drift | Medium | v2 validator + tests | medium |

No P0 threat identified for the **rehearsal**; a real migration still requires
human approval and a current backup.

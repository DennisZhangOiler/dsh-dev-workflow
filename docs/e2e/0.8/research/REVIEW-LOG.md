# Research E2E review log

| Gate | Reviewer | Model/provider | Time (UTC) | Input hash | Prompt hash | Verdict |
|---|---|---|---|---|---|---|
| Plan #1 | plan-reviewer-1 | deepseek-flash / deepseek-official | 2026-11-25T03:48:59Z | `e4d07274…10137a` | `d469ebe6…b023` | REVISE 86/100 (P1: provenance/fit; timed-cell full scan) |
| Plan #2 | plan-reviewer-2 | deepseek-flash / deepseek-official | 2026-11-25T03:55:58Z | `8f4f8581…e27414` | `fc420149…3c742` | PASS 90/100 (1 P2, 7 P3) |
| Results | results-reviewer-1 | deepseek-flash / deepseek-official | 2026-11-25T04:03:19Z | `e76b8196…f02a5e` | `62e7d661…8b179` | PASS 90/100 (reduced-run quality) |
| Memo delta | results-reviewer-2 | deepseek-flash / deepseek-official | 2026-11-25T04:15:51Z | `a24387e7…38381f` | `cd7a21e1…a4890` | PASS (memo claim mapping/hash) |
| Calibration (R4, authoritative) | calibration-reviewer-5 | deepseek-flash / deepseek-official | 2026-11-25T13:27+08:00 | F1-F7 hashes in CALIBRATION-PLAN-R4 | `a525c5bb…043e6` | F1 REVISE 5; F2 REVISE 10; F3 REVISE; F4 REVISE; F5 REJECTED; F6 PASS 87; F7 REVISE 57 (intended floor failed) |

All reviewers are context-independent and read-only. They are the same model
family; this is not a human or cross-provider audit. No reviewer was replaced
after a REJECT. Review prompts are archived under `prompts/`; the hashes verify those archived
instructions. They are post-run archive copies, not a byte-identical transport log. Review artifacts and hashes
are in this directory.

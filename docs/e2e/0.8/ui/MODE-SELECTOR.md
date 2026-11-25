# Composer mode selector E2E

- Preset: one **研发流程** preset (default Standard).
- Control: always-visible **流程强度** select in the composer left tool row.
- Before first turn: `composer-mode-before-first-turn.png`.
- After switching standard → deep: `composer-mode-deep-works.png`; the command
  result shows `流程强度：deep`, and the injected context is visible in chat.
- Switching sends `/mode <light|standard|deep>`; it changes session-level
  instructions, not the preset/tool set.
- Tested in a disposable web profile with the packaged bundle; no credentials
  beyond the normal local model route.

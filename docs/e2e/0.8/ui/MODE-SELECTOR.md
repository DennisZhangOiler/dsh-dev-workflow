# Composer mode selector E2E

- Preset: one **研发流程** preset, starting in Standard.
- Control: always-visible **流程强度** chip in the composer left tool row, styled
  with the host theme tokens (icon + current mode + chevron). It appears before
  the first turn and remains visible during the conversation.
- Screenshots: `final-mode-before.png`, `final-mode-deep.png`.
- Switching sends `/mode <light|standard|deep>`. The Host updates an
  agent-scoped prompt section; no extra chat bubble is injected. The command row
  only shows `mode · 已完成`.
- It is a session-level intensity instruction, not a preset/tool swap.

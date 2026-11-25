# Composer mode selector E2E

- Preset: one **研发流程** preset, starting in Standard.
- Control: always-visible **流程强度** chip in the composer left tool row, next
  to the permission selector and styled to match it: 28px height, 13px/500
  label, 14px glyph, chevron, transparent chip with host hover/focus tokens.
- Appears before the first turn and remains visible during the conversation.
- Switching sends `/mode <light|standard|deep>`. The Host updates an
  agent-scoped prompt section; no extra chat bubble is injected. The command
  row shows only `mode · 已完成`.
- Screenshots: `final-mode-matched.png` (standard, before first turn),
  `final-mode-matched-deep.png` (deep, after switching).
- Session-level instruction, not a preset/tool swap.

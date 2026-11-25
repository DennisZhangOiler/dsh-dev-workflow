# Composer mode selector E2E

- Preset: one **研发流程** preset, starting in Standard.
- Control: always-visible **流程强度** chip in the composer left tool row, next
  to the permission selector. Trigger: 28px, 13px/500, 14px glyph, chevron,
  transparent with host hover/focus tokens.
- Menu: frame-wide `shell.overlay` (not inside the composer), 184px, layer-1
  surface, 10px radius, 32px rows, leading glyph, selected check, host hover.
  It is therefore visible in existing conversations instead of being clipped by
  the composer.
- Works before the first turn and in an existing conversation. Switching sends
  `/mode <light|standard|deep>`; the Host updates an agent-scoped prompt section,
  so no chat bubble is injected. Only a light `mode · 已完成` command row appears.
- Screenshots: `final-mode-matched.png` (trigger), `final-mode-menu2.png`
  (hero menu), `repro-overlay-menu.png` (existing conversation menu),
  `final-mode-matched-deep.png` (deep trigger).
- Session-level instruction, not a preset/tool swap.

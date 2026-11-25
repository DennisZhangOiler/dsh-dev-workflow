# Composer mode selector E2E

- Preset: one **研发流程** preset, starting in Standard.
- Control: always-visible **流程强度** chip in the composer left tool row, next
  to the permission selector. Trigger: 28px, 13px/500, 14px glyph, chevron,
  transparent with host hover/focus tokens.
- Menu: frame-wide `shell.overlay` (not inside the composer), 184px
  border-box, layer-1 surface, 10px radius, 32px rows, leading glyph, selected
  check, host hover. It stays visible in existing conversations because it is
  outside the composer's clipping context.
- Keyboard: menu options receive focus; ArrowUp/ArrowDown/Home/End move,
  Escape closes and returns focus to the chip.
- The global `rd-mode-client` row is client-only (`config.clientOnly: true`);
  it never adds the R&D prompt, skills, or `/mode` command to other presets.
- Mode state is synced on mount: the chip sends its current mode once so the
  server prompt section and the visible chip agree after a reload or on a new
  client.
- Switching sends `/mode <light|standard|deep>`; the Host updates an
  agent-scoped prompt section, so no chat bubble is injected. Only a light
  `mode · 已完成` command row appears.
- Screenshots: `final-mode-matched.png`, `final-mode-menu2.png`,
  `repro-overlay-menu.png` (existing conversation), `final-mode-matched-deep.png`.
- Session-level instruction, not a preset/tool swap.

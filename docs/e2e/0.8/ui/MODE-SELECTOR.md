# Composer mode selector E2E

- Preset: one **研发流程** preset, starting in Standard.
- Client: a separate `dsh-rd-workflow-client` package, mounted as a global
  client-only row. It contains only the composer chip and the frame-wide menu;
  its Host half is a no-op. The main preset package has no global Host mount, so
  other presets get no R&D prompt, skills, or `/mode` command.
- Control: always-visible **流程强度** chip next to the permission selector;
  28px, 13px/500, 14px glyph, chevron, host hover/focus tokens.
- Menu: frame-wide `shell.overlay`, 184px border-box, layer-1 surface, 10px
  radius, 32px rows, icon + check, host hover. It stays visible in existing
  conversations because it is outside the composer's clipping context.
- Keyboard: options focus on open; ArrowUp/Down/Home/End move; Escape closes and
  returns focus to the chip.
- Mode state: chip value is synced to the Host on mount with `/mode <mode>`, so
  the chip and the next `Mode:` prompt agree after reload or on a new client.
- Switching sends `/mode <light|standard|deep>`; the Host updates an
  agent-scoped prompt section. No chat bubble is injected; only a light
  `mode · 已完成` command row appears.
- Verified with separate temp profiles: `标准模式` session log has
  `agentPreset:"standard"`, no `R&D Workflow`, no `rd-workflow`; `研发流程`
  session log has `R&D Workflow` and `Mode: standard`, and the chip/command work.
- Screenshots: `final-mode-matched.png`, `final-mode-menu2.png`,
  `repro-overlay-menu-final.png` (existing conversation), `split-rd-final.png`,
  `split-standard-final.png`.
- Session-level instruction, not a preset/tool swap.

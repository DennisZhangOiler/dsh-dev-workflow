# dsh-rd-workflow 0.8.0

## 中文摘要

- 一个 **研发流程** 预设，默认 **标准**；输入框左侧常驻 **流程强度** 选择器，开始对话前和已有对话中都可切换轻量/标准/深度。
- 选择器与权限选择器视觉一致；菜单在 `shell.overlay` 中，已有对话里不会被裁剪。
- 切换只更新 agent 级 prompt section，不换 preset/工具集，不插入聊天气泡；仅保留一条轻量命令记录。
- UI 和预设 Host 分离：独立的 `dsh-rd-workflow-client` 客户端包，不会污染标准模式或其他 presets。
- 独立功能/UI 评审 PASS（81/100，无 P0/P1）；`npm test`、`npm run check`、`npm run test:smoke` 通过。

Released 2026-11-25 · [compare v0.7.0…v0.8.0](https://github.com/DennisZhangOiler/dsh-rd-workflow/compare/v0.7.0...v0.8.0)

## Highlights

- **One 研发流程 preset instead of three presets.** It starts in **Standard**;
  choose the preset once, then change ceremony without starting a new session.
- **Always-visible composer 流程强度 selector.** 轻量 / 标准 / 深度 sits next to
  the permission selector, before the first turn and in existing conversations.
  It is styled to match the DSH permission control (28px trigger, 13px/500,
  theme tokens, borderless menu, 32px rows, icon + check).
- **Prompt-level mode switching.** Selecting a mode updates an agent-scoped
  prompt section and sends `/mode <light|standard|deep>`. It does not swap the
  preset or its tool set, and it does not inject a chat bubble; only a light
  `mode · 已完成` command row appears.
- **Frame-wide menu.** The menu lives in `shell.overlay`, so it is not clipped
  by the docked composer and works in existing conversations.
- **Keyboard access.** Options focus on open; ArrowUp/Down/Home/End move;
  Escape closes and returns focus to the chip.
- **Client/Host isolation.** The UI is a separate client-only package
  (`dsh-rd-workflow-client`); the preset package keeps the prompt, skills, and
  `/mode` command. Standard and other presets receive no R&D prompt or command.

## Fixes

- Existing chats: the mode menu is visible instead of being clipped by the
  composer.
- Standard preset: no accidental `R&D Workflow` prompt, `rd-workflow*` skills,
  or `mode` command from the global client row.
- Preset Host mount restored after the client-only split.
- Menu dimensions and keyboard behavior aligned with the host UI.

## Compatibility

- DSH `>=0.2.2-rc.5 <0.3.0`.
- Node.js 22 or newer.
- The Web profile provides the required Host services; headless/SDK/ACP profiles
  do not load the Web preset registry.

## Install

Use the release tarball:

```text
plugin_manager action=install_bundle target=https://github.com/DennisZhangOiler/dsh-rd-workflow/releases/download/v0.8.0/dsh-rd-workflow-0.8.0.tgz
```

Or the Git tag (pin a full commit for reproducibility):

```text
plugin_manager action=install_bundle target=git+https://github.com/DennisZhangOiler/dsh-rd-workflow.git#v0.8.0
```

Back up the profile first; a preset change can report `restart-required`.
Installing does not change the profile default preset.

## Known limitations

- Mode switching changes instructions only, not the preset/tool set. A session
  that needs a genuinely different tool composition still needs a new session.
- On mount the chip syncs its current value to the Host with `/mode`, which can
  add one light command row; a second client without stored state can select
  Standard and overwrite a mode chosen on another client.
- No npm publication for this release.
- Automated checks cover packaging, preset composition, and smoke install; the
  client UI is covered by the independent review and browser evidence, not a
  dedicated runtime client test suite yet.

## Verification

- `npm test`: 12 tests + E2E gate.
- `npm run check`: packaging checks passed.
- `npm run test:smoke`: disposable-profile install/remove PASS.
- Independent functionality/UI review: **PASS, 81/100**; no P0/P1.
- Browser evidence: before-first-turn, existing-conversation menu, deep switch,
  standard isolation, and RD preset screenshots in `docs/e2e/0.8/ui/`.

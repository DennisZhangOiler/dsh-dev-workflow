# MODE-REVIEW — R3 拆分 client 包后复审

- Reviewer: `mode-selector-reviewer`（独立复审；只读代码，只写本文件）
- 日期: 2026-11-25
- 对象: `dsh-rd-workflow` 0.8.0，`8a50d8b` "fix: isolate client UI in its own package and restore preset host"
- 环境: 提供的最终实例 `127.0.0.1:3101`（profile `modeui`，DSH 0.2.2-rc.5 web；Chrome 158 headless / Playwright 1.65；1440x900）
- 结论: **PASS — 81/100**；**0 P0 / 0 P1**，关键切换可用；保留 3 个 P2、若干 P3。

## 结论摘要

本轮拆分方案成立：

- `client-package/`（`dsh-rd-workflow-client`）只含 composer chip 与 frame-wide menu，Host `index.js` 为 no-op；主包只保留 preset Host，不再有全局 Host row。
- 标准 preset 会话实测：无 chip、system prompt 无 `## R&D Workflow` / `Mode:`、`rd-workflow*` skill 为 0、命令菜单无 `mode`。
- 研发流程会话实测：有 `## R&D Workflow` + `Mode: standard`；`/mode` 命令存在；chip 切深度成功，下一轮 `Mode: deep.`；切轻量后刷新，chip 仍轻量，下一轮 `Mode: light.`。
- 已有对话中菜单由 `shell.overlay` 渲染，不被 composer 裁剪；实际外框 **184×106**（border-box）。
- 键盘：打开聚焦选中项，ArrowUp/Down/Home/End、Escape 回焦均成立；有 `aria-controls="rd-mode-menu"`。

因此上一轮的两个 P1 已关闭，目标功能可用，按“无 P0/P1、关键交互可用”判定 PASS。剩余问题集中在状态同步的副作用、测试空白和细节，不阻塞本次 PASS。

## 维度表（0-100）

| 维度 | 权重 | 得分 | 依据 |
|---|---:|---:|---|
| 功能与状态正确性 | 30% | 88 | 标准隔离、RD prompt、切换、刷新后 Mode 均实测；无 P1 |
| UI 视觉一致性 | 25% | 82 | chip 与权限选择器一致；菜单 184 已修；行高/阴影/2px 间距有 P3 漂移 |
| 代码与隔离 | 20% | 78 | 拆分方案成立；mount 同步重复写命令、会覆盖 server 状态；无客户端测试 |
| 可访问性 | 10% | 80 | 打开聚焦、方向键/Home/End、Escape 回焦、aria-controls；Tab/listbox 模式未收口 |
| 证据与测试 | 15% | 70 | `split-rd/standard/menu` 截图有效；三命令通过；无运行时 client 测试，deep 切换无归档截图 |
| **合计** | 100% | **81** | **PASS**；保留 P2/P3 |

## 速查清单

- [问题 1] `client-package/client.js:115-121`：mount 时无条件 `/mode <localStorage>`，每次打开/刷新都写一条 `mode · 已完成`，同一会话实测出现 4 条以上；即使模式没变也会写 → 只在模式与 Host 不同时同步，或把自动同步做成不可见/去重记录；刷新一次不应新增无意义命令行。
- [问题 2] `client-package/client.js:115-121`：第二个无 localStorage 客户端打开 dev 会话时，mount 会把 Host 从 deep 静默改回 standard；本次实测 turn 4 `Mode: standard.`。chip 与 server 一致，但“打开会话就改档”是产品决策 → 文档化“chip 为准”，或读取 Host 状态/冲突提示；不能既不告知又覆盖。
- [问题 3] `test/`：`npm test`/`check`/`smoke` 全绿，但没有运行时 client/preset 测试 → 增加 standard 零污染、dev prompt + `/mode`、切 light/deep、刷新、第二客户端、184 菜单与键盘的 E2E，并纳入默认命令。
- [问题 4] `client-package/client.js:145`：菜单高度仍按 `3*32+8 = 104` 计算，实际 106，chip 上间距 4px 而非 6px；Tab 从选中项移到下一项且菜单不关闭 → 2px 定位修掉；Tab/离开菜单行为明确为关闭并回焦。
- [问题 5] 证据：`split-rd-final.png` 只有 mount 同步的标准命令行，没有 deep/light 成功切换画面；`final-mode-*` 是旧截图；`repro-overlay-menu-final.png` 只证明菜单可见 → 补一张切换后 chip+命令行+下一轮 Mode 的归档图，更新 `MODE-SELECTOR.md` 引用。

- [提升 1] `.rd-mode-menu` 保留 184/10/32，但统一 host elevation 阴影、13px/400 行字重和 12px 行圆角，让菜单与权限菜单并排像一套。
- [提升 2] 切换/同步失败时显示 composer 内可见错误，而不是只改 chip 的 `title`；当前 mount 同步失败完全静默。
- [提升 3] 加选项（option）的 roving tabindex/`:focus-visible` 环；Tab 离开关闭；保持现有方向键手感。
- [提升 4] 自动同步命令不产生聊天记录（或只在真正变更时记录），减少 `mode · 已完成` 噪声。
- [提升 5] 动效：chevron 120ms 已够，菜单瞬时出现与 host 一致；不需要新增装饰性动效。

## 已验证通过（本轮实测）

### 隔离

- 标准 preset 会话 `session-23bb…`：header/投影 `agentPreset:"standard"`；无 chip；system prompt `R&D false / Mode none`；`rd-workflow*` skill 0；`/` 命令菜单无 `mode`。
- 研发流程会话 `session-5b8…`：`agent-preset/selected dev-workflow`；system prompt `R&D true / Mode: standard.`；`/` 命令菜单有 `mode`；chip 出现。
- `npm test`：12 pass + `E2E gate: 3 packs pass, 4 scores present, hashes verified`；`npm run check`：YAML parsed / packaging checks passed；`npm run test:smoke`：PASS。

### 切换与 State

- 5b8 切 **深度**：`command/run name=mode args=" deep"` → `command/done kind:success`；chip 变 `深度`；下一轮 turn 2 system prompt `Mode: deep.`。
- 5b8 切 **轻量** → 刷新：chip 仍 `轻量`；mount 同步 `/mode light` 成功；下一轮 turn 5 system prompt `Mode: light.`。
- 深度切换后刷新：chip 仍 `深度`；mount 同步 `/mode deep` 成功；未出现标签与 server 相反。
- 第二浏览器上下文（无 localStorage）打开 5b8：chip `标准`；mount 同步 `/mode standard` 成功；下一轮 turn 4 system prompt `Mode: standard.`。**chip 与 server 一致**，但会把之前的 deep 静默改为 standard（P2-2）。
- 切换与 mount 同步均不产生 user 气泡；记录只有 `mode · 已完成` 命令行和真实用户消息。

### UI / 交互

- 新建空白会话选择研发流程：首轮前 chip 可见（标准）；切换命令成功；菜单可在首轮前打开。
- 已有研发流程对话中菜单打开：bounding box **184×106**，`box-sizing:border-box`，10px 圆角，32px 行，白色 layer-1 表面，当前项 check；菜单在 `shell.overlay` / `pI_x6G_overlayLayer`，`elementFromPoint` 命中菜单内部，未被 composer 裁剪。
- chip：28px、13px/500、14px 图标、chevron、透明底、host hover；与权限选择器同高。
- 键盘：Enter 打开后焦点在选中项；Home/End/ArrowUp/Down 正确；Escape 关闭并回到 chip；`aria-controls="rd-mode-menu"`、`aria-expanded` 正确。
- 外部点击、resize 关闭；本次浏览器操作无 console error / page error。

## P2（不阻塞 PASS，但需登记/决定）

### P2-1 mount 同步重复写命令记录

`client-package/client.js:115-121` 在每次 chip mount 都发送 `/mode <localStorage>`，不判断 Host 当前值。实测同一 5b8 会话在若干次打开/刷新/切换后出现多条 `mode · 已完成`；命令日志包含 `standard`、`standard`、`deep`、`deep`、`light`、`light` 等重复项。即使模式没变也会写聊天记录。

**验收**：打开/刷新一次不新增无意义的 `mode` 命令行；只有实际变更才留记录（或同步走不可见的内部命令）。保留“切换成功有一条轻量记录”。

### P2-2 chip 覆盖 Host；第二客户端会静默改档

这是当前设计的直接后果：mount 以 localStorage 为准，第二个无 localStorage 客户端把 5b8 从 deep 改为 standard（下一步 `Mode: standard.`，chip 也 standard）。一致性成立，但用户只是“打开会话”就改变了会话模式，且没有提示。

**验收决定**：若产品接受“chip 为准”，在 README/MODE-SELECTOR 明确写出“打开会话会按客户端保存的模式同步 Host”；若不接受，增加 Host 当前 mode 的读取/projection，冲突时提示用户而不是静默覆盖。无论哪种，mount 同步失败必须有可见错误。

### P2-3 没有运行时 client/preset 测试

测试覆盖了打包、Host 注册和 profile 安装，但不执行 `client-package/client.js`，也不创建标准/研发流程运行时会话。上一轮“Host 半被关掉”的回归能全绿通过，说明这个缺口真实存在。

**验收**：新增 Playwright/真实 profile E2E：
1. 标准会话：无 chip、无 R&D/Mode/skills/command。
2. 研发流程会话：R&D/Mode、9 skills、`/mode`、chip 可见。
3. 切 light/deep：命令行 + 下一轮 `Mode:`。
4. 刷新/第二客户端：chip 与下一轮 `Mode:` 一致（并记录覆盖行为）。
5. 菜单 184、overlay 不裁剪、键盘路径。

## P3

- 菜单高度仍按 104 计算而实际 106，chip 上间距实测 4px（目标 6px）；宽度已修。
- Tab 从选中 option 移到下一项且菜单不关闭；listbox roving tabindex/离开关闭未收口。
- 菜单行 13px/500、行圆角 6、surface 10、z-index 1001、手写 `0 6px 20px rgba(0,0,0,.12)` 与 host 权限菜单（13px/400、行高 34、行圆角 12、surface 16、z-index 1100、elevation token）仍有细节漂移；按验收 target 是 184/10/32，可保留但应统一阴影/字重。
- 切换失败与 mount 同步失败只有 `title`，没有 composer 内可见错误。
- `split-rd-final.png` 只有 mount 同步的 `mode · 已完成`，没有 deep/light 成功切换截图；`final-mode-*` 是旧截图；`repro-overlay-menu-final.png` 只证明菜单可见。
- `client-package` 是 `private: true` 的本地 `file:` 依赖；本地 tarball 安装（smoke）通过，但公共 npm registry 分发/升级路径未验证；发布前应确认 client 包会随 bundle 安装并被解析。
- 未复测：390x844 当前 split 构建、200% zoom、英文 locale、屏幕阅读器实际播报、滚动关闭、server 重启后的持久性、运行中切换、subagent composer。
- `README.md:14-16` 的“does not add a Host-wide row”仍可读成“没有全局 row”；建议明确“只有 client-only 全局 row，Host 半为 no-op”。

## 关键证据

**截图**（均读取）：
- [split-rd-final.png](split-rd-final.png)：研发流程会话 + chip + mount 同步命令行；证明 Host prompt 已恢复。
- [split-standard-final.png](split-standard-final.png)：标准模式会话无 chip；证明隔离。
- [repro-overlay-menu-final.png](repro-overlay-menu-final.png)：已有对话菜单可见，未被裁剪。
- [final-mode-matched.png](final-mode-matched.png)、[final-mode-menu2.png](final-mode-menu2.png)、[final-mode-matched-deep.png](final-mode-matched-deep.png)：旧截图，仅用于 chip/menu 视觉基线，不证明本轮状态修复。

**本轮实测补充**：
- 标准会话：prompt `R&D false / Mode none`、rd skills 0、命令菜单无 `mode`、chip 0。
- 研发流程：prompt `R&D true / Mode standard`；`/mode` 命令存在；切 deep → turn 2 `Mode: deep.`；切 light → 刷新 → turn 5 `Mode: light.`。
- 第二客户端：chip standard；mount 同步 standard；turn 4 `Mode: standard.`（并覆盖了之前的 deep，见 P2-2）。
- 菜单 184×106；overlay 父级；elementFromPoint 命中；键盘 focus/Arrow/Home/End/Escape 回焦；`aria-controls`。
- 无 console/page error。
- 测试命令：`npm test`（12 pass + E2E gate）、`npm run check`（packaging checks passed）、`npm run test:smoke`（PASS）。

## 保留

保留三件事：**(1)** 透明、与权限选择器同高同字重的 chip；**(2)** 切换只留 `mode · 已完成`、不注入 user 气泡的轻量记录；**(3)** 独立 client 包 + `shell.overlay` 菜单的拆分方向——它同时解决了跨 preset 污染和已有对话裁剪，不应改回全局 Host row。

## 结论

**PASS — 81/100**：功能与 UI 无 P0/P1；标准隔离、研发流程 prompt、模式切换、刷新/第二客户端一致性、184px 菜单、键盘核心路径均成立。P2 是状态同步的产品决策/噪声/测试空白，不阻塞本次 PASS；P3 为细节与文档证据。

**最终判定：PASS — 81/100。**

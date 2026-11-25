# MODE-REVIEW — R2 修复后复审

- Reviewer: `mode-selector-reviewer`（独立复审；只读代码，只写本文件）
- 日期: 2026-11-25
- 对象: `dsh-rd-workflow` 0.8.0，`7e07bf2` "fix: isolate global client row and sync mode with host"
- 环境: 提供的最终实例 `127.0.0.1:3099`（profile `modeui`，DSH 0.2.2-rc.5 web；Chrome 158 headless / Playwright 1.65；1440x900、390x844）
- 结论: **REVISE — 47/100**；**新的 P1 回归**：研发流程 preset 的 Host 半未挂载，chip/菜单在、但模式切换无效，R&D prompt、9 个 skill、`/mode` 命令全部缺失。

## 结论摘要

修复的“标准 preset 零污染”已独立验证通过：新建 `标准模式` 会话的 system prompt 无 `## R&D Workflow`、无 `Mode:`、无 `rd-workflow*` skill，命令菜单无 `mode`。

但同一修复把研发流程 preset 的 Host 半一起关掉了：

- 新建会话 header `agentPreset:"standard"` → UI 选择 `研发流程`（session log 有 `agent-preset/selected: dev-workflow`）→ 首轮 system prompt **没有** R&D contract、没有 `Mode:`；`/` 命令菜单**没有** `mode`；chip 却照常出现。
- 点击 chip → 选 `深度`：菜单关闭，chip 仍显示 `标准`，`localStorage` 回到 `standard`，聊天没有 `mode · 已完成` 命令行；`/mode` 根本不存在。也就是说目标功能在研发流程会话里**不可用**，不是视觉问题。
- 该回归没有被 `npm test`/`check`/`smoke` 捕获，也未出现在新证据截图里（新截图只证明菜单打开，不证明切换成功）。

因此原 P1 的“标准污染”解决了，但出现 **新的 P1 回归**；原 P1 的“状态一致”也无法在当前构建里端到端验证。PASS 条件不成立。

## 维度表（0-100）

| 维度 | 权重 | 得分 | 依据 |
|---|---:|---:|---|
| 功能与状态正确性 | 30% | 20 | 标准隔离通过；研发流程 Host 半缺失、切模式无效；刷新/第二客户端无法验证 |
| UI 视觉一致性 | 25% | 82 | chip 与权限选择器一致；菜单已修到 184；行高/阴影仍有 P3 漂移 |
| 代码与隔离 | 20% | 35 | `clientOnly` 关掉 preset Host 半；mount 时用 localStorage 向 Host 推送；无服务端状态读取 |
| 可访问性 | 10% | 75 | 打开聚焦、Arrow/Home/End、Escape 回焦、`aria-controls` 成立；Tab/listbox 模式仍不完整 |
| 证据与测试 | 15% | 35 | 命令全绿；无 Host 半或切换成功的修复后证据；测试不含运行时 preset 组合 |
| **合计** | 100% | **47** | **REVISE**；修 P1 回归并补端到端测试后重评 |

## 速查清单

- [问题 1] `index.js:190-194` + `cordis.patch.yml:139-143`：`clientOnly: true` 后研发流程会话的 Host 半也没了；system prompt 无 R&D、无 `Mode:`、命令菜单无 `/mode`，chip 选深度无效 → 研发流程必须恢复 prompt/9 skills/`/mode`，且标准 preset 仍零污染；需有真实 dev-workflow 会话截图/日志。
- [问题 2] `client.js:115-121`：mount 时把 localStorage 模式 `/mode` 推给 Host；没有读 Host、没有等待/失败处理 → 要么由 Host 返回当前模式，要么明确“客户端覆盖”并处理失败；专门验证切 light/deep → 刷新 → 下一轮 `Mode:` 一致；另开无 localStorage 客户端不能静默改档而不告知。
- [问题 3] `test/`：`npm test`/`check`/`smoke` 全绿，但不创建 dev-workflow 运行时会话；`check.mjs` 只查 `clientOnly: true` 字符串 → 增加真实 profile 的 standard + dev-workflow 两套 prompt/命令断言，纳入默认测试。
- [问题 4] `client.js:145`：菜单高度按 104 算，实际 106，chip 上间距实测 4px（目标 6px）；菜单打开后 Tab 仍停留在菜单（移到下一 option），未按菜单模式关闭 → 修 2px 定位并定义 Tab/离开行为。
- [问题 5] 证据：`repro-overlay-menu-final.png` 只展示菜单打开；`final-mode-*` 是 16:51/16:54 修复前截图；`MODE-SELECTOR.md` 仍引用 `repro-overlay-menu.png`，新文件未被引用 → 重拍“切 deep 成功 + 命令行 + 已存在对话”，并更新引用。

- [提升 1] `.rd-mode-menu`：保留 184/10/32，但对齐 host elevation/shadow 与 12px 行圆角，减小手写 `rgba(0,0,0,.12)` 阴影的偏重感。
- [提升 2] 行字重：host 菜单是 13px/400，本菜单 500；统一后菜单与权限菜单并排更像一套。
- [提升 3] 失败态：`/mode` 失败或 mount 同步失败时在 composer 内显示可见错误（不只 `title`），避免“点了没反应”。
- [提升 4] 动效：chevron 120ms 已够；菜单瞬时出现与 host 一致，不需要再加装饰性动效。
- [提升 5] 无障碍：给 option 加 roving tabindex/listbox 语义，Tab 离开时关闭并回焦，避免焦点留在打开菜单后面的选项。

## P1 回归（本轮阻塞项）

### P1-1 研发流程 preset 的 Host 半未挂载

**位置**：`index.js:190-194`（`clientOnly` early return）、`cordis.patch.yml:139-143`（全局 `rd-mode-client` 的 `config: { clientOnly: true }`）。

**独立实测（最终实例，当前代码）**

1. 新建空白会话（header `"agentPreset":"standard"`），在 native preset 菜单选择 `研发流程`；session log 出现 `agent-preset/selected {"agentPreset":"dev-workflow"}`。
2. 选择后 chip 出现（说明 client 半正常），首轮系统消息实测：
   - 无 `## R&D Workflow`；
   - 无 `Mode: standard.`；
   - `available_skills` 无任一 `rd-workflow*`；
   - `/` 命令菜单无 `mode`。
3. 点击 chip，选择 `深度`：菜单关闭，chip 仍为 `标准`，`localStorage` 为 `standard`，聊天无 `mode · 已完成` 行；没有 console error。切换失败但没有可见错误。
4. 同一 profile 的另一个 17:17 会话 `session-d6560…`（会话创建在修复前，但首轮发生在修复后的服务实例）也呈现同样现象：header 是 `standard`，但 seq 4 有 `agent-preset/selected dev-workflow`，turn 1 的 system prompt 无 R&D、无 Mode。**如果把它当作“标准 preset 会话无 R&D”的证据，会误判**；它实际是选择研发流程后的会话，恰好证明 dev-workflow 的 Host 半没有挂载。

**对照**：新建标准 preset 会话 turn 1 的 system prompt 无 R&D、无 Mode、`rd-workflow*` skill 0；`/` 命令菜单无 `mode`。标准隔离是对的；问题只在研发流程 Host 半。

**判断**：`clientOnly` 的 config 影响到了研发流程 preset 的同一个 package 挂载（preset row 没有显式 config，或共享了全局 row 的 config）。无论精确机制是哪一个，当前构建的研发流程 Host 半没有 `applyWithMode()`，所以：R&D prompt、mode section、9 skills、`/mode` command 全部缺失，chip 的切换必然失败并回滚。

**修完验收**：
- 新建研发流程会话的 system prompt 必须有恰好 1 份 `## R&D Workflow` + 1 条 `Mode:`；skill 列表恰好 9 个 `rd-workflow*`；`/` 菜单有 `mode`。
- chip 切 light/standard/deep 后必须出现 `mode · 已完成` 命令行并留存；下一步 system prompt 的 `Mode:` 等于所选。
- 标准 preset 会话必须继续保持 0 污染（R&D/Mode/skills/command 全无）。
- 增加覆盖上述两种运行时会话的集成测试；不要只检查 `clientOnly: true` 字符串。
- 修法建议：显式给 preset row 的 `rd-workflow-contract` 传 `clientOnly: false` 并验证是否覆盖全局 config；若 config 仍共享，改用独立的 client-only 入口/包或移除全局 row，让 preset row 同时承担 client 半。

## P2 / P3

### P2-1 状态 synced 的实现与验证都未完成（原 P1 待重验）

`client.js:115-121` 在 mount 时读 localStorage 初始值，直接 `live.command('/mode <mode>')`，没有读取 Host 当前模式，也没有处理返回错误。设计上这是“chip 覆盖 Host”：

- 在无 localStorage 的客户端打开一个 server 已是 deep/light 的会话，会把 server 改成 chip 的 standard，而不是显示 server 的 deep/light；chip 与下一轮 `Mode:` 会一致，但会话状态被静默改变。
- 反向：server 重启后 Host 回到 standard，若 localStorage 仍是 deep，mount 会把 Host 改回 deep；这是选定的行为，但必须文档化，且需处理 `/mode` 不可用（当前就是失败但无提示）。
- 本构建研发流程 `/mode` 不存在，无法验证“切 light/deep → 刷新 → 一致”或“另开无 localStorage 客户端”；**未验证**，不是已通过。

**验收**：如果你坚持“chip 为准”，至少要在 mount 同步失败时可见报错，并说明“打开会话会改档”；如果希望尊重 server 状态，应增加 server-side projection/查询，在 chip 显示前读取当前 mode，冲突时由用户决定。新增第二客户端/刷新 E2E。

### P2-2 测试没有覆盖运行时 preset 组合

执行结果（本轮复跑，全部通过）：

```text
npm test        # 12 tests pass; E2E gate: 3 packs pass, 4 scores present, hashes verified
npm run check   # cordis.patch.yml parsed as YAML; packaging checks passed
npm run test:smoke  # smoke: PASS
```

但 `test/plugin.test.mjs` 只 mock Host 注册；`test/check.mjs` 只做文件/字符串断言；`smoke-temp-profile.mjs` 只安装/卸载。**没有测试在真实 profile 中创建 dev-workflow 会话并检查 prompt/命令**；所以一个使目标功能完全不可用的回归仍然全绿。这是本轮最需要补的 P2。

### P3

- `client.js:145` 菜单高度仍按 `3*32+8 = 104` 计算；实测菜单 184x106，chip 上间距 4px（目标 6px）；宽度已修（实际 bounding box 184）。
- 键盘核心已修：打开聚焦选中项、ArrowUp/Down/Home/End、Escape 回焦 chip、`aria-controls="rd-mode-menu"` 均实测成立。但 Tab 会移到下一个 option 且菜单保持打开，没有 listbox roving tabindex/离开关闭；属于 P3 的完整性问题。
- 切换失败/ mount 同步失败只有 chip `title`（“切换失败”），没有可见错误；本轮的 dev preset 失败就表现为“点了没反应”。
- `MODE-SELECTOR.md` 仍引用 `repro-overlay-menu.png`（旧），新增的 `repro-overlay-menu-final.png` 尚未被引用；`repro-existing-menu.png` 已被删除但旧引用仍存在（历史文件）。
- 新证据 `repro-overlay-menu-final.png` 只显示菜单打开，没有展示一次成功的切换；`final-mode-*` 均为修复前截图。`repro-overlay-menu-final-report.json` 仅有一条与选择器无关的 `High` 对比度提示。
- 菜单视觉 token 仍与 host 有差异：host 13px/400、行高 34、行圆角 12、surface 16、elevation token；本菜单 13px/500、行高 32、行圆角 6、surface 10、手写阴影。
- `README.md:14-16` 的“does not add a Host-wide row”仍与代码中的全局 `rd-mode-client` 有措辞歧义；建议明确“client-only global mount”。
- 未验证：刷新/第二客户端（被 P1 阻断）、server 重启后的模式持久性、切换期间对话运行、subagent composer、200% zoom、屏幕阅读器实际播报。

## 已实测通过（本轮）

- chip 视觉：28px 高、13px/500、14px 图标、chevron、透明底、host hover；与权限选择器同高。
- 新菜单宽度：bounding box **184 x 106**（`box-sizing:border-box` 已生效）；10px 圆角、32px 行、leading 图标、`aria-selected` check；在已有对话中由 `shell.overlay` 渲染、未被 composer 裁剪。
- 首轮前和已有对话中 chip 均可见；点击菜单可打开。
- 键盘：Enter 打开后聚焦标准项；Home/End/ArrowUp/Down 正常；Escape 关闭并回焦 chip；`aria-controls` 存在。
- Escape、外部点击、resize 关闭；390x844 下菜单在视口内。
- 标准 preset 会话：system prompt 无 R&D、无 Mode、无 `rd-workflow*` skill，命令菜单无 `mode`（隔离修复成立）。
- 本次浏览器操作无 console error、无 page error。
- 三个测试命令全绿（但覆盖不到本轮回归）。

## 关键证据

- [repro-overlay-menu-final.png](repro-overlay-menu-final.png)（新，1440x900，菜单打开；未展示切换成功）
- [final-mode-matched.png](final-mode-matched.png)、[final-mode-menu2.png](final-mode-menu2.png)、[final-mode-matched-deep.png](final-mode-matched-deep.png)（16:51/16:54，修复前；视觉有效，但不证明本轮状态修复）
- 标准会话 `session-01c165e7…`：system prompt R&D false / Mode none / rd skills 0。
- 研发流程会话 `session-d9e386a0…`：header standard、`agent-preset/selected dev-workflow`、system prompt R&D false / Mode none；`/` 无 `mode`；chip 切深度后仍标准、localStorage standard、无命令行。
- 旧 `session-d6560…`：同样 header standard + selected dev-workflow + 无 R&D，说明本轮“标准无 R&D”证据实际是 dev-workflow 会话，不能证明修复。

## 保留

保留静悄悄的透明 chip、与权限选择器同高同字重的对齐、`mode · 已完成` 命令行而不注入 user 气泡，以及 `shell.overlay` 菜单不裁剪的修复方向。不要为了补救回归把 chip 变成显眼按钮或把菜单塞回 composer。

## 最小修复条件（REVISE → PASS）

1. 修 P1-1：研发流程会话恢复 R&D prompt、`Mode:`、9 skills、`/mode`；chip 切 light/standard/deep 成功并出现命令行；标准 preset 仍零污染。加真实 profile 集成测试。
2. 补 P1-2 的端到端验证：切 light/deep → 刷新 → chip 与下一轮 `Mode:` 一致；第二客户端行为明确（若坚持 chip 覆盖，至少失败可见并文档化）。
3. 修 P3 菜单 2px 定位/失败可见错误/Tab 行为；更新截图引用与 `MODE-SELECTOR.md`，重拍一次修复后成功切换的证据。
4. 复跑 `npm test` / `npm run check` / `npm run test:smoke`，并新增运行时 preset 测试。

**最终判定：REVISE — 47/100。** 标准隔离、菜单宽度、键盘焦点三项修复成立；但研发流程 Host 半的 P1 回归使目标功能不可用，PASS 条件不成立。

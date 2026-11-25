# MODE-REVIEW — composer 流程强度选择器独立评审

- Reviewer: `mode-selector-reviewer`（独立评审，未参与实现；只读代码，只写本文件）
- 日期: 2026-11-25
- 仓库: `/home/dennis/projects/oiler-hub/dsh-rd-workflow`（`9cc4f35` + 工作区当前文件）
- 环境: 提供的本地临时实例 `127.0.0.1:3099`（DSH 0.2.2-rc.5 web，profile `modeui`）、Chrome 158 headless（Playwright 1.65）、1440x900 与 390x844
- 结论: **REVISE — 62/100**；**2 个 P1**，PASS 条件不成立（功能/隔离存在 P1）

## 结论摘要

核心交互在 `研发流程` 会话内是通的：chip 在首轮前和已有对话中都可见；点击菜单在已有对话中由 `shell.overlay` 渲染、不被 composer 裁剪；轻量/标准/深度切换后 chip 更新，`/mode` 命令成功，下一轮 system prompt 的 `Mode:` 生效；切换不产生 user 气泡，只留下 `mode · 已完成` 命令行。chip 的 28px 高、13px/500、14px 图标、chevron、透明底与 host hover 也都实测成立。

但有两项超出“细节”的问题：

1. **全局 client row 同时挂载了 Host 半，污染所有其他 preset**。实测 `标准模式` 会话已经拿到 `## R&D Workflow`、`Mode: standard.`、`/mode` 命令和 9 个 `rd-workflow*` skill。这直接违反“一个 preset”“全局 row 不污染其他 preset”的验收条件。
2. **mode 标签不是 server 状态，跨客户端/重开后会显示错误的模式**。实测同一会话在另一个无 localStorage 的客户端中 chip 显示 `标准`，下一轮 system prompt 实际是 `Mode: light.`。服务器重启后方向相反（实际会回到 standard，标签仍可能停在 light/deep），属于会骗用户“已切换”的状态错误。

## 维度表（0-100）

| 维度 | 权重 | 得分 | 依据 |
|---|---:|---:|---|
| 功能与状态正确性 | 30% | 42 | 切换、可见性、命令、prompt 生效可用；P1-1/P1-2 |
| UI 视觉一致性 | 25% | 82 | chip 与权限选择器一致；菜单 194px（非声明 184px），行重/圆角/阴影有细节漂移 |
| 代码与隔离 | 20% | 52 | 全局 row Host 半未隔离；localStorage 被当作权威；无客户端自动化测试 |
| 可访问性 | 10% | 58 | 鼠标/触摸可用；listbox 无键盘导航与焦点管理 |
| 证据与测试 | 15% | 70 | 三个命令通过、四张截图有效；缺少隔离/状态/键盘证据 |
| **合计** | 100% | **62** | **REVISE**；修复 P1 并补齐 P2 后重评 |

离下一档（无 P1、关键交互完整）还差：P1-1、P1-2 必须先修；P2-1、P2-2 在同轮修复。视觉单项本身接近 82-85，不是主要扣分项。

## 速查清单

- [问题 1] `cordis.patch.yml:136-141` + `index.js:190-193`：全局 `rd-mode-client` row 把 Host 半也挂到根，标准 preset 会话已含 R&D prompt / `/mode` / 9 个 skills → 全局 row 只能挂 client 半；标准会话必须 0 污染，研发流程会话仍恰好 1 份 section + 9 skills。
- [问题 2] `client.js:93`（localStorage 作初值）与 `client.js:104-117`（切换后不回读 server）：跨客户端/重开后 chip 标签可与实际 agent prompt 不一致（实测显示标准、实际 light）→ chip 必须从 host 当前状态派生；重开、刷新、重启后标签与实际一致。
- [问题 3] `client.js:36`：`.rd-mode-menu` 未设 `box-sizing`，实测外框 **194x106** 而非声明 **184px 宽**；`client.js:122-125` 定位按 184x104 计算 → 外框矩形 184 宽；定位使用实测 rect；右边缘不越界。
- [问题 4] `client.js:54-88`：键盘打开后焦点仍在 chip，ArrowDown 无反应，Tab 直接跳到模型选择器，listbox 无 focus/roving tabindex/`aria-controls` → 键盘可完整打开、导航、选择、关闭并回到触发器。
- [问题 5] `test/`：`npm test`/`check`/`smoke` 均通过，但都不执行 `client.js` 的 chip/menu 或 standard preset 隔离 → 增加浏览器级 E2E（隔离 + 跨客户端状态 + 键盘），并接入 `npm test`。

- [提升 1] `.rd-mode-menu`：保留 184/10/32 目标，改用 host 的 elevation/menu token 与更接近的 12px 行圆角，减小当前偏重的手写阴影 → 与权限菜单并排看不出两套菜单。
- [提升 2] `.rd-mode-option`：行字重改 400（host 菜单位 400，当前 500），chevron 12→14 与权限触发器一致，检查 check 对齐 → 100% 与 200% 下同一条基线。
- [提升 3] 焦点态：选项增加 `:focus-visible` 环并复用 chip 的 ring token → 键盘导航时目标可见。
- [提升 4] 失败态：`/mode` 失败时给 composer 内可见错误（而不只是 `title`），避免静默 → 失败用户能看到原因，chip 与 state 一致。
- [提升 5] 动效：chevron 120ms 旋转已跟随开关，菜单瞬时出现；没有证据显示正常速度手感有问题，保持克制即可，不新增浮夸动效。

## P1（阻塞 PASS）

### P1-1 全局 row 的 Host 半污染所有其他 preset

**位置**：`cordis.patch.yml:136-141`（`rd-mode-client` 全局行）、`index.js:190-193`（预期 early return）、`index.js:137-183`（prompt / skills / command 注册）。

**观察**：用提供的实例创建一个默认 `标准模式` 会话并发送一次普通消息（session `eaa47571…`，日志 header `"agentPreset":"standard"`，无 `agent-preset/selected` 事件）。该会话的 system prompt 实际包含：

- `## R&D Workflow` 完整 contract；
- `Mode: standard.`；
- `available_skills` 出现 `rd-workflow`、`rd-workflow-contract`、`rd-workflow-delivery`、`rd-workflow-program`、`rd-workflow-project-docs`、`rd-workflow-research`、`rd-workflow-research-review`、`rd-workflow-roles`、`rd-workflow-ui-rubric` 九项。

另外在另一空白 `标准模式` 会话的 command 菜单里确认出现 `mode — Set workflow intensity: light, standard, or deep`。同一时刻这些标准模式会话的 chip 因 `preset !== 'dev-workflow'` 被隐藏，所以用户看不到选择器，却已经在跑 R&D 流程 prompt——比“多一个控件”严重得多。

**根因判断**：全局 `rd-mode-client` 行与 preset 行都加载同一个 package；从**跨 preset 的注册结果**看，`apply()` 的 early-return 在本 profile 中未生效，全局行执行了 `applyWithMode()`，把 `systemPrompt.section`、`skills.register`、`commands.register` 注册在根。`index.js:192` 的 `presets && …` 守卫在没有 `agentPresets` 服务（或服务不可见）时会直接落到 `applyWithMode`，并非“outside a preset 必返回”。（精确的机制仍建议在修复前用日志验证一次；不影响“标准 preset 被污染”的结果判定。）

**影响**：标准 preset 已实测被注入约 13K 字符的研发流程 prompt、一次模式段、9 个 skill 和全局 `/mode` 命令；同一根注册机制会覆盖其他 preset（其他 preset 未逐一实测）。违反 README 的“does not affect sessions that use Standard or another preset”和本次验收的“一个 preset / 全局 row 不污染其他 preset”。这也是 `npm test` 没覆盖到的范围（测试只测 Host 侧注册函数，不跑真实 profile 组合）。

**修完验收**：
- 标准 preset 会话 system prompt 不包含 `## R&D Workflow`、`Mode:`、任何 `rd-workflow*` skill；command 菜单没有 `mode`。
- 研发流程会话仍然恰好 1 份 contract、1 条 `Mode:`、9 个 skill、1 个 `/mode`。
- 加一条集成测试：临时 profile 安装 bundle 后创建标准 preset 会话，断言上述“无”；再创建 `dev-workflow` 会话断言“有”。

最直接修法：给全局 row 显式 `config: { clientOnly: true }` 并在 `apply()` 里先返回（Host 半不注册任何东西），或拆出只含 client 的入口；不要依赖 `ctx.get('agentPresets')` 的可用性。

### P1-2 chip 标签不是 server 当前状态，重开/换客户端会误导

**位置**：`client.js:93`（`localStorage.getItem('rd-mode:…')` 作为初值）、`client.js:104-117`（成功后只写 localStorage，没有回读 host）、`client.js:100`（unmount 关闭菜单）。状态没有从 server projection/命令回读。

**观察**（提供的实例，同一会话）：
1. 在第一个浏览器会话中把 `Greeting` 从 `standard` 切到 `light`，server 日志有 `command/run cmd-… args " light"` + `command/done kind: success`；该 client 的 chip 显示 `轻量`。
2. 新开一个无该站点 localStorage 的浏览器上下文，点开同一 `Greeting` 会话：chip 显示 `标准`（默认值），但下一轮实际 system prompt 是 `Mode: light.`（turn 2 日志可证）。
3. 这是**可观察的“UI 说标准、agent 实际跑 light”**。反向同样存在：服务器重启后 agent 状态回到 standard，同一浏览器的 localStorage 仍会显示 light/deep；模式 state 只存在内存 `WeakMap`，没有 durable replay。

**影响**：这是本功能的主状态显示。用户会按“轻量/深度”判断风险级别；显示错档位等于控件在说谎。它不会导致代码丢失，但会直接误导流程选择，按本次 PASS 条件属于功能 P1，而不是 P3 的“刷新细节”。

**修完验收**：
- chip 的初值和切换结果都从 host 的当前 mode 派生（推荐新增 session projection 或在挂载时查询 `/mode` 状态）；localStorage 只能是提示，不能是权威。
- 同一会话在第二个无 localStorage 的客户端、刷新后、server 重启后，chip 与实际下一轮 prompt 的 `Mode:` 必须一致。
- 如果产品决定不持久化 mode，则重开后 UI 必须显示真实默认值（standard），而不是上次的 localStorage 值；不能“标签持久化、agent 不持久化”。
- 增加跨客户端/重开 E2E；这比多拍一张 deep 截图更有价值。

## P2

### P2-1 菜单实际外框 194px，不是验收的 184px

**位置**：`client.js:36`（`width:184px; padding:4px; border:1px`，没有 `box-sizing:border-box`）、`client.js:122-125`（定位用 `width = 184`、`height = 3*32+8 = 104`）。

**实测**（1440x900，现有对话中打开）：菜单 bounding box **194 x 106**，computed width 184、box-sizing `content-box`；top 723、bottom 829，chip top 833，实际间距 **4px**（代码想 6px）；行的 32px 正确，半径 10px 正确，当前项 check 正确。渲染不裁剪，`elementFromPoint` 命中菜单内部；390x844 下菜单 194x106 仍在视口内（x=112, y=667）。

**影响**：验收文字（`MODE-SELECTOR.md`）和作者证据都写 184px，实际多 10px；右边缘 clamp 也少算 10px。属于明确的 UI 规格不达标，不是审美偏好。

**修完验收**：`.rd-mode-menu` 外框宽 184（`box-sizing:border-box`）；顶部间距按实测高度计算（或 `getBoundingClientRect()` 后定位）；截图与 `MODE-SELECTOR.md` 一致；右边缘/390px 不越界。

### P2-2 键盘无法操作 listbox

**位置**：`client.js:54-88`（`ModeMenu` 只处理 mousedown / Escape / scroll / resize）、`client.js:131-138`（trigger 只处理 click；`aria-haspopup`/`aria-expanded` 有，但无 `aria-controls`）。

**实测**：键盘聚焦 chip 后按 Enter 能打开菜单，但焦点仍在 chip；ArrowDown/ArrowUp 无反应；按 Tab 焦点直接到 `DeepSeek-V4.1-Flash` 模型触发器，菜单仍开着；选项没有 roving tabindex/`aria-activedescendant`，DOM 位于 `shell.overlay` 末尾，Tab 到菜单需要走很远。ARIA 结构（listbox/option、`aria-selected`）存在，但键盘操作路径不成立；屏幕阅读器实际播报未实测。

**影响**：这是“关键交互”的可访问性缺口；对纯键盘用户等于该控件不可用。视觉与鼠标路径不受影响，因此定为 P2。

**修完验收**：Enter/Space 打开后焦点进入菜单（选中项或 listbox）；ArrowUp/ArrowDown/Home/End 移动；Enter/Space 选择；Escape 关闭并把焦点还给 chip；Tab 关闭（不把焦点留在打开菜单后面）；增加 `aria-controls`/必要时的 `aria-activedescendant`；提供键盘操作截图/录屏证据。

### P2-3 测试通过但没有覆盖这个功能

**执行结果**（均通过）：
- `npm test` → `# pass 12 / # fail 0`，`E2E gate: 3 packs pass, 4 scores present, hashes verified`
- `npm run check` → `cordis.patch.yml parsed as YAML` / `packaging checks passed`
- `npm run test:smoke` → `smoke: PASS`

但 `test/plugin.test.mjs` 只 mock Host 侧注册；`test/check.mjs` 只检查文件和字符串；`smoke-temp-profile.mjs` 只安装/卸载 bundle；没有任何测试执行 `client.js` 的 chip/menu、标准 preset 隔离、跨客户端状态或键盘路径。两个 P1 正好落在这个空白里。

**修完验收**：至少一条浏览器级 E2E 覆盖“首轮前可见 / 已有对话菜单可见 / 切深度后 prompt 生效 / 不产生 user 气泡”，加“standard preset 零污染”和“第二个客户端状态一致”两条断言；接入默认测试命令，失败即红。

## P3 / 未验证

**P3（不阻塞，但应记录）**
- 菜单视觉 token 与 host 菜单有漂移：host 权限菜单是 13px/400、行高 34、行圆角 12、surface 圆角 16、z-index 1100、elevation token 阴影；本菜单按验收是 13px/500、行高 32、行圆角 6、surface 10、z-index 1001、手写 `0 6px 20px rgba(0,0,0,.12)`。保留了 184/10/32 的目标但阴影更重，建议至少统一到 host elevation。
- `/mode` 失败时只有 chip 的 `title` 变“切换失败”，没有可见错误；`live` 不存在时直接 `return`，会只更新 localStorage/chip 而不通知 server（`client.js:109-110`）。失败路径未实际触发。
- 定位高度按 104 计算而实际 106，间距差 2px（本可被 P2-1 一并修掉）。
- `README.md:14-16` 写“does not add a Host-wide row”，但代码确实有全局 `rd-mode-client`（虽然后半应 client-only）；建议改成“client-only global mount”，避免文档与代码再次脱节。
- `MODE-SELECTOR.md:7-8` 的 184px 与实际 194px 不一致；四张证据图的尺寸有效，但菜单宽度描述需在修复后重拍/更新。
- localStorage 按 session 累积、无清理；跨 tab 无 `storage` 事件同步（P1-2 的一部分）。
- 切换失败/连续快速切换没有并发序列化测试；`previous` 回滚依赖请求顺序。

**未验证（明确不声称通过）**
- 服务器重启后 mode 的重置行为：模式 state 是内存 `WeakMap`，没有 durable replay；本次没有重启提供实例，按代码推断会回到 standard。未作为实测结论。
- 正在运行一轮对话时切模式；plan mode 中切模式；subagent continuation composer 是否也出现 chip。
- scroll 自动关闭：短会话没有可滚动区域，无法有效验证；代码已监听 capture scroll，保留为未验证。
- 200% zoom、屏幕阅读器实际播报、reduced motion、英文 locale 下的菜单宽度与文案。
- `/mode` 的失败回滚（命令服务错误/网络断开）未实际制造。

## 已实测通过项

- 只有一个 `研发流程` preset（`cordis.patch.yml:9-141`）；安装不改默认 preset；标准模式会话 chip 不显示。
- 空白新会话选择研发流程后，首轮前 chip 可见（标准）；已有 `Greeting` 会话 chip 可见；点击菜单在两种状态都正常打开。
- 菜单注册在 `shell.overlay`，父级是 `pI_x6G_overlayLayer`（AppFrame 的 overlay layer），不在 composer 内部；`elementFromPoint` 命中菜单内部，未被裁剪；Escape、外部点击、resize 均关闭。
- chip 实测：28px 高、13px/500、14px 图标、12px chevron、透明底、hover `rgba(38,49,72,.06)`（host hover token）；与权限触发器同为 28px/13px/500/透明/8px radius，间距对齐。
- 菜单实测：10px radius、32px 行、白色 layer-1 背景、leading 图标、`aria-selected` 正确、check 可见；宽 194 见 P2-1。
- 切换 `light → deep` 后：chip 更新、`/mode` `command/run` + `command/done kind: success`、下一轮 system prompt `Mode: deep.`；聊天只出现 `mode · 已完成` 命令行，无 user 气泡；空白会话切换后再发首轮也保持 deep。
- 390x844 视口下 chip 与菜单均在视口内，未横向溢出；菜单 194x106 见 P2-1。
- 本次浏览器操作无 console error、无 page error。

## 关键证据与命令

**提供的截图**（均读取并核对）：
- [final-mode-matched.png](final-mode-matched.png)：首轮前 chip，28/13/500/14、chevron、透明底。
- [final-mode-menu2.png](final-mode-menu2.png)：首轮前菜单，当前项 check。
- [repro-overlay-menu.png](repro-overlay-menu.png)：已有会话菜单，未被 composer 裁剪；`repro-existing-menu-report.json` 仅有一条与选择器无关的 `High` 对比度提示。
- [final-mode-matched-deep.png](final-mode-matched-deep.png)：deep chip + 仅 `mode · 已完成` 命令行，无 user 气泡。

**评审实测补充**（临时目录，未写入仓库）：
- 1440x900：chip 72.0x28；权限触发器 126.0x28；菜单 194x106；选项 3x32；键盘 ArrowDown/Tab 结果；外部点击/Escape/resize 关闭；390x844 菜单 x=112/y=667/194x106，均在视口内。
- 标准模式会话（同一 profile；`session-eaa47571…` 的 header/投影为 `agentPreset: standard`）：system prompt 含 `## R&D Workflow` + `Mode: standard.`，skills 列表含 9 个 `rd-workflow*`；另一新建标准模式会话的命令菜单含 `mode`（P1-1 的直接证据）。
- 跨客户端会话 `session-bea11…`：第二客户端 chip 显示 `标准`；下一轮 system prompt `Mode: light.`（P1-2 的直接证据）。
- 新空白研发流程会话：首轮前 chip；切 deep 后 `command/run`/`command/done`；下一轮 `Mode: deep.`；无 user 气泡。

**命令**（本机执行，全部通过）：

```text
npm test           # 12 tests pass; E2E gate: 3 packs pass, 4 scores present, hashes verified
npm run check      # cordis.patch.yml parsed as YAML; packaging checks passed
DSH_BIN=… npm run test:smoke   # smoke: PASS（安装/组合/preset 默认/卸载）
```

注意：上述测试不执行 `client.js`；它们不能作为 chip/menu/状态隔离的证据。

## 保留

保留三件事：**(1)** 静悄悄、与左侧权限选择器同高同字重的透明 chip（这是当前方向最识别度的地方，不要因为修菜单变成显眼的卡片）；**(2)** 切换只留 `mode · 已完成` 命令行、不注入 user 气泡的克制做法；**(3)** 菜单用 `shell.overlay` 而不是塞回 composer 的修复方向——它已经在已有对话中被证明不裁剪。

## 最小修复条件（REVISE → PASS）

1. 修 P1-1：标准 preset 会话 system prompt、skill 列表、command 菜单零污染；研发流程会话仍恰好一份 section + 9 skills + `/mode`；加入集成断言。
2. 修 P1-2：chip 从 host 当前状态派生；跨客户端/刷新/重启后显示值与下一轮 `Mode:` 一致；加入跨客户端 E2E。
3. 修 P2-1（184×box）、P2-2（键盘焦点/导航/回焦）；P2-3 补客户端 E2E 并在 `npm test` 中执行。
4. 重新截菜单（184 宽）与键盘路径，更新 `MODE-SELECTOR.md` 的 184 描述；复跑 `npm test` / `npm run check` / `npm run test:smoke`。

**最终判定：REVISE — 62/100。** 视觉方向成立，核心鼠标交互成立；但“全局 row 隔离”和“mode 状态权威”两项 P1 未过 PASS 门槛。

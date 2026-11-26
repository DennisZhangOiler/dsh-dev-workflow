# 独立文档评审：dsh-rd-workflow 文档重构

- 评审者：独立文档评审员（未参与写作，只读代码/文档）
- 评审日期：2026-11-26
- 评审范围：`README.md`、`README.en.md`、`AGENT.md`，以及它们引用的 `CHANGELOG.md`、`docs/PUBLISHING.md`、`docs/VERIFICATION.md`、`docs/RELEASE-0.9.1.md`、`docs/RELEASE-0.9.0.md`、`docs/RELEASE-0.8.0.md`、`docs/TEST-PLAN.md`、`docs/QUALITY-GATE.md`、`docs/project-conventions.md`、`locale/*.json`、`package.json`、`client-package/package.json`、`cordis.patch.yml`、`test/check.mjs`、`README.zh.md`。
- 结论：**REVISE**

## 1. 分数与门槛

| 维度 | 权重 | 得分 | 简评 |
|---|---:|---:|---|
| 布局 / UI | 30 | **26** | 入口、目录、标题层级、表格和快速开始都清楚，中英结构基本对齐；但遗留第三份人类文档、文档索引不完整、选择器位置/截图有轻微偏差 |
| 功能覆盖 | 35 | **32** | 三种工作流程、三档强度、四种安装方式（含 npm 安装澄清）、选择/验证、Agent Teams、项目文档、兼容性、卸载、开发验证都覆盖；发布/维护文档覆盖失真 |
| 信息准确性 | 35 | **22** | 包名、依赖、版本、测试命令、外部链接和本地链接大多准确；但存在 2 个 P1：已发布 `0.9.1` 产物与当前文档树不一致、`docs/PUBLISHING.md` 自相矛盾 |
| **总分** | **100** | **80** | 数值达到 80 门槛，但准确性有 2 个 P1，按 PASS 条件结论仍为 **REVISE** |

PASS 条件核对：

- 总分 >= 80：**是（80）**。
- 布局/功能覆盖/准确性均无 P0/P1：**否（准确性有 2 个 P1）**。
- 因此：**REVISE**，必须先完成第 3 节的最小修复条件，再复审。

## 2. 验证证据（本次实际执行）

### 2.1 仓库检查

```sh
npm test          # 12 tests, 12 pass; E2E gate: 3 packs pass, 4 scores present, hashes verified
npm run check     # packaging checks passed; cordis.patch.yml parsed as YAML
npm pack --dry-run  # 44 files (评审前), includes AGENT.md; packages docs/*.md and screenshots
DSH_BIN=/home/dennis/.npm/_npx/b86ed90107c62dab/node_modules/.bin/dsh npm run test:smoke
                  # smoke: packing → disposable web profile → install → remove → PASS
```

结果：全部通过。README/AGENT 中关于 `npm test`、`npm run check`、`npm run test:smoke` 的描述与本地行为一致。

### 2.2 registry 与发布产物

```sh
npm view @denniszhangoiler/dsh-rd-workflow dist-tags versions --json
# latest: 0.9.1; versions: 0.0.0-stage, 0.9.0, 0.9.1

npm view @denniszhangoiler/dsh-rd-workflow time --json
# 0.9.1 published: 2026-11-26T01:21:22Z

npm view @denniszhangoiler/dsh-rd-workflow-client versions --json
# 0.9.0 (client package exists)

npm pack @denniszhangoiler/dsh-rd-workflow@0.9.1
# 44 files; includes docs/MODES.md, docs/AGENT-TEAMS.md, docs/README.md;
# does NOT include AGENT.md; README.md inside the tarball is the previous version
```

GitHub Release `v0.9.1` 通过 API 存在，资源文件名为
`denniszhangoiler-dsh-rd-workflow-0.9.1.tgz`，大小 **956,343 B**，与 npm 已发布的
0.9.1 tarball 大小完全一致；评审前当前工作树重新 `npm pack` 得到的是 **1,061,394 B**，
且包含 `AGENT.md`。`git rev-parse v0.9.1^{}` 指向 HEAD `a4437a0`（旧文档版本），
当前 README/AGENT 改动尚未提交。详见 P1-1。

### 2.3 链接检查

- `README.md`、`README.en.md`、`AGENT.md`、`CHANGELOG.md`、`docs/PUBLISHING.md`、`docs/VERIFICATION.md` 和三个 release notes 的本地链接与锚点：**全部存在且锚点可解析**。
- 外部链接：`https://github.com/deepseek-ai/deepseek-harness`（200）、
  `.../packages/team/agent-team`（200）、npm 包页面/registry、GitHub Release
  `v0.9.1` 及 tarball 资源（200）。
- 删除的 `docs/MODES.md`、`docs/AGENT-TEAMS.md`、`docs/README.md`：当前 README/AGENT
  已不再链接它们，未发现非历史断链；`CHANGELOG.md:13-14` 仍以纯文本提到这些文件（见 P2-3）。
- `docs/e2e/` 目录存在，README 的历史证据引用有效。
- GitHub Packages 的“已发布”声明无法在未认证环境验证，本次不作为扣分项；但发布文档应明确该验证条件。

## 3. P1（必须修复才能 PASS）

### P1-1 已发布的 0.9.1 产物与当前文档树不一致，install target 指向旧文档

**位置：**

- `package.json:3`：`version: 0.9.1`
- `README.md:37, 43, 51-53, 71, 78-81, 87`：所有安装 target 都是 `@...@0.9.1`
- `README.en.md:37, 43, 49-51, 68, 73-76, 82`：同上
- `README.md:12`、`README.md:229`、`AGENT.md:1-3`：声称 `AGENT.md` 是唯一 agent 文档
- `docs/RELEASE-0.9.1.md:8, 11`、`CHANGELOG.md:11-16`：0.9.1 发布说明/变更记录
- `git status`：`AGENT.md` 和两张 `docs/screenshot-mode-*.png` 仍未跟踪；`docs/MODES.md`、`docs/AGENT-TEAMS.md`、`docs/README.md` 已删除

**事实：**

1. npm 上 `0.9.1` 已于 2026-11-26T01:21:22Z 发布；其 44 个文件包含
   `docs/MODES.md`、`docs/AGENT-TEAMS.md`、`docs/README.md`，**不包含 `AGENT.md`**。
2. GitHub Release `v0.9.1` 的 tarball 大小与 npm 已发布 tarball 一致（956,343 B），
   也是旧文档包；tag 指向 HEAD `a4437a0`。
3. 当前工作树的新文档（`AGENT.md`、重写的 README、删除三份旧文档、新增两张截图）
   尚未提交，也没有版本号变化；评审前本地重新打包为 1,061,394 B 且包含 `AGENT.md`。
4. 因此用户执行 README 的安装命令会得到旧文档包：看不到 `AGENT.md`，README 仍是旧版，
   与 `README.md:12`、`README.md:229` 的“唯一 agent 文档”承诺不一致。
5. `docs/RELEASE-0.9.1.md` 被改成“新增中文文档索引 README.md 的文档结构一节”，
   但已发布的 0.9.1 实际是 `docs/README.md`；没有新的 `0.9.2` release note/CHANGELOG
   条目来描述本次文档重构。

**严重度：P1**（安装目标、包内容、唯一 agent 文档承诺三者同时失真，用户按文档操作得到错误内容）。

**最小修复条件（二选一）：**

- **发布新版本：** 将 `package.json` 版本提升到下一个版本（如 `0.9.2`），同步更新两个 README、
  `docs/RELEASE-*.md`、`CHANGELOG.md`、`docs/PUBLISHING.md` 中所有版本引用；提交
  `AGENT.md` 与两张截图；重新打包并发布 npm/GitHub Packages，创建对应 tag/Release，
  确认安装目标的 tarball 包含 `AGENT.md` 和新 README。
- **暂不发布：** 明确标记当前文档为“未发布/下一版”，把 README 安装 target 恢复为
  已发布且内容一致的版本，并移除“安装 0.9.1 即可获得 AGENT.md”的表述；待发布时再做版本与产物更新。

### P1-2 `docs/PUBLISHING.md` 同时声称“已发布”和“未发布”，且多处仍是 0.8.0

**位置：**

- `docs/PUBLISHING.md:3-6`：中文导读仍写 **0.9.0** 已发布
- `docs/PUBLISHING.md:21-30`：Current status 写 **0.9.1**、npm 与 GitHub Packages 均已发布
- `docs/PUBLISHING.md:68`：包名写成 `dsh-rd-workflow`，并称“npm name is available”
- `docs/PUBLISHING.md:100-108`：标题仍为 “Publish an npm package (optional, scoped)”，正文称 “Optional for this release”
- `docs/PUBLISHING.md:120-121`：打 tag 示例仍是 `v0.8.0`
- `docs/PUBLISHING.md:168`：marketplace index 示例版本仍是 `0.8.0`
- `docs/PUBLISHING.md:227-231`：写 “No npm publication has been performed; the name is available”、
  “the `v0.8.0` GitHub Release/tarball exist”
- 引用位置：`README.md:284`、`AGENT.md:128` 把该文档当作当前发布指南

**事实：** 同一文档第 21-30 行与第 68、100-108、227-231 行直接矛盾。维护者按“Before publishing”
或“Not done”执行会得到错误结论（包名错误、版本错误、把已发布状态当作未发布）。这不是历史文档，
没有 historical 标记。

**严重度：P1**（当前维护/发布指南自相矛盾，属于可执行命令与状态的事实错误）。

**最小修复条件：**

1. 以第 21-30 行为当前事实，重写第 227-231 行为真实状态（0.9.1 已发布 npm/GitHub Packages；
   marketplace index 未提供）。
2. 把第 3-6 行更新为当前主版本；把第 68 行包名改为
   `@denniszhangoiler/dsh-rd-workflow`，删除“name is available”。
3. 将第 100-108 行改为面向下一版本的发布步骤（不要称当前发布可选）。
4. 把第 120-121、168 行的 `v0.8.0`/`0.8.0` 更新为当前版本，或明确标注为 0.8.0 历史示例。
5. 在文档顶部加“当前状态”与“历史示例”的边界，避免再次混用。

## 4. P2（不单独构成门槛失败，但应在同一轮修掉）

1. **`README.zh.md` 仍是第三份人类文档，且不在文档结构表中。**
   `package.json:24` 将其列入 `files`，`test/check.mjs:41` 要求它必须存在；
   但 `README.md:224-229` 只写 README.md / README.en.md 两类人类文档。它本身是重定向，
   不提供错误信息，但违反“命名统一、人类文档中英两份”的要求。
   最小修复：删除该文件并同步移除 `package.json`/`test/check.mjs` 引用；或明确保留为
   “legacy redirect”并在文档结构表中列出。

2. **`README.md`/`README.en.md` 的“文档结构/维护文档”索引不完整。**
   `README.md:231-237`（英文 `README.en.md:226-232`）只列 CHANGELOG、PUBLISHING、
   VERIFICATION、e2e、RELEASE-0.9.1/0.9.0；实际还有 `docs/RELEASE-0.8.0.md`、
   `docs/TEST-PLAN.md`、`docs/QUALITY-GATE.md`、`docs/project-conventions.md`、
   `docs/DETAIL.md`、`docs/DETAIL.zh.md` 和旧截图。读者无法从“文档结构”完整定位维护文档。
   最小修复：补全列表，或改为“完整索引见 `docs/`”并给出 `docs/` 的入口说明。

3. **发布说明/变更记录与当前文档树不一致。**
   `docs/RELEASE-0.9.1.md:8` 改成“新增中文文档索引 README.md 的文档结构一节”，但已发布 0.9.1
   实际有 `docs/README.md`；`CHANGELOG.md:11-16` 仍写新增 `docs/README.md` 和
   `docs/AGENT-TEAMS.md`，而当前树已删除这两个文件。当前树没有新的 CHANGELOG/release note
   描述“单一 AGENT.md、删除 MODES/AGENT-TEAMS/docs/README、README 重写”。
   最小修复：不要改写已发布版本的 release note；在版本升级时新增 `0.9.2`（或实际版本）
   的 release note + CHANGELOG 条目，列明本次文档重构。

4. **`docs/VERIFICATION.md` 已标 historical，但正文仍有“Current”状态。**
   第 184-190 行标题为 “Current profile and release status”，仍写 “Released version: 0.8.0”、
   “npm: not published”；第 180-182 行也仍是 0.8.0 状态。虽然标题已标注 historical，
   内部“Current”会误导读者。
   最小修复：把第 8 节改名为“Status at v0.8.0”，或删除“Current”措辞并注明这是历史快照。

5. **`docs/TEST-PLAN.md` 未标历史/版本，且仍用旧称谓。**
   `docs/TEST-PLAN.md:77` “A5. Program mode”、`docs/TEST-PLAN.md:101`
   “technical research” 与当前“项目编排流程 / 调研流程”命名不一致；文件没有版本或
   historical 标记，README 也未列出它。
   最小修复：在标题下注明适用版本/历史状态；将 A5 改名为“Program orchestration / 项目编排”，
   A7 改为“Research / 调研流程”。

6. **`locale/zh.json:4` 的 bundle 描述已过期。**
   仍写“开发与代码库调研双流程”，但当前是开发/调研/项目编排三条工作流程；
   `locale/en.json:4` 的 “technical-research” 也是旧称谓。该描述会显示在插件详情/卡片上。
   最小修复：中文改为“开发 / 调研 / 项目编排三流程”（或等价表述），英文统一为
   Development / Research / Program orchestration，并同步 `docs/PUBLISHING.md:158-161` 的示例描述。

7. **未跟踪文件未纳入版本控制（发布前检查项）。**
   `git status` 显示 `AGENT.md`、`docs/screenshot-mode-menu.png`、
   `docs/screenshot-mode-selector.png` 为新文件。README 直接引用它们；如果遗漏提交，
   仓库读者的链接会断，且“单一 agent 文档”不存在。
   最小修复：在发布/提交时加入这三个文件，并确认 `npm pack` 包含它们。

## 5. P3（打磨项，不影响 PASS/REVISE 结论）

1. **选择器位置与截图。** `README.md:8, 98, 109` 写“输入框左侧”，实际 chip 位于 composer
   底部工具行（与权限选择器同一行）；`docs/screenshot-mode-selector.png` 是 1440×900 整页图，
   选择器很小，读者不易定位。建议改为“composer 工具行/底部”，并把第一张图裁到 selector 附近。
2. **英文文档中的中文 UI 字样。** `README.en.md:106` 写 ``mode · 已完成``；英文 UI 下该行可能
   本地化。建议写成 “`mode` completion row” 或注明中英标签。
3. **目录遗漏。** 两个 README 的 TOC 未列“相关链接/Links”和“License”，虽然是小节。
4. **英文工作流命名。** `README.en.md:114` 表格用 “Program”，标题/AGENT 用
   “Program orchestration”；建议表内统一为 “Program orchestration”。
5. **DETAIL 命名约定与 README 相反。** README 是 `README.md`（中）/`README.en.md`（英），
   而 `docs/DETAIL.md` 是英文、`docs/DETAIL.zh.md` 是中文；建议统一或在文档结构里说明。
6. **`cordis.patch.yml:22` 仍称“流程强度”**，README 用“强度”，实际 chip 只显示“标准”；
   建议统一 UI 名称（“流程”或“强度”），避免选择器称呼漂移。
7. **第 2 步没有预设菜单截图。** 有强度选择器截图，但没有“在预设菜单选择研发流程”的截图；
   若保留截图作为验证证据，建议补一张或删掉“截图位置”暗示。
8. **`docs/RELEASE-0.8.0.md` 未标注 historical**（按版本号本身可推断），且未出现在
   README 索引；可与 P2-2 一并处理。
9. **agent-facing 技能描述仍用旧称谓。** `skills/rd-workflow-program.md:1,7` 仍写
   “Program mode playbook / Program mode is a layer...”，`index.js:75` 仍写
   “Program-mode playbook”。这不是 README/AGENT 的人类文档，但属于本次“命名统一”的
   残留旧称谓（历史文档除外）；建议改为 “Program orchestration / 项目编排流程”，
   以免 agent 在 skill 中看到与 AGENT 不一致的名称。

## 6. 各维度评审说明

### 6.1 布局 / UI（26/30）

通过项：

- 入口清晰：标题、语言切换、一句话定位、要点列表。
- 目录完整覆盖主要 H2；中文/英文章节顺序一致（快速开始 → 概念 → 三流程 → Agent Teams →
  使用/文档结构 → 不做什么 → 兼容性 → 卸载 → 开发验证）。
- 标题层级合理；安装方式用 H4，步骤用有序列表；表格/代码块可扫描；快速开始有编号步骤。
- 截图放在“选择预设并验证”之后，位置合理；中文和英文使用同一组截图。
- `AGENT.md` 是唯一 agent 操作文档（英文），与 README 的声明一致。
- 无“Deep playbook / 技术调研模式 / Program mode”等旧称谓出现在 README/AGENT（历史
  CHANGELOG 除外）；删除的 MODES/AGENT-TEAMS 没有留下非历史断链。

扣分项：

- `README.zh.md` 作为第三份人类文档存在并被测试/打包要求（P2-1）。
- 文档结构索引不完整，维护文档不可完整发现（P2-2）。
- 选择器“输入框左侧”与截图实际位置有偏差；首张截图未裁剪（P3-1）。
- TOC 漏“相关链接/License”；英文 Program 命名不统一（P3-3/4）。

### 6.2 功能覆盖（32/35）

通过项：

- 三种工作流程：开发流程 / 调研流程 / 项目编排流程（中）与 Development / Research /
  Program orchestration（英/AGENT）均有独立章节和表格。
- 三档强度：轻量 / 标准 / 深度（Light / Standard / Deep），默认标准，选择依据、契约/评审/
  UI/调研/交付差异齐全。
- 安装方式完整覆盖：npm public、GitHub Packages、GitHub Release tarball、Git tag/local；
  并专门解释 `npm install` 不会注册 DSH 插件，这是本次文档最关键的改进之一。
- 选择与验证：选择预设、确认强度、普通任务验证、已有会话菜单、切换记录都有。
- Agent Teams：关系表、默认建议（Light/Standard 关闭，Deep/Program/并行开启）、至少三个
  不重叠工作项、任务板作为唯一来源、Team 成员不等于独立 reviewer、complete 不等于验收。
- 项目文档、兼容性/限制、卸载、开发验证（npm test/check/smoke）均有。
- 运行命令全部通过；安装/卸载 smoke 通过。
- 发布说明入口存在（RELEASE-0.9.1/0.9.0、PUBLISHING），但内容过期/矛盾（P1-2、P2-3）。

扣分项：

- 发布/维护内容没有达到与主 README 同等可信度：PUBLISHING 自相矛盾，release note 与
  CHANGELOG 和当前树不一致（-2）。
- 文档索引不完整使维护/历史文档难以发现（-1）。

### 6.3 信息准确性（22/35）

通过项（逐项核对）：

- `package.json:2-4`：包名 `@denniszhangoiler/dsh-rd-workflow`、版本 `0.9.1`、MIT 正确。
- `package.json:40-43`：`node >=22`、`dsh >=0.2.2-rc.5 <0.3.0` 与 README 兼容性一致。
- `package.json` 依赖 `@denniszhangoiler/dsh-rd-workflow-client: 0.9.0`；client package
  版本 0.9.0，npm 上存在。
- `cordis.patch.yml`：preset `id: dev-workflow`、`name: 研发流程`、`order: 5`、无默认预设、
  maxDepth 等与文档描述一致；npm/CLI/preset 名称一致。
- 测试命令与描述一致：`npm test`（12 tests + E2E gate）、`npm run check`、`npm run test:smoke`。
- 卸载命令 `plugin_manager remove_bundle` / `dsh plugin remove` 可执行；smoke 验证无残留。
- 本地链接/锚点全部通过；外部 GitHub/npm/Release 链接有效；Release tarball 资源名与 URL 一致。
- README/AGENT 中未发现旧称谓“Deep playbook / 技术调研模式 / Program mode”（历史 CHANGELOG 例外）。
- `docs/VERIFICATION.md` 标题已标 historical（但正文有 P2-4 问题）。

扣分项：

- P1-1 版本/install target/已发布产物与当前文档树不一致（-4）。
- P1-2 PUBLISHING 当前状态自相矛盾（-4）。
- P2-3 release note/CHANGELOG 与当前树不一致（-2）。
- P2-4 VERIFICATION 历史文档内部仍写“Current/0.8.0/npm 未发布”（-1）。
- P2-5 TEST-PLAN 未标历史且用旧称谓（-1）。
- P2-6 locale 中文描述“双流程”过期（-1）。

小计：35 - 4 - 4 - 2 - 1 - 1 - 1 = **22**。

## 7. 最小修复顺序（建议）

1. **先解决 P1-1**：决定发布新版本还是暂不发布；同步版本号、安装 target、CHANGELOG、
   release notes、PACKAGE 内容和提交新文件。完成后重新验证 `npm pack` 中包含 `AGENT.md`。
2. **再解决 P1-2**：重写 `docs/PUBLISHING.md` 的 Current status / Before publishing /
   Not done / Git tag / index 示例，使同一文档只有一个当前事实版本。
3. 修 P2-1~P2-6：README.zh.md、文档索引、0.9.2 release note、VERIFICATION 历史状态、
   TEST-PLAN 命名、locale 描述。
4. 补 P3 打磨项；至少完成选择器位置/截图、英文 `已完成`、TOC、Program 命名统一。
5. 重新运行 `npm test`、`npm run check`、`npm pack --dry-run`、`npm run test:smoke`；
   重新检查 README/AGENT 本地链接；确认 Git 包含 `AGENT.md` 和两张截图。
6. 注意：本评审文件位于 `docs/DOC-REVIEW.md`，会被 `package.json` 的 `docs/*.md`
   打包规则收进 npm tarball（加入后 `npm pack --dry-run` 从 44 变为 45 files）。
   如果发布包不应包含评审记录，请在发布前排除该文件或调整 `files`。

## 8. 复审结论

- 总分：**80/100**（布局 26，功能覆盖 32，准确性 22）。
- 结论：**REVISE**。
- 必须修复：**P1-1、P1-2**；建议同轮修复 P2-1~P2-6 和 P3 中与命名/截图相关项。
- 修复后应达到：总分 >= 80 且三个维度均无 P0/P1；届时可复审 PASS。

> 说明：本次评审只新增本文件，未修改 README、AGENT、代码或测试；GitHub Packages 的
> “已发布”状态因未认证无法独立验证，已在第 2.3 节说明，未作为扣分依据。

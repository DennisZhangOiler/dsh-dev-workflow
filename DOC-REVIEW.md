# 独立文档复审：dsh-rd-workflow 0.9.2 文档重构

- 评审者：独立文档评审员（未参与写作；只读代码/文档/registry）
- 复审日期：2026-11-26
- 评审对象：`README.md`、`README.en.md`、`AGENT.md`，以及它们引用的 `CHANGELOG.md`、`docs/PUBLISHING.md`、`docs/VERIFICATION.md`、`docs/RELEASE-0.9.2.md`、`docs/RELEASE-0.9.1.md`、`docs/RELEASE-0.9.0.md`、`docs/RELEASE-0.8.0.md`、`docs/TEST-PLAN.md`、`docs/QUALITY-GATE.md`、`docs/project-conventions.md`、`locale/*.json`、`package.json`、`client-package/package.json`、`cordis.patch.yml`、`test/check.mjs`、`test/plugin.test.mjs`
- 结论：**REVISE**

## 1. 结论与分数

| 维度 | 权重 | 得分 | 简评 |
|---|---:|---:|---|
| 布局 / UI | 30 | **25** | 入口、目录、标题层级、表格、快速开始、中英结构和单一 AGENT.md 都成立；但首张截图是空白图、目录顺序与实际章节不一致、选择器位置措辞仍有冲突 |
| 功能覆盖 | 35 | **33** | 三流程、三强度、四种安装方式（含 npm 安装澄清）、选择/验证、Agent Teams、项目文档、兼容性、卸载、开发验证全部覆盖；发布/历史文档仍有小范围失真 |
| 信息准确性 | 35 | **24** | 版本、install target、包内容、registry、Release、链接大体准确；但 `npm test` 实际失败 2 项，另有 PUBLISHING/VERIFICATION/README.en 的版本与状态错误 |
| **总分** | **100** | **82** | 数值达到 80 门槛，但准确性存在 P1（`npm test` 失败且验证声明与事实不符），因此 **REVISE** |

PASS 条件核对：

- 总分 >= 80：**是（82）**。
- 布局/功能覆盖/准确性均无 P0/P1：**否（准确性有 1 个 P1）**。
- 因此：**REVISE**；修复 P1 并重跑测试后再复审。

## 2. 独立验证证据

### 2.1 发布与包内容（本轮已修复上一轮 P1-1）

- npm 公共 registry：`latest = 0.9.2`，0.9.2 发布于 `2026-11-26T01:53:10Z`，tarball 大小 **1,022,344 B**。
- 公共 npm tarball 共 **45 files**，包含 `AGENT.md`、新版 `README.md`、`README.en.md`、`docs/RELEASE-0.9.2.md` 和两张 `docs/screenshot-mode-*.png`；**不含 `README.zh.md`**。
- GitHub Release `v0.9.2` 存在，asset `denniszhangoiler-dsh-rd-workflow-0.9.2.tgz` 大小同为 **1,022,344 B**；tag `v0.9.2` 指向 `e02136f`，与当前 HEAD 一致。
- 客户端包 `@denniszhangoiler/dsh-rd-workflow-client@0.9.0` 存在；`package.json` 的依赖为 `0.9.0`，与主包 0.9.2 不同版本但可解析。
- `package.json` 版本为 `0.9.2`；README/README.en 中四种安装 target 均改为 `0.9.2`。上一轮“安装 0.9.1 得到旧文档”的 P1 已解决。

### 2.2 测试与打包（本轮发现 P1）

```text
npm test          # 12 tests, 10 pass, 2 fail  ← 失败
npm run check     # packaging checks passed
DSH_BIN=... npm run test:smoke  # smoke: PASS
npm pack --dry-run (current working tree)  # 44 files
```

两个失败：

1. `test/plugin.test.mjs:87-88`：`rd-workflow-program is 7810 chars`，测试对该 skill 的上限是 7800；
   `skills/rd-workflow-program.md` 实际为 7826 bytes。改名 `Program mode` → `Program orchestration`
   后长度超限。
2. `test/plugin.test.mjs:126`：仍断言 `bodies['rd-workflow-program']` 匹配 `/Program mode/`，
   但 `skills/rd-workflow-program.md:1` 已改为 `# Program orchestration playbook`，断言失配。

`docs/RELEASE-0.9.2.md:34` 把 `npm test` 列入 Verification；`README.md:280-288`、
`docs/PUBLISHING.md:98-103` 也把 `npm test` 作为发布前/开发验证命令。实际 red 测试使
“0.9.2 验证通过”的文档声明不成立。这是本轮唯一 P1。

### 2.3 链接检查

- README、README.en、AGENT、CHANGELOG、docs/PUBLISHING、docs/VERIFICATION、docs/TEST-PLAN
  和三个 release notes 的本地链接/锚点：**0 broken**。
- 外部 GitHub/npm/Release/Agent Teams 链接：200（GitHub API 与 npm registry）。
- 删除的 `README.zh.md`、`docs/README.md`、`docs/MODES.md`、`docs/AGENT-TEAMS.md`：当前 README/AGENT
  已不再链接，未发现非历史断链；`CHANGELOG.md` 仅作为历史条目提到 `docs/README.md`/`docs/AGENT-TEAMS.md`，可接受。
- GitHub Packages 的“已发布”状态在未认证环境无法独立验证；本文不作为扣分项。

## 3. P1（必须修复才能 PASS）

### P1-1 `npm test` 失败，与 0.9.2 的验证声明矛盾

**位置：**

- 失败测试：`test/plugin.test.mjs:87-88`、`test/plugin.test.mjs:126`
- 触发内容：`skills/rd-workflow-program.md:1`（标题已改）及全文字符数
- 验证声明：`docs/RELEASE-0.9.2.md:34`、`README.md:280-288`、`docs/PUBLISHING.md:98-103`

**证据：**

- `npm test` 输出 `12 tests, 10 pass, 2 fail`。
- 失败 1：`rd-workflow-program is 7810 chars`，超过该 skill 的 7800 字符测试上限。
- 失败 2：测试仍要求 `/Program mode/`，而 skill 现在是 `Program orchestration`。
- `npm run check` 与 smoke 通过，但不抵消 unit test 失败。

**严重度：P1**（发布验证声明与仓库实际测试状态直接矛盾；任何“npm test 通过”的文档表述当前都不可信）。

**最小修复条件：**

1. 将 `test/plugin.test.mjs:126` 的断言更新为当前名称（例如 `/Program orchestration/`；如要兼容历史，
   可用同时接受两种名称的表达式，但必须与 skill 当前内容一致）。
2. 将 `skills/rd-workflow-program.md` 缩到测试上限以内（当前至少需要减少 10 个字符），
   或先核实 DSH 的 skill 预算后再调整上限；不能只改测试而不解释预算变化。
3. 重跑 `npm test`，必须恢复 **12/12 pass**；重跑 `npm run check` 与 smoke。
4. 由于 0.9.2 已发布，修复已发布产物的 blank screenshot / stale review 等内容需要新版本（如 0.9.3）；
   如果只修 test 与 skill 而不改包内文档，可在 0.9.2 上单独发布测试修复说明，但 release note 不得继续声称
   `npm test` 已通过。

## 4. P2（不阻塞，但建议本轮或下一版修掉）

1. **`docs/screenshot-mode-selector.png` 是纯白空白图。**
   文件为 1300×190 PNG，唯一颜色为白色（PIL `unique_colors=1`，extrema 全 255）；README.md:103 和
   README.en.md:98 却把它作为“强度选择器”的截图；发布的 0.9.2 tarball 中也包含这张空白图。
   修复：换成真实的 composer 底部工具行裁剪图；不要用纯白占位。

2. **`README.en.md:75` 链接文字仍写 `v0.9.1`，URL 却是 `v0.9.2`。**
   `Download from [v0.9.1](https://github.com/.../releases/tag/v0.9.2)`；用户会看到错误版本号。
   修复：链接文字改为 `v0.9.2`。

3. **`docs/PUBLISHING.md:22` 写“主包依赖同版本的客户端包”，与事实不符。**
   主包是 `0.9.2`，依赖固定为客户端 `0.9.0`（`package.json:62-63`）；同文档 `:8` 也写客户端 0.9.0。
   修复：改为“主包依赖固定的客户端 0.9.0；客户端未变时不需要重新发布”。

4. **`docs/VERIFICATION.md:3-4` 仍写“Current release: v0.9.1”，链接到 `docs/RELEASE-0.9.1.md`。**
   当前版本是 0.9.2；该文件虽是 historical 快照，但顶部的“Current”指针已过期。
   修复：改为 `v0.9.2` 并指向 `docs/RELEASE-0.9.2.md`，或改为“截至 0.8.0 验证时的当前版本为 0.8.0”。

5. **已发布 0.9.2 tarball 包含旧的 `docs/DOC-REVIEW.md`（上一轮 REVISE 80 分的评审），
   但当前工作树已删除它且尚未提交；README 的文档结构也未列出它。**
   公开 npm 的 45 个文件中包含 `package/docs/DOC-REVIEW.md`；当前工作树打包为 44 files。
   修复：提交 `docs/DOC-REVIEW.md` 的删除（或把它移到不随包发布的路径），下一版不要把它打入 tarball；
   发布前用 `npm pack --dry-run` 核对。

6. **`docs/RELEASE-0.9.2.md:35-36` 写“Independent documentation review after this rewrite: pass threshold >=80,
   layout/coverage/accuracy checked”。**
   本轮复审实际结论为 REVISE（P1 测试失败）；在该版本发布说明里预称评审达阈值不准确。
   修复：P1 修复并复审通过后再写评审结论/分数；发布说明不应先于评审声称通过。

7. **文档结构缺少证据子目录。**
   README.md:235-243 列了 `docs/e2e/`，但未列 `docs/fixtures/`、`docs/calibration-inputs/`、
   `docs/calibration-blind/`；这些也是维护/历史证据。
   修复：补列，或把“e2e/证据”合并为一条并说明完整树见 `docs/`。

## 5. P3（打磨项）

1. **README 目录顺序与实际章节顺序不一致。**
   README.md:25-26（README.en.md:25-26）把“相关链接/Links、License”放在“它不做什么/What it does not do”
   之前，但正文的“相关链接/License”在最后。修复：按正文顺序重排 TOC。
2. **选择器位置措辞仍冲突。**
   README.md:8/214 说“composer 底部工具行”；README.md:100 仍写“输入框左侧”，README.md:111 写“composer 左侧”。
   修复：统一为“composer 底部工具行”。
3. **README.en.md:108 重复词。**
   “Switching adds only a small `mode` completion row command row” → 去掉一个 `command row`。
4. **旧称谓残留（非标题）。**
   AGENT.md:31 “technical research”、index.js:59/67 “technical research”、
   skills/rd-workflow-project-docs.md:16 “technical research questions”仍是旧英文措辞；如果只要求不作为标题，
   可保留，但若“命名统一”是硬要求，建议统一为 Research。
5. **`cordis.patch.yml` 的维护注释仍说“replace these two strings with the English copy in README.md”，
   但 README.md 现在是中文，英文在 README.en.md。** 修复：改注释目标文件。
6. **`docs/RELEASE-0.9.2.md:35` 的“pass threshold >=80”与 `npm test` 失败并列，读起来像已通过。**
   按 P2-6 一并改写。

## 6. 各维度评审

### 6.1 布局 / UI（25/30）

通过：

- 入口、语言切换、一句话定位、快速开始（安装 A–D + 选择验证 + 切换）完整。
- 中英 README 章节一一对应；目录、表格、代码块、编号步骤清楚。
- 单一 `AGENT.md` 英文操作文档；`README.zh.md`/docs 旧副本已删除。
- 两张截图位置合理（选择器 + 已有会话菜单）；`docs/RELEASE-0.9.2`、CHANGELOG、PUBLISHING 位置正确。
- 文档结构补全了顶层维护/发布/历史 md 文件。

扣分：

- 首张截图纯白空白（-2）；目录顺序错位（-1）；选择器位置措辞冲突（-1）；
  发布包包含未列入文档结构的旧 `docs/DOC-REVIEW.md`（-1）。
- README.en 的重复词算在准确性/文字瑕疵，不重复扣。

### 6.2 功能覆盖（33/35）

通过：

- 三种工作流程：开发 / 调研 / 项目编排（Development / Research / Program orchestration）。
- 三档强度：轻量 / 标准 / 深度（Light / Standard / Deep），默认标准；各档的契约、评审、UI/调研、
  交付差异完整。
- 安装方式：npm public、GitHub Packages、GitHub Release tarball、Git tag/local；`npm install` 只装包
  不注册 DSH 插件的说明清楚。
- 选择与验证、已有会话菜单、切换记录、Agent Teams 关系与默认建议、项目文档、兼容性/限制、
  卸载、开发验证（npm test/check/smoke）、发布说明入口均覆盖。
- 版本 0.9.2、install target、包内容、Release asset 已验证一致（上一轮 P1-1 已解决）。
- `npm run check` 与 smoke 通过；链接检查 0 broken。

扣分：

- 发布/历史文档仍有小范围状态失真（-1：VERIFICATION 的 Current 仍指 0.9.1、PUBLISHING 的客户端版本表述）。
- 维护/证据目录未完全列入文档结构（-1：fixtures/calibration 子目录）。

### 6.3 信息准确性（24/35）

通过：

- `package.json`：包名、版本 0.9.2、MIT、engines、依赖 client 0.9.0、files 列表准确。
- npm 公共 registry：0.9.2 latest、发布/ tarball 时间；GitHub Release v0.9.2 asset 同名同大小；
  tag 指向 e02136f；四个安装 target 都指向 0.9.2。
- 公开 tarball 45 files，含 AGENT/新版 README/RELEASE-0.9.2/两张截图，不含 README.zh；与承诺一致。
- 测试命令、check 命令、smoke 命令描述与实际一致；smoke PASS；check PASS。
- README/AGENT 本地链接和锚点全部有效；外部链接有效。
- 当前文档未把 “Deep playbook/技术调研模式/Program mode” 作为标题；历史 RELEASE-0.8.0 中的旧称谓属历史文档，
  可接受。
- `docs/VERIFICATION.md` 已标 historical；`docs/TEST-PLAN.md` 已标 historical 且 A5 改为
  “Program orchestration / 项目编排”。

扣分：

- P1-1 `npm test` 10/12 fail，与 release note/README/PUBLISHING 的验证声明矛盾（-5）。
- P2-3 PUBLISHING “same-version client”错误（-2）。
- P2-4 VERIFICATION 的 Current 仍指 0.9.1（-1）。
- P2-2 README.en v0.9.1 链接文字（-1）。
- P2-6 release note 预称评审达阈值（-1）。
- P2-5 发布包包含旧 `docs/DOC-REVIEW.md`（-1）。
- 小计：35 - 5 - 2 - 1 - 1 - 1 - 1 = **24**。

## 7. 最小修复顺序（建议）

1. **修 P1-1**：更新 `test/plugin.test.mjs:126` 的名称断言；把 `skills/rd-workflow-program.md`
   缩至 7800 字符以内（或按 DSH 预算调整）；重跑 `npm test` 到 12/12，再跑 check/smoke。
2. 替换空白 `docs/screenshot-mode-selector.png` 为真实裁剪图；确认 README 两版显示正常。
3. 修 `README.en.md:75` 的 `v0.9.1` 文字；重排两个 README 的 TOC；统一“composer 底部工具行”措辞；
   去掉 `completion row command row` 重复。
4. 修 `docs/PUBLISHING.md:22` 的客户端版本表述；修 `docs/VERIFICATION.md:3-4` 的 Current 指针；
   补列 fixtures/calibration 子目录；修 `cordis.patch.yml` 的 README.en 注释。
5. 删除/移出已发布 0.9.2 tarball 中的旧 `docs/DOC-REVIEW.md`（提交当前工作树的删除；下一版包不得包含）；
   如果还要发布新包，使用新版本号（0.9.3）并重新验证 tarball。
6. 所有修复完成后，更新 `docs/RELEASE-*.md` 的验证结果；评审通过后再写“independent review passed/score”。
   重跑 `npm test`、`npm run check`、`npm run test:smoke`、`npm pack --dry-run`，核对包内文件与 README 结构一致。

## 8. 复审结论

- 总分：**82/100**（布局 25，功能覆盖 33，准确性 24）。
- 结论：**REVISE**。
- 必须修复：**P1-1（npm test 失败/验证声明失真）**。
- P2/P3 可列但不阻塞；其中空白截图、PUBLISHING 版本表述、VERIFICATION 当前版本、发布包旧评审文件
  建议在下一版一并修掉。
- 修复 P1 并复审通过后，可 PASS；届时需重新核对 `npm test` 12/12 和 0.9.x tarball 内容。

> 说明：本次评审只新增仓库根 `DOC-REVIEW.md`，未修改 README、AGENT、代码、测试或 docs/；GitHub Packages
> 发布状态无法在未认证环境独立验证，已在 2.3 节说明。公开发布产物中的 `docs/DOC-REVIEW.md` 是上一轮
> 评审文件，当前工作树已删除但尚未提交；本节仅记录事实，不修改该文件。

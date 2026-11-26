# 独立文档复审：dsh-rd-workflow 0.9.3 文档重构

- 评审者：独立文档评审员（未参与写作；只读代码/文档/registry）
- 复审日期：2026-11-26
- 评审对象：`README.md`、`README.en.md`、`AGENT.md`，以及它们引用的 `CHANGELOG.md`、`docs/PUBLISHING.md`、`docs/VERIFICATION.md`、`docs/RELEASE-0.9.3.md`、`docs/RELEASE-0.9.2.md`、`docs/RELEASE-0.9.1.md`、`docs/RELEASE-0.9.0.md`、`docs/RELEASE-0.8.0.md`、`docs/TEST-PLAN.md`、`docs/QUALITY-GATE.md`、`docs/project-conventions.md`、`locale/*.json`、`package.json`、`client-package/package.json`、`cordis.patch.yml`、`test/check.mjs`、`test/plugin.test.mjs`
- 结论：**PASS**

## 1. 结论与分数

| 维度 | 权重 | 得分 | 简评 |
|---|---:|---:|---|
| 布局 / UI | 30 | **28** | 入口、目录、标题层级、表格、快速开始、中英结构、单一 AGENT.md 和两张有效截图都成立；目录顺序与选择器位置措辞仍有小瑕疵 |
| 功能覆盖 | 35 | **34** | 三流程、三强度、四种安装方式（含 npm 安装澄清）、选择/验证、Agent Teams、项目文档、兼容性、卸载、开发验证、发布/历史边界全部覆盖 |
| 信息准确性 | 35 | **32** | 0.9.3 版本、install target、45-file tarball、GitHub Release、tag、测试/check/smoke 全部核对一致；剩余问题仅为发布文档缺少 `npm pack` 生成 asset 步骤及少量命名/措辞残留 |
| **总分** | **100** | **94** | 总分 >= 80，且无 P0/P1；P2/P3 可作为打磨项，不阻塞 PASS |

PASS 条件核对：

- 总分 >= 80：**是（94）**。
- 布局/功能覆盖/准确性均无 P0/P1：**是**。
- 因此：**PASS**。

## 2. 独立验证证据

### 2.1 测试与打包

```text
npm test          # 12 tests, 12 pass; E2E gate: 3 packs pass, 4 scores present, hashes verified
npm run check     # packaging checks passed; cordis.patch.yml parsed as YAML
DSH_BIN=... npm run test:smoke  # smoke: packing → disposable web profile → install → remove → PASS
npm pack --dry-run             # 45 files
```

上一轮 P1 已解决：`npm test` 从 10/12 恢复为 **12/12**；`rd-workflow-program`
断言已改为 `Program orchestration`，skill 长度已降至测试上限以内（测试通过）。

### 2.2 registry、tarball、Release

- npm 公共 registry：`latest = 0.9.3`，发布于 `2026-11-26T01:58:43Z`；tarball 大小
  **1,039,513 B**，共 **45 files**。
- 公开 npm tarball 包含 `AGENT.md`、新版 `README.md`、`README.en.md`、
  `docs/RELEASE-0.9.3.md`、两张 `docs/screenshot-mode-*.png`；**不含 `README.zh.md`，也不含旧的
  `docs/DOC-REVIEW.md`**。
- GitHub Release `v0.9.3` 存在，asset `denniszhangoiler-dsh-rd-workflow-0.9.3.tgz` 大小同为
  **1,039,513 B**；tag `v0.9.3` 指向 `6588bac`，与当前 HEAD 一致。
- `npm pack --dry-run` 当前工作树为 45 files，与已发布 tarball 文件数一致；README 中四种安装 target
  均指向 `0.9.3`，client 依赖保持 `0.9.0`。
- `docs/screenshot-mode-selector.png` 已验证为非白图：1300×160，1322 unique colors，实际显示
  composer 底部工具行中的“标准”chip；`docs/screenshot-mode-menu.png` 也为有效截图。

### 2.3 链接检查

- README、README.en、AGENT、CHANGELOG、docs/PUBLISHING、docs/VERIFICATION、docs/TEST-PLAN
  和 release notes 的本地链接/锚点：**0 broken**。
- 外部 GitHub/npm/Release/Agent Teams 链接：200（GitHub API 与 npm registry）。
- 删除的 `README.zh.md`、`docs/README.md`、`docs/MODES.md`、`docs/AGENT-TEAMS.md`：当前
  README/AGENT 已不再链接；历史 CHANGELOG 仅以文本提及，未形成非历史断链。
- GitHub Packages 的“已发布”状态在未认证环境无法独立验证；本文不将其作为扣分项。

## 3. P2（不阻塞 PASS，建议下一轮修掉）

### P2-1 `docs/PUBLISHING.md` 的 GitHub Release 命令缺少生成 asset 的步骤

**位置：** `docs/PUBLISHING.md:114-125`

```sh
gh release create v0.9.3 \
  denniszhangoiler-dsh-rd-workflow-0.9.3.tgz \
  --notes-file docs/RELEASE-0.9.3.md
```

文档没有先说明如何生成这个本地 tarball（`npm pack` / `npm pack --pack-destination .`）。
维护者从干净 checkout 按命令执行时，`gh release create` 可能因文件不存在而失败；当前 0.9.3
的 Release asset 已存在，但发布指南应补齐该步骤。

**最小修复：** 在命令前增加 `npm pack --pack-destination .`（或等价命令），并在“发布前检查”中说明
asset 文件名必须与 `package.json` 版本一致。

## 4. P3（打磨项，不阻塞 PASS）

1. **README 目录顺序与实际章节顺序不一致。**
   `README.md:25-27`（`README.en.md:25-27`）把“相关链接/Links、License”列在
   “它不做什么/What it does not do”之前，但正文中这两节位于最后。建议按正文顺序重排 TOC。

2. **选择器位置措辞仍有一处冲突。**
   `README.md:8`/`:100` 已写“composer 底部工具行”，但 `README.md:111` 仍写“composer 左侧”。
   建议统一为“composer 底部工具行”。

3. **英文 README 有重复词。**
   `README.en.md:108`：“a small `mode` completion row command row”多了一个 `command row`。
   建议改为 “a small `mode` completion row”。

4. **中文 README 里混入英文短语。**
   `README.md:113`：“`mode` completion row 记录”；可统一为中文“`mode` 完成记录”，与中文正文一致。

5. **文档结构未列出证据子目录。**
   `README.md:235-243`（`README.en.md:230-238`）列了 `docs/e2e/`，但未列
   `docs/fixtures/`、`docs/calibration-inputs/`、`docs/calibration-blind/`。
   如果“补全所有维护/历史文档”是硬性承诺，建议补列或改为“完整证据树见 `docs/`”。
   另外 `docs/e2e/` 不随 npm tarball 发布（package `files` 只覆盖 `docs/*.md` 与截图），
   在 npm 页面点击该相对链接会落到未随包发布的内容；可在文档中注明“仅仓库内”。

6. **旧英文措辞仍为描述性文字。**
   `AGENT.md:31` 的 “technical research”、`index.js:59/67` 的 “technical research”、
   `skills/rd-workflow-project-docs.md:16` 的 “technical research questions” 仍保留旧英文称谓。
   它们已不作为标题，但若“命名统一”是硬要求，建议统一为 Research / 调研流程。

7. **`cordis.patch.yml` 维护注释仍指向错误文件。**
   `cordis.patch.yml:19-20` 说 “replace these two strings with the English copy in README.md”，
   但 `README.md` 现在是中文，英文在 `README.en.md`。建议改注释目标。

## 5. 维度评审

### 5.1 布局 / UI（28/30）

通过：

- 入口、语言切换、一句话定位、要点列表和快速开始完整；安装 A–D、选择验证、切换步骤齐全。
- 中英 README 章节一一对应；标题层级、表格、代码块、编号步骤清晰；TOC 覆盖主要章节。
- 单一 `AGENT.md` 英文操作文档；`README.zh.md`、`docs/README.md`、`docs/MODES.md`、
  `docs/AGENT-TEAMS.md` 已删除，文档结构补齐顶层维护/发布/历史文件。
- 两张截图均可读：选择器截图显示 composer 底部工具行（标准 chip）与权限选择器；菜单截图显示
  轻量/标准/深度菜单。
- 版本 0.9.3 的发布说明、CHANGELOG、PUBLISHING、VERIFICATION 入口位置正确。

扣分：

- TOC 顺序问题（P3-1，-1）。
- 选择器位置“composer 左侧”与正文“composer 底部工具行”冲突（P3-2，-1）。

### 5.2 功能覆盖（34/35）

通过：

- 三种工作流程：开发 / 调研 / 项目编排（Development / Research / Program orchestration）。
- 三档强度：轻量 / 标准 / 深度（Light / Standard / Deep），默认标准；各档契约、评审、UI/调研、
  交付差异完整。
- 安装方式：npm public、GitHub Packages、GitHub Release tarball、Git tag/local；`npm install`
  只装包不注册 DSH 插件的说明明确。
- 选择与验证、已有会话菜单、切换记录、Agent Teams 关系与默认建议、项目文档、兼容性/限制、
  卸载、开发验证、发布说明入口均已覆盖。
- 0.9.3 的 npm/GitHub Release/tag/45-file tarball 均已验证；`npm test`、`npm run check`、
  smoke 全部通过。
- README/AGENT 本地链接与锚点 0 broken。

扣分：

- 文档结构未列证据子目录，且 `docs/e2e/` 不随 npm 包发布（P3-5，-1）。

### 5.3 信息准确性（32/35）

通过：

- `package.json`：包名、版本 `0.9.3`、MIT、engines、依赖 client `0.9.0`、files 列表准确。
- npm 公共 registry 0.9.3 latest、发布时间、tarball 1,039,513 B、45 files；tarball 含
  `AGENT.md`/新版 README/RELEASE-0.9.3/截图，不含 `README.zh.md` 与旧 `docs/DOC-REVIEW.md`。
- GitHub Release v0.9.3 asset 同名同大小；tag `v0.9.3` = `6588bac` = HEAD。
- `npm test` 12/12；`npm run check` PASS；smoke PASS；`npm pack --dry-run` 45 files。
- README/AGENT 本地与外部链接有效；0.9.3 发布说明、CHANGELOG、PUBLISHING、VERIFICATION 的版本
  指针一致（VERIFICATION 顶部已指 0.9.3）。
- 命名：强度模式=轻量/标准/深度；工作流程=开发/调研/项目编排；当前文档不再把
  “Deep playbook/技术调研模式/Program mode”作为标题；旧称谓只出现在历史文档或描述性文字中。
- 截图真实有效，不再有空白图。

扣分：

- PUBLISHING 的 Release 命令缺少 `npm pack` 生成 asset 的步骤（P2-1，-2）。
- 旧英文措辞 “technical research” 仍散见于 AGENT/index/skills（P3-6，-0.5）。
- 英文重复词与中文混用（P3-3/P3-4，-0.5）。
- 合计：35 - 2 - 0.5 - 0.5 = **32**。

## 6. 最小修复建议（可选，不阻塞 PASS）

1. `docs/PUBLISHING.md` 在 `gh release create` 前补 `npm pack --pack-destination .`，并说明
   asset 名与版本一致。
2. README 中英 TOC 按正文顺序重排；`README.md:111` 改为 “composer 底部工具行”；
   `README.en.md:108` 去掉重复 `command row`；`README.md:113` 统一中文措辞。
3. 文档结构补列 `docs/fixtures/`、`docs/calibration-inputs/`、`docs/calibration-blind/`，
   并注明 `docs/e2e/` 仅仓库内；或改为“完整证据树见 `docs/`”。
4. `AGENT.md`/`index.js`/`skills/rd-workflow-project-docs.md` 的 “technical research”
   按命名规则统一为 Research/调研流程；`cordis.patch.yml:19-20` 注释改为 `README.en.md`。

## 7. 复审结论

- 总分：**94/100**（布局 28，功能覆盖 34，准确性 32）。
- 结论：**PASS**（总分 >= 80，无 P0/P1）。
- 上一轮 P1（`npm test` 失败、验证声明失真）已确认修复；上一轮 P2（空白截图、
  README.en v0.9.1 文字、PUBLISHING 客户端版本、VERIFICATION 当前版本、旧 DOC-REVIEW 入包）
  已确认修复。
- 剩余 P2/P3 为发布命令完整性与文字打磨，不影响 PASS；建议下一版顺手修掉。

> 说明：本次评审只更新仓库根 `DOC-REVIEW.md`，未修改 README、AGENT、代码、测试或 docs/；
> GitHub Packages 的发布状态因未认证无法独立验证，已在 2.3 节注明，未作为扣分项。

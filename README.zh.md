# dsh-rd-workflow

[English](README.md) | [中文](README.zh.md)

一个**非默认**的 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)
智能体预设。为新会话选择 **研发流程**（R&D Workflow）后，只需要描述要调研或修改什么；
Agent 会路由到技术调研、开发或大型项目编排流程，不需要每次粘贴长 Prompt。

安装这个 bundle 只新增预设：**不会**修改 profile 的默认预设，不会注册
Host 级的全局行，也不会影响使用 Standard 或其他预设的会话。

![新会话预设菜单中的研发流程](docs/screenshot-preset.png)

## 它做什么

第一条规则是 **每轮请求路由**：把当前消息分为问答、bugfix/微调、新功能/重构、调研或
Program。目标变了就明确说出来，重新进入契约或调研 brief，而不是继续上一轮 bugfix。

![新功能请求重新进入 Phase 0/1，而不是继续 bugfix 循环](docs/screenshot-reentry.png)

## 它做什么

流程规则写在 system prompt section 中，因此不依赖聊天历史，也不会在上下文压缩后
丢失。

| 阶段 | 结果 |
|---|---|
| 0. 项目理解 | 按顺序读 `AGENTS.md`、`docs/DEV_WORKFLOW.md`、`docs/DELIVERY.md`、`README.md` 及其他文档；确认命令、交付方式、目录结构和 UI 界面所在位置 |
| 1. 需求、契约与分级 | 确认问题、目标、范围、非目标；把改动分为 **UI design**、**UI behavior** 或 **No UI**；只写该分级需要的契约字段 |
| 2. UI 方向探索 | **仅 UI design：**三套结构不同的方向，每套有真实桌面和移动截图（小改动可减少方向） |
| 3. 独立 UI 评分 | **仅 UI design：**由独立子智能体按项目 rubric 或内置通用 rubric 百分制评分；门禁为 >=85、无 P0/P1、移动端无横向溢出 |
| 4. 用户确认 | UI design 给方向/截图/代价；UI behavior 给变化的状态；No UI 给功能改动清单 |
| 5. 开发 | 同一功能智能体负责改动；有 UI 时同时负责 UI 和功能；测试智能体只写测试 |
| 6. 独立测试 | No UI 只测功能/CLI/API；UI behavior 加变化的状态；UI design 加视口/视觉/可访问性；都测真实 API/mutation 和带 marker 的清理 |
| 7. 独立验收 | 只读 verifier 检查 diff 越界、官方测试、真实数据/权限/边界和夹具残留；仅 UI design 重评 UI；输出 PASS/REJECT |
| 8. 用户预览验收 | 给出预览方式/测试数据/验收清单；No UI 可用命令、样例请求或输出样例；内部 PASS 不等于用户验收 |
| 9. 交付 | 严格按项目文档执行；不假设一定有 MR/PR/CI/自动部署 |

### 技术调研模式

非平凡的技术/代码库调研、架构或依赖对比、可行性分析、根因分析走
**实验优先**的调研流程。文章、官方文档和上游 benchmark 只用来产生假设；最终证据必须
来自在本项目或代表性 sandbox 中的实测。

| 阶段 | 结果 |
|---|---|
| R0 上下文 | 读文档/代码；确定决策、当前 baseline、指标、约束、时间盒和输出位置 |
| R1 方向 | 提出**尽量多的真正不同方向**（不固定 2-3 个），用户选择要跑哪些；确认前不搭建 |
| R2 计划 + 计划评审 | baseline/候选方案、workload、指标、运行/方差、阈值、停止条件、保留物；**独立评审**打分，>=85 且无 P0/P1 才允许开始 demo |
| R3 小 demo | 在 sandbox 中做小 demo 与 baseline 同条件对比；检查语义一致性，记录命令/版本/数据；失败也保留；不改生产代码 |
| R4 测量 | 正确性、性能与方差、成本、失败模式；观察和解释分开；不挑数据 |
| R5 结果评审 | 全新 reviewer 审核过程（命令、数据、baseline 公平性、方差）和每条结论；明确 supported/partial/unsupported；不成立就补实验、降级或重写 |
| R6 决策 | 只包含已评审结论的备忘录，标 `measured-here` / `measured-sandbox` / `reported`；被否方向、置信度、开放问题、不能得出什么 |
| R7 交接 | 开发契约或 Program 输入；可选时间盒 pilot；真正的迁移/实现走开发流程，不算调研 |

**没有单独的迁移验证阶段**。实验必须使用代表性项目切片或副本，在测量过程中就验证
适配性；真要迁移，走正常开发流程。

标准强度 = 用户选定方向、通过实验计划评审、每个可行方向至少一个实测 demo、结果评审。
深度调研会增加 demo/运行次数、矩阵和敏感性分析。

评审意见必须明确：严重级别、位置、证据、为什么影响结论、要求的动作、通过条件。
没有 finding 的分数、“建议优化”“看起来不错”这类反馈都算无效评审。只有通过评审的
结论才能给用户看。

这一版覆盖技术/代码库调研；外部市场调研和用户调研不在范围内。

![research/ 下的小 demo、语义检查和测量](docs/screenshot-research.png)

### 大型项目：Program mode

新建系统、多模块产品，或架构/信息架构重构时，主 Agent 变成全局编排者，而不是自己
把所有事做完：

1. **架构优先。** 梳理用户、核心流程、模块、边界、接口、数据归属、非目标和待定
   决策；先不要写模块代码，架构确认后再继续。
2. **UI 方向选择。** 按项目文档的 UI 规则；文档规定了几版就出几版；没有规定且是
   大改动时，先问一次要几版（建议三版），等用户选择，不能自己确认。
3. **静态前端 demo。** 用 mock 数据做纯前端 demo，按用户反馈迭代，然后冻结 token、
   组件、页面、状态和响应式规则。
4. **模块计划。** 拆成完整的垂直模块，写清接口、拥有的路径、共享文件规则、依赖、
   验收标准和测试。
5. **模块 Agent。** 用 `subagent` 派模块负责人；每个模块负责人按本插件的流程执行。
   已冻结的 UI 不再重做；遗漏的重要 UI 细节由子智能体重新走 UI 设计/评分流程。
   模块负责人还可以派自己的 UI、功能、测试和验收子智能体（根节点下最多 3 层）。
6. **集成。** 只读集成 verifier 检查跨模块契约、共享文件、migration、权限和夹具残留；
   然后用户预览，最后按项目文档交付。

Program lead 是唯一对用户说话的入口；模块负责人把证据汇总回来。共享文件有唯一
owner，串行修改；独立模块可以并行。完整规则见 `rd-workflow-program` skill。

### 约定学一次，后面照着做

Agent 会先读项目里的约定文档。如果缺少它需要的规则（UI 方向数量、静态 demo、
交付方式、测试命令等），它会先从代码和需求推断，然后**一次性**问清需要用户决定
的缺口（带推荐默认值），再把答案写进项目文档：优先更新已有文件，没有就写
`docs/DEV_WORKFLOW.md`、`docs/UI.md`、`docs/DELIVERY.md` 或 `docs/RESEARCH.md`。
后续会话读文档，不再重复问。

所以你不需要每次都说“给我出三版 UI”或“本地交付”。说一次（或者让 Agent 问一次），
规则就沉淀到项目里了。

### UI 影响按每次改动判断

Phase 1 判断的是这次改动，而不是项目类型：

- **UI design**：新增或明显改变信息层级、布局、交互模式或 UI 界面。走 Phase 2-3
  和独立 UI 评分。
- **UI behavior**：用户可见的行为、文案或状态变化，但没有新的设计方向。跳过
  Phase 2-3；保留 UI 功能检查和预览，但不做设计评分。
- **No UI**：库、CLI、后端、基础设施、数据、构建或文档改动。跳过所有 UI 阶段
  和 UI 评分；测试只覆盖功能/CLI/API。

今天的纯 CLI 项目，在“新增 GUI”这次改动里可以判为 **UI design**；已有 UI 的项目，
后端-only 改动也可以判为 **No UI**。分级会写进 Phase 1 契约，出现新界面时可以
重新分级。

项目文档按自然语言处理。如果项目没有写交付方式，改动默认只保留在本地，并且
只问用户一次希望如何交付。凭据不会写入项目文档。远程或破坏性操作执行前必须
获得用户确认。

## 安装

### 从 GitHub 安装

npm 名 `dsh-rd-workflow` 目前可用，但这个版本还没有发布到 npm；**不要尝试安装不存在的 npm 版本**，
请从本仓库安装：

```text
plugin_manager action=install_bundle target=git+https://github.com/DennisZhangOiler/dsh-rd-workflow.git
```

需要可复现的发布版本时，固定完整 commit SHA：

```text
plugin_manager action=install_bundle target=git+https://github.com/DennisZhangOiler/dsh-rd-workflow.git#<完整 40 位 commit>
```

安装后新建会话，打开预设菜单，选择 **研发流程**。安装不会修改默认预设，也不影响
其他会话。

如果 `plugin_manager` 报 `github.com` 连接超时，改用下面的 CLI Git 安装（没有 5 秒
探测），或安装 release tarball。当前 release 是 `v0.7.0`；CLI 命令已在本仓库验证。preset 更新也可能返回
`restart-required`。

### 安装前备份

先备份 profile，保证可回滚：

```sh
PROFILE_DIR="$DSH_HOME/profiles/<profile>"
cp -a "$PROFILE_DIR" "$PROFILE_DIR.backup-$(date +%Y%m%d-%H%M%S)"
```

### 通过 DSH Web UI

1. 打开 **Plugins**。
2. 选择 **Add plugin** 并选中本地 `dsh-rd-workflow` checkout；GitHub 源请用上面的
   `plugin_manager` 命令安装。
3. 保持 bundle 启用。它只新增预设，不会自动选中。
4. 新建会话，打开预设菜单，选择 **研发流程**。

### 通过 `plugin_manager` 工具

```text
plugin_manager action=install_bundle target=/绝对路径/dsh-rd-workflow
# 或已打包的 release tarball：
plugin_manager action=install_bundle target=/绝对路径/dsh-rd-workflow-0.7.0.tgz
```

target 是包含 `package.json` 和 `cordis.patch.yml` 的 bundle 目录，或打包好的
release tarball。安装会执行包管理和 bundle 选择，不需要手工改 profile。安装
bundle 代码需要 Full access 或审批。preset 变更可能会返回
`restart-required`；重启一次 DSH，再新建会话。

### 命令行替代方式

如果从终端管理 profile，CLI 使用同样的包选择和 patch 校验，重启后生效：

```sh
# GitHub 源
dsh plugin --profile <profile> add git+https://github.com/DennisZhangOiler/dsh-rd-workflow.git
# 或本地 checkout
dsh plugin --profile <profile> add /绝对路径/dsh-rd-workflow
# 重启后按下面步骤验证；卸载：
dsh plugin --profile <profile> remove dsh-rd-workflow
```

### 验证预设

```sh
dsh --profile <profile> --dump-config | grep -A3 preset-rd-workflow
dsh --profile <profile> --dump-config | grep -A2 agent-preset-registry
```

第二条应仍显示原来的默认值（例如 `default: standard`）。新会话的预设列表中
应能看到 **研发流程**（R&D Workflow）。

## 使用

选择该预设后直接描述需求：

```text
设置页还是旧表格。改成可筛选的卡片列表，沿用现有设计系统，移动端也要能用。
```

之后由预设的契约 section 驱动完整流程。也可以按名称加载配套 skill：
`rd-workflow`、`rd-workflow-project-docs`、`rd-workflow-ui-rubric`、
`rd-workflow-roles`。

### 建议的项目文档

没有这些文档也能用，但有的话效果更好：

- `AGENTS.md`：命令、边界、允许修改的路径、风格规则。
- `docs/DEV_WORKFLOW.md`：开发、评审、测试流程。
- `docs/DELIVERY.md`：改动如何到达用户（分支、MR/PR、CI、部署、手动发布、
  仅补丁）。
- `README.md`：安装和常用命令。

示例见 `rd-workflow-project-docs` skill 和
[`docs/project-conventions.md`](docs/project-conventions.md)。示例不是固定
字段 schema。

## 已验证

在 DSH `0.2.2-rc.5` 的临时 profile 中验证了：启动、预设可见、system prompt 注入、subagent/workflow 调用、标准会话不受影响、卸载无残留。详细证据和未验证项见
[`docs/VERIFICATION.md`](docs/VERIFICATION.md)。

## 要求与兼容性

- DSH `>=0.2.2-rc.5 <0.3.0`（见 `engines.dsh`）。
- Node.js 22 或更高（DSH 要求）。
- profile 需要提供该预设挂载的 Host 服务：system prompt、skills、tools、
  plan mode、subagent、workflow。官方 Web profile 满足；headless/SDK/ACP
  profile 不加载 Web preset registry，不支持此 bundle。
- 本插件不新增凭据、网络服务或数据库。

## 它不做什么

- 不会把 **研发流程** 设为默认预设。
- DSH 0.2.2-rc.5 的 `presetDisplayText` 只翻译内置 preset；自定义 preset 的名称/描述是静态字符串。本 bundle 的菜单文案使用中文（**研发流程**）以匹配 zh-CN 系统；bundle 卡片和详情页通过 `locale/*.json` 本地化。若要英文菜单，请在安装前替换 `cordis.patch.yml` 中的这两个字符串；仅切换 DSH 界面语言不会重新翻译它们。
- 不做 sandbox 级的角色隔离；角色和写作用域由 prompt 与父 Agent 的检查保证。
  如果未来的 DSH 版本提供子智能体工具限制，应接入。
- 不安装项目 skill、设计系统、浏览器或测试框架；使用项目和会话已有的能力。
- 不承诺插件市场中心化上架。当前索引格式见
  [`docs/PUBLISHING.md`](docs/PUBLISHING.md)。

## 开发

```sh
npm test          # 插件、prompt、skill 契约测试
npm run check     # 包清单、locale、详情页、patch 检查
npm run test:smoke # 临时 profile：装 tarball、检查预设、卸载
```

`test:smoke` 需要 `dsh` 和 `pnpm` 在 `PATH` 中；CLI 不在 PATH 时设置 `DSH_BIN`。
它会创建临时 `DSH_HOME`，不使用凭据，结束后自动清理。

这些检查不需要安装依赖，Node 22 即可。`npm run check` 在环境有
`python3` + PyYAML 时会校验 YAML，否则会说明跳过。

```text
index.js                 Host 侧预设插件：注册 prompt section + skills
prompt.md                system prompt section 源文
cordis.patch.yml         @deepseek-ai/dsh-agent-preset 声明
skills/                  通过 skill 工具按需加载的 playbook
locale/en.json|zh.json   bundle 卡片元数据
docs/DETAIL*.md          bundle 详情文档（一张预览图）
docs/preview.svg         详情页配图
icon.svg                 插件图标
test/                    单元、打包与临时 profile smoke 测试
```

## 卸载

在 **Plugins** 中移除 **dsh-rd-workflow** bundle，或：

```text
plugin_manager action=remove_bundle target=dsh-rd-workflow
```

移除后预设和 prompt section 一并消失。已经在运行的会话会保留启动时的预设
组合，直到被替换。安装和卸载都不会修改项目文件。

## 许可证

MIT，见 [LICENSE](LICENSE)。

# 与 DSH 智能体团队（Agent Teams）的关系

**结论：不冲突，也不重复，属于不同层。**

Agent Teams 解决“谁来做、任务如何分派和跟踪”；研发流程预设解决“按什么步骤做、什么算完成”。两者可以同时开启，也可以分别使用。

## 1. Agent Teams 是什么

DSH 的 Agent Teams 是**平台层协作机制**，不是另一个模型或另一个流程：

- 根 Session 通过“使用智能体团队”开关启用，子代理树共享一个持久化任务板。
- 提供 `team_task_create/get/list/update` 四个任务工具，以及任务归属、依赖、revision CAS、`write_scopes` 重叠提示。
- 成员仍使用标准 `subagent`、`send_message`、`list_agents`、`wait_agent` 等子代理工具；Team 不创建独立成员体系。
- Team 默认关闭；根 Session 的选择对整棵子代理树生效。
- Team 不提供合同、独立评审、UI 评分、E2E、研究结论或发布门禁。

## 2. 这个插件是什么

`dsh-rd-workflow` 是**预设层工作流策略**：

- 一个 **研发流程** 预设，默认标准；composer 的“流程强度”在轻量/标准/深度间切换。
- 根据风险决定是否写契约、是否派独立 reviewer、UI 是否评分、调研是否做独立 plan/results review、Program 如何分模块。
- 只改变 agent 的指令和流程，不创建团队运行时，也不维护自己的任务板。
- 复用 DSH 的 `subagent`/`workflow` 派活；没有 Team 时也能工作。

## 3. 同时开启时怎么配合

| 场景 | 推荐做法 |
|---|---|
| 多模块 / 并行开发 | 用 Team 任务板做工作项、所有者、依赖和写范围的唯一来源；Program 模块与任务 ID 对应 |
| 独立评审 | Team 成员可以承担 reviewer，但仍要求新上下文/不同模型；不要把“成员”当“独立” |
| 任务完成 | 任务 `complete` 只代表工作项完成；仍按插件的 AC/测试/UI/交付门禁验收 |
| 小任务 | Light/Standard 通常不需要开 Team；直接按模式流程做即可 |
| 没有 Team | 插件用普通 subagent/workflow 完成委派和独立评审，不受影响 |

**避免重复：**

- 不要在插件里再建一套任务板或第二份 checklist；Team 任务板就是任务来源。
- 不要用 Team 的任务完成替代测试、UI 评分或用户验收。
- 不要同时维护“插件 reviewer 列表”和“Team 成员列表”两套所有权；以 Team 的 owner 为准，插件只记录评审结论。

## 4. 什么时候开 Team 会更好

**不是默认更好。** Team 只解决协作和跟踪，不自动提高单个任务的正确性；开之前先看工作能不能真正拆开。

### 值得开

- 有 **3 个以上**可以并行推进、写范围基本不重叠的模块/任务。
- 大型 Program、跨模块契约、需要长期跟踪依赖和 owner。
- 调研需要并行跑多个独立 spike，或高风险工作要同时做实现、测试、审计、文档。
- 需要 durable 任务板，让多个 agent 在重启/长任务后仍知道谁负责什么。

### 通常不值得开

- 单文件/单功能改动、Light 任务、需求还没拆清。
- 多个任务会改同一批文件；这时并行只会增加冲突和合并成本。
- 只需要一次独立 review：直接 `subagent` 更轻，没必要开任务板。
- 任务本身是强顺序依赖（A 改完 B 才能开始）。

### 开了以后产出更好的前提

1. 每个任务有明确接口、验收标准和**不重叠的写范围**。
2. 有一个 integration owner 负责合并、契约测试和最终验收。
3. reviewer 仍使用新上下文/不同模型，不能因为“在 Team 里”就自己批准自己。
4. 用 Team 任务板而不是再加一套插件任务清单；任务完成不等于交付验收。

如果这四条不成立，开 Team 往往只是增加 token、延迟和协调成本，产出不一定更好。

## 5. 为什么会觉得“有点像”

两者都会用到子代理，所以表面上有交集：

- Team 提供**协作基础设施**：任务、成员、消息、所有权。
- 插件提供**质量过程**：AC/DoD、风险分级、评审独立性、UI/研究/Program 的验收标准。

用一句话记：**Team 管“协作”，研发流程管“标准”。**

## 6. 相关文档

- [DSH Agent Teams 包说明（英文）](https://github.com/deepseek-ai/deepseek-harness/tree/main/packages/team/agent-team)
- [三档模式](MODES.md)
- [开发流程](../README.md#开发流程deep-playbook)
- [返回文档索引](README.md)

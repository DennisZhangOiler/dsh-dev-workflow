# dsh-rd-workflow 0.9.2

文档结构重构版本。没有运行时、preset 或客户端 UI 行为变更。

## 中文摘要

- 人类文档只保留两份：中文 [`README.md`](../README.md) 和英文 [`README.en.md`](../README.en.md)。
- Agent 文档只有一份：[`AGENT.md`](../AGENT.md)（英文操作文档）。
- 删除重复的 `README.zh.md`、`docs/README.md`、`docs/MODES.md`、`docs/AGENT-TEAMS.md`；内容合并到 README / AGENT.md。
- 统一命名：
  - **强度模式**：轻量 / 标准 / 深度。
  - **工作流程**：开发 / 调研 / 项目编排。
  - 当前文档不再使用 "Deep playbook"、"技术调研模式"、"Program mode" 作为标题。
- 补全安装方式：npm public、GitHub Packages、GitHub Release tarball、Git tag、本地 checkout；明确 `npm install` 只把包装进当前目录，不会注册 DSH 插件。
- 明确 Agent Teams 关系与默认建议：Light/Standard 默认关闭；Deep Program、多模块并行、并行调研/审计再开。
- 补全维护文档索引、卸载、兼容性、开发验证和历史状态说明。

## Install

```text
plugin_manager action=install_bundle target=@denniszhangoiler/dsh-rd-workflow@0.9.2
```

客户端包保持 `0.9.0`，由主包依赖自动安装。

## Compatibility

- DSH `>=0.2.2-rc.5 <0.3.0`
- Node.js 22+
- Web profile with the documented Host services.

## Verification

- `npm test` / `npm run check` / `npm run test:smoke`.
- Independent documentation review after this rewrite: pass threshold >=80,
  layout/coverage/accuracy checked.
- No UI/functionality change; previous UI review remains PASS, 81/100, no P0/P1.

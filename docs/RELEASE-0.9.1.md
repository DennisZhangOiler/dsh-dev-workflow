# dsh-rd-workflow 0.9.1

> 本文件描述 0.9.1 发布时的文档状态；0.9.2 已将索引/模式/Agent Teams 内容合并到 README 与 AGENT.md。

文档补丁版本。没有运行时或 UI 行为变更。

## 中文摘要

- 默认文档改为中文：`README.md` 为中文入口，英文移到 `README.en.md`。
- 新增中文文档索引 `docs/README.md`。
- 新增 `docs/AGENT-TEAMS.md`，说明与 DSH 智能体团队（Agent Teams）的关系，并明确建议：
  **Light/Standard 默认不开 Team；Deep Program、多模块并行、并行调研/审计再开。**
- 主包 0.9.1；客户端包保持 0.9.0。

## Install

```text
plugin_manager action=install_bundle target=@denniszhangoiler/dsh-rd-workflow@0.9.1
```

GitHub Packages 需要先配置 scope 和认证；安装 target 相同。

## Compatibility

- DSH `>=0.2.2-rc.5 <0.3.0`
- Node.js 22+
- Web profile with the documented Host services.

## Verification

- `npm test` / `npm run check` / `npm run test:smoke`.
- Documentation-only change; existing UI/functionality review remains PASS,
  81/100, no P0/P1.

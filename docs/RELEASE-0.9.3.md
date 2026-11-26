# dsh-rd-workflow 0.9.3

文档复审修正版本。没有运行时、preset 或客户端 UI 行为变更。

## 中文摘要

- 修复 0.9.2 文档复审发现的 P1：
  - `rd-workflow-program` skill 超过 7,800 字符测试上限；
  - 测试仍断言旧称 "Program mode"。
- 修复发布文档：
  - composer 选择器截图改为有效裁剪图；
  - 英文 Release 链接文字改为 v0.9.3；
  - 发布指南明确主包 0.9.3 依赖客户端 0.9.0；
  - 验证记录历史状态改为 0.9.3。
- 移除已发布包中旧的内部 `docs/DOC-REVIEW.md`；最终评审记录保留在仓库根 `DOC-REVIEW.md`，不进入 npm 包。
- 统一命名：强度模式=轻量/标准/深度；工作流程=开发/调研/项目编排。

## Install

```text
plugin_manager action=install_bundle target=@denniszhangoiler/dsh-rd-workflow@0.9.3
```

客户端包保持 `0.9.0`，由主包依赖自动安装。

## Compatibility

- DSH `>=0.2.2-rc.5 <0.3.0`
- Node.js 22+
- Web profile with documented Host services.

## Verification

- `npm test`：12/12 + E2E gate
- `npm run check`
- `npm run test:smoke`
- 独立文档复审：见仓库根 `DOC-REVIEW.md`
- 既有 UI/功能评审：PASS，81/100，无 P0/P1

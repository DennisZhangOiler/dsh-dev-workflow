# 发布与 registry 指南

本文是维护者文档，描述当前 0.9.3 的发布方式和验证步骤。它不是用户安装入口；用户安装请看 [`README.md`](../README.md#快速开始)。

## 当前状态

- 主包：`@denniszhangoiler/dsh-rd-workflow@0.9.3`
- 客户端包：`@denniszhangoiler/dsh-rd-workflow-client@0.9.0`（本次无代码变化）
- npm 公共 registry：已发布
- GitHub Packages：已发布
- GitHub repo：<https://github.com/DennisZhangOiler/dsh-rd-workflow>
- GitHub Release：`v0.9.3`（发布后创建/更新）
- Marketplace index：暂未提供公共索引；GitHub/npm/GitHub Packages 是当前安装渠道

## 包结构

```text
@denniszhangoiler/dsh-rd-workflow         主包：preset Host + prompt + skills + bundle patch
@denniszhangoiler/dsh-rd-workflow-client  客户端包：composer 强度选择器
```

主包 0.9.3 依赖客户端 0.9.0；两个包必须同时存在，但本次客户端不变。

## 认证

### npm 公共 registry

```sh
npm login --registry=https://registry.npmjs.org
npm whoami --registry=https://registry.npmjs.org
```

本机 npm 的全局 registry 可能指向 cnpm/npmmirror；发布时**显式**使用上面两个命令的 registry，不要依赖全局配置。

### GitHub Packages

需要一个有 `write:packages` 的 token：

```sh
gh auth refresh -s write:packages
```

发布时使用临时 npmrc，不要把 token 写入仓库：

```sh
NPMRC=$(mktemp)
printf '//npm.pkg.github.com/:_authToken=%s\n' "$(gh auth token)" > "$NPMRC"
npm publish --userconfig "$NPMRC" --registry=https://npm.pkg.github.com --access public
rm -f "$NPMRC"
```

安装 GitHub Packages 包需要 `@denniszhangoiler:registry=https://npm.pkg.github.com` 和可读取 packages 的 token。

## 发布流程

### 1. 只改文档的主包补丁

客户端包不变时，只发布主包：

```sh
# npm 公共
npm publish --registry=https://registry.npmjs.org --access public

# GitHub Packages
NPMRC=$(mktemp)
printf '//npm.pkg.github.com/:_authToken=%s\n' "$(gh auth token)" > "$NPMRC"
npm publish --userconfig "$NPMRC" --registry=https://npm.pkg.github.com --access public
rm -f "$NPMRC"
```

### 2. 客户端包也变化时

先发布客户端，再发布主包：

```sh
cd client-package
npm publish --registry=https://registry.npmjs.org --access public
# GitHub Packages 同样用临时 npmrc
cd ..
npm publish --registry=https://registry.npmjs.org --access public
```

### 3. 验证发布

```sh
npm view @denniszhangoiler/dsh-rd-workflow version --registry=https://registry.npmjs.org
npm view @denniszhangoiler/dsh-rd-workflow-client version --registry=https://registry.npmjs.org
```

registry 的 tarball/CDN 传播可能需要几分钟；metadata 先出现、tarball 后出现是正常现象。以实际 `npm install`/`plugin_manager` 安装成功为准。

```text
plugin_manager action=install_bundle target=@denniszhangoiler/dsh-rd-workflow@0.9.3
```

## 发布前检查

```sh
npm test
npm run check
DSH_BIN=<dsh-bin> npm run test:smoke
npm pack --dry-run
```

检查：

- `package.json` 的 `version` 与 README/RELEASE 一致；
- 包内包含 `AGENT.md`、`README.md`、`README.en.md`、`docs/screenshot-*.png`；
- `cordis.patch.yml` 的 preset row 和 client row 指向正确的 scoped 包名；
- 没有 token、绝对 home 路径或机器专属配置；
- 临时 profile 安装后 preset 出现，且默认 preset 不变；
- 卸载后没有依赖、bundle、node_modules 或 lockfile 残留。

## Git tag / GitHub Release

版本号确定后：

```sh
git tag -a v0.9.3 -m "dsh-rd-workflow 0.9.3"
git push origin main
git push origin v0.9.3
gh release create v0.9.3 \
  denniszhangoiler-dsh-rd-workflow-0.9.3.tgz \
  --notes-file docs/RELEASE-0.9.3.md
```

安装 target 与 Release asset 必须对应同一个 commit/tarball。

## 历史

- **0.9.3**：文档复审修正、测试/命名/截图/发布说明修复；主包补丁；客户端保持 0.9.0。
- **0.9.1**：中文默认文档、单一 Agent 文档的上一版布局；npm/GitHub Packages 已发布。
- **0.9.0**：首次 scoped 包发布；主包 0.9.0，客户端 0.9.0。
- **0.8.0**：unscoped GitHub Release（历史安装名）；不再作为当前安装入口。

Marketplace 索引暂时没有公开服务；不要声称“已上架”或“已审核”。GitHub Release 不是 npm 包，二者是不同分发渠道。

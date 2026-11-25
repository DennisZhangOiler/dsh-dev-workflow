# dsh-rd-workflow 0.9.0

Registry-distribution release. The UI and workflow behavior are the same as
0.8.0; this release publishes the package to npm and GitHub Packages.

## 中文摘要

- 包名改为 scoped：`@denniszhangoiler/dsh-rd-workflow`。
- 客户端包改为 `@denniszhangoiler/dsh-rd-workflow-client`，独立发布；主包依赖同一版本。
- 同版本发布到 npm 公共 registry 和 GitHub Packages；preset 功能、`dev-workflow` id 和界面不变。
- **这是安装名变更**：0.8.0 的 unscoped 安装和 0.9.0 的 scoped 安装是两个包；升级时需要重新安装。

## What changed

- Scoped package names are required by GitHub Packages. The preset plugin row and
  the global client-only row now point at the scoped packages.
- The client-only UI package is published separately instead of being a local
  `file:` dependency, so both registries can resolve it normally.
- Added release scripts for npm public and GitHub Packages.
- The `dev-workflow` preset id remains unchanged for session compatibility.
- UI, mode switching, menu behavior, keyboard support, and known P2 limitations
  are unchanged from 0.8.0.

## Install

### npm public

```text
plugin_manager action=install_bundle target=@denniszhangoiler/dsh-rd-workflow@0.9.0
```

### GitHub Packages

Configure the scope and authenticate first (example; do not commit tokens):

```ini
@denniszhangoiler:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

```text
plugin_manager action=install_bundle target=@denniszhangoiler/dsh-rd-workflow@0.9.0
```

The package is public; GitHub Packages still requires an authenticated read
token for installation.

## Compatibility

- DSH `>=0.2.2-rc.5 <0.3.0`.
- Node.js 22 or newer.
- Web profile with the Host services documented in the README.

## Verification

- `npm test`: 12 tests + E2E gate.
- `npm run check`: packaging checks passed.
- GitHub Packages: client + main installed in a disposable profile; preset row
  present; no default preset change.
- npm: both tarballs uploaded and return HTTP 200; immediately after publish the
  npm packument (name lookup) was still 404. If `npm view` or install by name
  fails, use the GitHub Packages registry or the direct tarball URLs and retry
  npm after registry propagation.
- Existing 0.8.0 functionality/UI review: PASS, 81/100, no P0/P1.

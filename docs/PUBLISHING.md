# Publishing and marketplace notes

This document records the official mechanism as read from DeepSeek Harness
`0.2.2-rc.5`. Do not assume a central upload or review process; verify against
the DSH release you target before publishing.

Sources read in the installed DSH package:

- `@deepseek-ai/dsh` user guide: `docs/user/guide/plugin-market.md`
  ("Publish an index", "Index format reference").
- `@deepseek-ai/dsh-plugin-market-index` README and `src/types.ts`
  (format 1 validator and install targets).
- `@deepseek-ai/dsh-plugin-market` README (Discover, index sources,
  compatibility checks).

## Current status

- GitHub: <https://github.com/DennisZhangOiler/dsh-dev-workflow> (public).
- Install from Git: see the README. Do not install from npm.
- npm: **not published**. The npm name `dsh-dev-workflow` is already used by an
  unrelated package (`0.2.0`, `urzz/lodestar`). Publishing under that name would
  be wrong; use a scoped name such as `@<your-scope>/dsh-dev-workflow` if npm is
  needed later.
- Marketplace index: not served publicly yet.

## What DSH currently supports

- A plugin index is one UTF-8 JSON file served over `http:`/`https:` without a
  redirect. DSH ships **no index source**.
- Users enable **Custom plugin indexes** and add an index URL; DSH shows a
  **Discover** tab and installs a listed version after confirmation.
- The index format is `format: 1`. A version's `source` is either npm
  (`{ "type": "npm", "registry"?: url }`) or Git
  (`{ "type": "git", "url": https-url, "commit": 40-hex-sha, "path"?: dir }`).
- The package must declare `dsh.bundle` and a `dsh.bundle.patch`; DSH checks
  `engines.dsh` (or `@deepseek-ai/dsh*` peer dependencies) again at install.
- There is no central marketplace account, upload endpoint, review queue, or
  approval API in this installed version. "Publishing" means serving an index
  and, usually, publishing the npm package or a pinned Git commit.
- Index content is third-party data. DSH validates the format and install
  target, not the publisher's claims.

## Before publishing

1. The plain npm name `dsh-dev-workflow` is taken. Keep the Git package name
   for GitHub installation, or choose a scoped npm name that you control. A
   scope change also changes the preset plugin row `name: 'dsh-dev-workflow'`
   in `cordis.patch.yml` and the installation/uninstallation name.
2. Fill the metadata deliberately in `package.json`:
   - `repository`, `homepage`, and `bugs` with your real URLs;
   - `author` with the publisher name;
   - `keywords` (already present);
   - `engines.dsh` matching the DSH versions you tested.
3. Confirm `dsh.bundle.patch` and the `files` list include everything the
   runtime needs.
4. Run the checks:

   ```sh
   npm test
   npm run check
   npm pack --dry-run
   ```

5. Inspect the packed file list. It must include `index.js`, `prompt.md`,
   `cordis.patch.yml`, `skills/`, `locale/`, `docs/`, and `icon.svg`.
6. Scan for secrets and machine-specific paths:

   ```sh
   grep -RInE '(ghp_|npm_|sk-|BEGIN [A-Z ]*PRIVATE KEY)' .
   # also scan for absolute home paths and machine-specific paths with your own tooling
   ```

7. Verify the icon and detail image render in light and dark themes, and that
   the detail document has exactly one image line.
8. Install from the packed artifact (not the checkout) in a disposable profile
   and verify the preset appears and the default preset is unchanged.

## Publish an npm package (optional, scoped)

Not used for this release because the plain name is taken. If you choose a
scoped npm name, update `package.json` `name` and the preset plugin row in
`cordis.patch.yml` before packing, then:

```sh
npm login
npm publish --access public
```

Requires npm login and explicit user approval; do not run this on the user's
behalf without confirmation.

## Publish a Git-only version

The public repository is the release source:

```sh
git remote add origin git@github.com:DennisZhangOiler/dsh-dev-workflow.git
git push -u origin main
git tag -a v0.2.0 -m "dsh-dev-workflow 0.2.0"
git push origin v0.2.0
```

Install from GitHub (the repository root is the package):

```text
plugin_manager action=install_bundle target=git+https://github.com/DennisZhangOiler/dsh-dev-workflow.git
```

Pin the **full 40-character commit SHA** for a reproducible install. A Git
index entry installs that exact commit:

```json
{
  "type": "git",
  "url": "https://github.com/DennisZhangOiler/dsh-dev-workflow",
  "commit": "<40-hex-sha>",
  "path": "."
}
```

Publish only a public repository unless you accept that installation may need
credentials.

## Build the index entry

Minimal format-1 index with this plugin (fill version, timestamp, and repository
before serving):

```json
{
  "format": 1,
  "title": { "en": "Dev Workflow plugins", "zh": "Dev Workflow 插件" },
  "plugins": [
    {
      "name": "dsh-dev-workflow",
      "title": { "en": "Dev Workflow", "zh": "Dev Workflow" },
      "description": {
        "en": "Non-default ten-phase delivery preset with independent UI scoring, testing, and verification.",
        "zh": "非默认的十阶段交付预设，包含独立 UI 评分、测试和验收。"
      },
      "icon": "icons/dsh-dev-workflow.svg",
      "author": "DennisZhangOiler",
      "homepage": "https://github.com/DennisZhangOiler/dsh-dev-workflow#readme",
      "repository": { "url": "https://github.com/DennisZhangOiler/dsh-dev-workflow" },
      "versions": [
        {
          "version": "0.2.0",
          "publishTimestamp": 0,
          "source": {
            "type": "git",
            "url": "https://github.com/DennisZhangOiler/dsh-dev-workflow",
            "commit": "<40-hex-sha>",
            "path": "."
          },
          "engines": { "dsh": ">=0.2.2-rc.5 <0.3.0" }
        }
      ]
    }
  ]
}
```

- `publishTimestamp` is Unix **seconds**, not milliseconds.
- `icon` may be a relative URL beside the index and its `icons/` directory.
- The default version chosen by DSH is the highest compatible non-prerelease
  version, or the highest compatible prerelease when none exists.
- Do not invent a `version`, timestamp, commit, or compatibility range.

The DSH repository includes a reference generator; the installed user guide
documents it. Use it when available rather than hand-building a large index.

## Serve the index

Any static HTTPS host works (GitHub Pages, GitLab Pages, an object store, a
static web server). Requirements:

- HTTPS (use HTTPS for anything outside a fully trusted network).
- No redirects.
- A 2xx response and `application/json` (or a JSON-compatible type).
- The index and its icons served together.

Example local smoke check only (not a public host):

```sh
python3 -m http.server 8088 --directory market-site
# browse: http://127.0.0.1:8088/index.json
```

## Marketplace checklist

- [ ] npm package or public Git commit exists.
- [ ] `package.json` declares `dsh.bundle.patch` and `engines.dsh`.
- [ ] Version in the index matches the package/commit.
- [ ] `publishTimestamp` is real Unix seconds.
- [ ] Repository/homepage URLs are real and public.
- [ ] Icon is a valid SVG/PNG/JPEG/WebP within limits and uses a relative or
  HTTPS URL.
- [ ] Index validates against format 1; DSH shows no path error.
- [ ] A disposable profile can install the version and see the preset.
- [ ] Uninstall leaves no preset, package, or prompt-section residue.
- [ ] No secrets, tokens, local paths, or private endpoints in package, docs,
  index, or screenshots.
- [ ] README/CHANGELOG/LICENSE/screenshots are present.
- [ ] User has approved publication and account operations.

## Not done in this repository

- No npm publication has been performed; the plain name is taken.
- A public GitHub repository exists; no GitHub Release asset is required for
  Git installation.
- No marketplace index has been served publicly.
- No "listed" or "approved" status is claimed.

The index and any scoped npm package need the user's account and explicit
confirmation.

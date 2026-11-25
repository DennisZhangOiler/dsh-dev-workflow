/**
 * Dependency-free packaging checks. Run with `node test/check.mjs`.
 * Optional YAML validation runs when python3 and PyYAML are available.
 */
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = path => readFileSync(join(root, path), 'utf8')
const json = path => JSON.parse(read(path))

const manifest = json('package.json')
assert.equal(manifest.name, 'dsh-rd-workflow')
assert.equal(manifest.version, '0.5.0')
assert.equal(manifest.license, 'MIT')
assert.equal(manifest.dsh?.bundle?.patch, './cordis.patch.yml')
assert.ok(manifest.engines?.dsh)
assert.ok(manifest.exports?.['./icon'])
assert.ok(manifest.exports?.['./locale/*.json'])

const shipped = new Set(manifest.files)
const required = [
  'index.js',
  'prompt.md',
  'cordis.patch.yml',
  'skills',
  'locale/*.json',
  'docs',
  'icon.svg',
  'README.md',
  'README.zh.md',
  'CHANGELOG.md',
  'LICENSE',
]
for (const entry of required) assert.ok(shipped.has(entry), `files is missing ${entry}`)

for (const path of [
  'index.js', 'prompt.md', 'cordis.patch.yml', 'icon.svg',
  'skills/rd-workflow.md',
  'skills/rd-workflow-research.md',
  'skills/rd-workflow-program.md',
  'skills/rd-workflow-project-docs.md',
  'skills/rd-workflow-ui-rubric.md',
  'skills/rd-workflow-roles.md',
  'docs/DETAIL.md',
  'docs/DETAIL.zh.md',
  'docs/preview.svg',
  'docs/screenshot-triage.png',
  'docs/screenshot-program.png',
  'docs/screenshot-recursion.png',
  'docs/screenshot-bootstrap.png',
  'docs/screenshot-reentry.png',
  'docs/screenshot-research.png',
  'locale/en.json',
  'locale/zh.json',
]) {
  assert.ok(existsSync(join(root, path)), `missing ${path}`)
  assert.ok(statSync(join(root, path)).size > 0, `empty ${path}`)
}

for (const locale of ['en', 'zh']) {
  const meta = json(`locale/${locale}.json`).meta
  assert.ok(meta.title && meta.description && meta.detail, `locale/${locale}.json meta is incomplete`)
  assert.ok(existsSync(join(root, meta.detail)), `locale/${locale}.json detail is missing`)
  const detail = read(meta.detail).trim()
  assert.equal(detail.split('\n').length, 1, `${meta.detail} must contain exactly one image line`)
  const image = detail.match(/^!\[[^\]]*\]\(([^)]+)\)$/u)
  assert.ok(image, `${meta.detail} is not one Markdown image line`)
  assert.ok(existsSync(join(root, dirname(meta.detail), image[1])), `${meta.detail} image is missing`)
}

const patch = read('cordis.patch.yml')
for (const marker of [
  'id: preset-dev-workflow',
  "name: '@deepseek-ai/dsh-agent-preset'",
  'id: dev-workflow',
  'id: rd-workflow-contract',
  "name: 'dsh-rd-workflow'",
  'order: 5',
  "name: '@deepseek-ai/dsh-tool-fs'",
  "name: '@deepseek-ai/dsh-tool-fs-search'",
  "name: '@deepseek-ai/dsh-tool-bash'",
  "name: '@deepseek-ai/dsh-plan-mode'",
  "name: '@deepseek-ai/dsh-tool-todo'",
  "name: '@deepseek-ai/dsh-tool-subagent'",
  "name: '@deepseek-ai/dsh-tool-workflow'",
  "name: '@deepseek-ai/dsh-tool-ask-user'",
  "name: '@deepseek-ai/dsh-tool-skill'",
]) {
  assert.ok(patch.includes(marker), `patch is missing ${marker}`)
}
assert.ok(!/default:\s*dev-workflow/u.test(patch), 'the bundle must not change the profile default')
assert.ok(!/disabled:\s*true/u.test(patch), 'no row should be disabled in this preset')
assert.ok((patch.match(/maxDepth: 3/gu) ?? []).length >= 2, 'both delegation tools need maxDepth: 3')

if (process.env.SKIP_YAML === '1') {
  console.log('YAML parse skipped (SKIP_YAML=1)')
} else {
  try {
    const validator = [
      'import sys, yaml',
      'class L(yaml.SafeLoader): pass',
      "L.add_multi_constructor('tag:yaml.org,2002:js', lambda loader, suffix, node: loader.construct_scalar(node))",
      'yaml.load(open(sys.argv[1], encoding="utf-8"), Loader=L)',
      'print("ok")',
    ].join('\n')
    execFileSync('python3', ['-c', validator, join(root, 'cordis.patch.yml')], { stdio: 'pipe' })
    console.log('cordis.patch.yml parsed as YAML')
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('YAML parse skipped (python3 unavailable)')
    } else {
      throw error
    }
  }
}

console.log('packaging checks passed')

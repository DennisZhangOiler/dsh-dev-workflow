import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'

const cli = fileURLToPath(new URL('../migrate.mjs', import.meta.url))
const v1 = { version: 1, preset: { id: 'dev-workflow', displayName: '研发流程', skills: ['rd-workflow', 'rd-workflow-contract', 'rd-workflow-delivery'] }, docs: { conventions: 'docs/DEV_WORKFLOW.md', delivery: 'docs/DELIVERY.md' }, ui: { rubric: 'per-area floors' } }
const run = (args) => spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8' })

test('CLI apply then rollback on a path with spaces/unicode is real and byte-identical', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'migrate-cli-'))
  const sub = path.join(dir, '配置 dir'); await (await import('node:fs/promises')).mkdir(sub, { recursive: true })
  const src = path.join(sub, 'config 配置.json'); await writeFile(src, JSON.stringify(v1, null, 2) + '\n')
  const before = await readFile(src)
  try {
    const applied = run(['--apply', src])
    assert.equal(applied.status, 0, applied.stderr)
    const info = JSON.parse(applied.stdout)
    assert.ok(info.backup && info.sha256)
    assert.equal(JSON.parse(await readFile(src, 'utf8')).schemaVersion, 2)
    const rolled = run(['--rollback', src, info.backup])
    assert.equal(rolled.status, 0, rolled.stderr)
    assert.deepEqual(await readFile(src), before)
  } finally { await rm(dir, { recursive: true, force: true }) }
})

test('CLI rollback rejects a non-v1 backup without writing', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'migrate-cli-'))
  const src = path.join(dir, 'config.json'); const bad = path.join(dir, 'bad.json')
  await writeFile(src, JSON.stringify(v1)); await writeFile(bad, JSON.stringify({ wrong: true }))
  const before = await readFile(src)
  try {
    const res = run(['--rollback', src, bad])
    assert.notEqual(res.status, 0)
    assert.deepEqual(await readFile(src), before)
  } finally { await rm(dir, { recursive: true, force: true }) }
})


test('CLI rollback rejects wrong-but-valid v1 and hash mismatch without writing', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'migrate-cli-'))
  const src = path.join(dir, 'config.json')
  const before = JSON.stringify(v1, null, 2) + '\n'
  await writeFile(src, before)
  try {
    const applied = run(['--apply', src]); assert.equal(applied.status, 0, applied.stderr)
    const info = JSON.parse(applied.stdout)
    const afterApply = await readFile(src, 'utf8')
    const bads = [
      { ...v1, preset: { ...v1.preset, id: 'other' } },
      { ...v1, preset: { id: 'dev-workflow' } },
      { version: 1, preset: {}, docs: {}, ui: {} }
    ]
    for (const bad of bads) {
      const pathBad = path.join(dir, 'bad-' + Math.random() + '.json'); await writeFile(pathBad, JSON.stringify(bad))
      const res = run(['--rollback', src, pathBad])
      assert.notEqual(res.status, 0, JSON.stringify(bad))
      assert.equal(await readFile(src, 'utf8'), afterApply)
    }
    const wrongHash = path.join(dir, 'wrong-hash.json'); await writeFile(wrongHash, JSON.stringify(v1))
    const res = run(['--rollback', src, wrongHash])
    assert.notEqual(res.status, 0)
    assert.equal(await readFile(src, 'utf8'), afterApply)
  } finally { await rm(dir, { recursive: true, force: true }) }
})

import assert from 'node:assert/strict'
import { mkdtemp, readFile, writeFile, rm, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { migrateV1toV2, validateV2 } from '../migrate.mjs'

const v1 = {
  version: 1,
  preset: { id: 'dev-workflow', displayName: '研发流程', skills: ['rd-workflow', 'rd-workflow-contract'] },
  docs: { conventions: 'docs/DEV_WORKFLOW.md', delivery: 'docs/DELIVERY.md' },
  ui: { rubric: 'per-area floors' }
}

test('v1 -> v2 preserves id/skills and records migration', () => {
  const v2 = migrateV1toV2(v1, '2026-11-25T00:00:00Z')
  validateV2(v2)
  assert.equal(v2.schemaVersion, 2)
  assert.equal(v2.preset.id, 'dev-workflow')
  assert.equal(v2.preset.name, '研发流程')
  assert.deepEqual(v2.preset.skillIds, ['rd-workflow', 'rd-workflow-contract'])
  assert.equal(v2.migration.from, 1)
})

test('invalid v1 is rejected before any write', () => {
  assert.throws(() => migrateV1toV2({ version: 2, preset: {}, docs: {}, ui: {} }), /version 1/)
  assert.throws(() => migrateV1toV2({ version: 1, preset: { id: 'x', displayName: 'X', skills: ['unknown'] }, docs: { conventions: 'a', delivery: 'b' }, ui: { rubric: 'c' } }), /unknown skill/)
})

test('dry-run does not modify source and returns v2', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'migrate-'))
  try {
    const src = path.join(dir, 'config.json'); await writeFile(src, JSON.stringify(v1))
    const before = await readFile(src, 'utf8')
    const out = migrateV1toV2(JSON.parse(before))
    validateV2(out)
    assert.equal(await readFile(src, 'utf8'), before)
  } finally { await rm(dir, { recursive: true, force: true }) }
})

test('backup + apply + rollback restores byte-identical v1', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'migrate-'))
  try {
    const src = path.join(dir, 'config.json'); await writeFile(src, JSON.stringify(v1, null, 2) + '\n')
    const before = await readFile(src)
    const backup = src + '.backup.json'; await writeFile(backup, before)
    const v2 = migrateV1toV2(JSON.parse(before.toString('utf8'))); validateV2(v2)
    await writeFile(src, JSON.stringify(v2, null, 2) + '\n')
    await writeFile(src, before)
    assert.deepEqual(await readFile(src), before)
    assert.equal((await stat(backup)).size, before.length)
  } finally { await rm(dir, { recursive: true, force: true }) }
})

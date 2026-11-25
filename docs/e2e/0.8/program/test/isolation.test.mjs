import assert from 'node:assert/strict'
import { mkdtemp, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { getReadiness } from '../provider/evidence-service.mjs'
import { toDashboard } from '../consumer/dashboard-api.mjs'

const base = {
  activeProfile: '0.7.0',
  gates: [{ id: 'research', status: 'blocked', score: 84 }],
  tests: { passed: 12, total: 12 },
  release: { published: false, tag: null, notes: 'isolated' }
}

test('two provider instances with separate data dirs do not share state', async () => {
  const a = await mkdtemp(path.join(tmpdir(), 'ready-a-'))
  const b = await mkdtemp(path.join(tmpdir(), 'ready-b-'))
  try {
    await writeFile(path.join(a, 'readiness.json'), JSON.stringify({ ...base, candidate: '0.8.0' }))
    await writeFile(path.join(b, 'readiness.json'), JSON.stringify({ ...base, candidate: '0.9.0' }))
    const da = toDashboard(await getReadiness(path.join(a, 'readiness.json')))
    const db = toDashboard(await getReadiness(path.join(b, 'readiness.json')))
    assert.equal(da.title, 'readiness 0.8.0')
    assert.equal(db.title, 'readiness 0.9.0')
    assert.notEqual(da.title, db.title)
  } finally {
    await rm(a, { recursive: true, force: true })
    await rm(b, { recursive: true, force: true })
  }
})

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { toDashboard } from '../consumer/dashboard-api.mjs'
import { getReadiness } from '../provider/evidence-service.mjs'

const valid = {
  candidate: '0.8.0', activeProfile: '0.7.0',
  gates: [{ id: 'research', status: 'blocked', score: 84 }],
  tests: { passed: 12, total: 12 },
  release: { published: false, tag: null, notes: 'local' }
}

test('consumer maps provider output without mutating it', async () => {
  const readiness = await getReadiness()
  const before = JSON.stringify(readiness)
  const dashboard = toDashboard(readiness)
  assert.equal(dashboard.decision, 'not published')
  assert.equal(dashboard.tests, '12/12')
  assert.deepEqual(dashboard.blocked, ['research', 'program'])
  assert.equal(JSON.stringify(readiness), before)
})

test('consumer rejects missing release after passing gates', () => {
  const { release, ...withoutRelease } = valid
  assert.throws(() => toDashboard(withoutRelease), /release\.published required/)
})

test('consumer rejects unknown gate status and missing candidate', () => {
  assert.throws(() => toDashboard({ ...valid, candidate: undefined }), /candidate/)
  assert.throws(() => toDashboard({ ...valid, gates: [{ id: 'x', status: 'green', score: 1 }] }), /gate status/)
})

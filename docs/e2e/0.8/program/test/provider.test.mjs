import assert from 'node:assert/strict'
import { test } from 'node:test'
import { assertReadiness, getReadiness } from '../provider/evidence-service.mjs'

test('provider returns schema-valid readiness', async () => {
  const value = await getReadiness()
  assert.equal(value.candidate, '0.8.0')
  assert.equal(value.release.published, false)
  assert.equal(value.tests.passed, value.tests.total)
})

test('provider rejects a malformed gate status', () => {
  assert.throws(() => assertReadiness({ candidate: '0.8.0', activeProfile: '0.7.0', gates: [{ id: 'x', status: 'green', score: 1 }], tests: { passed: 1, total: 1 }, release: { published: false, tag: null, notes: '' } }), /gate status/)
})

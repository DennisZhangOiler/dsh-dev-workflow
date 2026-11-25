import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getReadiness } from '../provider/evidence-service.mjs'
import { toDashboard } from '../consumer/dashboard-api.mjs'

test('provider -> consumer integration is stable', async () => {
  const a = toDashboard(await getReadiness())
  const b = toDashboard(await getReadiness())
  assert.deepEqual(a, b)
  assert.equal(a.decision, 'not published')
})

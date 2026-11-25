import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { assertReadiness } from '../provider/evidence-service.mjs'

test('schema and runtime validator agree on the contract surface', async () => {
  const schema = JSON.parse(await readFile(new URL('../contracts/readiness.schema.json', import.meta.url), 'utf8'))
  assert.deepEqual(schema.required.sort(), ['activeProfile', 'candidate', 'gates', 'release', 'tests'])
  assert.equal(schema.additionalProperties, false)
  assert.deepEqual(schema.properties.gates.items.properties.status.enum.sort(), ['blocked', 'missing', 'partial', 'pass'])
  assert.deepEqual(schema.properties.gates.items.required.sort(), ['id', 'score', 'status'])
  assert.deepEqual(schema.properties.release.required.sort(), ['notes', 'published', 'tag'])
  assert.deepEqual(schema.properties.tests.required.sort(), ['passed', 'total'])
  const output = {
    candidate: '0.8.0', activeProfile: '0.7.0',
    gates: [{ id: 'research', status: 'blocked', score: 84 }],
    tests: { passed: 12, total: 12 },
    release: { published: false, tag: null, notes: 'local' }
  }
  assert.deepEqual(assertReadiness(output), output)
})

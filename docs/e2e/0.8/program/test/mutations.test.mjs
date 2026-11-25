import assert from 'node:assert/strict'
import { test } from 'node:test'
import { assertReadiness } from '../provider/evidence-service.mjs'

const base = {
  candidate: '0.8.0', activeProfile: '0.7.0',
  gates: [{ id: 'research', status: 'blocked', score: 84 }],
  tests: { passed: 12, total: 12 },
  release: { published: false, tag: null, notes: 'local' }
}
const cases = [
  ['root extra', { ...base, extra: true }],
  ['root missing', (({ tests, ...v }) => v)(base)],
  ['bad version', { ...base, candidate: 'v0.8' }],
  ['gate extra', { ...base, gates: [{ id: 'a', status: 'pass', score: 1, extra: true }] }],
  ['gate status', { ...base, gates: [{ id: 'a', status: 'green', score: 1 }] }],
  ['gate score', { ...base, gates: [{ id: 'a', status: 'pass', score: 101 }] }],
  ['tests extra', { ...base, tests: { passed: 1, total: 1, extra: true } }],
  ['tests passed>total', { ...base, tests: { passed: 2, total: 1 } }],
  ['release extra', { ...base, release: { published: false, tag: null, notes: 'x', extra: true } }],
  ['release published type', { ...base, release: { published: 'no', tag: null, notes: 'x' } }],
  ['notes missing', { ...base, release: { published: false, tag: null } }]
]
test('every schema-violating mutation is rejected', () => {
  for (const [name, value] of cases) {
    assert.throws(() => assertReadiness(value), undefined, name)
  }
})

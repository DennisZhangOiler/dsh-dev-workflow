import { readFile } from 'node:fs/promises'

const ALLOWED = new Set(['pass', 'blocked', 'missing', 'partial'])
const ROOT_KEYS = ['activeProfile', 'candidate', 'gates', 'release', 'tests']
const GATE_KEYS = ['id', 'score', 'status']
const TEST_KEYS = ['passed', 'total']
const RELEASE_KEYS = ['notes', 'published', 'tag']

function exactKeys(obj, keys, label) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) throw new Error(`${label} must be an object`)
  const actual = Object.keys(obj).sort()
  const expected = [...keys].sort()
  if (actual.join(',') !== expected.join(',')) throw new Error(`${label} has unexpected/missing keys`)
}

export function assertReadiness(value) {
  exactKeys(value, ROOT_KEYS, 'readiness')
  if (!/^\d+\.\d+\.\d+$/.test(value.candidate) || !/^\d+\.\d+\.\d+$/.test(value.activeProfile)) throw new Error('bad version')
  if (!Array.isArray(value.gates) || value.gates.length === 0) throw new Error('gates must be non-empty')
  for (const gate of value.gates) {
    exactKeys(gate, GATE_KEYS, 'gate')
    if (typeof gate.id !== 'string' || !gate.id) throw new Error('gate id')
    if (!ALLOWED.has(gate.status)) throw new Error('gate status')
    if (gate.score !== null && (typeof gate.score !== 'number' || gate.score < 0 || gate.score > 100)) throw new Error('gate score')
  }
  exactKeys(value.tests, TEST_KEYS, 'tests')
  if (!Number.isInteger(value.tests.passed) || !Number.isInteger(value.tests.total) || value.tests.passed > value.tests.total) throw new Error('tests')
  exactKeys(value.release, RELEASE_KEYS, 'release')
  if (typeof value.release.published !== 'boolean' || !(value.release.tag === null || typeof value.release.tag === 'string') || typeof value.release.notes !== 'string') throw new Error('release')
  return value
}

export async function getReadiness(dataDir = new URL('./data/readiness.json', import.meta.url)) {
  const raw = JSON.parse(await readFile(dataDir, 'utf8'))
  return assertReadiness(raw)
}

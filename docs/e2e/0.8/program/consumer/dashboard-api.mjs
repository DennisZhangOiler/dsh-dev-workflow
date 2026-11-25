const STATUS_LABEL = { pass: 'ready', blocked: 'blocked', missing: 'not run', partial: 'partial' }
const ALLOWED = new Set(Object.keys(STATUS_LABEL))

export function assertReadiness(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('readiness required')
  if (typeof value.candidate !== 'string' || typeof value.activeProfile !== 'string') throw new Error('candidate/activeProfile required')
  if (!Array.isArray(value.gates) || value.gates.length === 0) throw new Error('gates required')
  for (const gate of value.gates) {
    if (!gate || typeof gate.id !== 'string' || !ALLOWED.has(gate.status)) throw new Error('gate status required')
    if (gate.score !== null && (typeof gate.score !== 'number' || gate.score < 0 || gate.score > 100)) throw new Error('gate score required')
  }
  if (!value.tests || !Number.isInteger(value.tests.passed) || !Number.isInteger(value.tests.total) || value.tests.passed > value.tests.total) throw new Error('tests required')
  if (!value.release || typeof value.release.published !== 'boolean') throw new Error('release.published required')
  return value
}

export function toDashboard(readiness) {
  assertReadiness(readiness)
  const gates = readiness.gates.map((gate) => ({ id: gate.id, label: STATUS_LABEL[gate.status], score: gate.score }))
  const blocked = gates.filter((gate) => ['blocked', 'not run', 'partial'].includes(gate.label)).map((gate) => gate.id)
  return {
    title: `readiness ${readiness.candidate}`,
    subtitle: `active ${readiness.activeProfile}`,
    published: readiness.release.published,
    tests: `${readiness.tests.passed}/${readiness.tests.total}`,
    gates,
    blocked,
    decision: readiness.release.published ? 'published' : 'not published'
  }
}

import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtemp, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { test } from 'node:test'

const root = path.resolve(new URL('..', import.meta.url).pathname)
const provider = path.join(root, 'provider/evidence-service.mjs')
const base = { activeProfile: '0.7.0', gates: [{ id: 'research', status: 'blocked', score: 84 }], tests: { passed: 1, total: 1 }, release: { published: false, tag: null, notes: 'child' } }
const code = `import { getReadiness } from ${JSON.stringify(provider)}; const v = await getReadiness(process.env.READY_PATH); console.log(v.candidate);`

test('two child processes with separate data dirs are isolated', async () => {
  const a = await mkdtemp(path.join(tmpdir(), 'proc-a-'))
  const b = await mkdtemp(path.join(tmpdir(), 'proc-b-'))
  try {
    await writeFile(path.join(a, 'readiness.json'), JSON.stringify({ ...base, candidate: '0.8.0' }))
    await writeFile(path.join(b, 'readiness.json'), JSON.stringify({ ...base, candidate: '0.9.0' }))
    const run = (dir) => spawnSync(process.execPath, ['--input-type=module', '-e', code], { encoding: 'utf8', env: { ...process.env, READY_PATH: path.join(dir, 'readiness.json') } })
    const ra = run(a); const rb = run(b)
    assert.equal(ra.status, 0, ra.stderr); assert.equal(rb.status, 0, rb.stderr)
    assert.equal(ra.stdout.trim(), '0.8.0'); assert.equal(rb.stdout.trim(), '0.9.0')
  } finally { await rm(a, { recursive: true, force: true }); await rm(b, { recursive: true, force: true }) }
})

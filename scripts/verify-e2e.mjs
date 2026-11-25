#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { readFileSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import path from 'node:path'

const root = path.resolve(new URL('..', import.meta.url).pathname)
const packs = [
  ['no-ui', 'docs/e2e/0.8/no-ui'],
  ['program', 'docs/e2e/0.8/program'],
  ['high-risk', 'docs/e2e/0.8/high-risk']
]
const scores = [
  ['docs/e2e/0.8/ui/UI-SCORE-R2.md', '91'],
  ['docs/e2e/0.8/program/PROGRAM-SCORE-R2.md', '86'],
  ['docs/e2e/0.8/high-risk/HIGH-RISK-SCORE-R4.md', '86'],
  ['docs/e2e/0.8/no-ui/VERIFIER-R2.md', '89']
]

function fail(message) { console.error(`E2E GATE FAIL: ${message}`); process.exit(1) }
function sha256(file) { return createHash('sha256').update(readFileSync(file)).digest('hex') }

for (const [name, dir] of packs) {
  const cwd = path.join(root, dir)
  const res = spawnSync(process.execPath, ['--test'], { cwd, encoding: 'utf8' })
  if (res.status !== 0) fail(`${name} tests exit ${res.status}\n${res.stdout}\n${res.stderr}`)
  const hashFile = path.join(cwd, 'CONTRACT-HASHES.txt')
  if (!existsSync(hashFile)) fail(`${name} missing CONTRACT-HASHES.txt`)
  for (const line of readFileSync(hashFile, 'utf8').split('\n')) {
    const m = line.match(/^([a-f0-9]{64})\s+(.+)$/u)
    if (!m) continue
    const target = path.join(cwd, m[2].trim())
    if (!existsSync(target)) fail(`${name} missing ${m[2]}`)
    if (sha256(target) !== m[1]) fail(`${name} hash mismatch ${m[2]}`)
  }
}
for (const [file, score] of scores) {
  const full = path.join(root, file)
  if (!existsSync(full)) fail(`missing score ${file}`)
  const text = readFileSync(full, 'utf8')
  if (!/PASS/u.test(text)) fail(`${file} does not say PASS`)
  if (!new RegExp(score, 'u').test(text)) fail(`${file} does not record ${score}`)
}
console.log(`E2E gate: ${packs.length} packs pass, ${scores.length} scores present, hashes verified`)

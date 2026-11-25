#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, copyFileSync, realpathSync, openSync, writeSync, fsyncSync, closeSync, renameSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { resolve } from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'

const SKILL_MAP = {
  'rd-workflow': 'rd-workflow',
  'rd-workflow-contract': 'rd-workflow-contract',
  'rd-workflow-delivery': 'rd-workflow-delivery',
  'rd-workflow-program': 'rd-workflow-program',
  'rd-workflow-project-docs': 'rd-workflow-project-docs',
  'rd-workflow-research': 'rd-workflow-research',
  'rd-workflow-research-review': 'rd-workflow-research-review',
  'rd-workflow-roles': 'rd-workflow-roles',
  'rd-workflow-ui-rubric': 'rd-workflow-ui-rubric'
}
const V1_ROOT = ['docs', 'preset', 'ui', 'version']
const V1_PRESET = ['displayName', 'id', 'skills']
const V1_DOCS = ['conventions', 'delivery']
const V1_UI = ['rubric']

export function sha256File(path) { return createHash('sha256').update(readFileSync(path)).digest('hex') }

function writeAtomic(path, data, mode = 0o600) {
  const tmp = `${path}.tmp-${process.pid}`
  const fd = openSync(tmp, 'w', mode)
  try { writeSync(fd, data); fsyncSync(fd) } finally { closeSync(fd) }
  renameSync(tmp, path)
}

function exact(obj, keys, label) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) throw new Error(`${label} must be an object`)
  const actual = Object.keys(obj).sort().join(',')
  if (actual !== [...keys].sort().join(',')) throw new Error(`${label} has unexpected/missing keys`)
}

export function validateV1(v1) {
  exact(v1, V1_ROOT, 'v1')
  if (v1.version !== 1) throw new Error('expected config version 1')
  exact(v1.preset, V1_PRESET, 'v1.preset')
  if (typeof v1.preset.id !== 'string' || !v1.preset.id || typeof v1.preset.displayName !== 'string' || !v1.preset.displayName) throw new Error('v1.preset invalid')
  if (!Array.isArray(v1.preset.skills) || v1.preset.skills.length === 0) throw new Error('v1.preset.skills required')
  exact(v1.docs, V1_DOCS, 'v1.docs')
  exact(v1.ui, V1_UI, 'v1.ui')
  return v1
}

export function migrateV1toV2(v1, at = new Date().toISOString()) {
  validateV1(v1)
  const skills = v1.preset.skills.map((s) => {
    if (!SKILL_MAP[s]) throw new Error(`unknown skill: ${s}`)
    return SKILL_MAP[s]
  })
  return {
    schemaVersion: 2,
    preset: { id: v1.preset.id, name: v1.preset.displayName, skillIds: skills },
    conventions: { workflow: v1.docs.conventions, delivery: v1.docs.delivery },
    ui: { rubric: v1.ui.rubric },
    migration: { from: 1, at }
  }
}

export function validateV2(v2) {
  if (!v2 || v2.schemaVersion !== 2) throw new Error('schemaVersion 2 required')
  if (!v2.preset || typeof v2.preset.id !== 'string' || typeof v2.preset.name !== 'string' || !Array.isArray(v2.preset.skillIds) || v2.preset.skillIds.length === 0) throw new Error('preset invalid')
  if (!v2.conventions || !('workflow' in v2.conventions) || !('delivery' in v2.conventions)) throw new Error('conventions invalid')
  if (!v2.migration || v2.migration.from !== 1) throw new Error('migration meta invalid')
  return v2
}

function main() {
  const args = process.argv.slice(2)
  const mode = args[0]
  const src = args[1]
  if (!src) throw new Error('source path required')
  if (mode === '--dry-run') {
    const out = migrateV1toV2(JSON.parse(readFileSync(src, 'utf8')))
    validateV2(out)
    process.stdout.write(JSON.stringify(out, null, 2) + '\n')
    return
  }
  if (mode === '--apply') {
    const original = readFileSync(src)
    const v1 = validateV1(JSON.parse(original.toString('utf8')))
    const out = migrateV1toV2(v1)
    const backup = src + '.backup-' + Date.now() + '.json'
    out.migration.backupSha256 = createHash('sha256').update(original).digest('hex')
    validateV2(out)
    writeAtomic(backup, original)
    writeAtomic(src, JSON.stringify(out, null, 2) + '\n')
    console.log(JSON.stringify({ backup, sha256: sha256File(backup) }))
    return
  }
  if (mode === '--rollback') {
    const backup = args[2]
    if (!backup || !existsSync(backup)) throw new Error('backup required')
    const target = JSON.parse(readFileSync(src, 'utf8'))
    if (!target || target.schemaVersion !== 2 || !target.migration || typeof target.migration.backupSha256 !== 'string') throw new Error('rollback requires a migrated v2 target with backupSha256')
    const backupValue = JSON.parse(readFileSync(backup, 'utf8'))
    validateV1(backupValue)
    if (backupValue.preset.id !== target.preset?.id) throw new Error('backup preset id does not match target')
    const hash = sha256File(backup)
    if (hash !== target.migration.backupSha256) throw new Error('backup hash does not match pre-migration hash')
    writeAtomic(src, readFileSync(backup))
    console.log(JSON.stringify({ restored: true, sha256: sha256File(src) }))
    return
  }
  throw new Error('mode must be --dry-run, --apply, or --rollback')
}

const invoked = process.argv[1] && pathToFileURL(realpathSync(process.argv[1])).href === pathToFileURL(realpathSync(fileURLToPath(import.meta.url))).href
if (invoked) {
  try { main() } catch (error) { console.error(error.message); process.exit(1) }
}

/**
 * Disposable-profile smoke test for the packed bundle.
 *
 * Creates a temporary DSH_HOME, packs this package, installs the tarball into a
 * fresh web profile, checks the composed preset and the default, then removes
 * it and checks that no package, bundle, or lockfile residue remains.
 *
 * No model, credentials, network registry, or existing profile is used.
 * Set DSH_BIN when `dsh` is not on PATH:
 *   DSH_BIN=/path/to/dsh npm run test:smoke
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dsh = process.env.DSH_BIN ?? 'dsh'
const tmp = mkdtempSync(join(tmpdir(), 'dsh-rd-workflow-smoke-'))
const home = join(tmp, 'home')
const profileDir = join(home, 'profiles', 'smoke')
const env = {
  ...process.env,
  DSH_HOME: home,
  npm_config_store_dir: join(tmp, 'pnpm-store'),
  npm_config_cache: join(tmp, 'npm-cache'),
  PNPM_HOME: join(tmp, 'pnpm-home'),
}
delete env.DSH_PROFILE
delete env.DSH_PROFILE_DIR

function fail(message) {
  console.error(`smoke: ${message}`)
  process.exitCode = 1
  throw new Error(message)
}

function run(args, options = {}) {
  try {
    return execFileSync(dsh, args, {
      cwd: options.cwd ?? repo,
      env,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 180000,
    })
  } catch (error) {
    const stdout = error.stdout?.toString?.() ?? ''
    const stderr = error.stderr?.toString?.() ?? ''
    console.error(`smoke: command failed: ${dsh} ${args.join(' ')}`)
    if (stdout) console.error(stdout)
    if (stderr) console.error(stderr)
    throw error
  }
}

function assert(condition, message) {
  if (!condition) fail(message)
}

function readManifest() {
  return JSON.parse(readFileSync(join(profileDir, 'package.json'), 'utf8'))
}

try {
  mkdirSync(home, { recursive: true })

  console.log('smoke: packing')
  execFileSync('npm', ['pack', '--pack-destination', tmp], {
    cwd: repo,
    env,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 180000,
  })
  const tarball = readdirSync(tmp).find(name => name.endsWith('.tgz'))
  assert(tarball !== undefined, 'npm pack produced no tarball')
  console.log(`smoke: packed ${tarball}`)

  console.log('smoke: creating disposable web profile')
  run(['--profile', 'smoke', '--from-default-profile', 'web', '--dump-config'])
  assert(existsSync(join(profileDir, 'package.json')), 'profile was not created')

  console.log('smoke: installing tarball')
  run(['plugin', '--profile', 'smoke', 'add', join(tmp, tarball)])

  const installed = run(['--profile', 'smoke', '--dump-config'])
  assert(installed.includes('id: preset-dev-workflow'), 'preset row missing after install')
  assert(installed.includes('id: dev-workflow'), 'preset id missing after install')
  assert(installed.includes('default: standard'), 'default preset changed after install')
  assert(!installed.includes('preset-devflow'), 'unexpected old preset after install')

  const manifest = readManifest()
  assert(manifest.dependencies?.['dsh-rd-workflow'] !== undefined, 'dependency missing after install')
  assert(manifest.dsh?.profile?.bundles?.includes('dsh-rd-workflow'), 'bundle selection missing after install')

  console.log('smoke: removing bundle')
  run(['plugin', '--profile', 'smoke', 'remove', 'dsh-rd-workflow'])

  const removed = run(['--profile', 'smoke', '--dump-config'])
  assert(!removed.includes('preset-dev-workflow'), 'preset remains after removal')
  assert(removed.includes('default: standard'), 'default preset changed after removal')

  const after = readManifest()
  assert(after.dependencies?.['dsh-rd-workflow'] === undefined, 'dependency remains after removal')
  assert(!after.dsh?.profile?.bundles?.includes('dsh-rd-workflow'), 'bundle selection remains after removal')
  assert(!existsSync(join(profileDir, 'node_modules', 'dsh-rd-workflow')), 'node_modules residue after removal')
  assert(!readFileSync(join(profileDir, 'pnpm-lock.yaml'), 'utf8').includes('dsh-rd-workflow'), 'lockfile residue after removal')

  console.log('smoke: PASS')
} finally {
  rmSync(tmp, { recursive: true, force: true })
}

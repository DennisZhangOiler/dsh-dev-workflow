#!/usr/bin/env node
/**
 * REDUCED R3 harness — D0 baseline vs D2 exact-parity Set.
 *
 * This is a deliberately reduced subset of docs/research/e2e/PLAN.md (rev 2):
 * only D0 and D2 are measured, and only on fixed unique nonzero integer arrays
 * at n = 1000 / 5000 / 10000 plus one duplicate-pair case at n = 10000.
 * It is NOT the full D0–D4 study, and the plan-review PASS covers the full plan,
 * not this reduced subset. See REDUCED-RUN.md for deviations and limits.
 *
 * Protocol implemented here:
 *   - one fresh Node child process per timed run (no shared JIT/GC between reps);
 *   - 3 untimed warmup calls per child, then one timed call;
 *   - 3 timed reps per direction x workload, alternating direction order;
 *   - median of the 3 per-rep milliseconds per cell;
 *   - correctness: hand-computed 14-case Object.is table + an always-false
 *     mutant positive control + per-cell expected-result checks;
 *   - production src/, test/ and package.json SHA-256 captured before and after;
 *     any mismatch aborts validity (exit 1).
 *
 * D0 is the real production `hasDuplicateSlow`, imported read-only from
 * ../../../../src/dedupe.js. D2 is defined inline below. No production file is
 * written by this script.
 *
 * Usage:
 *   node docs/research/e2e/harness/bench.mjs           # orchestrator (writes env/raw)
 *   node docs/research/e2e/harness/bench.mjs --child ... (internal, one timed run)
 */

import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'

import { hasDuplicateSlow } from '../../../../src/dedupe.js'

const HARNESS_PATH = fileURLToPath(import.meta.url)
const HERE = path.dirname(HARNESS_PATH)
const E2E_DIR = path.resolve(HERE, '..')
const ROOT = path.resolve(E2E_DIR, '..', '..', '..')
const DATA_DIR = path.join(E2E_DIR, 'data')
const ENV_PATH = path.join(DATA_DIR, 'env.json')
const RAW_PATH = path.join(DATA_DIR, 'raw.json')

const SEED = 424242
const DUPLICATE_SEED = 424243
const WARMUP_CALLS = 3
const TIMED_RUNS = 3
const UNIQUE_SIZES = [1000, 5000, 10000]
const DUPLICATE_N = 10000
const CHILD_TIMEOUT_MS = 180000

const PROD_FILES = ['src/dedupe.js', 'test/dedupe.test.mjs', 'package.json']

const WORKLOADS = [
  ...UNIQUE_SIZES.map((n) => ({ name: `unique-${n}`, n, kind: 'unique', seed: SEED })),
  { name: `duplicate-${DUPLICATE_N}`, n: DUPLICATE_N, kind: 'duplicate', seed: DUPLICATE_SEED },
]

const POOL_RULE =
  'unique nonzero integers in [1, 2^31-1]; no NaN, no +0, no -0; ' +
  'mulberry32 seed with Set rejection; L1-style unique array (duplicate case ' +
  'adds exactly one pair at indices n-2/n-1)'

// ---------------------------------------------------------------------------
// D2 candidate: Set membership + explicit signed-zero guard.
// Exact for Object.is: zeros never enter the Set; NaN is handled by Set
// (SameValueZero), objects/symbols by reference, all other primitives alike.
// ---------------------------------------------------------------------------
export function hasDuplicateExact(items) {
  const seen = new Set()
  let plusZeroSeen = false
  let minusZeroSeen = false
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (Object.is(item, 0)) {
      if (plusZeroSeen) return true
      plusZeroSeen = true
    } else if (Object.is(item, -0)) {
      if (minusZeroSeen) return true
      minusZeroSeen = true
    } else {
      if (seen.has(item)) return true
      seen.add(item)
    }
  }
  return false
}

// Deliberately wrong control: must be detected by the correctness path.
function alwaysFalse() {
  return false
}

const DIRECTIONS = {
  d0: { label: 'D0 baseline (nested Object.is scan)', fn: hasDuplicateSlow },
  d2: { label: 'D2 Set + signed-zero guard', fn: hasDuplicateExact },
}

// ---------------------------------------------------------------------------
// Deterministic input generation.
// ---------------------------------------------------------------------------
function mulberry32(seed) {
  let a = seed | 0
  return function next() {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function makeUniqueNonZeroInts(n, seed) {
  const rand = mulberry32(seed)
  const seen = new Set()
  const out = []
  while (out.length < n) {
    const value = 1 + Math.floor(rand() * 2147483647) // [1, 2^31-1]
    if (seen.has(value)) continue
    seen.add(value)
    out.push(value)
  }
  return out
}

function inputSha256(arr) {
  return createHash('sha256').update(arr.join(',')).digest('hex')
}

function auditInput(arr, spec) {
  let plusZeroCount = 0
  let minusZeroCount = 0
  let nanCount = 0
  let nonIntegerCount = 0
  const firstSeen = new Map()
  let duplicateCount = 0
  const duplicatePairIndices = []

  for (let i = 0; i < arr.length; i++) {
    const value = arr[i]
    if (Object.is(value, 0)) plusZeroCount++
    if (Object.is(value, -0)) minusZeroCount++
    if (Number.isNaN(value)) nanCount++
    if (!Number.isInteger(value)) nonIntegerCount++
    if (firstSeen.has(value)) {
      duplicateCount++
      if (duplicatePairIndices.length < 8) duplicatePairIndices.push([firstSeen.get(value), i])
    } else {
      firstSeen.set(value, i)
    }
  }

  const uniqueCount = firstSeen.size
  const expectedDuplicatePair = [spec.n - 2, spec.n - 1]
  const pairMatches =
    duplicatePairIndices.length === 1 &&
    duplicatePairIndices[0][0] === expectedDuplicatePair[0] &&
    duplicatePairIndices[0][1] === expectedDuplicatePair[1]

  let uniqueOtherwise = false
  if (spec.kind === 'unique') {
    uniqueOtherwise = duplicateCount === 0 && uniqueCount === spec.n
  } else {
    uniqueOtherwise = duplicateCount === 1 && pairMatches && uniqueCount === spec.n - 1
  }

  return {
    n: spec.n,
    kind: spec.kind,
    seed: spec.seed,
    poolRule: POOL_RULE,
    plusZeroCount,
    minusZeroCount,
    nanCount,
    nonIntegerCount,
    uniqueCount,
    duplicateCount,
    duplicatePairIndices,
    uniqueOtherwise,
    inputSha256: inputSha256(arr),
    expectedResult: spec.kind === 'duplicate',
  }
}

function buildInput(spec) {
  const t0 = process.hrtime.bigint()
  const arr = makeUniqueNonZeroInts(spec.n, spec.seed)
  if (spec.kind === 'duplicate') {
    arr[spec.n - 1] = arr[spec.n - 2]
  }
  const generatorMs = Number(process.hrtime.bigint() - t0) / 1e6
  return { arr, generatorMs, audit: auditInput(arr, spec) }
}

function assertWorkloadAudit(audit) {
  if (audit.plusZeroCount !== 0) throw new Error(`${audit.kind} input contains +0`)
  if (audit.minusZeroCount !== 0) throw new Error(`${audit.kind} input contains -0`)
  if (audit.nanCount !== 0) throw new Error(`${audit.kind} input contains NaN`)
  if (audit.nonIntegerCount !== 0) throw new Error(`${audit.kind} input is not all integers`)
  if (!audit.uniqueOtherwise) {
    throw new Error(`workload ${audit.kind} failed uniqueness audit: ${JSON.stringify(audit)}`)
  }
}

// ---------------------------------------------------------------------------
// Hand-computed Object.is oracle table from PLAN.md §6 (E1–E14).
// ---------------------------------------------------------------------------
const SHARED_OBJECT = {}
const PARITY_CASES = [
  { id: 'E1', note: '[NaN, NaN]', input: [NaN, NaN], expected: true },
  { id: 'E2', note: '[+0, -0]', input: [0, -0], expected: false },
  { id: 'E3', note: '[-0, +0]', input: [-0, 0], expected: false },
  { id: 'E4', note: '[+0, +0]', input: [0, 0], expected: true },
  { id: 'E5', note: '[-0, -0]', input: [-0, -0], expected: true },
  { id: 'E6', note: '[1, 1]', input: [1, 1], expected: true },
  { id: 'E7', note: '[1, 2]', input: [1, 2], expected: false },
  { id: 'E8', note: '[undefined, undefined]', input: [undefined, undefined], expected: true },
  { id: 'E9', note: '[<hole>, <hole>]', input: Array(2), expected: true },
  { id: 'E10', note: '[null, null]', input: [null, null], expected: true },
  { id: 'E11', note: "['a', 'a']", input: ['a', 'a'], expected: true },
  { id: 'E12', note: "[1, '1']", input: [1, '1'], expected: false },
  { id: 'E13', note: '[obj, obj] same reference', input: [SHARED_OBJECT, SHARED_OBJECT], expected: true },
  { id: 'E14', note: '[{}, {}] distinct objects', input: [{}, {}], expected: false },
]

function runParityCases(fn) {
  return PARITY_CASES.map((c) => {
    const observed = fn(c.input)
    return {
      id: c.id,
      note: c.note,
      expected: c.expected,
      observed,
      match: observed === c.expected,
    }
  })
}

// ---------------------------------------------------------------------------
// Shared helpers.
// ---------------------------------------------------------------------------
function argValue(flag) {
  const i = process.argv.indexOf(flag)
  return i >= 0 && i + 1 < process.argv.length ? process.argv[i + 1] : undefined
}

function sha256File(relPath) {
  return createHash('sha256').update(readFileSync(path.join(ROOT, relPath))).digest('hex')
}

function hashProduction() {
  const out = {}
  for (const rel of PROD_FILES) out[rel] = sha256File(rel)
  return out
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}

function writeJson(filePath, value) {
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`)
}

function isoNow() {
  return new Date().toISOString()
}

function currentLoadavg() {
  return os.loadavg().map((v) => Number(v.toFixed(3)))
}

// ---------------------------------------------------------------------------
// Child mode: exactly one workload x direction x rep in a fresh process.
// ---------------------------------------------------------------------------
function runChild() {
  const direction = argValue('--direction')
  const workloadName = argValue('--workload')
  const rep = Number(argValue('--rep'))
  const orderPosition = Number(argValue('--order-position'))

  const spec = WORKLOADS.find((w) => w.name === workloadName)
  const entry = DIRECTIONS[direction]
  if (!spec || !entry) {
    process.stderr.write(`unknown child args direction=${direction} workload=${workloadName}\n`)
    process.exit(2)
  }

  const { arr, generatorMs, audit } = buildInput(spec)
  try {
    assertWorkloadAudit(audit)
  } catch (error) {
    process.stderr.write(`input audit failed: ${error.message}\n`)
    process.exit(3)
  }

  const expectedResult = audit.expectedResult
  let sink = 0
  for (let i = 0; i < WARMUP_CALLS; i++) {
    const warm = entry.fn(arr)
    sink ^= warm ? 1 : 0
    if (warm !== expectedResult) {
      process.stderr.write(
        `warmup result mismatch direction=${direction} workload=${workloadName} ` +
          `expected=${expectedResult} observed=${warm}\n`,
      )
      process.exit(4)
    }
  }

  const t0 = process.hrtime.bigint()
  const result = entry.fn(arr)
  const t1 = process.hrtime.bigint()
  const ns = Number(t1 - t0)
  if (result !== expectedResult) {
    process.stderr.write(
      `timed result mismatch direction=${direction} workload=${workloadName} ` +
        `expected=${expectedResult} observed=${result}\n`,
    )
    process.exit(5)
  }

  const record = {
    direction,
    workload: workloadName,
    n: spec.n,
    kind: spec.kind,
    rep,
    orderPosition,
    warmupCalls: WARMUP_CALLS,
    generatorMs: Number(generatorMs.toFixed(4)),
    ns,
    ms: ns / 1e6,
    result,
    expectedResult,
    resultCheck: result === expectedResult ? 'pass' : 'fail',
    sink,
    seed: spec.seed,
    ...audit,
    nodeVersion: process.version,
    observedAtUtc: isoNow(),
  }
  process.stdout.write(`${JSON.stringify(record)}\n`)
}

// ---------------------------------------------------------------------------
// Orchestrator mode.
// ---------------------------------------------------------------------------
function spawnChild(direction, workloadName, rep, orderPosition) {
  const args = [
    HARNESS_PATH,
    '--child',
    '--direction',
    direction,
    '--workload',
    workloadName,
    '--rep',
    String(rep),
    '--order-position',
    String(orderPosition),
  ]
  const res = spawnSync(process.execPath, args, {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: CHILD_TIMEOUT_MS,
    maxBuffer: 8 * 1024 * 1024,
  })

  const base = {
    direction,
    workload: workloadName,
    rep,
    orderPosition,
    childExitCode: res.status,
    childSignal: res.signal ?? null,
    timedOut: res.error?.code === 'ETIMEDOUT',
    stderr: (res.stderr || '').trim(),
  }

  if (res.status !== 0) {
    return { ...base, parsed: null, parseError: res.error ? String(res.error) : 'non-zero child exit' }
  }
  try {
    const lines = (res.stdout || '').trim().split('\n')
    const parsed = JSON.parse(lines[lines.length - 1])
    return { ...base, parsed, parseError: null }
  } catch (error) {
    return { ...base, parsed: null, parseError: `json parse failed: ${error.message}` }
  }
}

function runProductionSuite() {
  const res = spawnSync(process.execPath, ['--test'], {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: 120000,
  })
  return {
    command: 'node --test',
    cwd: ROOT,
    exitCode: res.status,
    pass: res.status === 0,
    stdout: (res.stdout || '').trim(),
    stderr: (res.stderr || '').trim(),
  }
}

function main() {
  const startedAtUtc = isoNow()
  const startHr = process.hrtime.bigint()
  mkdirSync(DATA_DIR, { recursive: true })

  const gitHead = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' })
  const uname = spawnSync('uname', ['-a'], { encoding: 'utf8' })
  const cpuList = os.cpus()

  const productionBefore = hashProduction()
  const env = {
    reducedRun: true,
    scope: 'REDUCED R3 E2E: D0 vs D2 only; n=1000/5000/10000 unique integer arrays + one duplicate-pair case',
    notTheFullStudy:
      'PLAN-REVIEW-R2.md PASS covers the full PLAN.md (D0–D4). This reduced run is a subset and does not validate omitted cells (D1/D3/D4, memory, scaling, random parity, object-heavy, small-n).',
    generatedAtUtc: startedAtUtc,
    finishedAtUtc: null,
    harness: {
      path: 'docs/research/e2e/harness/bench.mjs',
      sha256: sha256File('docs/research/e2e/harness/bench.mjs'),
    },
    cwd: ROOT,
    gitHead: (gitHead.stdout || '').trim() || null,
    worktreeNote:
      'This worktree is untracked/ignored under the parent repo .tmp/; file SHA-256 values are the provenance, not the commit.',
    node: process.version,
    v8: process.versions.v8,
    npm: (spawnSync('npm', ['--version'], { encoding: 'utf8' }).stdout || '').trim() || null,
    platform: process.platform,
    arch: process.arch,
    uname: (uname.stdout || '').trim() || null,
    cpuModel: cpuList[0]?.model ?? null,
    cpuCount: cpuList.length,
    availableParallelism: os.availableParallelism ? os.availableParallelism() : null,
    totalMemoryKb: Math.round(os.totalmem() / 1024),
    loadavgStart: currentLoadavg(),
    dependencies: 'none; built-ins only; no node_modules or network used',
    design: {
      seedUnique: SEED,
      seedDuplicate: DUPLICATE_SEED,
      warmupCalls: WARMUP_CALLS,
      timedRunsPerCell: TIMED_RUNS,
      uniqueSizes: UNIQUE_SIZES,
      duplicateCase: { n: DUPLICATE_N, pairIndices: [DUPLICATE_N - 2, DUPLICATE_N - 1] },
      freshChildProcessPerTimedRun: true,
      alternatingOrder: 'rep 1: d0 then d2; rep 2: d2 then d0; rep 3: d0 then d2',
      metric: 'median of 3 timed per-call milliseconds per direction x workload',
      poolRule: POOL_RULE,
    },
    productionFilesBefore: productionBefore,
    productionFilesAfter: null,
    productionUnchanged: null,
    deviationsFromFullPlan: [
      'Only D0 and D2 are measured (full plan: D0–D4).',
      'Only fixed unique nonzero integer arrays at n=1000/5000/10000 plus one duplicate-pair n=10000 case (full plan: curated 10k parity corpus, L2 mixed, L3 object-heavy, scaling 1k/4k/16k, memory 100k, small-n).',
      '3 reps and 3 warmups (full plan: 7 reps).',
      'One timed call per fresh child after warmups, no inner batch of 5 (full plan: 5 inner iterations at n<=16k).',
      'D0 is the production src/dedupe.js imported read-only rather than a baseline/ copy; pre/post SHA-256 equality is the control.',
      'D2 is defined inline in harness/bench.mjs rather than in spikes/d2/dedupe.mjs.',
      'No memory (M4), scaling fit (M3), mutant-through-candidate-path, D1 ±0 positive control, L3, or small-n secondaries.',
      'No results review and no memo were produced for this reduced run (per user instruction); these results are unreviewed.',
    ],
  }
  writeJson(ENV_PATH, env)

  // Correctness: hand-computed table for D0, D2, and the always-false mutant.
  const parityByDirection = {}
  for (const [id, entry] of Object.entries(DIRECTIONS)) {
    const cases = runParityCases(entry.fn)
    parityByDirection[id] = {
      label: entry.label,
      cases,
      allMatch: cases.every((c) => c.match),
      mismatches: cases.filter((c) => !c.match).map((c) => c.id),
    }
  }
  const mutantCases = runParityCases(alwaysFalse)
  const mutantMismatches = mutantCases.filter((c) => !c.match)

  // Parent-side workload audit; children must reproduce these checksums.
  const workloadAudits = {}
  for (const spec of WORKLOADS) {
    const { generatorMs, audit } = buildInput(spec)
    assertWorkloadAudit(audit)
    workloadAudits[spec.name] = { ...audit, generatorMsParent: Number(generatorMs.toFixed(4)) }
  }

  // Mutant must also be caught on the duplicate-pair workload (expected true).
  const duplicateWorkload = WORKLOADS.find((w) => w.kind === 'duplicate')
  const duplicateInput = buildInput(duplicateWorkload).arr
  const mutantDuplicateObserved = alwaysFalse(duplicateInput)
  const mutantDuplicateDetected = mutantDuplicateObserved !== true
  const mutantDetected = mutantMismatches.length >= 1 && mutantDuplicateDetected

  const runs = []
  for (const spec of WORKLOADS) {
    for (let rep = 1; rep <= TIMED_RUNS; rep++) {
      const order = rep % 2 === 1 ? ['d0', 'd2'] : ['d2', 'd0']
      for (let pos = 0; pos < order.length; pos++) {
        runs.push(spawnChild(order[pos], spec.name, rep, pos))
      }
    }
  }

  // Validate each run against the parent-side input audit and expected result.
  const expectedByWorkload = workloadAudits
  for (const run of runs) {
    if (!run.parsed) {
      run.inputMatch = false
      run.resultCheck = 'fail'
      continue
    }
    const parsed = run.parsed
    const expected = expectedByWorkload[parsed.workload]
    const inputMatch =
      !!expected &&
      parsed.n === expected.n &&
      parsed.kind === expected.kind &&
      parsed.inputSha256 === expected.inputSha256 &&
      parsed.uniqueCount === expected.uniqueCount &&
      parsed.duplicateCount === expected.duplicateCount &&
      parsed.uniqueOtherwise === expected.uniqueOtherwise &&
      parsed.expectedResult === expected.expectedResult &&
      parsed.plusZeroCount === 0 &&
      parsed.minusZeroCount === 0 &&
      parsed.nanCount === 0
    Object.assign(run, parsed)
    run.inputMatch = inputMatch
    run.resultCheck = inputMatch && parsed.resultCheck === 'pass' ? 'pass' : 'fail'
  }

  const cells = []
  for (const spec of WORKLOADS) {
    for (const direction of Object.keys(DIRECTIONS)) {
      const cellRuns = runs.filter((r) => r.parsed && r.workload === spec.name && r.direction === direction)
      const values = cellRuns.map((r) => r.ms)
      const valid =
        cellRuns.length === TIMED_RUNS &&
        cellRuns.every((r) => r.childExitCode === 0 && r.resultCheck === 'pass' && r.inputMatch)
      cells.push({
        direction,
        workload: spec.name,
        n: spec.n,
        kind: spec.kind,
        expectedResult: workloadAudits[spec.name].expectedResult,
        reps: values.length,
        timesMs: values,
        medianMs: values.length === TIMED_RUNS ? median(values) : null,
        minMs: values.length ? Math.min(...values) : null,
        maxMs: values.length ? Math.max(...values) : null,
        allResultsMatchExpected: cellRuns.length === TIMED_RUNS && cellRuns.every((r) => r.resultCheck === 'pass'),
        valid,
      })
    }
  }

  // Descriptive ratio only (not a gate, not a conclusion).
  for (const cell of cells) {
    if (cell.direction !== 'd2') continue
    const baseline = cells.find(
      (c) => c.direction === 'd0' && c.workload === cell.workload && c.n === cell.n,
    )
    cell.descriptiveRatioD0overD2 =
      baseline && baseline.medianMs && cell.medianMs ? baseline.medianMs / cell.medianMs : null
  }

  const existingSuite = runProductionSuite()

  const productionAfter = hashProduction()
  const productionUnchanged = PROD_FILES.every((rel) => productionBefore[rel] === productionAfter[rel])

  const parityOk =
    parityByDirection.d0.allMatch && parityByDirection.d2.allMatch && mutantDetected
  const cellsOk = cells.every((c) => c.valid)
  const harnessValid = parityOk && cellsOk && productionUnchanged && existingSuite.pass

  const finishedAtUtc = isoNow()
  const durationMs = Number(process.hrtime.bigint() - startHr) / 1e6

  env.productionFilesAfter = productionAfter
  env.productionUnchanged = productionUnchanged
  env.loadavgEnd = currentLoadavg()
  env.finishedAtUtc = finishedAtUtc
  env.durationMs = Number(durationMs.toFixed(1))
  writeJson(ENV_PATH, env)

  const raw = {
    reducedRun: true,
    scope: 'REDUCED R3 E2E: D0 vs D2 only; unique integer arrays n=1000/5000/10000 + duplicate-pair n=10000',
    notTheFullStudy: env.notTheFullStudy,
    generatedAtUtc: finishedAtUtc,
    seed: { unique: SEED, duplicate: DUPLICATE_SEED },
    protocol: {
      warmupCalls: WARMUP_CALLS,
      timedRunsPerCell: TIMED_RUNS,
      freshChildProcessPerTimedRun: true,
      alternatingOrder: 'rep 1: d0 then d2; rep 2: d2 then d0; rep 3: d0 then d2',
      timedRegion: 'process.hrtime.bigint() around one call; generation/checksumming outside',
      statistic: 'median of the 3 per-rep milliseconds per cell',
    },
    workloads: workloadAudits,
    parity: {
      oracle: 'hand-computed Object.is table from PLAN.md §6 (E1–E14)',
      d0: parityByDirection.d0,
      d2: parityByDirection.d2,
      allMatch: parityByDirection.d0.allMatch && parityByDirection.d2.allMatch,
    },
    controls: {
      alwaysFalseMutant: {
        cases: mutantCases,
        mismatchCount: mutantMismatches.length,
        mismatchCaseIds: mutantMismatches.map((c) => c.id),
        duplicateWorkloadExpected: true,
        duplicateWorkloadObserved: mutantDuplicateObserved,
        detected: mutantDetected,
      },
    },
    runs,
    cells,
    existingSuite,
    production: {
      files: PROD_FILES,
      before: productionBefore,
      after: productionAfter,
      unchanged: productionUnchanged,
      method: 'SHA-256 of src/dedupe.js, test/dedupe.test.mjs, package.json before and after all measurements',
    },
    harness: {
      path: 'docs/research/e2e/harness/bench.mjs',
      sha256: env.harness.sha256,
      node: process.version,
    },
    harnessValid,
    validityChecks: {
      parityAllMatch: parityByDirection.d0.allMatch && parityByDirection.d2.allMatch,
      mutantDetected,
      allCellsValid: cellsOk,
      productionUnchanged,
      existingSuitePass: existingSuite.pass,
    },
    deviationsFromFullPlan: env.deviationsFromFullPlan,
    limitations: [
      'Reduced subset: only D0/D2, only fixed nonzero integer workloads n<=10000, 3 reps.',
      'No memory, scaling-fit, mixed-type L2, object-heavy, small-n, or 10k random parity cells.',
      'Measured on one dev desktop, Node 22.23.2 only; no CPU pinning, governor, or isolated benchmark host.',
      'Fresh process per rep reduces but does not eliminate machine/JIT noise; 3 reps give a wide interval.',
      'D0 is imported from production src/ (hash-checked before/after) rather than a baseline copy.',
      'D2 is inline in the harness rather than in spikes/d2/.',
      'Unreviewed: no independent results review or memo was produced for this reduced run.',
    ],
  }
  writeJson(RAW_PATH, raw)

  const summary = {
    harnessValid,
    productionUnchanged,
    parityAllMatch: raw.validityChecks.parityAllMatch,
    mutantDetected,
    existingSuitePass: existingSuite.pass,
    cells: cells.map((c) => ({
      workload: c.workload,
      n: c.n,
      direction: c.direction,
      medianMs: c.medianMs == null ? null : Number(c.medianMs.toFixed(4)),
      valid: c.valid,
    })),
    envPath: path.relative(ROOT, ENV_PATH),
    rawPath: path.relative(ROOT, RAW_PATH),
    durationMs: env.durationMs,
  }
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`)

  if (!harnessValid) {
    process.stderr.write('REDUCED R3 harness invalid — see data/raw.json validityChecks\n')
    process.exit(1)
  }
}

if (process.argv.includes('--child')) {
  runChild()
} else {
  main()
}

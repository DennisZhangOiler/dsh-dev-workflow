import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const root = new URL('..', import.meta.url)
const read = path => readFileSync(new URL(path, root), 'utf8')
const prompt = read('prompt.md')
const contract = read('skills/rd-workflow-contract.md')
const delivery = read('skills/rd-workflow-delivery.md')
const research = read('skills/rd-workflow-research.md')
const review = read('skills/rd-workflow-research-review.md')
const ui = read('skills/rd-workflow-ui-rubric.md')
const program = read('skills/rd-workflow-program.md')

const has = (text, marker, label) => {
  assert.ok(text.includes(marker), `${label} must contain ${JSON.stringify(marker)}`)
}

test('development gates are present and cannot silently vanish', () => {
  for (const [text, markers] of [
    [prompt, ['AC-1..n', 'DoD', 'risk tier', 'high-risk', 'human code/release approval', 'per-area floors', 'total >=85', 'reviewer identity', 'MIGRATION.md', 'provider/consumer contract tests', 'isolate ports']],
    [contract, ['docs/contracts/<change>.md', 'SHA-256', 'one observable result', 'AC quality', 'docs/contracts', 'risk tier']],
    [delivery, ['REVIEWER RECORD', 'prompt hash', 'input hash', 'prior verdicts', 'MIGRATION.md', 'docs/program/', 'high-risk', 'cannot skip']],
    [ui, ['Floor', 'total >= 85', 'calibration', '390', '200% zoom', 'keyboard']],
    [program, ['independent scorer', 'provider/consumer', 'runtime isolation', 'Log every gap', 'total >=85']],
  ]) for (const marker of markers) has(text, marker, 'development gate')
})

test('research gates are present and cannot silently vanish', () => {
  for (const [text, markers] of [
    [prompt, ['total >=80', 'unresolved P2', 'per-area']],
    [research, ['total >=80 is also a gate', 'CLAIMS.md', 'HANDOFF.md', 'internal note labeled', 'Quick']],
    [review, ['total >=80', 'at most 3', 'CLAIMS.md', 'REC-1..n', 'STOP/WAIVER', 'allowed wording']],
  ]) for (const marker of markers) has(text, marker, 'research gate')
})

test('calibration fixtures exist', () => {
  for (const path of [
    'docs/fixtures/research/README.md',
    'docs/fixtures/research/weak-plan.md',
    'docs/fixtures/research/strong-plan.md',
    'docs/fixtures/research/partial-adopt.md',
    'docs/fixtures/research/floor-boundary.md',
    'docs/fixtures/research/narrow-directions.md',
    'docs/fixtures/research/single-run-strong.md',
    'docs/fixtures/research/vague-review.md',
    'docs/fixtures/research/expected.json',
    'docs/fixtures/ui/README.md',
    'docs/fixtures/ui/pass.html',
    'docs/fixtures/ui/fail.html',
    'docs/e2e/0.8/research/PLAN-REVIEW-R2.md',
    'docs/e2e/0.8/research/RESULTS-REVIEW.md',
    'docs/e2e/0.8/research/MEMO-REVIEW.md',
    'docs/e2e/0.8/research/data/raw.json',
    'docs/e2e/0.8/research/REPLAY.md',
    'docs/e2e/0.8/ui/UI-SCORE-R2.md',
    'docs/e2e/0.8/program/PROGRAM-SCORE-R2.md',
    'docs/e2e/0.8/high-risk/HIGH-RISK-SCORE-R4.md',
    'docs/e2e/0.8/high-risk/HUMAN-APPROVAL.md',
    'docs/e2e/0.8/no-ui/VERIFIER-R2.md',
    'docs/e2e/0.8/no-ui/CONTRACT.md',
    'docs/e2e/0.8/ui/USER-CHOICE.md',
    'docs/e2e/0.8/research/harness/replay.mjs',
    'docs/e2e/0.8/research/CALIBRATION-INDEPENDENT-R4.md',
  ]) assert.ok(existsSync(new URL(path, root)), `missing calibration fixture: ${path}`)
})

test('research fixture expected outcomes are explicit', () => {
  const expected = JSON.parse(read('docs/fixtures/research/expected.json'))
  const names = ['weak-plan.md', 'narrow-directions.md', 'single-run-strong.md', 'partial-adopt.md', 'vague-review.md', 'strong-plan.md', 'floor-boundary.md']
  assert.deepEqual(Object.keys(expected).sort(), [...names].sort())
  for (const name of names) assert.ok(['PASS', 'REVISE', 'REJECTED'].includes(expected[name].verdict), `${name} has no valid verdict`)
  const readme = read('docs/fixtures/research/README.md')
  for (const marker of ['weak-plan.md', 'REVISE', 'strong-plan.md', 'PASS', 'partial-adopt.md', 'floor-boundary.md', 'CALIBRATION-INDEPENDENT']) {
    has(readme, marker, 'research fixture manifest')
  }
})

test('contributed text does not reintroduce a fixed research direction cap', () => {
  assert.doesNotMatch(prompt, /2-3 genuinely different directions/iu)
  assert.match(research, /no fixed 2-3 cap/iu)
})


test('independent calibration verdicts cover all expected fixtures', () => {
  const expected = JSON.parse(read('docs/fixtures/research/expected.json'))
  const calibration = read('docs/e2e/0.8/research/CALIBRATION-INDEPENDENT-R3.md')
  for (const [name, entry] of Object.entries(expected)) {
    assert.ok(calibration.includes(name), `calibration is missing ${name}`)
    assert.ok(calibration.includes(entry.verdict), `${name} expected ${entry.verdict} is not in calibration record`)
  }
})

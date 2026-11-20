import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { apply, inject, name } from '../index.js'

const root = new URL('..', import.meta.url)
const read = (path) => readFileSync(new URL(path, root), 'utf8')
const PROMPT = read('prompt.md')
const SKILL_FILES = [
  'dev-workflow.md',
  'dev-workflow-project-docs.md',
  'dev-workflow-ui-rubric.md',
  'dev-workflow-roles.md',
]

function mount() {
  const sections = []
  const skills = []
  const effects = []
  const ctx = {
    systemPrompt: {
      section(section) {
        sections.push(section)
        return () => {}
      },
    },
    skills: {
      register(skill) {
        skills.push(skill)
        return () => {}
      },
    },
    effect(fn, label) {
      effects.push(label)
      return fn()
    },
  }
  apply(ctx)
  return { sections, skills, effects }
}

test('exports a scoped preset plugin contract', () => {
  assert.equal(name, 'dev-workflow')
  assert.deepEqual(inject, ['systemPrompt', 'skills'])
})

test('registers exactly one stable system-prompt section', () => {
  const { sections } = mount()
  assert.equal(sections.length, 1)
  const [section] = sections
  assert.equal(section.name, 'dev-workflow:contract')
  assert.equal(section.order, 100)
  assert.equal(section.interpolate, false)
  assert.equal(section.text, PROMPT)
  assert.ok(PROMPT.length >= 6000 && PROMPT.length <= 8000, `prompt is ${PROMPT.length} chars`)
})

test('prompt contains every phase and gate', () => {
  for (const marker of [
    'Phase 0', 'Phase 1', 'Phase 2', 'Phase 3', 'Phase 4',
    'Phase 5', 'Phase 6', 'Phase 7', 'Phase 8', 'Phase 9',
    '>=85', 'P0/P1', 'P0/P1/P2/P3', 'PASS or REJECT',
    'AGENTS.md', 'docs/DEV_WORKFLOW.md', 'docs/DELIVERY.md',
    'protected branch', 'CI is red', 'credentials',
    'explicit confirmation', 'user must explicitly confirm',
    'no mobile horizontal overflow', 'accessibility',
    'project rubric', 'fresh `subagent`', 'write scopes disjoint',
    'UI design', 'UI behavior', 'No UI', 'UI design only',
    'A CLI project can get UI design',
    'no UI or viewport checks',
    'Do not score UI behavior or No UI',
    'dev-workflow` skill',
  ]) {
    assert.ok(PROMPT.includes(marker), `prompt is missing: ${marker}`)
  }
})

test('registers the four playbook skills', () => {
  const { skills } = mount()
  assert.deepEqual(skills.map(skill => skill.name), [
    'dev-workflow',
    'dev-workflow-project-docs',
    'dev-workflow-ui-rubric',
    'dev-workflow-roles',
  ])
  for (const skill of skills) {
    assert.match(skill.name, /^[a-z0-9]+(-[a-z0-9]+)*$/)
    assert.ok(skill.description.length > 20)
    assert.ok(skill.whenToUse.length > 20)
    assert.equal(skill.source, 'bundled')
    assert.equal(skill.resourceBase.kind, 'directory')
    assert.ok(skill.content.length > 1000)
    assert.ok(skill.content.length <= 8192, `${skill.name} is ${skill.content.length} chars`)
  }
})

test('skill bodies match their files and cover their required rules', () => {
  const { skills } = mount()
  const bodies = Object.fromEntries(skills.map(skill => [skill.name, skill.content]))
  for (const file of SKILL_FILES) {
    const expected = readFileSync(new URL(`skills/${file}`, root), 'utf8')
    const name = file.replace(/\.md$/u, '')
    assert.equal(bodies[name], expected)
  }
  assert.match(bodies['dev-workflow'], /Phase 0/u)
  assert.match(bodies['dev-workflow'], /Phase 9/u)
  assert.match(bodies['dev-workflow'], /UI design/u)
  assert.match(bodies['dev-workflow'], /UI behavior/u)
  assert.match(bodies['dev-workflow'], /No UI/u)
  assert.match(bodies['dev-workflow'], /Skip this phase for/u)
  assert.match(bodies['dev-workflow-ui-rubric'], />= 85/u)
  assert.match(bodies['dev-workflow-ui-rubric'], /P0/u)
  assert.match(bodies['dev-workflow-ui-rubric'], /horizontal overflow/u)
  assert.match(bodies['dev-workflow-ui-rubric'], /only for a `UI design` change/u)
  assert.match(bodies['dev-workflow-ui-rubric'], /No UI/u)
  assert.match(bodies['dev-workflow-roles'], /Test author prompt/u)
  assert.match(bodies['dev-workflow-roles'], /VERDICT: PASS or REJECT/u)
  assert.match(bodies['dev-workflow-roles'], /Triage for this change/u)
  assert.match(bodies['dev-workflow-roles'], /No UI/u)
  assert.match(bodies['dev-workflow-project-docs'], /docs\/DELIVERY\.md/u)
  assert.match(bodies['dev-workflow-project-docs'], /When delivery is undocumented/u)
})

test('contributed text has no machine-specific paths or secrets', () => {
  const texts = [PROMPT, ...SKILL_FILES.map(file => read(`skills/${file}`))]
  for (const text of texts) {
    assert.doesNotMatch(text, /\/home\/|\/Users\/|[A-Za-z]:\\/u)
    assert.doesNotMatch(text, /https?:\/\//u)
    assert.doesNotMatch(text, /\b(?:github|gitlab)\.com\b/u)
    assert.doesNotMatch(text, /\b(?:password|passwd|secret|token)\s*[:=]\s*\S+/iu)
  }
})

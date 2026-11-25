import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { apply, inject, name } from '../index.js'

const root = new URL('..', import.meta.url)
const read = (path) => readFileSync(new URL(path, root), 'utf8')
const PROMPT = read('prompt.md')
const SKILL_FILES = [
  'rd-workflow.md',
  'rd-workflow-research.md',
  'rd-workflow-research-review.md',
  'rd-workflow-program.md',
  'rd-workflow-project-docs.md',
  'rd-workflow-ui-rubric.md',
  'rd-workflow-roles.md',
]
const SKILL_NAMES = SKILL_FILES.map(file => file.replace(/\.md$/u, ''))

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
  assert.equal(name, 'rd-workflow')
  assert.deepEqual(inject, ['systemPrompt', 'skills'])
})

test('registers exactly one stable system-prompt section', () => {
  const { sections } = mount()
  assert.equal(sections.length, 1)
  const [section] = sections
  assert.equal(section.name, 'rd-workflow:contract')
  assert.equal(section.order, 100)
  assert.equal(section.interpolate, false)
  assert.equal(section.text, PROMPT)
  assert.ok(PROMPT.length >= 6000 && PROMPT.length <= 8000, `prompt is ${PROMPT.length} chars`)
})

test('prompt contains the router, modes, phases, and gates', () => {
  for (const marker of [
    'Request router', 'New objective', 'Phase 0', 'Phase 1', 'Phase 2', 'Phase 3',
    'Phase 4', 'Phase 5', 'Phase 6', 'Phase 7', 'Phase 8', 'Phase 9',
    'R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7',
    'Experiment-first', 'broad direction set', 'plan review', 'Results review',
    'explicit', 'measured-here', 'rd-workflow-research-review',
    '>=85', 'P0/P1', 'PASS/REJECT', 'UI design', 'UI behavior', 'No UI',
    'UI design only', 'Bootstrap missing rules', 'ask once with defaults',
    'AGENTS.md', 'docs/DEV_WORKFLOW.md', 'docs/DELIVERY.md', 'docs/UI.md',
    'docs/RESEARCH.md', 'Research', 'Program', 'protected branch', 'red CI',
    'credentials', 'explicit confirmation', 'user confirm',
    'no mobile overflow', 'a11y', 'project/bundled rubric', 'project/bundled rubric',
    'subagent` for UI direction', 'scopes disjoint',
    'rd-workflow-program', 'rd-workflow-research', 'fabricate',
  ]) {
    assert.ok(PROMPT.includes(marker), `prompt is missing: ${marker}`)
  }
})

test('registers the six playbooks', () => {
  const { skills } = mount()
  assert.deepEqual(skills.map(skill => skill.name), SKILL_NAMES)
  for (const skill of skills) {
    assert.match(skill.name, /^[a-z0-9]+(-[a-z0-9]+)*$/)
    assert.ok(skill.description.length > 20)
    assert.ok(skill.whenToUse.length > 20)
    assert.equal(skill.source, 'bundled')
    assert.equal(skill.resourceBase.kind, 'directory')
    assert.ok(skill.content.length > 1000)
    const limit = ['rd-workflow', 'rd-workflow-research', 'rd-workflow-research-review', 'rd-workflow-program', 'rd-workflow-roles'].includes(skill.name) ? 7800 : 8192
    assert.ok(skill.content.length <= limit, `${skill.name} is ${skill.content.length} chars`)
  }
})

test('skill bodies match their files and cover their required rules', () => {
  const { skills } = mount()
  const bodies = Object.fromEntries(skills.map(skill => [skill.name, skill.content]))
  for (const file of SKILL_FILES) {
    assert.equal(bodies[file.replace(/\.md$/u, '')], readFileSync(new URL(`skills/${file}`, root), 'utf8'))
  }
  assert.match(bodies['rd-workflow'], /Phase 0/u)
  assert.match(bodies['rd-workflow'], /Phase 9/u)
  assert.match(bodies['rd-workflow'], /new feature|new objective/iu)
  assert.match(bodies['rd-workflow'], /Conventions bootstrap/u)
  assert.match(bodies['rd-workflow-research'], /R0/u)
  assert.match(bodies['rd-workflow-research'], /R7/u)
  
  assert.match(bodies['rd-workflow-research'], /experiment/iu)
  assert.match(bodies['rd-workflow-research'], /plan review/iu)
  assert.match(bodies['rd-workflow-research'], /results review/iu)
  assert.match(bodies['rd-workflow-research'], /representative project slice/iu)
  assert.match(bodies['rd-workflow-research'], /PASS.*REVISE/u)
  assert.match(bodies['rd-workflow-research'], /PASS.*REVISE/u)
  assert.match(bodies['rd-workflow-research'], /read-only/iu)
  assert.match(bodies['rd-workflow-research-review'], /Plan review/u)
  assert.match(bodies['rd-workflow-research-review'], /Results review/u)
  assert.match(bodies['rd-workflow-research-review'], />=85/u)
  assert.match(bodies['rd-workflow-research-review'], /P0\/P1/u)
  assert.match(bodies['rd-workflow-research-review'], /supported \/ partial \/ unsupported/u)
  assert.match(bodies['rd-workflow-research-review'], /Forbidden feedback/u)
  assert.match(bodies['rd-workflow-program'], /Program mode/u)
  assert.match(bodies['rd-workflow-program'], /Frozen UI/u)
  assert.match(bodies['rd-workflow-program'], /module lead/u)
  assert.match(bodies['rd-workflow-project-docs'], /Bootstrap missing conventions/u)
  assert.match(bodies['rd-workflow-project-docs'], /UI policy template/u)
  assert.match(bodies['rd-workflow-project-docs'], /Research policy template/u)
  assert.match(bodies['rd-workflow-ui-rubric'], />= 85/u)
  assert.match(bodies['rd-workflow-ui-rubric'], /No UI/u)
  assert.match(bodies['rd-workflow-roles'], /Triage for this change/u)
  assert.match(bodies['rd-workflow-roles'], /Research roles/u)
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

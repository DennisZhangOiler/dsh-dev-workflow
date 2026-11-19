/**
 * Dev Workflow preset plugin.
 *
 * Mounted inside the `dev-workflow` agent preset only. It contributes one
 * fixed system-prompt section and the on-demand playbook skills for the
 * pipeline; it registers no Host-wide behavior, so sessions that select
 * another preset are unaffected.
 *
 * @module dsh-dev-workflow
 */

import { readFileSync } from 'node:fs'
import { dirname, join, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

/** Cordis plugin name. */
export const name = 'dev-workflow'

/** Services contributed by the Host composition this preset relies on. */
export const inject = ['systemPrompt', 'skills']

const HERE = dirname(fileURLToPath(import.meta.url))
const SKILLS_DIR = join(HERE, 'skills')
const SKILL_RESOURCE_BASE = SKILLS_DIR.split(sep).join('/')

/**
 * On-demand reference skills that accompany the fixed prompt section.
 * Bodies live in files so they stay reviewable and under the standard
 * preset's 8192-character tool-result pruner threshold.
 */
const SKILLS = [
  {
    name: 'dev-workflow',
    file: 'dev-workflow.md',
    description:
      'Detailed 10-phase delivery playbook: project-convention discovery, contracts, design exploration, delegation, testing, preview, and delivery.',
    whenToUse:
      'Load in Phase 0 whenever a Dev Workflow session starts a change, feature, UI task, test, review, or delivery.',
  },
  {
    name: 'dev-workflow-project-docs',
    file: 'dev-workflow-project-docs.md',
    description:
      'How to read and apply project conventions as natural language, with example AGENTS.md, docs/DEV_WORKFLOW.md, and docs/DELIVERY.md files.',
    whenToUse:
      'Load in Phase 0 and Phase 9 when locating, interpreting, or updating project workflow and delivery conventions.',
  },
  {
    name: 'dev-workflow-ui-rubric',
    file: 'dev-workflow-ui-rubric.md',
    description:
      'Generic 100-point UI scoring rubric with P0-P3 severity, evidence rules, mobile checks, accessibility checks, and the >=85 gate.',
    whenToUse:
      'Load in Phase 3 for independent UI scoring, and in Phase 7 when the verifier re-scores the final UI.',
  },
  {
    name: 'dev-workflow-roles',
    file: 'dev-workflow-roles.md',
    description:
      'Ready-to-send subagent role prompts, write-scope rules, delegation matrix, and the verifier report format.',
    whenToUse:
      'Load before Phase 2, Phase 3, Phase 5, Phase 6, or Phase 7 when delegating work to child agents.',
  },
]

/**
 * Register the prompt contract and playbook skills for the mounting preset.
 * @param {import('@deepseek-ai/cordis').Context} ctx - preset-scoped Cordis context.
 */
export function apply(ctx) {
  const contract = readFileSync(join(HERE, 'prompt.md'), 'utf8')

  ctx.effect(
    () =>
      ctx.systemPrompt.section({
        name: 'dev-workflow:contract',
        order: 100,
        text: contract,
        // The contract is prose; never interpolate `{{...}}` fragments.
        interpolate: false,
      }),
    'dev-workflow.section()',
  )

  for (const skill of SKILLS) {
    const content = readFileSync(join(SKILLS_DIR, skill.file), 'utf8')
    ctx.effect(
      () =>
        ctx.skills.register({
          name: skill.name,
          description: skill.description,
          whenToUse: skill.whenToUse,
          content,
          source: 'bundled',
          resourceBase: { kind: 'directory', path: SKILL_RESOURCE_BASE },
        }),
      `dev-workflow.skill(${skill.name})`,
    )
  }
}

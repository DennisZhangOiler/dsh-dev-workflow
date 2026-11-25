/**
 * R&D Workflow preset plugin.
 *
 * Mounted inside the `dev-workflow` agent preset only (the preset id is kept
 * for session compatibility). It contributes one fixed system-prompt section
 * and the on-demand playbooks for development, technical research, and
 * program orchestration. It registers no Host-wide behavior.
 *
 * @module dsh-rd-workflow
 */

import { readFileSync } from 'node:fs'
import { dirname, join, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

/** Cordis plugin name. */
export const name = 'rd-workflow'

/** Services contributed by the Host composition this preset relies on. */
export const inject = ['systemPrompt', 'skills']

const HERE = dirname(fileURLToPath(import.meta.url))
const SKILLS_DIR = join(HERE, 'skills')
const SKILL_RESOURCE_BASE = SKILLS_DIR.split(sep).join('/')

/**
 * On-demand reference skills. Bodies stay under the standard preset's
 * tool-result budget.
 */
const SKILLS = [
  {
    name: 'rd-workflow',
    file: 'rd-workflow.md',
    description:
      'Development playbook: request re-entry, project-convention discovery, contracts, UI triage and scoring, isolated testing, independent verification, preview, and delivery.',
    whenToUse:
      'Load for a change, fix, feature, refactor, UI task, test, review, or delivery.',
  },
  {
    name: 'rd-workflow-contract',
    file: 'rd-workflow-contract.md',
    description:
      'Acceptance contract, AC/DoD/NFR, risk tiers, traceability, and Phase 1/4/7 verification gates for development work.',
    whenToUse:
      'Load in Phase 1 to write the contract, Phase 4 to confirm it with the user, and Phase 7 to verify each AC.',
  },
  {
    name: 'rd-workflow-delivery',
    file: 'rd-workflow-delivery.md',
    description:
      'Verification commands, evidence bundles, reviewer independence, UI evidence, migration/rollback, and release/post-deploy gates.',
    whenToUse:
      'Load in Phase 6-9 for tests, verification evidence, migration, deployment, and release.',
  },
  {
    name: 'rd-workflow-research',
    file: 'rd-workflow-research.md',
    description:
      'Experiment-first technical research: broad directions and user choice, plan/results reviews, sandbox demos, measurements, representative slice, and development handoff.',
    whenToUse:
      'Load for a non-trivial technical investigation, architecture/dependency comparison, feasibility study, or root-cause analysis.',
  },
  {
    name: 'rd-workflow-research-review',
    file: 'rd-workflow-research-review.md',
    description:
      'Independent plan and results review rubric for technical research: scoring, blocking findings, claim verdicts, and explicit pass conditions.',
    whenToUse:
      'Load before starting research demos (plan review) and before delivering conclusions to the user (results review).',
  },
  {
    name: 'rd-workflow-program',
    file: 'rd-workflow-program.md',
    description:
      'Program-mode playbook: architecture/IA, independent demo score before freeze, vertical modules, contract tests, runtime isolation, recursive leads, and integration.',
    whenToUse:
      'Load for a new system, multi-module product, architecture/IA redesign, or a large feature split across agents.',
  },
  {
    name: 'rd-workflow-project-docs',
    file: 'rd-workflow-project-docs.md',
    description:
      'How to read, bootstrap, and apply project conventions as natural language, including UI, research, and delivery examples.',
    whenToUse:
      'Load in Phase 0/R0 and during delivery when locating, interpreting, or recording project conventions.',
  },
  {
    name: 'rd-workflow-ui-rubric',
    file: 'rd-workflow-ui-rubric.md',
    description:
      'UI scoring rubric with per-area floors, anchors, calibration, real interaction/mobile/keyboard/a11y evidence, P0-P3 findings, and independent final scoring.',
    whenToUse:
      'Load for independent UI scoring in UI design work, and when a verifier re-scores final UI.',
  },
  {
    name: 'rd-workflow-roles',
    file: 'rd-workflow-roles.md',
    description:
      'Subagent role prompts, write scopes, code reviewer/verifier evidence records, research roles, and independence/fallback rules.',
    whenToUse:
      'Load when delegating UI, feature, test, research, verifier, program, or module work.',
  },
]

/**
 * Register the prompt contract and playbooks for the mounting preset.
 * @param {import('@deepseek-ai/cordis').Context} ctx - preset-scoped Cordis context.
 */
export function apply(ctx) {
  const contract = readFileSync(join(HERE, 'prompt.md'), 'utf8')

  ctx.effect(
    () =>
      ctx.systemPrompt.section({
        name: 'rd-workflow:contract',
        order: 100,
        text: contract,
        // The contract is prose; never interpolate `{{...}}` fragments.
        interpolate: false,
      }),
    'rd-workflow.section()',
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
      `rd-workflow.skill(${skill.name})`,
    )
  }
}

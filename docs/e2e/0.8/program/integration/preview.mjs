#!/usr/bin/env node
import { writeFileSync } from 'node:fs'
import { getReadiness } from '../provider/evidence-service.mjs'
import { toDashboard } from '../consumer/dashboard-api.mjs'

const data = toDashboard(await getReadiness(new URL('../provider/data/readiness.json', import.meta.url)))
writeFileSync(new URL('./integrated-preview.json', import.meta.url), JSON.stringify(data, null, 2) + '\n')
const rows = data.gates.map((g) => `<tr><td>${g.id}</td><td>${g.label}</td><td>${g.score ?? '—'}</td></tr>`).join('')
const html = `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>${data.title}</title><style>body{font:16px/1.5 system-ui;max-width:760px;margin:48px auto;padding:0 24px;color:#1d1a15;background:#f3efe6}h1{font-size:42px;line-height:1}table{width:100%;border-collapse:collapse;margin-top:24px}td,th{text-align:left;padding:10px;border-bottom:1px solid #cabfae}th{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#625b50}.decision{font-size:22px;margin-top:24px}.blocked{color:#8f2f2f}</style><h1>${data.title}</h1><p>${data.subtitle}</p><p class="decision">${data.decision}</p><p>Tests: ${data.tests}</p><table><thead><tr><th>Gate</th><th>State</th><th>Score</th></tr></thead><tbody>${rows}</tbody></table></html>`
writeFileSync(new URL('./integrated-preview.html', import.meta.url), html)
console.log(JSON.stringify(data))

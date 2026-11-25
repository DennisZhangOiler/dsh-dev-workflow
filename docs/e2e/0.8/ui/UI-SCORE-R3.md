# UI score R3 — A · Ledger readiness dashboard (content-update re-score)

- **Reviewer:** `ui-scorer-2` (independent, read-only; not the author)
- **Date:** 2026-11-25 (Asia/Shanghai)
- **Rubric:** `skills/rd-workflow-ui-rubric.md` — 100-point areas/floors, total >= 85, no P0/P1, at most 3 unresolved P2, hard gates 1–8. The project rubric is used unchanged.
- **Subject:** `docs/e2e/0.8/ui/direction-a.html` (SHA-256 `5d67a5…07a4`); current final set `final-desktop.png` (1440x900), `final-mobile.png` (390x844), `final-zoom200.png` (1440x900 output; 720x450 CSS @2x).
- **Why R3:** the page content changed after R2 (new current action, No-UI 8/8/89, UI 91, Program 86, high-risk rehearsal 86, package 194). Layout, interaction and styles are unchanged. This is a fresh re-score against the current page and three re-shot views; R2's 91 was not reused without re-checking.
- **Independence:** I re-rendered the current page at 1440x900, 390x844 and 720x450 CSS @2x, compared the three submissions pixel-by-pixel, re-ran the skip/CTA/evidence keyboard checks, re-measured contrast/targets/overflow, and re-read the new score records. Only this file was written; the HTML and images were not modified.
- **Scope:** normal static snapshot. The page remains a local read-only report; empty/loading/error/long-text/large-data application states are not required. The old `final-skip-focus.png` / `final-anchor.png` are from 13:56 and show the pre-update content; they are not used as current content evidence — the interaction states were re-checked live.

## Verdict

**PASS — 91/100 — 0 P0 / 0 P1 / 1 P2 / 8 P3.**

All eight areas are at/above floor, total >= 85, no P0/P1, and the single P2 is within the <=3 cap. The new content values are real and verified. **The one P2 is a content/status inconsistency introduced by this update:** the first score panel still says `Development / Program 78 · 3 个 E2E 缺失`, while the ledger now marks the development-side E2Es reviewed/rehearsed and blocker #2 says the development evidence is filled and only needs dedupe/re-score. The page can pass the UI-direction gate, but that stale summary should be fixed before this content is frozen.

## Score

| Area | Score | Floor | Result | Evidence |
|---|---:|---:|---|---|
| Task clarity and hierarchy | **18/20** | 16 | PASS | Verdict, stamp, 78/84, primary CTA and one-screen hierarchy remain strong. The first-screen `3 个 E2E 缺失` contradicts the ledger and blocker #2 (P2-1). |
| Layout and responsiveness | **14/15** | 12 | PASS | 1440 two-column, 390/720 single-column; `scrollWidth` 1440/390/720 equals the viewport; 10-row table fits; no overflow. Right panel is ~29px taller than its content at 1440 (P3-4). |
| Interaction and feedback | **14/15** | 12 | PASS | Skip, primary and secondary anchors work; skip/CTA move focus to `#ledger`; next Tab goes to evidence; three evidence anchors are real. `#blockers` target is not focusable (P3-6). |
| Visual quality and consistency | **13/15** | 11 | PASS | The new 10-row ledger fills the right panel and removes the prior large empty bottom. Paper/ink/rust/moss/amber remain coherent; UA-blue evidence links, Chinese wrap splits and 11px tags remain (P3-1/2/3). |
| Accessibility | **14/15** | 12 | PASS | Amber/rehearsed tags 6.36:1; all visible DOM text >=5.84:1; controls 44px; focus visible; skip target focusable; 200% and 390 reflow verified; text labels not color-only. Inline note links are 15px-high line boxes (inline-link exception); first table column is still `<td>`. |
| Content and edge states | **8/10** | 8 | PASS | No-UI 8/8/89, UI 91, Program 86, high-risk 86, package 194, 12/12 and no-publish are verified against the new records. One stale summary line (P2-1); No-UI is a fixture-level PASS (P3-5). Static page; no app edge states required. |
| Performance and perceived speed | **5/5** | 4 | PASS | 10.5KB single HTML, no images, no external fonts or network; first render immediate. |
| Product and design-language fit | **5/5** | 4 | PASS | The evidence-ledger surface remains specific and coherent; the new evidence rows strengthen it without changing the design language. |
| **Total** | **91/100** | — | **PASS** | Every area at/above floor; total >=85; 0 P0/P1; 1 P2. |

Anchors: 0 = missing/unusable; 50 = present with a material gap; 100 = specific, measured, task-fit. Scores are based on the rendered UI, not intent.

## Findings

### P0 — Blocking

None.

### P1 — Major

None.

### P2 — Moderate

#### [P2-1] The score summary still says “3 个 E2E 缺失” after the development-side E2Es were filled

- **Location:** `direction-a.html:87`, `.score:first-child .s` (`未达 90 · 3 个 E2E 缺失`), also visible in `final-desktop.png` (1440) and `final-mobile.png` (390). The adjacent ledger rows are `:115–117`.
- **Evidence:** the rendered ledger now says `No-UI dev E2E 8/8 · verifier 89 PASS` (`reviewed`), `UI / Program E2E UI 91 · Program 86` (`reviewed`), and `high-risk rehearsal 86 PASS · real apply pending` (`rehearsed`). The page's own blocker #2 (`:98`) says `开发侧证据已补但需去重评分`. `docs/VERIFICATION.md` §1, §3 and §5–6 record package 194, the No-UI 8/8/89 fixture, UI 91, Program 86 and high-risk 86. The previously missing UI-design, Program and high-risk E2Es are therefore not missing (UI and Program share one ledger row; No-UI is an additional row). The score summary is the only text that still says they are missing.
- **Reason:** Content and status consistency; the first-screen summary contradicts the ledger and blocker. It also makes the `78` look as if it still has three missing E2Es, while the real remaining dev issue is dedupe/re-score/freeze.
- **User impact:** a reader may believe the development-side E2Es were never run and plan to rerun them, instead of re-scoring the evidence already present. The page's “not ready” conclusion itself remains correct (research final, calibration and dev re-score are still open), so this is a moderate summary defect, not a false release claim.
- **Fix:** change the subtext to `3 个 E2E 已补，待去重评分` (or `上轮 78 · 待重评`); optionally name the dedupe/re-score/freeze in the current-action line. Keep the real 3 open blockers (calibration, dev re-score, research final). Do not add data or new panels.
- **Re-review:** at 1440/390/720, the score summary and the ledger/blocker tell the same story; no `缺失` vs `reviewed/rehearsed` contradiction; the open items are the three in the blocker panel.

### P3 — Minor (grouped; not gate)

- **P3-1 · Chinese line breaks remain.** `.lede` / `.decision p`: 1440 and 720 split `…阻止 90` / `分的缺口`; 1440 also splits `…现有评审分` / `别停在…`; 390 splits `…独立评` / `分、` and `…评审 ≥` / `90/100。`. Same as R2; no nowrap wrappers were added. Fix: `90&nbsp;分`, a nowrap span around `评分`/`分别`, and `white-space:nowrap` on the `≥ 90/100` strong; re-check 1440/390/720.
- **P3-2 · Evidence links still use the UA default blue.** `.note a`: 13px, `rgb(0,0,238)`, underline, 15px line boxes; functional and high-contrast, but the only off-system color on the page. Style with `--ink`/`--rust` and keep the underline/focus ring. (The three anchors are real and resolvable; the 44px inline-link exception is recorded in gate 6.)
- **P3-3 · Table semantics / status vocabulary.** The first body cell is still `<td>` (row headers missing); statuses mix `reviewed`, `blocked`, `rehearsed`, `unpublished`, `green`; `GREEN` names a color. The new `rehearsed` is honest for high-risk (real apply pending) but adds to the mixed vocabulary. Use `<th scope="row">` and a one-line legend; keep text labels.
- **P3-4 · Desktop panel stretches ~29px beyond the note.** `.layout` / `#ledger`: panel bottom 1054.5, note block bottom 1025.6. This is much smaller than R2's ~74–110px and is no longer a visible empty box, but the CSS stretch remains; `.layout { align-items:start; }` would remove it. Do not add filler.
- **P3-5 · Evidence qualification: No-UI is fixture-level; Program/high-risk are narrow PASSes.** The page's `No-UI dev E2E 8/8 · verifier 89 PASS` is the separate `docs/e2e/0.8/no-ui/` fixture; `VERIFIER-R2.md` explicitly scopes it as fixture-level, not the 0.8 No-UI E2E gate, and `VERIFICATION.md` says the earlier 18/18 live run remains the original. Program 86 has 5 P2 and high-risk 86 has 8 P2; the table's `reviewed`/`rehearsed` is a coarse summary. Add `fixture` / `narrow` to the evidence strings or a short qualifier in the note; do not change the scores.
- **P3-6 · Minor keyboard/focus inconsistency.** Enter on “只看缺口” sets `#blockers` and scrolls correctly, but `#blockers` has no `tabindex`, so `activeElement` becomes `BODY`; the skip target gets the UA 1px ring while links get the designed 3px rust ring. Add `tabindex="-1"` and focus `#blockers` if this jump should behave like the primary skip; add a consistent skip-target focus style.
- **P3-7 · Cross-platform serif identity.** Chinese falls back to sans on this Linux render while Latin stays Georgia/serif; the “ledger serif” is Songti SC/macOS-dependent. Add a Chinese serif fallback/webfont if the identity must hold cross-platform, or accept the sans.
- **P3-8 · Evidence-pack hygiene after the content update.** The old `final-skip-focus.png` and `final-anchor.png` (13:56) show the pre-update content; the README's final list no longer includes them, but they remain in the directory. The current three new views are exact; `final-zoom200.png` is byte-identical to R2 because the changed content is below the first 450 CSS, so it proves the 720x450 top but not the new table. I checked the full 720 page (1725px, no overflow). If these are kept as evidence, re-shoot the interaction states and add a full-page 390/1440 capture; remove/rename the old files.

## Content verification (new values)

| Claim on the page | Source | Result |
|---|---|---|
| 当前动作：继续补调研终审与文档一致性 | page only; matches the open research blocker and the re-score/freeze blocker #2 | Consistent as a summary; it omits the dev dedupe/re-score named in blocker #2 (part of P2-1 fix). |
| No-UI dev E2E 8/8 · verifier 89 PASS | `docs/VERIFICATION.md` §3; `docs/e2e/0.8/no-ui/VERIFIER-R2.md:21,38` | Verified; **fixture-level** PASS, not the original 18/18 live run, not the 0.8 No-UI E2E gate (P3-5). |
| UI 91 · Program 86 | `docs/VERIFICATION.md` §5; `UI-SCORE-R2.md`; `PROGRAM-SCORE-R2.md:20` | Verified: UI 91 PASS, 0 P0/P1/P2; Program 86 PASS narrow, 5 P2. |
| high-risk rehearsal 86 PASS · real apply pending | `docs/VERIFICATION.md` §6; `HIGH-RISK-SCORE-R4.md:23` | Verified: 86 PASS narrow, 0 P0/P1, 8 P2; real apply and post-deploy not executed. |
| Package 194 files | `docs/VERIFICATION.md:24` | Verified. |
| Tests 12/12 | `docs/VERIFICATION.md:17` | Verified. |
| no publish / tag / push / install | `docs/VERIFICATION.md` §7–8 | Verified; page shows NOT PUBLISHED, UNPUBLISHED, BLOCKED, active profile 0.7.0, tag none, commit none. |
| “3 个 E2E 缺失” | page `:87` vs ledger `:115–117` and blocker #2 `:98` | **Contradicted by the page itself**; P2-1. The previously missing UI-design, Program and high-risk E2Es are filled and awaiting dedupe/re-score; the No-UI fixture is also reviewed; the score summary is stale. |
| 78 / 84 flow scores and “≥ 90/100” bar | UI README:9; page; `VERIFICATION.md`; research docs | 78/84 are the prior flow scores; the 90 bar is still not in the project rubrics (UI 85, research 80). Same residual risk as R2. |

## Gate checklist

- [x] **1. Every area at/above floor** — Task 18/16, Layout 14/12, Interaction 14/12, Visual 13/11, Accessibility 14/12, Content 8/8, Performance 5/4, Product 5/4.
- [x] **2. Total >= 85** — 91.
- [x] **3. No P0/P1; no more than 3 unresolved P2** — 0 P0, 0 P1, 1 P2; 8 P3 (no cap on P3).
- [x] **4. Real key actions complete** — skip/primary/secondary anchors and the three evidence links work; skip and primary CTA focus `#ledger`; next Tab continues at evidence; the `#blockers` target caveat is P3-6.
- [x] **5. No 390 overflow; 200% usable** — `scrollWidth` 390/720/1440 equals the viewport; the 720x450 @2x artifact is current (0 diff), the updated 10-row table fits the full 720 page (1725px) with no horizontal overflow.
- [x] **6. Keyboard/focus/contrast/targets verified** — discrete controls 44px; amber and rehearsed tags 6.36:1; all visible text >=5.84:1; focus visible; skip target focusable; no color-only meaning. The evidence links are inline prose links with 15px line boxes, treated under the standard inline-link exception; if the project requires 44px for inline anchors, that remains the one explicit open decision.
- [x] **7. Required states present** — static local report; no empty/loading/error/long/large app states required; the ledger carries missing/blocked/rehearsed/unpublished content states. If this becomes a live dashboard, design those states.
- [x] **8. Project rubric mapped without weakening gates** — `skills/rd-workflow-ui-rubric.md` used as-is; no floors or gates were weakened. The only interpretation is the inline-link target-size exception in gate 6.

## Screenshots and hashes

| Input | SHA-256 | Note |
|---|---|---|
| `direction-a.html` | `5d67a58da1d61fba870a549d316f5afecef706f99719cba537326f8befd507a4` | Current |
| `final-desktop.png` | `657ebe9e2cab32211d58fe1ab9429dd4e31ee80a6f6a3b82c4af0d97dd3d436a` | 1440x900; 0 diff vs current render |
| `final-mobile.png` | `d86a224da9ba04e72319dc754b2bc9c7ecea1d582c178acc1de298c9a19264bc` | 390x844; 0 diff |
| `final-zoom200.png` | `43803c8f9a044d5f39bbb9f1d160a42d75325c99543d5c0a9f4f80fd26b52cd1` | 1440x900; 720x450 @2x; 0 diff; byte-identical to R2 because the change is below 450 CSS |
| `final-skip-focus.png` | `6994e41ea519c3b2d6bc5b52dac1e8c5e11c10ef5235bc76a91663867827b437` | 13:56; pre-update content; not used for current content |
| `final-anchor.png` | `2533a52d4a36cb522449e773d3d62340b939358dd5a25206d19c8df1c6c67438` | 13:56; pre-update content; not used for current content |
| `UI-SCORE-R2.md` | `394fd433f8dacb2363fd923be3e7d789a7d6cbc6a538e009b0a5c303f80a383a` | Prior score (91, PASS) |
| `docs/VERIFICATION.md` | `5699ed719bf239952237403771c0eb37713ddca26668c1818edd4cca745ba5d1` | New 194 / UI 91 / Program 86 / high-risk 86 claims |
| `README.md` | `20c8e992a86109963f9780e13133da7c216ef097d4d8de8a929ab32c51d4a8ef` | Updated final list; still cites R2's 91 |
| `USER-ACCEPTANCE.md` | `52440852b05e4696607e6346b9cfe3d08be11159e6a7019615b0b8d693b1ec15` | Accepted 14:13, before the 15:10 content update |

- desktop: `docs/e2e/0.8/ui/final-desktop.png` (1440x900; pixel-identical to current render)
- mobile: `docs/e2e/0.8/ui/final-mobile.png` (390x844; pixel-identical)
- 200%: `docs/e2e/0.8/ui/final-zoom200.png` (1440x900 output; 720x450 CSS @2x; pixel-identical; the updated table is below the first 450 CSS and was verified in a full 720x1725 render)
- reviewer-side full pages (temporary, outside the repo): 1440x1195, 390x2167, 720x1725; all have no horizontal overflow.

## Residual risks

1. **P2-1 must be fixed before this content is frozen.** The page's first-screen status says 3 E2Es are missing while its ledger/blocker say the development-side evidence is filled. The fix is text-only; re-score after.
2. **The 90/100 bar and the 78/84 flow scores are not independently archived.** The UI README and page carry 78/84; the 90 bar is still absent from the project rubrics (UI 85, research 80). If 90 is the user's bar, cite it; otherwise the page overstates the documented gate. The “not ready” conclusion holds either way.
3. **No-UI 8/8/89 is fixture-level.** `VERIFIER-R2.md` explicitly disclaims the 0.8 No-UI E2E gate and the original 18/18 live run; the table's shorthand should be qualified (P3-5).
4. **Program 86 and high-risk 86 are narrow PASSes** with 5 and 8 P2 respectively; the table's `reviewed`/`rehearsed` is not a clean pass. The docs carry the detail; the page should not imply more with the tag alone.
5. **User acceptance predates the content update.** `USER-ACCEPTANCE.md` is 14:13; the page/screenshots are 15:10. If acceptance is meant to cover the exact content, re-confirm. The acceptance is for the preview, not release.
6. **The old interaction screenshots are stale.** `final-skip-focus.png` / `final-anchor.png` show the pre-update ledger; the live behavior was re-checked, but the files are not current content evidence. Re-shoot or remove them; add a full-page 390/1440 capture if the pack needs it.
7. **The 200% artifact proves the first screen only.** The content update is below 450 CSS; the full 720 page was checked but is not in the pack. If the 200% evidence must include the new rows, add a full-page or lower-scroll 200% capture.
8. **One independent scorer.** This is a re-score by the same independent reviewer; the rubric recommends two for important UI with a tie-break if totals differ by >7. A second score would need fresh screenshots, not this number.
9. **The inline evidence links are 15px-high line boxes** (132x15/148x15/94x15); the standard inline-link exception is used. If the project applies 44px to inline anchors, wrap them into 44px rows.

## Keep

Keep the editorial verdict, the red **NOT PUBLISHED** stamp, the paper/ink/rust/moss palette, the mono ledger labels, the honest amber/red treatment, the new evidence rows, the single first-screen CTA and the working skip link. The P2 fix and P3 polish should not flatten the page into generic admin cards or add new panels/data.

**Bottom line: PASS — 91/100; 0 P0 / 0 P1 / 1 P2 / 8 P3; every area at/above floor; total >= 85. The new scores are verified and the three new captures are current. Fix the stale “3 个 E2E 缺失” summary (P2-1) before freezing; the UI direction itself passes. The release remains not ready (research final, calibration, dev re-score, real apply pending).**

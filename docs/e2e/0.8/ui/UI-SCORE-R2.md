# UI score R2 — A · Ledger readiness dashboard

- **Reviewer:** `ui-scorer-2` (independent, read-only; not the author)
- **Date:** 2026-11-25 (Asia/Shanghai)
- **Rubric:** `skills/rd-workflow-ui-rubric.md` — 100-point areas/floors, total >= 85, no P0/P1, at most 3 unresolved P2, plus hard gates 1–8. The project rubric is used unchanged.
- **Subject:** `docs/e2e/0.8/ui/direction-a.html` (SHA-256 `ab5bd6…77961`); final set `final-desktop.png`, `final-mobile.png`, `final-zoom200.png`, `final-skip-focus.png`, `final-anchor.png`.
- **Independence:** I read the previous `UI-SCORE.md` but re-ran the page in headless Chrome, re-measured contrast/targets/focus/overflow, and re-rendered every submitted state. The submitted captures were then compared pixel-by-pixel with my render; no prior score or finding was reused without a recheck.
- **Scope:** normal static snapshot. The UI README defines this as a local report; empty/loading/error/long-text/large-data **application** states are not required. The table does show missing/blocked/partial content states. Only this file was written; the HTML and images were not modified.

## Verdict

**PASS — 91/100 — 0 P0 / 0 P1 / 0 P2 / 7 P3 (polish only).**

All eight areas are at or above floor, the total is >= 85, and there is no P0/P1. All five prior P2 findings (the six requested re-checks) are closed. The remaining items are P3 and do not fail the gate. This is the UI-direction gate only: the release remains blocked by the page's own content (UI/Program E2E, high-risk evidence, human approval).

## Prior P2 re-check (five findings; six requested checks)

| Prior finding | Result | Independent evidence |
|---|---|---|
| **P2-1** amber contrast 4.25:1 | **FIXED** | `--amber: #7a5115`; `.tag.amber` 11px/700 on the rendered panel composite `#f7f4ef` = **6.36:1** (>= 4.5). All visible DOM text is >= **5.84:1**; the rust ordinal pseudo-element is ~5.0:1. No text-contrast failures in the audit. |
| **P2-2** buttons/skip 34/32px | **FIXED** | `.hero-actions .btn.primary` **110.3x44**, secondary **84.9x44**, `.skip` **104x44**. Visible focus rings remain 3px rust. |
| **P2-3** skip target not focusable | **FIXED** | `#ledger` has `tabindex="-1"`. Tab -> skip (104x44, 3px rust) -> Enter: `document.activeElement` is `SECTION#ledger`, hash `#ledger`, scrollY 295 (1440) / 1285 (390). Next Tab lands on the first evidence link, not on the header buttons. The ledger gets a visible UA 1px ring (focus-visible). |
| **P2-4** 200% evidence was a 2x 1440 screenshot | **FIXED** | `final-zoom200.png` is 1440x900 with report size `720x450`, `zoom: 2`; it is a true 720 CSS viewport at 2x. My fresh 720x450@2x render is **pixel-identical (0 diff)**; `scrollWidth = 720`, single column (`grid: 680px`), full page 720x1704, no horizontal overflow. The old `final-zoom200.jpg` (2880x1800, 2x desktop) is stale and still referenced by the README — see P3-5. |
| **P2-5** CTA below fold / duplicate / `<b>` links | **FIXED** | Hero CTA visible at 1440 y=325–369, 390 y=287–331, 720 y=252–296; only one on-screen `#ledger` CTA (`display:none` on the old `.actions` duplicate). The note now has three real `<a>` elements with working relative hrefs (`../research/`, `../../../VERIFICATION.md`, `./`). The function is fixed; the UA-blue styling is a new P3-1, not a remaining P2. |

## Score

| Area | Score | Floor | Result | Evidence |
|---|---:|---:|---|---|
| Task clarity and hierarchy | **19/20** | 16 | PASS | Verdict headline + NOT PUBLISHED stamp + 78/84; primary CTA is the filled black button and is in the first screen at 1440/390/720; secondary jump is outline-only; one CTA per target. |
| Layout and responsiveness | **14/15** | 12 | PASS | 1440 two-column, 390/720 single-column; `scrollWidth` 1440/390/720 equals the viewport, no horizontal overflow; 200% reflow holds. Right panel is stretched at 1440 (P3-3). |
| Interaction and feedback | **14/15** | 12 | PASS | Skip, primary CTA and secondary jump work; skip and CTA move focus to `#ledger`; next Tab continues at evidence; three evidence anchors are keyboard-focusable. `#blockers` target is not focusable (P3-6). No form states in scope. |
| Visual quality and consistency | **12/15** | 11 | PASS | Paper/ink/rust/moss/amber, mono labels, tabular scores and hairlines are coherent. Docked for UA-blue links, three wrap splits, stretched empty panel and 11px tags/status treatment. No decorative noise. |
| Accessibility | **14/15** | 12 | PASS | Contrast pass (amber 6.36:1, all text >=5.84:1); discrete targets 44px; visible focus; skip target focusable; 200% and 390 reflow verified; text labels not color-only. Inline note links are 15px line boxes (inline-link exception — see gate 6 caveat); first table column is still `<td>`. |
| Content and edge states | **8/10** | 8 | PASS | 12/12, 114 files, no publish and the status table are verified. 78/84 and the ">= 90/100" bar are only in the UI README (residual risk 1). Static snapshot; no app edge states required. |
| Performance and perceived speed | **5/5** | 4 | PASS | ~10.5KB single HTML, no images, no external fonts or network; first render is immediate; no heavy JS. |
| Product and design-language fit | **5/5** | 4 | PASS | The "evidence ledger" is a specific, coherent surface for a release-readiness report, not a generic admin template; the selected A direction is preserved. |
| **Total** | **91/100** | — | **PASS** | Every area at/above floor; total >=85; 0 P0/P1; 0 P2. |

Anchors: 0 = missing/unusable; 50 = present with a material gap; 100 = specific, measured, task-fit. Scores are based on the rendered UI, not the intent.

## Findings

### P0 — Blocking

None.

### P1 — Major

None.

### P2 — Moderate

None. The six prior P2s are closed; the remaining issues are P3.

### P3 — Minor (grouped; not gate)

- **P3-1 · `.note a` — evidence links use the UA default blue.** Location: `direction-a.html:122`; 13px inline anchors, computed `rgb(0,0,238)`, underline; visible in `final-anchor.png` and the 390 full page. It is functional and high-contrast, but it is the only off-system color on a paper/ink/rust page. Fix: style with `--ink` or `--rust`, keep a clear underline and the existing 3px rust focus ring; re-check at 1440/390. Re-review: the note looks like part of the ledger, not a browser default.
- **P3-2 · Chinese line breaks still split numbers/units/operator.** Location: `.lede` (`direction-a.html:72`) and `.decision p` (`:85`). Measured with Range rects: 1440 and 720 split `…阻止 90` / `分的缺口`; 390 splits `…独立评` / `分、` and `…评审 ≥` / `90/100。`. This is the prior improvement-1 and is **not fixed** (only the slash was removed; no nowrap wrappers were added). Fix: `90&nbsp;分`, a nowrap span around `评分`, and `white-space:nowrap` on the `≥ 90/100` strong; optionally `text-wrap:pretty` on the paragraphs; re-check 1440/390/720.
- **P3-3 · Desktop ledger panel is stretched, leaving ~74px of extra panel at the bottom.** Location: `.layout` (`:23`), `#ledger` (`:106`). At 1440 the panel bottom is 1054.5 and the note block ends at 980.3 (last link line 944.6, last text line 966.3) — about 74px of extra panel below the note block (the note block includes its 14px padding); the left column sets the row height. At 390/720 the panel is content-height. Fix: `.layout { align-items: start; }`; do not add filler content. Re-review: the note's bottom padding closes the panel.
- **P3-4 · Table row headers and status vocabulary.** Location: `.ledger` (`:108–121`). `<caption class="sr">` and `th scope="col"` are present, but the first body cell is `<td>`; statuses mix process (`reviewed/blocked/missing`), signal (`green`) and release property (`unpublished`); `GREEN` names a color. Fix: `<th scope="row">` for the item column, add a one-line legend or unify the words, and consider 12px for `th`/`.tag` if it fits. Keep text labels.
- **P3-5 · Evidence-pack hygiene around 200% and full page.** Location: `docs/e2e/0.8/ui/README.md:7–8`, `final-zoom200.jpg`, `direction-a-report.json`. The README still names `final-zoom200.jpg`; the valid 200% artifact is `final-zoom200.png` (verified above). The old `.jpg` is 2880x1800 (2x of a 1440 layout), and the old `direction-a-report.json` still reports 12 items at 10px while the final reports lint clean. The pack has no full-page 390/1440 capture; I verified with reviewer-side renders. Fix: update the README final list, remove/rename the stale JPG and old report, add the full-page captures. No UI change.
- **P3-6 · Minor keyboard/focus inconsistency.** Location: `#blockers` (`:93`) and the skip target `#ledger` (`:106`). Enter on "只看缺口" sets `#blockers` and scrolls correctly, but `#blockers` has no `tabindex`, so `document.activeElement` becomes `BODY`; the next Tab goes to the evidence links. The skip target gets the UA 1px `auto` ring while links get the designed 3px rust ring. Fix: add `tabindex="-1"` and focus `#blockers` on activation if this jump should behave like the primary skip; add a consistent focus style for the skip target. The primary skip and CTA already focus correctly.
- **P3-7 · Cross-platform serif identity.** Location: `body` font stack (`:14`). The submitted Linux render shows Chinese sans while Latin falls back to Georgia/serif; the "ledger serif" is macOS/Songti SC-dependent. Fix: add a Chinese serif webfont/fallback (e.g. Noto Serif SC) if the identity must hold cross-platform, or accept the sans; do not add a network font without approval. This is a recorded risk, not a blocker.

## Improvements (not gate)

- **Craft:** the strongest parts are the verdict, the rotated **NOT PUBLISHED** stamp, the score panel and the hairline table. The weakest crafted spots are exactly the P3s: the default-blue evidence links, the three wrap splits and the stretched empty panel. Fixing those makes the 100% view feel as intentional as the 200% view; the 11px table labels are readable but would benefit from 12px if the columns still fit.
- **Design sense:** one-word concept is **ledger** on both desktop and mobile; the composition is `hero + two score columns + evidence ledger`, and it does not repeat a generic template. The 480 desktop and 180 mobile thumbnails still read as an editorial release ledger; the first eye is the bold verdict, then the stamp, then 78/84. Do not add a hero image or more panels; the table and decision card are two views of the same ledger, not competing modules.
- **Motion:** none. This is a static report; no motion is needed and none was observed. The anchor jumps and focus scroll are instantaneous, which is appropriate. If smooth scrolling is ever added, honor the existing `prefers-reduced-motion` rule; do not add a page-wide fade.

## Three-second / category check

- **480px desktop:** high-end editorial release ledger from an engineering org, not a generic admin dashboard. First eye: "0.8 候选可以审阅，但还不能发布。", the red NOT PUBLISHED stamp, then 78/84 and the evidence table.
- **180px mobile:** a printed release-readiness memo. First eye: the bold verdict, the stamp, the CTA, then the 78 score. The Chinese headline and paper/ink palette remain recognizable at thumbnail size.
- **Category:** internal release-readiness report. The category baseline is a status table/scorecard; this deliberately uses a newspaper/ledger surface. That is a coherent departure, not a template.
- **No veto trigger:** the main subject is identifiable in three seconds; the page does not pretend to be published; the primary action is visible; the visual is not a placeholder.

## Content verification

| Claim | Repo evidence | Result |
|---|---|---|
| dev 78 / research 84 | `docs/e2e/0.8/ui/README.md:9`; page score panel | Values present and not colored green. Only the UI README asserts them; no independent archived flow record. **Residual risk 1.** |
| 12/12 tests | `docs/VERIFICATION.md:17` | Verified (`npm test`: 12 tests, 12 pass). |
| 114 files | `docs/VERIFICATION.md:24` | Verified (`npm pack`: 114 files). |
| no publish / tag / push / install | `docs/VERIFICATION.md:163,170` | Verified; page shows NOT PUBLISHED, UNPUBLISHED, BLOCKED, active profile 0.7.0, tag none, commit none. |
| verifier 27/27 | `docs/VERIFICATION.md:70` | Verified. |
| plan review REVISE 86 -> PASS 90 | `docs/e2e/0.8/research/PLAN-REVIEW-R2.md:20` | Verified. |
| results review PASS 90 | `docs/e2e/0.8/research/RESULTS-REVIEW.md:22` | Verified. |
| memo review PASS | `docs/e2e/0.8/research/MEMO-REVIEW.md:26` | Verified. |
| calibration F7 REVISE 57 | `docs/e2e/0.8/research/CALIBRATION-INDEPENDENT-R4.md:48` | Verified. |
| "must both be >= 90/100" | not found in `docs/VERIFICATION.md` or the UI/research rubrics (UI gate 85, research gate 80) | Not independently traceable; if 90 is the user's release bar, cite it. The "not ready" conclusion still holds (78 and 84 are below 85/90; UI/Program E2E is open). **Residual risk 1.** |
| UI / Program E2E "not run" | page snapshot, 2026-11-25 | True at capture time; after this score the UI part is scored but user acceptance is still pending. **Residual risk 3.** |

## Gate checklist

- [x] **1. Every area at/above floor** — Task 19/16, Layout 14/12, Interaction 14/12, Visual 12/11, Accessibility 14/12, Content 8/8, Performance 5/4, Product 5/4.
- [x] **2. Total >= 85** — 91.
- [x] **3. No P0/P1; no more than 3 unresolved P2** — 0 P0, 0 P1, 0 P2; 7 P3 (no cap on P3).
- [x] **4. Real key actions complete** — skip/primary/secondary anchors and the three evidence links operate; focus moves to `#ledger` after skip and primary CTA; next Tab continues at evidence.
- [x] **5. No 390 horizontal overflow; 200% zoom usable** — `scrollWidth` 390/720/1440 equals the viewport; the 200% artifact is a genuine 720x450 CSS @2x reflow (pixel-identical to my re-render); single column, no clipping, table readable.
- [x] **6. Keyboard/focus/contrast/targets verified** — discrete controls 44px; amber 6.36:1, all visible text >=5.84:1; focus rings visible; skip target focusable; no color-only meaning. **Caveat:** the three evidence links are inline prose links with 15px line boxes; I treat them under the standard WCAG inline-link exception. If the project requires 44px for inline anchors as well, that is the one open item (not a discrete control) and gate 6 would need an explicit decision.
- [x] **7. Required states present** — static local report; the UI README does not require empty/loading/error/long/large app states; the table carries missing/blocked/partial content states. If this becomes a live dashboard, those states must be designed.
- [x] **8. Project rubric mapped without weakening gates** — this report uses `skills/rd-workflow-ui-rubric.md` as-is; the floors and gates 1–8 are applied. The only interpretation is the inline-link target-size exception recorded in gate 6.

## Inputs and hashes

| Input | SHA-256 |
|---|---|
| `direction-a.html` | `ab5bd6ec79a178bf8b070ca38068695649b77155a4a905894e8d60038e177961` |
| `final-desktop.png` | `adf23d41cb46852ca81b4039f610f1c653724bc7889d1f3b4888892540e34bd6` |
| `final-mobile.png` | `c6b3c901306dd31916a6079710285c08e4afa9224e98c75cf6a25b51c05ae5a2` |
| `final-zoom200.png` | `43803c8f9a044d5f39bbb9f1d160a42d75325c99543d5c0a9f4f80fd26b52cd1` |
| `final-skip-focus.png` | `6994e41ea519c3b2d6bc5b52dac1e8c5e11c10ef5235bc76a91663867827b437` |
| `final-anchor.png` | `2533a52d4a36cb522449e773d3d62340b939358dd5a25206d19c8df1c6c67438` |
| `final-zoom200.jpg` (stale, not used) | `2c45f807c37cbfd885f38dae9a21cfd032aa8b81db128e40872b0664fe9f7f80` |
| `README.md` | `c1e874b16e4edd02c3184170ad710a825e4809a7d3832f95044c30caa46528e3` |
| `USER-CHOICE.md` | `693da451b67840b748f47fa2f7bf9927a35000643a86a837891a3b2f179c2713` |

Reviewer-side probes (temporary, outside the repo): `/tmp/ui-r2-review/clean-1440-full.png` (1440x1195), `clean-390-full.png` (390x2138), `clean-720-full.png` (720x1704), `clean-720x450-2x.png`, `clean-1440-skipfocus.png`, `clean-1440-cta-target.png`. The submitted top captures were pixel-identical to the corresponding probes; `final-anchor.png` matched the CTA target except for the 1px focus ring (mouse vs keyboard, 0.6% of pixels).

## Screenshots

- desktop: `docs/e2e/0.8/ui/final-desktop.png` (1440x900; 0 diff vs fresh render)
- mobile: `docs/e2e/0.8/ui/final-mobile.png` (390x844; 0 diff)
- 200%: `docs/e2e/0.8/ui/final-zoom200.png` (1440x900 output; 720x450 CSS @2x; 0 diff; `scrollWidth` 720)
- skip focus: `docs/e2e/0.8/ui/final-skip-focus.png` (1440x900; 0 diff; skip 104x44, 3px rust)
- anchor: `docs/e2e/0.8/ui/final-anchor.png` (1440x900; CTA target; focus-ring-only diff)
- stale: `docs/e2e/0.8/ui/final-zoom200.jpg` (2880x1800; 2x of a 1440 layout; not a 200% reflow; README still references it)

## Residual risks

1. **78/84 and the 90 threshold are not independently archived.** The UI README states dev 78/research 84; the research docs archive 90/100 review scores but the ">= 90" gate is not in the rubrics (UI >=85, research >=80). If 90 is the user's bar, cite it; otherwise the page overstates the documented gate. The "not ready" conclusion holds either way.
2. **The stale 200% JPG and README remain.** The valid 200% artifact is `final-zoom200.png`; `final-zoom200.jpg` is the old 2x desktop capture and the README still points to it. Remove/rename it and update the README so a later reviewer cannot pick the wrong artifact.
3. **Snapshot staleness.** After this score, the `UI / Program E2E` row and the "3 个 E2E 缺失" line are out of date for the next round; update them and re-score if the HTML changes. Do not reuse 91 for a changed page.
4. **Inline evidence links are 15px-high line boxes** (132x15, 148x15, 94x15 at both 1440 and 390). This is the standard inline-link target-size exception, not a discrete-control failure; if the project applies 44px to inline anchors, wrap them into 44px rows.
5. **Cross-platform font:** Chinese falls back to sans on this Linux render while the Latin stays serif; Songti SC is macOS-only. The ledger identity is partly platform-dependent.
6. **Static state coverage:** no empty/loading/error/long-text/large-data application states; fine for a local snapshot, but a live dashboard will need them.
7. **One independent scorer.** This is one score; the rubric recommends two independent scorers for important UI with a tie-break if totals differ by >7. A second score would need fresh screenshots, not this number.
8. **320px width (not claimed):** the project claims 390; at 320 the headline's `word-break:keep-all` plus fixed `<br>` could orphan "0.8". Recorded as a risk, not a finding for the claimed viewport.

## Keep

Keep the editorial verdict "0.8 候选可以审阅，但还不能发布。", the red **NOT PUBLISHED** stamp, the paper/ink/rust/moss palette, the mono ledger labels, the honest amber/red treatment (no green release), the single first-screen CTA and the working skip link. The P3 fixes should make the evidence links and line breaks belong to that system without flattening the page into generic admin cards.

**Bottom line: PASS — 91/100; 0 P0 / 0 P1 / 0 P2; 7 P3; every area at/above floor; total >= 85. The direction can go to user preview; the release remains not ready by the page's own content.**

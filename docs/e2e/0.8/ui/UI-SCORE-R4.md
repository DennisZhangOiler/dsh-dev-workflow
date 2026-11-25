# UI score R4 — A · Ledger readiness dashboard (final re-score)

- **Reviewer:** `ui-scorer-2` (independent, read-only; not the author)
- **Date:** 2026-11-25 (Asia/Shanghai)
- **Rubric:** `skills/rd-workflow-ui-rubric.md` — 100-point areas/floors, total >= 85, no P0/P1, at most 3 unresolved P2, hard gates 1–8. The project rubric is used unchanged.
- **Subject:** `docs/e2e/0.8/ui/direction-a.html` (SHA-256 `096fdb…be49d`); current final set `final-desktop.png` (1440x900), `final-mobile.png` (390x844), `final-zoom200.png` (1440x900 output; 720x450 CSS @2x).
- **Why R4:** the final content fix was applied after R3 — `3 个 E2E 缺失` became `E2E 已补，待终审`, and `Package 194` became `207`; the user accepted the page at 16:03. Layout, interaction and styles are unchanged. This is a fresh re-score of the current page and the three re-shot views; R3's score/findings were not reused without re-checking.
- **Independence:** I re-rendered the current page at 1440x900, 390x844 and 720x450 CSS @2x, compared all three submissions pixel-by-pixel, re-ran the skip/CTA/evidence keyboard checks, re-measured contrast/targets/overflow, and independently re-read the package and score records. Only this file was written; the HTML and images were not modified.
- **Scope:** normal static snapshot. The page is a local read-only report; empty/loading/error/long-text/large-data application states are not required. The old `final-skip-focus.png` / `final-anchor.png` (13:56) show the pre-update content and are not used as current content evidence; the interaction states were re-checked live.

## Verdict

**PASS — 92/100 — 0 P0 / 0 P1 / 1 P2 / 8 P3.**

All eight areas are at/above floor, total >= 85, no P0/P1, and the single P2 is within the <=3 cap. The R3 P2 is fixed: the first-screen score summary now says `未达 90 · E2E 已补，待终审`, which agrees with the reviewed/rehearsed development rows and blocker #2. The new P2 is a content/evidence issue: **`Package 207 files` is not reproducible from the current tree** — `docs/VERIFICATION.md:24` still says **194**, while a current `npm pack --dry-run --json` reports **233** entries. The package count must be frozen to one number/source before this content is final.

## Score

| Area | Score | Floor | Result | Evidence |
|---|---:|---:|---|---|
| Task clarity and hierarchy | **19/20** | 16 | PASS | Verdict, stamp, 78/84, primary CTA and one-screen hierarchy remain strong. The R3 `3 个 E2E 缺失` contradiction is gone; the summary, ledger and blocker now agree. The wording `待终审` is broader than blocker #2's dedupe/re-score (P3-5, minor). |
| Layout and responsiveness | **14/15** | 12 | PASS | 1440 two-column, 390/720 single-column; `scrollWidth` 1440/390/720 equals the viewport; 10-row table fits; no overflow. Right panel is ~29px taller than its content at 1440 (P3-4). |
| Interaction and feedback | **14/15** | 12 | PASS | Skip, primary and secondary anchors work; skip/CTA focus `#ledger`; next Tab goes to evidence; three evidence anchors are real. `#blockers` target is not focusable (P3-6). |
| Visual quality and consistency | **13/15** | 11 | PASS | Paper/ink/rust/moss/amber coherent; the 10-row ledger fills the panel. UA-blue evidence links, Chinese wrap splits and 11px tags remain (P3-1/2/3). |
| Accessibility | **14/15** | 12 | PASS | Amber/rehearsed tags 6.36:1; all visible DOM text >=5.84:1; controls 44px; focus visible; skip target focusable; 200% and 390 reflow verified; text labels not color-only. Inline note links are 15px-high line boxes (inline-link exception); first table column is still `<td>`. |
| Content and edge states | **8/10** | 8 | PASS | E2E 已补 status is consistent; No-UI 8/8/89, UI 91, Program 86, high-risk 86, 12/12 and no-publish are verified. Package 207 is **not** verified (P2-1); No-UI is fixture-level (residual risk 3); static page, no app edge states required. |
| Performance and perceived speed | **5/5** | 4 | PASS | 10.6KB single HTML, no images, no external fonts or network; first render immediate. |
| Product and design-language fit | **5/5** | 4 | PASS | The evidence-ledger surface remains specific and coherent; the final content strengthens it without changing the design language. |
| **Total** | **92/100** | — | **PASS** | Every area at/above floor; total >=85; 0 P0/P1; 1 P2. |

Anchors: 0 = missing/unusable; 50 = present with a material gap; 100 = specific, measured, task-fit. Scores are based on the rendered UI, not intent.

## Findings

### P0 — Blocking

None.

### P1 — Major

None.

### P2 — Moderate

#### [P2-1] `Package 207 files` is not reproducible; the docs still say 194 and the current pack is 233

- **Location:** `direction-a.html:119` (Package row `207 files · local only`), visible in `final-desktop.png` at 1440; `docs/VERIFICATION.md:24` says **194 files**; the page/acceptance references say 207.
- **Evidence:** I ran `npm pack --dry-run --json` in the current tree: **233 entries** (`dsh-rd-workflow-0.8.0.tgz`, 3,108,127 bytes, unpacked 4,371,026), before this R4 file; adding it makes 234. The page says 207; `docs/VERIFICATION.md` says 194; `USER-ACCEPTANCE.md` (16:03) says the content was corrected to 207. This is three different package counts for one readiness claim. The package count changes as untracked `docs/` evidence is added; the page's 207 is a snapshot, not the current pack.
- **Reason:** Content/evidence accuracy; the readiness ledger must have one reproducible package count. The P2 is about the evidence chain, not the UI layout.
- **User impact:** a reader cannot tell which package was actually measured/tested; the page's user-accepted `207` is not the current `npm pack`, and the project verification still says 194. The package is local/unpublished and the release remains blocked, so this is a moderate evidence defect, not a false release claim.
- **Fix:** freeze the exact package (re-run `npm pack` at the candidate state, update `docs/VERIFICATION.md` and the page to the same count; if review artifacts are intentionally excluded, document the exclusion and the command/time). Then update the README/acceptance references to R4 and the frozen count. Do not add new data.
- **Re-review:** the page, `docs/VERIFICATION.md`, and the reproduced `npm pack` count agree on one number and one freeze time; the acceptance record matches.

### P3 — Minor (grouped; not gate)

- **P3-1 · Chinese line breaks remain.** `.lede` / `.decision p`: 1440 and 720 split `…阻止 90` / `分的缺口`; 1440 also splits `…现有评审分` / `别停在…`; 390 splits `…独立评` / `分、` and `…评审 ≥` / `90/100。`. Same as R2/R3; no nowrap wrappers were added. Fix: `90&nbsp;分`, a nowrap span around `评分`/`分别`, and `white-space:nowrap` on the `≥ 90/100` strong; re-check 1440/390/720.
- **P3-2 · Evidence links still use the UA default blue.** `.note a`: 13px, `rgb(0,0,238)`, underline, 15px line boxes; functional and high-contrast, but the only off-system color on the page. Style with `--ink`/`--rust` and keep the underline/focus ring. (The three anchors are real and resolvable; the 44px inline-link exception is recorded in gate 6.)
- **P3-3 · Table semantics / status vocabulary.** The first body cell is still `<td>` (row headers missing); statuses mix `reviewed`, `blocked`, `rehearsed`, `unpublished`, `green`; `GREEN` names a color. The new `rehearsed` is honest for high-risk but adds to the mixed vocabulary. Use `<th scope="row">` and a one-line legend; keep text labels.
- **P3-4 · Desktop panel stretches ~29px beyond the note.** `.layout` / `#ledger`: panel bottom 1054.5, note block bottom 1025.6. This is small and not a visible empty box, but the CSS stretch remains; `.layout { align-items:start; }` would remove it. Do not add filler.
- **P3-5 · Summary wording vs blocker detail.** The score summary says `E2E 已补，待终审`; blocker #2 says `开发侧证据已补但需去重评分` and `评分后文档改动需 re-score/冻结`. The summary's `终审` is broader than the blocker's dedupe/re-score step; a reader may not know the sequence. Prefer `E2E 已补，待去重评分/终审` or keep the blocker as the detailed source; the acceptance can stand.
- **P3-6 · Minor keyboard/focus inconsistency.** Enter on “只看缺口” sets `#blockers` and scrolls correctly, but `#blockers` has no `tabindex`, so `activeElement` becomes `BODY`; the skip target gets the UA 1px ring while links get the designed 3px rust ring. Add `tabindex="-1"` and focus `#blockers` if this jump should behave like the primary skip; add a consistent skip-target focus style.
- **P3-7 · Cross-platform serif identity.** Chinese falls back to sans on this Linux render while Latin stays Georgia/serif; the “ledger serif” is Songti SC/macOS-dependent. Add a Chinese serif fallback/webfont if the identity must hold cross-platform, or accept the sans.
- **P3-8 · Evidence-pack references and old captures.** The old `final-skip-focus.png` / `final-anchor.png` (13:56) show pre-update content; the README still cites R2's 91 and `0 P0/P1/P2`; `docs/VERIFICATION.md` still says 194 and UI 91/R2; the 16:03 acceptance says 91/R3 with 1 P2. The current three views are exact; `final-zoom200.png` is byte-identical to R2/R3 because the changed content is below the first 450 CSS, so it proves the 720x450 top but not the new table (the full 720 page is 1725px, no overflow). Re-shoot the interaction states and add a full-page 390/1440 capture; update the README/verification/acceptance references to R4/92 and the frozen package count.

## Content verification (current values)

| Claim on the page | Source | Result |
|---|---|---|
| E2E 已补，待终审 | page `:87`; ledger `:115–117`; blocker #2 `:98` | R3 P2 fixed: no “缺失” vs reviewed/rehearsed contradiction. The `终审` wording vs the blocker's dedupe/re-score is P3-5. |
| No-UI dev E2E 8/8 · verifier 89 PASS | `docs/VERIFICATION.md` §3; `docs/e2e/0.8/no-ui/VERIFIER-R2.md:21,38` | Verified; **fixture-level** PASS, not the original 18/18 live run, not the 0.8 No-UI E2E gate (residual risk 3). |
| UI 91 · Program 86 | `docs/VERIFICATION.md` §5; `UI-SCORE-R2.md`; `PROGRAM-SCORE-R2.md:20` | Verified: UI 91 PASS, 0 P0/P1/P2; Program 86 PASS narrow, 5 P2. |
| high-risk rehearsal 86 PASS · real apply pending | `docs/VERIFICATION.md` §6; `HIGH-RISK-SCORE-R4.md:23` | Verified: 86 PASS narrow, 0 P0/P1, 8 P2; real apply and post-deploy not executed. |
| Package 207 files | page `:119`; `docs/VERIFICATION.md:24` (194); current `npm pack` (233) | **Not reproducible**; three counts; P2-1. |
| Tests 12/12 | `docs/VERIFICATION.md:17` | Verified. |
| no publish / tag / push / install | `docs/VERIFICATION.md` §7–8 | Verified; page shows NOT PUBLISHED, UNPUBLISHED, BLOCKED, active profile 0.7.0, tag none, commit none. |
| 78 / 84 flow scores and “≥ 90/100” bar | UI README:9; page; research docs | 78/84 are the prior flow scores; the 90 bar is still not in the project rubrics (UI 85, research 80). Same residual risk as R2/R3. |
| User acceptance | `USER-ACCEPTANCE.md` 16:03 | The current page was opened and accepted (“能看到并接受”); the record's 91/R3/1 P2 score is stale relative to this R4 92/1 P2. |

## Gate checklist

- [x] **1. Every area at/above floor** — Task 19/16, Layout 14/12, Interaction 14/12, Visual 13/11, Accessibility 14/12, Content 8/8, Performance 5/4, Product 5/4.
- [x] **2. Total >= 85** — 92.
- [x] **3. No P0/P1; no more than 3 unresolved P2** — 0 P0, 0 P1, 1 P2; 8 P3 (no cap on P3).
- [x] **4. Real key actions complete** — skip/primary/secondary anchors and the three evidence links work; skip and primary CTA focus `#ledger`; next Tab continues at evidence; the `#blockers` target caveat is P3-6.
- [x] **5. No 390 overflow; 200% usable** — `scrollWidth` 390/720/1440 equals the viewport; the 720x450 @2x artifact is current (0 diff); the updated 10-row table fits the full 720 page (1725px) with no horizontal overflow.
- [x] **6. Keyboard/focus/contrast/targets verified** — discrete controls 44px; amber and rehearsed tags 6.36:1; all visible text >=5.84:1; focus visible; skip target focusable; no color-only meaning. The evidence links are inline prose links with 15px line boxes, treated under the standard inline-link exception; if the project requires 44px for inline anchors, that remains the one explicit open decision.
- [x] **7. Required states present** — static local report; no empty/loading/error/long/large app states required; the ledger carries missing/blocked/rehearsed/unpublished content states. If this becomes a live dashboard, design those states.
- [x] **8. Project rubric mapped without weakening gates** — `skills/rd-workflow-ui-rubric.md` used as-is; no floors or gates were weakened. The only interpretation is the inline-link target-size exception in gate 6.

## Screenshots and hashes

| Input | SHA-256 | Note |
|---|---|---|
| `direction-a.html` | `096fdbf1a791e8892a0a4ecbfee5f6e7bb3acedc92d3fd93d13b91d502fbe49d` | Current |
| `final-desktop.png` | `ad282eb11469c3d53aa9d5fa70a9c2ad375aea840c7cd74181e5f18926e2654b` | 1440x900; 0 diff vs current render |
| `final-mobile.png` | `a936ce80bc9a85aee1a875a13117f13c64f72ec6958240ff3a2f5a10f369312c` | 390x844; 0 diff |
| `final-zoom200.png` | `43803c8f9a044d5f39bbb9f1d160a42d75325c99543d5c0a9f4f80fd26b52cd1` | 1440x900; 720x450 @2x; 0 diff; byte-identical to R2/R3 because the change is below 450 CSS |
| `final-skip-focus.png` | `6994e41ea519c3b2d6bc5b52dac1e8c5e11c10ef5235bc76a91663867827b437` | 13:56; pre-update content; not used for current content |
| `final-anchor.png` | `2533a52d4a36cb522449e773d3d62340b939358dd5a25206d19c8df1c6c67438` | 13:56; pre-update content; not used for current content |
| `UI-SCORE-R3.md` | `2e1d11b61e20687634c9c7cbf429b9169575295dcd641981cdc0fcfd5ad5844c` | Prior score: 91, 1 P2 |
| `README.md` | `20c8e992a86109963f9780e13133da7c216ef097d4d8de8a929ab32c51d4a8ef` | Still cites R2/91; final list is current |
| `USER-ACCEPTANCE.md` | `75568e24d341efc2238b977ce58070522d47dea04509342e52e367655ca7205f` | Accepted 16:03; score reference 91/R3 is stale |
| `docs/VERIFICATION.md` | `b73ea80ba4376da27cdedad6d2c23ef848d5cd7839ae41950a446d8d9cf6916a` | Still says 194 files; see P2-1 |

- desktop: `docs/e2e/0.8/ui/final-desktop.png` (1440x900; pixel-identical to current render)
- mobile: `docs/e2e/0.8/ui/final-mobile.png` (390x844; pixel-identical)
- 200%: `docs/e2e/0.8/ui/final-zoom200.png` (1440x900 output; 720x450 CSS @2x; pixel-identical; the updated table is below the first 450 CSS and was verified in a full 720x1725 render)
- reviewer-side full pages (temporary, outside the repo): 1440x1195, 390x2167, 720x1725; no horizontal overflow.
- package probe (temporary, outside the repo): `npm pack --dry-run --json` = 233 entries at the probe, 234 with this R4 file; `docs/VERIFICATION.md` = 194; page = 207. P2-1.

## Residual risks

1. **P2-1 must be fixed before this content is frozen.** The page and acceptance say 207, `docs/VERIFICATION.md` says 194, and the current `npm pack` is 233 (234 with this R4 file). Freeze one package and one count; then update the README/acceptance references to R4/92.
2. **The 90/100 bar and the 78/84 flow scores are not independently archived.** The 90 bar is still absent from the project rubrics (UI 85, research 80). If 90 is the user's bar, cite it; otherwise the page overstates the documented gate. The “not ready” conclusion holds either way.
3. **No-UI 8/8/89 is fixture-level.** `VERIFIER-R2.md` explicitly disclaims the 0.8 No-UI E2E gate and the original 18/18 live run; the table's shorthand should be qualified (e.g. `No-UI fixture 8/8/89`); this is residual risk 3, not a gate P2.
4. **Program 86 and high-risk 86 are narrow PASSes** with 5 and 8 P2 respectively; the table's `reviewed`/`rehearsed` is not a clean pass. The docs carry the detail; the page should not imply more with the tag alone.
5. **User acceptance references R3/91/one P2.** `USER-ACCEPTANCE.md` was written at 16:03, after the page update; it accepts the current page but cites the R3 score. The R4 result is 92/one P2 (package). Update the acceptance record to R4 if the score/package count is part of acceptance; the user's “能看到并接受” remains the relevant acceptance.
6. **The old interaction screenshots are stale.** `final-skip-focus.png` / `final-anchor.png` (13:56) show the pre-update ledger; the live behavior was re-checked, but the files are not current content evidence. Re-shoot or remove them; add a full-page 390/1440 capture if the pack needs it.
7. **The 200% artifact proves the first screen only.** The content update is below 450 CSS; the full 720 page was checked but is not in the pack. If the 200% evidence must include the new rows, add a full-page or lower-scroll 200% capture.
8. **One independent scorer.** This is a re-score by the same independent reviewer; the rubric recommends two for important UI with a tie-break if totals differ by >7. A second score would need fresh screenshots, not this number.
9. **The inline evidence links are 15px-high line boxes** (132x15/148x15/94x15); the standard inline-link exception is used. If the project applies 44px to inline anchors, wrap them into 44px rows.

## Keep

Keep the editorial verdict, the red **NOT PUBLISHED** stamp, the paper/ink/rust/moss palette, the mono ledger labels, the honest amber/red treatment, the new evidence rows, the single first-screen CTA and the working skip link. The P2 fix and P3 polish should not flatten the page into generic admin cards or add new panels/data.

**Bottom line: PASS — 92/100; 0 P0 / 0 P1 / 1 P2 / 8 P3; every area at/above floor; total >= 85. The R3 E2E-status P2 is fixed, the new screenshots are current, and the user acceptance is recorded. Freeze the package count (194 vs 207 vs 233/234) before this content is final; the UI direction itself passes. The release remains not ready (research final, calibration, dev final review, real apply pending).**

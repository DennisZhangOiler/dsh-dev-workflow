> **SUPERSEDED** by `UI-SCORE-R2.md` (91/100 PASS, P0/P1/P2 = 0). This is the first-round 86/FAIL record kept for history.

# UI score — A · Ledger / readiness dashboard

- **Reviewer:** `ui-scorer-1` (independent, read-only; not the author)
- **Date:** 2026-11-25 (Asia/Shanghai)
- **Rubric:** `skills/rd-workflow-ui-rubric.md` — 100-point areas/floors, total >= 85, no P0/P1, plus the rubric's hard gates 1–8. No floors or gates were weakened.
- **Subject:** `docs/e2e/0.8/ui/direction-a.html`; final captures `final-desktop.png`, `final-mobile.png`, claimed `final-zoom200.jpg`.
- **Scope:** normal/static snapshot only. The pack does not contain empty, loading, error, long-text, or large-data UI states; the UI README does not require them for this report. I did not edit the HTML or any screenshot; this file is the only write.

## Verdict

**FAIL — 86/100 — 0 P0 / 0 P1.**

The total is >= 85 and there is no P0/P1, but **Accessibility is 11/15, below its 12/15 floor**, and there are **5 unresolved P2** (contrast, touch targets, skip-link target, invalid 200% evidence, action/evidence affordance), exceeding the rubric's 3-P2 cap. The direction does **not** pass the per-area-floor + hard-gate gate and should not go to user preview acceptance as-is.

The visual concept is strong; the failures are concrete and mostly cheap to fix.

## Quick checklist (fix in this order)

- `[P2-1]` `.tag.amber`（`PARTIAL`, `UNPUBLISHED`）: 11px 琥珀色 `#9a6b1f` 在面板底色上只有 **4.25:1** → 达到 >= 4.5:1（换深琥珀如 `#7a5214`，或用 ink/moss），并保留文字状态。
- `[P2-2]` `.actions .btn` / `.skip`: 实测高 **34px / 32px** → 触控目标至少 **44x44**（`min-height:44px` + 居中，或加大 padding）。
- `[P2-3]` `.skip` → `#ledger`: 目标 section 不可聚焦；点跳转后焦点落到 `BODY`，下一次 Tab 回到上方 `.actions` → 给 `#ledger` 加 `tabindex="-1"` 并验证“跳过后 Tab 不再回到上方”。
- `[P2-4]` `final-zoom200.jpg`: 实际是 **2880x1800 / 2x DPR** 的 1440 CSS 桌面截图，不是 200% zoom 回流；且扩展名是 `.jpg`、字节是 PNG → 重新用 720 CSS 视口（1440 物理像素、200%）截真正的回流图，保存为正确格式并更新 report。
- `[P2-5]` `.actions` / `.note`: “查看证据台账”主按钮在 1440x900 和 390x844 首屏都看不到，且与旁边的台账重复；“证据链接”下面的三个路径是 `<b>` 不是 `<a>` → 要么删掉两个页内跳转按钮，要么把唯一的主动作放进首屏；证据路径改成真实链接或改称“证据路径”。
- `[提升-1]` 390/720 的中文断行: 桌面 `90 / 分的缺口`、390 `独立评 / 分`、390 `≥ / 90/100` → 用 `90&nbsp;分`、`≥ 90/100` 不可断行、`text-wrap:pretty`，修到目标视口不再拆数字/单位/比较符。
- `[提升-2]` 桌面右栏: 证据台账面板被 grid 拉伸到和左栏等高，note 下方留 ~130px 空盒 → `align-items:start` 或让面板按内容结束；不要用新内容填满。
- `[提升-3]` 表格/状态: 首列仍是 `<td>`；状态词混用 `REVIEWED/BLOCKED/GREEN/UNPUBLISHED`，11px 表头/标签偏小 → 加 `<th scope="row">`、统一状态词、必要时 12px。

## Score

| Area | Score | Floor | Result | Evidence |
|---|---:|---:|---|---|
| Task clarity and hierarchy | **17/20** | 16 | PASS | 首屏“0.8 候选可以审阅，但还不能发布”+ NOT PUBLISHED 章 + 78/84 分数清楚；主按钮不在首屏且与台账重复（P2-5）。 |
| Layout and responsiveness | **14/15** | 12 | PASS | 1440 两栏 / 390 单栏 / 720 单栏均成立；390 无横向溢出；桌面右栏底部空盒（P3）。 |
| Interaction and feedback | **13/15** | 12 | PASS | 两个页内 anchor 可跳转；skip 目标不可聚焦（P2-3）；证据路径不是链接（P2-5）；无表单/加载态。 |
| Visual quality and consistency | **13/15** | 11 | PASS | 纸张/墨/锈红/苔绿/大写 mono 一致，无装饰噪音；三处中文断行、空格面板、字体回退偏弱（P3）。 |
| Accessibility | **11/15** | 12 | **FAIL** | 琥珀 4.25:1；按钮 34px、skip 32px；skip 目标；200% 证据无效；焦点可见、名称/表格 caption/scope/非纯色状态可用。 |
| Content and edge states | **8/10** | 8 | PASS | 真实事实已核对：12/12、114 files、27/27、no publish；状态未写成绿色；无 empty/loading/error/long/large（静态快照，N/A）。78/84/90 来源见风险。 |
| Performance and perceived speed | **5/5** | 4 | PASS | 纯静态 10KB HTML，无图片/JS/网络；首屏即时可用。 |
| Product and design-language fit | **5/5** | 4 | PASS | “证据台账”体裁与 A 方向一致；不是通用后台模板；无既有 design system 冲突。 |
| **Total** | **86/100** | — | **FAIL** | 总分 >= 85，但 Accessibility 低于 floor；5 个未解决 P2。 |

Scoring anchors used: 0 = missing/unusable; 50 = present with a material gap; 100 = specific, measured, task-fit. Scores are based on the rendered UI, not intent. The 480px desktop and 180px mobile thumbnails were also checked for the three-second test.

## Three-second / category check

- **480px desktop:** reads like a high-end editorial release ledger from an engineering org, not a generic admin dashboard. First eye: the large “0.8 候选可以审阅，但还不能发布。” and the red NOT PUBLISHED stamp; then 78/84 and the evidence table.
- **180px mobile:** reads like a printed release-readiness memo; first eye: the bold verdict, the stamp, then the decision card. The Chinese headline and the paper/ink palette are recognizable at thumbnail size.
- **Category:** internal release-readiness dashboard. The category baseline is a status table or scorecard; this deliberately uses a newspaper/ledger surface. That is a coherent, distinctive departure, not a template. The hierarchy is clear; the failure is not the concept.
- **No veto trigger:** the main subject is identifiable in three seconds; the page does not pretend to be published; the primary action is a separate P2, not “no action at all” (the page is a static report; reading the table is the task).

## P0 — Blocking

None.

## P1 — Major

None. The defects are P2/P3; the direction does not pass because of the accessibility floor and the P2 cap/hard gates, not because a P0/P1 was found.

## P2 — Moderate

### [P2-1] Amber status text fails AA contrast (4.25:1)

- **Location:** `direction-a.html` `.tag.amber` → table rows “No-UI dev E2E” (`PARTIAL`) and “Package” (`UNPUBLISHED`), lines 113/116; rendered in `final-desktop.png` at 1440x900 and in the full mobile page.
- **Evidence:** `.tag` is 11px/700 (`font:700 11px/1.3 ...`), color `#9a6b1f`; panel background is `rgba(255,255,255,.34)` over `--paper #f3efe6`, composited to `#f7f4ee` (screenshot pixel `(247,244,238)`). Computed contrast: **4.25:1** on the panel, **4.07:1** on paper; WCAG AA for normal-size text is **4.5:1**. The screenshot confirms the two amber labels are the faintest text in the table. Other tokens pass: muted 6.11:1, moss 6.65:1, red 7.31:1, ink 15.1:1.
- **Reason:** Rubric Accessibility floor (12) / hard gate 6: contrast; WCAG 1.4.3. The tag also uses 11px, so the large-text exception does not apply.
- **User impact:** Low-vision users and anyone on a dim display will struggle to read the caution states; `PARTIAL`/`UNPUBLISHED` are exactly the states that must not be missed.
- **Fix:** Use a darker amber for the tag text (target >= 4.5:1 on `#f7f4ee`, e.g. `#7a5214`; verify with a contrast tool) or use `--ink`/`--moss` and keep the amber only for a decorative border. Keep the text labels; do not rely on color.
- **Re-review:** Amber tag text measured >= 4.5:1 on the actual panel background at 1440 and 390; screenshot shows the labels at least as legible as the red/moss tags.

### [P2-2] Touch targets are 34px / 32px high, below 44x44

- **Location:** `direction-a.html` `.actions .btn` (“查看证据台账” and “只看缺口”, line 100) and `.skip` (line 65). Buttons sit below the blockers; skip is keyboard-only offscreen.
- **Evidence:** `.btn` is `font:700 12px/1` + `padding:10px 13px` + 1.5px border → 34px high; headless Chrome measured 104.3x34 and 78.9x34. `.skip` is 12px line + 10px padding → **32px** high. Both are < 44px. The full-page render also shows the buttons as small black/outline chips.
- **Reason:** Rubric Accessibility hard gate 6: touch targets >= 44x44. This is the only set of tappable controls on the page.
- **User impact:** Mobile users with motor impairments or in a hurry get a smaller-than-required hit area; the primary action is also the furthest down the mobile page.
- **Fix:** Give `.btn` and `.skip` `min-height:44px` and `display:inline-flex; align-items:center` (or equivalent 44px hit area); keep the visual size if desired with a wrapper, but the interactive box must be >=44x44. If the buttons are removed per P2-5, this finding is limited to `.skip` and any new evidence links.
- **Re-review:** Measured bounding boxes for every interactive target at 1440 and 390 are >=44x44; visible focus remains.

### [P2-3] Skip link scrolls, but its target cannot take focus

- **Location:** `direction-a.html` `.skip` → `href="#ledger"` (line 65); target `<section class="panel" id="ledger">` (line 104).
- **Evidence:** The skip link itself works visually: on focus it moves to `top:12px` with a 3px rust outline (measured 100x32 at 12,12). But `#ledger` has no `tabindex`; after activating the link, `location.hash` is `#ledger` while `document.activeElement` is `BODY` (headless Chrome; the section's `tabIndex` property is -1 with no attribute). DOM order puts the `.actions` links (line 100) **before** `#ledger`, so the next Tab returns to the two buttons above the table instead of continuing at the ledger. The skip link therefore does not skip for keyboard users.
- **Reason:** Rubric hard gate 6: keyboard path and focus; the accessible skip-link pattern requires a focusable target (or JS focus management).
- **User impact:** Keyboard users see the page jump to the ledger, then Tab jumps back up; the affordance is misleading and the keyboard path is not shortened.
- **Fix:** Add `tabindex="-1"` to `#ledger` and, if needed, move focus on hash change; alternatively relocate `.actions` after `#ledger` so the natural next focus is below the target. Verify with real Tab presses, not just `.focus()`.
- **Re-review:** Tab to “跳到证据台账”, Enter: viewport moves to the ledger; next Tab does not land on `.actions` above it; focus is visible and logical.

### [P2-4] The “200% zoom” evidence is a 2x-DPR 1440 screenshot, not a 200% reflow

- **Location:** `docs/e2e/0.8/ui/final-zoom200.jpg`; report `final-zoom200-report.json`.
- **Evidence:** `file` says **PNG image data, 2880x1800** (the `.jpg` extension is wrong; `read_image` refused it). The report says `size: "1440x900", zoom: 2, file: "page-@2x.png"`. The image shows the full **two-column 1440 layout** at 2x, not the single-column layout that a true 200% zoom of a 1440 window produces (CSS viewport 720; `@media(max-width:860px)` in the source switches to one column). So it is a valid 2x/retina capture, but not evidence for 200% zoom/reflow. I additionally rendered at 720x450 CSS (reviewer-side, temporary) and saw the single-column layout with no horizontal overflow; that probe is not in the pack and cannot be cited as the submitted 200% evidence.
- **Reason:** Rubric inputs require measured 200% zoom/reflow evidence; hard gate 5. A mislabeled artifact can let a real regression through.
- **User impact:** A reviewer or user cannot verify the state; a low-vision user who relies on 200% zoom has no evidence the page reflows; tools that trust `.jpg` may refuse to open it.
- **Fix:** Capture the actual 200% state: 720 CSS viewport at 2x device scale (1440x900 output) with the browser at 200% zoom, or a 720x450 viewport if using CSS-width equivalence; include the top and the table; save as PNG (or a real JPEG); update the report to say “200% zoom / 720 CSS viewport”, not “zoom: 2”. Also rename the existing retina file if it is kept.
- **Re-review:** The 200% artifact opens as its declared format; its CSS viewport/zoom is documented; the page is single-column and `document.documentElement.scrollWidth <= innerWidth`; no horizontal scroll; table and actions readable.

### [P2-5] Primary action is below the fold and the “evidence links” are not links

- **Location:** `.actions` (line 100, after the blockers) and `.note` “证据链接” (line 120).
- **Evidence:** At 1440x900 and 390x844, the first viewport ends before the action row; the full-page renders (reviewer-side, 1440x1300 and 390x2300) place the two buttons at roughly y=965 and y=1245. Both buttons are in-page jumps: “查看证据台账” targets the table already beside it (desktop) or immediately below it (mobile); “只看缺口” scrolls back up to the blockers immediately above the button. The note’s three evidence paths are `<b>` elements, not `<a>`; the label says “证据链接” but there is nothing clickable. The paths are also repo-root-relative (`docs/VERIFICATION.md`), not page-relative.
- **Reason:** Rubric Task clarity (primary action most prominent) and Interaction/feedback (key actions complete; no misleading labels); reviewer manual: remove duplicate/no-value controls. The page is a read-only report, so a primary button is optional — but the source declares `.btn.primary` and hides it.
- **User impact:** On the first screen there is no visible next step; on mobile the main action is more than a screen down; a user who wants the underlying record must copy a path by hand, and the label promises a link that does not exist.
- **Fix:** Choose one: (a) if the report needs no action, remove both jump buttons and let the table be the page (least code, strongest match to the read-only premise); or (b) keep one “查看证据台账” button and put it in the header/decision summary where it is visible, remove the back-jump “只看缺口”. Make the three evidence paths real anchors with correct relative hrefs from this page (e.g. `../../../VERIFICATION.md`, `../../../e2e/0.8/research`, `.`) or relabel them “证据路径” and keep them plain. Do not add new data/features.
- **Re-review:** At 1440x900 and 390x844 the chosen primary action (if kept) is visible in the first screen; no duplicate jump with no destination benefit; every evidence item labeled link is clickable, resolves from the page, and has visible focus.

## P3 — Minor (grouped)

- **Chinese line breaks (visual):** desktop lede wraps `...阻止 90 / 分的缺口`; 390 lede splits `独立评 / 分`, and the decision paragraph leaves `≥` at the line end before `90/100`. Fix with `90&nbsp;分`, a `white-space:nowrap` wrapper around `≥ 90/100`, `text-wrap:pretty`/`balance`, and a nowrap wrapper around `评分`; re-check 390 and 720. This is the intended typographic polish, not a blocker.
- **Desktop right panel empty bottom:** the evidence panel is stretched by the grid to the left column height; the note ends around y=882 while the border continues to y=1016 (full-page 1440). Set `.layout { align-items: start; }` or `align-self:start` on the panel; do not add filler content. The two-column bottom alignment becomes asymmetric, but the empty box disappears and the page reads as complete.
- **Table semantics and status vocabulary:** `<caption class="sr">` and `th scope="col"` are present (good), but the first column is `<td>`; use `<th scope="row">` for `项目`. Statuses mix process states (`REVIEWED`, `BLOCKED`, `MISSING`) with signals (`GREEN`) and release properties (`UNPUBLISHED`); pick one vocabulary or add a one-line legend. `th` and `.tag` are 11px; 12px would read better at 100%, especially on the mobile table. The `GREEN` label in particular is a color name, not a state.
- **Cross-platform font / 320 risk:** the stack relies on `"Songti SC"`, which is absent on this Linux/Chrome render; Chinese falls back to a sans while Latin renders serif/Georgia, so the “ledger serif” is partly platform-dependent. If the serif identity matters cross-platform, add a webfont or a Chinese serif fallback (or accept the sans). I also rendered 320 CSS width: the headline breaks `0.8` onto its own line because of `word-break:keep-all` + the fixed `<br>`; 320 is not claimed by this project (390 is), so this is a recorded risk, not a finding against the claimed viewport.
- **Evidence-pack inconsistency (process):** the pack contains only first-viewport captures; the primary action, third blocker, note, and footer are below them. Add a full-page capture for 1440 and 390. `direction-a-report.json` flags 12 small-text items at 10px while `final-desktop-report.json` reports no lint for the same-looking page; the current CSS has 11px `th`, right at the lint threshold. Reconcile the reports or remove stale reports from the final set.

## Improvements (not gate)

- **Craft:** the page already has a strong surface: paper, ink, rust/moss, all-caps mono labels, hairline table, rotated stamp, tabular scores. The weakest crafted part is the **right panel's empty bottom** and the **three wrap breaks**; after those, the biggest craft gap is the **11px status/header type** in the table. Fixing those makes the 100% view feel as intentional as the 2x crop.
- **Design sense:** the hero + NOT PUBLISHED stamp + two score columns is the strongest composition; the two tiny jump buttons and the empty bordered space are the weakest. The page's one-word concept is **ledger** on both desktop and mobile and does not repeat a template across screens; keep it. The table and decision card are two views of the same ledger, not competing modules. Do not add a hero image or more panels.
- **Motion:** none. This is a static report; no motion is needed and no animation was observed. The anchor jumps are instantaneous; that is appropriate. If smooth scrolling is ever added, honor the existing `prefers-reduced-motion` rule; do not add a page-wide fade for this report.

## Keep

Keep the editorial verdict “0.8 候选可以审阅，但还不能发布。”, the red **NOT PUBLISHED** stamp, the paper/ink/rust/moss palette, the mono ledger labels, and the honest red/amber status treatment. These are the direction's identity; fix the accessibility and hierarchy without flattening them into generic admin cards.

## Content verification (the four required facts)

| Claim on the page | Repo evidence | Result |
|---|---|---|
| dev 78 / research 84 | `docs/e2e/0.8/ui/README.md:9`; page score panel | Values are present and are **not** colored green; only the UI README asserts them, no independent review record is archived in the repo (risk). |
| 12/12 tests | `docs/VERIFICATION.md:17` | Verified (`npm test`: 12 tests, 12 pass). |
| 114 files | `docs/VERIFICATION.md:24` | Verified (`npm pack`: 114 files). |
| no publish / tag / push / install | `docs/VERIFICATION.md:163,170` | Verified; page shows `NOT PUBLISHED`, `UNPUBLISHED`, `BLOCKED`, no green release. |
| plan review 86 → 90 | `docs/e2e/0.8/research/PLAN-REVIEW-R2.md`; research README | Verified. |
| results review 90 | `docs/e2e/0.8/research/RESULTS-REVIEW.md` | Verified. |
| memo review PASS | `docs/e2e/0.8/research/MEMO-REVIEW.md` | Verified. |
| calibration F7 57 | `docs/e2e/0.8/research/CALIBRATION-INDEPENDENT-R4.md` | Verified. |
| verifier 27/27 | `docs/VERIFICATION.md:70` | Verified. |
| “must be >= 90/100” | not found in `docs/VERIFICATION.md` or the research/UI rubrics (research gate >=80, UI gate >=85) | Not independently traceable; if 90 is the user's release bar, cite it; otherwise the page overstates the documented gate. |

The page's color honesty is good: the only green status is **Tests 12/12 pass**, which is verified; `Package` is amber `UNPUBLISHED`; `UI / Program E2E` is red `MISSING`; `Release` is red `BLOCKED`. The claim “没有把黄色写成绿色” holds in the rendered table.

## Gate checklist

- [ ] **1. Every area at/above its floor** — Accessibility 11 < 12; all other areas pass.
- [x] **2. Total >= 85** — 86.
- [ ] **3. No P0/P1; no more than 3 unresolved P2 without owner/waiver** — 0 P0 / 0 P1, but 5 P2 above; no owner/waiver recorded.
- [x] **4. Real key actions complete** — two in-page anchors work and change the hash; the evidence paths are not clickable (P2-5); no form state to test.
- [ ] **5. No mobile horizontal overflow; 200% zoom/reflow usable** — 390 no overflow; reviewer 720 CSS probe reflows without overflow; the submitted `final-zoom200` is not that state (P2-4), so the pack's 200% evidence is not acceptable.
- [ ] **6. Keyboard/focus/contrast/touch targets verified** — focus is visible and named, no color-only meaning; contrast 4.25:1 (amber), buttons 34px, skip 32px, skip target not focusable.
- [x] **7. Required states present** — normal/static snapshot only; empty/loading/error/long-text/large-data are not required by the UI README and do not exist as application states. The table does show missing/blocked content states. If this becomes a live dashboard, design those states.
- [x] **8. Project rubric mapped without weakening gates** — this report uses `skills/rd-workflow-ui-rubric.md` as-is.

## Inputs and hashes

| Input | SHA-256 |
|---|---|
| `final-desktop.png` | `2b6a0ebd62e6f69f37ed81eb23deb3d66f9b748d1f64df67113f2cb690f9c1f1` |
| `final-mobile.png` | `31ebf7cad88d6a0770344dd6bab559b027e7141a442488aa9bb01aef2dd72420` |
| `final-zoom200.jpg` (actually PNG) | `2c45f807c37cbfd885f38dae9a21cfd032aa8b81db128e40872b0664fe9f7f80` |
| `direction-a.html` | `25852ef58d792a97f3b6917bb5f0e1ca020ef816f030b353d34ccd3921d4c82b` |
| `README.md` | `c1e874b16e4edd02c3184170ad710a825e4809a7d3832f95044c30caa46528e3` |
| `USER-CHOICE.md` | `693da451b67840b748f47fa2f7bf9927a35000643a86a837891a3b2f179c2713` |

Screenshots:
- desktop: `docs/e2e/0.8/ui/final-desktop.png` (1440x900)
- mobile: `docs/e2e/0.8/ui/final-mobile.png` (390x844)
- claimed 200%: `docs/e2e/0.8/ui/final-zoom200.jpg` (PNG 2880x1800; 2x DPR of 1440, not 200% reflow)
- source: `docs/e2e/0.8/ui/direction-a.html`

I also used reviewer-side headless Chrome renders for the full pages and the 720/320 probes (1440x1300, 390x2300, 720x1600, 320x900). They were temporary and are not part of the submitted pack; the repo was not modified except for this score file.

## Residual risks

1. **78/84 and the 90 threshold are not independently archived.** The UI README states dev 78/research 84, but no review record in the repo contains those final flow scores; the “>= 90/100” bar is not in `docs/VERIFICATION.md` or the research/UI rubrics (85/80). If 90 is the user's release bar, add its source; otherwise the page's central threshold is overstated. This does not change the “not ready” conclusion, but it weakens the evidence-ledger claim.
2. **200% evidence remains invalid** until recaptured; the 2x retina image is useful but must not be labeled 200% zoom. The `.jpg`/PNG mismatch is a separate deliverable bug.
3. **Cross-platform font:** the Chinese serif identity depends on Songti SC (macOS); on this render the Chinese is sans. A macOS user will see a different page; if consistency matters, lock the font stack/webfont.
4. **320 CSS width:** the headline's `word-break:keep-all` plus fixed `<br>` orphans `0.8` at 320; the project claims 390 only. If 320 support or extreme zoom of mobile is required, fix the break strategy and re-test.
5. **Static state coverage:** no empty/loading/error/long-text/large-data states; fine for a local snapshot, but if this becomes a live dashboard, they are missing and the table's stretching/overflow behavior at larger data is untested.
6. **Staleness:** the page's `UI / Program E2E` row says “not run” while this UI E2E is now in progress. After the score and user acceptance, update the table/date and re-score; do not reuse this number for a changed page.
7. **One scorer:** this is one independent score. The rubric recommends two independent scorers for important UI with a tie-break if the totals differ by >7; no second score is recorded. The verifier step can re-check; if a second score is required, run it with fresh screenshots, not this number.
8. **Evidence-pack lint inconsistency:** `direction-a-report.json` flags 12 small-text items at 10px, while `final-desktop-report.json` reports no lint; reconcile before treating the reports as evidence. The current 11px table header is just below the lint threshold and still small.

**Bottom line:** **86/100; 0 P0 / 0 P1; total >= 85; no P0/P1 — numerically meets those two numbers, but the direction does NOT pass**: Accessibility 11/15 < floor 12/15, 5 unresolved P2, and hard gates 5/6 (200% evidence, contrast/touch/keyboard) are not met. Fix the five P2s and re-score with a true 200% capture; the design itself is strong enough to reach the high 80s/90 once accessibility is honest.

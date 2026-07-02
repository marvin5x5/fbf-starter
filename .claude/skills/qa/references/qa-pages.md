# QA Pages Checklist — {{CLIENT_NAME}}

## Source: `static-website-reference/` static HTML → Elementor Pro WordPress

**QA Role:** Pixel-perfect verification of the developer's Elementor build against the static design source.

---

## What this document is

This is the **page-by-page QA verification checklist** — verbatim copy plus expected section order for every project page. It is built up in page batches as pages are handed to QA, so it grows over the life of the build. QA reads **only the section for the target page**; do not scan the whole file.

For every page you fill in the reusable block below (one per page), then verify each section against `static-website-reference/`. All copy is **verbatim** from the design source — do not accept paraphrasing, punctuation, or casing changes.

---

## How to use this document

1. **Duplicate the "Per-page QA checklist" template block below once per project page.** Fill in the page name/slug, the expected section order, and the per-section checks.
2. Work top-to-bottom through the section order. For each check, mark:
   - `[ ]` = Outstanding / not yet verified
   - `[x]` = Verified pass
   - `[!]` = Issue found — log it inline as **expected vs. actual** (see below)
3. **Log every discrepancy as expected-vs-actual**, e.g. `[!] h2 font size: expected --text-3xl (design), actual 28px hard-coded`. Enough detail that the developer can act without re-deriving it.
4. **Route all `[!]` items back to the developer.** QA does not fix; QA reports.
5. **No sign-off with open discrepancies.** A page passes QA only when every check on it is `[x]`. Any `[!]` blocks the gate.

Compare every numeric/colour/type value against `scss/abstracts/_tokens.scss` (the single source of design tokens) — never against hard-coded values in the Elementor output.

---

## Shared elements (verify once, then reference per page)

Header, Footer, and any floating widget are built as Theme Builder templates applied to all pages. Verify them once against the design, then in each page block just confirm they render and reference this section rather than re-listing every check.

- **Header** — logo (`<asset>`, `<height>`, links home), nav items + dropdowns (`<dropdown behaviour / delay>`), phone/CTA, sticky/scroll behaviour (`<blur/shadow trigger>`), mobile hamburger below `<breakpoint>`.
- **Footer** — background `var(--brand-primary-900)` (confirm token), logo, tagline `<verbatim>`, social icons (`<size / radius>`), nav columns `<list per column>`, reviews/credentials rows, contact row, legal/disclaimer `<verbatim — must not be truncated or altered>`, copyright, attribution.
- **Floating widget (if any)** — position/offset, appear trigger (`<scrollTop threshold>`), content, CTA link, close control.
- **Recurring shared sections** (e.g. USP strip, standard FAQ panel, blog feed, contact CTA) — verify the canonical version once here with token-based values; per-page blocks reference it and only note page-specific variants.

---

## PER-PAGE QA CHECKLIST — TEMPLATE BLOCK (duplicate per page)

> Copy everything between the rules below for each project page. Replace every `<placeholder>`. Delete slots that don't apply; add slots to match the page's real section order.

---

### PAGE: `<page-name>` (`<slug>.html`)

**Title:** `<expected <title> — verbatim>`
**Source:** `static-website-reference/<slug>.html`

#### Expected section order

List the sections top-to-bottom exactly as they appear in the design source. Header / Footer / Floating widget are shared (see above).

1. Header *(shared)*
2. `<Section slot — e.g. Hero>`
3. `<Section slot — e.g. USP strip (shared)>`
4. `<Section slot>`
5. `<… continue for the whole page …>`
n. Footer *(shared)*
n+1. Floating widget *(shared, if used)*

#### Per-section checks

Repeat this sub-block for **each** section slot above (skip shared sections already verified).

##### Section: `<slot name>`

- [ ] **Copy verbatim** — every heading, kicker, lead, body line, button label and caption matches `static-website-reference/<slug>.html` character-for-character (wording, punctuation, casing, italic emphasis spans). Log any paraphrase.
- [ ] **Typography** — font family (`<project serif>` / `<project sans>`), weight, size, line-height and letter-spacing match the design and resolve to tokens in `_tokens.scss` (`--text-*`, `--font-serif`, `--font-sans`). No hard-coded px where a token exists.
- [ ] **Spacing** — section padding, gaps, and internal margins match the design (verify against the spacing/layout tokens and `--maxw`; no arbitrary values).
- [ ] **Colour** — background, text, accent and border colours map to token names (`var(--brand-primary)`, `var(--brand-primary-900)`, `var(--brand-accent)`, surface/ink tokens) — never raw brand hex values.
- [ ] **Borders / radius / shadow** — radius (`--radius-*`), border colour/width, and shadow (`--shadow-*`) match the design.
- [ ] **Hover / focus states** — buttons, links and cards show the correct hover treatment and a visible `:focus-visible` state; transitions use the project easing token.
- [ ] **Responsive** — layout, type scale and spacing behave correctly at each project breakpoint (`<mobile>` / `<tablet>` / `<desktop>`); no overflow, no broken wrapping.
- [ ] **Interactions / animation** — any carousel, tabs, accordion, counter, quiz or scroll animation behaves and is timed as in the design source; `prefers-reduced-motion` respected.
- [ ] **Correct Elementor widget** — the section is built with the intended widget/pattern (container structure, Loop Grid vs. static, Pro widget vs. custom) and pulls dynamic content via Dynamic Tags where the design calls for it.
- [ ] **Assets** — images come from the Media Library (confirm format per project, e.g. WebP), icons match the design's icon set (confirm library per project), alt text present and descriptive.

*(Repeat the sub-block for every remaining section slot.)*

---

## Notes for the QA reviewer

- Keep this file lean: only add a page block when that page reaches the QA gate.
- If a value in the build looks right visually but isn't a token, it's still an `[!]` — token conformance is part of the pixel-perfect bar.
- Legal/disclaimer and any compliance copy must be verbatim and complete; flag any truncation as a blocking discrepancy.
- When a page is fully `[x]`, note the pass date at the top of its block and hand it to the PM gate.

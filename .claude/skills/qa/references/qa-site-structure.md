# QA Site Structure — {{CLIENT_NAME}}

Structural verification checklist for the Elementor build. Use this alongside `qa-reference.md` (visual/CSS/JS) and `qa-pages.md` (per-page content). This file covers architecture: WordPress setup, Theme Builder, Global/Saved Sections, Loop Templates, and page section order.

QA sign-off on structure must happen BEFORE visual/content QA on any page.

> **How to use this template:** This is a reusable starter checklist. Anywhere you see `{{PLACEHOLDER}}` or a "fill per project" note, replace it with the real value for the current build. The process checks (WordPress setup, Theme Builder conditions, the Global/Saved/Loop decision framework, and the CSS-architecture gate) are reusable as-is. The inventories (page list, CPTs, ACF fields, menus, section orders) must be populated from the project's design source before QA begins.

---

## Part 1 — WordPress Setup Verification

### 1.1 Page tree

Verify all project pages exist in WordPress → Pages with correct slugs, parents, and templates. **Fill this table from the project sitemap.** Nest child pages under their parent where the IA calls for it.

| Check | WordPress title | Slug | Parent | Template |
|---|---|---|---|---|
| [ ] | Home | `/` (front page) | — | Elementor Canvas / Full Width |
| [ ] | {{PAGE}} | `/{{slug}}` | — | Elementor Canvas / Full Width |
| [ ] | {{CHILD_PAGE}} | `/{{slug}}` | {{PARENT}} | Elementor Canvas / Full Width |
| [ ] | … | … | … | … |

- [ ] Settings → Reading → Static front page = **Home** (or the designated front page)
- [ ] Settings → Reading → Posts page = **{{BLOG_PAGE}}** (if a blog/news archive exists)
- [ ] Permalink structure: Settings → Permalinks → Post name (`/%postname%/`)

### 1.2 Custom Post Types

Verify all CPTs are registered and visible in the wp-admin sidebar. **Fill from the project content model** — only include CPTs the project actually needs.

| Check | CPT slug | Admin label | Supports |
|---|---|---|---|
| [ ] | `post` (native) | Posts | Extended with ACF fields only (if used) |
| [ ] | `{{cpt_slug}}` | {{Label}} | title, thumbnail, … |
| [ ] | … | … | … |

- [ ] All custom CPTs are `public: true` and `show_in_rest: true`
- [ ] CPTs appear in Elementor Loop Template → Choose source dropdown

### 1.3 ACF Field Groups

Verify all field groups exist in ACF → Field Groups and are assigned to the correct location. **Fill from the project field spec.**

> **Project rule:** ACF Pro is the tool for custom fields — do not use `register_meta()` / `add_post_meta()` directly or another field plugin (confirm per project). Every CPT that carries custom data should have a dedicated field group.

| Check | Group name | Assigned to |
|---|---|---|
| [ ] | Site Settings | Options Page (`{{options-slug}}`) |
| [ ] | {{Group}} Fields | Post type = {{cpt_slug}} |
| [ ] | … | … |

**For each field group, verify every sub-field exists with the correct type.** Example structure (replace with the project's actual fields):

**Site Settings field group — verify site-wide fields exist**, e.g.:
- [ ] Footer brand/description text
- [ ] Global contact details (address, phone, email, hours)
- [ ] Social profile URLs
- [ ] Any legal/disclaimer text (verbatim — see 1.4)
- [ ] Any repeaters (e.g. cert logos, partner logos)
- [ ] Review/rating fields + external review profile URL (if surfaced anywhere)

**Per-CPT field groups — verify sub-fields per the project spec**, e.g.:
- [ ] {{cpt}} → `{{field_name}}` ({{acf_type}}) …

### 1.4 ACF Options Page

- [ ] Appears in wp-admin sidebar as "{{Options Page Label}}"
- [ ] Slug is `{{options-slug}}`
- [ ] All site-settings fields accessible and saveable
- [ ] Any legal/disclaimer text entered **verbatim** (matches the design source — no paraphrasing, no truncation)
- [ ] Global contact details (address, phone, email) entered
- [ ] Any external profile/review URLs entered

### 1.5 Menus

Verify all menus exist in Appearance → Menus and are assigned to the correct locations. **Fill from the project nav spec.**

| Check | Menu name | Location | Items |
|---|---|---|---|
| [ ] | Primary Nav | Header (Theme Builder) | {{top-level items, with sub-items noted}} |
| [ ] | Footer — {{Column}} | Footer col 1 | {{items}} |
| [ ] | … | … | … |

- [ ] Nav items that have sub-menus have the correct children attached (dropdowns)
- [ ] Any menu items whose target page is not yet built must link to `#` — confirm the developer has not invented placeholder URLs

### 1.6 Forms

Verify each form exists in the forms plugin (e.g. Gravity Forms). **Fill from the project form spec.** Reuse the same form instance across pages rather than duplicating.

**For each form:**
- [ ] Title: "{{Form Title}}"
- [ ] Fields present in the correct order, with correct types and required flags
- [ ] Submit button label correct
- [ ] Confirmation behaviour correct (on-page text vs redirect)
- [ ] Notification wired to the correct admin email
- [ ] Multi-step forms: correct number of pages, one field group per step, progress indicator, and any click-to-advance / conditional logic active
- [ ] Custom-styled option controls (e.g. card-style radios) render as designed, not as bare inputs

### 1.7 CSS Custom Properties (design tokens)

- [ ] `:root` contains all project design tokens (verify via browser DevTools → `:root` computed styles) — token set matches `scss/abstracts/_tokens.scss`
- [ ] Any global `@keyframes` / animation helper classes are defined once
- [ ] `::selection` colours match the design
- [ ] `:focus-visible` outline matches the design (colour, width, offset)
- [ ] `@media (prefers-reduced-motion: reduce)` block present
- [ ] These styles load before any Elementor stylesheet (see Part 7)

---

## Part 2 — Theme Builder Verification

### 2.1 Header template

**Condition check:** Applied to **All Pages + All Posts**.

**Structure check (top-to-bottom in DOM):** verify against the design source. Typical items:
- [ ] Outer container: correct layout (flex row), height, sticky/fixed behaviour, z-index, background (incl. any translucency / `backdrop-filter`)
- [ ] Logo: Image widget → correct asset, correct height, links to `/`
- [ ] Nav Menu widget (Pro): Primary Nav menu
  - [ ] Items with dropdowns have the correct children
  - [ ] Dropdown appears on hover
  - [ ] Dropdown closes with a small delay after leaving (do not close instantly)
- [ ] Contact affordance (e.g. phone icon + number → `tel:` link), if present
- [ ] CTA button: correct label, correct link, correct style

**Scroll behaviour check (if the design has a scrolled state):**
- [ ] At scroll 0: correct resting state (e.g. no border/shadow)
- [ ] After scrolling past threshold: correct scrolled state (border / shadow / bg change)
- [ ] Transition is smooth

**Mobile check (at the project's nav breakpoint):**
- [ ] Nav collapses to a hamburger toggle
- [ ] Hamburger opens the mobile panel
- [ ] Mobile panel: correct background, max-height, scrollable if needed
- [ ] Contact + CTA visible in the mobile panel or a sticky bar (confirm which implementation was chosen)
- [ ] Close control dismisses the panel

> The header nav CSS is developer-owned (`scss/components/_nav.scss`). QA reports discrepancies; the developer owns the fix.

### 2.2 Footer template

**Condition check:** Applied to **All Pages + All Posts**.

**Structure check** — verify against the design source. Typical items:
- [ ] Background colour / outer padding / inner max-width match the design
- [ ] Column grid matches the design (column count, ratios, gap)
- [ ] Brand column: logo + brand description (Dynamic Tag from ACF Options) + social icons
- [ ] Nav columns wired to the correct footer menus
- [ ] Any reviews / cert-logo / partner row present and correct (rating + count wired to ACF Options Dynamic Tags, not hard-coded)
- [ ] Contact strip: address / phone / email wired to ACF Options Dynamic Tags
- [ ] Any legal/disclaimer text wired to an ACF Dynamic Tag (NOT hard-coded), rendered **verbatim** (compare with the design source — no paraphrasing)
- [ ] Bottom bar: copyright + any agency credit / external link (correct URL, new tab)

**Mobile:**
- [ ] Footer grid collapses correctly at the project breakpoint
- [ ] Legal/disclaimer text readable on mobile (no overflow)

### 2.3 Popups (Theme Builder)

For each popup in the design (e.g. a floating reviews widget, promo, cookie notice):

**Setup check:**
- [ ] Template type: **Popup** (not page, not section)
- [ ] Display condition correct (e.g. All Pages)
- [ ] Trigger correct (e.g. On Scroll at the specified distance — verify the exact value)
- [ ] Frequency correct
- [ ] Close control enabled

**Content check:**
- [ ] Card styling (bg, radius, shadow, max-width, padding) matches the design
- [ ] Dynamic values wired to ACF Options Dynamic Tags (not hard-coded)
- [ ] Any CTA links to the correct URL, correct target
- [ ] Popup position matches the design (corner / alignment)

---

## Part 3 — Global Sections Verification

**Decision framework — when to use a Global Section:** Use a Global (Linked) Section for a block that appears on **multiple pages with identical content**, where a single edit should propagate everywhere at once. Editing the template updates all instances simultaneously.

Each Global Section is a Linked/Global Template in Elementor. Verify:
1. The template exists in Elementor → Templates → Saved Sections (marked as Global/Linked)
2. It appears correctly on every page it should appear on
3. Editing the template updates all instances simultaneously

**Fill the section list below from the project.** For each Global Section, capture: the section name, which pages it appears on, its expected structure, and a page-presence table.

### 3.x {{Global Section name}} — used on {{N}} pages

**Pages:** {{list of pages}}

**Structure check (verify once, trust sync on all instances):**
- [ ] {{layout / widget structure matches the design source}}
- [ ] {{content items match the design source}}
- [ ] {{responsive behaviour confirmed}}

**Page presence check:**
| Page | Present | Position / notes |
|---|---|---|
| [ ] {{page}} | Yes | {{where}} |
| {{page}} | Should NOT appear | — |

> Common Global-Section candidates (include only those the project has): a trust/USP strip, a bottom-of-page Contact CTA (with the shared enquiry form embedded), a "Why choose us" card grid, a testimonials block (see Loop Templates — prefer a Loop Grid over a static carousel), a locations/map panel. Confirm the exact set per project.

---

## Part 4 — Saved Sections Verification

**Decision framework — when to use a Saved (unlinked) Section:** Use a Saved Section for a block with the **same structure but per-page content**. Save the template, insert it, then **right-click → Unlink from Library** so each page instance can be edited independently without affecting the others.

Verify the template was built correctly on the origin page, then that unlinked copies were inserted correctly on all subsequent pages.

**Fill the section list below from the project.** For each Saved Section, capture: the section name, origin page, pages it appears on, expected structure, and per-page content note.

### 4.x {{Saved Section name}} — {{N}} pages

**Pages:** {{list}}
**Origin page:** {{page}}

**Structure check:**
- [ ] {{layout / widget structure matches the design source}}
- [ ] {{uses the correct native Elementor widget where applicable — e.g. Accordion widget for FAQs, NOT a custom HTML accordion}}

**Content check (per page):**
- [ ] Each page's instance contains content relevant to THAT page (not a copy of the origin page)
- [ ] QA verifies content matches the design source for that page

**Page presence check:**
| Page | Present | Unlinked from template |
|---|---|---|
| [ ] {{page}} | Yes | Origin |
| [ ] {{page}} | Yes | Unlinked copy |

> Common Saved-Section candidates (include only those the project has): an FAQ accordion panel (same widget, different questions per page), an internal/short page hero, a service hero variant, a mid-page lead-in / enquiry strip. Confirm per project.

---

## Part 5 — Loop Templates Verification

**Decision framework — when to use a Loop Template + Loop Grid:** Use this pattern for any **CPT-driven** collection (cards/listings). Build one **Loop Template** (Elementor → Templates → Loop Templates) bound to the CPT, wire every field via **Dynamic Tags** (never hard-code CPT field values), then drop a **Loop Grid** widget on each page that lists that CPT. Configure columns per breakpoint and the query/order on the Loop Grid.

**Fill from the project content model** — one sub-section per CPT that has a card/listing.

### 5.x {{CPT}} Card Loop Template

**Template check:**
- [ ] Exists in Elementor → Templates → Loop Templates
- [ ] Source: `{{cpt_slug}}`

**Widget check (top to bottom):** each visible field is a Dynamic Tag bound to the correct source (Post Title / Post Date / Post Excerpt / Featured Image / ACF field), styled per the design source:
- [ ] {{field}} → Dynamic Tag → {{source}}; {{typography/style}}
- [ ] "{{Read more / View}}" link → correct Dynamic Tag (ACF override URL if present, else Permalink)

**Hover check:**
- [ ] Card hover state (lift / shadow / colour swap) matches the design

**Archive / grid display:**
- [ ] Loop Grid widget on the listing page uses this Loop Template
- [ ] Column counts correct per breakpoint (desktop / tablet / mobile)
- [ ] Order / query correct (e.g. newest first, or an ACF `display_order`)
- [ ] Correct item count appears; enough published items exist to verify layout

---

## Part 6 — Page Section Order

For each page, verify sections appear in the exact order specified by the design source, with no missing sections and no extra sections. Top = first visible after the header. **Fill one table per page from the project sitemap/design source.**

**Key:**
- **(G)** = Global Section (linked template — edit once, updates all)
- **(S)** = Saved Section (unlinked template — editable per page)
- **(TB)** = Theme Builder (Header/Footer/Popup — not in the page editor)
- **(B)** = Bespoke section (built in place, not a template)
- **(LG)** = Loop Grid using a Loop Template

### 6.x {{Page name}} (`/{{slug}}`)

| # | Section | Type | Check |
|---|---|---|---|
| — | Header | TB | [ ] |
| 1 | {{Section}} | B / G / S / LG | [ ] |
| 2 | {{Section}} | … | [ ] |
| … | … | … | [ ] |
| — | Footer | TB | [ ] |

> Notes to capture per page: which sections are intentionally absent (e.g. "no USP strip on this page — confirm against the design source"), and any page that intentionally omits the shared bottom Contact CTA because the page IS the conversion point (e.g. a Contact page whose form is the CTA — confirm no duplicate CTA is inserted).

---

## Part 7 — Global CSS Structural Verification

These checks are about **CSS architecture**, not visual values (see `qa-reference.md` for exact token values).

### 7.0 CSS authoring architecture (the gate)

- [ ] All site CSS is authored in `scss/` and compiled to `assets/css/main.css` (build: `npm run build:css`) — the compiled file is committed
- [ ] Design tokens are single-sourced in `scss/abstracts/_tokens.scss` (as CSS custom properties) — no token values duplicated/hard-coded elsewhere
- [ ] **No inline CSS in `functions.php`** — it holds none
- [ ] No per-widget Custom CSS re-declares token values; widgets reference the CSS variables
- [ ] SCSS was rebuilt and `main.css` re-committed after the latest style change

### 7.1 CSS loading order

- [ ] Design-token CSS custom properties load in `<head>` BEFORE any Elementor stylesheet
- [ ] No Elementor stylesheet overrides `:root` variable values (check DevTools computed styles on `:root`)
- [ ] Global `@keyframes` are NOT duplicated across multiple stylesheets
- [ ] Elementor page CSS does NOT hard-code colour values where CSS vars should be used

### 7.2 Container structure

- [ ] Every section uses a **Flexbox Container** or **Grid Container** — no legacy Section/Column found anywhere
- [ ] No HTML widget used to inject markup that should be a native widget (right-click elements to confirm)
- [ ] The content max-width is applied to inner content containers (not forced by the outer full-width container)

### 7.3 Font loading

- [ ] Each brand font is loaded with the correct family and weights/styles (fill from the project type spec)
- [ ] No fallback font flashes at page load (check DevTools Network tab for font requests completing before LCP)
- [ ] `font-display: swap` or equivalent in place (confirm per project)

### 7.4 Responsive breakpoints

Elementor must be configured with the project's custom breakpoints (Elementor → Site Settings → Layout → Custom Breakpoints). **Fill from the project spec.**

| Breakpoint name | Width | Check |
|---|---|---|
| [ ] {{Tablet}} | {{px}} | Active breakpoint |
| [ ] {{Mobile}} | {{px}} | Active breakpoint |
| [ ] … | … | … |

> Elementor's default breakpoints (1024/768/480) often differ from the design. If the design uses custom breakpoints, they MUST be overridden to match before responsive QA.

---

## Part 8 — QA Structural Sign-off Gate

Complete ALL checks above before signing off structure. This gate must pass before visual/content QA (`qa-reference.md` + `qa-pages.md`) can begin on any page.

### Sign-off checklist

**WordPress Setup:**
- [ ] All pages exist with correct slugs, parents, templates
- [ ] Static front page set correctly
- [ ] All custom CPTs registered
- [ ] All menus created and assigned
- [ ] All ACF field groups created and assigned
- [ ] ACF Options Page accessible and all fields present
- [ ] All forms created with correct fields, pages, and submission behaviour
- [ ] Design-token CSS custom properties injecting correctly in `<head>`

**Theme Builder:**
- [ ] Header template: correct structure, sticky/scroll behaviour, dropdowns, mobile hamburger
- [ ] Footer template: correct structure, all columns, any reviews/certs row, contact strip, legal text wired to ACF, bottom bar
- [ ] Popups: correct trigger, layout, and links

**Global Sections:**
- [ ] Each Global Section: correct structure, present on the correct pages, edits sync

**Saved Sections:**
- [ ] Each Saved Section: present on the correct pages, correct native widget used, unlinked copies carry the right per-page content

**Loop Templates:**
- [ ] Each Loop Template: exists, correct fields wired via Dynamic Tags, hover state correct, correct Loop Grid columns/query on listing pages

**Page section order:**
- [ ] All pages verified against the section-order tables

**Global CSS:**
- [ ] CSS authored in `scss/`, compiled to `assets/css/main.css`, tokens single-sourced in `scss/abstracts/_tokens.scss`, no inline CSS in `functions.php`
- [ ] No legacy Section/Column layout found
- [ ] No misuse of the HTML widget
- [ ] Correct breakpoints configured in Elementor
- [ ] Fonts loading correctly

---

*QA structural sign-off by: _________________________ Date: _____________*

*Once this gate is signed off, proceed to visual/content QA using `qa-reference.md` and `qa-pages.md`.*

# Developer Pages Brief — Template

Page-by-page Elementor Pro build brief for `{{CLIENT_NAME}}`.

This doc holds the section-by-section build guide for each page of the site, built in **page batches** (e.g. Batch 1: Home, About, Services). When building a page, read **only** the section for the page you are on — not the whole file.

**Global build rules (apply to every page):**
- Elementor Pro is the sole page builder. Containers are Flexbox or Grid only — no legacy Section/Column, no HTML widget.
- Content source: **ACF** fields surfaced via **Dynamic Tags** (never hard-code CPT field values into widgets). CPT archives/grids use the **Loop Grid** widget + a Loop Template.
- All images come from the **WordPress Media Library** — never reference local design-source paths. Use the **WebP** variant where available (confirm per project).
- Colours are referenced by **design-token name** (see `scss/abstracts/_tokens.scss` / Global Kit), not hex. Fonts: `<project serif>` for display/headings, `<project sans>` for body/UI.
- Copy must be taken **verbatim** from the project's design reference (static HTML / Figma) — do not paraphrase.
- Cross-check the section order and copy against the QA reference before marking a page done.

---

## How to use this doc

1. **Duplicate the page-brief template block below** once per project page.
2. Fill each `<placeholder>` from the project's design reference. Keep body copy **verbatim**.
3. Label sections as reusable **slots** (Hero / Lead-in / Feature grid / Testimonials / FAQ / Contact CTA, etc.) so QA and PM can map them page-to-page.
4. Note per section: the **Elementor widget(s)**, the **copy**, the **image/asset** ref, and any **interaction** (animation, hover, sticky, form behaviour).
5. Flag whether a section is **Global** (build once, syncs), **Saved/unlinked** (per-page copy), a **Loop Template** (CPT-driven), or **bespoke** (build in place).
6. Confirm section order against the QA page checklist — the gate order is Developer → QA → PM.

---

## PAGE BRIEF TEMPLATE — copy this block per page

```md
## PAGE <n>: <PAGE NAME> (`/<slug>`)

**Meta title:** <verbatim title tag>
**Meta description:** <verbatim meta description>
**H1 (single, required):** <verbatim H1>
**Template origin:** Global Header + Footer (Theme Builder, All Pages).

**Section order (top → bottom):**
1. <Hero>
2. <Lead-in / intro>
3. <Feature / service grid>
4. <Stats / social proof>
5. <Testimonials>
6. <FAQ>
7. <Contact CTA>
8. Footer (Theme Builder global)

---

### Section 1 — <Hero>
- **Slot type:** Hero  ·  **Build:** Saved/unlinked (or Global / Bespoke)
- **Container:** full-width; inner max-width `<container width token>`; padding `<vertical> / <side>`
- **Background:** Media Library image `<image placeholder — WebP>` + overlay `<overlay/gradient token>` (if any)
- **Widgets & content:**
  | Widget | Content (verbatim) | Notes |
  |---|---|---|
  | Kicker (Text/Heading) | `<kicker copy>` | token colour, uppercase, letter-spacing |
  | H1 (Heading) | `<H1 copy>` | `<project serif>`, `<size token>` |
  | Lead paragraph (Text Editor) | `<lead copy>` | `<project sans>`, max-width `<token>` |
  | CTA (Button) | `<button label>` → `/<target slug>` | pill, token bg, hover state |
- **Interaction:** <reveal animation / sticky / none>

### Section 2 — <Lead-in>
- **Slot type:** Lead-in  ·  **Build:** <Global / Saved / Bespoke>
- **Container / grid:** <layout, columns, gap>
- **Widgets & content:** <widget> — `<verbatim copy>`; image `<placeholder>`
- **Interaction:** <note>

### Section 3 — <Feature / service grid>
- **Slot type:** Feature grid  ·  **Build:** <Loop Grid (CPT `<cpt>`) / Container grid + Icon Box>
- **Layout:** grid `<n>` cols, gap `<token>`; mobile `<n>` cols
- **Per card:** icon `<Lucide icon name>` · title `<placeholder>` · body `<placeholder>` · link `/<slug>`
- **Data source:** <ACF Dynamic Tags via Loop Template, or static copy>

### Section 4 — <Stats / social proof>
- **Slot type:** Stats  ·  **Widget:** Counter (Pro)
- **Items:** `<number>` `<suffix>` — `<label>` (pull target from ACF Options via Dynamic Tag where applicable)

### Section 5 — <Testimonials>
- **Slot type:** Testimonials  ·  **Build:** Loop Grid (CPT `testimonial`) — filter by Relationship field per page (or Carousel Pro until CPT built)
- **Per card:** quote `<placeholder>` · attribution `<placeholder>` · meta `<placeholder>`

### Section 6 — <FAQ>
- **Slot type:** FAQ  ·  **Widget:** Accordion (Pro) — questions entered directly (no FAQ CPT)
- **Items:** Q `<placeholder>` / A `<placeholder>` (page-specific copy; Saved + unlinked per page)

### Section 7 — <Contact CTA>
- **Slot type:** Contact CTA  ·  **Build:** Global Section (identical across pages)
- **Content:** heading `<placeholder>` · Gravity Forms widget (project contact form) · contact strip (address/phone/email via ACF Dynamic Tags)
- **Interaction:** inline success confirmation `<placeholder>`

### Section 8 — Footer
- Theme Builder global footer — no per-page build.
```

---

## Common section types → Elementor widget

Use this as the default mapping when filling the template. Confirm against the project's design reference.

| Section type | Elementor widget(s) |
|---|---|
| Hero | Container (flex/grid) + Heading + Text Editor + Button |
| USP / feature strip | Container (flex) + Icon Box |
| Feature / why-us grid | Container (grid) + Icon Box |
| Carousel / logo marquee | Carousel / Logo Carousel (Pro) |
| Stats / counters | Counter (Pro) |
| Process steps / tabbed panels | Tabs (Pro) |
| FAQ | Accordion (Pro) — no FAQ CPT |
| Forms (contact, lead-in, quiz) | Gravity Forms widget |
| CPT grids/archives (blog, team, industries, testimonials, locations) | Loop Grid (Pro) + Loop Template, data via ACF Dynamic Tags |
| Global contact/USP/CTA blocks | Saved Template kept **Global** (edit once, syncs) |
| Per-page copy variants of a shared layout | Saved Template, inserted then **Unlinked from Library** |
| One-off / page-unique sections | Build in place — do **not** save as template |

---

## Notes

- **Global vs Saved vs Bespoke:** decide per section before building. Global = identical everywhere (USP strip, Contact CTA). Saved+unlinked = same structure, per-page copy (Hero, FAQ). Bespoke = one page only.
- **Responsive:** set breakpoints per the project's design reference; collapse multi-column grids at the project's tablet/mobile breakpoints.
- **Icons:** use the project's icon set consistently (upload as SVG); do not mix icon libraries.
- **Forms:** reuse the same Gravity Forms instances across pages via the Elementor Gravity Forms widget; don't rebuild per page.

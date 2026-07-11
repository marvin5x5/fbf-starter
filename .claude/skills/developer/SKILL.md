---
name: developer
description: Developer role for the {{CLIENT_NAME}} Elementor build. Use when implementing or building pages/sections in Elementor — mapping the project's design reference to Elementor Pro widgets, following the build order and dependencies, applying design tokens, replicating JS interactions, and getting section/widget structure, spacing and typography right. Trigger when the user asks to build/implement a page or section, or says they are acting as the Developer.
---

# Developer — {{CLIENT_NAME}}

You are the **Developer** on the {{CLIENT_NAME}} site. You build each page section and map the project's design reference (static HTML, Figma, or PDF — whatever the project supplies) to its correct Elementor Pro widget counterparts, responsible for the accuracy of structure, spacing, typography, and interactions inside the editor.

**Gate order: Developer → QA → PM.** Your output is what QA verifies against the design reference — build to the pixel, not "close enough."

**Read through the `design-to-elementor-wp` skill before building**, and load it for any Elementor JSON generation, dynamic tags, global kit, CPT/ACF/Loop-Grid setup, or Gravity Forms embedding — this skill covers *what* to build; that one covers *how* to express it in Elementor. When they overlap, `design-to-elementor-wp` is the how-to authority.

## Reference docs (add per project under this skill's `references/` folder — read on demand, don't guess)

The `references/` folder ships empty. Populate it for {{CLIENT_NAME}} with, for example:
- **`references/developer-build-order.md`** — read FIRST. Site structure, build dependencies/phases, Elementor Global Kit setup, CPT/ACF order, and custom-code snippets. Tells you what must exist before you can build a given piece.
- **`references/developer-reference.md`** — the design-token extraction, exact JS function logic/values, and design→Elementor widget equivalents.
- **`references/developer-pages.md`** — the page-by-page build brief (section order, widget types, verbatim copy, image refs). Read only the section for the page you're building.

## Working rules

- Site CSS lives in `scss/` → compiled to `assets/css/main.css` (`npm run build:css`); design tokens are in `scss/abstracts/_tokens.scss`. Don't add inline CSS to `functions.php`. `scss/components/_nav.scss` is developer-owned by convention.
- Create a single **ACF Options page named "Site Settings"** — the one home for all **site-wide / global ACF fields** and **ACF repeater fields** (e.g. contacts, socials, stats, cert logos, footer disclaimer). Register it once (ACF Pro `acf_add_options_page`), add the fields there, and **pull every value via Elementor Dynamic Tags** — never hard-code them. Reuse this page across the site rather than scattering global fields per template.
- Pull ACF / Site Settings values via Elementor **Dynamic Tags**; use a **Loop Grid** for every CPT archive/grid. Don't hard-code CPT field values.
- **Text marquee:** build it as a **shortcode** (registered in `inc/shortcodes.php`), not hand-placed widgets or structural HTML in a text-editor. Source the marquee items from an **ACF repeater field on the "Site Settings" options page** and render them in the shortcode — so the client edits the marquee content once in Site Settings.
- Elementor Pro is the sole builder; Gutenberg is disabled by the parent. Header/footer are Theme Builder templates.
- Recommended defaults (confirm per project): icons as inline SVG (e.g. Lucide), images from the Media Library in an optimised format (e.g. WebP).
- **Screenshot baseline:** capture a screenshot of the static reference page (served from the read-only `static-website-reference/`) and save it in **`screenshot-reference/`** — never write into `static-website-reference/`. Use it to compare against your built Elementor page during self-check (desktop **and** ~390px mobile) before handing to QA. Name each shot after the page (e.g. `home.png`, `home-390.png`).

## Elementor widget map (use where applicable/needed)

Map each design element to its native Elementor widget rather than hand-rolling structural HTML (G2/G5). Use the closest fit below; reach for a custom shortcode only when no native widget applies.

| Design element | Widget |
|---|---|
| Heading text | **Heading** |
| Images | **Image** |
| Content / body text | **Text Editor** (plain copy + inline links only) |
| Buttons | **Button** |
| Icon | **Icon** |
| Grid / masonry gallery | **Gallery** |
| Tabbed formats | **Tabs** |
| Accordion formats (e.g. FAQ) | **Accordion** |
| Carousel gallery | **Image Carousel** |
| Stats | **Counter** |
| List with icons | **Icon List** |
| Shortcode output (e.g. text marquee, forms) | **Shortcode** |

## Flow

1. Confirm prerequisites exist (kit tokens, ACF groups, CPTs, forms) — see the project's build-order doc.
2. Open the page's section in the project's page brief; list sections + widgets before building.
3. Build in Elementor (use the `design-to-elementor-wp` skill for JSON), applying tokens/interactions from the project reference.
4. Self-check against the brief (section order, copy verbatim, responsive, hover states) and against the page's `screenshot-reference/` baseline before handing to QA.

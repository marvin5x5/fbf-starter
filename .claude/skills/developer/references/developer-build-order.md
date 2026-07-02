# Developer Build Order — {{CLIENT_NAME}}

Master reference for building the Elementor site from scratch. Follow phases in sequence — each phase is a hard dependency for the next.

This is a **starter template**. Replace every `{{PLACEHOLDER}}` and `<project value>` slot with the real project's values during setup. The methodology, phase order, and gate order below are the reusable parts — keep them.

> **Gate order (whole project): Developer → QA → PM.** No page moves to the next gate until the current one passes.

---

## 1. WordPress Site Structure

### Page tree (all pages to create in WordPress)

Define the real page tree per project. Typical agency-site shape below — adapt slugs, parents, and depth to the sitemap.

| WordPress title | Slug | Parent | Template |
|---|---|---|---|
| Home | `/` (front page) | — | Elementor Canvas |
| About | `/about` | — | Elementor Canvas |
| Services (hub) | `/services` | — | Elementor Canvas |
| Service detail A | `/<service-a>` | Services | Elementor Canvas |
| Service detail B | `/<service-b>` | Services | Elementor Canvas |
| Category hub (e.g. Industries) | `/<category-hub>` | — | Elementor Canvas |
| Category detail | `/<category-detail>` | Category hub | Elementor Canvas |
| Locations hub | `/locations` | — | Elementor Canvas |
| Location detail | `/<location>` | Locations | Elementor Canvas |
| Insights / Blog | `/insights` | — | Elementor Canvas (or Posts archive) |
| Contact | `/contact` | — | Elementor Canvas |

**Set front page:** Settings → Reading → Static page → Home

### Custom Post Types (register in this order)

Register only the CPTs the project actually needs. Common agency-site set:

1. `post` (native — already exists, extend with ACF fields only)
2. `testimonial`
3. `team_member`
4. `location`
5. `industry` (or the project's equivalent category CPT)

### Menus to create

One menu per navigation region. Map footer columns to whatever the design uses.

| Menu name | Location | Items |
|---|---|---|
| Primary Nav | Header (Theme Builder) | `<top-level nav items>` |
| Footer — Col 1 | Footer col 1 | `<links>` |
| Footer — Col 2 | Footer col 2 | `<links>` |
| Footer — Col 3 | Footer col 3 | `<links>` |
| Footer — Col 4 | Footer col 4 | `<links>` |

### Gravity Forms to create

Note each form's numeric ID after creation — you reference it when inserting the GF widget in Elementor.

| Form | ID to note | Used on |
|---|---|---|
| Contact / Enquiry | Form `<id>` | Contact CTA (most pages), Contact page panel, any mid-page lead-in |
| Multi-step quiz (optional) | Form `<id>` | Interactive tool section, if the design has one |

---

## 2. Phase 0 — Custom Code (before anything in Elementor)

Site CSS is authored in `scss/` and compiled to `assets/css/main.css` (`npm run build:css`; watch with `npm run watch:css`). Design tokens live in `scss/abstracts/_tokens.scss` as CSS custom properties. **Prefer the SCSS pipeline over inline `<head>` CSS.** Use `functions.php` (or a dedicated `inc/setup.php` included from it) only for PHP-level setup: CPT registration, ACF options, and small footer/head scripts.

### 2a. Design tokens

Author tokens in `scss/abstracts/_tokens.scss`, then `npm run build:css` and commit `assets/css/main.css`. Use semantic token names so the same partials work across projects. Fill each `<project value>` from the design source (or reference Elementor Global Colours below as the single source of truth).

```scss
:root {
  // Brand
  --brand-primary:      <project value>;   // e.g. main brand colour
  --brand-primary-600:  <project value>;
  --brand-primary-700:  <project value>;
  --brand-primary-800:  <project value>;
  --brand-primary-900:  <project value>;   // often the footer bg
  --brand-primary-tint: <project value>;
  --brand-accent:       <project value>;   // secondary / highlight colour
  --brand-accent-600:   <project value>;
  --brand-accent-tint:  <project value>;

  // Neutrals
  --ink:    <project value>; --ink-2: <project value>; --ink-3: <project value>;
  --white:  #fff; --paper: <project value>; --line: <project value>; --line-2: <project value>;

  // Type
  --font-serif: <project serif>, Georgia, serif;       // e.g. a display serif
  --font-sans:  <project sans>, system-ui, sans-serif; // e.g. a UI sans

  // Type scale (adapt to design)
  --text-sm: .8125rem; --text-base: 1rem; --text-md: 1.125rem;
  --text-lg: 1.3125rem; --text-xl: 1.625rem; --text-2xl: 2.125rem;
  --text-3xl: clamp(1.95rem, 3.6vw, 3rem); --text-4xl: clamp(2.4rem, 5vw, 4.2rem);

  // Radius / shadow / motion
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 14px; --radius-pill: 999px;
  --shadow-sm: 0 1px 2px rgba(0,0,0,.05);
  --shadow-md: 0 6px 22px rgba(0,0,0,.07);
  --shadow-lg: 0 20px 50px rgba(0,0,0,.12);
  --ease-out: cubic-bezier(.16,1,.3,1);
  --maxw: 1180px;   // adjust to design container width
}
```

Global resets, `::selection`, `:focus-visible`, and any keyframes (e.g. a logo marquee) also belong in `scss/base/` partials, not inline. Always keep a `prefers-reduced-motion` guard:

```scss
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: .001ms !important; }
}
```

### 2b. CPT registrations

Register only the CPTs the project uses. Generic pattern:

```php
add_action('init', function() {
  $cpts = [
    'testimonial' => ['label' => 'Testimonials', 'menu_icon' => 'dashicons-format-quote', 'supports' => ['title']],
    'team_member' => ['label' => 'Team Members', 'menu_icon' => 'dashicons-groups',        'supports' => ['title', 'thumbnail']],
    'location'    => ['label' => 'Locations',    'menu_icon' => 'dashicons-location-alt',  'supports' => ['title']],
    'industry'    => ['label' => 'Industries',   'menu_icon' => 'dashicons-category',      'supports' => ['title', 'thumbnail']],
  ];
  foreach ($cpts as $slug => $args) {
    register_post_type($slug, [
      'labels'       => ['name' => $args['label'], 'singular_name' => rtrim($args['label'], 's')],
      'public'       => true,
      'show_in_rest' => true,
      'menu_icon'    => $args['menu_icon'],
      'supports'     => $args['supports'],
    ]);
  }
});
```

### 2c. ACF Options Page

```php
if (function_exists('acf_add_options_page')) {
  acf_add_options_page([
    'page_title' => 'Site Settings',
    'menu_title' => 'Site Settings',
    'menu_slug'  => 'site-settings',
    'capability' => 'edit_posts',
    'redirect'   => false,
  ]);
}
```

### 2d. Multi-step form auto-advance JS (optional)

If the design uses a radio-only multi-step Gravity Form (a "fit / quiz" tool), this makes selecting a radio option auto-advance to the next GF page:

```php
add_action('wp_footer', function() { ?>
<script>
document.addEventListener('change', function(e) {
  if (!e.target.matches('.gfield_radio input[type="radio"]')) return;
  var form = e.target.closest('form');
  if (!form) return;
  var nextBtn = form.querySelector('.gform_next_button');
  if (nextBtn) setTimeout(function() { nextBtn.click(); }, 300);
});
</script>
<?php });
```

### 2e. Visual feedback / bug-tracking script (temporary — remove before handoff)

If the project uses a client review/annotation tool during build, inject its snippet via `wp_head` and **remove it before handoff**. Keep the key in an env var or ACF field — never hard-code a live key in committed code.

```php
add_action('wp_head', function() {
  // Temporary review-tool snippet — REMOVE BEFORE HANDOFF.
  // Load key from config/env, do not commit a real key.
});
```

---

## 3. Phase 1 — Elementor Global Kit

**Must be complete before any page build starts.** Elementor Pro is the sole page builder (Gutenberg is disabled by the parent theme). The Global Kit is the single source of truth for colour/type/button values, mirrored by the SCSS tokens.

Go to: Elementor → Site Settings → Global Colors / Global Fonts / Global Typography / Global Buttons.

### Global Colors (add all — mirror the SCSS tokens)

| Name | Value |
|---|---|
| Brand Primary | `<project value>` |
| Brand Primary 600 | `<project value>` |
| Brand Primary 700 | `<project value>` |
| Brand Primary 800 | `<project value>` |
| Brand Primary 900 (Footer bg) | `<project value>` |
| Brand Primary Tint | `<project value>` |
| Brand Accent | `<project value>` |
| Brand Accent 600 | `<project value>` |
| Brand Accent Tint | `<project value>` |
| Ink | `<project value>` |
| Ink 2 | `<project value>` |
| Ink 3 | `<project value>` |
| Paper | `<project value>` |
| Line | `<project value>` |
| Line 2 | `<project value>` |

### Global Fonts

| Name | Family | Weights to load |
|---|---|---|
| Serif (display) | `<project serif>` | `<weights + italics>` |
| Sans (UI/body) | `<project sans>` | `<weights>` |

### Global Typography

Map the design's type scale. Example structure (adjust values to design):

| Style name | Font | Size | Weight | Line-height | Letter-spacing | Transform |
|---|---|---|---|---|---|---|
| Display H1 | Serif | clamp(2.4rem,5vw,4.2rem) | 400 | 1.05 | -0.015em | — |
| Section H2 | Serif | clamp(1.95rem,3.6vw,3rem) | 400 | 1.1 | -0.012em | — |
| Card H3 | Serif | 26px | 500 | 1.2 | — | — |
| Lead | Sans | 18px | 400 | 1.66 | — | — |
| Body | Sans | 16px | 400 | 1.7 | — | — |
| Small | Sans | 13px | 400 | 1.6 | — | — |
| Kicker | Sans | 13px | 600 | — | 0.2em | Uppercase |
| Button | Sans | 15.5px | 600 | 1 | — | — |

### Global Buttons

| Variant | Background | Text color | Border radius | Border |
|---|---|---|---|---|
| Primary | `--brand-primary` | `#fff` | 999px | none |
| Outline | transparent | `--brand-primary-700` | 999px | 1.5px solid `--line-2` |
| On Dark | `rgba(255,255,255,.95)` | `--brand-primary-800` | 999px | none |

---

## 4. Phase 2 — ACF Field Groups

ACF Pro is the only tool for custom fields on this project — do not use `register_meta()`, `add_post_meta()` directly, or another field plugin. Create all field groups in the ACF UI before entering content. Assign each to the correct post type. Pull every value into Elementor via **Dynamic Tags** — never hard-code CPT field values into widget content.

**Order:**
1. Options Page — "Site Settings" (firm stats, contact details, social links, cert/partner logos, footer text, any legal/compliance disclaimer)
2. `post` extended fields (e.g. external URL override, display category label)
3. `testimonial` fields (quote, attribution, location/context, relationship to pages)
4. `team_member` fields (role, department, credentials, photo, bio, display order)
5. `location` fields (is_hq, address, phone, email, hours, service area, blurb, maps query, page URL)
6. `industry` fields (icon name, short description, landing page URL, display order)

Adapt this list to the project's CPTs. The pattern is: one field group per CPT + one Options page for site-wide content.

**Then enter minimum sample content** (enough to build and QA Loop Templates):
- 3 testimonials (placeholder OK — replace with real before PM sign-off)
- 3 team members (real where available)
- All locations with addresses and hours
- All category/industry items with icon names and descriptions
- At least 3 blog posts

---

## 5. Phase 3 — Gravity Forms

Create the project's forms before the pages that embed them can be built. Reuse the same form instance across pages via the GF widget.

### Form 1 — Contact / Enquiry
Fields in order (adapt to project): Full name (text, required) → `<other required fields>` → Email (email, required) → a "How can we help?" select (required, choices per project) → an optional message (paragraph).
- Submit label: `<project value>` (e.g. "Send message")
- Confirmation: inline text, no redirect (copy per project)
- Notification: wire to `<client email>` — store the address in config, not in committed code, and confirm the routing with the client before go-live.

### Form 2 — Multi-step quiz (only if the design includes one)
Multi-step, radio-only, click-to-advance (via the JS snippet in Phase 0). One radio field per page; final page shows conditional result copy based on prior answers. Custom CSS for card-style radio options (border, arrow icon, hover state) authored in an SCSS component partial.

> External-facing copy in forms is a draft until human-reviewed. Nothing is sent to a real client inbox until the notification routing is confirmed.

---

## 6. Phase 4 — Theme Builder

Build in this sequence. **No page can start until Header and Footer are done.**

### Step 1 — Header template

Condition: All Pages + All Posts (exclude nothing).

Container stack (inside one flex-row outer container):
1. **Logo** — Image widget, header logo asset, links to homepage. Source from the Media Library (WebP recommended — confirm per project).
2. **Nav Menu widget (Pro)** — Primary Nav menu, with dropdown styling per design.
3. **Phone / contact** — Icon widget (icon per project) + Text widget in a flex container → `tel:<number>`
4. **CTA button** — Button widget (label per project), primary style → `/contact`

Header structural CSS belongs in the header SCSS component partial (compiled to `main.css`), not inline in Elementor, e.g.:

```scss
.site-header {
  position: sticky; top: 0; z-index: 50;
  background: rgba(255,255,255,.9);   // use paper token per project
  backdrop-filter: blur(14px);
  height: 76px;                        // adjust to design
  transition: border-color .3s, box-shadow .3s;
}
```

Scroll shadow (toggle border/shadow past a scroll threshold) — small JS via `wp_footer` or Elementor Custom Code:

```js
const hdr = document.querySelector('.site-header'); // update to actual header selector
document.addEventListener('scroll', () => {
  const on = scrollY > 8;
  hdr.style.borderBottom = on ? '1px solid var(--line)' : '1px solid transparent';
  hdr.style.boxShadow    = on ? 'var(--shadow-sm)' : 'none';
});
```

Mobile: Nav Menu Pro handles the hamburger at the mobile breakpoint (`<breakpoint>`, commonly ≤960px). Configure the mobile panel (background, max-height with scroll) per design.

> The nav SCSS partial (`scss/components/_nav.scss`) is typically developer-owned — confirm ownership per project before editing its rules.

### Step 2 — Footer template

Condition: All Pages + All Posts.

Outer container: background `--brand-primary-900`, top padding per design.
Inner max-width container: `max-width: var(--maxw); margin: 0 auto; padding: 0 32px`.

Layout (multi-col grid — column count/ratios per design):
- **Col 1:** Footer logo (Media Library) + brand description (Dynamic Tag → ACF Options: `footer_brand_description`) + social icons (Icon widgets in a flex row, hrefs from ACF Options)
- **Remaining cols:** Nav Menu widgets (one per footer menu)

Below grid (border-top, padding-top):
- Reviews/trust block if applicable — rating + star icons + review count (wire to ACF Options Dynamic Tags)
- Cert/partner logo images in a flex row (each in a chip), sourced from Media Library

Contact strip (flex row):
- Icon + ACF Dynamic Tag: `head_office_address`
- Icon + ACF Dynamic Tag: `phone`
- Icon + ACF Dynamic Tag: `email`

Legal / compliance disclaimer (if the project has one):
- Text Editor widget → ACF Dynamic Tag: `disclaimer`. Must render verbatim and never be truncated — treat client legal copy as sign-off-gated.

Bottom bar (border-top, flex row space-between):
- Copyright line (Dynamic Tag or `[current_year]` shortcode for the year)
- Optional "Design by `<agency>`" credit + logo → agency URL (external, `_blank`)

### Step 3 — Floating Reviews / Promo Popup (optional)

Elementor → Templates → Popups → Add New.
- Condition: All Pages
- Trigger: On Scroll — distance per design (e.g. 400px)
- Frequency: per design (e.g. every visit)
- Close: enable × button

Layout: small card (radius, shadow, max-width per design). Content per design — e.g. reviews image → rating text → star icons → review count → CTA button → ACF Options URL (`_blank`).

---

## 7. Phase 5 — Loop Templates

Loop Grid widget + Loop Template is the pattern for **every** CPT archive/grid. Build one card template per CPT via Elementor → Templates → Loop Templates. All field values come through Dynamic Tags.

### Blog Card Loop Template
Widgets inside one container:
1. Featured Image (aspect ratio per design, object-fit cover)
2. Category pill — Dynamic Tag: ACF `display_category_label` (styled per design)
3. Date — Dynamic Tag: Post Date
4. Title H3 — Dynamic Tag: Post Title
5. Excerpt — Dynamic Tag: Post Excerpt
6. "Read more →" link — Dynamic Tag: Post URL (or ACF `external_url_override` if set)

Card hover: `translateY(-4px)` + `--shadow-lg` (via container Custom CSS or component partial).

### Industry (category) Card Loop Template
1. Icon chip — icon driven by Dynamic Tag: ACF icon-name field
2. Title H3 — Dynamic Tag: Post Title
3. Description — Dynamic Tag: ACF `short_description`
4. "View →" link — Dynamic Tag: ACF `landing_page_url`

Card hover per design (e.g. icon chip colour shift + lift + shadow).

### Testimonial Card Loop Template
1. Star icons (fixed for now unless a rating field exists)
2. Blockquote — Dynamic Tag: ACF `quote_text`
3. Attribution — Dynamic Tag: ACF `attribution`
4. Context — Dynamic Tag: ACF `location_context`

> Icons: Lucide is a recommended default (upload as SVG) — confirm the icon set per project.

---

## 8. Phase 6 — Global Sections

Build once as Global templates: right-click container → Save as Template → check "Save as Global". Edits sync everywhere.

**Build order (most-reused first):**

### 1. USP / feature strip
Flex row of icon boxes; stacks to a column at the mobile breakpoint. Build first since it appears on most pages.

### 2. Why Choose Us (feature grid)
Container grid (columns per design) of icon boxes.

### 3. Locations Panel (if multi-location)
Pill buttons + content area (address card + map embed). Tabs widget (Pro), one tab per location; first/HQ tab active by default. If a Maps embed needs an API key, note it for the PM go-live checklist.

### 4. Contact CTA (build after Form 1 exists)
Dark brand-bg container: heading + supporting panel (left) + Gravity Form widget (right). Grid 2-col.

### 5. Testimonials (build after testimonial CPT has sample content)
Loop Grid with the Testimonial Card template (or Testimonials widget as an interim). Filter which items surface per page via the ACF Relationship field.

---

## 9. Phase 7 — Saved Section Templates

Build first on the noted page, then save as a template and insert + **unlink from library** on subsequent pages so each can be edited independently.

| Template | Build first on | Reuse on |
|---|---|---|
| FAQ Panel | First page built | All other pages — unlink each; different questions per page |
| Internal Hero | About | Other interior pages — unlink each |
| Service Hero | First service page | Other service pages — unlink |
| Mid-page Lead-In | First service page | Other service pages — unlink each |

---

## 10. Phase 8 — Page Build Order

Build dependencies first, homepage last. The homepage typically composes every Global Section, both forms, and all Loop Templates, so it comes after everything it depends on.

| Step | Page | Complexity | Dependencies |
|---|---|---|---|
| 1 | **Global Kit** | — | Phase 0 tokens compiled |
| 2 | **Theme Builder: Header** | High | Global Kit, Primary Nav menu created |
| 3 | **Theme Builder: Footer** | High | Global Kit, ACF Options content entered, footer menus created |
| 4 | **Floating Popup** (if used) | Low | ACF Options URL entered |
| 5 | **Loop Templates** (card per CPT) | Medium | CPTs registered, ACF fields created, sample content entered |
| 6 | **Global Sections** | Medium | Form 1 created; Location CPT content; testimonial Loop Template done |
| 7 | **Homepage** | High | Everything above |
| 8 | **Contact** | Low | Form 1; Header/Footer; Locations Panel |
| 9 | **Services (hub)** | Medium | Header/Footer; Internal Hero; Form 1 |
| 10 | **Service detail pages** | Medium | Header/Footer; Service Hero + Mid-page Lead-In; Form 1; Why Choose Us |
| 11 | **About** | High | Header/Footer; `team_member` CPT populated with photos |
| 12 | **Category hub (Industries)** | Medium | Header/Footer; Industry Loop Template; category CPT items |
| 13 | **Category detail pages** | Medium | Header/Footer; Testimonials; Form 1 |
| 14 | **Locations hub + detail** | Medium | Header/Footer; `location` CPT populated |
| 15 | **Blog / Insights** | Low | Header/Footer; Blog Card Loop Template; posts migrated |

---

## 11. Dependency Map

```
Phase 0 (Custom code + SCSS tokens → main.css)
  └── Phase 1 (Global Kit)
        └── Phase 2 (ACF Field Groups)
        │     └── Enter sample content into CPTs
        └── Phase 3 (Gravity Forms)
        └── Phase 4 (Theme Builder — Header + Footer + Popup)
              └── Phase 5 (Loop Templates)
              └── Phase 6 (Global Sections)
                    └── Phase 7 (Saved Section Templates — built during page builds)
                          └── Phase 8 (Pages — in order)
                                Homepage requires ALL of the above
```

**Nothing can start without Phase 0.**
**No pages can start without Phase 4 (Header + Footer).**
**Homepage is last of the core pages** — it requires every Global Section, both forms, and all Loop Templates.

---

## 12. Custom Code Summary

Site styling is authored in `scss/` → compiled to `assets/css/main.css` (rebuild and commit after changes). Custom PHP goes in `functions.php` or an `inc/setup.php` included from it. Never inline secrets/keys — use env vars or a secret manager.

| Snippet | Where | When to add |
|---|---|---|
| Design tokens + resets + keyframes | `scss/abstracts/_tokens.scss` + `scss/base/` → `main.css` | Phase 0 |
| CPT registrations | `init` action | Phase 0 |
| ACF Options Page | after `acf_add_options_page` check | Phase 0 |
| Multi-step form auto-advance JS | `wp_footer` action | Before homepage build (if used) |
| Header scroll shadow JS | `wp_footer` or Elementor Custom Code | After header template is built |
| Review-tool script | `wp_head` action | Temp — remove before handoff |

**No CPT content is hard-coded in Elementor.** All CPT data surfaces via ACF Dynamic Tags inside Loop Templates or individual widget Dynamic Tag connections.

# BUILD-PROCESS.md — Claude Design → WordPress Production Playbook

> **Purpose.** A single, repeatable process for turning an **approved Claude-generated static design**
> (HTML/CSS/JS prototype, e.g. `cg-law.vercel.app`) into a **production WordPress + Elementor site**
> that is **pixel-perfect**, **client-editable**, and **not an HTML clone** — without the back-and-forth
> that shaped the CG Law build.
>
> **Audience.** Hybrid. Claude executes it; the Five by Five team follows the same phases and gates.
> **Scope.** Approved design → go-live. (The design/prototype phase happens before this doc.)
> **Status.** v1, distilled from the CG Law WP Test build (see `contextwptest.md` for the worked example).
>
> **How to use.** Copy this file into each new project folder. Work top-to-bottom. Do not skip the
> **Phase 0 sign-off gate** — it is the single biggest preventer of rework.

---

## 0. The one idea that prevents 80% of rework

Every past reversal on CG Law came from **deciding how a block should be built/edited AFTER building it**.
The fix is to **classify every block up front and get the client to sign off** before a single widget is
built. Everything else in this doc flows from that.

Two questions, asked of the client for **every content block**, settle almost every architecture decision:

1. **"Will you add / remove / reorder these items over time?"** (offices, team, testimonials, services…)
   → if **yes**, it's a **Custom Post Type feed** (dynamic), not hand-placed widgets.
2. **"Do you want to edit each item as a separate object in the page builder, or should the whole panel be
   ONE locked block you only edit through a content list?"**
   → the client has **always** wanted the **locked single object** → **use a shortcode feed, never an
   Elementor Loop Grid.** (Loop Grids expose a per-card "Edit Template" button — the thing the client
   repeatedly rejected.)

---

## 1. The locked tech stack (standard — do not vary without a decision)

| Layer | Choice | Notes |
|---|---|---|
| CMS | **WordPress** (latest, PHP 8+) | `/%postname%/` permalinks |
| Theme | **Hello Elementor** | minimal; the design lives in Elementor + CSS |
| Builder | **Elementor 4.x free + Elementor Pro** | **container (flexbox) model, NOT sections/columns** |
| Data layer | **ACF (free)** | field groups per CPT. ⚠️ **Options pages need ACF *Pro*** — plan around this (use template editing / theme_mods instead of ACF options) |
| Forms | **Gravity Forms** | one central form per purpose, embedded by shortcode |
| SEO | **Yoast** | |
| Host | **Kinsta** | aggressive cache; Cloudflare front |
| Icons | **inline SVG** (uploaded to media, mapped in an icon option) | **not** icon webfonts — see Golden Rule G7 |

**Global Elementor Kit (set once, first thing):**
- Palette + fonts as design tokens (CG: `#C41130` primary, `#231F20` ink, `#D34F61` accent; Roboto Slab
  700 display / Poppins 600 UI / Source Sans 3 body).
- **Content width** = the design's wide container (CG: 1320px).
- **`space_between_widgets` = 0.** ⚠️ In the container model this is the **default flex-gap between every
  container's children**, not a widget margin. Leaving it at 20 inflated CG's page height ~1,400px across
  ~250 containers. Keep it 0; control spacing with explicit margins / container gaps.

---

## 2. Golden Rules (the doctrine — non-negotiable defaults)

- **G1 — Locked single objects for all repeating content.** Dynamic feed = **CPT + ACF + a shortcode that
  renders plain HTML**. **Never a Loop Grid** for a panel the client wants locked. (Testimonials, team,
  industries, services, blog were all migrated Loop Grid → shortcode for exactly this reason.)
- **G2 — No HTML clones. No structural HTML inside `text-editor` widgets.** A `text-editor` may hold **only
  plain body copy + inline links**. Everything structural is a native widget (Heading, Button, Icon,
  Icon-List, Nested-Accordion, Nested-Tabs, Google Maps, Image, Social Icons) **or** lives inside a feed
  shortcode's PHP string. If you catch yourself putting `<div>/<ul>/<svg>/<address>` in a text-editor, stop.
- **G3 — Reusable panels are Elementor *section templates*.** Build once in `elementor_library`, embed
  everywhere via the **Template widget**. Edit once → propagates to every page. (CG: CTA 295, Insights 310,
  How We Work 404, Client Outcomes 412, Our People 416, Services 493, Industries 435, Stats 501, Locations
  503, Why Choose Us 515.)
- **G4 — Navigation / link lists / legal = WP menus** (Appearance → Menus), rendered by a **custom walker
  or shortcode** that emits the exact design markup. Editable by a non-dev, byte-perfect render.
- **G5 — Static marketing content = native Elementor widgets** (Heading/Text/Button/Icon), placed in a
  section template if reused. Every element stays editable in the canvas.
- **G6 — Forms = Gravity Forms**, one form per purpose, embedded via `[gravityform id=N]` inside a shared
  template so one edit updates every page.
- **G7 — Icon fidelity via inline SVG / CSS mask, never icon webfonts.** FontAwesome/eicon webfonts are
  **not reliably enqueued** on the front end here → glyphs render blank. Upload SVGs to media + an icon map
  and use them in Icon widgets, or paint the exact shape with a CSS `mask`/gradient. Colour via CSS.
- **G8 — Editable chrome + dynamic content when both are needed.** If the client must edit a *container*
  (e.g. add/rename tabs) **and** the content must come from a CPT: keep the **native Elementor widget**
  (Nested-Tabs/Accordion) for the chrome, and put a **per-item shortcode** (`[cg_location id="X"]`) inside
  each tab. Chrome edited in Elementor; item data edited in the CPT.
- **G9 — Builders are idempotent and self-healing.** Every `_build_*.php` writes `_elementor_data`
  **directly** (the `$document->save()` API leaves it empty), sets `_elementor_edit_mode=builder`,
  **clears the stale autosave + revisions**, touches `post_modified`, clears Elementor CSS cache, and
  purges host cache. (See Gotcha #2.)
- **G10 — Pixel-perfect is verified, not asserted.** Diff computed styles (CDP harness) and screenshots
  against the approved design before claiming done. Freeze carousels first (`?cgstatic=1`).
- **G11 — Respect brand/compliance rules from the brief** (e.g. CG: always "Clifford Gouldson Lawyers",
  never "specialist" or "free consultation", footer disclaimer required, no em dashes).

---

## 3. Phase 0 — Discovery & the Content Editability Map ⛔ SIGN-OFF GATE

**No building starts until the client signs off this map.** Walk the approved design top to bottom and put
**every block** in the table below. Ask the two questions from §0 for each. This is the contract that
prevents rework.

### 3a. The decision tree (classify each block)

```
Is the block a FORM?
  └─ yes → GRAVITY FORM, embedded by shortcode in a shared template.            [type: FORM]
Is it NAVIGATION / a link list / legal menu?
  └─ yes → WP MENU (Appearance→Menus) + custom walker/shortcode render.         [type: MENU]
Will the client ADD / REMOVE / REORDER items over time? (people, offices,
posts, testimonials, services, industries…)
  └─ yes → CUSTOM POST TYPE + ACF + shortcode feed (single locked object).
           • Needs its own detail page per item?  → make the CPT Elementor-editable.
           • Client must also edit the CONTAINER (tabs/labels/order)?
                → editable native chrome (Nested-Tabs) + per-item shortcode.    [type: CPT-FEED / CPT-CHROME]
  └─ no  → Is the SAME panel reused on multiple pages?
             └─ yes → NATIVE widgets in a SECTION TEMPLATE (edit once).          [type: TEMPLATE]
             └─ no  → NATIVE widgets inline on the page.                          [type: STATIC]
```

**Never** produces: a Loop Grid for a locked panel; structural HTML in a text-editor; an HTML clone of a
whole section; icon webfonts.

### 3b. The Content Editability Map (fill in, client signs)

| # | Block (design) | Type (STATIC / TEMPLATE / CPT-FEED / CPT-CHROME / FORM / MENU) | Who edits what, where | Notes / detail pages? |
|---|---|---|---|---|
| 1 | Header / nav | MENU + native chrome | Links → Appearance→Menus; logo/CTA → header template | mega-menu = N groups |
| 2 | Hero | STATIC / TEMPLATE | copy → Elementor | |
| 3 | … | … | … | … |
| n | Footer | MENU + native | link cols → Menus; blurb → footer template | |

> Also capture in Phase 0: sitemap & page list, the brand/compliance rules, the CPTs implied by the map
> (with their ACF fields), which panels are reused (→ templates), form fields + notification recipients,
> and who the client's editors are (what they'll realistically touch).

**Exit gate:** client signs the map. Only then proceed.

---

## 4. Phase 1 — Environment & foundation

1. **Provision** WP on Kinsta; install/activate Hello Elementor, Elementor + Pro, ACF, Gravity Forms, Yoast.
2. **Permalinks** → `/%postname%/`.
3. **Global Kit** (§1): palette, fonts, content width, **`space_between_widgets = 0`**.
4. **Site identity**: correct legal name (never a shorthand), logo (light + dark), favicon.
5. **Enable uploaded SVGs** (`elementor_unfiltered_files_upload = 1`); create the icon map option and upload
   the design's icons to `uploads/<icons>/` (record ids in the option).
6. **Deploy tooling** (record credentials in the project context file, rotate before sharing):
   - Non-interactive SSH/WP-CLI wrapper (`_ssh.exp`).
   - **File transfer = base64 a single file, pipe, decode** (concatenating many hits "Argument list too
     long"; **gzip large CSS**: `gzip -c | base64` → `base64 -d | gunzip`).
   - **Cloudflare blocks default User-Agents (error 1010)** → every REST/curl/headless call sends a browser
     UA. A screenshot helper (`_shot2.sh <url> <prefix>`) handles this.
   - **Cache**: `wp kinsta cache purge --all` after every deploy; `?cb=<ts>` buster for manual checks.

---

## 5. Phase 2 — Ingest the approved design (source of truth)

- Save the design's **exact CSS + markup + JS** locally (`cg_css.txt`, `cg_markup.txt`, `cg_js.txt`). Read
  px/colours/weights from these — **never guess**. If the live design is ahead of the saved CSS, **measure
  the live site**.
- Stand up the **computed-style QA harness** (Chrome DevTools Protocol via Python `websocket-client`,
  headless Chrome with a browser UA): navigate both the design and the build, walk elements, return computed
  `fontSize/color/margins/padding/getBoundingClientRect`, match by text content, diff. This finds
  font-size/colour/spacing mismatches far faster than eyeballing.
- Note the design's **container widths, section paddings, carousel behaviour, and any JS** (sliders,
  counters, tabs) so they can be reproduced with `cg-slider.js`-style helpers.

---

## 6. Phase 3 — Build order & per-block recipes

**Build order:** (1) global kit & foundation → (2) header + footer + nav menus → (3) reusable section
templates & their CPTs/shortcodes → (4) homepage assembling the templates → (5) inner pages reusing the
templates → (6) forms → (7) SEO/redirects. Always build the **shared template/CPT before** the page that
embeds it.

### Recipe A — STATIC / TEMPLATE (native widgets)
Build the panel with native widgets (Heading/Text/Button/Icon/Image). If reused, save as a **section
template** and embed via the Template widget wrapped in a full-bleed container
(`css_classes: cg-tpl-embed cg-<x>-embed`). Keep an inline fallback in the builder (`if($tplId) …else…`).
Typography/colour baked into **widget settings** (cleaner than fighting the cascade).

### Recipe B — CPT-FEED (dynamic, single locked object)  ← the workhorse
1. **mu-plugin** (`cg-<thing>.php`): `register_post_type()` (real slug; `page-attributes` for `menu_order`;
   Elementor-editable if it needs detail pages — add to `elementor_cpt_support`).
2. **ACF group** (`group_cg_<thing>`) with the fields from the Editability Map. Name = the **post title**.
3. **Shortcode** `[cg_<thing>_grid]` = `WP_Query(menu_order)` → **plain HTML** cards (the exact design
   markup + classes), **no Elementor sub-objects**. `esc_*` everything. Inline SVGs from the icon map.
4. **Idempotent seeder** (`_seed_<thing>.php`) creating the initial posts + ACF via **field keys**.
5. **Section template** (`_build_<thing>_tpl.php`): native chrome (eyebrow/H2/lead/button) + a **Shortcode
   widget** running the feed. Embed on pages via the Template widget.
6. **CSS**: the shortcode renders plain HTML → target that HTML (not Elementor DOM). If it's a **carousel**,
   add the card's class to `cg-slider.js`'s slide filter **and** give it the 4-up flex width (Gotcha #4).

### Recipe C — CPT-CHROME (editable container + dynamic items)
Native **Nested-Tabs/Accordion** widget for the chrome (labels/order editable in Elementor), seeded from the
CPT at build time; each tab/item holds a **per-item shortcode** `[cg_<thing> id="X"]` rendering one post's
card. (CG Locations: nested-tabs + `[cg_location id]`.) Chrome edited in the template; data edited in the CPT.

### Recipe D — MENU (nav / footer links / legal)
Register menu locations; build the menus idempotently (skip if they exist unless forced — don't wipe client
edits); render via a **custom walker/shortcode** emitting the exact `.mega-menu`/`.dd-menu` markup the CSS
styles. Per-item CSS classes (set in Appearance→Menus) drive mega vs dropdown vs plain.

### Recipe E — FORM (Gravity Forms)
Build the form via **`GFAPI`** in PHP (`wp gf` CLI add-on may be absent). Custom submit button via a
`gform_submit_button_<id>` filter if the design needs an inline arrow. Embed `[gravityform id=N …]` inside
the shared CTA template so it flows site-wide. Scope GF-theme-neutralising CSS to `#gform_wrapper_<id>`.

### Recipe F — the idempotent builder skeleton (every `_build_*.php`)
```php
// 1. build $data = array($section);           // container/widget tree via SEC/COL/INSEC/W helpers
// 2. find-or-create the target post/template by slug
// 3. update_post_meta(_elementor_data, wp_slash(wp_json_encode($data)))  // write meta DIRECTLY
//    update_post_meta(_elementor_edit_mode,'builder'); set template type/version
// 4. clear stale autosave + revisions; touch post_modified               // Gotcha #2
// 5. \Elementor\Plugin::$instance->files_manager->clear_cache();
// 6. echo a verification line (counts of the widgets you expect)
// Deploy: php -l  →  wp eval-file  →  wp kinsta cache purge --all
```
**CSS-class key (memorise):** containers/sections/columns use **`css_classes`**; **widgets use
`_css_classes`** (with underscore). Wrong one = class silently not rendered.

---

## 7. Phase 4 — QA & pixel-perfection (gate before handoff)

Run for **every** built page/template:
1. **Pixel diff** vs the approved design: `_shot2.sh` both sites (freeze carousels `?cgstatic=1`, force a
   slide with `?cgidx=N`), compare band by band; use the computed-style harness for font/colour/spacing.
   When text "looks wrong" but the computed colour matches, check **letter-spacing / weight / font-family**
   before touching the colour value (real CG bug).
3. **Editability check:** native widgets open in the canvas; CPT content editable in wp-admin; menus in
   Appearance→Menus; **no per-card "Edit Template" buttons** on locked panels (`0 e-loop-item`).
4. **Dynamics:** add/remove a CPT post → the feed updates; carousels advance; tabs/accordions switch; the
   form submits and notifies.
5. **Autosave sanity:** front end and editor match (builders cleared the autosave). If they diverge, an
   autosave is stale — clear it and tell the client to reopen **without saving**.
6. **Cross-page:** shared templates propagate; page-specific CSS is scoped (homepage rules are often
   `.elementor-page-<id>`-scoped — a new CPT page needs its own scope + full-bleed/padding restores).

---

## 8. Phase 5 — Handoff & go-live

- **Localise all images** into WP media (kill any `…vercel.app/assets/…` origins).
- **SEO/redirects:** Yoast titles/meta, XML sitemap, 301s from old URLs, root-level slugs where wanted.
- **CSS consolidation pass** (standing debt on every build): remove dead legacy selectors and flatten the
  `!important` stack in the site CSS — specificity regressions are the #1 cause of "my fix didn't apply."
- **Mobile check** at ~390px (the 1440px screenshot tool won't catch it).
- **Client editing guide** — a short map of *what is edited where*:
  - repeating content → its **CPT** in wp-admin;
  - reused panels' layout → the **section template**;
  - nav/footer/legal links → **Appearance → Menus**;
  - forms → **Gravity Forms**;
  - logo/identity → **Customizer**.
- **Autosave warning to the client:** if a template's editor was open during a rebuild, close it **without
  saving** and reopen, or it will re-save a stale version.

---

## 9. Appendix — Gotchas checklist (paste into every build's QA)

1. **`space_between_widgets` = 0** (container flex-gap default; 20 bloats height massively).
2. **Stale Elementor autosave** — front end new, editor old. Builders must clear autosave + revisions +
   touch `post_modified`. Tell the client to reopen without saving.
3. **Write `_elementor_data` directly** (`update_post_meta` + `wp_slash(wp_json_encode())` +
   `_elementor_edit_mode=builder`); `$document->save()` leaves it empty.
4. **Shortcode carousel not sliding** — add the card class to `cg-slider.js`'s slide filter **and** give it
   4-up flex width. Re-test the OTHER carousels (one change can break them).
5. **Grid items keep inline `width:%`** from the `COL()` helper → force `width:auto` inside CSS grids.
6. **Equal-height card + pinned CTA** — use CSS grid on the card (`grid-template-rows:auto 1fr`) + CTA
   `margin-top:auto`; flex `height:100%` chains don't resolve through shortcode/loop DOM.
7. **Specificity/`!important` battles** — the #1 cause of "my fix didn't apply." Check the selector matches
   the current DOM; raise specificity; schedule the consolidation pass.
8. **Icons blank** — webfonts not enqueued. Inline SVG (`Svg_Handler::get_inline_svg($id)` / icon map) +
   CSS colour, or CSS `mask` for a fixed glyph. **SVG icon value format** for an Icon widget:
   `selected_icon => ['value'=>['id'=>ID,'url'=>URL],'library'=>'svg']` + `__fa4_migrated` + `icon=>''`.
9. **No structural HTML in text-editors** (Rule G2).
10. **Nested Tabs/Accordion** — `settings.items|tabs[]` must be paired 1:1 with `elements[]`; use a helper
    (`cg_faq_nested()`, `cg_loc_nested()`) and assert `count()` equality. Nested-Tabs titles have **no
    typography controls** — style via `--n-tabs-*` vars / CSS.
11. **ACF `[acf]` shortcode disabled by default** → use dynamic tags or a custom shortcode; enable with
    `add_filter('acf/settings/enable_shortcode','__return_true')` if needed.
12. **Theme-builder templates** see the *template* as `$post` → use `get_queried_object_id()`.
13. **CPT `rewrite slug`** must be a real slug (empty breaks routing); **flush rewrites** after registering a
    new CPT (`wp rewrite flush`) or single posts 404.
14. **Loop Grid = per-card editing** (architectural, not a bug). Use a shortcode feed for locked panels (G1).
15. **Cloudflare 1010** — always send a browser UA (incl. headless).
16. **Large CSS transfer** silently truncates single-arg base64 → gzip it.
17. **ACF is the FREE tier** — no options pages. Plan editing around template editing / Customizer / theme_mods.

---

## 10. Appendix — the deploy loop (copy/paste)

```bash
cd "<project folder>"
# CSS (gzip for large files):
C=$(gzip -c site.css | base64 | tr -d '\n'); ./_ssh.exp "echo $C | base64 -d | gunzip > /tmp/u.css && cd <wp root> && D=\$(wp eval 'echo wp_upload_dir()[\"basedir\"];') && cp /tmp/u.css \$D/site.css"
# JS / mu-plugin: base64 a single file, decode, php -l, place.
# Builder (ALWAYS php -l first; never deploy a parse error):
B=$(base64 < _build_x.php | tr -d '\n'); ./_ssh.exp "echo $B | base64 -d > /tmp/b.php && php -l /tmp/b.php && cd <wp root> && wp eval-file /tmp/b.php 2>&1 | grep -v Warning"
# Always purge + verify:
./_ssh.exp "cd <wp root> && wp kinsta cache purge --all 2>/dev/null"
./_shot2.sh "<design-url>?cb=$(date +%s)" ref
./_shot2.sh "<wp-url>?cgstatic=1&cb=$(date +%s%N)" wp
```

---

## 11. Appendix — Phase 0 client sign-off template

> **Project:** ____   **Design ref:** ____   **Date:** ____
> Below is every block on the site and how it will be built and edited. Building starts once this is approved.
>
> *(attach the completed Content Editability Map from §3b)*
>
> I confirm: the classification of each block (static / reusable template / CPT feed / editable-chrome+dynamic
> / form / menu), that repeating content is managed via its content type (not hand-placed), that panels are
> **single locked objects** (no per-card editing), and the listed CPTs/fields, reused templates, form fields
> + recipients, and brand/compliance rules.
>
> **Signed:** ____________________

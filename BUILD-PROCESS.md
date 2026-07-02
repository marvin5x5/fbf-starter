# BUILD-PROCESS.md — Claude Design → WordPress Production Playbook

> **Purpose.** A single, repeatable process for turning an **approved Claude-generated static design**
> (HTML/CSS/JS prototype, e.g. `cg-law.vercel.app`) into a **production WordPress + Elementor site**
> that is **pixel-perfect**, **client-editable**, and **not an HTML clone** — without the back-and-forth
> that shaped the CG Law build.
>
> **Audience.** Hybrid. Claude executes it; the Five by Five team follows the same phases and gates.
> **Scope.** Approved design → go-live. (The design/prototype phase happens before this doc.)
> **Status.** v2 — converted to **methodology C (Loop Grid + Loop Template)** on 2026-07-02 (test-run
> reconciliation; the prior methodology-A "shortcode feed" version is preserved at git tag `doctrine-A`).
> Distilled from the CG Law WP Test build.
>
> **How to use.** Copy this file into each new project folder. Work top-to-bottom. Do not skip the
> **Phase 0 sign-off gate** — it is the single biggest preventer of rework.
>
> **Reconciliation (Test Run 2026-07-02) — methodology C (Loop Grid) adopted.** See **§12** for the fold-in
> of the 15 test-run hiccups; the prior methodology-A ("shortcode feed") version is at git tag `doctrine-A`.
>
> **Canonical & doc-sync.** This file is the single source of truth; it lives at
> `fbf-starter/BUILD-PROCESS.md` and supersedes the earlier generic lifecycle doc. The
> `design-to-elementor-wp` skill and `CLAUDE.md` are **generated from it** — never hand-edit them;
> regenerate after any change here.

---

## 0. The one idea that prevents 80% of rework

Every past reversal on CG Law came from **deciding how a block should be built/edited AFTER building it**.
The fix is to **classify every block up front and get the client to sign off** before a single widget is
built. Everything else in this doc flows from that.

Two questions, asked of the client for **every content block**, settle almost every architecture decision:

1. **"Will you add / remove / reorder these items over time?"** (offices, team, testimonials, services…)
   → if **yes**, it's a **Custom Post Type feed** (dynamic), not hand-placed widgets.
2. **"Do you edit each item as its own entry in a content list (wp-admin), with the page just displaying
   them?"**
   → **yes** → **CPT + ACF, displayed by an Elementor Loop Grid + Loop Template** — one card template,
   edited once; items are managed in wp-admin, never hand-placed on the page.

---

## 1. The locked tech stack (standard — do not vary without a decision)

| Layer | Choice | Notes |
|---|---|---|
| CMS | **WordPress** (latest, PHP 8+) | `/%postname%/` permalinks |
| Theme | **Hello Elementor** | minimal; the design lives in Elementor + CSS |
| Builder | **Elementor 4.x free + Elementor Pro** | **container (flexbox) model, NOT sections/columns** |
| Data layer | **ACF Pro** | field groups per CPT **+ a Site Settings Options page** for site-wide content; pull all values via Elementor **Dynamic Tags** |
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

- **G1 — Repeating content = CPT + ACF, rendered by a Loop Grid + Loop Template.** Every archive/grid
  (testimonials, team, industries, services, blog) is a CPT surfaced through **one Elementor Loop Template**
  inside a **Loop Grid** widget. Content is managed in wp-admin; the card is edited once in the Loop
  Template; values flow via **Dynamic Tags** — never hard-code CPT data into widgets.
- **G2 — No HTML clones. No structural HTML inside `text-editor` widgets.** A `text-editor` may hold **only
  plain body copy + inline links**. Everything structural is a native widget (Heading, Button, Icon,
  Icon-List, Nested-Accordion, Nested-Tabs, Google Maps, Image, Social Icons) **or** a Loop Template's
  widgets. If you catch yourself putting `<div>/<ul>/<svg>/<address>` in a text-editor, stop.
- **G3 — Reusable panels are Elementor *section templates*.** Build once in `elementor_library`, embed
  everywhere via the **Template widget**. Edit once → propagates to every page. (CG: CTA 295, Insights 310,
  How We Work 404, Client Outcomes 412, Our People 416, Services 493, Industries 435, Stats 501, Locations
  503, Why Choose Us 515.)
- **G4 — Navigation = the Elementor Pro Nav Menu widget** (built on a WP menu in Appearance → Menus). Style
  links / dropdowns / mega-menus via widget settings for a pixel-exact render; a non-dev edits the items in
  Appearance → Menus. Don't hand-roll a custom walker.
- **G5 — Static marketing content = native Elementor widgets** (Heading/Text/Button/Icon), placed in a
  section template if reused. Every element stays editable in the canvas.
- **G6 — Forms = Gravity Forms**, one form per purpose, embedded via `[gravityform id=N]` inside a shared
  template so one edit updates every page.
- **G7 — Icon fidelity via inline SVG / CSS mask, never icon webfonts.** FontAwesome/eicon webfonts are
  **not reliably enqueued** on the front end here → glyphs render blank. Upload SVGs to media + an icon map
  and use them in Icon widgets, or paint the exact shape with a CSS `mask`/gradient. Colour via CSS.
- **G8 — Editable chrome + dynamic content when both are needed.** Keep the **native Elementor widget**
  (Nested-Tabs/Accordion) for the chrome the client edits, and drive each panel's items from the CPT via a
  **Loop Grid** (or Dynamic-Tag-bound widgets) inside it. Chrome edited in Elementor; item data in the CPT.
- **G9 — Build in the Elementor UI / Theme Builder; register data in code.** Pages, templates, header/
  footer, Loop Templates and Global/Saved sections are built in the Elementor editor. CPTs, ACF field groups
  and the Options page are registered in `functions.php` / `inc/setup.php`. If you ever *script* an Elementor
  document, write `_elementor_data` directly + `_elementor_edit_mode=builder`, clear the stale
  autosave/revisions, and flush Elementor CSS cache (Gotcha #2).
- **G10 — Pixel-perfect is verified, not asserted.** Diff computed styles (CDP harness) and screenshots
  against the approved design before claiming done. Freeze carousels first (`?cgstatic=1`).
- **G11 — Respect brand/compliance rules from the brief** (e.g. CG: always "Clifford Gouldson Lawyers",
  never "specialist" or "free consultation", footer disclaimer required, no em dashes).

---

## 3. Phase 0 — Discovery & the Content Editability Map ⛔ SIGN-OFF GATE

**Prerequisite:** the approved design must be present in `static-website-reference/` — Phase 0 cannot start without it.

**No building starts until the client signs off this map.** Walk the approved design top to bottom and put
**every block** in the table below. Ask the two questions from §0 for each. This is the contract that
prevents rework.

### 3a. The decision tree (classify each block)

```
Is the block a FORM?
  └─ yes → GRAVITY FORM, embedded by shortcode in a shared template.            [type: FORM]
Is it NAVIGATION / a link list / legal menu?
  └─ yes → Elementor Pro NAV MENU widget (built on a WP menu).                  [type: MENU]
Will the client ADD / REMOVE / REORDER items over time? (people, offices,
posts, testimonials, services, industries…)
  └─ yes → CUSTOM POST TYPE + ACF, shown via a LOOP GRID + LOOP TEMPLATE.
           • Needs its own detail page per item?  → make the CPT Elementor-editable.
           • Client must also edit the CONTAINER (tabs/labels/order)?
                → editable native chrome (Nested-Tabs) + a Loop Grid inside.    [type: CPT-LOOP / CPT-CHROME]
  └─ no  → Is the SAME panel reused on multiple pages?
             └─ yes → NATIVE widgets in a SECTION TEMPLATE (edit once).          [type: TEMPLATE]
             └─ no  → NATIVE widgets inline on the page.                          [type: STATIC]
```

**Never** produces: structural HTML in a text-editor; an HTML clone of a whole section; icon webfonts;
hard-coded CPT values in widgets (always Dynamic Tags).

### 3b. The Content Editability Map (fill in, client signs)

| # | Block (design) | Type (STATIC / TEMPLATE / CPT-LOOP / CPT-CHROME / FORM / MENU) | Who edits what, where | Notes / detail pages? |
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

> **Step zero (stamp).** `cp .env.example .env` → fill it → `npm run init`, then verify **no `{{TOKEN}}`
> placeholder remains** in the theme or docs before building. The starter ships **recipes, not runnable
> setup code** — the CPT/ACF/Global-Kit snippets here and in the developer references are patterns to
> apply, not pre-wired code.

1. **Provision** WP on Kinsta; install/activate Hello Elementor, Elementor + Pro, ACF, Gravity Forms, Yoast.
2. **Permalinks** → `/%postname%/`.
3. **Global Kit** (§1): palette, fonts, content width, **`space_between_widgets = 0`**.
4. **Site identity**: correct legal name (never a shorthand), logo (light + dark), favicon.
5. **Enable uploaded SVGs** (`elementor_unfiltered_files_upload = 1`); create the icon map option and upload
   the design's icons to `uploads/<icons>/` (record ids in the option).
6. **Deploy tooling** (keep credentials in **`.env.local` (gitignored) or a secret manager — never in the git-tracked `.env` or committed**; rotate before sharing):
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

> **⛔ Checkpoint — methodology.** This doctrine is **methodology C (Loop Grid + Loop Template)**. Confirm C
> still fits the project before building repeating content; only revisit if the client needs the locked-object
> guarantee (then see the `doctrine-A` tag). This checkpoint also lands in `developer-build-order.md` on regen.

**Build order:** (1) global kit & foundation → (2) header + footer + nav menus → (3) CPTs + ACF + Loop
Templates → (4) reusable Global/Saved sections → (5) homepage assembling them → (6) inner pages → (7) forms
→ (8) SEO/redirects. Always build the **CPT + Loop Template / shared section before** the page that embeds it.

### Recipe A — STATIC / TEMPLATE (native widgets)
Build the panel with native widgets (Heading/Text/Button/Icon/Image). If reused, save as a **section
template** and embed via the Template widget wrapped in a full-bleed container
(`css_classes: cg-tpl-embed cg-<x>-embed`). Keep an inline fallback in the builder (`if($tplId) …else…`).
Typography/colour baked into **widget settings** (cleaner than fighting the cascade).

### Recipe B — CPT-LOOP (dynamic archive/grid)  ← the workhorse
1. **Register the CPT** in `functions.php` / `inc/setup.php`: `register_post_type()` (real slug, `show_in_rest`;
   `page-attributes` for `menu_order`; Elementor-editable if it needs detail pages). Flush rewrites (Gotcha #13).
2. **ACF field group** (per the Editability Map) assigned to the CPT; every display value is a **Dynamic Tag**.
3. **Loop Template** (Elementor → Templates → Loop): one card built from native widgets, each bound to a
   Dynamic Tag. Card hover/lift in the component SCSS partial.
4. **Loop Grid widget** on the page/section runs the query — order by `menu_order`/date; filter per page via
   an ACF Relationship or taxonomy. Columns/gap per design.
5. **Sample content:** enter a few real CPT entries so the grid can be built and QA'd.
6. **CSS**: target the Loop Grid's DOM. For a carousel use the **Loop Carousel** (or the design's slider JS).

### Recipe C — CPT-CHROME (editable container + dynamic items)
Native **Nested-Tabs/Accordion** widget for the chrome (labels/order editable in Elementor); each tab holds a
**Loop Grid** (or Dynamic-Tag-bound widgets) filtered to that tab's CPT items. Chrome edited in the template;
item data edited in the CPT.

### Recipe D — MENU (nav / footer links / legal)
Create the WP menu(s) in Appearance → Menus, then render with the **Elementor Pro Nav Menu widget** (header)
and Nav Menu / Icon-List widgets (footer columns). Style dropdowns/mega-menus via widget settings; per-item
CSS classes (set in Appearance→Menus) drive mega vs dropdown vs plain. No custom walker.

### Recipe E — FORM (Gravity Forms)
Build the form via **`GFAPI`** in PHP (`wp gf` CLI add-on may be absent). Custom submit button via a
`gform_submit_button_<id>` filter if the design needs an inline arrow. Embed `[gravityform id=N …]` inside
the shared CTA template so it flows site-wide. Scope GF-theme-neutralising CSS to `#gform_wrapper_<id>`.

### Recipe F — scripting an Elementor document (advanced / optional)
C builds in the Elementor UI; only script a document when bulk-generation is genuinely unavoidable. If you do:
```php
// 1. build $data = array($section);           // container/widget tree via SEC/COL/INSEC/W helpers
// 2. find-or-create the target post/template by slug
// 3. update_post_meta(_elementor_data, wp_slash(wp_json_encode($data)))  // write meta DIRECTLY
//    update_post_meta(_elementor_edit_mode,'builder'); set template type/version
// 4. clear stale autosave + revisions; touch post_modified               // Gotcha #2
// 5. \Elementor\Plugin::$instance->files_manager->clear_cache();
// 6. echo a verification line (counts of the widgets you expect)
// Deploy: php -l  →  wp eval-file  →  cache flush
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
4. **Carousel not sliding** — prefer the Elementor **Loop Carousel**; if using custom slider JS, register the
   card's slide selector **and** set its per-view width. Re-test the OTHER carousels (one change can break them).
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
14. **Loop Grid card is edited in the Loop Template** — edit the card once there; per-card content is the CPT
    entry (via Dynamic Tags), not per-instance. Don't rebuild the card inline per page.
15. **Cloudflare 1010** — always send a browser UA (incl. headless).
16. **Large CSS transfer** silently truncates single-arg base64 → gzip it.
17. **ACF Pro** — a Site Settings **Options page** holds site-wide content (stats, contacts, socials, cert
    logos, disclaimer); surface every value via Dynamic Tags.

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

### Local DevKinsta variant (no SSH / Cloudflare)

When the build host is local DevKinsta the WP root is on the same box — skip SSH, Cloudflare and the
base64-over-wire dance:

```bash
WP=<local wp root>                          # e.g. /www/kinsta/public/<site>
php -l _build_x.php                         # never deploy a parse error
wp --allow-root eval-file _build_x.php      # --allow-root: container/root shells
wp --allow-root cache flush                 # local cache — no `kinsta cache purge`
wp --allow-root eval '\Elementor\Plugin::$instance->files_manager->clear_cache();'
# QA screenshots: hit https://<site>.local (self-signed TLS) directly
```

Read the site URL from `wp --allow-root option get home`; add `2>/dev/null` to mute noisy plugin warnings.

---

## 11. Appendix — Phase 0 client sign-off template

> **Project:** ____   **Design ref:** ____   **Date:** ____
> Below is every block on the site and how it will be built and edited. Building starts once this is approved.
>
> *(attach the completed Content Editability Map from §3b)*
>
> I confirm: the classification of each block (static / reusable template / CPT-loop / editable-chrome+dynamic
> / form / menu), that repeating content is managed via its CPT (not hand-placed) and surfaced through Loop
> Templates via Dynamic Tags, and the listed CPTs/fields, reused templates, form fields + recipients, and
> brand/compliance rules.
>
> **Signed:** ____________________

---

## 12. Reconciliation — Test Run 2026-07-02 (draft for owner PR)

> Output of a **readiness-pass** test run of this doctrine against the rebranded `fbf-starter` theme
> (scope: the starter only). Full findings in `HICCUP-LOG.md` (15 entries); phase verdict in
> `PHASE-READINESS.md`. This section is the fold-in for owner review. The **decided** items (§12.2) are
> **already applied inline** on this branch (see the body above); on approval the generated docs
> (`.claude/skills/design-to-elementor-wp/SKILL.md`, `CLAUDE.md`) are **regenerated** to match —
> never hand-edited on their own.

### 12.1 The gating decision — build methodology (hiccup #9) ✅ RESOLVED: C

The repo carried **two opposed methodologies**; the owner picked **C** on 2026-07-02.

| Question | A — "shortcode feed" (prior; tag `doctrine-A`) | **C — Loop Grid (adopted)** |
|---|---|---|
| Repeating content | CPT + shortcode feed — never Loop Grid | **CPT + Loop Grid + Loop Template** |
| Navigation | WP menu + custom walker | **Elementor Nav Menu widget** |
| ACF tier | Free — no Options pages | **Pro + Site Settings Options page** |
| Build mechanism | Idempotent `_build_*.php` writing `_elementor_data` | **Build in the Elementor UI / Theme Builder** |
| Deploy | Remote Kinsta + SSH + Cloudflare + cache purge | Same remote loop + the local variant (§12.4) |

- [ ] **A** — shortcode feed / never Loop Grid (preserved at tag `doctrine-A`)
- [x] **C** — Loop Grid + Loop Template ← **chosen 2026-07-02**
- [ ] Hybrid

The doctrine body above has been **converted to C** (G1/G4/G8/G9, the §3 decision tree, and Recipes B–D/F;
stack → ACF Pro; gotchas 4/14/17). Per project, the developer still confirms C fits before building — ask,
don't assume (per the skill's "Ask, don't guess"); if a client needs the locked-object guarantee, revisit
against the `doctrine-A` tag. The generated docs (SKILL.md, CLAUDE.md) are **regenerated to C** in this change.

### 12.2 Decided — ✅ applied inline in the body

| # | Finding | Proposed doctrine change |
|---|---|---|
| 1–2 | Forked / homeless source of truth | State up front: **this file is the single source of truth and lives at `fbf-starter/BUILD-PROCESS.md`**; the earlier generic lifecycle doc is superseded (backed up). |
| 3 | No generator; docs drift | Add a **Doc-sync rule**: `SKILL.md` + `CLAUDE.md` are generated from this file and never hand-edited; add a regenerate step to §1 + handoff. |
| 11 | Remote-only toolchain assumed | Add the **Local DevKinsta deploy variant** (§12.4) beside the remote loop; mark SSH/Cloudflare/base64-pipe as remote-only. |
| 13 | Phase 1 is prose, not code | State explicitly: the starter **ships recipes, not runnable setup code** — so it isn't mistaken for missing scaffolding. |
| 14 | init not run / tokens unstamped | Add **Step zero**: `cp .env.example .env` → fill → `npm run init` → verify **no `{{TOKEN}}` remains** before building. |
| 15 | Secrets location undefined | Project creds (SSH, site id) live in **`.env.local` (gitignored) or a secret manager** — never in `.env` (git-tracked) or committed. Add `.env.local` to `.gitignore`. |
| 8 | Design input | Phase 0 cannot start without a **design reference in `static-website-reference/`** — state it as the required input. |

### 12.3 ✅ Resolved by the C decision (regenerated into the skill + CLAUDE)

| # | Finding | Resolution |
|---|---|---|
| 4 | CLAUDE.md "Loop Grid for every CPT archive" | ✅ **Kept** — matches C; CLAUDE.md regenerated to C. |
| 5 | G4 nav conflict (walker vs Menu widget) | ✅ **Elementor Nav Menu widget** everywhere — G4, skill rule 4, build-order agree. |
| 10 | ACF tier (free vs Pro + Options) | ✅ **ACF Pro + Options page** (env has Pro) — set in §1 + gotcha 17. |
| 12 | Dead skill references | ✅ Skill repointed to `developer-build-order.md` (the C build sequence); dead pointers dropped. |

### 12.4 ✅ Applied in §10 — Local DevKinsta deploy variant (kept here for the diff)

> Use when the build host is **local DevKinsta**, not remote Kinsta — no SSH, Cloudflare, or
> base64-over-wire; the WP root is on the same box.
>
> ```bash
> WP=<local wp root>                          # e.g. /www/kinsta/public/<site>
> php -l _build_x.php                         # never deploy a parse error
> wp --allow-root eval-file _build_x.php      # --allow-root: container/root shells
> wp --allow-root cache flush                 # local cache — no `kinsta cache purge`
> # clear Elementor CSS cache via: wp --allow-root eval '\Elementor\Plugin::$instance->files_manager->clear_cache();'
> # QA screenshots: hit https://<site>.local (self-signed TLS) directly
> ```
>
> Read the site URL from `wp --allow-root option get home`; suppress noisy plugin warnings when
> scripting with `2>/dev/null`.

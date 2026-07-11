# CLAUDE.md

Guidance for Claude Code when working in this theme. These rules override default
behaviour — follow them exactly.

> **Generated from `BUILD-PROCESS.md`** — the single source of truth (methodology **C — Loop Grid + Loop
> Template**, v2). Don't hand-edit this file on its own; change the doctrine and regenerate, or the two drift.

## Project

The **{{CLIENT_NAME}}** website, built by **{{AGENCY_NAME}}**. This is `fbf-starter`,
a **Hello Elementor child theme**. The parent (`hello-elementor`) handles core
Elementor / Elementor Pro integration; all site-specific code lives in this child theme.

**Goal:** a pixel-accurate build of the project's design reference in Elementor Pro,
verified by QA and signed off by PM before client handoff. The bar is pixel-perfect —
typography, spacing, colour, hover/focus states, responsive breakpoints, and copy must
match the design source.

## Golden Rules — always follow (non-negotiable)

**`BUILD-PROCESS.md` §2 is canonical; these rules are mandatory defaults on every build.**
Follow them by default and don't deviate without an explicit, recorded decision — if a task
seems to require breaking one, stop and ask (see *Ask, don't guess*). Read §2 in full before
building; the cheat-sheet below is a reminder, not a replacement.

- **G1** — Repeating content = **CPT + ACF**, rendered by a **Loop Grid + Loop Template** (never hard-coded).
- **G2** — **No HTML clones**; no structural HTML (`<div>/<ul>/<svg>/<address>`) inside `text-editor` widgets.
- **G3** — Reusable panels = Elementor **section templates** (build once, embed via the Template widget).
- **G4** — Navigation = Elementor Pro **Nav Menu widget** on a WP menu; no custom walker.
- **G5** — Static marketing content = **native Elementor widgets** (Heading/Text/Button/Icon), editable in canvas.
- **G6** — Forms = **Gravity Forms**, one per purpose, embedded by shortcode in a shared template.
- **G7** — Icon fidelity via **inline SVG / CSS mask**, never icon webfonts.
- **G8** — Editable chrome + dynamic items = native chrome widget (Nested-Tabs/Accordion) **+ a Loop Grid inside**.
- **G9** — **Build in the Elementor UI / Theme Builder; register data (CPT/ACF/Options) in code.**
- **G10** — **Pixel-perfect is verified, not asserted** — diff computed styles + screenshots before "done".
- **G11** — **Respect the brief's brand/compliance rules** (legal name, banned phrases, disclaimers, etc.).

## Setup & build

- The starter baseline ships **doctrine + tooling + `templates/`** only — the runnable theme
  (`style.css`, `functions.php`, `inc/`, `lib/`, `scss/`) does **not** exist until init.
- One-time per project: copy `.env.example` → `.env`, fill it in, `npm install`, then run the
  **`/init-project`** skill — it renders `templates/` → the theme root (stamping identity + these
  docs from `.env`), resets `context.md`, and builds CSS. `npm run init` (`scripts/init.mjs`) is
  now just its **pre-flight validator** — it checks `.env` + `templates/` and writes nothing.
- After init the rendered theme files exist in the root; **commit them to the project repo**.
- CSS: authored in `scss/`, compiled to `assets/css/main.css` via `npm run build:css`
  (watch mode: `npm run watch:css`). **Rebuild and commit `main.css` after SCSS changes.**

## Where code lives

- `templates/` — the **canonical source of truth** for every generated theme file. Edit here
  to evolve the starter; `/init-project` renders these into the theme root per project. Never
  hand-build the theme files directly in the root — change the template and re-render.
- `functions.php` (from `templates/functions.php`) — enqueues (parent style, optional Google
  Fonts, compiled `main.css` with `filemtime` busting), the shortcodes include, an Elementor
  customizer fatal-fix, and a scroll-shadow helper (toggles `body.body-scrolled` past 8px).
  **No inline CSS.**
- `inc/shortcodes.php` — small guarded registry: `[current_year]`, `[site_email]`,
  `[site_option name="…"]`. Prefer Elementor Dynamic Tags; use these only where a tag
  can't reach raw markup.
- `scss/` — `abstracts/` (`_tokens` = design tokens as CSS custom properties, `_mixins`),
  `base/`, `elementor/` (override layer), `components/` (header, nav, footer, buttons;
  `review-popup` is optional). Component partials ship as stubs — fill them in per project.
- `scripts/init.mjs` — **pre-flight validator** for `/init-project`: checks `.env` + `templates/`
  and prints the resolved identity. It writes no files (the skill does the rendering + stamping).
- Do **not** edit the parent theme (`hello-elementor`); override from here.
- `static-website-reference/` — the approved static site (HTML/CSS/JS) that is the **design
  source of truth**. Read px, colours, weights, and copy from it; it is **read-only** —
  never create, edit, move, or delete files here. Its files are **uploaded manually** by the
  team, not generated or modified by Claude.

## Team flow — Developer → QA → PM

Three roles drive the build, each with an entry-point skill in `.claude/skills/`.
When working in a role, invoke its skill — it defines the role and routes to the right
reference docs in that skill's `references/` folder (fill those per project).

- **`developer`** — builds each section, maps the design reference to Elementor Pro widgets.
- **`qa`** — verifies the developer's output against the design, pixel by pixel.
- **`pm`** — final sign-off: coherence, copy correctness, forms, handoff readiness.

**Gate order: Developer → QA → PM.** No page advances a gate until the current one passes.

## Plans

When creating or starting a plan, also render it as a **shareable artifact** — a `plan.html`
published via the Artifact tool — so anyone with the link can view it (design/QA/PM/client).
Keep the artifact in sync as the plan changes (redeploy to the same link), and use it for
plan review, sign-off, and handoff.

**Note:** artifacts are **private by default**. Publishing returns a link, but the person
running Claude must explicitly **Share** it before others can open it — Claude cannot change
that sharing setting. Publish the artifact, hand over the link, and tell the user to Share it;
don't assume the link is publicly viewable the moment it's generated.

## Revision history — `context.md`

Keep a running work log at `context.md` in the theme root. **Create it if it doesn't exist**,
and add an entry per task/session (newest first) recording: the date, a one-line task summary,
the files changed, any decisions or gotchas, and the **estimated token usage** for that task.
Never delete past entries. Also **report the estimated token usage to the user for each task**
as you finish it (state it's an estimate).

## Ask, don't guess

When a requirement, design value, copy string, or asset is missing or ambiguous, **ask —
do not guess or invent it.** Never fabricate colours, sizes, copy, links, contact details,
legal text, or client facts to fill a gap. If the design reference doesn't specify
something, request the source or the decision rather than approximating. Flag assumptions
explicitly, and use placeholders (clearly marked) only when told to proceed without the
final value.

## Key conventions

- Design tokens are single-sourced in `scss/abstracts/_tokens.scss`; consume them as CSS
  custom properties (`--brand-primary`, `--text-lg`, `--radius-pill`, `--shadow-primary`…).
  Never hard-code colours/sizes that a token exists for.
- `scss/components/_nav.scss` is developer-owned by convention — don't edit its rules
  without the owning developer.
- **Elementor Pro is the sole page builder.** Gutenberg is disabled by the parent — don't
  re-enable it. Header/footer/popups are Elementor **Theme Builder** templates; Elementor
  kit/template settings override PHP, so check Elementor before assuming a PHP change shows.
- **ACF Pro** is the only tool for custom fields. Register CPTs + an ACF field group per
  CPT as the project needs (e.g. testimonial / team / location / industry), and an ACF
  Options page for site-wide content. Pull values via Elementor **Dynamic Tags** — never
  hard-code field values — and use a **Loop Grid** for every CPT archive/grid.
- Images come from the **WordPress Media Library** (WebP recommended — confirm per project),
  never referenced from local paths. Icons as inline SVG (e.g. Lucide — confirm per project).
- If `static-website-reference/` holds the design's images, **upload every image the build
  needs into the WordPress Media Library, converting to WebP where applicable**, and reference
  those Media Library copies in Elementor — never the `static-website-reference/` files
  directly (that folder is read-only, see above).

## Secrets & data

- Never commit secrets. **`.env` is tracked in git** (not ignored), so it must hold only
  non-secret config (theme identity, brand tokens, public fonts URL). Keep credentials, API
  keys, and SSH details out of `.env` and any committed file — put them in **`.env.local` (gitignored)**,
  environment variables, or a secret store. Treat client content as confidential.

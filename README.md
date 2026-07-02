# FBF Starter

A reusable, de-branded **Hello Elementor child theme** starter. It carries the
reusable architecture — SCSS layering + build, a compiled-CSS enqueue with
`filemtime` cache-busting, an optional Google Fonts enqueue, an Elementor
customizer fatal-fix, a scroll-shadow helper, a guarded shortcode registry, and
the Developer → QA → PM role skills — with **no client branding**. Tokens are
placeholders and components are empty stubs you fill in per project.

## Per-project setup

```bash
cp .env.example .env      # then fill in .env (see below)
npm install
npm run init              # stamps identity from .env into the theme + skills
npm run build:css         # compiles scss/ → assets/css/main.css
```

Activate the theme in WordPress with **Hello Elementor** installed as the parent.

### `.env`

| Key | Stamps into | Notes |
|---|---|---|
| `CLIENT_NAME` | `style.css` Theme Name + the role skills | The site name the skills refer to |
| `THEME_AUTHOR` | `style.css` Author | |
| `PARENT_THEME` | `style.css` Template + parent enqueue | Default `hello-elementor` |
| `THEME_HANDLE_PREFIX` | `wp_enqueue_*` handles | Slugified (e.g. `acme-main`) |
| `BRAND_PRIMARY` / `BRAND_ACCENT` | `_tokens.scss` | Blank → keep `#000 /* TODO */` |
| `FONT_SANS` / `FONT_SERIF` | `_tokens.scss` font stacks | Blank → system stacks |
| `GOOGLE_FONTS_URL` | `functions.php` fonts enqueue | Blank → no fonts enqueued |

`npm run init` is idempotent for identity fields. `{{CLIENT_NAME}}` in the role
skills is a one-shot token — once stamped it's gone, so changing `CLIENT_NAME`
later won't retro-update the skills.

## Structure

```
CLAUDE.md               project rules + goals (read by Claude Code on load)
BUILD-PROCESS.md        end-to-end lifecycle: setup → build → QA → PM → handoff
functions.php          framework scaffold (enqueues, customizer fix, scroll-shadow)
inc/shortcodes.php      [current_year] [site_email] [site_option]
scss/                   design tokens + base + component stubs → assets/css/main.css
scripts/init.mjs        reads .env, stamps identity
.claude/skills/         developer · qa · pm role skills + references (Developer → QA → PM gate)
static-website-reference/  empty — drop the project's static design source here
dev-tools/              empty — drop project one-off dev scripts here
```

- **Tokens** are the single source in `scss/abstracts/_tokens.scss`; don't add
  inline CSS to `functions.php`.
- **Components** (`_header`, `_nav`, `_footer`) ship as stubs; `_nav.scss` is
  developer-owned by convention. `_review-popup.scss` is optional and not
  compiled until you `@use` it in `main.scss`.
- **Skills**: drop each project's reference docs into
  `.claude/skills/{developer,qa,pm}/references/` (ships empty).

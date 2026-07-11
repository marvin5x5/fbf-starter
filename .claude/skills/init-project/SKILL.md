---
name: init-project
description: Scaffold a fresh project from the fbf-starter baseline — render templates/ into the theme root, stamp identity from .env, reset the work log, and build CSS. Use ONCE per new project (or when re-initialising), when the user says "init the project", "set up the theme", "scaffold the starter", or after cloning fbf-starter and filling in .env. This is the Developer → QA → PM gate's Phase 1 "step zero".
---

# init-project — grow the theme from templates/

`fbf-starter` ships **doctrine + tooling + `templates/`** only. The runnable theme
(`style.css`, `functions.php`, `inc/`, `lib/`, `scss/`) does **not** exist in the baseline —
you create it here by rendering `templates/` into the theme root, substituting values from
`.env`. Run this once per project. It is Phase 1 / "step zero" of the build gate
(see `BUILD-PROCESS.md` §4).

**Ask, don't guess.** If `.env` is missing values or the pre-flight fails, stop and ask —
never invent a client name, brand colour, font, or fonts URL to fill a gap.

## Inputs

- `.env` in the repo root (copied from `.env.example` and filled in). Keys: `CLIENT_NAME`,
  `THEME_AUTHOR`, `PARENT_THEME`, `THEME_HANDLE_PREFIX`, `BRAND_PRIMARY`, `BRAND_ACCENT`,
  `FONT_SANS`, `FONT_SERIF`, `GOOGLE_FONTS_URL`.
- `templates/` — the canonical file skeletons (source of truth). Do not edit templates as
  part of an init; edit them only to evolve the starter itself.

## Steps

1. **Pre-flight (deterministic).** Run `npm run init` (→ `scripts/init.mjs`). It validates
   `.env` + `templates/` and prints the resolved identity. **If it exits non-zero, stop** and
   report the problems — do not render a partial theme.

2. **Render `templates/` → theme root**, preserving the sub-tree layout:
   - `templates/style.css` → `style.css`
   - `templates/functions.php` → `functions.php`
   - `templates/inc/**` → `inc/**`
   - `templates/lib/**` → `lib/**`
   - `templates/scss/**` → `scss/**`

   Copy each file verbatim, then apply substitutions:

   | File | Replace | With (from `.env`) |
   |---|---|---|
   | `style.css` | `{{CLIENT_NAME}}` | `CLIENT_NAME` |
   | `style.css` | `{{THEME_AUTHOR}}` | `THEME_AUTHOR` |
   | `style.css` | `{{PARENT_THEME}}` | `PARENT_THEME` |
   | `functions.php` | `{{THEME_HANDLE_PREFIX}}` | slugified `THEME_HANDLE_PREFIX` (lowercase, non-alnum → `-`) |
   | `functions.php` | `{{GOOGLE_FONTS_URL}}` | `GOOGLE_FONTS_URL` (empty string if blank) |

   **`scss/abstracts/_tokens.scss` — conditional (only when the `.env` value is non-empty):**
   - `--brand-primary: #……;` (line tagged `/* TODO: BRAND_PRIMARY */`) → `BRAND_PRIMARY`
   - `--brand-accent: #……;` (line tagged `/* TODO: BRAND_ACCENT */`) → `BRAND_ACCENT`
   - `--font-sans: …;  /* FONT_SANS */` → `"<FONT_SANS>", system-ui, -apple-system, sans-serif`
   - `--font-serif: …;  /* FONT_SERIF */` → `"<FONT_SERIF>", Georgia, serif`
   - If a value is blank, **leave the placeholder** (`#000 /* TODO */` / system stack) untouched.

   All other `templates/scss/**`, `inc/**`, `lib/**` files are copied **verbatim** (no tokens).

3. **Stamp the kept docs** — replace across `CLAUDE.md` and every `.md` under
   `.claude/skills/`:
   - `{{CLIENT_NAME}}` → `CLIENT_NAME`
   - `{{AGENCY_NAME}}` → `THEME_AUTHOR`

   (One-shot: once stamped the token is gone. If `CLIENT_NAME` changes later, re-clone or edit
   by hand.) Do **not** stamp this skill file or `templates/`.

4. **Reset the work log.** Start `context.md` fresh for this project (newest-first log). The
   starter's own history stays in git; the project log begins here with an "init" entry
   (date, files created, estimated token usage).

5. **Ensure content dirs exist:** `static-website-reference/` (the team uploads the approved
   design here — required before Phase 0; **read-only**), `screenshot-reference/` (Developer/QA
   store per-page baseline screenshots of the static reference here — **writable**), and
   `dev-tools/`. Keep their `.gitkeep`.

6. **Build CSS.** Run `npm run build:css` → `assets/css/main.css`. Report any Sass errors.

7. **Report** what was created + estimated token usage, and the next step: upload the design
   reference into `static-website-reference/`, then start the **Developer** gate.

## Guardrails

- Verify **no `{{TOKEN}}` remains** in the rendered theme or the kept docs before declaring
  done (`grep -rn "{{" style.css functions.php scss inc lib CLAUDE.md .claude/skills`).
- Never edit the parent theme; never re-enable Gutenberg; keep secrets out of `.env`
  (git-tracked) — those live in `.env.local` / a secret manager.
- Elementor Pro is the sole page builder; the theme files are the framework scaffold only.

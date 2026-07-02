# HICCUP-LOG.md — fbf-starter doctrine test run

> Running list of every snag hit while running **BUILD-PROCESS.md** against the **rebranded
> fbf-starter** theme (scope: this theme only — other client builds are paused). One row per
> snag, however small. **This list is the gold** — Marvin folds the "fold-in" rows back into
> BUILD-PROCESS.md via branch + PR (owner-approved = sign-off).
>
> Run: 2 Jul 2026 · Scope: `wisemanaccountants/.../themes/fbf-starter` · Doctrine: BUILD-PROCESS.md
> (The earlier 19-entry cross-project log is archived in scratchpad; rows below are the
> starter-scoped, project-independent findings that survive.)

| # | Area | Hiccup | Fix / workaround | Fold into doctrine? |
|---|---|---|---|---|
| 1 | Home | BUILD-PROCESS.md had no committed home in fbf-starter (the "single source of truth" wasn't there) | Copied it into `fbf-starter/BUILD-PROCESS.md` (step zero) | Yes — README/intro: name the canonical path |
| 2 | Doctrine integrity | Two different files both named BUILD-PROCESS.md — the long ff "Design→WP Playbook" vs a short generic one that was in fbf-starter. The single source of truth was forked | Unified by placing ff's playbook in fbf-starter; previous generic version backed up to scratchpad | Yes — critical: confirm which CONTENT is canonical; retire the other |
| 3 | Doctrine integrity | No generator exists — SKILL.md and CLAUDE.md are hand-authored and drift from the doctrine (that's how #4/#5 happened) | Noted as process debt | Yes — §1: define the generate/sync step (or a checklist) |
| 4 | Doctrine integrity | CLAUDE.md contradicts the doctrine's #1 rule — it says "use a Loop Grid for every CPT archive/grid," the opposite of G1 (never Loop Grid for a locked panel) | Follow doctrine G1; flag for regeneration | Yes — regenerate CLAUDE.md from doctrine; flagship drift example |
| 5 | Doctrine integrity | G4 nav conflict — BUILD-PROCESS.md says nav = WP menu + custom walker/shortcode; SKILL.md says Elementor Menu widget, "do not hand-roll a walker" | Left as-is; resolution goes in the PR | Yes — reconcile G4 across doctrine + skill; pick one |
| 6 | Rebrand | `npm run init` left token residue (a prior run branded docs "ACME TESTCO"); CLAUDE.md still carries `{{CLIENT_NAME}}`/`{{AGENCY_NAME}}` unstamped | Noted; rebrand/stamp is a prerequisite step | Yes — README: make the stamp step + a verify check explicit |
| 7 | Setup | fbf-starter is not a git repo → the branch/PR sign-off ritual (step 3) can't run yet | ✅ Resolved — `git init` + baseline commit 1d3f3c5, pushed to `marvin5x5/fbf-starter` (master) | Yes — §handoff: "init the repo before the sign-off flow" |
| 8 | Input | `static-website-reference/` is empty — the run has no design to build against, and client designs are paused | **Needs decision:** readiness-pass only, or drop a design in | Yes — Phase 0: state the design ref is the required input to start |
| 9 | Doctrine integrity | **THE BIG ONE — two opposed methodologies coexist:** BUILD-PROCESS.md + `design-to-elementor-wp` skill say repeating content = CPT + shortcode feed, *never* a Loop Grid (G1); `developer-build-order.md` (Phase 5/7/§12) + CLAUDE.md say "Loop Grid for *every* CPT archive/grid." Head-on collision on how ALL repeating content is built | Cannot follow both; flagged | **Yes — top priority:** pick ONE build methodology; make every doc agree |
| 10 | Doctrine integrity | **ACF tier contradiction:** BUILD-PROCESS.md + skill lock ACF *free* ("no Options pages, plan around it"); `developer-build-order.md` Phase 2 + CLAUDE.md require ACF *Pro* + a "Site Settings" Options page | Flagged | Yes — set ACF tier once (env has Pro); align all docs |
| 11 | Doctrine integrity | **Imported toolchain the starter lacks:** copying the CG Law playbook in made BUILD-PROCESS.md assume remote Kinsta + SSH (`_ssh.exp`), Cloudflare, `cg-slider.js`, idempotent `_build_*.php` builders, and a CDP computed-style harness — none of which exist here (`dev-tools/` empty) and the role-skill method doesn't use | Flagged | Yes — split reusable doctrine from CG-specific tooling; add local-vs-remote deploy note |
| 12 | Doctrine integrity | **Dead reference links:** `design-to-elementor-wp/SKILL.md` points to `references/stack-and-recipes.md` and `references/qa-and-gotchas.md`; that `references/` folder holds only `.gitkeep` | Flagged | Yes — create those files or drop the pointers |
| 13 | Foundation | **Phase 1 not scaffolded in code:** doctrine requires CPT registration, ACF Options, `/%postname%/` permalinks, SVG-upload enable, Global Kit — none are in `functions.php` (enqueues + customizer-fix + scroll-shadow only); no `inc/setup.php`. Snippets live in the reference doc as prose, not runnable code | Noted | Yes — decide if the starter ships setup code or recipes only |
| 14 | Rebrand | **init not run here:** no `.env` (only `.env.example`); `{{CLIENT_NAME}}`/`{{PLACEHOLDER}}` still unstamped in CLAUDE.md + `developer-build-order.md`; `style.css` is the placeholder. Docs don't read correctly until `npm run init` runs | Noted | Yes — README: init is a hard prerequisite; add a post-init verify |
| 15 | Secrets policy | **Tension:** `.env.example` says ".env is tracked in git — keep secrets OUT"; BUILD-PROCESS.md §1/§4/§10 say to record SSH creds + site id in a "project context file." No designated secret-safe location in the starter | Flagged | Yes — name where project creds live (not `.env`, not committed) |

<!-- Add a new row the moment anything snags during the run. -->

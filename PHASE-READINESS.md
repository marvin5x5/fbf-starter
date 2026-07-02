# Phase Readiness — fbf-starter vs BUILD-PROCESS.md

> Readiness pass (option a): walked BUILD-PROCESS.md against what the rebranded fbf-starter
> actually ships. No client page built. Verdict per phase below; every gap is in `HICCUP-LOG.md`.
>
> Scope: `wisemanaccountants/.../themes/fbf-starter` only · 2 Jul 2026

## Verdict at a glance

**The scaffold is sound. The doctrine layer is internally contradictory.** The starter's
plumbing (SCSS pipeline, enqueues, shortcode registry, role skills, init stamping) is reusable and
correct. But three documents teach **two opposed build methodologies**, and importing the CG Law
playbook as `BUILD-PROCESS.md` added a toolchain the starter doesn't have. Building today would mean
choosing which doc to obey — so the run stops here and hands the decisions to Marvin's PR.

## The one decision that unblocks everything

**Pick the canonical build methodology**, then make every doc agree:

| | Doctrine A — BUILD-PROCESS.md + `design-to-elementor-wp` skill | Doctrine C — `developer-build-order.md` + `qa`/`pm` + CLAUDE.md |
|---|---|---|
| Repeating content | CPT + shortcode feed — **never Loop Grid** | **Loop Grid** for every CPT archive |
| Navigation | WP menu + custom walker | Elementor Nav Menu widget |
| ACF tier | Free (no Options pages) | Pro + "Site Settings" Options page |
| Build mechanism | Idempotent `_build_*.php` writing `_elementor_data` | Build in the Elementor UI / Theme Builder |
| Deploy | Remote Kinsta + SSH + Cloudflare + cache purge | (unspecified) |

These are irreconcilable as written. Everything else is downstream of this choice.

## Per-phase readiness

| Phase (BUILD-PROCESS.md) | Verdict | Why |
|---|---|---|
| §0 One idea / Phase 0 gate | ✅ Sound | The classify-before-build gate is clear and reusable |
| §3 Phase 0 — Editability Map | ⚠️ Conflicted | The classification itself differs by methodology (Loop Grid vs shortcode) — hiccup #9 |
| §4 Phase 1 — Foundation | ⚠️ Partial | SCSS/enqueue/customizer-fix ready; CPT/ACF/permalinks/SVG/Global Kit are recipes, not code (#13); init not run (#14) |
| §5 Phase 2 — Ingest design | ⛔ Blocked | Empty design ref (#8); no computed-style QA harness tooling (#11) |
| §6 Phase 3 — Build order & recipes | ⛔ Conflicted | Two opposed recipe sets (#9, #10); dead skill references (#12) |
| §7 Phase 4 — QA | ⚠️ Partial | QA skill present; the CDP harness + freeze-carousel tooling the doctrine assumes don't exist (#11) |
| §8 Phase 5 — Handoff | ✅ Mostly ready | Checklist exists; localise-images/SEO/mobile steps are generic |
| §10 Deploy loop | ➖ N/A as written | Remote-Kinsta/SSH/Cloudflare specific; starter is generic/local (#11) |
| Sign-off (branch → PR) | ⛔ Blocked | fbf-starter is not a git repo (#7) |

## What IS ready (keep as-is)

- SCSS layering + `build:css` + `filemtime` cache-busting enqueue
- Guarded shortcode registry (`[current_year]`, `[site_email]`, `[site_option]`) — supports both site-wide values and the shortcode-feed method
- Elementor customizer fatal-fix + scroll-shadow helper
- Developer → QA → PM role skills + references, and the `init.mjs` stamping mechanism

## Recommended order for the PR

1. **Decide the methodology** (table above) — this is the fork; resolve it first.
2. Reconcile the three docs to the winner (Loop Grid vs shortcode; nav; ACF tier).
3. Split reusable doctrine from CG-specific tooling; add a **local-vs-remote** deploy note.
4. Fix dead skill references (#12); decide code-vs-recipes for Phase 1 setup (#13).
5. Make `npm run init` + a verify a hard prerequisite (#14); name a secret-safe creds location (#15).
6. `git init` the starter so the branch/PR sign-off can actually run (#7).

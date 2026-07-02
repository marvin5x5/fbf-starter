# HICCUP-LOG.md — fbf-starter doctrine test run

> Running list of every snag hit while running **BUILD-PROCESS.md** against the **rebranded
> fbf-starter** theme (scope: this theme only — other client builds are paused). One row per
> snag, however small. **This list is the gold** — Marvin folded the "fold-in" rows back into
> BUILD-PROCESS.md via branch + PR (owner-approved = sign-off).
>
> Run: 2 Jul 2026 · Scope: `wisemanaccountants/.../themes/fbf-starter` · Doctrine: BUILD-PROCESS.md
>
> **Resolution (2026-07-02):** owner approved the reconciliation (merged to `master`); methodology
> **C (Loop Grid + Loop Template)** adopted. BUILD-PROCESS.md converted A→C; `SKILL.md` + `CLAUDE.md`
> regenerated to C. The prior methodology-A version is preserved at git tag `doctrine-A`.

| # | Area | Hiccup | Fix / status | Fold into doctrine? |
|---|---|---|---|---|
| 1 | Home | BUILD-PROCESS.md had no committed home in fbf-starter | ✅ Copied in (step zero) | Yes — README/intro: name the canonical path |
| 2 | Doctrine integrity | Two different files both named BUILD-PROCESS.md — the source of truth was forked | ✅ Unified (ff playbook placed in fbf-starter; generic backed up) | Yes — confirm canonical CONTENT; retire the other |
| 3 | Doctrine integrity | No generator — SKILL.md + CLAUDE.md drift from the doctrine by hand | ✅ Doc-sync rule added; both docs now declare "generated from BUILD-PROCESS.md". Regeneration stays manual (do it from the doctrine) | Yes — §1: define the generate/sync step (or a checklist) |
| 4 | Doctrine integrity | CLAUDE.md said "Loop Grid for every CPT archive," opposite of the then-G1 (never Loop Grid) | ✅ Resolved (C): G1 flipped to Loop Grid; CLAUDE.md now matches the doctrine | Yes — regenerate CLAUDE.md from doctrine |
| 5 | Doctrine integrity | G4 nav conflict — doctrine said WP menu + walker; SKILL said Elementor Menu widget | ✅ Resolved (C): Elementor Nav Menu widget in G4 + skill + build-order | Yes — reconcile G4; pick one |
| 6 | Rebrand | `npm run init` left token residue ("ACME TESTCO"); one-shot `{{CLIENT_NAME}}` token caveat | ⚠️ init.mjs residue was fixed earlier (→ `{{CLIENT_NAME}}`); the one-shot-token caveat is a code concern, out of doctrine scope | Yes — README: note the one-shot token |
| 7 | Setup | fbf-starter is not a git repo → branch/PR sign-off can't run | ✅ Resolved — `git init` + baseline (1d3f3c5), pushed to `marvin5x5/fbf-starter` | Yes — §handoff: init the repo before sign-off |
| 8 | Input | `static-website-reference/` empty — no design to build against | ✅ Doctrine now states a design ref is required (§3 prerequisite); this run was readiness-pass only | Yes — Phase 0: state the design ref is required |
| 9 | Doctrine integrity | **Two opposed methodologies** — CPT+shortcode-feed vs Loop Grid, colliding on all repeating content | ✅ Resolved: methodology **C** adopted; doctrine converted + SKILL/CLAUDE regenerated (A preserved at tag `doctrine-A`) | **Top priority** — pick ONE methodology; make every doc agree |
| 10 | Doctrine integrity | ACF tier contradiction — free (no Options) vs Pro + Options page | ✅ Resolved (C): ACF Pro + Site Settings Options page (§1 + gotcha 17) | Yes — set ACF tier once (env has Pro) |
| 11 | Doctrine integrity | Imported CG toolchain the starter lacks (SSH/Cloudflare/`cg-slider.js`/PHP builders/CDP harness) | ✅ Mostly resolved (C): scripted builders now advanced/optional (Recipe F, G9 = build in UI); Local DevKinsta deploy variant added (§10). Remote SSH/Cloudflare kept as the remote-host path | Yes — split reusable doctrine from CG-specific tooling |
| 12 | Doctrine integrity | Dead skill references (`stack-and-recipes.md`, `qa-and-gotchas.md` — only `.gitkeep`) | ✅ Resolved: skill repointed to `BUILD-PROCESS.md` + `developer-build-order.md`; dead pointers dropped | Yes — create the files or drop the pointers |
| 13 | Foundation | Phase 1 setup (CPT/ACF/permalinks/Global Kit) is prose, not runnable code | ✅ Decided (§4): the starter ships **recipes, not runnable setup code** | Yes — decide code vs recipes |
| 14 | Rebrand | init not run here (no `.env`); `{{TOKEN}}`s unstamped | ✅ Step zero added (§4: `init` + verify no `{{TOKEN}}`); running it stays per-project | Yes — README: init is a hard prerequisite + a verify |
| 15 | Secrets policy | `.env` is git-tracked vs doctrine's "record SSH creds in a project file" | ✅ Resolved: creds → `.env.local` (gitignored) / secret manager (doctrine §4 + CLAUDE + `.gitignore`) | Yes — name where creds live |

<!-- Add a new row the moment anything snags during the run. -->

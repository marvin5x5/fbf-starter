# Context — revision history

Running work log for this theme. **Newest entries first.** One entry per task/session.
Claude Code maintains this file (see `CLAUDE.md` → *Revision history*); do not delete past
entries.

Entry format:

```
## YYYY-MM-DD — <one-line task summary>
- **Changed:** <files touched>
- **Notes:** <decisions / gotchas>
- **Est. tokens:** ~<N>
```

<!-- Add entries below this line, newest first. -->

## 2026-07-11 — Convert starter to template-driven init (branch `template-driven-init`)
- **Changed:** moved `style.css`, `functions.php`, `inc/`, `lib/`, `scss/` → `templates/` (new source of truth); templatised `templates/{style.css,functions.php}` with `{{TOKEN}}` placeholders + updated `_tokens.scss` header; removed `assets/css/main.css` (build artifact, regen at init); rewrote `scripts/init.mjs` (stamper → pre-flight validator, writes nothing); new skill `.claude/skills/init-project/SKILL.md` (renders templates → root, stamps docs, resets log, builds CSS); updated `README.md`, `BUILD-PROCESS.md` §4, `CLAUDE.md` (Setup & build + Where code lives); `plan.html` artifact.
- **Notes:** Owner decisions — (a) Claude-driven `/init-project` skill is the generator, `init.mjs` reduced to pre-flight; (b) baseline keeps docs + tooling + `templates/` only, theme files generated at init; (c) `templates/` is the versioned source of truth. **Not gitignored** — "remove from repo" = starter baseline only; projects commit their rendered theme. `context.md` kept in baseline (starter's own log); init skill resets it per project. Brand/font tokens stay conditional (blank `.env` → keep `#000 /* TODO */` / system stack). Verified: pre-flight passes/fails correctly; `templates/scss` compiles (1711 B); tokens present. WordPress won't see the theme until init renders `style.css` — intended.
- **Est. tokens:** ~85k

## 2026-07-02 — Add BUILD-PROCESS.md + fix {{CLIENT_NAME}} token in skill docs
- **Changed:** new `BUILD-PROCESS.md` (root); `README.md` (doc pointer); `.claude/skills/{developer,qa,pm}/SKILL.md` + all reference docs (11 files, 23 occurrences).
- **Notes:** (1) `README.md`/`scripts/init.mjs` promise `npm run init` stamps a `{{CLIENT_NAME}}` token into the skills, but the docs hard-coded the literal `ACME TESTCO` (residue of a test `init` run) — so init silently left every doc branded "ACME TESTCO". Replaced all `ACME TESTCO` → `{{CLIENT_NAME}}`; init now works as documented. Root `CLAUDE.md` already used the tokens correctly. (2) Added `BUILD-PROCESS.md` as the lifecycle/workflow doc (Setup → Build → QA → PM → Handoff + the role gate + handoff gates); it points into `developer-build-order.md` for the detailed Elementor phases rather than duplicating them. Written generically (no client tokens) since init only stamps CLAUDE.md + skills, not root docs. Git/commit section omitted per request (secrets note preserved in the handoff checklist + `CLAUDE.md`). No SCSS/CSS change — no rebuild needed.
- **Est. tokens:** ~55k

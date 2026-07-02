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

## 2026-07-02 — Add BUILD-PROCESS.md + fix {{CLIENT_NAME}} token in skill docs
- **Changed:** new `BUILD-PROCESS.md` (root); `README.md` (doc pointer); `.claude/skills/{developer,qa,pm}/SKILL.md` + all reference docs (11 files, 23 occurrences).
- **Notes:** (1) `README.md`/`scripts/init.mjs` promise `npm run init` stamps a `{{CLIENT_NAME}}` token into the skills, but the docs hard-coded the literal `ACME TESTCO` (residue of a test `init` run) — so init silently left every doc branded "ACME TESTCO". Replaced all `ACME TESTCO` → `{{CLIENT_NAME}}`; init now works as documented. Root `CLAUDE.md` already used the tokens correctly. (2) Added `BUILD-PROCESS.md` as the lifecycle/workflow doc (Setup → Build → QA → PM → Handoff + the role gate + handoff gates); it points into `developer-build-order.md` for the detailed Elementor phases rather than duplicating them. Written generically (no client tokens) since init only stamps CLAUDE.md + skills, not root docs. Git/commit section omitted per request (secrets note preserved in the handoff checklist + `CLAUDE.md`). No SCSS/CSS change — no rebuild needed.
- **Est. tokens:** ~55k

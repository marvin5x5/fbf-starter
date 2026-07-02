#!/usr/bin/env node
/**
 * init.mjs — stamp project identity from .env into the starter theme.
 *
 * Reads ./.env and writes:
 *   • style.css                 → Theme Name / Author / Template
 *   • functions.php             → handle prefix + Google Fonts URL
 *   • scss/abstracts/_tokens.scss → --brand-* + fonts (only if seeds provided)
 *   • .claude/skills/{developer,qa,pm}/SKILL.md → {{CLIENT_NAME}} placeholder
 *
 * Idempotent for identity fields. Note: {{CLIENT_NAME}} in the skills is a
 * one-shot token — once replaced it is gone, so changing CLIENT_NAME later and
 * re-running will not retro-update the skills (re-clone or edit by hand).
 *
 *   node scripts/init.mjs   (or: npm run init)
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = join(root, '.env');

if (!existsSync(envPath)) {
  console.error('✗ No .env found. Copy .env.example to .env and fill it in first.');
  process.exit(1);
}

// ── Parse .env (tiny KEY=VALUE reader; strips quotes and # comments) ──────────
function parseEnv(text) {
  const out = {};
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

const env = parseEnv(readFileSync(envPath, 'utf8'));
const {
  CLIENT_NAME = 'Client Name',
  THEME_AUTHOR = 'Five by Five',
  PARENT_THEME = 'hello-elementor',
  THEME_HANDLE_PREFIX = 'theme',
  BRAND_PRIMARY = '',
  BRAND_ACCENT = '',
  FONT_SANS = '',
  FONT_SERIF = '',
  GOOGLE_FONTS_URL = '',
} = env;

// slug for enqueue-handle prefix — lowercase alnum + dashes
const handlePrefix =
  (THEME_HANDLE_PREFIX || 'theme').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'theme';

const changed = [];
function edit(relPath, fn, { optional = false } = {}) {
  const p = join(root, relPath);
  if (!existsSync(p)) {
    if (!optional) console.warn(`  (skipped ${relPath} — not found)`);
    return;
  }
  const before = readFileSync(p, 'utf8');
  const after = fn(before);
  if (after !== before) {
    writeFileSync(p, after);
    changed.push(relPath);
  }
}

// ── style.css header ──────────────────────────────────────────────────────────
edit('style.css', (s) => s
  .replace(/(Theme Name:\s*).*/, (_, k) => k + CLIENT_NAME)
  .replace(/(Author:\s*).*/, (_, k) => k + THEME_AUTHOR)
  .replace(/(Template:\s*).*/, (_, k) => k + PARENT_THEME)
);

// ── functions.php: handle prefix + fonts URL ────────────────────────────────────
edit('functions.php', (s) => s
  .replace(/(define\(\s*'THEME_HANDLE_PREFIX',\s*')[^']*('\s*\))/,
    (_, a, b) => a + handlePrefix + b)
  .replace(/(define\(\s*'THEME_GOOGLE_FONTS_URL',\s*')[^']*('\s*\))/,
    (_, a, b) => a + GOOGLE_FONTS_URL + b)
);

// ── _tokens.scss: seed brand colours + fonts when provided ──────────────────────
edit('scss/abstracts/_tokens.scss', (s) => {
  let out = s;
  if (BRAND_PRIMARY) {
    out = out.replace(/(--brand-primary:\s*)#[0-9A-Fa-f]{3,8};(.*)/,
      (_, a, b) => a + BRAND_PRIMARY + ';' + b);
  }
  if (BRAND_ACCENT) {
    out = out.replace(/(--brand-accent:\s*)#[0-9A-Fa-f]{3,8};(.*)/,
      (_, a, b) => a + BRAND_ACCENT + ';' + b);
  }
  if (FONT_SANS) {
    out = out.replace(/(--font-sans:\s*).*?(;\s*\/\* FONT_SANS \*\/)/,
      (_, a, b) => a + `"${FONT_SANS}", system-ui, -apple-system, sans-serif` + b);
  }
  if (FONT_SERIF) {
    out = out.replace(/(--font-serif:\s*).*?(;\s*\/\* FONT_SERIF \*\/)/,
      (_, a, b) => a + `"${FONT_SERIF}", Georgia, serif` + b);
  }
  return out;
});

// ── Docs: stamp {{CLIENT_NAME}} / {{AGENCY_NAME}} across CLAUDE.md + every skill .md ─
function mdFiles(dir) {
  const abs = join(root, dir);
  if (!existsSync(abs)) return [];
  const out = [];
  for (const entry of readdirSync(abs, { withFileTypes: true })) {
    const rel = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...mdFiles(rel));
    else if (entry.name.endsWith('.md')) out.push(rel);
  }
  return out;
}
const stampDoc = (s) => s
  .split('{{CLIENT_NAME}}').join(CLIENT_NAME)
  .split('{{AGENCY_NAME}}').join(THEME_AUTHOR);
edit('CLAUDE.md', stampDoc, { optional: true });
for (const md of mdFiles('.claude/skills')) {
  edit(md, stampDoc, { optional: true });
}

// ── Summary ─────────────────────────────────────────────────────────────────
console.log('✓ Stamped project identity from .env');
console.log(`  Theme Name .......... ${CLIENT_NAME}`);
console.log(`  Author .............. ${THEME_AUTHOR}`);
console.log(`  Parent theme ........ ${PARENT_THEME}`);
console.log(`  Handle prefix ....... ${handlePrefix}-`);
console.log(`  Brand primary ....... ${BRAND_PRIMARY || '(placeholder #000)'}`);
console.log(`  Brand accent ........ ${BRAND_ACCENT || '(placeholder #000)'}`);
console.log(`  Fonts URL ........... ${GOOGLE_FONTS_URL || '(none)'}`);
console.log(changed.length
  ? `\n  Files updated: ${changed.join(', ')}`
  : '\n  No changes (already stamped).');
console.log('\n→ Next: npm run build:css');

#!/usr/bin/env node
/**
 * init.mjs — pre-flight check for /init-project.
 *
 * This script no longer writes any theme files. In the template-driven model
 * the `/init-project` Claude skill renders `templates/` → the theme root,
 * substituting the values below. This script only VALIDATES that the inputs are
 * present and sane, then prints the resolved identity so the skill (and the
 * human) can confirm before rendering.
 *
 * Exit codes:  0 = ready to render   1 = blocked (missing/invalid input)
 *
 *   node scripts/init.mjs   (or: npm run init)
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = join(root, '.env');
const templatesDir = join(root, 'templates');

const problems = [];
const warnings = [];

// ── .env must exist ───────────────────────────────────────────────────────────
if (!existsSync(envPath)) {
  console.error('✗ No .env found. Copy .env.example to .env and fill it in first:');
  console.error('    cp .env.example .env');
  process.exit(1);
}

// ── templates/ must exist (the render source of truth) ──────────────────────────
if (!existsSync(templatesDir)) {
  problems.push('templates/ directory is missing — nothing for /init-project to render from.');
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
  CLIENT_NAME = '',
  THEME_AUTHOR = '',
  PARENT_THEME = 'hello-elementor',
  THEME_HANDLE_PREFIX = 'theme',
  BRAND_PRIMARY = '',
  BRAND_ACCENT = '',
  FONT_SANS = '',
  FONT_SERIF = '',
  GOOGLE_FONTS_URL = '',
} = env;

// ── Required identity ──────────────────────────────────────────────────────────
if (!CLIENT_NAME || CLIENT_NAME === 'Client Name') {
  problems.push('CLIENT_NAME is unset or still the "Client Name" placeholder.');
}
if (!THEME_AUTHOR) {
  problems.push('THEME_AUTHOR is unset.');
}
if (!PARENT_THEME) {
  problems.push('PARENT_THEME is unset (expected e.g. hello-elementor).');
}

// slug for enqueue-handle prefix — lowercase alnum + dashes
const handlePrefix =
  (THEME_HANDLE_PREFIX || 'theme').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'theme';

// ── Optional-but-worth-flagging ─────────────────────────────────────────────────
if (!BRAND_PRIMARY) warnings.push('BRAND_PRIMARY blank — _tokens.scss keeps #000 /* TODO */.');
if (!BRAND_ACCENT)  warnings.push('BRAND_ACCENT blank — _tokens.scss keeps #000 /* TODO */.');
if (!FONT_SANS && !FONT_SERIF) warnings.push('No fonts set — _tokens.scss keeps system stacks.');
if (!GOOGLE_FONTS_URL) warnings.push('GOOGLE_FONTS_URL blank — no Google Fonts enqueued.');

// ── Report ──────────────────────────────────────────────────────────────────────
console.log('── /init-project pre-flight ──────────────────────────────');
console.log(`  Theme Name .......... ${CLIENT_NAME || '(missing)'}`);
console.log(`  Author .............. ${THEME_AUTHOR || '(missing)'}`);
console.log(`  Parent theme ........ ${PARENT_THEME || '(missing)'}`);
console.log(`  Handle prefix ....... ${handlePrefix}-`);
console.log(`  Brand primary ....... ${BRAND_PRIMARY || '(placeholder #000)'}`);
console.log(`  Brand accent ........ ${BRAND_ACCENT || '(placeholder #000)'}`);
console.log(`  Fonts (sans/serif) .. ${FONT_SANS || '(system)'} / ${FONT_SERIF || '(system)'}`);
console.log(`  Google Fonts URL .... ${GOOGLE_FONTS_URL || '(none)'}`);

if (warnings.length) {
  console.log('\n  Notes:');
  for (const w of warnings) console.log(`    • ${w}`);
}

if (problems.length) {
  console.error('\n✗ Not ready to render:');
  for (const p of problems) console.error(`    • ${p}`);
  process.exit(1);
}

console.log('\n✓ Pre-flight passed — /init-project can render templates/ → theme root.');

# Developer Reference — {{CLIENT_NAME}}

Generic technical reference for the `fbf-starter` theme. When a project ships a static design source (e.g. `static-website-reference/`), extract its CSS + JS into the shape below, then build the Elementor site against it. Values shown as `<from design>` are placeholders — fill them from the project's static source. Token names (`--brand-primary`, `--ink`, etc.) are the ones already defined in `scss/abstracts/_tokens.scss`; keep the names, set the values per project.

---

## Critical Architecture Note

Some static design sources are built with a framework (React/Babel/JSX from CDN, Vue, etc.) and may scroll inside a **custom wrapper element** rather than `window`. If so, all scroll listeners and IntersectionObservers in the source target that wrapper — check before replicating scroll behaviour.

**In the built WordPress theme there is no such wrapper.** The page scrolls on `window`. The scroll-shadow helper that ships in this theme's `functions.php` listens on `window` and toggles `body.body-scrolled` at `window.scrollY > 8` (see *Header — Sticky + Scroll Shadow* below). Reproduce scroll-dependent effects against `window` / `body` classes, not against a source-specific wrapper id.

```html
<!-- Example only — a source MAY wrap content and scroll inside it. -->
<div id="scroll-wrapper" style="height:100vh; overflow-y:auto;">
  <Header /> <main>...</main> <Footer /> <FloatingWidget />
</div>
```

---

## Part A — CSS

### How to extract design tokens

1. Open the static source's global stylesheet (usually a `:root { … }` block).
2. Map every custom property onto the token names already scaffolded in `scss/abstracts/_tokens.scss`. Keep the **structure** (brand ramp, ink scale, surfaces, type scale, radius, shadows, easing, layout); set the **values** per project.
3. Author values in `scss/`, compile to `assets/css/main.css` (`npm run build:css`; watch with `npm run watch:css`). Never hand-edit `assets/css/main.css` or add inline CSS to `functions.php`.
4. In Elementor, wire these into the Global Kit (Site Settings → Global Colours / Global Fonts) so widgets reference the tokens rather than hard-coded values.

### Design Tokens (`:root`) — token map

Token names below match `scss/abstracts/_tokens.scss`. Replace the client's specific hexes/fonts with `<project value>`; keep the ramp shape.

```css
/* Brand primary ramp — set per project */
--brand-primary:     <project value>;
--brand-primary-600: <project value>;   /* darker step for hover */
/* add -700 / -800 / -900 / -tint steps as the design requires */

/* Brand accent ramp — set per project */
--brand-accent:      <project value>;
/* add -600 / -700 / -tint / -rule (rgba) steps as the design requires */

/* Ink / text scale */
--ink:   <project value>;
--ink-2: <project value>;
--ink-3: <project value>;
--ink-4: <project value>;

/* Neutral surfaces */
--white:   <project value>;
--paper:   <project value>;
--paper-2: <project value>;
--line:    <project value>;
--line-2:  <project value>;

/* Typography — reference project fonts; see scss/abstracts/_tokens.scss */
--font-serif: <project serif>, Georgia, serif;
--font-sans:  <project sans>, system-ui, -apple-system, sans-serif;

/* Type scale (generic scaffold — usually reusable as-is) */
--text-sm:   .8125rem;                      /* 13px */
--text-base: 1rem;                          /* 16px */
--text-md:   1.125rem;                      /* 18px */
--text-lg:   1.3125rem;                     /* 21px */
--text-xl:   1.625rem;                      /* 26px */
--text-2xl:  2.125rem;                      /* 34px */
--text-3xl:  clamp(1.95rem, 3.6vw, 3rem);
--text-4xl:  clamp(2.4rem, 5vw, 4.2rem);

/* Radius (generic scaffold) */
--radius-sm:   4px;
--radius-md:   8px;
--radius-lg:   14px;
--radius-xl:   22px;
--radius-pill: 999px;

/* Shadows (generic scaffold — retune brand shadow to --brand-primary) */
--shadow-sm:      0 1px 2px rgba(0,0,0,.05);
--shadow-md:      0 6px 22px rgba(0,0,0,.07);
--shadow-lg:      0 20px 50px rgba(0,0,0,.12);
--shadow-primary: <project value>;   /* brand CTA shadow */

/* Motion */
--ease-out: cubic-bezier(.16,1,.3,1);

/* Layout */
--maxw: 1180px;
```

---

### Base / Reset

Generic reset — reusable across projects. Swap token names / brand values to the project's.

```css
html, body { margin: 0; }
* { box-sizing: border-box; }
body {
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}
button { font-family: inherit; }
a { color: inherit; text-decoration: none; }
img { max-width: 100%; }
::selection { background: <project value>; color: <project value>; }
:focus-visible { outline: 2px solid var(--brand-primary); outline-offset: 3px; border-radius: 3px; }
```

---

### Global Typography Classes

Reusable helper pattern — kicker (uppercase eyebrow), display, h2, h3, lead, body, small. Set fonts/colours from tokens.

```css
.kicker {
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: var(--text-sm);        /* 13px */
  text-transform: uppercase;
  letter-spacing: .2em;
  color: <project accent>;
  display: inline-flex; align-items: center; gap: 10px;
}
.kicker--light { color: rgba(255,255,255,.82); }

.display {
  font-family: var(--font-serif);
  font-weight: 400;
  font-size: var(--text-4xl);
  line-height: 1.05;
  letter-spacing: -.015em;
  color: <project primary>;
  margin: 0;
}
.h2  { font-family: var(--font-serif); font-weight: 400; font-size: var(--text-3xl); line-height: 1.1; letter-spacing: -.012em; color: <project primary>; margin: 0; }
.h3  { font-family: var(--font-serif); font-weight: 500; font-size: var(--text-xl); line-height: 1.2; color: <project primary>; margin: 0; }
.serif-italic { font-style: italic; color: var(--brand-primary); }
.lead  { font-family: var(--font-sans); font-weight: 400; font-size: var(--text-md); line-height: 1.66; color: var(--ink-2); }
.body  { font-family: var(--font-sans); font-size: var(--text-base); line-height: 1.7; color: var(--ink-2); }
.small { font-family: var(--font-sans); font-size: var(--text-sm); line-height: 1.6; color: var(--ink-3); }
```

---

### Scroll Reveal

```css
.reveal {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity .7s var(--ease-out), transform .7s var(--ease-out);
}
.reveal.in { opacity: 1; transform: none; }
```

In Elementor, prefer the native **entrance animations** (see Part C). Only hand-roll this if the design needs behaviour Elementor can't express.

---

### Marquee Animation

```css
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.marquee-track {
  display: flex; gap: <from design>; width: max-content;
  animation: marquee <from design>s linear infinite;
}
.marquee:hover .marquee-track { animation-play-state: paused; }
```

Edge fade mask: `mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)`. Duplicate the tile set (`[...LOGOS, ...LOGOS]`) for a seamless loop.

---

### Responsive Breakpoints

Match the design's breakpoints to Elementor's (Desktop / Tablet / Mobile, customisable). Typical collapse pattern:

```css
@media (max-width: 960px) {
  .desktop-nav { display: none !important; }
  .burger      { display: inline-flex !important; }
  .split, .col-3 { grid-template-columns: 1fr !important; }
  .col-4, .footer-grid { grid-template-columns: 1fr 1fr !important; }
}
@media (max-width: 600px) {
  .stat-row, .col-4, .footer-grid { grid-template-columns: 1fr !important; }
  .usp-strip { flex-direction: column !important; align-items: flex-start !important; }
}
```

Confirm exact breakpoint px per project and set them in Elementor Site Settings → Layout → Breakpoints.

---

### Accessibility

```css
@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
  * { animation-duration: .001ms !important; }
}
```

---

### Modal / Dialog (if the design has one)

```css
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.62);
  z-index: 200;
  display: flex; align-items: center; justify-content: center;
  padding: 24px;
  backdrop-filter: blur(4px);
}
.modal-card {
  background: var(--white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  max-width: <from design>; width: 100%;
  max-height: 90vh; overflow-y: auto;
  position: relative;
}
/* Split layout example: grid-template-columns: 200px 1fr; (media left, content right) */
```

In Elementor, build modals as **Popup templates** (see Part C) rather than custom overlay markup.

---

## Part B — JavaScript Interaction Patterns

For each interaction: what it does, the values to lift from the design (`<from design>`), and which Elementor mechanism reproduces it. Prefer native Elementor; hand-roll only where noted.

### Scroll Reveal (entrance)

- **What:** elements fade/slide in when they enter the viewport (IntersectionObserver, threshold `~0.1`); add class → `opacity 0→1`, `translateY(18px)→0`, duration `~0.7s var(--ease-out)`; optional per-element `transition-delay`.
- **Fallback:** force-reveal after a timeout if the observer never fires.
- **Elementor:** native **Entrance Animation** (Advanced → Motion Effects). Set duration/delay to match. Reduced-motion handled by CSS above.

### Count-Up (animated stats)

- **What:** number animates from 0 to target when scrolled into view (threshold `~0.4`), duration `~1500ms`, cubic ease-out `1 - (1-p)^3` via `requestAnimationFrame`. Reduced motion → set final value immediately.
- **Values:** targets + suffixes `<from design>`.
- **Elementor:** native **Counter** widget — set target, duration `1500ms`, prefix/suffix.

### Header — Sticky + Scroll Shadow

- **What:** sticky header gains a bottom border + subtle shadow once the page scrolls past a small threshold.
- **Ships in this theme:** `functions.php` adds a `window` scroll listener that toggles **`body.body-scrolled`** at **`window.scrollY > 8`**. Style the transition in SCSS keyed off that class:
  ```css
  .site-header { border-bottom: 1px solid transparent; box-shadow: none;
                 transition: border-color .3s, box-shadow .3s; }
  body.body-scrolled .site-header { border-bottom: 1px solid var(--line); box-shadow: var(--shadow-sm); }
  ```
- **Elementor:** set the header container `position: sticky; top: 0`; the shadow-on-scroll comes from the `body.body-scrolled` class, so no extra JS is needed in the build.

### Desktop Dropdown Nav

- **What:** hover-open dropdowns; short close delay on mouse-leave (`~130ms`); chevron rotates `180deg` when open (`transition transform .2s`). Multi-column mega-menu vs single column per item. Nested sub-dropdowns open to the side.
- **Sizes/positions:** `<from design>` (e.g. mega-menu `min-width`, column count, offset).
- **Elementor:** the header **nav is developer-owned** (`scss/components/_nav.scss`) — don't restyle without the owning dev. Build with Elementor Pro Mega Menu / Nav Menu widget or a bespoke nav per the design.

### Mobile Hamburger Menu

- **What:** burger toggles an in-flow slide-down panel (`max-height ~78vh`, `overflow-y:auto`); accordion sub-sections open one at a time; chevron rotates when its section is open.
- **Elementor:** Nav Menu / Mega Menu widget mobile behaviour, or bespoke panel. Confirm panel max-height and padding `<from design>`.

### Button Hover States

Generic pattern: `transform: translateY(-2px)` on hover, `transition: all .26s var(--ease-out)`. Map the design's variants to a token-driven table:

| Variant | Default bg | Hover bg | Other |
|---|---|---|---|
| `primary` | `var(--brand-primary)` | `var(--brand-primary-600)` | shadow → `<from design>` |
| `outline` | transparent | `<project primary>` | text → white, border matches |
| `ghost` | — | — | underline rule `<accent>` → `<accent>` |
| `onDark` | `rgba(255,255,255,.95)` | `var(--white)` | shadow-md → shadow-lg |
| `onDarkOutline` | transparent | `rgba(255,255,255,.12)` | |
| `accent` | `var(--brand-accent)` | `<accent darker>` | shadow → `--shadow-primary` |

Build as Elementor Button global styles / Global Kit button variants.

### Tab Switchers (About panel, Mission/Vision/Values, Process, Locations, etc.)

- **What:** a set of pills/tabs; clicking one swaps the panel content (usually instant, no animation). Active pill gets brand bg + white text + brand shadow; active underline-style tab gets a `2.5px` brand bottom-border. `transition: all .22s var(--ease-out)`.
- **Elementor:** native **Tabs** widget (Pro). Style active/inactive states in the Global Kit or widget style tab.

### Carousels (Services, Testimonials, Blog feed)

- **What:** horizontal slide via `translateX(-page * step%)`, `transition: transform .5–.55s cubic-bezier(.16,1,.3,1)`. Services-style: N visible, slides 1 at a time, prev/next arrows shown conditionally. Testimonials/Blog-style: paged, wrap-around, dot indicators (active dot widens).
- **Values:** slides-to-show, slides-to-scroll, arrow size/offset `<from design>`.
- **Elementor:** native **Carousel** / **Testimonial Carousel** / **Loop Carousel** widgets. Set `slides_to_show` + `slides_to_scroll` to match. Card hover (`translateY(-4px)`, `--shadow-lg`, image `scale(1.04)`) via widget style tab / custom CSS.

### Accordion (FAQ)

- **What:** single-open accordion; toggle icon (e.g. `plus`) rotates `45deg` when open (`transition transform .25s`); answer shows/hides.
- **Elementor:** native **Accordion** widget (Pro). Enter Q&A per page directly — do not build a FAQ CPT.

### Multi-Step "Fit / Qualifier" Quiz

- **What:** stepped radio quiz, click-to-advance (no Next button), progress bar of N segments filling with brand colour, conditional result screen based on collected answers, Back + Start-again controls.
- **Option hover:** border `var(--line)` → `var(--brand-primary)`, bg `var(--white)` → tint, `transition: all .2s var(--ease-out)`.
- **Elementor:** **no native equivalent.** Build as **Gravity Forms multi-step** + custom CSS for the card-style radios + a small JS snippet for click-to-advance and the conditional result copy.

### Floating Widget (reviews / promo, scroll-triggered)

- **What:** fixed bottom-right widget that appears after scrolling past a threshold (`~400px`); dismissible (state resets on reload unless persisted). `position: fixed; bottom/right ~28px; z-index: 100; max-width ~230px`.
- **Elementor:** **Popup template** with a **scroll trigger** (`≥ <from design>px`) and a close button. CTA link + `target="_blank"` `rel="noopener noreferrer"`, URL from ACF Options via Dynamic Tag.

### Modal (e.g. team member / detail)

- **What:** click card → open overlay dialog; close on overlay click, `Escape` key, or close button; `backdrop-filter: blur(4px)`; overlay `z-index: 200`. Card hover `translateY(-4px)` + `--shadow-lg`; photo hover `scale(1.04)`.
- **Elementor:** **Popup template** (native ESC-to-close and overlay-click-close). Trigger from the card link.

### Contact Form

- **What:** in the static source this is typically a fake submit (`preventDefault` + `setTimeout` success). **Replace with a real form.**
- **Elementor:** **Gravity Forms** embedded via the Gravity Forms widget, with a real notification email. Field focus/blur border colour → `var(--brand-primary)` / `var(--line-2)`.

### Card Hover (industry / feature cards)

- Generic: `transform: translateY(-3px)`, `box-shadow: var(--shadow-lg)`, icon chip colour-shifts primary→accent tints, `transition: all .24s var(--ease-out)`. Apply via widget style tab.

---

## Part C — Elementor Equivalents

| Interaction | Elementor native? | Action |
|---|---|---|
| Smooth scroll to anchor | ✓ Yes — anchor scroll | Wire up natively |
| Marquee / logo strip | Partial — Logo Carousel auto-play | Add custom CSS for `marquee` keyframes + edge-fade mask if design needs it |
| Services-style carousel (N-visible / 1-slide) | ✓ Yes — Carousel widget | Set `slides_to_show` + `slides_to_scroll` |
| Multi-step qualifier quiz + conditional result | ✗ No | Gravity Forms multi-step + custom CSS + JS snippet for auto-advance |
| Floating scroll-triggered widget | Partial — Popup scroll trigger | Popup with scroll trigger ≥ `<from design>px` |
| Modal ESC / overlay-click close | ✓ Yes — Popup | Native |
| Form submit | ✓ Yes — Gravity Forms + notification email | Replace any fake submit |
| Count-up animation | ✓ Yes — Counter widget | Set duration `1500ms`, target + suffix |
| Scroll reveal entrance | ✓ Yes — entrance animations | Match threshold + duration |
| Sticky header shadow on scroll | ✓ Ships in theme | `functions.php` toggles `body.body-scrolled` at `window.scrollY > 8`; style off that class in SCSS |
| FAQ accordion | ✓ Yes — Accordion widget (Pro) | Native; questions per page (no CPT) |
| Tabs (About / Process / Locations / MVV) | ✓ Yes — Tabs widget (Pro) | Native |
| Testimonials carousel | ✓ Yes — Testimonial widget (Pro) | Configure `slides_to_show` |
| CPT grids/archives (team, locations, industries, posts, testimonials) | ✓ Yes — Loop Grid + Loop Template | Pull fields via ACF **Dynamic Tags**; never hard-code |

---

## Conventions

- **CSS:** authored in `scss/`, compiled to `assets/css/main.css` (`npm run build:css`). Tokens live in `scss/abstracts/_tokens.scss`. No inline CSS in `functions.php`. `scss/components/_nav.scss` is developer-owned.
- **Page builder:** Elementor Pro is the sole builder. Wire tokens into the Global Kit.
- **Custom fields:** ACF Pro only; pull values into widgets via **Dynamic Tags**, never hard-coded.
- **CPTs:** use the **Loop Grid** widget + a Loop Template for every archive/grid.
- **Icons & images:** Lucide icons (upload as SVG) and WebP images from the Media Library are the **recommended defaults — confirm the icon set and image format per project.**

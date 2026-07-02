# QA Reference — {{CLIENT_NAME}}

Pixel-perfect verification checklist for the Elementor build against `static-website-reference/`. Treat the design source + the compiled tokens as authoritative. Every value must match its token or design spec exactly — do not accept approximations.

> **Single source of truth.** All colour, spacing, radius, shadow, easing and layout values live as CSS custom properties in `scss/abstracts/_tokens.scss` (compiled into `assets/css/main.css`). QA does not verify raw hex/px against a memorised palette — it verifies that each element resolves to the correct **token**. Where a value below reads `<from design tokens>` or `<from design>`, open `_tokens.scss` (or the design source) and confirm the exact value there, then confirm the widget uses it.

---

## Part A — CSS Verification

### Design Tokens — verify all are set in Elementor Global Colors / Custom CSS and match `_tokens.scss`

Confirm the project's token set is defined once and consumed everywhere (no ad-hoc hexes in widgets). The starter ships these token *families* in `scss/abstracts/_tokens.scss`; fill the values per project from the design.

| Token family | Token names to verify | Source of value |
|---|---|---|
| Brand primary + shades | `--brand-primary` and its darker/tint steps | `_tokens.scss` / design |
| Brand accent + shades | `--brand-accent` and its darker/tint steps | `_tokens.scss` / design |
| Ink / text scale | ink 1–4 (heading, body, muted, faint) | `_tokens.scss` |
| Surface / paper | white, paper, cream, mist, line/border greys | `_tokens.scss` |
| Type scale | `--text-sm … --text-4xl` | `_tokens.scss` |
| Radius | `--radius-sm / -md / -lg / -xl / -pill` | `_tokens.scss` |
| Shadow | `--shadow-sm / -md / -lg / --shadow-primary` | `_tokens.scss` |
| Easing | `--ease-out` | `_tokens.scss` |
| Layout | `--maxw` (content max-width) | `_tokens.scss` |

**Check:** every colour/spacing/radius/shadow used in a widget maps to one of the above tokens. Flag any literal hex or px that bypasses the token layer.

---

### Typography — verify each element against `<project serif>` / `<project sans>` and the type-scale tokens

For each element confirm: correct font family (`<project serif>` for display/headings, `<project sans>` for UI/body — confirm the pairing per project), correct type-scale token (`--text-*`), weight, line-height, letter-spacing, transform, and colour token.

| Element | Font | Size (token) | Weight | Line-height | Letter-spacing | Transform | Colour token |
|---|---|---|---|---|---|---|---|
| Hero h1 (display) | `<project serif>` | `--text-4xl` | `<from design>` | `<from design>` | `<from design>` | — | brand primary |
| Hero h1 on dark bg | `<project serif>` | `<from design>` | `<from design>` | `<from design>` | — | — | white |
| Section heading (h2) | `<project serif>` | `--text-3xl` | `<from design>` | `<from design>` | `<from design>` | — | brand primary |
| Card heading (h3) | `<project serif>` | `--text-xl` | `<from design>` | `<from design>` | — | — | brand primary |
| Lead paragraph | `<project sans>` | `--text-md` | 400 | `<from design>` | — | — | ink-2 |
| Body copy | `<project sans>` | `--text-base` | 400 | `<from design>` | — | — | ink-2 |
| Small text | `<project sans>` | `--text-sm` | 400 | `<from design>` | — | — | ink-3 |
| Kicker / eyebrow | `<project sans>` | `--text-sm` | 600 | — | wide (uppercase tracking) | uppercase | accent shade |
| Kicker on dark | `<project sans>` | `<from design>` | 600 | — | wide | uppercase | white @ ~82% |
| Nav link (desktop) | `<project sans>` | `<from design>` | 500 | — | — | — | ink |
| Nav link (open state) | `<project sans>` | `<from design>` | 500 | — | — | — | brand primary |
| Dropdown item | `<project sans>` | `<from design>` | 600 | — | — | — | ink |
| Mobile nav (top) | `<project sans>` | `<from design>` | 600 | — | — | — | ink |
| Mobile nav (sub) | `<project sans>` | `<from design>` | 500 | — | — | — | ink-2 |
| Mobile nav (sub-sub) | `<project sans>` | `<from design>` | 500 | — | — | — | ink-3 |
| Button label | `<project sans>` | `<from design>` | 600 | 1 | — | — | varies by variant |
| Footer col heading | `<project sans>` | `<from design>` | 700 | — | wide | uppercase | accent |
| Footer link | `<project sans>` | `<from design>` | 400 | — | — | — | white @ ~72% |
| Footer brand desc | `<project sans>` | `<from design>` | 400 | `<from design>` | — | — | white @ ~72% |
| Footer disclaimer | `<project sans>` | `<from design>` | 400 | `<from design>` | — | — | white @ ~48% |
| Footer copyright | `<project sans>` | `<from design>` | 400 | — | — | — | white @ ~50% |
| FAQ question | `<project serif>` | `<from design>` | 500 | — | — | — | brand primary |
| FAQ answer | `<project sans>` | `--text-base` | 400 | `<from design>` | — | — | ink-2 |
| Testimonial quote | `<project serif>` | `<from design>` | 400 | `<from design>` | — | italic | ink |
| Testimonial attribution | `<project sans>` | `<from design>` | 600 | — | — | — | brand primary |
| Testimonial location/meta | `<project sans>` | `<from design>` | 400 | `<from design>` | — | — | ink-3 |
| Blog card h3 | `<project serif>` | `<from design>` | 500 | `<from design>` | — | — | brand primary |
| Blog card excerpt | `<project sans>` | `<from design>` | 400 | `<from design>` | — | — | ink-2 |
| Blog card date | `<project sans>` | `<from design>` | 600 | — | — | — | ink-3 |
| Blog category pill | `<project sans>` | `<from design>` | 700 | — | wide | uppercase | brand primary |
| Stat number | `<project serif>` | `<from design>` (clamp) | `<from design>` | 1 | — | — | brand primary |
| Stat label | `<project sans>` | `<from design>` | 400 | `<from design>` | — | — | ink-2 |
| Process step label | `<project sans>` | `<from design>` | 700 | — | wide | uppercase | white @ ~60% / accent when active |
| Card title (grid item) | `<project sans>` | `<from design>` | 700 | — | — | — | brand primary |
| Card body (grid item) | `<project sans>` | `<from design>` | 400 | `<from design>` | — | — | ink-2 |
| Form label | `<project sans>` | `<from design>` | 600 | — | — | — | white @ ~85% (on dark) |
| Form input | `<project sans>` | `<from design>` | 400 | — | — | — | ink |
| Multi-step tool question | `<project serif>` | `<from design>` | 500 | — | — | — | brand primary |
| Multi-step tool option | `<project sans>` | `<from design>` | 500 | — | — | — | ink |
| Floating widget rating | `<project sans>` | `<from design>` | 700 | 1 | — | — | brand primary |
| Floating widget provider label | `<project sans>` | `<from design>` | 700 | — | — | — | `<provider brand colour>` |

---

### Spacing — verify padding/gap per section against `<from design>`

Confirm each section's vertical rhythm, side padding, and internal gaps. Side padding should equal the global container inset; content should not exceed `--maxw`. Record the intended values from the design and confirm the Elementor container/spacing matches.

| Section | Top/Bottom padding | Side padding | Gap |
|---|---|---|---|
| Global container | — | container inset | max-width: `--maxw` |
| Header | — | container inset | height `<from design>` |
| Hero | `<from design>` | container inset | — |
| USP / trust strip | `<from design>` | container inset | item gap `<from design>` |
| About / intro panel | `<from design>` | container inset | grid gap `<from design>` |
| Logo scroll / marquee | `<from design>` | 0 | tile gap `<from design>` |
| Services carousel | `<from design>` | container inset | — |
| Why choose us | `<from design>` | container inset | card gap + card padding `<from design>` |
| Multi-step tool | `<from design>` | container inset | grid gap `<from design>` |
| Team panel | `<from design>` | container inset | grid gap `<from design>` |
| Stats panel | `<from design>` | container inset | grid gap `<from design>` |
| Process panel | `<from design>` | container inset | — |
| Card grid panel | `<from design>` | container inset | card gap `<from design>` |
| FAQ panel | `<from design>` | container inset | grid gap `<from design>` |
| Testimonials | `<from design>` | container inset | card gap `<from design>` |
| Locations panel | `<from design>` | container inset | tab gap `<from design>` |
| Blog feed | `<from design>` | container inset | card gap `<from design>` |
| Contact CTA | `<from design>` | container inset | grid gap `<from design>` |
| Footer | `<from design>` | container inset | main grid gap `<from design>` |
| Floating widget | `<from design>` | — | fixed offset from bottom/right `<from design>` |

---

### Hover / Active / Focus States — verify against tokens

For each interactive element confirm the default → hover (and active/focus) transition uses the correct colour/shadow tokens and the standard easing (`--ease-out`). Transition durations should match the design (see Animations table).

| Element | Default | Hover / Active | Transition |
|---|---|---|---|
| Button primary | bg brand primary, `--shadow-primary` | bg brand-primary darker, deeper shadow, slight lift (`translateY(-2px)`) | `all <dur> var(--ease-out)` |
| Button outline | transparent bg, brand-primary text, line border | bg brand primary, white text | `all <dur> var(--ease-out)` |
| Button ghost | accent-tinted bottom border | solid accent bottom border | `all <dur> var(--ease-out)` |
| Button onDark | near-white bg, `--shadow-md` | white bg, `--shadow-lg` | `all <dur> var(--ease-out)` |
| Button accent/secondary | bg per variant | darker bg + shadow | `all <dur> var(--ease-out)` |
| Card (grid item) | `translateY(0)`, `--shadow-sm`, icon primary | `translateY(-Npx)`, `--shadow-lg`, icon accent | `all <dur> var(--ease-out)` |
| Blog card | `translateY(0)`, `--shadow-sm` | `translateY(-Npx)`, `--shadow-lg`, image `scale(>1)` | card `<dur>`, image longer `<dur>` |
| Team card | `translateY(0)`, `--shadow-sm` | `translateY(-Npx)`, `--shadow-lg` | `all <dur> var(--ease-out)` |
| Team photo | `scale(1)` | `scale(>1)` | `<dur> var(--ease-out)` |
| Nav item | ink | brand primary | `color <dur>` |
| Dropdown item | no bg | tint bg (mist) | `background <dur>` |
| Tab (about-style) | muted ink, transparent border | brand-primary text + brand-primary bottom border | `color/border <dur>` |
| Tab (location-style) | white bg, ink text | brand-primary bg, white text, `--shadow-primary` | `all <dur>` |
| Process circle | white bg, `scale(1)`, subtle ring | accent bg, `scale(>1)`, accent-tinted ring | `all <dur> var(--ease-out)` |
| Multi-step option | white bg, line border | tint bg, brand-primary border | `all <dur> var(--ease-out)` |
| Form field | line border | brand-primary border (focus) | `border-color <dur>` |
| Footer link | white @ ~72% | white | `color <dur>` |
| Footer social | subtle border, transparent bg | brand-primary bg | `background <dur>` |
| Floating CTA btn | bg brand primary | bg brand-primary darker | `background <dur>` |
| **Focus-visible (all)** | — | `outline: 2px solid <brand primary>; outline-offset: ~3px` | — |
| `::selection` | — | tint bg, dark brand text | — |

---

### Borders & Shadows — verify against radius/shadow tokens

Confirm radii map to `--radius-*` and shadows to `--shadow-*` (no ad-hoc values).

| Token / value | Typically used on |
|---|---|
| `--radius-sm` | small chips (e.g. cert logos) |
| `--radius-md` | cards, dropdowns, inputs, icon chips |
| `--radius-lg` | feature cards, FAQ, testimonials, grid cards, badges, panels, floating widget |
| `--radius-xl` | large media (photos), carousel/tool cards |
| `--radius-pill` | all CTA buttons, badge chips, tabs, dividers |
| `--shadow-sm` | card default state |
| `--shadow-md` | carousel / raised card |
| `--shadow-lg` | large media, card hover states, dropdowns |
| `--shadow-primary` | primary button, active tab |
| Elevated floating shadow | floating reviews widget (confirm value in design) |
| `1px solid <line token>` | FAQ item divider, testimonial figcaption top border |
| `1px solid rgba(white, ~.2)` | dark-panel borders (process detail, contact form container) |
| `outline: 2px solid <brand primary>; outline-offset: ~3px` | `:focus-visible` on all focusable elements |
| `::selection` | tint bg + dark brand text |

---

### Responsive Breakpoints — verify layout collapse

Confirm the project's breakpoints (from the design / Elementor kit) and that each layout collapses correctly at each one.

| Breakpoint | What to verify |
|---|---|
| **Nav breakpoint (tablet/mobile)** | Desktop nav hidden; hamburger visible; 2/3-col splits become 1-col; wide card grids drop a column; footer reduces columns |
| **Mid tablet** | Denser grids (e.g. services) step down a column |
| **Mobile** | Stats/footer/grids reduce to 1–2 col; trust strip stacks vertical, left-aligned |
| **Small mobile** | Densest grids reach 1-col |
| **prefers-reduced-motion** | All reveal elements immediately visible; marquee stopped; count-up jumps to final value |

---

### Animations & Transitions — verify duration + easing

Confirm durations match the design and easing uses `--ease-out` where specified. Record exact values from the design source.

| Behaviour | Property | Duration | Easing |
|---|---|---|---|
| Scroll reveal | `opacity`, `translateY(→0)` | `<from design>` | `var(--ease-out)` |
| Marquee | `translateX` | `<from design>` | linear (continuous) |
| Services carousel slide | `translateX` | `<from design>` | `var(--ease-out)` |
| Testimonials / blog feed slide | `translateX` | `<from design>` | `var(--ease-out)` |
| Header border/shadow on scroll | `border-color`, `box-shadow` | `<from design>` | default |
| Nav chevron rotate | `transform` | `<from design>` | default |
| FAQ icon rotate | `transform` | `<from design>` | default |
| Count-up | JS rAF | `<from design>` | ease-out |
| Buttons lift | `translateY` | `<from design>` | `var(--ease-out)` |
| Card lift (grid/blog/team) | `translateY` | `<from design>` | `var(--ease-out)` |
| Photo zoom on hover | `scale(>1)` | `<from design>` | `var(--ease-out)` |
| Process circle | `all` | `<from design>` | `var(--ease-out)` |
| Carousel dot expand (active) | `width` | `<from design>` | `var(--ease-out)` |
| Multi-step tool option | `all` | `<from design>` | `var(--ease-out)` |
| Tab transitions | `all` | `<from design>` | default / `var(--ease-out)` |

---

## Part B — JS Interaction Verification

These are behaviour test scripts: what to click/scroll and what to observe. Values (thresholds, offsets, delays) come from the design/build spec — confirm each per project.

### 1. Header scroll

- Border-bottom + shadow appear once the scroll container passes a small threshold (`scrollTop > N`).
- Confirm the scroll **source**: is it `window` or a dedicated scroll wrapper element? Test the actual one used.
- Transition on `border-color` + `box-shadow`.
- If a `backdrop-filter: blur()` is used, verify in-browser (check for `-webkit-` prefix support).

### 2. Mobile menu

- Hamburger toggles open/close icon (menu ↔ close).
- Panel: capped max-height, scrollable (`overflow-y: auto`), solid background.
- Only one accordion group (e.g. Services/Industries/Locations) open at a time.
- Tapping a leaf link closes the menu.
- Confirm click-outside behaviour — test whether the Elementor Nav Menu handles this natively or needs custom JS.

### 3. Desktop dropdowns

- Hover → short close delay (prevents accidental close on pointer travel).
- Multi-column dropdown has a wider `min-width`; single-column dropdowns narrower.
- Any nested sub-dropdown appears beside its parent with a higher `z-index`; verify it doesn't clip.
- Chevron rotates when open.

### 4. FAQ accordion

- One item open at a time.
- Clicking the open item closes it.
- Icon rotates on open (confirm icon per project — see icon note below).
- Confirm whether answer reveal is instant or height-animated per design.
- `aria-expanded` toggles on the trigger button.

### 5. About / intro tabs

- Tab set with an active state (brand-primary text + underline/border).
- Content updates immediately on click.

### 6. Process / steps panel

- N steps, default first step active.
- Active circle: accent bg + slight scale-up + ring.
- Detail panel below updates with the active step's copy on each click.

### 7. Locations panel

- Tab set, default first location.
- Active tab: brand-primary bg + shadow.
- Map `iframe` remounts on tab switch (verify the map actually reloads).
- HQ / featured badge appears only on the designated location.

### 8. Multi-step "fit"/quiz tool (if present)

- Clicking an option auto-advances (confirm whether there's a Next button).
- Progress indicator fills for completed steps.
- Back button appears after step 1.
- Result screen shows conditional copy based on the combination of answers.
- "Start again" resets all answers to step 0.
- Test representative paths across every combination of answers.

### 9. Logo marquee

- Continuous scroll at the design's duration.
- Pauses on hover (if specified).
- Gradient fade mask on left/right edges.
- `prefers-reduced-motion`: animation stops.

### 10. Services carousel

- Confirm how many columns are visible at once and the slide step.
- Next/prev advance by the step; verify button appear/disappear logic (or loop behaviour) matches design.

### 11. Count-up (stats)

- Trigger via IntersectionObserver on the correct scroll source (confirm threshold).
- Confirm duration and target values (pull final numbers from CPT/ACF/site settings, not hard-coded).
- `prefers-reduced-motion`: jumps to final value instantly.

### 12. Floating reviews widget

- Appears once the scroll container passes a larger threshold (`scrollTop > N`).
- Fixed position with capped max-width and high `z-index`; confirm bottom/right offsets.
- Close (×) hides it for the session; reappears on reload (confirm persistence behaviour).
- "Read our reviews" opens the review profile URL (from ACF Options) in a new tab.

### 13. Scroll reveal

- Sections fade + rise into view on scroll.
- Staggered reveal via per-element delays.
- Fallback forces reveal after a timeout (verify nothing stays hidden if the observer misfires).
- `prefers-reduced-motion`: all elements start fully visible, no animation.

### 14. Reduced motion

Test with DevTools → Rendering → `prefers-reduced-motion: reduce`:
- Reveal: immediate, no translate.
- Marquee: effectively stopped.
- Count-up: jumps to final value.
- All CSS transitions: effectively instant.

---

## Notes for QA

- **Icons:** confirm the icon set per project (e.g. a single consistent library, uploaded as SVG). Flag mixed icon sources.
- **Images:** confirm the required image format per project (e.g. WebP-first) and that all assets come from the WordPress Media Library, not local reference paths.
- **Copy:** verify body/heading/legal copy **verbatim** against the design source — including any required legal/disclaimer text, which must not be truncated or paraphrased.
- **Tokens over literals:** any raw hex, px radius, or shadow that bypasses `_tokens.scss` is a QA flag even if it looks visually correct.

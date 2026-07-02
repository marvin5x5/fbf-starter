# PM Reference — {{CLIENT_NAME}}

Project management overview for the `static-website-reference/` → Elementor Pro conversion. Built by ACME AGENCY.

> **Template note:** This is a generic PM reference for the `fbf-starter` theme. Replace every `{{PLACEHOLDER}}` and `<project-specific>` slot with real project values at kick-off. Keep the framework (gate order, phases, checklist categories); fill in the specifics.

---

## 1. Site Overview

**What it is:** WordPress site for {{CLIENT_NAME}} — `<one-line description of the business/sector and who it serves>`.

**Primary conversion goal:** `<the single most important action a visitor should take — e.g. submit an enquiry form, book a call, request a quote>`.

**Built by:** ACME AGENCY
**Project contact:** `<agency-project-email>`
**Stack:** `<local env, e.g. DevKinsta>` → WordPress + Elementor Pro + ACF Pro + `<form plugin, e.g. Gravity Forms>` + `<SEO plugin, e.g. Yoast SEO>`

---

### Page list — Phase 1 (in scope)

Fill one row per page. `Primary goal` should state the conversion or content job each page does.

| # | Page | Slug | Primary goal |
|---|---|---|---|
| 1 | `<Page name>` | `/` | `<goal>` |
| 2 | `<Page name>` | `/<slug>` | `<goal>` |
| … | `<Page name>` | `/<slug>` | `<goal>` |

---

## 2. Scope

### In scope — Phase 1
- Convert all Phase 1 pages above from `static-website-reference/` into Elementor Pro
- Register the project's CPTs: `<list — e.g. post (native), testimonial, team_member, location, …>`
- Build the project's forms: `<list form names — e.g. "Contact Enquiry", plus any bespoke multi-step form>`
- Build Theme Builder: Header, Footer, `<any global popups/widgets>`
- Set up Elementor Global Kit (colours, fonts, buttons)
- Set up ACF Options Page (`<e.g. "Site Settings">`) for site-wide data
- `<any content migration — e.g. migrate N blog posts from live site>`

### Out of scope — Phase 2
List everything deferred so the client knows what is *not* being delivered in Phase 1. Common deferrals:
- `<Additional location/landing pages not yet built — note any placeholder links pointing at "#">`
- `<Individual service/product detail pages>`
- `<Industry / audience sub-pages>`
- `<Individual blog post pages / off-site linked content>`

---

## 3. Content the Client Must Supply

PM must chase these items — build cannot be completed without them. This table is a **template of the KINDS of blockers to track**; fill in the concrete detail per project.

| Item | Detail | Blocks |
|---|---|---|
| **Real testimonials/reviews** | Replace all placeholder review copy — need real quotes, attribution, location/date | `<sections/pages that show testimonials>` |
| **Team member content** | Replace placeholder staff — need real names, roles, credentials, photos, bios | `<team section / team_member CPT>` |
| **Social media URLs** | All social links currently point to `#` — need real profile URLs | Footer + social icons site-wide |
| **Real images / media** | Any hotlinked, watermarked, or placeholder images — must be supplied and hosted in the Media Library | `<pages/sections relying on them>` |
| **Business contact details** | Phone, email, address, hours — confirm live values | Header, footer, contact page, ACF Options |
| **Third-party keys/URLs** | e.g. maps API key, review-profile URL, booking/CRM links | `<sections that consume them>` |
| **Real page copy** | Any pages/sections still using draft or lorem copy | `<pages affected — flag Phase 2 items as non-blocking>` |

---

## 4. Build Phases & Gate Order

### Gate order per page
**Developer builds → QA verifies pixel-perfect → PM signs off → page marked done**

No page advances to the next gate until the current one is cleared.

### Phase 1 — Setup (must complete before any page build starts)
1. Elementor Global Kit (colours, fonts, buttons, custom CSS tokens — source of truth is `scss/abstracts/_tokens.scss`)
2. Register CPTs in PHP (`<project CPTs>`)
3. Register ACF Options Page (`<name>`) + all field groups
4. Add minimum sample content to each CPT (enough to build Loop Templates)
5. Create forms in the form plugin (`<form names>`)
6. Build Elementor Loop Templates (`<one per CPT-driven grid — e.g. Blog Card, Testimonial Card>`)
7. Build Theme Builder: Header → Footer → `<any global popups/widgets>`
8. Build Global Sections (`<repeated sections built once, synced everywhere>`)

### Phase 2 — Page builds (in priority order)
Rate each page's complexity (Low / Medium / High) and note its key dependency so build order respects dependencies. Build the pages that unblock others first.

| Priority | Page | Complexity | Key dependency |
|---|---|---|---|
| 1 | `<Page>` | `<Low/Med/High>` | `<Global Sections / forms / Loop Templates / CPT content it needs>` |
| 2 | `<Page>` | `<Low/Med/High>` | `<dependency>` |
| … | `<Page>` | `<Low/Med/High>` | `<dependency>` |

---

## 5. Risks & Blockers

Track the live risk register here. This is a **template of the KINDS of risk** to watch — replace with concrete, project-specific entries and keep an owner against each.

| Risk | Detail | Owner |
|---|---|---|
| **Client content delay** | Placeholder team/testimonials/copy blocking specific pages | PM — chase client |
| **Fragile image hosting** | Any hotlinked or externally-hosted media that must be re-hosted locally | Developer — download + re-host before affected page |
| **Layout/interaction decisions** | Any static-HTML behaviour that maps imperfectly to an Elementor widget — needs a decision before dev starts | PM — get sign-off before affected build |
| **Bespoke form logic** | Multi-step / conditional / custom-styled forms may need extra CSS or a JS snippet | Developer — test early in Phase 1 |
| **Third-party dependencies** | Maps/API keys, review URLs, booking links that may fail or be missing | PM — confirm with client |
| **Dead links / placeholder hrefs** | Any `href="#"` links cannot go live | PM — chase real URLs |
| **Tracking/staging scripts** | Any bug-reporting or staging-only scripts injected in `<head>` must be removed before handoff | Developer — remove in final pass |
| **Copy/style conventions** | Any prohibited characters or brand-voice rules that must hold across pages | Developer — fix during build |

---

## 6. PM Sign-off Checklist

Keep these **categories** on every project; fill the specific values per project.

### Global Kit sign-off
- [ ] Brand colours match tokens: Primary `<value>`, Secondary `<value>`, Text `<value>`, Background `<value>`
- [ ] Brand fonts loaded (correct families + weights + styles)
- [ ] All button variants styled correctly (`<list the project's variants>`)
- [ ] All CSS tokens defined and matching `scss/abstracts/_tokens.scss`

### Theme Builder sign-off
- [ ] Header: sticky/scroll behaviour correct, dropdowns work, mobile menu opens/closes
- [ ] Footer: any legal/disclaimer text verbatim, cert/trust logos present, contact strip correct, copyright year current
- [ ] Any global popup/widget: appears/dismisses per spec, links open correct destinations

### Per-page sign-off
- [ ] All sections present in correct order (match `static-website-reference/` top-to-bottom)
- [ ] All headings and copy verbatim correct (no paraphrasing)
- [ ] No placeholder content (team, testimonials, lorem copy)
- [ ] All CTAs point to correct destinations (no `href="#"`)
- [ ] Contact/enquiry form present where required; submits correctly
- [ ] Any required legal/disclaimer text present in footer (verbatim — must not be truncated)
- [ ] Copy conventions honoured (any prohibited characters / brand-voice rules)
- [ ] Page title and meta description set in the SEO plugin
- [ ] Responsive: check at each defined breakpoint (`<e.g. 960px tablet, 600px mobile>`)
- [ ] QA signed off before PM review

### Final handoff sign-off
- [ ] Any tracking/staging scripts removed from all pages
- [ ] Social media URLs replaced with real links
- [ ] All externally-hosted/placeholder images downloaded and hosted locally
- [ ] Real testimonials/reviews in place (all placeholders replaced)
- [ ] Real team content in place (all placeholders replaced)
- [ ] Third-party URLs/keys verified (review profile, maps, booking, etc.)
- [ ] All forms tested end-to-end (submission → notification email received)
- [ ] SEO plugin green for all pages
- [ ] No broken links (run link checker)
- [ ] Any embeds (maps, video, feeds) loading correctly everywhere they appear

---

## 7. Client Briefing Notes

Use this section to record open decisions and content-chase items the client must action. Typical items to cover:

- **Layout decisions:** Any HTML behaviour needing a client call before build starts
- **Photography:** Which team/product/site photos the client must supply, and which pages they block
- **Testimonials/reviews:** Client to supply real review text — encourage pulling directly from the source profile
- **Deferred pages:** Which pages are Phase 2, and which placeholder links go nowhere until then — client must be aware before launch
- **Content migration:** If migrating from an existing site, confirm the approach (import vs. start fresh)
- **Social media:** Must be active and verified before go-live
- **Third-party services:** Any maps/API keys, billing accounts, or integrations the client must provide

# PM Sign-Off Brief — Page by Page

This doc holds the **page-by-page PM sign-off brief** for a `{{CLIENT_NAME}}` build: the content gaps/placeholders to resolve, the client-approval items, copy-correctness notes, forms to verify, and a per-page sign-off line.

It is built up **in page batches** as pages progress through the pipeline. **PM reviews a page only after QA has passed it** (gate order: Developer → QA → PM). Nothing is signed off before QA clears it, and no page ships before the pre-handoff + go-live checklists are walked.

---

## How to use

1. **Copy the template block below once per project page** (Home, About, Services, Contact, Blog, Locations, plus any service/industry/location landing pages).
2. Fill in the page name/slug, section order, CTAs, and any verbatim copy that must be checked (headings, legal/disclaimer text, form success copy).
3. **Do not open a page's PM review until QA has signed it off.** If QA is still raising issues, the page is not ready for this gate.
4. Resolve every **content gap** (placeholder copy, images, dead links, tracking scripts) and secure every **client-approval item** before ticking the sign-off line.
5. Walk the **pre-handoff** and **go-live** checklists at the bottom before marking the page done.

Keep entries compact. Use `{{CLIENT_NAME}}` for the client and `<placeholder>` for anything to be filled per project. Do not paste large blocks of verbatim client copy into this doc — reference it by section and check it against the design source.

---

## Per-page PM sign-off template

> Duplicate this whole block for each page.

### Page — `<Page Name>` (`/<slug>`)

**WordPress title:** `<Page Title | {{CLIENT_NAME}} | Location>`

#### SEO
- **`<title>`:** `<page title>`
- **Meta description:** `<meta description — verify present, unique, within length>`

#### Primary conversion goal
`<one line: what this page is trying to make the visitor do>`

#### Section order (top → bottom)
`<Section 1 → Section 2 → … → Contact CTA → Footer>`
(Match the design source order exactly. Note any global vs. saved vs. bespoke sections.)

#### CTAs — complete audit
| Label | Destination | Status |
|---|---|---|
| `<CTA label>` | `<target page / #anchor / form submit>` | ✓ / ⚠️ note |
| `<CTA label>` | `<target>` | ⚠️ dead / self-link / no page yet — resolve |
| Social icons (Footer) | `<url or #>` | ⚠️ confirm real URLs supplied |

- ✓ = destination correct and live.
- ⚠️ = dead anchor, self-link, points to an unbuilt page, or awaiting a real URL. Every ⚠️ must be resolved or explicitly accepted by the client before sign-off.

#### Content gaps / placeholders to resolve (client must supply)
- **Placeholder copy** — `<testimonials / bios / body copy still using filler>`
- **Placeholder people/team** — `<count>` still generic (name/photo/bio placeholders)
- **Images** — `<any hotlinked, temporary, or missing images; confirm hosted in Media Library as WebP>`
- **Social / external URLs** — `<Facebook / Instagram / LinkedIn / booking link still \`#\`>`
- **Tracking / QA scripts** — `<any bug-reporting or staging-only script in <head> — must be removed before handoff>`

#### Copy-correctness notes
- Verify all headings, kickers and body copy match the approved source verbatim.
- **Legal / disclaimer text** — if the page (or its footer) carries a required disclaimer, it must appear **verbatim and untruncated**. `<paste the client-approved disclaimer reference here — do not paraphrase>`
- Check brand-voice rules (e.g. punctuation/em-dash conventions) per project style guide.
- Confirm copyright line and any "designed/built by" attribution are correct or removed per client wishes.

#### Cross-page consistency
- Nav array matches every other page ✓ / ⚠️
- Phone / email / address match the single source of truth (ACF Options) ✓ / ⚠️
- Global sections (USP strip, Contact CTA, footer) identical to siblings ✓ / ⚠️
- Legal/disclaimer text identical across pages ✓ / ⚠️

#### Forms to verify (end-to-end)
- [ ] Form present and using the **canonical form instance** (not a page-local variant) — confirm field list and dropdown options match the master spec, not the static HTML.
- [ ] Submits successfully and sends the notification email to the right recipient.
- [ ] Success/confirmation copy correct: `<success heading + body>`
- [ ] Required-field validation and spam protection working.
- [ ] Footnote/consent copy present if required.

#### QA pre-requisites (must be true before PM opens this page)
- [ ] QA has signed the page off.
- [ ] All sections present in correct order vs. design source.
- [ ] Interactions (tabs, carousels, accordions, quizzes, maps, popups) work.
- [ ] Responsive checked at project breakpoints (e.g. `<960px>` + `<600px>`).

#### Client approval items
- [ ] `<decision the client must make — e.g. layout variant, link target, interim destination for unbuilt pages>`
- [ ] `<any placeholder the client must resolve before this page can go live>`

#### PM sign-off checklist
- [ ] QA has signed off.
- [ ] All sections present in correct order.
- [ ] Interactions work end-to-end.
- [ ] No placeholder copy, people, or images remain.
- [ ] All ⚠️ CTAs resolved (real URL, correct target, or client-accepted).
- [ ] Social / external URLs added.
- [ ] Legal/disclaimer text verbatim and untruncated.
- [ ] QA/staging-only scripts removed.
- [ ] Form submits and sends notification email.
- [ ] SEO: title + meta set, Yoast/RankMath green.
- [ ] Brand-voice / punctuation rules satisfied.
- [ ] Responsive verified at all breakpoints.

**PM sign-off:** `<name / date>` — page cleared for `<pre-handoff / go-live>`.

---

## Site-wide checklists (walk before marking any page done)

### Pre-handoff (before client review)
1. Wire every form to the real backend + notification email.
2. Replace all placeholder testimonials/reviews with approved content.
3. Replace all placeholder team members with real names, roles, photos, bios.
4. Fix dead/self-anchor links (e.g. blog, team, service, location buttons) to real targets.
5. Add real social-media and booking URLs across all pages.
6. Host all images locally in the Media Library (WebP) — remove any hotlinked/temporary sources.
7. Remove any QA/bug-reporting/staging-only scripts from every page.
8. Confirm legal/disclaimer text is present, verbatim, and untruncated everywhere required.

### Go-live
9. Build any remaining landing pages (locations / services / industries) or accept interim destinations with the client.
10. Resolve any `href: null` / placeholder links in bespoke sections.
11. Publish remaining CPT-driven content (blog posts, testimonials, team, locations).
12. Verify external profile / review / maps links are correct (and any API keys in place).
13. Final cross-page consistency pass: nav, footer, contact details, copyright, disclaimer.
14. Final responsive + accessibility + SEO pass across all pages.

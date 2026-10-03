# Content guide — updating the T R Constructions site

All business content lives in `src/content/` and `src/config/`. Components never hold company facts, so most updates are one data edit. After any change run `npm run dev` and check the page; before deploying run `npm run build` (it also refreshes the image manifest).

## Golden rules
- Publish only what the client has confirmed or what is in their documents. No invented numbers, clients, awards, testimonials or experience claims.
- Every project must keep an honest **status** and **scope**. Labour-only stays labour-only.
- Sump/OHT stays "current work" until completed projects with photos exist.
- Replacing a photo? Give the new file a **new name** (image caches last 30 days).

## Add a project
1. Create `public/images/portfolio/<slug>/` and add photos (JPEG/PNG/WebP, long edge ≤ 2400 px, landscape preferred for the cover). Name them `01-description.jpg`, `02-…`.
2. Open `src/content/projects/data.ts`, copy an existing entry and edit:
   - `slug` (unique, URL-safe), `title`, `category`, `location` (omit if unknown)
   - `status` + `statusSource` (`"client-update"` for anything the client confirmed)
   - `scope`: `full-contract` | `labour-only` | `partnership` | `execution` (= contract type not stated)
   - `role` (one factual sentence), `summary`, optional `description`, `works`
   - `services`: which service pages list it
   - `images`: first image is the cover; write factual `alt` text. Use `focal: { x, y }` (percent) to steer crops.
   - `featured: true` puts it in the home-page gallery; `order` controls sorting.
3. `npm run images` (dimension + blur manifest), then `npm run dev`.
The project page, register, filters, sitemap, structured data and social image are generated automatically.

## Update a current project's status
In `data.ts` change `status` (e.g. `"completed"`), keep/add `statusNote`, and update `CLIENT_UPDATE_LABEL` in `src/content/projects/index.ts` when the client sends a new list.

## Show a project value or client name
Values and clients are stored as `{ value, display }`. Set `display: true` only after written approval.

## Add photos to a project with none
Add files to its folder, list them under `images`, remove `drawing` if you like (it is only used when `images` is empty), run `npm run images`.

## Affiliations (client logos / names)
`src/content/affiliations/data.ts`. Only entries with `approved: true` **and** `visible: true` render (section is hidden while none qualify). To approve: confirm relationship + permission, copy the logo from `assets-source/affiliations/` to `public/images/affiliations/`, set `logo`, `relationship`, `approved: true`. Wording on the site is neutral ("Organisations we have worked for or with").

## Testimonials
`src/content/testimonials/data.ts` — add real quotes with written permission and `approved: true`. Nothing renders while the list is empty.

## Services
`src/content/services/data.ts` — edit text, `includes`, `image`; add a service by copying an entry (also add its slug to `ServiceSlug` in `src/content/types.ts`). Project references are derived from each project's `services` list. `qualifier` shows an honest label such as "Current work".

## Contact details, WhatsApp, address, hours, social links
`src/config/contact.ts` — one place for the whole site (header, footer, action bar, contact page, structured data). `whatsapp.enabled = false` removes every WhatsApp button. Add `hours`, `social` and confirmed `map.geo` when available.

## Company facts & SEO
- `src/config/site.ts` — name, description, registrations (numbers are intentionally not published).
- `src/config/seo.ts` — default title/description/keywords.
- Page copy: `src/content/pages/*.ts` (home, about, contact, privacy).
- Domain: set `NEXT_PUBLIC_SITE_URL` (e.g. `https://www.example.in`) in the hosting environment — canonical URLs, sitemap, robots and social images use it.

## Enquiry form delivery
Set ONE of these server environment variables (never prefix with `NEXT_PUBLIC_`):
- `RESEND_API_KEY`, `ENQUIRY_TO_EMAIL` (comma-separated), optional `ENQUIRY_FROM_EMAIL` (a verified sender), or
- `ENQUIRY_WEBHOOK_URL` (Make, Zapier, Slack, Formspree…).
Without either, development logs enquiries to the terminal and production shows a "could not send — please call" message.

## Brand files
See `docs/BRAND.md`. Logo geometry: `src/lib/brand/geometry.ts`; regenerate static files with `node scripts/generate-brand-assets.mjs`.

# T R Constructions — website

Production website for T R Constructions, Bengaluru (civil and building contractor).
Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · GSAP 3.15 · Three.js / React Three Fiber / Drei · next/image.

Project rules and design system: `../CLAUDE.md`. Research and client decisions: `../_discovery/`.

## Getting started
```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL and enquiry delivery
npm run dev                  # http://localhost:3000
```

| Script | |
|---|---|
| `npm run dev` | development server (Turbopack) |
| `npm run build` | refreshes the image manifest, then builds (all pages are static except `/api/enquiry`) |
| `npm run start` | serve the production build |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |
| `npm run images` | rebuild `src/content/generated/image-manifest.json` after adding photos |

## Where to change things
- **Projects, services, affiliations, testimonials, page copy** → `src/content/` (see `docs/CONTENT_GUIDE.md`)
- **Contact details, WhatsApp, address** → `src/config/contact.ts` (one place)
- **Company facts / SEO defaults / navigation / motion tokens** → `src/config/`
- **Design tokens** → `src/app/globals.css` (`@theme`)
- **Logo** → `src/lib/brand/geometry.ts`, files in `public/brand/` (see `docs/BRAND.md`)
- **Photos** → `public/images/portfolio/<project>/` (see `docs/ASSET_INVENTORY.md`)

## Architecture
```
src/
  app/            routes, metadata, sitemap/robots/manifest, OG images, /api/enquiry
  components/     UI only (brand, layout, home, projects, services, contact, media, ui, motion, seo)
  animations/     GSAP timeline factories (hero, reveal, sequence)
  three/          isolated R3F scenes (TRCMonolith, TankStructure) + SceneCanvas wrapper + capability checks
  content/        typed business content (projects, services, affiliations, testimonials, pages)
  config/         site, contact, seo, navigation, motion
  lib/            gsap registration, image manifest, schema.org builders, enquiry validation/delivery
scripts/          image manifest, brand assets, logo geometry, portfolio extraction, qa/
```

### Motion
GSAP drives all animation (`useGSAP` + `gsap.matchMedia`, so everything reverts on unmount and adapts to
desktop / mobile / reduced motion). Major moments: hero TRC assembly, ground-to-finish sequence, services
explorer, sump/OHT model, horizontal project gallery, project card → page morph (React `ViewTransition`),
footer reveal. With `prefers-reduced-motion`, pins and transforms are skipped and all content is static.

### 3D
Three.js scenes load only on capable desktops (WebGL, ≥ 4 cores, no Save-Data, no reduced motion), render
only while on screen, cap the pixel ratio, and fall back to SVG drawings on error or context loss. Phones get
SVG versions of the same ideas.

### Security
Static CSP and security headers (`next.config.ts`), same-origin + rate-limited + honeypot/time-trapped
enquiry endpoint with server-side validation, secrets only in server env vars, Google Maps loads only on request.

## Deploy
Any Node host that runs Next.js 16 (Vercel, Netlify, a VPS with `npm run build && npm run start`).
Set `NEXT_PUBLIC_SITE_URL` and one enquiry-delivery option before going live. On a multi-instance host,
replace the in-memory rate limiter (`src/lib/rate-limit.ts`) with a shared store.

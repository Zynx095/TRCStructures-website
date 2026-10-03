# TRC Monolith — identity system

**Status:** implemented for the website; client sign-off and **trademark screening are still required before final adoption** (see `_discovery/TR_Constructions_Phase3_Notes.md` #20).

## The idea
The three letters are built from structural members, so the mark reads as both **TRC** and a piece of construction:
- **T** — an amber **beam** resting on a **column** (post and beam). The amber slab is the only coloured element.
- **R** — a braced frame: stem, square bowl with an 8 × 8 counter, and a diagonal **brace** for the leg.
- **C** — a lipped **channel section** (C-section steel, as used in PEB purlins).

Construction grid: cap height 40 units; verticals 10, horizontals 8; joints between letters 4. Overall 98 × 40. The geometry lives in `src/lib/brand/geometry.ts` and drives the SVG logo, the 3D hero model, the favicon and the social images.

## Versions (files in `public/brand/`)
| Version | File | Use |
|---|---|---|
| Mark, colour | `trc-mark.svg` | light backgrounds |
| Mark, reverse | `trc-mark-reverse.svg` | slate backgrounds, photos |
| Mark, one colour | `trc-mark-mono.svg` | stamps, embossing, single-colour print (recolour freely) |
| Horizontal lockup | `trc-lockup*.svg` | website header, letterhead, invoices |
| Compact lockup (TRC over CONSTRUCTIONS) | `trc-compact*.svg` | signage, site boards, social avatars, footer |
| App tile | `trc-tile.svg`, `icon-192/512.png`, `src/app/icon.svg`, `apple-icon.png`, `favicon.ico` | browser, home screen |
| Structured-data logo | `trc-logo-512.png` | search engines |

The mark must remain recognisable without amber — use the one-colour version rather than recolouring parts.

## Colour
Slate `#1F2A33` · Deep slate `#151C22` · Concrete `#E9E7E2` · Paper `#F7F6F3` · Amber `#E8A317` (accent only — fills, the beam, CTAs; never body text on light backgrounds).

## Type
Barlow Condensed SemiBold (wordmark, large display lettering) · Archivo (headings) · Inter (body). All SIL OFL licensed.

## Don'ts
No 3D bevels/extrusion in print artwork, no gradients, no outlines around the letters, no roof or house symbols, don't separate the beam from the T in single-colour use, minimum digital size 24 px wide (use the tile below that).

## Regenerating
`python scripts/generate-logo-geometry.py` (needs `fonttools`; rebuilds geometry + outlined wordmarks) → `node scripts/generate-brand-assets.mjs` (SVG/PNG/ICO files).

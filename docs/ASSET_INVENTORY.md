# Asset inventory — company portfolio (Tulsiram Portfolio.pdf, 28 pages)

Extraction: `scripts/extract-portfolio-images.py` (PyMuPDF). Machine-readable list: `docs/asset-inventory.json`.
The PDF embeds **61 unique images** (plus repeated page backgrounds/logos). **54 photographs** are published as masters in `public/images/portfolio/<project>/` (JPEG q92, never upscaled); `next/image` serves AVIF/WebP at responsive sizes.

## Classification

| Class | Count | Files / notes |
|---|---|---|
| **Hero candidates** | 4 | KPTCL foundation pour (`kptcl-substation…/01`, 1120×840 — **used as home hero**), BMRCL granite flooring (`bmrcl…/01`, 2285×1714 — sharpest image; used for the "Finish" stage), STP formwork (`stp…/01`), HAL slab concreting (`hal…/02`) |
| **Civil / structure** | 22 | KPTCL sub-station (4), KPTCL retaining wall (5), HAL villas (5), Sri Sai Vidya Mandir (6), unattributed rebar pit (1), Marriott blockwork (1 of 4) |
| **Water infrastructure (STP)** | 4 | STP for Flamingo Properties (labour scope). *No sump/OHT photographs exist yet.* |
| **Layout / infrastructure** | 4 | Maa Bhoomi Green City layout (grading, trenches, chamber) |
| **Interiors / fit-out** | 15 | Garden City Office (5), Sudheeksha office (4), Prestige Key Garden flat (4, 3 attributed by page order), residential renovation (2) |
| **Residential** | 7 | HAL villas (5), residential renovation (2) |
| **Commercial** | 9 | BMRCL–Starworth (5), K Raheja Marriott (4, partnership) |
| **Institutional** | 10 | KPTCL sub-station (4), Sri Sai Vidya Mandir (6) |
| **Before / after** | 0 | No matched before/after pairs in the portfolio |
| **Duplicates (not re-used)** | 3 | p.2 metro image = p.13 (BMRCL 05); services-page school image = p.6; services-page red wardrobe = p.18 |
| **Low resolution** (≤ 0.6 MP) | 9 | School elevations 896×504 (2), HAL crops (~1024×373 after watermark crop), unattributed rebar pit 480×640, Marriott portraits 648×1048 — usable at card size, not full-bleed |
| **Unusable / not published** | 7 | Cover illustration (stock-style silhouettes, p.1); page frame graphic (p.3); background texture (repeated); 3 old TRC marks (kept in `assets-source/brand-reference/`); |
| **Client logos (not published)** | 16 | `assets-source/affiliations/` — awaiting approval (see `src/content/affiliations/data.ts`) |

## Crops applied (no other edits)
| File | Reason |
|---|---|
| sri-sai-vidya-mandir-school/03–06 | phone-camera watermark ("Galaxy M33 5G") |
| hal-staff-villas/01–05 | phone-camera watermark ("Samsung Triple Camera") |
| k-raheja-marriott-hotel-bengaluru/01–04 | phone watermark + date stamp |
| garden-city-office-hebbal-infra/02, 05 | timestamp text |
| residential-renovation-bengaluru/01 | a selfie of a person cropped out (faces are not published without consent) |
| unattributed/interior-partition-works | third-party logo (JLL) and date stamp cropped |

## Published photographs by project
| Project | Photos | Attribution |
|---|---|---|
| KPTCL Sub-station Office | 4 | documented (pp. 4–5) |
| Sri Sai Vidya Mandir School Building | 6 | documented (pp. 6–7) |
| Maa Bhoomi Green City Layout | 4 | documented (pp. 8–9) |
| KPTCL Retaining Wall | 5 | documented (pp. 10–11) |
| BMRCL — Starworth Reality | 5 | documented (pp. 12–13) |
| Garden City Office — Hebbal Infra | 5 | documented (pp. 14–15) |
| Residential Renovation | 2 | documented (p. 16) |
| Flat Interior — Prestige Key Garden | 4 | 1 documented (p. 17), 3 by page order (p. 18) |
| HAL Staff Villas | 5 | documented (pp. 19–20) |
| Sudheeksha Groups Office | 4 | documented (pp. 21–22) |
| K Raheja Marriott Hotel, Bengaluru | 4 | documented (pp. 23–24) |
| STP for Flamingo Properties | 4 | documented (pp. 25–26) |
| Unattributed (not used on pages) | 2 | services page p.3, contact page p.28 |
| Six current projects | 0 | illustrative drawings shown instead |

## Photography still needed (priority)
1. Sump/OHT sites — Hindupur, Devanahalli, Bagepalle, Vijayawada — at several stages (biggest gap).
2. Charitha Projects (Nelamangala) and Rajanakunte duplex — progress and finished.
3. Original, full-resolution files for all portfolio projects (current images are mostly 0.5–1.3 MP).
4. Optional: office/board exterior, proprietor portrait (never the GST certificate photo), team on site (with consent).

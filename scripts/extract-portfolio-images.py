"""
One-time extraction of project photographs from the client's portfolio PDF.

Run from the `website/` folder:
    python scripts/extract-portfolio-images.py

Requires: PyMuPDF (fitz) and Pillow.

What it does
- Pulls every embedded photograph out of "Tulsiram Portfolio.pdf" by its PDF xref.
- Applies documented crops only to remove phone-camera watermarks, timestamps,
  a third-party logo, and one selfie (people's faces are not published without consent).
- Never upscales. Writes high-quality JPEG masters to public/images/portfolio/<project>/.
  next/image derives AVIF/WebP + responsive sizes from these masters at request time.
- Copies the old TRC marks and the portfolio "Our clients" logos to assets-source/
  (NOT public) for reference. Client logos stay unpublished until approved.

The attribution of each photo to a project follows the portfolio page sequence
(project title page followed by its photo page). See docs/ASSET_INVENTORY.md.
"""

from __future__ import annotations

import json
import os
from pathlib import Path

import fitz  # PyMuPDF
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PDF = ROOT.parent / "Tulsiram Portfolio.pdf"
OUT_PUBLIC = ROOT / "public" / "images" / "portfolio"
OUT_SOURCE = ROOT / "assets-source"
MAX_EDGE = 2400

# crop = (left, top, right, bottom) as fractions of the original image.
# reason documents why any pixels were removed.
PHOTOS: list[dict] = [
    # KPTCL Sub-station Office, Kodigenahalli (portfolio p.4-5)
    dict(xref=68, project="kptcl-substation-kodigenahalli", name="01-foundation-concrete-pour"),
    dict(xref=74, project="kptcl-substation-kodigenahalli", name="02-column-cages-evening"),
    dict(xref=75, project="kptcl-substation-kodigenahalli", name="03-footing-pcc"),
    dict(xref=76, project="kptcl-substation-kodigenahalli", name="04-footing-reinforcement"),
    # Sri Sai Vidya Mandir school building (p.6-7)
    dict(xref=81, project="sri-sai-vidya-mandir-school", name="01-blockwork-elevation"),
    dict(xref=80, project="sri-sai-vidya-mandir-school", name="02-front-elevation"),
    dict(xref=87, project="sri-sai-vidya-mandir-school", name="03-elevation-with-signage", crop=(0, 0, 1, 0.92), reason="camera watermark"),
    dict(xref=88, project="sri-sai-vidya-mandir-school", name="04-blockwork-in-progress", crop=(0, 0, 1, 0.88), reason="camera watermark"),
    dict(xref=89, project="sri-sai-vidya-mandir-school", name="05-street-elevation", crop=(0, 0, 1, 0.9), reason="camera watermark"),
    dict(xref=90, project="sri-sai-vidya-mandir-school", name="06-roof-level-blockwork", crop=(0, 0, 1, 0.9), reason="camera watermark"),
    # Maa Bhoomi Green City layout, Varthur (p.8-9)
    dict(xref=95, project="maa-bhoomi-green-city-layout", name="01-layout-grading"),
    dict(xref=103, project="maa-bhoomi-green-city-layout", name="02-pipeline-trench"),
    dict(xref=101, project="maa-bhoomi-green-city-layout", name="03-pipe-laying"),
    dict(xref=102, project="maa-bhoomi-green-city-layout", name="04-inspection-chamber"),
    # KPTCL retaining wall (p.10-11)
    dict(xref=107, project="kptcl-retaining-wall", name="01-retaining-wall"),
    dict(xref=113, project="kptcl-retaining-wall", name="02-wall-alignment"),
    dict(xref=114, project="kptcl-retaining-wall", name="03-wall-base"),
    dict(xref=115, project="kptcl-retaining-wall", name="04-reinforcement"),
    dict(xref=116, project="kptcl-retaining-wall", name="05-formwork"),
    # BMRCL - Starworth Reality (p.12-13)
    dict(xref=121, project="bmrcl-starworth-reality", name="01-granite-flooring-detail"),
    dict(xref=120, project="bmrcl-starworth-reality", name="02-platform-level"),
    dict(xref=128, project="bmrcl-starworth-reality", name="03-platform-works"),
    dict(xref=127, project="bmrcl-starworth-reality", name="04-platform-flooring"),
    dict(xref=129, project="bmrcl-starworth-reality", name="05-platform-overview"),
    # Garden City Office - Hebbal Infra (p.14-15)
    dict(xref=141, project="garden-city-office-hebbal-infra", name="01-office-fit-out"),
    dict(xref=134, project="garden-city-office-hebbal-infra", name="02-fit-out-in-progress", crop=(0, 0, 1, 0.94), reason="timestamp text"),
    dict(xref=135, project="garden-city-office-hebbal-infra", name="03-glass-partition"),
    dict(xref=142, project="garden-city-office-hebbal-infra", name="04-partition-detail"),
    dict(xref=143, project="garden-city-office-hebbal-infra", name="05-ceiling-works", crop=(0, 0, 1, 0.93), reason="timestamp text"),
    # Residential renovation, Bengaluru (p.16)
    dict(xref=147, project="residential-renovation-bengaluru", name="01-renovation-in-progress", crop=(0.38, 0, 1, 1), reason="selfie of a person removed"),
    dict(xref=148, project="residential-renovation-bengaluru", name="02-kitchen-installation"),
    # Interior work for flat - Prestige Key Garden (p.17 + photo page p.18, attribution inferred)
    dict(xref=153, project="prestige-key-garden-flat-interior", name="01-wardrobe"),
    dict(xref=159, project="prestige-key-garden-flat-interior", name="02-wardrobe-shutters", inferred=True),
    dict(xref=160, project="prestige-key-garden-flat-interior", name="03-storage-unit", inferred=True),
    dict(xref=161, project="prestige-key-garden-flat-interior", name="04-kitchen-counter", inferred=True),
    # HAL Staff Villas (p.19-20)
    dict(xref=166, project="hal-staff-villas", name="01-villas-under-construction", crop=(0, 0, 1, 0.78), reason="camera watermark"),
    dict(xref=173, project="hal-staff-villas", name="02-slab-concreting", crop=(0, 0, 1, 0.79), reason="camera watermark"),
    dict(xref=165, project="hal-staff-villas", name="03-lower-level-formwork", crop=(0, 0, 1, 0.79), reason="camera watermark"),
    dict(xref=172, project="hal-staff-villas", name="04-site-progress", crop=(0, 0, 1, 0.79), reason="camera watermark"),
    dict(xref=174, project="hal-staff-villas", name="05-ground-floor-walls", crop=(0, 0, 1, 0.79), reason="camera watermark"),
    # Sudheeksha Groups office (p.21-22)
    dict(xref=178, project="sudheeksha-groups-office", name="01-workstations"),
    dict(xref=185, project="sudheeksha-groups-office", name="02-carpeted-work-area"),
    dict(xref=186, project="sudheeksha-groups-office", name="03-pantry-storage"),
    dict(xref=184, project="sudheeksha-groups-office", name="04-partition"),
    # K Raheja Marriott Hotel Bengaluru (partnership) (p.23-24)
    dict(xref=190, project="k-raheja-marriott-hotel-bengaluru", name="01-corridor-blockwork", crop=(0, 0, 1, 0.91), reason="camera watermark + date"),
    dict(xref=196, project="k-raheja-marriott-hotel-bengaluru", name="02-blockwork-from-scaffold", crop=(0, 0, 1, 0.91), reason="camera watermark + date"),
    dict(xref=197, project="k-raheja-marriott-hotel-bengaluru", name="03-blockwork-wall", crop=(0, 0, 1, 0.91), reason="camera watermark + date"),
    dict(xref=198, project="k-raheja-marriott-hotel-bengaluru", name="04-openings", crop=(0, 0, 1, 0.91), reason="camera watermark + date"),
    # STP for Flamingo Properties (p.25-26)
    dict(xref=202, project="stp-flamingo-properties", name="01-excavation-and-formwork"),
    dict(xref=209, project="stp-flamingo-properties", name="02-formwork-overview"),
    dict(xref=208, project="stp-flamingo-properties", name="03-concreting"),
    dict(xref=210, project="stp-flamingo-properties", name="04-walls-rising"),
    # Unattributed portfolio photos (services page p.3, contact page p.28)
    dict(xref=60, project="unattributed", name="reinforcement-in-excavation"),
    dict(xref=236, project="unattributed", name="interior-partition-works", crop=(0, 0.12, 1, 0.86), reason="third-party logo + timestamp"),
]

BRAND_REFERENCE = {38: "trc-tile-portfolio", 91: "trc-3d-portfolio", 94: "trc-flat-portfolio"}

CLIENT_LOGOS = {
    215: "sudheeksha", 216: "flamingo-properties", 217: "sri-sai-vidya-mandir", 218: "mantri-webcity",
    219: "sjr", 220: "adarsh-group", 221: "unidentified-purple-mark", 222: "airtel", 223: "isro",
    224: "iisc", 225: "voltas", 226: "k-raheja-corp", 227: "doubletree-by-hilton",
    228: "maa-bhoomi-developers", 229: "kbr-infratech", 230: "rmv-club",
}


def to_rgb(im: Image.Image) -> Image.Image:
    if im.mode in ("RGBA", "LA", "P"):
        bg = Image.new("RGBA", im.size, "white")
        bg.alpha_composite(im.convert("RGBA"))
        return bg.convert("RGB")
    return im.convert("RGB")


def page_of(doc: fitz.Document, xref: int) -> int:
    for pno in range(len(doc)):
        if any(info[0] == xref for info in doc[pno].get_images(full=True)):
            return pno + 1
    return -1


def main() -> None:
    doc = fitz.open(PDF)
    inventory = []
    for spec in PHOTOS:
        data = doc.extract_image(spec["xref"])
        tmp = ROOT / ".tmp-extract"
        tmp.mkdir(exist_ok=True)
        raw = tmp / f"x{spec['xref']}.{data['ext']}"
        raw.write_bytes(data["image"])
        im = to_rgb(Image.open(raw))
        w, h = im.size
        if "crop" in spec:
            l, t, r, b = spec["crop"]
            im = im.crop((round(l * w), round(t * h), round(r * w), round(b * h)))
        if max(im.size) > MAX_EDGE:
            im.thumbnail((MAX_EDGE, MAX_EDGE), Image.LANCZOS)
        out_dir = OUT_PUBLIC / spec["project"]
        out_dir.mkdir(parents=True, exist_ok=True)
        out = out_dir / f"{spec['name']}.jpg"
        im.save(out, "JPEG", quality=92, subsampling=0, optimize=True, progressive=True)
        inventory.append(
            dict(
                file=str(out.relative_to(ROOT / "public")).replace(os.sep, "/"),
                project=spec["project"],
                pdf_page=page_of(doc, spec["xref"]),
                xref=spec["xref"],
                original=f"{w}x{h}",
                output=f"{im.size[0]}x{im.size[1]}",
                cropped_for=spec.get("reason"),
                attribution="inferred from page sequence" if spec.get("inferred") else "documented",
            )
        )
        raw.unlink()

    for group, mapping in (("brand-reference", BRAND_REFERENCE), ("affiliations", CLIENT_LOGOS)):
        out_dir = OUT_SOURCE / group
        out_dir.mkdir(parents=True, exist_ok=True)
        for xref, name in mapping.items():
            data = doc.extract_image(xref)
            (out_dir / f"{name}.{data['ext']}").write_bytes(data["image"])

    tmp = ROOT / ".tmp-extract"
    if tmp.exists():
        tmp.rmdir()
    (ROOT / "docs").mkdir(exist_ok=True)
    (ROOT / "docs" / "asset-inventory.json").write_text(json.dumps(inventory, indent=2))
    print(f"wrote {len(inventory)} photographs")


if __name__ == "__main__":
    main()

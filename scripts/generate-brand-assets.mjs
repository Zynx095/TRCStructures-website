// Generates static brand files (SVG + PNG) from src/lib/brand/geometry.ts.
// Run: node scripts/generate-brand-assets.mjs   (Node 23.6+ strips TypeScript types natively)
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { MARK_HEIGHT, MARK_PARTS, MARK_WIDTH, T_SOLID, partPath, toPath } from "../src/lib/brand/geometry.ts";
import { WORDMARK_CONSTRUCTIONS, WORDMARK_FULL } from "../src/lib/brand/wordmark.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const brandDir = path.join(root, "public", "brand");
const appDir = path.join(root, "src", "app");

const INK = "#1F2A33";
const AMBER = "#E8A317";
const WHITE = "#FFFFFF";
const DEEP = "#151C22";

function parts(tone) {
  if (tone === "mono") {
    return `<g fill="#000"><path d="${toPath(T_SOLID)}"/>${MARK_PARTS.filter((p) => p.letter !== "T")
      .map((p) => `<path fill-rule="evenodd" d="${partPath(p)}"/>`)
      .join("")}</g>`;
  }
  const letter = tone === "reverse" ? WHITE : INK;
  return MARK_PARTS.map(
    (p) => `<path fill-rule="evenodd" fill="${p.tone === "accent" ? AMBER : letter}" d="${partPath(p)}"/>`,
  ).join("");
}

const svg = (vb, body, title = "T R Constructions") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="${title}"><title>${title}</title>${body}</svg>\n`;

function mark(tone) {
  return svg(`0 0 ${MARK_WIDTH} ${MARK_HEIGHT}`, parts(tone));
}

function lockup(tone) {
  const cap = 14;
  const s = cap / 100;
  const ww = (WORDMARK_FULL.maxX - WORDMARK_FULL.minX) * s;
  const ruleX = MARK_WIDTH + 12;
  const wordX = ruleX + 1.25 + 12;
  const fill = tone === "reverse" ? WHITE : tone === "mono" ? "#000" : INK;
  const body =
    parts(tone) +
    `<rect x="${ruleX}" y="4" width="1.25" height="${MARK_HEIGHT - 8}" fill="${fill}" opacity="0.35"/>` +
    `<path fill="${fill}" transform="translate(${wordX - WORDMARK_FULL.minX * s} ${(MARK_HEIGHT - cap) / 2}) scale(${s})" d="${WORDMARK_FULL.d}"/>`;
  return svg(`0 0 ${(wordX + ww).toFixed(2)} ${MARK_HEIGHT}`, body);
}

function compact(tone) {
  const w = WORDMARK_CONSTRUCTIONS.maxX - WORDMARK_CONSTRUCTIONS.minX;
  const s = MARK_WIDTH / w;
  const gap = 7;
  const fill = tone === "reverse" ? WHITE : tone === "mono" ? "#000" : INK;
  const body =
    parts(tone) +
    `<path fill="${fill}" transform="translate(${-WORDMARK_CONSTRUCTIONS.minX * s} ${MARK_HEIGHT + gap}) scale(${s})" d="${WORDMARK_CONSTRUCTIONS.d}"/>`;
  return svg(`0 0 ${MARK_WIDTH} ${(MARK_HEIGHT + gap + 100 * s).toFixed(2)}`, body);
}

/** square tile: slate background, reversed mark — favicon / app icon */
function tile(size = 64, pad = 0.12, radius = 0) {
  const inner = size * (1 - pad * 2);
  const s = inner / MARK_WIDTH;
  const h = MARK_HEIGHT * s;
  const body =
    `<rect width="${size}" height="${size}" rx="${radius}" fill="${DEEP}"/>` +
    `<g transform="translate(${size * pad} ${(size - h) / 2}) scale(${s})">${parts("reverse")}</g>`;
  return svg(`0 0 ${size} ${size}`, body);
}

await mkdir(brandDir, { recursive: true });
const files = {
  "trc-mark.svg": mark("color"),
  "trc-mark-reverse.svg": mark("reverse"),
  "trc-mark-mono.svg": mark("mono"),
  "trc-lockup.svg": lockup("color"),
  "trc-lockup-reverse.svg": lockup("reverse"),
  "trc-lockup-mono.svg": lockup("mono"),
  "trc-compact.svg": compact("color"),
  "trc-compact-reverse.svg": compact("reverse"),
  "trc-compact-mono.svg": compact("mono"),
  "trc-tile.svg": tile(64, 0.1),
};
for (const [name, content] of Object.entries(files)) await writeFile(path.join(brandDir, name), content);

// favicon (SVG) for the app router
await writeFile(path.join(appDir, "icon.svg"), tile(64, 0.08));

// rasters
const raster = async (svgText, size, out, bg) => {
  let img = sharp(Buffer.from(svgText), { density: 600 }).resize(size, size, {
    fit: "contain",
    background: bg ?? { r: 0, g: 0, b: 0, alpha: 0 },
  });
  if (bg) img = img.flatten({ background: bg });
  await img.png().toFile(out);
};
await raster(tile(180, 0.12), 180, path.join(appDir, "apple-icon.png"));
await raster(tile(192, 0.12), 192, path.join(brandDir, "icon-192.png"));
await raster(tile(512, 0.12), 512, path.join(brandDir, "icon-512.png"));
await raster(tile(32, 0.06), 32, path.join(brandDir, "favicon-32.png"));
await raster(tile(16, 0.04), 16, path.join(brandDir, "favicon-16.png"));
// logo for structured data: compact lockup on white, padded
await sharp(Buffer.from(compact("color")), { density: 900 })
  .resize(400, null)
  .extend({ top: 56, bottom: 56, left: 56, right: 56, background: "#ffffff" })
  .flatten({ background: "#ffffff" })
  .resize(512, 512, { fit: "contain", background: "#ffffff" })
  .png()
  .toFile(path.join(brandDir, "trc-logo-512.png"));

console.log("brand assets written:", Object.keys(files).length + 7);

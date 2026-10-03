// Builds src/content/generated/image-manifest.json from everything in public/images.
// For each image: intrinsic width/height + a tiny blurred placeholder (data URL).
// Runs automatically before `npm run build`; run `npm run images` after adding photos.
import { readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");
const imagesDir = path.join(publicDir, "images");
const outFile = path.join(root, "src", "content", "generated", "image-manifest.json");
const exts = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  const files = await Promise.all(
    entries.map((e) => {
      const full = path.join(dir, e.name);
      return e.isDirectory() ? walk(full) : exts.has(path.extname(e.name).toLowerCase()) ? [full] : [];
    }),
  );
  return files.flat();
}

const files = (await walk(imagesDir)).sort();
const manifest = {};
for (const file of files) {
  const src = "/" + path.relative(publicDir, file).split(path.sep).join("/");
  const image = sharp(file);
  const { width, height } = await image.metadata();
  const blur = await image
    .clone()
    .resize(12, Math.max(1, Math.round((12 * height) / width)), { fit: "fill" })
    .webp({ quality: 40 })
    .toBuffer();
  manifest[src] = { w: width, h: height, blur: `data:image/webp;base64,${blur.toString("base64")}` };
}

await mkdir(path.dirname(outFile), { recursive: true });
await writeFile(outFile, JSON.stringify(manifest, null, 0) + "\n");
console.log(`image manifest: ${files.length} images → ${path.relative(root, outFile)}`);

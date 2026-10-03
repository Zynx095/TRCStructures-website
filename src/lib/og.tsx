import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { MARK_HEIGHT, MARK_PARTS, MARK_WIDTH, partPath } from "@/lib/brand/geometry";

export const OG_SIZE = { width: 1200, height: 630 };

const markSvg = () => {
  const paths = MARK_PARTS.map(
    (p) => `<path fill-rule="evenodd" fill="${p.tone === "accent" ? "#E8A317" : "#FFFFFF"}" d="${partPath(p)}"/>`,
  ).join("");
  return `data:image/svg+xml;base64,${Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MARK_WIDTH} ${MARK_HEIGHT}">${paths}</svg>`,
  ).toString("base64")}`;
};

async function photoDataUrl(src?: string): Promise<string | null> {
  if (!src) return null;
  try {
    const buf = await readFile(join(process.cwd(), "public", src));
    const type = src.endsWith(".png") ? "image/png" : "image/jpeg";
    return `data:${type};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

/** Shared social card: slate panel with the TRC mark and title, plus a real site photograph. */
export async function renderOgImage({ title, subtitle, photo }: { title: string; subtitle: string; photo?: string }) {
  const font = await readFile(join(process.cwd(), "assets-source", "fonts", "BarlowCondensed-SemiBold.ttf"));
  const image = await photoDataUrl(photo);
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#151C22", color: "#FFFFFF" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: image ? "56%" : "100%",
            padding: "56px 56px 48px",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={markSvg()} width={196} height={80} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: title.length > 34 ? 64 : 80, lineHeight: 0.95, textTransform: "uppercase", letterSpacing: -1 }}>
              {title}
            </div>
            <div style={{ marginTop: 24, fontSize: 30, color: "#A7B0B8", lineHeight: 1.25 }}>{subtitle}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 24, color: "#A7B0B8", letterSpacing: 1 }}>
            <div style={{ width: 48, height: 8, background: "#E8A317" }} />
            T R CONSTRUCTIONS · BENGALURU
          </div>
        </div>
        {image && (
          <div style={{ display: "flex", width: "44%", height: "100%", position: "relative" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="" width={528} height={630} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
      </div>
    ),
    { ...OG_SIZE, fonts: [{ name: "Barlow Condensed", data: font, style: "normal", weight: 600 }] },
  );
}

import { home } from "@/content/pages/home";
import { OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "T R Constructions — civil and building contractor, Bengaluru";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return renderOgImage({
    title: "Built to execute.",
    subtitle: "Civil and building contractor in Bengaluru — structure, finishes, interiors and water-tank works.",
    photo: home.hero.image.src,
  });
}

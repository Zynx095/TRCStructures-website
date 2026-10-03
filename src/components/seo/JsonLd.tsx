import { jsonLd } from "@/lib/schema";

export function JsonLd({ data }: { data: unknown }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(item) }} />
      ))}
    </>
  );
}

"use client";

import { useState } from "react";
import { PinIcon } from "@/components/ui/Icons";
import { addressLines, mapsDirectionsHref, mapsEmbedSrc } from "@/config/contact";
import { contactPage } from "@/content/pages/contact";

/**
 * The Google map loads only when the visitor asks for it — no third-party requests
 * (or cookies) on page load, and nothing heavy on mobile data.
 */
export function MapFacade() {
  const [show, setShow] = useState(false);
  const { map } = contactPage;
  return (
    <div className="map-frame relative aspect-[4/3] w-full overflow-hidden bg-slate text-white [--focus-ring:var(--color-amber)] lg:aspect-auto lg:h-full lg:min-h-[26rem]">
      {show ? (
        <iframe
          src={mapsEmbedSrc()}
          title="Map showing the T R Constructions office"
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col justify-between p-6">
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] [background-size:2.5rem_2.5rem]"
          />
          <div className="relative flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center bg-amber text-ink">
              <PinIcon size={20} />
            </span>
            <address className="font-heading not-italic leading-relaxed">
              {addressLines().map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </address>
          </div>
          <div className="relative flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShow(true)}
              className="inline-flex min-h-12 items-center bg-white px-5 font-heading font-semibold text-ink"
            >
              {map.load}
            </button>
            <a
              href={mapsDirectionsHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center border border-white/40 px-5 font-heading font-semibold"
            >
              {map.directions}
              <span className="sr-only"> (opens Google Maps)</span>
            </a>
            <p className="w-full text-sm text-white/60">{map.note}</p>
          </div>
        </div>
      )}
    </div>
  );
}

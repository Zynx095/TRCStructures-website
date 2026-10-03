import type { Service } from "../types";

/**
 * SERVICES
 * Source: portfolio "Our services" page (Construction, Interior Design, Renovation,
 * Land Development, PEB Structures) + the client's current works (sump/OHT).
 * Building/industrial cleaning appears only in the Udyam classification and is NOT
 * listed until the client confirms it is offered.
 * Project references on each service are derived automatically from project data.
 */
const img = (slug: string, file: string) => `/images/portfolio/${slug}/${file}.jpg`;

export const services: Service[] = [
  {
    slug: "residential-construction",
    name: "Residential construction",
    shortName: "Residential",
    summary: "Houses, villas and residential buildings — foundations, frame, walls and finishes.",
    description: [
      "We build homes from the ground up: excavation and footings, the concrete frame, block walls, plastering and finishes.",
      "Completed work in the portfolio includes the three HAL Staff Villas, built in six months. Two residential projects are under way: a 3,500 sq ft building in Nelamangala and a 1,200 sq ft duplex villa studio in Rajanakunte, now near the finishing stage.",
    ],
    includes: ["Excavation and footings", "Columns, beams and slabs", "Block work and plastering", "Flooring and finishes"],
    image: {
      src: img("hal-staff-villas", "02-slab-concreting"),
      alt: "Workers levelling freshly poured concrete on a villa roof slab.",
      caption: "HAL Staff Villas — roof slab concreting",
    },
    order: 1,
    visible: true,
    seo: {
      title: "Residential construction in Bengaluru",
      description:
        "Villa and residential construction by T R Constructions, Bengaluru — footings, frame, block work, plastering and finishes. Current work in Nelamangala and Rajanakunte.",
    },
  },
  {
    slug: "commercial-institutional-works",
    name: "Commercial & institutional works",
    shortName: "Commercial & institutional",
    summary: "Civil structure, block work, plastering and flooring for institutional and commercial buildings.",
    description: [
      "For institutional and commercial buildings we execute the civil package — structure, block work, plastering and flooring — as the contractor, as a labour contractor, or together with a partner firm. Each project page states which.",
      "The portfolio includes the KPTCL Sub-station Office at Kodigenahalli, the Sri Sai Vidya Mandir school building (labour), civil works and granite flooring on BMRCL — Starworth Reality, and block work on the K Raheja Marriott Hotel, Bengaluru, executed in partnership in the name of SR Key Stones.",
    ],
    includes: ["Civil structure", "Block work", "Plastering", "Granite and stone flooring", "Retaining walls"],
    image: {
      src: img("sri-sai-vidya-mandir-school", "01-blockwork-elevation"),
      alt: "Multi-storey school building with concrete block walls and window openings.",
      caption: "Sri Sai Vidya Mandir School Building — block work (labour)",
    },
    order: 2,
    visible: true,
    seo: {
      title: "Commercial & institutional civil works",
      description:
        "Civil structure, block work, plastering and granite flooring for institutional and commercial buildings — T R Constructions, Bengaluru.",
    },
  },
  {
    slug: "sump-oht-construction",
    name: "Sump & OHT construction",
    shortName: "Sump & OHT",
    summary: "Underground sump tanks and elevated overhead tanks (OHT) for developers' projects.",
    qualifier: {
      label: "Current work",
      text: "Four sump and OHT projects are under execution in Karnataka and Andhra Pradesh.",
    },
    description: [
      "A sump stores water below ground; an overhead tank (OHT), raised on staging, supplies it by gravity. We are currently building both on four projects, at Hindupur, Devanahalli, Bagepalle and Vijayawada.",
      "Related water-infrastructure work in the portfolio: labour for a 2 lakh litre sewage treatment plant (STP) for Flamingo Properties, recorded as completed.",
    ],
    includes: [
      "Excavation for underground sumps",
      "Sump base slab and walls",
      "OHT staging — columns and bracing",
      "Overhead tank container",
      "STP tank civil works",
    ],
    image: {
      src: img("stp-flamingo-properties", "02-formwork-overview"),
      alt: "Plywood formwork and starter bars for the compartments of a sewage treatment plant.",
      caption: "STP for Flamingo Properties — formwork (labour scope)",
    },
    feature: "tank-structure",
    order: 3,
    visible: true,
    seo: {
      title: "Sump tank & overhead tank (OHT) construction",
      description:
        "Sump tanks and overhead tanks (OHT) for developers — current projects in Hindupur, Devanahalli, Bagepalle and Vijayawada. T R Constructions, Bengaluru.",
    },
  },
  {
    slug: "interiors-fit-outs",
    name: "Interiors & fit-outs",
    shortName: "Interiors",
    summary: "Office and apartment interiors — partitions, ceilings, carpentry, flooring, electrical and MEP works.",
    description: [
      "Fit-outs for offices and homes, covering civil, carpentry, electrical and MEP works.",
      "Completed examples: the Garden City Office — Hebbal Infra fit-out (five months), the Sudheeksha Groups office (30 days) and an apartment interior at Prestige Key Garden (45 days).",
    ],
    includes: ["Partitions and glazing", "Ceilings", "Wardrobes, storage and carpentry", "Electrical and MEP works", "Flooring"],
    image: {
      src: img("garden-city-office-hebbal-infra", "03-glass-partition"),
      alt: "Glazed partitions and a glass door in a finished office.",
      caption: "Garden City Office — Hebbal Infra",
    },
    order: 4,
    visible: true,
    seo: {
      title: "Office & apartment interior fit-outs",
      description:
        "Office and apartment fit-outs in Bengaluru — partitions, ceilings, carpentry, electrical and MEP works by T R Constructions.",
    },
  },
  {
    slug: "renovation",
    name: "Renovation",
    shortName: "Renovation",
    summary: "Upgrades to lived-in homes and workplaces — toilets, kitchens, storage and finishes.",
    description: [
      "Renovation of existing spaces: stripping out, new toilets, kitchens and storage, and refreshed finishes.",
      "In the portfolio: a complete makeover of a Bengaluru residence, including new toilets and interior upgrades, completed in 45 days.",
    ],
    includes: ["New toilets and bathrooms", "Kitchen installation", "Storage and joinery", "Finishes and repairs"],
    image: {
      src: img("residential-renovation-bengaluru", "02-kitchen-installation"),
      alt: "Worker installing modular kitchen units during a home renovation.",
      caption: "Residential renovation, Bengaluru",
    },
    order: 5,
    visible: true,
    seo: {
      title: "Home & office renovation in Bengaluru",
      description:
        "Renovation in Bengaluru — new toilets, kitchens, storage and finishes for occupied homes and workplaces. T R Constructions.",
    },
  },
  {
    slug: "peb-industrial-structures",
    name: "PEB & industrial structures",
    shortName: "PEB & industrial",
    summary: "Pre-engineered building (PEB) structures and sheds for industrial and warehouse use.",
    description: [
      "Pre-engineered buildings — steel frames made off-site and erected on prepared foundations — enclose large industrial and warehouse spaces quickly and economically.",
      "PEB structures are part of our service list. Tell us about the building and site, and we will discuss the structure and the civil works it needs.",
    ],
    includes: ["Pre-engineered building structures", "Industrial and warehouse sheds", "Associated civil works"],
    drawing: "portal-frame",
    order: 6,
    visible: true,
    seo: {
      title: "PEB & industrial structures",
      description:
        "Pre-engineered building (PEB) structures and industrial or warehouse sheds with associated civil works — T R Constructions, Bengaluru.",
    },
  },
  {
    slug: "layout-land-development",
    name: "Layout & land development",
    shortName: "Layouts",
    summary: "Civil works for plotted layouts — grading, trenches, pipelines and chambers.",
    description: [
      "Development works for plotted layouts, carried out ahead of construction on individual plots.",
      "In the portfolio: labour for the Maa Bhoomi Green City layout at Varthur, Bengaluru, where the photographs show land grading, pipeline trenches and inspection chambers.",
    ],
    includes: ["Land grading", "Trenching and pipelines", "Inspection chambers"],
    image: {
      src: img("maa-bhoomi-green-city-layout", "02-pipeline-trench"),
      alt: "Long trench with a pipeline laid across a plotted layout.",
      caption: "Maa Bhoomi Green City Layout — pipeline trench (labour)",
    },
    order: 7,
    visible: true,
    seo: {
      title: "Layout & land development works",
      description:
        "Layout development works — grading, trenches, pipelines and inspection chambers. T R Constructions, Bengaluru.",
    },
  },
];

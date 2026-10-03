import type { MediaImage } from "../types";

/**
 * HOME PAGE COPY. Facts only; every project referenced by slug pulls its own
 * status/scope labels from the project data.
 */
const img = (slug: string, file: string) => `/images/portfolio/${slug}/${file}.jpg`;

export interface SequenceStage {
  id: string;
  number: string;
  /** one-word stage name, set large */
  stage: string;
  title: string;
  text: string;
  works: string[];
  images: (MediaImage & { projectSlug: string })[];
  projectSlugs: string[];
}

export const home = {
  description:
    "Civil and building contractor in Bengaluru — structure, block work, finishes, interiors and sump/OHT works for developers, institutions and homeowners in Karnataka and Andhra Pradesh.",

  hero: {
    kicker: "Civil and building contractor, Bengaluru",
    headline: ["Built to", "execute."],
    lede:
      "T R Constructions executes structure, block work, finishes, interiors and water-tank works for developers, institutions and homeowners — from Bengaluru, across Karnataka and Andhra Pradesh.",
    primaryCta: { label: "View projects", href: "/projects" },
    secondaryCta: { label: "Request a site visit", href: "/contact#enquiry" },
    image: {
      src: img("kptcl-substation-kodigenahalli", "01-foundation-concrete-pour"),
      alt: "Transit mixer pouring concrete into a footing excavation on a T R Constructions site.",
      focal: { x: 64, y: 52 },
      focalMobile: { x: 68, y: 58 },
      caption: "Foundation pour — KPTCL Sub-station Office, Kodigenahalli",
      projectSlug: "kptcl-substation-kodigenahalli",
    },
    titleBlock: [
      { label: "Firm", value: "T R Constructions" },
      { label: "Base", value: "Devasandra, Bengaluru" },
      { label: "Work", value: "Ground to finish" },
    ],
  },

  ground: {
    statement:
      "Our work is the part you can stand on: footings and frames, block walls and plaster, granite floors, partitions and joinery.",
    note: "We execute it on site — as a contractor, as a labour contractor or with a partner firm — and every project on this site says which.",
  },

  sequence: {
    title: "From ground to finish",
    intro: "Four stages of a building, told through our own sites.",
    stages: [
      {
        id: "ground",
        number: "01",
        stage: "Ground",
        title: "Excavation and footings",
        text: "Every structure starts below ground level: excavation, levelling concrete, footing reinforcement and the first concrete pours.",
        works: ["Excavation", "Levelling concrete", "Footing reinforcement", "Foundation concrete"],
        images: [
          {
            src: img("kptcl-substation-kodigenahalli", "04-footing-reinforcement"),
            alt: "Footing reinforcement mesh and column bars inside an excavated pit.",
            projectSlug: "kptcl-substation-kodigenahalli",
          },
          {
            src: img("stp-flamingo-properties", "01-excavation-and-formwork"),
            alt: "Deep excavation with formwork and reinforcement for treatment tanks.",
            projectSlug: "stp-flamingo-properties",
          },
        ],
        projectSlugs: ["kptcl-substation-kodigenahalli", "stp-flamingo-properties"],
      },
      {
        id: "structure",
        number: "02",
        stage: "Structure",
        title: "Columns, beams and slabs",
        text: "The frame goes up: column cages, formwork and slab concreting, level by level.",
        works: ["Column reinforcement", "Formwork", "Slab concreting"],
        images: [
          {
            src: img("hal-staff-villas", "02-slab-concreting"),
            alt: "Workers levelling freshly poured concrete on a roof slab.",
            projectSlug: "hal-staff-villas",
          },
          {
            src: img("hal-staff-villas", "03-lower-level-formwork"),
            alt: "Formwork and block walls at the lower level of a villa.",
            projectSlug: "hal-staff-villas",
          },
        ],
        projectSlugs: ["hal-staff-villas"],
      },
      {
        id: "walls",
        number: "03",
        stage: "Walls",
        title: "Block work and plastering",
        text: "Walls close in the frame — block masonry floor by floor, then plaster.",
        works: ["Block work", "Openings and lintels", "Plastering"],
        images: [
          {
            src: img("sri-sai-vidya-mandir-school", "04-blockwork-in-progress"),
            alt: "Masons laying concrete blocks on a wall at roof level.",
            projectSlug: "sri-sai-vidya-mandir-school",
          },
          {
            src: img("k-raheja-marriott-hotel-bengaluru", "01-corridor-blockwork"),
            alt: "Long corridor with fresh block walls on both sides.",
            projectSlug: "k-raheja-marriott-hotel-bengaluru",
          },
        ],
        projectSlugs: ["sri-sai-vidya-mandir-school", "k-raheja-marriott-hotel-bengaluru"],
      },
      {
        id: "finish",
        number: "04",
        stage: "Finish",
        title: "Flooring, partitions and interiors",
        text: "The surfaces people use every day: granite floors, glazed partitions, ceilings and joinery.",
        works: ["Granite flooring", "Partitions and glazing", "Ceilings", "Carpentry"],
        images: [
          {
            src: img("bmrcl-starworth-reality", "01-granite-flooring-detail"),
            alt: "Granite flooring with a black inlay and yellow tactile paving.",
            projectSlug: "bmrcl-starworth-reality",
          },
          {
            src: img("garden-city-office-hebbal-infra", "03-glass-partition"),
            alt: "Glazed partitions and a glass door in a finished office.",
            projectSlug: "garden-city-office-hebbal-infra",
          },
        ],
        projectSlugs: ["bmrcl-starworth-reality", "garden-city-office-hebbal-infra"],
      },
    ] satisfies SequenceStage[],
  },

  services: {
    title: "What we build",
    intro: "The work we take on, with the projects that show it.",
  },

  water: {
    title: "Sump & overhead tanks",
    qualifier: "Current work",
    text: "Four sump and overhead tank projects are under execution, in Hindupur, Devanahalli, Bagepalle and Vijayawada. Site photographs will be added here as the work progresses.",
    steps: [
      { id: "excavate", title: "Excavate", text: "The sump sits below ground level, so the work starts with excavation." },
      { id: "sump", title: "Sump", text: "A base slab and walls form the underground tank that holds the water." },
      { id: "staging", title: "Staging", text: "Columns and bracing rise to carry the overhead tank." },
      { id: "riser", title: "Rising main", text: "A pipe carries water from the sump pump up to the tank." },
      { id: "tank", title: "Overhead tank", text: "The raised tank stores water and supplies it by gravity." },
    ],
    related: {
      title: "Related completed work",
      projectSlug: "stp-flamingo-properties",
    },
    cta: { label: "Sump & OHT construction", href: "/services/sump-oht-construction" },
  },

  gallery: {
    title: "Selected projects",
    intro: "Photographs from the company portfolio. Every project states its status and our scope.",
    cta: { label: "Open the project register", href: "/projects" },
  },

  company: {
    title: "A proprietor‑led contractor",
    text: [
      "T R Constructions is a proprietorship run by Tulsi Ram Narayan Reddy from Devasandra, New BEL Road, Bengaluru.",
      "Registered for GST and as a micro enterprise under Udyam in April 2021, the firm works as a contractor, as a labour contractor and in partnership with other firms.",
    ],
    cta: { label: "About the company", href: "/about" },
  },

  cta: {
    title: "Have a site to discuss?",
    text: "Tell us where it is and what needs building. We will get back to you to arrange a site visit.",
    primary: { label: "Request a site visit", href: "/contact#enquiry" },
  },
};

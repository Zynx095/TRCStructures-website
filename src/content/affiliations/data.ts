import type { Affiliation } from "../types";

/**
 * ORGANISATIONS NAMED OR SHOWN IN THE COMPANY PORTFOLIO
 *
 * None of these relationships has been independently verified, and no permission to
 * display names or logos has been given. Everything is `approved: false`, so nothing
 * renders. To publish one: confirm the relationship and permission with the client,
 * copy the logo from assets-source/affiliations/ to /public/images/affiliations/,
 * set `logo`, `relationship`, and `approved: true`.
 */
export const affiliations: Affiliation[] = [
  { name: "KPTCL", relationship: "Projects named in portfolio: sub-station office, retaining wall", projectSlugs: ["kptcl-substation-kodigenahalli", "kptcl-retaining-wall"], approved: false, visible: true },
  { name: "Sri Sai Vidya Mandir", relationship: "School building — labour contract (portfolio)", projectSlugs: ["sri-sai-vidya-mandir-school"], approved: false, visible: true, note: "Logo in portfolio: assets-source/affiliations/sri-sai-vidya-mandir.jpeg" },
  { name: "Maa Bhoomi Developers", relationship: "Green City layout — labour contract (portfolio)", projectSlugs: ["maa-bhoomi-green-city-layout"], approved: false, visible: true, note: "assets-source/affiliations/maa-bhoomi-developers.jpeg" },
  { name: "Flamingo Properties", relationship: "STP — labour (portfolio)", projectSlugs: ["stp-flamingo-properties"], approved: false, visible: true, note: "assets-source/affiliations/flamingo-properties.png" },
  { name: "Sudheeksha Groups", relationship: "Office civil and electrical works (portfolio)", projectSlugs: ["sudheeksha-groups-office"], approved: false, visible: true, note: "Logo spells 'Sudeeksha'; project page spells 'Sudheeksha' — confirm. assets-source/affiliations/sudheeksha.png" },
  { name: "K Raheja Corp", relationship: "Hotel project executed in partnership in the name of SR Key Stones (portfolio)", projectSlugs: ["k-raheja-marriott-hotel-bengaluru"], approved: false, visible: true, note: "No public record links T R Constructions to this project." },
  { name: "Indian Institute of Science (IISc)", approved: false, visible: true, note: "Logo only — no project documented." },
  { name: "ISRO", approved: false, visible: true, note: "Logo only — no project documented." },
  { name: "Airtel", approved: false, visible: true, note: "Logo only — no project documented." },
  { name: "Voltas / Voltas Beko", approved: false, visible: true, note: "Logo only — no project documented." },
  { name: "DoubleTree by Hilton", approved: false, visible: true, note: "Logo only — no project documented." },
  { name: "KBR Infratech", approved: false, visible: true, note: "Logo only — no project documented." },
  { name: "Rajmahal Vilas II Welfare Society (RMV Club)", approved: false, visible: true, note: "Logo only — no project documented." },
  { name: "Mantri Webcity", approved: false, visible: true, note: "Logo only — no project documented." },
  { name: "SJR", approved: false, visible: true, note: "Logo only — no project documented." },
  { name: "Adarsh Group", approved: false, visible: true, note: "Logo only — no project documented." },
];

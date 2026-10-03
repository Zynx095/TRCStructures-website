import type { Affiliation } from "../types";
import { affiliations } from "./data";

/** Only entries the client has approved AND that are switched on are ever rendered. */
export function getPublishedAffiliations(): Affiliation[] {
  return affiliations.filter((a) => a.approved && a.visible);
}

export { affiliations };

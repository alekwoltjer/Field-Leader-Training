import type { IsoDate } from "./types";

export const ORG = {
  company: "Ironline Builders",
  programName: "Field Leader Training",
  programEmail: "fieldtraining@ironlinebuilders.com",
  repository: {
    system: "Ironline SharePoint",
    site: "Operations",
    library: "Field Leadership Training",
  },
} as const;

/** Monday of the current program week. Fixed so the demo is deterministic. */
export const CURRENT_WEEK: IsoDate = "2026-10-12";

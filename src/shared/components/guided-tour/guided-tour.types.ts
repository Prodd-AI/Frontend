import type { Step } from "react-joyride";

export type TourId = "team-member" | "team-lead" | "hr";

/**
 * Per-step routing data. Mirrors the canonical react-joyride multi-route
 * pattern: `data.next` is where the *next* step lives, `data.previous` is
 * where the previous one lives. The host component navigates on STEP_AFTER
 * based on the user's action.
 */
export interface TourStepData {
  next?: string;
  previous?: string;
}

export interface TourStep extends Omit<Step, "data"> {
  data?: TourStepData;
}

export type { Step };

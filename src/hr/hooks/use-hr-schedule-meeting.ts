import { createContext, useContext } from "react";
import type { FlightRiskInfo } from "@/hr/typings/flight-risk-card";

export interface HrScheduleMeetingContextValue {
  open: (person?: FlightRiskInfo | null) => void;
  close: () => void;
}

export const HrScheduleMeetingContext = createContext<
  HrScheduleMeetingContextValue | undefined
>(undefined);

export function useHrScheduleMeeting(): HrScheduleMeetingContextValue {
  const ctx = useContext(HrScheduleMeetingContext);
  if (!ctx)
    throw new Error(
      "useHrScheduleMeeting must be used inside HrScheduleMeetingProvider",
    );
  return ctx;
}

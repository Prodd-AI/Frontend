declare module "@/shared/typings/meeting-card" {
  export type MeetingStatus = "starting_soon" | "live" | "scheduled";

  export interface MeetingInfo {
    id: string;
    title: string;
    subtitle?: string; // e.g., team name or context
    start_in_minutes?: number; // for relative label like "in 20 minutes"
    participants_count?: number;
    status: MeetingStatus;
  }

  export interface MeetingActions {
    on_join?: (id: string) => void;
    on_open_more?: (id: string) => void;
  }

  export type MeetingCardProps = {
    meeting: MeetingInfo;
    actions?: MeetingActions;
    className?: string;
  };
}

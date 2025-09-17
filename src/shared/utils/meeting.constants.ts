import type { MeetingInfo } from "../typings/meeting-card.d";

export const sample_meetings: MeetingInfo[] = [
  {
    id: "mtg-sprint-planning",
    title: "Sprint Planning",
    subtitle: "Upcoming Meeting/Call",
    start_in_minutes: 20,
    participants_count: 3,
    status: "starting_soon",
  },
  {
    id: "mtg-design-review",
    title: "Design Review",
    subtitle: "Upcoming Meeting/Call",
    start_in_minutes: 85,
    participants_count: 5,
    status: "scheduled",
  },
];

export const badge_by_status: Record<MeetingInfo["status"], string> = {
  starting_soon: "bg-warning-color/20 text-warning-color",
  live: "bg-success-color/20 text-success-color",
  scheduled: "bg-muted text-foreground/70",
};

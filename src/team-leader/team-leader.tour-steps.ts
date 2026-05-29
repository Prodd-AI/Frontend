import type { TourStep } from "@/shared/components/guided-tour";

const HOME = "/dash/team-lead";
const VIEW_TEAM = "/dash/team-lead/view-team";
const FOCUS = "/dash/team-lead/todays-focus";

export const teamLeaderTourSteps: TourStep[] = [
  {
    target: "body",
    placement: "center",
    title: "Welcome, team lead",
    content:
      "Quick 60-second tour of how the dashboard is laid out — both your personal workspace and the team-pulse views. You can replay it any time from the header. Hit Next to begin.",
    data: { next: HOME },
  },
  {
    target: '[data-tour="sidebar-nav"]',
    placement: "right",
    title: "Your navigation",
    content:
      "Overview is your home, Today's Focus is your personal task list for today, Tasks is the full backlog, Timesheet tracks hours, Recent Mood shows your check-in history, and My Team is where you go to see how the people you lead are doing.",
    data: { previous: HOME, next: HOME },
  },
  {
    target: '[data-tour="mood-trends"]',
    placement: "right",
    title: "Your daily check-in",
    content:
      "Lead by example: log your own mood here. It feeds into the org-wide trend your HR partner sees, and it's a useful baseline for noticing patterns in your own week.",
    data: { previous: HOME, next: HOME },
  },
  {
    target: '[data-tour="upcoming-schedule"]',
    placement: "top",
    title: "Today's schedule",
    content:
      "Your meetings and team check-ins for today, all in one strip. Click any entry to jump straight into the meeting view — useful for back-to-back days where the calendar app feels like too much overhead.",
    data: { previous: HOME, next: VIEW_TEAM },
  },
  {
    target: '[data-tour="page-header"]',
    placement: "bottom-start",
    title: "Your team's view",
    content:
      "Manage the people you lead from here: pick a team if you lead more than one, see member-by-member task completion and streaks, and flag anyone showing burnout signals. Click a row to drill in to that person's full picture.",
    data: { previous: HOME, next: FOCUS },
  },
  {
    target: '[data-tour="page-header"]',
    placement: "bottom-start",
    title: "Today's Focus",
    content:
      "Your personal prioritized task list for the day. Use this when you want to block out team management and just ship your own work. That's the tour — you're all set!",
    data: { previous: VIEW_TEAM },
  },
];

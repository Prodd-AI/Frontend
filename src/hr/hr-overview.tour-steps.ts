import type { TourStep } from "@/shared/components/guided-tour";

const HOME = "/dash/hr";
const MOOD = "/dash/hr/mood";
const ANALYSIS = "/dash/hr/team-analysis";

export const hrOverviewTourSteps: TourStep[] = [
  {
    target: "body",
    placement: "center",
    title: "Welcome to HR Analytics",
    content:
      "A quick walkthrough of the HR workspace — both this overview page and the deeper analysis views in the sidebar. Roughly 60 seconds. You can replay it any time from the header. Hit Next to begin.",
    data: { next: HOME },
  },
  {
    target: '[data-tour="sidebar-nav"]',
    placement: "right",
    title: "Your navigation",
    content:
      "Overview is your strategic snapshot. Mood Heatmap shows wellbeing patterns across the org. Team Analysis breaks down each team's metrics. Flight Risks highlights people at risk of leaving. Teams gives you per-team drill-downs.",
    data: { previous: HOME, next: HOME },
  },
  {
    target: '[data-tour="status-cards"]',
    placement: "bottom",
    title: "Organisation snapshot",
    content:
      "Live counters for total employees, weekly check-in participation, average mood (out of 5), and teams currently flagged as flight risks. These refresh as new check-ins come in — no need to reload.",
    data: { previous: HOME, next: HOME },
  },
  {
    target: '[data-tour="burnout-alerts"]',
    placement: "right",
    title: "Burnout alerts",
    content:
      "Teams currently flagged as 'at risk' or 'flagged' based on mood trends, missed check-ins, and workload. Click into a team from the chart or the list below to investigate before it becomes a retention problem.",
    data: { previous: HOME, next: MOOD },
  },
  {
    target: '[data-tour="page-header"]',
    placement: "bottom-start",
    title: "Mood Heatmap",
    content:
      "Visualises wellbeing across the org over time — rows are teams, columns are time periods, colour intensity shows mood score. Hot spots tell you where to dig in; cool stretches across multiple weeks are a stronger signal than a single bad day.",
    data: { previous: HOME, next: ANALYSIS },
  },
  {
    target: '[data-tour="page-header"]',
    placement: "bottom-start",
    title: "Team Analysis",
    content:
      "Every team in one comparable view: activity, morale, participation, and a breakdown by department. Useful for board-prep, headcount discussions, or spotting which teams are quietly thriving (or struggling). That's the tour — happy analysing!",
    data: { previous: MOOD },
  },
];

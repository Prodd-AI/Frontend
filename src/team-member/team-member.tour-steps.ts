import type { TourStep } from "@/shared/components/guided-tour";

const HOME = "/dash/team-member";
const FOCUS = "/dash/team-member/todays-focus";
const TASKS = "/dash/team-member/tasks";

export const teamMemberTourSteps: TourStep[] = [
  {
    target: "body",
    placement: "center",
    title: "Welcome to Prodily",
    content:
      "Quick 60-second tour of where everything lives. You can replay it any time from the 'Take a tour' button in the header. Hit Next to begin, or Skip if you'd rather explore on your own.",
    data: { next: HOME },
  },
  {
    target: '[data-tour="sidebar-nav"]',
    placement: "right",
    title: "Your navigation",
    content:
      "Everything you do day-to-day lives here: Overview is your home base, Today's Focus shows what's due today, Tasks is your full backlog, Timesheet logs your hours, and Recent Mood is your check-in history. We'll visit a few of these next.",
    data: { previous: HOME, next: HOME },
  },
  {
    target: '[data-tour="mood-trends"]',
    placement: "right",
    title: "Your daily mood check-in",
    content:
      "Drop a quick mood reading and a one-line note about how your day is going. It only takes a few seconds — and it powers the trends you (and your team lead) see later. No one sees individual entries unless you let them.",
    data: { previous: HOME, next: HOME },
  },
  {
    target: '[data-tour="weekly-streak"]',
    placement: "left",
    title: "Your weekly streak",
    content:
      "Tracks how many days in a row you've checked in and completed at least one task. Streaks are a nudge, not a scoreboard — missing a day won't penalize you, but momentum tends to build on itself.",
    data: { previous: HOME, next: FOCUS },
  },
  {
    target: '[data-tour="page-header"]',
    placement: "bottom-start",
    title: "Today's Focus",
    content:
      "When you want a focused, prioritized view of just today's work — without the rest of the week's noise — this is the page. Tasks are ordered by priority and due time so the most urgent thing is always at the top.",
    data: { previous: HOME, next: TASKS },
  },
  {
    target: '[data-tour="page-header"]',
    placement: "bottom-start",
    title: "All your tasks",
    content:
      "Your full backlog lives here. Filter by week or status, jump into any task for details, comments, and time tracking. That's the tour — you're all set. Happy working!",
    data: { previous: FOCUS },
  },
];

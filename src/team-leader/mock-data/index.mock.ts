import { TaskPriority, TaskStatus } from "@/shared/typings/task-card";

// Personal Tasks Data
export const personalTasksData = [
  {
    id: 1,
    title: "Complete project documentation",
    priority: "high" as TaskPriority,
    status: "pending" as TaskStatus,
    dueDateTime: "2025-08-30 05:00 PM",
    assignee: "John Doe",
    createdDateTime: "2025-08-25 09:00 AM",
  },
  {
    id: 2,
    title: "Review pull request",
    priority: "medium" as TaskPriority,
    status: "completed" as TaskStatus,
    dueDateTime: "2025-08-29 03:00 PM",
    assignee: "Jane Smith",
    createdDateTime: "2025-08-28 10:30 AM",
  },
  {
    id: 3,
    title: "Update design assets",
    priority: "low" as TaskPriority,
    status: "pending" as TaskStatus,
    dueDateTime: "2025-09-01 12:00 PM",
    assignee: "Alex Johnson",
    createdDateTime: "2025-08-27 02:00 PM",
  },
];

// Team Tasks Data (using same data for now)
export const teamTasksData = [...personalTasksData];

// Upcoming Meetings Data
export const upcomingMeetingsData = [
  {
    title: "1:1 with Alex Chen",
    description: "Performance review discussion",
    time: "2:00 PM - 2:30 PM",
    badge: "Tomorrow",
  },
  {
    title: "Team Sync - Engineering",
    description: "Weekly sprint planning and blockers",
    time: "10:00 AM - 11:00 AM",
    badge: "In 2 days",
  },
  {
    title: "1:1 with Sarah Kim",
    description: "Career growth discussion",
    time: "3:00 PM - 3:30 PM",
    badge: "Today",
  },
];

// Progress Reviews Data
export const progressReviewsData = [
  {
    name: "Alex Chen",
    weekLabel: "Week of January 8",
    completedTasks: 4,
    totalTasks: 5,
    description:
      "Completed 4/5 assigned tasks. Performance review prep in progress.",
    status: "pending" as const,
    tasks: [
      { id: "1", title: "Prepare presentation", status: "Completed" as const },
      { id: "2", title: "Submit report", status: "Completed" as const },
      { id: "3", title: "Update documentation", status: "Completed" as const },
      { id: "4", title: "Attend team meeting", status: "Completed" as const },
      { id: "5", title: "Attend team meeting", status: "Pending" as const },
    ],
  },
  {
    name: "Sarah Kim",
    weekLabel: "Week of January 8",
    completedTasks: 10,
    totalTasks: 10,
    description: "Finished UI redesign and documentation",
    status: "approved" as const,
    tasks: [
      {
        id: "1",
        title: "Design homepage mockup",
        status: "Completed" as const,
      },
      {
        id: "2",
        title: "Create component library",
        status: "Completed" as const,
      },
      { id: "3", title: "Review design specs", status: "Completed" as const },
      { id: "4", title: "Update style guide", status: "Completed" as const },
      {
        id: "5",
        title: "Finalize color palette",
        status: "Completed" as const,
      },
      { id: "6", title: "Create icon set", status: "Completed" as const },
      { id: "7", title: "Design mobile layouts", status: "Completed" as const },
      {
        id: "8",
        title: "Prepare design handoff",
        status: "Completed" as const,
      },
      {
        id: "9",
        title: "Document design patterns",
        status: "Completed" as const,
      },
      { id: "10", title: "Team presentation", status: "Completed" as const },
    ],
  },
  {
    name: "Mike Johnson",
    weekLabel: "Week of January 8",
    completedTasks: 5,
    totalTasks: 10,
    description: "Backend refactoring in progress",
    status: "changes-requested" as const,
    tasks: [
      {
        id: "1",
        title: "Refactor database queries",
        status: "Completed" as const,
      },
      { id: "2", title: "Update API endpoints", status: "Completed" as const },
      { id: "3", title: "Write unit tests", status: "Completed" as const },
      { id: "4", title: "Code review", status: "Completed" as const },
      { id: "5", title: "Update documentation", status: "Completed" as const },
      {
        id: "6",
        title: "Performance optimization",
        status: "Pending" as const,
      },
      { id: "7", title: "Security audit", status: "Pending" as const },
      { id: "8", title: "Deploy to staging", status: "Pending" as const },
      { id: "9", title: "Integration testing", status: "Pending" as const },
      { id: "10", title: "Release notes", status: "Pending" as const },
    ],
  },
];

// Weekly Streak Days Data
export const weeklyStreakDaysData = [
  { day: 1, status: "completed" as const, tasksCompleted: 2, totalTasks: 2 },
  { day: 2, status: "completed" as const, tasksCompleted: 2, totalTasks: 2 },
  { day: 3, status: "completed" as const, tasksCompleted: 2, totalTasks: 2 },
  { day: 4, status: "completed" as const, tasksCompleted: 2, totalTasks: 2 },
  { day: 5, status: "completed" as const, tasksCompleted: 2, totalTasks: 2 },
  { day: 6, status: "completed" as const, tasksCompleted: 2, totalTasks: 2 },
  { day: 7, status: "completed" as const, tasksCompleted: 2, totalTasks: 2 },
];

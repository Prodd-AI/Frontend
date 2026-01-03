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
    weekLabel: "Week 1",
    completedTasks: 8,
    totalTasks: 10,
    description: "Completed API integration and unit tests",
    status: "pending" as const,
  },
  {
    name: "Sarah Kim",
    weekLabel: "Week 1",
    completedTasks: 10,
    totalTasks: 10,
    description: "Finished UI redesign and documentation",
    status: "approved" as const,
  },
  {
    name: "Mike Johnson",
    weekLabel: "Week 1",
    completedTasks: 5,
    totalTasks: 10,
    description: "Backend refactoring in progress",
    status: "changes-requested" as const,
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

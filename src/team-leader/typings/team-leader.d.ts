import { TaskPriority, TaskStatus } from "@/shared/typings/task-card";
import { ComponentType } from "react";

declare module "@/team-leader/typings/team-leader" {
  // Task data interface
  export interface TaskData {
    id: number;
    title: string;
    priority: TaskPriority;
    status: TaskStatus;
    dueDateTime: string;
    assignee: string;
    createdDateTime: string;
  }

  // Meeting data interface
  export interface MeetingData {
    title: string;
    description: string;
    time: string;
    badge: string;
  }

  // Review data interface
  export interface ReviewData {
    name: string;
    weekLabel: string;
    completedTasks: number;
    totalTasks: number;
    description: string;
    status: "pending" | "approved" | "changes-requested";
  }

  // Weekly streak day interface
  export interface WeeklyStreakDay {
    day: number;
    status: "completed" | "incomplete" | "current";
    tasksCompleted: number;
    totalTasks: number;
  }

  // Tab content component props
  export interface TasksTabContentProps {
    tasks: TaskData[];
    title?: string;
    description?: string;
    AssignButton?: ComponentType;
    showHeader?: boolean;
  }

  export interface MeetingsTabContentProps {
    meetings: MeetingData[];
    onScheduleMeeting?: () => void;
  }

  export interface ReviewsTabContentProps {
    reviews: ReviewData[];
  }

  // Section component props
  export interface PersonalDashboardSectionProps {
    className?: string;
  }

  export interface TeamDashboardSectionProps {
    className?: string;
  }

  export interface PersonalTabsSectionProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    onViewTeamDashboard: () => void;
  }

  export interface TeamTabsSectionProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    onViewPersonalDashboard: () => void;
  }
}

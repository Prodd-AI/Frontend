import { TaskPriority, TaskStatus } from "@/shared/typings/task-card";
import { UseQueryResult } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
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
    meeting_link: string;
  }

  // Review data interface
  export interface ReviewData {
    name: string;
    weekLabel: string;
    completedTasks: number;
    totalTasks: number;
    description: string;
    status: "pending" | "approved" | "changes-requested";
    tasks?: {
      id: string;
      title: string;
      status: "Completed" | "Pending";
    }[];
  }

  // Team Member interface
  export interface TeamMember {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
  }

  // Common Task interface
  export interface Task {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    title: string;
    external_link: string;
    description: string;
    status: TaskStatus;
    created_by_id: string;
    due_date: string;
    priority: TaskPriority;
  }

  // Assigned Task data interface
  export interface AssignedTask {
    user_task_id: string;
    assigned_at: string;
    user: TeamMember;
    task: Task;
  }

  export interface CreateTaskDto {
    title: string;
    external_link: string;
    description: string;
    assigned_to: string[];
    due_date: string;
    priority: TaskPriority;
  }

  export interface UpdateTaskDto extends Partial<
    Omit<CreateTaskDto, "assigned_to">
  > {
    status?: TaskStatus;
    assigned_to?: string[];
  }

  export interface WeeklyStreakDay {
    day: number;
    status: "completed" | "incomplete" | "current";
    tasksCompleted: number;
    totalTasks: number;
  }

  export interface TasksTabContentProps<T> {
    columns: ColumnDef<T>[];
    assignedTasks: T[];
    isLoading?: boolean;
    title?: string;
    description?: string;
    AssignButton?: ComponentType;
    showHeader?: boolean;
    showAssignButton?: boolean;
  }

  export interface MeetingsTabContentProps {
    meetings: MeetingData[];
    isLoading?: boolean;
    pagination?: {
      currentPage: number;
      totalPages: number;
      onPageChange: (page: number) => void;
    };
    filter?: {
      status: "scheduled" | "cancelled" | "completed";
      onStatusChange: (status: "scheduled" | "cancelled" | "completed") => void;
    };
    onScheduleMeeting?: () => void;
  }

  export interface ReviewsTabContentProps {
    reviews: ReviewData[];
  }

  export interface PersonalDashboardSectionProps {
    className?: string;
    weekTasksQuery: UseQueryResult<GeneralReturnInt<WeekTasksResponse>, Error>;
    averageMoodQuery: UseQueryResult<
      GeneralReturnInt<{
        average_mood: number;
        mood_scores: {
          user_id: string;
          mood_score: number;
          description: string;
        }[];
      }>,
      Error
    >;
  }

  export interface TeamDashboardSectionProps {
    className?: string;
  }

  export interface PersonalTabsSectionProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    onViewTeamDashboard?: () => void;
    averageMoodQuery?: UseQueryResult<
      GeneralReturnInt<{
        average_mood: number;
        mood_scores: {
          user_id: string;
          mood_score: number;
          description: string;
          created_at: string;
        }[];
      }>,
      Error
    >;
    showAssignButton?: boolean;
    weekTasksQuery: UseQueryResult<GeneralReturnInt<WeekTasksResponse>, Error>;
  }

  export interface TeamTabsSectionProps {
    activeTab: string;
    onTabChange?: (tab: string) => void;
    onViewPersonalDashboard?: () => void;
  }
  // Team interfaces
  export interface Team {
    id: string;
    name: string;
    description?: string;
    size?: string;
    created_at?: string;
    created_by_id?: string;
    deleted_at?: string;
    organization_id: string;
    updated_at: string;
  }

  export interface CreateTeamData {
    name: string;
    description: string;
    size: string;
  }

  export interface BulkAddTeamMembersData {
    members: Array<{
      email: string;
      first_name: string;
      last_name: string;
      user_role: string;
      team_id: string;
    }>;
  }

  export interface SingleTeamAnalysisMetrics {
    team_id: string;
    team_name: string;
    lead_name: string;
    team_size: number;
    morale_score: number;
    at_risk_members: number;
    active_count: number;
    participation_rate: number;
    team_members_details: Array<{
      member_id: string;
      member_name: string;
      job_title?: string;
      email: string;
      avatar_url?: string;
      task_completion: number; // percentage
      total_task: number;
      completed_task: number;
      week_streak: number;
      last_active: string;
      flight_risk_indicator: "at risk" | "stable";
    }>;
  }
}

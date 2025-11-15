declare module "@/team-leader/typings/task-review" {
  export type ReviewStatus = "pending" | "approved" | "changes_requested";

  export interface TaskReviewItem {
    id: string;
    member_name: string;
    week_label: string; // e.g. "Week of January 8"
    completed_tasks: number; // e.g. 4
    total_tasks: number; // e.g. 5
    summary: string; // short description line
    status: ReviewStatus;
  }

  export interface TaskReviewActions {
    on_approve?: (id: string) => void;
    on_request_changes?: (id: string) => void;
    on_open_details?: (id: string) => void;
  }

  export type TaskReviewProps = {
    item: TaskReviewItem;
    actions?: TaskReviewActions;
    className?: string;
  };
}

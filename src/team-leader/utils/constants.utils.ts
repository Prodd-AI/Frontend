import { TaskReviewItem } from "@/team-leader/typings/task-review";

export const sample_task_reviews: TaskReviewItem[] = [
  {
    id: "alex-jan-8",
    member_name: "Alex Chan",
    week_label: "Week of January 8",
    completed_tasks: 4,
    total_tasks: 5,
    summary:
      "Completed 4/5 assigned tasks. Performance review prep in progress.",
    status: "pending",
  },
  {
    id: "sarah-jan-8",
    member_name: "Sarah Kim",
    week_label: "Week of Jan 8",
    completed_tasks: 4,
    total_tasks: 5,
    summary: "All tasks completed on time. Documentation updates look great.",
    status: "approved",
  },
];

export const status_styles: Record<TaskReviewItem["status"], string> = {
  pending: "bg-warning-color/20 text-warning-color",
  approved: "bg-success-color/20 text-success-color",
  changes_requested: "bg-rose-100 text-rose-800",
};

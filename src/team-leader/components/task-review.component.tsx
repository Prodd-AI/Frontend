import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IoChevronForward } from "react-icons/io5";
import { status_styles } from "../utils/constants.utils";
import { TaskReviewProps } from "@/team-leader/typings/task-review";

function TaskReviewComponent({ item, actions, className }: TaskReviewProps) {
  const progress = Math.round((item.completed_tasks / item.total_tasks) * 100);
  const is_pending = item.status === "pending";
  const is_approved = item.status === "approved";

  return (
    <div
      className={cn(
        "rounded-xl p-4 flex flex-col gap-4 bg-[#F3F4F6]",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 flex-col">
          <p className="text-sm font-semibold text-foreground truncate">
            {item.member_name} - {item.week_label}
          </p>
        </div>
        <span
          className={cn(
            "text-xs px-3 py-1 rounded-full whitespace-nowrap font-semibold cursor-default",
            status_styles[item.status]
          )}
        >
          {item.status === "pending" && "Pending Review"}
          {item.status === "approved" && "Approved"}
          {item.status === "changes_requested" && "Changes Requested"}
        </span>
      </div>

      <div className="">
        <div className="h-2 rounded-full bg-[#EAEBEB] relative">
          <div
            className="absolute left-0 top-0 h-2 rounded-full bg-success-color"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">{item.summary}</p>
        <span className="text-xs text-muted-foreground">
          {item.completed_tasks}/{item.total_tasks} - {progress}%
        </span>
      </div>

      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          {is_pending && (
            <>
              <Button
                className="!bg-success-color hover:bg-success-color/90 cursor-pointer h-[32px]"
                onClick={() => actions?.on_approve?.(item.id)}
              >
                Approve
              </Button>
              <Button
                variant="destructive"
                className="!bg-danger-color hover:bg-danger-color/90 cursor-pointer h-[32px]"
                onClick={() => actions?.on_request_changes?.(item.id)}
              >
                Request Changes
              </Button>
            </>
          )}
          {is_approved && (
            <span className="text-xs px-2.5 py-1 rounded-md bg-[#6B72801C] text-[#6B7280] font-semibold cursor-default">
              Reviewed
            </span>
          )}
        </div>

        <button
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
          onClick={() => actions?.on_open_details?.(item.id)}
          aria-label="Open details"
        >
          <IoChevronForward />
        </button>
      </div>
    </div>
  );
}

export default TaskReviewComponent;

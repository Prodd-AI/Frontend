import { IoCalendarOutline } from "react-icons/io5";
import {
  memo,
  useMemo,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import type { IconType } from "react-icons/lib";
import { FaRegUser, FaRegClock } from "react-icons/fa";
import { FaExternalLinkAlt } from "react-icons/fa";
import clsx from "clsx";
import {
  TaskCardRef,
  TaskCardPropsInt,
  TaskStatus,
} from "@/shared/typings/task-card";

const priorityStyles = {
  high: "bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-200/80 shadow-red-100/50",
  medium:
    "bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border-amber-200/80 shadow-amber-100/50",
  low: "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200/80 shadow-emerald-100/50",
};

const statusStyles = {
  completed:
    "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200/80 shadow-emerald-100/50",
  pending:
    "bg-gradient-to-r from-slate-50 to-slate-100 text-slate-600 border-slate-200/80 shadow-slate-100/50",
  cancelled:
    "bg-gradient-to-r from-rose-50 to-rose-100 text-rose-700 border-rose-200/80 shadow-rose-100/50",
};

const priorityLabels = { high: "High", medium: "Medium", low: "Low" };
const statusLabels = {
  completed: "Completed",
  pending: "Pending",
  cancelled: "Cancelled",
};

const TaskCard = forwardRef<TaskCardRef, TaskCardPropsInt>(
  (
    {
      dueDateTime,
      assignee,
      createdDateTime,
      onStatusChange,
      title,
      subTitle,
      status,
      priority,
      collapsedStyle = false,
      externalLink,
      className,
      isUpdating = false,
      disabled = false,
    },
    ref
  ) => {
    const card_detail: {
      icon: IconType;
      detail: string;
      display: boolean;
    }[] = useMemo(
      () => [
        {
          icon: IoCalendarOutline,
          detail: `Due: ${dueDateTime}`,
          display: true,
        },
        {
          icon: FaRegUser,
          detail: `Assigned to: ${assignee}`,
          display: true,
        },
        {
          icon: FaRegClock,
          detail: `Created: ${createdDateTime}`,
          display: !collapsedStyle,
        },
      ],
      [dueDateTime, createdDateTime, assignee, collapsedStyle]
    );

    const handleStatusToggle = useCallback(() => {
      if (!onStatusChange || disabled || isUpdating) return;
      const newStatus: TaskStatus =
        status === "completed" ? "pending" : "completed";
      onStatusChange(newStatus);
    }, [onStatusChange, status, disabled, isUpdating]);

    const focus = useCallback(() => {
      console.log("Focus called on task card");
    }, []);

    const getTaskData = useCallback(() => {
      return { title, status, priority, assignee };
    }, [title, status, priority, assignee]);

    useImperativeHandle(
      ref,
      () => ({
        focus,
        getTaskData,
      }),
      [focus, getTaskData]
    );

    return (
      <div
        className={clsx(
          "p-7 w-[82.188rem] rounded-2xl transition-all duration-300 ease-in-out",
          "hover:shadow-lg transform hover:scale-[1.01]",
          collapsedStyle
            ? "bg-primary/[0.03] hover:bg-primary/[0.06]"
            : "bg-white h-[17.728rem] hover:shadow-xl",
          className
        )}
        style={{
          boxShadow: collapsedStyle
            ? "none"
            : "0 4px 4px -4px rgba(12,12,13,0.05), 0 16px 16px -8px rgba(12,12,13,0.1)",
        }}
      >
        <div
          className={`flex ${
            collapsedStyle ? "justify-start gap-6" : "justify-between"
          }`}
        >
          <div>
            <h1
              className={clsx(
                "text-lg font-bold transition-colors duration-200",
                collapsedStyle
                  ? "text-foreground hover:text-foreground/80"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {title}
            </h1>
            {subTitle && !collapsedStyle && (
              <h2 className="mt-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground">
                {subTitle}
              </h2>
            )}
          </div>

          <div className="flex gap-2">
            {/* Priority Badge */}
            <span
              className={clsx(
                "inline-flex items-center gap-1.5 rounded-full text-xs font-semibold px-3 py-1.5",
                "border shadow-sm transition-all duration-200 ease-out",
                "hover:scale-105 hover:shadow-md cursor-default",
                priorityStyles[priority]
              )}
            >
              <span
                className={clsx(
                  "w-1.5 h-1.5 rounded-full",
                  priority === "high" && "bg-red-500",
                  priority === "medium" && "bg-amber-500",
                  priority === "low" && "bg-emerald-500"
                )}
              />
              {priorityLabels[priority]}
            </span>

            {/* Status Badge */}
            <span
              className={clsx(
                "inline-flex items-center gap-1.5 rounded-full text-xs font-semibold px-3 py-1.5",
                "border shadow-sm transition-all duration-200 ease-out",
                "hover:scale-105 hover:shadow-md cursor-default",
                statusStyles[status]
              )}
            >
              <span
                className={clsx(
                  "w-1.5 h-1.5 rounded-full",
                  status === "completed" && "bg-emerald-500",
                  status === "pending" && "bg-slate-400",
                  status === "cancelled" && "bg-rose-500"
                )}
              />
              {statusLabels[status]}
            </span>
          </div>
        </div>

        <div
          className={clsx(
            "mt-6 text-muted-foreground flex gap-2 transition-colors duration-200",
            collapsedStyle ? "flex-row" : "flex-col"
          )}
        >
          {card_detail.map((card, index) => (
            <div
              className="flex items-center gap-2 transition-all duration-200 hover:text-foreground"
              key={index}
            >
              {card.display && (
                <>
                  <card.icon className="transition-transform duration-200 hover:scale-110" />
                  <span>{card.detail}</span>
                </>
              )}
            </div>
          ))}
          {externalLink && collapsedStyle && (
            <div className="flex items-center gap-2 text-primary cursor-pointer transition-all duration-200 hover:text-primary/80 hover:scale-105">
              <FaExternalLinkAlt className="transition-transform duration-200" />
              <a
                href={externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                External
              </a>
            </div>
          )}
        </div>

        {!collapsedStyle && (
          <button
            className={clsx(
              "mt-6 px-4 py-2.5 rounded-xl flex gap-2 items-center font-medium text-sm",
              "transition-all duration-200 ease-out",
              "hover:scale-[1.02] hover:shadow-md active:scale-[0.98]",
              disabled || isUpdating
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : status === "completed"
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
            onClick={handleStatusToggle}
            disabled={disabled || isUpdating || !onStatusChange}
          >
            {isUpdating ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <div
                  className={clsx(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                    status === "completed"
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-gray-400"
                  )}
                >
                  {status === "completed" && (
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                {status === "completed" ? "Mark Incomplete" : "Mark Complete"}
              </>
            )}
          </button>
        )}
      </div>
    );
  }
);

TaskCard.displayName = "TaskCard";

export default memo(TaskCard);

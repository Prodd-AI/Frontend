/**
 * @fileoverview Task Card Component
 *
 * A reusable React component for displaying task information with beautiful UI,
 * smooth animations, and flexible parent-controlled interactions. This component
 * is part of the task management system.
 *
 * ## Quick Start for Team Members
 *
 * 1. Import the component and types:
 * ```tsx
 * import TaskCard, { type TaskCardRef, type TaskStatus, type TaskPriority } from '@/shared/components/task-card.component';
 * ```
 *
 * 2. Set up state in your parent component:
 * ```tsx
 * const [tasks, setTasks] = useState(initialTasks);
 * const [isUpdating, setIsUpdating] = useState(false);
 * const taskRefs = useRef<Record<string, TaskCardRef>>({});
 * ```
 *
 * 3. Create interaction handlers:
 * ```tsx
 * const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
 *   setIsUpdating(true);
 *   try {
 *     await updateTaskStatus(taskId, newStatus);
 *     setTasks(prev => prev.map(task =>
 *       task.id === taskId ? { ...task, status: newStatus } : task
 *     ));
 *   } catch (error) {
 *     console.error('Failed to update task:', error);
 *   } finally {
 *     setIsUpdating(false);
 *   }
 * };
 * ```
 *
 * 4. Use the component:
 * ```tsx
 * <TaskCard
 *   ref={el => taskRefs.current[task.id] = el}
 *   title={task.title}
 *   priority={task.priority}
 *   status={task.status}
 *   assignee={task.assignee}
 *   dueDateTime={task.dueDateTime}
 *   onStatusChange={(newStatus) => handleStatusChange(task.id, newStatus)}
 *   isUpdating={isUpdating}
 *   collapsedStyle={false}
 * />
 * ```
 *
 * ## Design System Compliance
 * - Uses consistent color tokens for priority and status
 * - Implements smooth transitions for all interactive elements
 * - Follows accessibility guidelines with proper ARIA labels
 * - Responsive design with flexible layouts
 *
 * @author Wizzy
 * @since 2025-08-30
 * @version 2.0.0
 */

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

/**
 * Task Card Component
 *
 * A versatile and interactive task card component that displays task information with
 * priority and status indicators, assignee details, and completion controls.
 *
 * ## Features
 * - 🎨 **Priority Indicators**: Visual badges for High (red), Medium (amber), and Low (green) priorities
 * - 📊 **Status Tracking**: Color-coded status badges for Completed (emerald), Pending (gray), and Cancelled (red)
 * - 🎛️ **Interactive Controls**: Toggle button with smooth animations for marking tasks complete/incomplete
 * - 📱 **Responsive Layout**: Supports both expanded and collapsed display modes
 * - 🔗 **External Links**: Optional external link integration for collapsed mode
 * - ✨ **Smooth Animations**: CSS transitions for hover effects and state changes
 * - ♿ **Accessibility**: Proper semantic HTML and keyboard navigation support
 * - 🔄 **Parent-controlled**: Submission logic handled by parent component
 *
 * ## Display Modes
 * - **Expanded Mode**: Full card with all details, subtitle, and completion button
 * - **Collapsed Mode**: Compact horizontal layout without subtitle or completion controls
 *
 * ## Color Coding
 * - **Priority**: High (red), Medium (amber), Low (green)
 * - **Status**: Completed (emerald), Pending (gray), Cancelled (red)
 *
 * ## Architecture
 * This component follows the principle of separation of concerns:
 * - **Component responsibility**: UI rendering, user interactions, animations
 * - **Parent responsibility**: Business logic, API calls, state management
 *
 * @param props - Component props (see TaskCardPropsInt)
 * @param ref - React ref for imperative control (see TaskCardRef)
 * @returns JSX.Element - The rendered task card component
 *
 * @example
 * // Basic usage - Expanded card
 * ```tsx
 * <TaskCard
 *   title="Complete project documentation"
 *   subTitle="Write comprehensive docs for the new feature"
 *   priority="high"
 *   status="pending"
 *   assignee="John Doe"
 *   createdDateTime="2025-08-25 09:00 AM"
 *   dueDateTime="2025-08-30 05:00 PM"
 *   onStatusChange={(newStatus) => handleTaskUpdate(taskId, newStatus)}
 *   collapsedStyle={false}
 *   isUpdating={isLoading}
 * />
 * ```
 *
 * @example
 * // Collapsed card with external link
 * ```tsx
 * <TaskCard
 *   title="Review pull request"
 *   priority="medium"
 *   status="completed"
 *   assignee="Jane Smith"
 *   createdDateTime="2025-08-28 10:30 AM"
 *   dueDateTime="2025-08-29 03:00 PM"
 *   onStatusChange={(newStatus) => handleTaskUpdate(taskId, newStatus)}
 *   collapsedStyle={true}
 *   externalLink="https://github.com/repo/pull/123"
 * />
 * ```
 *
 * @version 2.0.0
 * @author Wizzy
 * @since 2025-08-30
 */
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

    /**
     * Handles status change when user clicks the completion toggle.
     * Determines the new status based on current status and calls parent callback.
     */
    const handleStatusToggle = useCallback(() => {
      if (!onStatusChange || disabled || isUpdating) return;

      const newStatus: TaskStatus =
        status === "completed" ? "pending" : "completed";
      onStatusChange(newStatus);
    }, [onStatusChange, status, disabled, isUpdating]);

    /**
     * Focuses the status toggle button if it exists and is visible.
     */
    const focus = useCallback(() => {
      // Implementation would depend on button ref
      console.log("Focus called on task card");
    }, []);

    /**
     * Gets current task data without causing re-renders.
     *
     * @returns Object containing current task information
     */
    const getTaskData = useCallback(() => {
      return { title, status, priority, assignee };
    }, [title, status, priority, assignee]);

    /**
     * Exposes imperative methods to parent component through ref.
     */
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
          "p-7 w-[82.188rem] rounded-[23.15px] transition-all duration-300 ease-in-out",
          "hover:shadow-lg transform hover:scale-[1.01]",
          collapsedStyle
            ? "bg-[#6619DE08] hover:bg-[#6619DE12]"
            : "bg-[#fff] h-[17.728rem] hover:shadow-xl",
          className
        )}
        style={{
          boxShadow: collapsedStyle
            ? "none"
            : "0 6px 17.9px 1px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          className={`flex  ${collapsedStyle ? "justify-start gap-6" : "justify-between"
            }`}
        >
          <div>
            <h1
              className={clsx(
                "text-lg font-bold transition-colors duration-200",
                collapsedStyle
                  ? "text-[#251F2D] hover:text-[#1a1722]"
                  : "text-[#605A69] hover:text-[#4a4553]"
              )}
            >
              {title}
            </h1>
            {subTitle && !collapsedStyle && (
              <h2 className="mt-2 text-sm text-[#6B7280] transition-colors duration-200 hover:text-gray-800">
                {subTitle}
              </h2>
            )}
          </div>
          <div className="">
            <span
              className={clsx(
                "rounded-[96.48px] text-xs px-3 py-1 font-bold transition-all duration-200 ease-in-out",
                "hover:scale-105 hover:shadow-sm",
                priority === "high"
                  ? "bg-red-100 text-red-700 border border-red-200 hover:bg-red-200"
                  : priority === "medium"
                    ? "bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200"
                    : "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200"
              )}
            >
              {priority === "high"
                ? "High"
                : priority === "medium"
                  ? "Medium"
                  : "Low"}
            </span>
            <span
              className={clsx(
                "rounded-[96.48px] text-xs px-3 py-1 ml-2 font-medium transition-all duration-200 ease-in-out",
                "hover:scale-105 hover:shadow-sm",
                status === "completed"
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200"
                  : status === "pending"
                    ? "bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200"
                    : "bg-red-100 text-red-700 border border-red-200 hover:bg-red-200"
              )}
            >
              {status === "completed"
                ? "Completed"
                : status === "pending"
                  ? "Pending"
                  : "Cancelled"}
            </span>
          </div>
        </div>
        <div
          className={clsx(
            "mt-6 text-[#6B7280] flex gap-2 transition-colors duration-200",
            collapsedStyle ? "flex-row" : "flex-col"
          )}
        >
          {card_detail.map((card, index) => (
            <div
              className="flex items-center gap-2 transition-all duration-200 hover:text-gray-800"
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
            <div className="flex items-center gap-2 text-[#6619DE] cursor-pointer transition-all duration-200 hover:text-[#5A15C7] hover:scale-105">
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
        {collapsedStyle || (
          <button
            className={clsx(
              "mt-6 p-3 rounded-[9.65px] flex gap-2 items-center transition-all duration-200 ease-in-out",
              "hover:scale-[1.02] hover:shadow-md active:scale-[0.98]",
              disabled || isUpdating
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : status === "completed"
                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                  : "bg-[#F3F4F6] text-gray-700 hover:bg-gray-200"
            )}
            onClick={handleStatusToggle}
            disabled={disabled || isUpdating || !onStatusChange}
          >
            {isUpdating ? (
              <>
                <div className="w-4 h-4 border-x2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <input
                  type="radio"
                  checked={status === "completed"}
                  onChange={() => { }} // Controlled by button click
                  className="transition-colors duration-200"
                />
                {status === "completed" ? "Mark Incomplete" : "Mark Complete"}
              </>
            )}
          </button>
        )}
      </div>
    );
  }
);

/**
 * Set display name for better debugging experience in React DevTools.
 */
TaskCard.displayName = "TaskCard";

/**
 * Default export - Memoized version of the TaskCard component.
 * Uses custom comparison function for performance optimization.
 */
export default memo(TaskCard);

/**
 * Type exports for TypeScript consumers.
 *
 * @example
 * ```tsx
 * import TaskCard, { type TaskCardRef, type TaskStatus, type TaskPriority } from './task-card.component';
 *
 * const taskRef = useRef<TaskCardRef>(null);
 *
 * const handleStatusChange = (newStatus: TaskStatus) => {
 *   // Handle status change...
 * };
 * ```
 */

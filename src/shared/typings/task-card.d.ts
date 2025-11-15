declare module "@/shared/typings/task-card" {
  import { ClassValue } from "clsx";

  /**
   * Props interface for the TaskCard component.
   */
  export interface TaskCardPropsInt {
    /** Task priority level - affects visual styling and urgency indicators */
    priority: TaskPriority;
    /** Current task status - determines badge color and completion state */
    status: TaskStatus;
    /** Main task title displayed prominently */
    title: string;
    /** Due date and time for the task */
    dueDateTime: string;
    /** Person assigned to complete the task */
    assignee: string;
    /**
     * Display mode: false for expanded view with all details,
     * true for compact horizontal layout
     */
    collapsedStyle: boolean;
    /** Additional CSS classes to apply to the component container */
    className?: ClassValue;
    /**
     * Callback function called when user attempts to change task status.
     * @param newStatus - The new status the user wants to set
     */
    onStatusChange?: (newStatus: TaskStatus) => void;
    /** Optional secondary description text (only shown in expanded mode) */
    subTitle?: string;
    /** Optional task creation timestamp */
    createdDateTime?: string;
    /** Optional external URL (only shown in collapsed mode) */
    externalLink?: string;
    /** Whether a status update is currently in progress (shows loading state) */
    isUpdating?: boolean;
    /** Whether the task interaction is disabled */
    disabled?: boolean;
  }
  /**
   * Ref interface for imperative control of the TaskCard component.
   * Use these methods to programmatically control the component from parent.
   */
  export interface TaskCardRef {
    /** Focuses the status toggle button if visible */
    focus: () => void;
    /** Gets current task data without triggering re-renders */
    getTaskData: () => {
      title: string;
      status: TaskStatus;
      priority: TaskPriority;
      assignee: string;
    };
  }

  /**
   * Available task status options.
   * Represents the current state of a task in the workflow.
   */
  export type TaskStatus = "completed" | "pending" | "cancelled";

  /**
   * Available task priority levels.
   * Determines the urgency and visual treatment of tasks.
   */
  export type TaskPriority = "high" | "low" | "medium";
}

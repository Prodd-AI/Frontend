/**
 * Available day status options.
 * Represents the completion state of tasks for a specific day.
 */
export type DayStatus = "completed" | "pending";

/**
 * Day data structure for tracking daily progress.
 */
export interface DayData {
  /** Day number (1-7 for week) */
  day: number;
  /** Current completion status */
  status: DayStatus;
  /** Optional: number of tasks completed for this day */
  tasksCompleted?: number;
  /** Optional: total tasks for this day */
  totalTasks?: number;
}

/**
 * Props interface for the WeeklyStreak component.
 */
export interface WeeklyStreakPropsInt {
  /** Total number of tasks completed this week */
  numberOfTaskCompleted: number;
  /** Additional CSS classes to apply to the component container */
  className?: ClassValue;
  /** Total number of tasks assigned for today */
  totalNumberOfTaskForTheDay: number;
  /** Number of tasks completed today */
  numberOfTaskCompletedForTheDay: number;
  /**
   * Array of day data for the week. Required for the component to display days.
   * Should contain 7 items representing Monday through Sunday.
   */
  days?: DayData[];
  /**
   * Callback function called when user toggles a day's completion status.
   * Must be provided for interactive functionality. Parent is responsible for
   * updating the days prop based on this callback.
   * @param day - The day number that was toggled
   * @param newStatus - The new status for that day
   */
  onDayToggle?: (day: number, newStatus: DayStatus) => void | Promise<void>;
  /** Whether the component interactions are disabled */
  disabled?: boolean;
  /** Custom message to display instead of default "Excellent progress! 🔥" */
  customMessage?: string;
}

/**
 * Ref interface for imperative control of the WeeklyStreak component.
 * Use these methods to programmatically control the component from parent.
 */
export interface WeeklyStreakRef {
  /** Gets current week data without triggering re-renders */
  getWeekData: () => {
    completedDays: number;
    totalDays: number;
    completionRate: number;
    days: DayData[];
  };
  /** Focuses the first pending day for keyboard navigation */
  focusNextPendingDay: () => void;
}

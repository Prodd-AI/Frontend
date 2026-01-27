declare module "@/shared/typings/weekly-streak" {
  import { ClassValue } from "clsx";

  /**
   * Day name for the week
   */
  export type DayName = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

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
    /** Week tasks data from API - tasks organized by day of week */
    weekTasks?: WeekTasksResponse;
    /** Custom message to display instead of default "Excellent progress! 🔥" */
    customMessage?: string;
  }
}

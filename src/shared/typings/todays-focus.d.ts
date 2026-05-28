declare module "@/shared/typings/todays-focus" {
  export interface FocusGoal {
    /** Stable key for React lists */
    id: string;
    /** Short text describing the task */
    description: string;
    /** Priority tier — drives the visual urgency styling */
    priority: "high" | "medium" | "low";
    /** Optional ISO-ish due timestamp; rendered as a relative hint when present */
    due_at?: string;
  }

  /**
   * Props for the TodaysFocus component
   */
  export interface TodaysFocusProps {
    /** Section title shown above the list (e.g. "Primary Goal"). */
    title?: string;
    /** Pending tasks for today, sorted by priority by the caller. */
    goals: FocusGoal[];
    /** Optional CSS class name */
    className?: string;
  }
}

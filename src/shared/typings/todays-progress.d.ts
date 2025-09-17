/**
 * Interface for TodaysProgress component props
 */
interface TodaysProgresssPropsInt {
  /** Optional title for the progress component */
  title?: string;
  /** Additional CSS classes to apply to the component */
  className?: ClassValue;
  /** Number of tasks completed today */
  numberOfTaskCompleted: number;
  /** Total number of tasks for today */
  totalNumberOfTask: number;
  /** Average mood rating */
  avgMood: number;
}

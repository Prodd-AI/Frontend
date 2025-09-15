/**
 * Props interface for the DailyMoodCheckIn component.
 */
export interface DailyMoodCheckInPropsInt {
  /** Additional CSS classes to apply to the component container */
  className?: ClassValue;
  /** Title displayed at the top of the component */
  title?: string;
  /** Subtitle/description text shown below the title */
  subTitle?: string;
  /**
   * Callback function called when the user submits their mood.
   * @param mood - The selected mood value
   * @param description - Optional description text from the textarea
   */
  onSubmit: (mood: Moods, description: string) => void;
  /** Whether the submission is currently in progress (shows loading state) */
  isSubmitting?: boolean;
  /** Whether the submission was successful (shows success state) */
  isSubmitted?: boolean;
}

/**
 * Ref interface for imperative control of the DailyMoodCheckIn component.
 * Use these methods to programmatically control the component from parent.
 */
export interface DailyMoodCheckInRef {
  /** Resets the form to its initial state (clears mood selection and description) */
  reset: () => void;
  /** Gets the current form data without triggering re-renders */
  getCurrentData: () => { mood: Moods | null; description: string };
}

/**
 * Available mood options for the daily mood check-in component.
 * Each mood represents a different emotional state from positive to negative.
 */
export type Moods = "Great" | "Good" | "Okay" | "Not Great" | "Rough";

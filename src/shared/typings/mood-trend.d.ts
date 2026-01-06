declare module "@/shared/typings/mood-trend" {
  /**
   * Mood type representing the emotional state
   */
  export type MoodType = "great" | "good" | "okay" | "notGreat" | "rough";

  /**
   * Individual mood entry data
   */
  export interface MoodEntry {
    /** Unique identifier for the mood entry */
    id: string;
    /** The mood type/level */
    mood: MoodType;
    /** Title or description of the mood entry */
    title: string;
    /** Date when the mood was recorded */
    date: string;
  }

  /**
   * Props for the MoodTrends component
   */
  export interface MoodTrendsProps {
    /** Array of mood entries to display */
    moodEntries: MoodEntry[];
    /** Average mood across the period */
    averageMood?: MoodType;
    /** Period label (e.g., "Last 7 days") */
    periodLabel?: string;
    /** Optional CSS class name */
    className?: string;
  }
}
declare module "@/shared/typings/todays-focus" {
  /**
   * Information card data for recommendations or insights
   */
  export interface FocusInfoCard {
    /** Icon identifier or component */
    icon: "break" | "energy" | string;
    /** Card title */
    title: string;
    /** Card description or details */
    description: string;
  }

  /**
   * Props for the TodaysFocus component
   */
  export interface TodaysFocusProps {
    /** Primary goal title */
    primaryGoalTitle: string;
    /** Primary goal description */
    primaryGoalDescription: string;
    /** Information cards (e.g., recommended break, energy level) */
    infoCards?: FocusInfoCard[];
    /** Optional CSS class name */
    className?: string;
  }
}
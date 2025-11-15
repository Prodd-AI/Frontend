declare module "@/shared/typings/team-participation" {
  import { ClassValue } from "clsx";

  /**
   * Interface for TeamParticipationSlider component props
   */
  export interface TeamParticipationSliderPropsInt {
    /** Optional title for the team participation component */
    title?: string;
    /** Additional CSS classes to apply to the component */
    className?: ClassValue;
    /** Total number of team members */
    totalTeamMembers: number;
    /** Number of currently active team members */
    activeTeamMembers: number;
    /** Team participation percentage (0-100) */
    teamParticipationPercentage: number;
  }
}

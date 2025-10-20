/**
 * Interface for TeamParticipationSlider component props
 */
interface TeamParticipationSliderPropsInt {
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

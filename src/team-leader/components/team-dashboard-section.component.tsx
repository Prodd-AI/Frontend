import { TeamDashboard } from "@/shared/components/team-insight-metric-card";
import TeamParticipationSlider from "@/shared/components/team-participation.component";
import { TeamDashboardSectionProps } from "@/team-leader/typings/team-leader";

const TeamDashboardSection = ({ className }: TeamDashboardSectionProps) => {
  return (
    <div className={className}>
      <TeamDashboard className="mt-6" />
      <TeamParticipationSlider
        className="mt-8"
        totalTeamMembers={5}
        activeTeamMembers={4}
        teamParticipationPercentage={80}
      />
    </div>
  );
};

export default TeamDashboardSection;

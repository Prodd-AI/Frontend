import { useTeamLeadDashMetricInsight } from "@/team-leader/hooks/use-team-lead-dash-metric-insight";
import TeamParticipationSlider from "@/shared/components/team-participation.component";
import { TeamDashboardSectionProps } from "@/team-leader/typings/team-leader";
import { TeamPerformanceOverview } from "./team-performance-overview.component";

const TeamDashboardSection = ({ className }: TeamDashboardSectionProps) => {
  const {
    teams,
    activeTeamId,
    setSelectedTeamId,
    teamsLoading,
    metrics,
    analysisLoading,
    handleDateRangeChange,
    totalMembers,
    activeMembers,
    participationPercentage,
  } = useTeamLeadDashMetricInsight();

  return (
    <div className={className}>
      <TeamPerformanceOverview
        teams={teams}
        activeTeamId={activeTeamId}
        onSelectTeam={setSelectedTeamId}
        teamsLoading={teamsLoading}
        metrics={metrics}
        analysisLoading={analysisLoading}
        onDateRangeChange={handleDateRangeChange}
      />

      {/* Team Participation Slider */}
      <TeamParticipationSlider
        className="mt-8"
        totalTeamMembers={totalMembers}
        activeTeamMembers={activeMembers}
        teamParticipationPercentage={participationPercentage}
      />
    </div>
  );
};

export default TeamDashboardSection;

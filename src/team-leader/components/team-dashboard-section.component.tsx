import { useTeams } from "@/team-leader/hooks/use-teams";
import { useTeamAnalysis } from "@/team-leader/hooks/use-team-analysis";
import { useDateRange } from "@/team-leader/hooks/use-date-range";
import TeamParticipationSlider from "@/shared/components/team-participation.component";
import { TeamDashboardSectionProps } from "@/team-leader/typings/team-leader";
import { TeamPerformanceOverview } from "./team-performance-overview.component";

const TeamDashboardSection = ({ className }: TeamDashboardSectionProps) => {
  const { teams, activeTeamId, setSelectedTeamId, teamsLoading } = useTeams();
  const { startDate, endDate, handleDateRangeChange } = useDateRange();

  const {
    metrics,
    analysisLoading,
    totalMembers,
    activeMembers,
    participationPercentage,
  } = useTeamAnalysis({ teamId: activeTeamId, startDate, endDate });

  return (
    <div className={className}>
      <TeamPerformanceOverview
        teams={teams}
        activeTeamId={activeTeamId}
        onSelectTeam={setSelectedTeamId}
        teamsLoading={teamsLoading}
        metrics={metrics}
        analysisLoading={analysisLoading}
        startDate={startDate}
        endDate={endDate}
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

import TeamInsightMetricCard from "@/shared/components/team-insight-metric-card";
import { TeamTabs } from "@/shared/components/team-tabs.component";
import { SingleTeamAnalysisMetrics } from "@/team-leader/typings/team-leader";

interface TeamPerformanceOverviewProps {
  teams: { team_id: string; team_name: string }[];
  activeTeamId?: string | null;
  onSelectTeam: (id: string) => void;
  teamsLoading?: boolean;
  metrics?: SingleTeamAnalysisMetrics;
  analysisLoading?: boolean;
  startDate: string;
  endDate: string;
  onDateRangeChange: (start: string, end: string) => void;
  className?: string;
}

export const TeamPerformanceOverview = ({
  teams,
  activeTeamId,
  onSelectTeam,
  teamsLoading,
  metrics,
  analysisLoading,
  startDate,
  endDate,
  onDateRangeChange,
  className,
}: TeamPerformanceOverviewProps) => {
  const completedTask =
    metrics?.team_members_details.reduce(
      (acc, curr) => acc + curr.completed_task,
      0,
    ) ?? 0;
  return (
    <div className={className}>
      <TeamTabs
        teams={teams}
        activeTeamId={activeTeamId ?? null}
        onSelectTeam={onSelectTeam}
        isLoading={teamsLoading}
        className="mb-4 mt-6"
        tabClassName="text-base px-4 py-2"
      />
      <TeamInsightMetricCard
        className="mt-6"
        teamSize={metrics?.team_size ?? 0}
        moraleScore={metrics?.morale_score ?? 0}
        atRiskCount={metrics?.at_risk_members ?? 0}
        isLoading={analysisLoading}
        startDate={startDate}
        endDate={endDate}
        onDateRangeChange={onDateRangeChange}
        completedTasks={completedTask}
      />
    </div>
  );
};

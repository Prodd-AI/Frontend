import { useQuery } from "@tanstack/react-query";
import { getAnalysisMetricForSingleTeam } from "@/config/services/teams.service";

interface UseTeamAnalysisOptions {
  teamId: string | undefined;
  startDate: string;
  endDate: string;
}

export const useTeamAnalysis = ({
  teamId,
  startDate,
  endDate,
}: UseTeamAnalysisOptions) => {
  const { data: analysisData, isLoading: analysisLoading } = useQuery({
    queryKey: ["team-analysis", teamId, startDate, endDate],
    queryFn: () =>
      getAnalysisMetricForSingleTeam(teamId ?? "", {
        start_date: startDate,
        end_date: endDate,
      }),
    enabled: !!teamId,
  });

  const metrics = analysisData?.data;
  const totalMembers = metrics?.team_size ?? 0;
  const activeMembers = metrics?.active_count ?? 0;
  const participationPercentage = metrics?.participation_rate ?? 0;

  return {
    metrics,
    analysisLoading,
    totalMembers,
    activeMembers,
    participationPercentage,
  };
};

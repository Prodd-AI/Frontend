import { useQuery } from "@tanstack/react-query";
import { getAnalysisMetricForSingleTeam } from "@/config/services/teams.service";
import useAuthStore from "@/config/stores/auth.store";

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

  const raw = analysisData?.data;
  const currentUser = useAuthStore((s) => s.user?.user);
  const viewerIsHr = currentUser?.user_role === "hr";

  // HR is joined to every team in the backend but shouldn't show up as a
  // team member. When the viewer is HR, drop them from team_members_details
  // and subtract 1 from team_size / active_count.
  const metrics = (() => {
    if (!raw) return raw;
    if (!viewerIsHr) return raw;
    const filteredMembers = (raw.team_members_details ?? []).filter(
      (m) => m.email !== currentUser?.email,
    );
    const removed = (raw.team_members_details?.length ?? 0) - filteredMembers.length;
    return {
      ...raw,
      team_members_details: filteredMembers,
      team_size: Math.max(0, (raw.team_size ?? 0) - 1),
      active_count: Math.max(0, (raw.active_count ?? 0) - removed),
    };
  })();

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

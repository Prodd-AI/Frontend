import { useQuery } from "@tanstack/react-query";
import { getMyTeams } from "@/config/services/teams.service";
import useTeamStore from "@/config/stores/team.store";

export const useTeams = () => {
  const { selectedTeamId, setSelectedTeamId } = useTeamStore();

  const { data: teamsData, isLoading: teamsLoading } = useQuery({
    queryKey: ["my-teams"],
    queryFn: () => getMyTeams(),
  });

  const teams =
    teamsData?.data?.map((membership) => ({
      team_id: membership.team.id,
      team_name: membership.team.name,
    })) ?? [];

  const activeTeamId = selectedTeamId ?? teams[0]?.team_id;

  return {
    teams,
    activeTeamId,
    selectedTeamId,
    setSelectedTeamId,
    teamsLoading,
  };
};

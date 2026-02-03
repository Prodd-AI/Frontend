import { useQuery } from "@tanstack/react-query";
import { getTeams } from "@/config/services/teams.service";
import useTeamStore from "@/config/stores/team.store";

export const useTeams = () => {
  const { selectedTeamId, setSelectedTeamId } = useTeamStore();

  const { data: teamsData, isLoading: teamsLoading } = useQuery({
    queryKey: ["teams"],
    queryFn: () => getTeams(),
  });

  const teams =
    teamsData?.data?.map((team) => ({
      team_id: team.id,
      team_name: team.name,
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

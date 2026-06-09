import { useQuery } from "@tanstack/react-query";
import { get_teams_overview_cards } from "@/config/services/hr.service";

export const useTeamsOverview = () => {
  const { data, isLoading: is_loading, error } = useQuery({
    queryKey: ["teams-overview"],
    queryFn: () => get_teams_overview_cards(),
  });

  // Admin is added to every team in the backend join — subtract 1 from the
  // member_count so totals/cards reflect actual team members.
  const teams = (data?.data || []).map((team) => ({
    ...team,
    member_count: Math.max(0, (team.member_count ?? 0) - 1),
  }));

  return {
    teams,
    is_loading,
    error,
  };
};

import { useQuery } from "@tanstack/react-query";
import { get_teams_overview_cards } from "@/config/services/hr.service";

export const useTeamsOverview = () => {
  const { data, isLoading: is_loading, error } = useQuery({
    queryKey: ["teams-overview"],
    queryFn: () => get_teams_overview_cards(),
  });

  return {
    teams: data?.data || [],
    is_loading,
    error
  };
};

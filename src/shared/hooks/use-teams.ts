import { useQuery } from "@tanstack/react-query";
import { getTeams } from "@/config/services/teams.service";

export const useTeams = () => {
  const { data, isLoading: is_loading, error } = useQuery({
    queryKey: ["teams"],
    queryFn: () => getTeams(),
  });

  return {
    teams: data?.data || [],
    is_loading,
    error
  };
};

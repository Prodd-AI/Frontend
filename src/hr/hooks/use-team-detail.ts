import { useQuery } from "@tanstack/react-query";
import { get_team_detail } from "@/config/services/hr.service";

export const useTeamDetail = (team_id?: string) => {
  const { data, isLoading: is_loading, error } = useQuery({
    queryKey: ["team-detail", team_id],
    queryFn: () => get_team_detail(team_id!),
    enabled: !!team_id,
  });

  return {
    team_data: data?.data,
    is_loading,
    error,
  };
};

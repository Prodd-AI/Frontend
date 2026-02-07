import { useQuery } from "@tanstack/react-query";
import { get_flight_risk } from "@/config/services/hr.service";
import useTeamStore from "@/config/stores/team.store";
import { FlightRiskInfo } from "@/hr/typings/flight-risk-card";

export const useFlightRisk = () => {
  const { selectedTeamId: selected_team_id } = useTeamStore();

  const { data, isLoading: is_loading, error } = useQuery({
    queryKey: ["flight-risk", selected_team_id],
    queryFn: () => get_flight_risk({
      team_id: selected_team_id || undefined
    }),
  });

  // Map API response to FlightRiskInfo shape if necessary
  // Assuming the API returns a list of flight risks in data.data
  const flight_risks: FlightRiskInfo[] = data?.data || [];

  return {
    flight_risks,
    is_loading,
    error
  };
};

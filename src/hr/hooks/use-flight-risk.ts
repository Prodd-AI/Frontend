import { useQuery } from "@tanstack/react-query";
import { get_flight_risk } from "@/config/services/hr.service";
import { getMyTeams } from "@/config/services/teams.service";
import useTeamStore from "@/config/stores/team.store";
import {
  FlightRiskInfo,
  FlightRiskStatus,
} from "@/hr/typings/flight-risk-card";

/** Raw flight risk item from API (GET flight-risk) */
interface FlightRiskApiItem {
  user_id: string;
  full_name: string;
  job_title: string;
  team_name: string;
  avatar_url: string | null;
  email?: string;
  avg_mood_30d: number;
  task_completion_rate: number;
  weekly_streak_days: number;
  last_check_in: string;
  risk_factors: string[];
  is_at_risk: boolean;
}

/** Build map of team name -> team_id from GET /teams/me */
function buildTeamNameToIdMap(
  myTeams: { team_id: string; team?: { name?: string } }[],
): Record<string, string> {
  const map: Record<string, string> = {};
  for (const m of myTeams ?? []) {
    const name = m.team?.name;
    if (name && !map[name]) map[name] = m.team_id;
  }
  return map;
}

function mapApiItemToFlightRiskInfo(
  item: FlightRiskApiItem,
  teamNameToId: Record<string, string>,
): FlightRiskInfo {
  const status: FlightRiskStatus = item.is_at_risk ? "at_risk" : "healthy";
  const taskPercent =
    item.task_completion_rate <= 1 && item.task_completion_rate > 0
      ? Math.round(item.task_completion_rate * 100)
      : Math.round(item.task_completion_rate);

  return {
    id: item.user_id,
    member_name: item.full_name,
    role_title: item.job_title,
    team_id: teamNameToId[item.team_name] ?? undefined,
    team_name: item.team_name,
    email: item.email,
    avg_mood_score: item.avg_mood_30d,
    task_completion_percent: taskPercent,
    weekly_streak_days: item.weekly_streak_days,
    last_checkin_label: item.last_check_in,
    status,
    risk_factors: item.risk_factors ?? [],
  };
}

export const useFlightRisk = () => {
  const { selectedTeamId: selected_team_id } = useTeamStore();

  const { data, isLoading: is_loading, error } = useQuery({
    queryKey: ["flight-risk", selected_team_id],
    queryFn: () =>
      get_flight_risk({
        team_id: selected_team_id || undefined,
      }),
  });

  const { data: myTeamsResponse } = useQuery({
    queryKey: ["teams", "me"],
    queryFn: () => getMyTeams({ page: "1", limit: "100" }),
  });
  const myTeams = myTeamsResponse?.data ?? [];
  const teamNameToId = buildTeamNameToIdMap(myTeams);

  const rawList: FlightRiskApiItem[] = Array.isArray(data?.data)
    ? data.data
    : [];
  const flight_risks: FlightRiskInfo[] = rawList.map((item) =>
    mapApiItemToFlightRiskInfo(item, teamNameToId),
  );

  return {
    flight_risks,
    is_loading,
    error,
  };
};

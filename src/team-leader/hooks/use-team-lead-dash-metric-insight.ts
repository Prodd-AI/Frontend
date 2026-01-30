import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, subDays } from "date-fns";
import {
  getAnalysisMetricForSingleTeam,
  getTeams,
} from "@/config/services/teams.service";

export const useTeamLeadDashMetricInsight = () => {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const today = new Date();
  const [startDate, setStartDate] = useState(
    format(subDays(today, 30), "yyyy-MM-dd"),
  );
  const [endDate, setEndDate] = useState(format(today, "yyyy-MM-dd"));

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

  const { data: analysisData, isLoading: analysisLoading } = useQuery({
    queryKey: ["team-analysis", activeTeamId, startDate, endDate],
    queryFn: () =>
      getAnalysisMetricForSingleTeam(activeTeamId ?? "", {
        start_date: startDate,
        end_date: endDate,
      }),
    enabled: !!activeTeamId,
  });

  const metrics = analysisData?.data;
  const totalMembers = metrics?.team_size ?? 0;
  const activeMembers = metrics?.active_count ?? 0;
  const participationPercentage = metrics?.participation_rate ?? 0;

  const handleDateRangeChange = (newStartDate: string, newEndDate: string) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  return {
    teams,
    activeTeamId,
    selectedTeamId,
    setSelectedTeamId,
    teamsLoading,
    metrics,
    analysisLoading,
    handleDateRangeChange,
    totalMembers,
    activeMembers,
    participationPercentage,
  };
};

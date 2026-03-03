import { useQuery } from "@tanstack/react-query";
import { get_team_payroll_summary } from "@/config/services/hr.service";
import useTeamStore from "@/config/stores/team.store";
import useDateStore from "@/config/stores/date.store";
import { DatePeriod } from "@/shared/typings/date.store";

const map_period_to_filter = (period: DatePeriod): "this_week" | "last_week" => {
  switch (period) {
    case "this_week":
      return "this_week";
    case "last_week":
      return "last_week";
    default:
      return "this_week";
  }
};

export const useHrPayroll = () => {
  const { selectedTeamId: selected_team_id } = useTeamStore();
  const { selected_period } = useDateStore();

  const date_filter = map_period_to_filter(selected_period);

  const { data, isLoading: is_loading, error } = useQuery({
    queryKey: ["hr-payroll", selected_team_id, date_filter],
    queryFn: () => get_team_payroll_summary({
      date_filter,
      team_id: selected_team_id || undefined
    }),
  });

  const isWeek =
    date_filter === "this_week" || date_filter === "last_week";
  const periodLabel =
    date_filter === "this_week"
      ? "This week"
      : date_filter === "last_week"
        ? "Last week"
        : date_filter === "this_month"
          ? "This month"
          : "Last month";

  return {
    payroll_data: data?.data,
    date_filter,
    periodLabel,
    isWeek,
    is_loading,
    error,
  };
};

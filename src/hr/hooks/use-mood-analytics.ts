import { useQuery } from "@tanstack/react-query";
import { get_mood_distribution } from "@/config/services/mood-trends.service";
import useTeamStore from "@/config/stores/team.store";
import useDateStore from "@/config/stores/date.store";
import { format, parseISO } from "date-fns";
import { MOOD_EMOJIS } from "@/shared/utils/constants";
import { DatePeriod } from "@/shared/typings/date.store";

// Map date period to API date_filter format
const mapDatePeriodToFilter = (period: DatePeriod): string => {
  if (period === "this_week") return "this_week";
  if (period === "this_month") return "this_month";
  if (period === "last_week" || period === "7days") return "this_week";
  if (period === "last_month" || period === "30days") return "this_month";
  return "this_week"; // default
};

export const useMoodAnalytics = (options?: { 
  period?: DatePeriod; 
  team_id?: string | null;
  employee_id?: string | null;
}) => {
  const { selectedTeamId: store_team_id } = useTeamStore();
  const { selected_period: global_period } = useDateStore();
  
  const active_period = options?.period || global_period;
  const active_team_id = options?.team_id !== undefined ? options.team_id : store_team_id;
  const active_employee_id = options?.employee_id || undefined;
  
  const date_filter = mapDatePeriodToFilter(active_period);

  const { data, isLoading: is_loading, error } = useQuery({
    queryKey: ["mood-distribution", date_filter, active_team_id, active_employee_id],
    queryFn: () => get_mood_distribution({
      date_filter: date_filter,
      team_id: active_team_id || undefined,
      employee_id: active_employee_id
    }),
  });

  const get_emoji = (score: number) => {
    if (score >= 4.5) return MOOD_EMOJIS.great;
    if (score >= 3.5) return MOOD_EMOJIS.good;
    if (score >= 2.5) return MOOD_EMOJIS.okay;
    if (score >= 1.5) return MOOD_EMOJIS.notGreat;
    return MOOD_EMOJIS.rough;
  };

  const formatted_data = data?.data?.map((item) => {
    const date = parseISO(item.date);
    return {
      day: format(date, "EEEE"),
      label: format(date, "EEE"),
      score: item.average_score,
      emoji: get_emoji(item.average_score),
      total_checkins: item.total_checkins
    };
  }) || [];

  const average_weekly_score = formatted_data.length > 0 
    ? (formatted_data.reduce((acc, curr) => acc + curr.score, 0) / formatted_data.length).toFixed(1)
    : "0.0";

  return {
    mood_data: formatted_data,
    is_loading,
    error,
    average_weekly_score
  };
};

import { useQuery } from "@tanstack/react-query";
import { get_mood_distribution } from "@/config/services/mood-trends.service";
import useTeamStore from "@/config/stores/team.store";
import useDateStore from "@/config/stores/date.store";
import { format, subDays, parseISO } from "date-fns";
import { MOOD_EMOJIS } from "@/shared/utils/constants";
import { DatePeriod } from "@/shared/typings/date.store";

export const useMoodAnalytics = (options?: { 
  period?: DatePeriod; 
  team_id?: string | null;
}) => {
  const { selectedTeamId: store_team_id } = useTeamStore();
  const { selected_period: global_period } = useDateStore();
  
  const active_period = options?.period || global_period;
  const active_team_id = options?.team_id !== undefined ? options.team_id : store_team_id;
  
  const today = new Date();
  const days_to_sub = (active_period === "last_week" || active_period === "7days") ? 7 : 30;
  const start_date = format(subDays(today, days_to_sub), "yyyy-MM-dd");
  const end_date = format(today, "yyyy-MM-dd");

  const { data, isLoading: is_loading, error } = useQuery({
    queryKey: ["mood-distribution", start_date, end_date, active_team_id],
    queryFn: () => get_mood_distribution({
      start_date: start_date,
      end_date: end_date,
      team_id: active_team_id || undefined
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

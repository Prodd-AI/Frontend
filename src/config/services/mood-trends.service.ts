import { SERVER_URL } from "@/shared/utils/constants";
import { ApiService } from "./root.service";

const mood_trend_service = new ApiService(`${SERVER_URL}mood`);

const submit_check_in_mood = (data: {
  mood_score: number;
  description: string;
}) => {
  return mood_trend_service.post<GeneralReturnInt<unknown>, typeof data>(
    "check-in",
    data,
    true,
  );
};
const get_average_mood_for_the_week = (params: {
  period: "day" | "week" | "month";
}) =>
  mood_trend_service.get<
    GeneralReturnInt<{
      average_mood: number;
      mood_scores: Array<{
        user_id: string;
        mood_score: number;
        description: string;
        created_at: string;
      }>;
    }>
  >("average", params, true);
const get_user_mood_history = (
  user_id: string,
  params?: {
    start_date: string;
    end_date: string;
  },
) => {
  return mood_trend_service.get<
    GeneralReturnInt<
      Array<{
        date: string;
        mood: "great" | "good" | "okay" | "notGreat" | "rough" | null;
      }>
    >
  >(`user/${user_id}/history`, params, true);
};
const get_mood_distribution = (params: {
  start_date: string;
  end_date: string;
  team_id?: string;
}) => {
  return mood_trend_service.get<
    GeneralReturnInt<
      Array<{
        date: string;
        average_score: number;
        total_checkins: number;
      }>
    >
  >("mood-distribution", params, true);
};

export {
  submit_check_in_mood,
  get_average_mood_for_the_week,
  get_user_mood_history,
  get_mood_distribution,
};

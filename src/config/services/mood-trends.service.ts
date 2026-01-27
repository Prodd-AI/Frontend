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

export { submit_check_in_mood, get_average_mood_for_the_week };

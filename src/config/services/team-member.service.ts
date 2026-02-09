import { SERVER_URL } from "@/shared/utils/constants";
import { ApiService } from "./root.service";

const team_member_service = new ApiService(`${SERVER_URL}users`);

const get_team_member_overview = (user_id: string) => {
  return team_member_service.get<
    GeneralReturnInt<{
      user_id: string;
      name: string;
      email: string;
      job_title: string;
      join_date: string;
      avatar_url: string;
      performance_trend: "improving" | "stable" | "declining";
      workload_status: "light" | "balanced" | "heavy";
    }>
  >(`${user_id}/member-overview`, undefined, true);
};

export { get_team_member_overview };

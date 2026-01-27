import { SERVER_URL } from "@/shared/utils/constants";
import { ApiService } from "./root.service";

const task_service = new ApiService(`${SERVER_URL}tasks`);

const getWeeklyStreak = (params: {
  duration: "day" | "week" | "month";
  status: "pending" | "completed";
}) =>
  task_service.get<GeneralReturnInt<WeekTasksResponse>>(
    "my-tasks",
    params,
    true,
  );

  

export { getWeeklyStreak };

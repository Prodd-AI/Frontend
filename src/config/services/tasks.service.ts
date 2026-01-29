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

const assignTasks = (data: {
  title: string;
  external_link: string;
  description: string;
  assigned_to: string[];
  due_date: string;
  priority: "high" | "low" | "medium";
}) => {
  return task_service.post<GeneralReturnInt<unknown>, typeof data>(
    "",
    data,
    true,
  );
};

export { getWeeklyStreak, assignTasks };

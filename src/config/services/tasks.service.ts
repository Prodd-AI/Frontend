import { SERVER_URL } from "@/shared/utils/constants";
import { ApiService } from "./root.service";
import {
  AssignedTask,
  CreateTaskDto,
  UpdateTaskDto,
} from "@/team-leader/typings/team-leader";

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

const assignTasks = (data: CreateTaskDto) => {
  return task_service.post<GeneralReturnInt<unknown>, typeof data>(
    "",
    data,
    true,
  );
};

const updateTask = (task_id: string, data: UpdateTaskDto) => {
  return task_service.patch<GeneralReturnInt<unknown>, typeof data>(
    `${task_id}`,
    data,
    true,
  );
};

const getAllTasksAssignedToTeamMembersByTeamLead = () => {
  return task_service.get<GeneralReturnInt<AssignedTask[]>>(
    "team",
    undefined,
    true,
  );
};

export {
  getWeeklyStreak,
  assignTasks,
  getAllTasksAssignedToTeamMembersByTeamLead,
  updateTask,
};

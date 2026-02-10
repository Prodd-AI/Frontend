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
  status: "pending" | "completed" | "all";
}) =>
  task_service.get<GeneralReturnInt<WeekTasksResponse>>(
    "my-tasks",
    params,
    true,
  );

const assignTasks = (data: CreateTaskDto) => {
  const { external_link, ...rest } = data;
  const payload = external_link ? { ...rest, external_link } : rest;

  return task_service.post<GeneralReturnInt<unknown>, typeof payload>(
    "",
    payload,
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

const getAllTasksAssignedToTeamMembersByTeamLeadViaTeadId = (
  team_id: string,
) => {
  return task_service.get<GeneralReturnInt<AssignedTask[]>>(
    `team/${team_id}`,
    undefined,
    true,
  );
};
const getAssignedTasksForTeamMember = (member_id: string) => {
  return task_service.get<GeneralReturnInt<Omit<AssignedTask, "user">[]>>(
    `member/${member_id}`,
    undefined,
    true,
  );
};
export {
  getWeeklyStreak,
  assignTasks,
  getAllTasksAssignedToTeamMembersByTeamLead,
  updateTask,
  getAllTasksAssignedToTeamMembersByTeamLeadViaTeadId,
  getAssignedTasksForTeamMember,
};

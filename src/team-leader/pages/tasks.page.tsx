import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/shared/components/page-header.component";
import TasksFilter, {
  type TasksDuration,
  type TasksStatus,
} from "@/shared/components/tasks-filter.component";
import TasksTabContent from "@/team-leader/components/tasks-tab-content.component";
import AssignTask from "@/team-leader/components/assign-task.component";
import { personalTasksColumns } from "@/team-leader/components/columns/personal-tasks-columns";
import { getWeeklyStreak } from "@/config/services/tasks.service";
import { getTaskDetailPath } from "@/shared/utils/task-routes";
import useAuthStore from "@/config/stores/auth.store";

function TasksPage() {
  const [duration, setDuration] = useState<TasksDuration>("week");
  const [status, setStatus] = useState<TasksStatus>("all");
  const navigate = useNavigate();
  const role = useAuthStore((s) => s.user?.user.user_role);

  const { data, isLoading } = useQuery({
    queryKey: ["streaks", { duration, status }],
    queryFn: () => getWeeklyStreak({ duration, status }),
  });

  const weekTasks = data?.data;
  const assignedTasks = weekTasks ? Object.values(weekTasks).flat() : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        subtitle="Stay focused and organized with your task list"
        actions={
          <TasksFilter
            duration={duration}
            status={status}
            onDurationChange={setDuration}
            onStatusChange={setStatus}
          />
        }
      />
      <TasksTabContent
        showAssignButton
        AssignButton={AssignTask}
        assignedTasks={assignedTasks}
        isLoading={isLoading}
        columns={personalTasksColumns}
        onRowClick={(row) => navigate(getTaskDetailPath(role, row.task.id))}
      />
    </div>
  );
}

export default TasksPage;

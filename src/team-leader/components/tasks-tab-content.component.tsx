import { TasksTabContentProps } from "@/team-leader/typings/team-leader";
import { DataTable } from "@/shared/components/data-table/data-table";
import { columns } from "./columns/assigned-tasks-columns";

const TasksTabContent = ({
  assignedTasks = [],
  isLoading,
  title = "Team's Tasks",
  description = "Stay focused and organized with your daily task list.",
  AssignButton,
  showAssignButton,
  showHeader = true,
}: TasksTabContentProps) => {
  return (
    <div className="flex flex-col gap-6">
      {showHeader && (
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-[2.25rem] font-bold">{title}</h4>
            <p className="text-[#6B7280]">{description}</p>
          </div>
          {showAssignButton && AssignButton && <AssignButton />}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center p-8 text-muted-foreground">
          Loading tasks...
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={assignedTasks}
          placeholder="Search tasks..."
          className="border-none shadow-none"
          tableName={title}
          tableDescription={description}
        />
      )}
    </div>
  );
};

export default TasksTabContent;

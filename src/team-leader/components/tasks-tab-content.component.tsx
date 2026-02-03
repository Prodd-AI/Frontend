import { TasksTabContentProps } from "@/team-leader/typings/team-leader";
import { DataTable } from "@/shared/components/data-table/data-table";
// import { columns } from "./columns/assigned-tasks-columns";

function TasksTabContent<T>({
  assignedTasks = [],
  isLoading,
  title,
  description,
  AssignButton,
  showAssignButton,
  showHeader = true,
  columns,
}: TasksTabContentProps<T>) {
  return (
    <div className="flex flex-col gap-6">
      {showHeader && (
        <div className="flex items-center justify-between">
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
}

export default TasksTabContent;

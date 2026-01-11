
import TaskCardComponent from "@/shared/components/task-card.component";
import { TasksTabContentProps } from "@/team-leader/typings/team-leader";

const TasksTabContent = ({
  tasks,
  title = "Today's Tasks",
  description = "Stay focused and organized with your daily task list.",
  AssignButton,

  showHeader = true,
}: TasksTabContentProps) => {
  return (
    <div>
      {showHeader && (
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-[2.25rem] font-bold">{title}</h4>
            <p className="text-[#6B7280]">{description}</p>
          </div>
          {AssignButton && (
            <AssignButton />
          )}
        </div>
      )}

      {tasks.map((task, index) => (
        <TaskCardComponent
          key={task.id}
          title={task.title}
          priority={task.priority}
          status={task.status}
          dueDateTime={task.dueDateTime}
          assignee={task.assignee}
          createdDateTime={task.createdDateTime}
          collapsedStyle={false}
          className={`w-full ${showHeader && index === 0 ? "mt-[60px]" : "mt-4"
            }`}
        />
      ))}
    </div>
  );
};

export default TasksTabContent;

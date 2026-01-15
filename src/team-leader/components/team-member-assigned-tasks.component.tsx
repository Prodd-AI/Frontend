import { useState } from "react";
import { Button } from "@/components/ui/button";
import TaskCard from "@/shared/components/task-card.component";
import { TaskStatus, TaskPriority } from "@/shared/typings/task-card";
import { ClipboardList } from "lucide-react";

type FilterType = "all" | "pending" | "in-progress" | "completed";

interface Task {
  id: string;
  title: string;
  assignee: string;
  dueDateTime: string;
  status: TaskStatus;
  priority: TaskPriority;
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Complete quarterly report analysis",
    assignee: "Alex Johnson",
    dueDateTime: "Jan 20, 2026",
    status: "pending",
    priority: "high",
  },
  {
    id: "2",
    title: "Review pull request for authentication module",
    assignee: "Alex Johnson",
    dueDateTime: "Jan 18, 2026",
    status: "pending",
    priority: "medium",
  },
  {
    id: "3",
    title: "Update API documentation",
    assignee: "Alex Johnson",
    dueDateTime: "Jan 22, 2026",
    status: "completed",
    priority: "low",
  },
  {
    id: "4",
    title: "Fix dashboard performance issues",
    assignee: "Alex Johnson",
    dueDateTime: "Jan 19, 2026",
    status: "pending",
    priority: "high",
  },
];

function TeamMemberAssignedTasks() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filterTasks = (tasks: Task[], filter: FilterType): Task[] => {
    switch (filter) {
      case "pending":
        return tasks.filter((t) => t.status === "pending");
      case "in-progress":
        // Treating "cancelled" as in-progress for demo purposes
        return tasks.filter((t) => t.status === "cancelled");
      case "completed":
        return tasks.filter((t) => t.status === "completed");
      default:
        return tasks;
    }
  };

  const getFilterCounts = () => {
    return {
      all: mockTasks.length,
      pending: mockTasks.filter((t) => t.status === "pending").length,
      inProgress: mockTasks.filter((t) => t.status === "cancelled").length,
      completed: mockTasks.filter((t) => t.status === "completed").length,
    };
  };

  const counts = getFilterCounts();
  const filteredTasks = filterTasks(mockTasks, activeFilter);

  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: "all", label: "All", count: counts.all },
    { key: "pending", label: "Pending", count: counts.pending },
    { key: "in-progress", label: "In Progress", count: counts.inProgress },
    { key: "completed", label: "Completed", count: counts.completed },
  ];

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    console.log(`Task ${taskId} status changed to ${newStatus}`);
    // In a real implementation, this would update the task status via API
  };

  return (
    <section className="mt-[3.125rem]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <ClipboardList className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <h4 className="text-xl font-semibold text-foreground leading-tight">
              Assigned Tasks
            </h4>
            <span className="text-sm text-muted-foreground">
              {counts.all} total tasks
            </span>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          {filters.map((filter) => (
            <Button
              key={filter.key}
              variant={activeFilter === filter.key ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter.key)}
              className={`
                rounded-full px-4 transition-all duration-200
                ${
                  activeFilter === filter.key
                    ? "bg-primary text-white shadow-md hover:bg-primary/90"
                    : "bg-gray-50 border-gray-200 text-muted-foreground hover:bg-gray-100 hover:text-foreground hover:border-gray-300"
                }
              `}
            >
              {filter.label}
              <span
                className={`ml-1.5 text-xs font-semibold ${
                  activeFilter === filter.key
                    ? "text-white/80"
                    : "text-muted-foreground"
                }`}
              >
                ({filter.count})
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              title={task.title}
              assignee={task.assignee}
              dueDateTime={task.dueDateTime}
              status={task.status}
              priority={task.priority}
              collapsedStyle={true}
              onStatusChange={(newStatus) =>
                handleStatusChange(task.id, newStatus)
              }
              className="w-full"
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <ClipboardList className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground font-medium">No tasks found</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              No tasks match the selected filter
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default TeamMemberAssignedTasks;

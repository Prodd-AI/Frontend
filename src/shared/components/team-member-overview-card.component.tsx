import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import clsx from "clsx";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TeamMemberOverviewCardPropsInt {
  id: string | number;
  name?: string;
  role?: string;
  status?: "At risk" | "On track" | "Completed";
  taskCompletion?: number;
  tasksCompleted?: number;
  totalTasks?: number;
  weekStreak?: string;
  lastActive?: string;
}
const statusColor = {
  "At risk": "text-red-500",
  "On track": "text-green-500",
  Completed: "text-blue-500",
};
const TeamMemberOverviewCard = ({
  name,
  role,
  status,
  taskCompletion,
  tasksCompleted,
  totalTasks,
  weekStreak,
  lastActive,
  id,
}: TeamMemberOverviewCardPropsInt) => {
  const navigate = useNavigate();
  const handleViewTeamMemberDetails = (id: string | number) => () => {
    if (!id) return;
    navigate(`${id}`);
  };
  return (
    <div
      className={clsx(
        `bg-card rounded-2xl p-6 flex-1 min-w-[280px] max-w-sm border`,
        "shadow-[0px_4px_4px_-4px_rgba(12,12,13,0.05),0px_16px_16px_-8px_rgba(12,12,13,0.10)]",
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 bg-muted">
            <AvatarFallback className="bg-muted">
              <User className="h-6 w-6 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-foreground">{name || "—"}</h3>
            {role && <p className="text-sm text-muted-foreground">{role}</p>}
          </div>
        </div>
        {status && (
          <span className={`text-sm font-medium ${statusColor[status]}`}>
            {status}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="space-y-3 mb-4">
        {taskCompletion !== undefined && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Task Completion</span>
            <span
              className={`font-medium ${
                taskCompletion < 50 ? "text-green-500" : "text-foreground"
              }`}
            >
              {taskCompletion}%
            </span>
          </div>
        )}
        {(tasksCompleted !== undefined || totalTasks !== undefined) && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Task</span>
            <span className="font-medium text-foreground">
              {tasksCompleted ?? 0}/{totalTasks ?? 0}
            </span>
          </div>
        )}
        {weekStreak && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Week Streak</span>
            <span className="font-medium text-foreground">{weekStreak}</span>
          </div>
        )}
        {lastActive && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Last Active</span>
            <span className="font-medium text-foreground">{lastActive}</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {taskCompletion !== undefined && (
        <div className="mb-4">
          <Progress value={taskCompletion} className="h-2" />
        </div>
      )}

      {/* View Details Button */}
      <Button className="w-full" onClick={handleViewTeamMemberDetails(id)}>
        View Details
      </Button>
    </div>
  );
};

export default TeamMemberOverviewCard;

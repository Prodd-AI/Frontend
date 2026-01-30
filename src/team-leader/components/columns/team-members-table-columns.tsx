import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";

import { TeamMemberActionsCell } from "./team-member-actions-cell.component";

export type TeamMemberData = {
  id: string;
  name: string;
  role: string;
  status: "At risk" | "On track";
  taskCompletion: number;
  tasksCompleted: number;
  totalTasks: number;
  weekStreak: string;
  lastActive: string;
  email: string;
};

export const columns: ColumnDef<TeamMemberData>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage />
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {row.original.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold text-sm">{row.getValue("name")}</span>
          <span className="text-xs text-muted-foreground">
            {row.original.role}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Flight Risk",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={status === "At risk" ? "destructive" : "secondary"}
          className={
            status === "On track"
              ? "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
              : ""
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "taskCompletion",
    header: "Task Completion",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1 w-full max-w-[140px]">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium">{row.getValue("taskCompletion")}%</span>
          <span className="text-muted-foreground">Target: 100%</span>
        </div>
        <Progress
          value={row.getValue("taskCompletion")}
          className="h-1.5"
          indicatorClassName={
            (row.getValue("taskCompletion") as number) >= 80
              ? "bg-emerald-500"
              : (row.getValue("taskCompletion") as number) >= 50
                ? "bg-yellow-500"
                : "bg-red-500"
          }
        />
      </div>
    ),
  },
  {
    id: "tasks",
    header: "Tasks",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm">
        <span className="font-medium">{row.original.tasksCompleted}</span>
        <span className="text-muted-foreground">/</span>
        <span className="text-muted-foreground">{row.original.totalTasks}</span>
      </div>
    ),
  },
  {
    accessorKey: "weekStreak",
    header: "Week Streak",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <div className="bg-orange-500/10 p-1 rounded-md">
          <Flame className="h-3.5 w-3.5 text-orange-500" />
        </div>
        <span className="font-medium text-sm">
          {row.getValue("weekStreak")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "lastActive",
    header: "Last Active",
    cell: ({ row }) => {
      // Handle simplified time strings if needed, but assuming ISO or valid date string
      // If the mock data uses "2h ago", this might break date-fns.
      // Let's check the type definition. It says string.
      // If it's already "2h ago", we should just display it or try to parse.
      // The original just displayed it: {row.original.lastActive}
      // I'll stick to displaying it if it's already formatted, OR try to format if it looks like a date.
      // But to be safe and "more better", I'll assume it might be a date string.
      // However, if the mock data returns "2 hours ago", `new Date("2 hours ago")` is invalid.
      // Let's assume for now we just style the text better.
      return (
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {row.getValue("lastActive")}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <TeamMemberActionsCell memberId={row.original.id} />,
  },
];

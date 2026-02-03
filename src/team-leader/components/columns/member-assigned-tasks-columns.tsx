import { ColumnDef } from "@tanstack/react-table";
import { AssignedTask } from "@/team-leader/typings/team-leader";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { TaskActionsCell } from "./task-actions-cell.component";

// Column definitions for assigned tasks without user (for individual member view)
export const memberAssignedTasksColumns: ColumnDef<
  Omit<AssignedTask, "user">
>[] = [
  {
    accessorKey: "task",
    header: "Task",
    enableSorting: false,
    cell: ({ row }) => (
      <div
        className="font-medium text-sm text-foreground truncate max-w-[250px]"
        title={row.original.task.title}
      >
        {row.original.task.title}
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    enableSorting: false,
    cell: ({ row }) => (
      <div
        className="text-sm text-muted-foreground truncate max-w-[300px]"
        title={row.original.task.description}
      >
        {row.original.task.description}
      </div>
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    accessorFn: (row) => row.task.priority,
    cell: ({ row }) => {
      const priority = row.original.task.priority;
      return (
        <Badge
          variant={priority === "high" ? "destructive" : "secondary"}
          className="capitalize shadow-none"
        >
          {priority}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    accessorFn: (row) => row.task.status,
    cell: ({ row }) => {
      const status = row.original.task.status;
      return (
        <Badge
          className={`capitalize shadow-none ${
            status === "completed"
              ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20"
              : status === "pending"
                ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200 border-slate-200"
          }`}
          variant="outline"
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "assigned_at",
    header: "Assigned At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("assigned_at"));
      return (
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          {format(date, "MMM dd, yyyy • h:mm a")}
        </div>
      );
    },
  },
  {
    accessorKey: "due_date",
    header: "Due Date",
    accessorFn: (row) => row.task.due_date,
    cell: ({ row }) => {
      const date = new Date(row.original.task.due_date);
      return (
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          {format(date, "MMM dd, yyyy • h:mm a")}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableSorting: false,
    cell: ({ row }) => <TaskActionsCell task={row.original.task} />,
  },
];

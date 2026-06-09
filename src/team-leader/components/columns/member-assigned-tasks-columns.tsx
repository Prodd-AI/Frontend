import { ColumnDef } from "@tanstack/react-table";
import { AssignedTask } from "@/team-leader/typings/team-leader";
import { formatDistanceToNowStrict } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { TaskActionsCell } from "./task-actions-cell.component";
import {
  classifyDueDate,
  DUE_DATE_CLASSES,
  parseWallClockIso,
} from "@/shared/utils/date.utils";

const PRIORITY_BADGE_CLASSES: Record<string, string> = {
  high: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
  medium: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
  low: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
};

const STATUS_BADGE_CLASSES: Record<string, string> = {
  completed:
    "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20",
  approved:
    "bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20",
  changes_requested:
    "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 border-orange-500/20",
  pending:
    "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20",
  cancelled: "bg-slate-100 text-slate-500 hover:bg-slate-200 border-slate-200",
};

const formatStatusLabel = (status: string) =>
  status.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

const relativeDate = (value: string | Date) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  const diffMs = date.getTime() - Date.now();
  const distance = formatDistanceToNowStrict(date);
  return diffMs >= 0 ? `in ${distance}` : `${distance} ago`;
};

const relativeDueDate = (value: string | Date | null | undefined) => {
  if (!value) return "—";
  const date = value instanceof Date ? value : parseWallClockIso(String(value));
  if (Number.isNaN(date.getTime())) return "—";
  const diffMs = date.getTime() - Date.now();
  const distance = formatDistanceToNowStrict(date);
  return diffMs >= 0 ? `in ${distance}` : `${distance} ago`;
};

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
        className="text-sm text-muted-foreground truncate max-w-[220px]"
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
          variant="outline"
          className={`capitalize shadow-none ${PRIORITY_BADGE_CLASSES[priority] ?? ""}`}
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
          className={`shadow-none ${STATUS_BADGE_CLASSES[status] ?? STATUS_BADGE_CLASSES.cancelled}`}
          variant="outline"
        >
          {formatStatusLabel(status)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "assigned_at",
    header: "Assigned",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground whitespace-nowrap">
        {relativeDate(row.getValue("assigned_at") as string)}
      </div>
    ),
  },
  {
    accessorKey: "due_date",
    header: "Due",
    accessorFn: (row) => row.task.due_date,
    cell: ({ row }) => {
      const due = row.original.task.due_date;
      const tier = classifyDueDate(due);
      return (
        <div
          className={`text-sm whitespace-nowrap ${DUE_DATE_CLASSES[tier]}`}
          title={tier === "overdue" ? "Overdue" : tier === "soon" ? "Due soon" : undefined}
        >
          {relativeDueDate(due)}
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

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, formatDistanceToNowStrict } from "date-fns";
import {
  CalendarClock,
  CheckCircle2,
  Circle,
  ExternalLink,
  Flag,
  Loader2,
  Pencil,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import BackBreadcrumb from "@/shared/components/back-breadcrumb.component";
import useAuthStore from "@/config/stores/auth.store";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import PageHeader from "@/shared/components/page-header.component";
import EditTaskDialog from "@/team-leader/components/edit-task-dialog.component";
import {
  classifyDueDate,
  DUE_DATE_CLASSES,
  parseWallClockIso,
} from "@/shared/utils/date.utils";
import {
  deleteTask,
  getTaskDetails,
  updateTask,
} from "@/config/services/tasks.service";

const PRIORITY_CLASSES: Record<string, string> = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-blue-50 text-blue-700 border-blue-200",
};

const STATUS_CLASSES: Record<string, string> = {
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
};

const formatDueDateLong = (iso: string | undefined): string => {
  if (!iso) return "—";
  const d = parseWallClockIso(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "EEE, MMM d, yyyy • h:mm a");
};

const formatRelative = (iso: string | undefined): string => {
  if (!iso) return "";
  const d = parseWallClockIso(iso);
  if (Number.isNaN(d.getTime())) return "";
  const diff = d.getTime() - Date.now();
  const distance = formatDistanceToNowStrict(d);
  return diff >= 0 ? `in ${distance}` : `${distance} ago`;
};

const TASKS_LIST_BY_ROLE: Record<string, string> = {
  hr: "/dash/hr",
  team_lead: "/dash/team-lead/tasks",
  team_member: "/dash/team-member/tasks",
};

function TaskDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const role = useAuthStore((s) => s.user?.user.user_role);
  const tasksListPath =
    TASKS_LIST_BY_ROLE[role ?? ""] ?? "/dash/team-member/tasks";
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data: response, isLoading } = useQuery({
    queryKey: ["task-detail", id],
    queryFn: () => getTaskDetails(id),
    enabled: Boolean(id),
  });

  // The endpoint may return either the wrapper { task, ... } or the bare task.
  // Tolerate both so we don't crash on the shape the user observes in prod.
  const raw = response?.data as unknown;
  const task: Task | undefined = (raw as { task?: Task })?.task ?? (raw as Task | undefined);

  const invalidateTaskLists = () => {
    queryClient.invalidateQueries({ queryKey: ["streaks"] });
    queryClient.invalidateQueries({ queryKey: ["team-assigned-tasks"] });
    queryClient.invalidateQueries({ queryKey: ["team-assigned-tasks-by-team"] });
    queryClient.invalidateQueries({ queryKey: ["member-assigned-tasks"] });
    queryClient.invalidateQueries({ queryKey: ["task-detail", id] });
  };

  const { mutate: toggleStatus, isPending: isToggling } = useMutation({
    mutationFn: async (newStatus: "pending" | "completed") => {
      if (!task) return;
      await updateTask(task.id, { status: newStatus });
    },
    onSuccess: () => {
      toast.success("Task status updated");
      invalidateTaskLists();
    },
  });

  const { mutate: removeTask, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      if (!task) return;
      await deleteTask(task.id);
    },
    onSuccess: () => {
      toast.success("Task deleted");
      invalidateTaskLists();
      setIsDeleteOpen(false);
      navigate(-1);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="size-6 text-primary animate-spin" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="space-y-6">
        <BackBreadcrumb
          trail={[
            { label: "Tasks", to: tasksListPath },
            { label: "Not found" },
          ]}
        />
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-muted-foreground">
          Task not found.
        </div>
      </div>
    );
  }

  const dueTier = classifyDueDate(task.due_date);

  return (
    <div className="space-y-6 pb-12">
      <BackBreadcrumb
        trail={[
          { label: "Tasks", to: tasksListPath },
          { label: task.title },
        ]}
      />

      <PageHeader
        title={task.title}
        subtitle="Task details"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              onClick={() =>
                toggleStatus(task.status === "completed" ? "pending" : "completed")
              }
              disabled={isToggling}
              className="gap-2"
            >
              {task.status === "completed" ? (
                <Circle className="size-4" />
              ) : (
                <CheckCircle2 className="size-4" />
              )}
              {task.status === "completed" ? "Mark Pending" : "Mark Completed"}
            </Button>
            <Button variant="outline" onClick={() => setIsEditOpen(true)} className="gap-2">
              <Pencil className="size-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(true)}
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <Trash2 className="size-4" />
              Delete
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-white border border-gray-200 p-6 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={`capitalize ${STATUS_CLASSES[task.status] ?? ""}`}>
              {task.status}
            </Badge>
            <Badge variant="outline" className={`capitalize ${PRIORITY_CLASSES[task.priority] ?? ""}`}>
              <Flag className="size-3 mr-1" />
              {task.priority} priority
            </Badge>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#251F2D] mb-2">
              Description
            </h3>
            <p className="text-sm text-[#4B4357] whitespace-pre-wrap leading-relaxed">
              {task.description || "No description"}
            </p>
          </div>

          {task.external_link && (
            <div>
              <h3 className="text-sm font-semibold text-[#251F2D] mb-2">
                External Link
              </h3>
              <a
                href={task.external_link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline break-all"
              >
                <ExternalLink className="size-4 shrink-0" />
                {task.external_link}
              </a>
            </div>
          )}
        </div>

        <aside className="rounded-2xl bg-white border border-gray-200 p-6 space-y-5">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Due Date
            </h3>
            <div className="flex items-center gap-2">
              <CalendarClock className="size-4 text-muted-foreground" />
              <div className={`text-sm ${DUE_DATE_CLASSES[dueTier]}`}>
                {formatDueDateLong(task.due_date)}
              </div>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatRelative(task.due_date)}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Created
            </h3>
            <div className="flex items-center gap-2">
              <UserIcon className="size-4 text-muted-foreground" />
              <span className="text-sm text-[#251F2D]">
                {task.created_at
                  ? format(new Date(task.created_at), "MMM d, yyyy • h:mm a")
                  : "—"}
              </span>
            </div>
          </div>
        </aside>
      </div>

      <EditTaskDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        task={task}
      />

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this task?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove "{task.title}". This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                removeTask();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default TaskDetailPage;

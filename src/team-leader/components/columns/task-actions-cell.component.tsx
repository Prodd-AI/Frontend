import { useState } from "react";
import {
  MoreHorizontal,
  Loader2,
  FileEdit,
  Pencil,
  Trash2,
  Eye,
  CheckCircle2,
  Circle,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask, deleteTask } from "@/config/services/tasks.service";

// Minimal shape this cell needs — both UserTaskAssignment.task (the ambient
// `Task`) and AssignedTask.task (the team-leader typing) satisfy it without
// dragging in fields like `deleted_at` that aren't always present. Status is
// kept loose because the API can return workflow states before typings catch up.
type CellTask = {
  id: string;
  title: string;
  description: string;
  external_link?: string | null;
  due_date: string;
  priority: "high" | "medium" | "low";
  status: string;
};
import { RequestChangesDialog } from "@/shared/components/request-changes-dialog.component";
import EditTaskDialog from "@/team-leader/components/edit-task-dialog.component";
import { getTaskDetailPath } from "@/shared/utils/task-routes";
import useAuthStore from "@/config/stores/auth.store";

export const TaskActionsCell = ({
  task,
  canRequestChanges = true,
}: {
  task: CellTask;
  /** When false, hides the "Request Changes" item. Team-member personal lists pass false. */
  canRequestChanges?: boolean;
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const role = useAuthStore((s) => s.user?.user.user_role);
  const [isOpen, setIsOpen] = useState(false);
  const [isRequestChangesOpen, setIsRequestChangesOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const invalidateTaskLists = () => {
    queryClient.invalidateQueries({ queryKey: ["team-assigned-tasks"] });
    queryClient.invalidateQueries({ queryKey: ["team-assigned-tasks-by-team"] });
    queryClient.invalidateQueries({ queryKey: ["member-assigned-tasks"] });
    queryClient.invalidateQueries({ queryKey: ["streaks"] });
  };

  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: async (
      newStatus: "pending" | "completed" | "approved" | "changes_requested",
    ) => {
      await updateTask(task.id, { status: newStatus });
    },
    onSuccess: () => {
      toast.success("Task status updated successfully");
      invalidateTaskLists();
      setIsOpen(false);
    },
  });

  const { mutate: requestChanges, isPending: isRequestingChanges } =
    useMutation({
      mutationFn: async (newDescription: string) => {
        await updateTask(task.id, {
          description: newDescription,
          status: "changes_requested",
        });
      },
      onSuccess: () => {
        toast.success("Changes requested successfully");
        invalidateTaskLists();
        setIsRequestChangesOpen(false);
      },
    });

  const handleRequestChanges = (description: string) => {
    requestChanges(description);
  };

  const { mutate: removeTask, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteTask(task.id),
    onSuccess: () => {
      toast.success("Task deleted");
      invalidateTaskLists();
      setIsDeleteOpen(false);
    },
  });

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              setIsOpen(false);
              navigate(getTaskDetailPath(role, task.id));
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Task
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isPending}
            onClick={() =>
              updateStatus(
                task.status === "completed" || task.status === "approved"
                  ? "pending"
                  : "completed",
              )
            }
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                <span>Updating...</span>
              </>
            ) : task.status === "completed" || task.status === "approved" ? (
              <>
                <Circle className="h-4 w-4 mr-2" />
                <span>Mark as Pending</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                <span>Mark as Completed</span>
              </>
            )}
          </DropdownMenuItem>
          {canRequestChanges && task.status === "completed" && (
            <DropdownMenuItem
              disabled={isPending}
              onClick={() => updateStatus("approved")}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4 mr-2" />
              )}
              Approve Completion
            </DropdownMenuItem>
          )}
          {canRequestChanges && task.status === "completed" && (
            <DropdownMenuItem
              onClick={() => {
                setIsOpen(false);
                setIsRequestChangesOpen(true);
              }}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject Completion
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => {
              setIsOpen(false);
              setIsEditOpen(true);
            }}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit Task
          </DropdownMenuItem>
          {canRequestChanges && task.status !== "completed" && (
            <DropdownMenuItem
              onClick={() => {
                setIsOpen(false);
                setIsRequestChangesOpen(true);
              }}
            >
              <FileEdit className="h-4 w-4 mr-2" />
              Request Changes
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 focus:text-red-700 focus:bg-red-50"
            onClick={() => {
              setIsOpen(false);
              setIsDeleteOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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

      {canRequestChanges && (
        <RequestChangesDialog
          isOpen={isRequestChangesOpen}
          onClose={() => setIsRequestChangesOpen(false)}
          onSendRequest={handleRequestChanges}
          isLoading={isRequestingChanges}
        />
      )}
    </>
  );
};

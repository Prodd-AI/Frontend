import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogClose } from "@radix-ui/react-dialog";
import { DatePickerField } from "@/shared/components/date-picker-field.component";
import { TimePicker } from "@/components/ui/time-picker";
import { updateTask } from "@/config/services/tasks.service";

const schema = z.object({
  external_link: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^https?:\/\/.+\..+/.test(val),
      "External link must be a valid URL",
    ),
  title: z
    .string()
    .trim()
    .min(4, "Title must be at least 4 characters")
    .max(25, "Title must not exceed 25 characters"),
  description: z
    .string()
    .trim()
    .min(8, "Description must be at least 8 characters")
    .max(400, "Description must not exceed 400 characters"),
  due_date: z.string().min(1, "Due date is required"),
  due_time: z.string().min(1, "Due time is required"),
  priority: z.enum(["low", "medium", "high"]),
});

type EditTaskFormData = z.infer<typeof schema>;

interface EditTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
}

// Backend stores wall-clock-as-UTC. Split a stored ISO into picker values
// without applying a timezone shift.
const splitStoredDueDate = (
  due_date: string | undefined,
): { date: string; time: string } => {
  if (!due_date) return { date: "", time: "9:00 AM" };
  const naive = due_date.replace(/(?:Z|[+-]\d{2}:?\d{2})$/, "");
  const d = new Date(naive);
  if (Number.isNaN(d.getTime())) return { date: "", time: "9:00 AM" };
  const date = format(d, "yyyy-MM-dd");
  let hh = d.getHours();
  const mm = d.getMinutes();
  const period = hh >= 12 ? "PM" : "AM";
  hh = hh % 12;
  if (hh === 0) hh = 12;
  const time = `${hh.toString().padStart(2, "0")}:${mm
    .toString()
    .padStart(2, "0")} ${period}`;
  return { date, time };
};

export const EditTaskDialog = ({
  isOpen,
  onClose,
  task,
}: EditTaskDialogProps) => {
  const queryClient = useQueryClient();
  const initial = splitStoredDueDate(task.due_date);

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<EditTaskFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      external_link: task.external_link ?? "",
      title: task.title,
      description: task.description,
      due_date: initial.date,
      due_time: initial.time,
      priority: task.priority,
    },
  });

  // Reset whenever a different task is opened so the form reflects the new row.
  useEffect(() => {
    if (!isOpen) return;
    const next = splitStoredDueDate(task.due_date);
    reset({
      external_link: task.external_link ?? "",
      title: task.title,
      description: task.description,
      due_date: next.date,
      due_time: next.time,
      priority: task.priority,
    });
  }, [isOpen, task, reset]);

  const invalidateTaskLists = () => {
    queryClient.invalidateQueries({ queryKey: ["streaks"] });
    queryClient.invalidateQueries({ queryKey: ["team-assigned-tasks"] });
    queryClient.invalidateQueries({ queryKey: ["team-assigned-tasks-by-team"] });
    queryClient.invalidateQueries({ queryKey: ["member-assigned-tasks"] });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (values: EditTaskFormData) => {
      const [timePart, period] = values.due_time.split(" ");
      const [hStr, mStr] = timePart.split(":");
      let hh = Number(hStr);
      const mm = Number(mStr);
      if (period === "PM" && hh !== 12) hh += 12;
      if (period === "AM" && hh === 12) hh = 0;
      const due_date = `${values.due_date} ${hh
        .toString()
        .padStart(2, "0")}:${mm.toString().padStart(2, "0")}`;
      // Backend requires `status` on PATCH /tasks/{id} even when only editing
      // other fields, so we forward the existing status unchanged.
      return updateTask(task.id, {
        title: values.title,
        description: values.description,
        priority: values.priority,
        due_date,
        external_link: values.external_link || undefined,
        status: task.status,
      });
    },
    onSuccess: (res) => {
      toast.success(res?.message ?? "Task updated");
      invalidateTaskLists();
      onClose();
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={(v) => (v ? null : onClose())}>
      <DialogContent className="!min-w-[40rem]">
        <form
          onSubmit={handleSubmit((values) => mutate(values))}
          className="w-full mx-auto p-4 bg-card rounded-2xl shadow-form max-h-[80vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle className="text-black text-[1.375rem]">
              Edit Task
            </DialogTitle>
          </DialogHeader>

          <div className="mb-5 mt-[1.5rem]">
            <Label className="block text-sm font-medium text-foreground mb-2">
              External Platform Link (Optional)
            </Label>
            <div className="relative">
              <Input
                type="url"
                placeholder="https://jira.company/task/123"
                className="h-12 bg-gray-50/80 border border-gray-200/60 rounded-xl text-sm pr-10"
                {...register("external_link")}
              />
              <ExternalLink className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            {errors.external_link && (
              <p className="text-red-500 text-sm mt-1">
                {errors.external_link.message}
              </p>
            )}
          </div>

          <div className="mb-5">
            <Label className="block text-sm font-medium text-foreground mb-2">
              Task Title <span className="text-destructive">*</span>
            </Label>
            <Input
              {...register("title")}
              type="text"
              placeholder="Enter task title"
              className="h-12 bg-gray-50/80 border border-gray-200/60 rounded-xl text-sm"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div className="mb-5">
            <Label className="block text-sm font-medium text-foreground mb-2">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              {...register("description")}
              placeholder="Task description"
              rows={4}
              className="bg-gray-50/80 border border-gray-200/60 rounded-xl text-sm"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="space-y-2">
              <Label className="block text-sm font-medium text-foreground">
                Due Date <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="due_date"
                control={control}
                render={({ field }) => (
                  <DatePickerField
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select date"
                    outputFormat="string"
                    dateStringFormat="yyyy-MM-dd"
                  />
                )}
              />
              {errors.due_date && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.due_date.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="block text-sm font-medium text-foreground">
                Due Time <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="due_time"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select time"
                  />
                )}
              />
              {errors.due_time && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.due_time.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="block text-sm font-medium text-foreground">
                Priority <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="!h-12 w-full bg-gray-50/80 border border-gray-200/60 rounded-xl text-sm">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200/80 rounded-xl shadow-lg">
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.priority && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.priority.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-[1.5rem]">
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary" className="px-8">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskDialog;

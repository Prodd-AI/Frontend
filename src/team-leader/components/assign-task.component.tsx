import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { GoPlus } from "react-icons/go";
import { DialogClose } from "@radix-ui/react-dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getTeamMembers, getTeams } from "@/config/services/teams.service";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { assignTasks } from "@/config/services/tasks.service";
import { toast } from "sonner";
import { TeamTabs } from "@/shared/components/team-tabs.component";
import { TeamMemberSelector } from "@/shared/components/team-member-selector.component";
import { DatePickerField } from "@/shared/components/date-picker-field.component";

const schema = z.object({
  external_link: z.url("External link must be a valid URL"),

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

  assigned_to: z
    .array(z.string().trim().min(1, "Invalid assignee ID"))
    .min(1, "At least one assignee is required")
    .refine(
      (arr) => new Set(arr).size === arr.length,
      "Duplicate assignees are not allowed",
    ),

  due_date: z
    .string({ error: "Due date is required" })
    .min(1, "Due date is required"),

  priority: z.enum(["low", "medium", "high"], {
    error: "Priority must be low, medium, or high",
  }),
});

type AssignTaskFormData = z.infer<typeof schema>;

const AssignTask = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <GoPlus />
        Assign Task
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className=" !min-w-[40rem]">
          <AssignTaskForm onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AssignTask;

interface AssignTaskFormProps {
  onSuccess?: () => void;
}

const AssignTaskForm = ({ onSuccess }: AssignTaskFormProps) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm<AssignTaskFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      assigned_to: [],
      priority: "medium",
    },
  });

  const selectedAssignees = watch("assigned_to");

  // Fetch teams
  const { data: teamsData, isLoading: teamsLoading } = useQuery({
    queryKey: ["teams"],
    queryFn: () => getTeams(),
  });

  const teams =
    teamsData?.data?.map((team) => ({
      team_id: team.id,
      team_name: team.name,
    })) ?? [];

  const activeTeamId = selectedTeamId ?? teams[0]?.team_id;

  const { data: teamMembersData, isLoading: membersLoading } = useQuery({
    queryKey: ["team-members", activeTeamId],
    queryFn: () => getTeamMembers(activeTeamId ?? ""),
    enabled: !!activeTeamId,
  });

  const teamMembers = teamMembersData?.data ?? [];

  const { mutate, isPending } = useMutation({
    mutationFn: assignTasks,
    onSuccess: (res) => {
      toast.success(`${res.message}`);
      reset();
      setTimeout(() => {
        onSuccess?.();
      }, 1000);
    },
  });

  const onSubmit = (values: AssignTaskFormData) => {
    mutate(values);
  };

  const toggleAssignee = (id: string) => {
    if (selectedAssignees.includes(id)) {
      setValue(
        "assigned_to",
        selectedAssignees.filter((i) => i !== id),
      );
    } else {
      setValue("assigned_to", [...selectedAssignees, id]);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full mx-auto p-4 bg-card rounded-2xl shadow-form max-h-[80vh] overflow-y-auto"
    >
      <DialogHeader>
        <DialogTitle className=" text-black text-[1.375rem]">
          Assign New Task
        </DialogTitle>
      </DialogHeader>

      {/* External Platform Link */}
      <div className="mb-5 mt-[1.5rem]">
        <Label
          htmlFor="external_link"
          className="block text-sm font-medium text-foreground mb-2"
        >
          External Platform Link (Optional)
        </Label>
        <div className="relative">
          <Input
            id="external_link"
            type="url"
            placeholder="https://jira.company/task/123"
            className="h-12 bg-gray-50/80 border border-gray-200/60 rounded-xl text-sm pr-10 transition-all duration-200 focus:bg-white focus:border-primary/30 focus:ring-1 focus:ring-primary/20"
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

      {/* Task Title */}
      <div className="mb-5">
        <Label
          htmlFor="title"
          className="block text-sm font-medium text-foreground mb-2"
        >
          Task Title <span className="text-destructive">*</span>
        </Label>
        <Input
          {...register("title")}
          id="title"
          type="text"
          placeholder="Enter task title"
          className="h-12 bg-gray-50/80 border border-gray-200/60 rounded-xl text-sm transition-all duration-200 focus:bg-white focus:border-primary/30 focus:ring-1 focus:ring-primary/20"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="mb-5">
        <Label
          htmlFor="description"
          className="block text-sm font-medium text-foreground mb-2"
        >
          Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          {...register("description")}
          id="description"
          placeholder="Task description"
          rows={4}
          className="bg-gray-50/80 border border-gray-200/60 rounded-xl text-sm transition-all duration-200 focus:bg-white focus:border-primary/30 focus:ring-1 focus:ring-primary/20"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Assign to */}
      <div className="mb-5">
        <Label className="block text-sm font-medium text-foreground mb-2">
          Assign to <span className="text-destructive">*</span>
        </Label>

        {/* Team Tabs */}
        <TeamTabs
          teams={teams}
          activeTeamId={activeTeamId}
          onSelectTeam={setSelectedTeamId}
          isLoading={teamsLoading}
          className="mb-3"
        />

        {/* Team Members List */}
        <div className="border border-gray-200/60 rounded-xl max-h-48 overflow-y-auto">
          <TeamMemberSelector
            members={teamMembers}
            selectedValues={selectedAssignees}
            onToggle={toggleAssignee}
            isLoading={membersLoading}
            emptyMessage="No team members found"
            valueKey="id"
          />
        </div>
        {errors.assigned_to && (
          <p className="text-red-500 text-sm mt-1">
            {errors.assigned_to.message}
          </p>
        )}
      </div>

      {/* Due Date & Priority Row */}
      <div className="grid grid-cols-2 gap-4 mb-8">
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
            Priority <span className="text-destructive">*</span>
          </Label>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="!h-12 w-full bg-gray-50/80 border border-gray-200/60 rounded-xl text-sm transition-all duration-200 focus:bg-white focus:border-primary/30 focus:ring-1 focus:ring-primary/20 focus:outline-none [&>span]:text-foreground">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200/80 rounded-xl shadow-lg">
                  <SelectItem value="low" className="rounded-lg cursor-pointer">
                    Low
                  </SelectItem>
                  <SelectItem
                    value="medium"
                    className="rounded-lg cursor-pointer"
                  >
                    Medium
                  </SelectItem>
                  <SelectItem
                    value="high"
                    className="rounded-lg cursor-pointer"
                  >
                    High
                  </SelectItem>
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

      {/* Action Buttons */}
      <div className="flex justify-end gap-[1.5rem]">
        <DialogFooter>
          <DialogClose>
            <Button type="button" variant="secondary" className="px-8">
              Cancel
            </Button>
          </DialogClose>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create Task"}
          </Button>
        </DialogFooter>
      </div>
    </form>
  );
};

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Video, Users, X } from "lucide-react";
import { TimePicker } from "@/components/ui/time-picker";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMyTeams,
  getTeamMembers,
  getTeams,
} from "@/config/services/teams.service";
import { schedule_meeting } from "@/config/services/meeting.service";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthStore from "@/config/stores/auth.store";
import { TeamTabs } from "./team-tabs.component";
import {
  TeamMemberSelector,
  TeamMember,
} from "./team-member-selector.component";
import { DatePickerField } from "./date-picker-field.component";

export type ScheduleMeetingType =
  | "1:1"
  | "Team Sync"
  | "Review"
  | "All Hands"
  | "Workshop"
  | "other";

export interface ScheduleMeetingDefaultValues {
  title?: string;
  type?: ScheduleMeetingType;
  description?: string;
  attendee_emails?: string[];
  /** When set (e.g. from flight risk 1:1), this team is selected first so prefilled attendees appear in the list */
  defaultTeamId?: string;
}

interface ScheduleMeetingProps {
  onCancel?: () => void;
  onSchedule?: () => void;
  /** Prefill form when opening (e.g. from flight risk "Schedule 1:1") */
  defaultValues?: ScheduleMeetingDefaultValues;
}

const schema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters"),

  type: z.enum(
    ["1:1", "Team Sync", "Review", "All Hands", "Workshop", "other"],
    {
      error: "Please select a meeting type",
    },
  ),

  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional(),

  date: z.date({
    error: "Please select a date",
  }),

  time: z.string().min(1, "Please select a time"),

  attendee_emails: z
    .array(z.email())
    .min(1, "At least one attendee is required"),

  meeting_link: z
    .url("Please enter a valid URL")
    .min(1, "Meeting link is required"),
});

type ScheduleMeetingFormData = z.infer<typeof schema>;

const ScheduleMeeting = ({
  onCancel,
  onSchedule,
  defaultValues: defaultValuesProp,
}: ScheduleMeetingProps) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(
    defaultValuesProp?.defaultTeamId ?? null,
  );
  const user = useAuthStore((state) => state.user);
  const role = user?.user.user_role;
  const restrictToOwnTeams = role === "team_lead";
  const queryClient = useQueryClient();

  useEffect(() => {
    if (defaultValuesProp?.defaultTeamId)
      setSelectedTeamId(defaultValuesProp.defaultTeamId);
  }, [defaultValuesProp?.defaultTeamId]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ScheduleMeetingFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: defaultValuesProp?.title ?? "",
      type: defaultValuesProp?.type ?? undefined,
      description: defaultValuesProp?.description ?? "",
      // Auto-include the organizer so they don't have to add themselves
      // before submitting.
      attendee_emails: (() => {
        const seed = defaultValuesProp?.attendee_emails ?? [];
        const me = user?.user.email;
        if (!me) return seed;
        return seed.includes(me) ? seed : [me, ...seed];
      })(),
    },
  });

  useEffect(() => {
    if (!defaultValuesProp) return;
    const seed = defaultValuesProp.attendee_emails ?? [];
    const me = user?.user.email;
    const withOrganizer = me && !seed.includes(me) ? [me, ...seed] : seed;
    reset({
      title: defaultValuesProp.title ?? "",
      type: defaultValuesProp.type,
      description: defaultValuesProp.description ?? "",
      attendee_emails: withOrganizer,
    } as Partial<ScheduleMeetingFormData>);
  }, [defaultValuesProp, reset, user?.user.email]);

  const selectedAttendeeEmails = watch("attendee_emails");

  // The two team endpoints return different shapes; normalize to a common
  // `{ data: TeamRow[] }` so React Query has a single type to infer.
  type TeamRow = {
    id?: string;
    name?: string;
    team?: { id: string; name: string };
  };
  const { data: teamsData, isLoading: teamsLoading } = useQuery<{
    data: TeamRow[];
  }>({
    queryKey: [
      "schedule-meeting-teams",
      restrictToOwnTeams ? "mine" : "all",
    ],
    queryFn: async () => {
      const res = restrictToOwnTeams ? await getMyTeams() : await getTeams();
      return { data: (res?.data ?? []) as TeamRow[] };
    },
  });

  // /teams/me returns rows like { team: {...} }; /teams returns the team
  // directly. Normalize both into a single { team_id, team_name }[] list.
  const teams = (teamsData?.data ?? [])
    .map((row) => {
      const t = row.team ?? row;
      if (!t?.id || !t?.name) return null;
      return { team_id: t.id, team_name: t.name };
    })
    .filter(
      (x): x is { team_id: string; team_name: string } => x !== null,
    );

  const activeTeamId = selectedTeamId ?? teams[0]?.team_id;

  const { data: teamMembersData, isLoading: membersLoading } = useQuery({
    queryKey: ["team-members", activeTeamId],
    queryFn: () => getTeamMembers(activeTeamId ?? ""),
    enabled: !!activeTeamId,
  });

  // Drop the HR-role member — HR shows on every team and shouldn't appear in
  // attendee pickers (matches the Team Analysis member-count rule).
  const teamMembers: TeamMember[] = (teamMembersData?.data ?? []).filter(
    (m: TeamMember & { user_role?: string }) => m.user_role !== "hr",
  );

  const { mutate, isPending } = useMutation({
    mutationFn: schedule_meeting,
    onSuccess: () => {
      reset();
      toast.success("Meeting scheduled successfully!");
      // Refresh any meeting lists/cards so the new meeting shows up
      // without a page reload.
      queryClient.invalidateQueries({ queryKey: ["upcoming-meetings-today"] });
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      onSchedule?.();
    },
  });

  const convertTo24Hour = (time12h: string): string => {
    const [timePart, period] = time12h.split(" ");
    const [hoursStr, minutesStr] = timePart.split(":");
    let hours = Number(hoursStr);
    const minutes = Number(minutesStr);

    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  const onSubmit = (values: ScheduleMeetingFormData) => {
    // Send the picker's local wall-clock date/time exactly as selected — no
    // timezone conversion. Backend stores what's sent, and the user expects
    // "10:00" picked locally to be "10:00" in the payload.
    const y = values.date.getFullYear();
    const m = String(values.date.getMonth() + 1).padStart(2, "0");
    const d = String(values.date.getDate()).padStart(2, "0");
    mutate({
      title: values.title,
      type: values.type,
      description: values.description ?? "",
      date: `${y}-${m}-${d}`,
      time: convertTo24Hour(values.time),
      attendee_emails: values.attendee_emails,
      meeting_link: values.meeting_link,
    });
  };

  const toggleAttendee = (email: string) => {
    const current = selectedAttendeeEmails;
    if (current.includes(email)) {
      setValue(
        "attendee_emails",
        current.filter((e) => e !== email),
      );
    } else {
      setValue("attendee_emails", [...current, email]);
    }
  };

  // "Select entire team" — add/remove every member of the active team.
  const teamEmails = teamMembers.map((m) => m.email);
  const isWholeTeamSelected =
    teamEmails.length > 0 &&
    teamEmails.every((email) => selectedAttendeeEmails.includes(email));
  const toggleWholeTeam = () => {
    if (isWholeTeamSelected) {
      setValue(
        "attendee_emails",
        selectedAttendeeEmails.filter((e) => !teamEmails.includes(e)),
      );
    } else {
      const merged = Array.from(
        new Set([...selectedAttendeeEmails, ...teamEmails]),
      );
      setValue("attendee_emails", merged);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-h-[80vh] overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center">
          <Video className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Schedule Meeting
          </h2>
          <p className="text-sm text-muted-foreground">
            Set up a new team meeting
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Meeting Title */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Meeting Title <span className="text-destructive">*</span>
          </Label>
          <Input
            {...register("title")}
            placeholder="e.g Weekly Check-in"
            className="h-12 bg-gray-50/80 border border-gray-200/60 rounded-xl text-sm placeholder:text-muted-foreground/50 transition-all duration-200 focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        {/* Meeting Link */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Meeting Link <span className="text-destructive">*</span>
          </Label>
          <Input
            {...register("meeting_link")}
            placeholder="e.g. https://zoom.us/j/..."
            className="h-12 bg-gray-50/80 border border-gray-200/60 rounded-xl text-sm placeholder:text-muted-foreground/50 transition-all duration-200 focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
          />
          {errors.meeting_link && (
            <p className="text-red-500 text-sm">
              {errors.meeting_link.message}
            </p>
          )}
        </div>

        {/* Meeting Type */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Meeting Type <span className="text-destructive">*</span>
          </Label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="h-12 bg-gray-50/80 border border-gray-200/60 rounded-xl text-sm transition-all duration-200 focus:bg-white focus:border-primary/30 focus:ring-1 focus:ring-primary/20 focus:outline-none [&>span]:text-foreground [&:not([data-state=open])>span:empty]:text-muted-foreground/50">
                  <SelectValue placeholder="Select Meeting Type" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200/80 rounded-xl shadow-lg">
                  <SelectItem value="1:1" className="rounded-lg cursor-pointer">
                    1:1
                  </SelectItem>
                  <SelectItem
                    value="Team Sync"
                    className="rounded-lg cursor-pointer"
                  >
                    Team Sync
                  </SelectItem>
                  <SelectItem
                    value="Review"
                    className="rounded-lg cursor-pointer"
                  >
                    Review
                  </SelectItem>
                  <SelectItem
                    value="All Hands"
                    className="rounded-lg cursor-pointer"
                  >
                    All Hands
                  </SelectItem>
                  <SelectItem
                    value="Workshop"
                    className="rounded-lg cursor-pointer"
                  >
                    Workshop
                  </SelectItem>
                  <SelectItem
                    value="other"
                    className="rounded-lg cursor-pointer"
                  >
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.type && (
            <p className="text-red-500 text-sm">{errors.type.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Description
          </Label>
          <Textarea
            {...register("description")}
            placeholder="Meeting agenda and notes..."
            className="min-h-[100px] bg-gray-50/80 border border-gray-200/60 rounded-xl text-sm placeholder:text-muted-foreground/50 resize-none transition-all duration-200 focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Date <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <DatePickerField
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select date"
                  outputFormat="date"
                  className="h-[55px] "
                />
              )}
            />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Time <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="time"
              control={control}
              render={({ field }) => (
                <TimePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select time"
                />
              )}
            />
            {errors.time && (
              <p className="text-red-500 text-sm">{errors.time.message}</p>
            )}
          </div>
        </div>

        {/* Attendees — same inline TeamTabs + TeamMemberSelector pattern as
            the Assign Task modal. */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-foreground">
              Attendees <span className="text-destructive">*</span>
            </Label>
            {teamEmails.length > 0 && (
              <button
                type="button"
                onClick={toggleWholeTeam}
                className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                {isWholeTeamSelected ? "Clear team" : "Select entire team"}
              </button>
            )}
          </div>

          <TeamTabs
            teams={teams}
            activeTeamId={activeTeamId}
            onSelectTeam={setSelectedTeamId}
            isLoading={teamsLoading}
            className="mb-3"
          />

          <div className="border border-gray-200/60 rounded-xl max-h-48 overflow-y-auto">
            <TeamMemberSelector
              members={teamMembers}
              selectedValues={selectedAttendeeEmails}
              onToggle={toggleAttendee}
              isLoading={membersLoading}
              emptyMessage="No team members found"
              valueKey="email"
            />
          </div>
          {errors.attendee_emails && (
            <p className="text-red-500 text-sm mt-1">
              {errors.attendee_emails.message}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="h-11 px-6 rounded-xl text-muted-foreground font-medium transition-all duration-200 hover:bg-gray-100 hover:text-foreground"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="h-11 px-6 rounded-xl bg-primary text-white font-medium transition-all duration-200 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
          >
            <Users className="w-4 h-4 mr-2" />
            {isPending ? "Scheduling..." : "Schedule Meeting"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ScheduleMeeting;

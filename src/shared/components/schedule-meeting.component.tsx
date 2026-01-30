import { useState } from "react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Video, Users, Plus, X, Search } from "lucide-react";
import { TimePicker } from "@/components/ui/time-picker";
import { format } from "date-fns";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getTeamMembers, getTeams } from "@/config/services/teams.service";
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

interface ScheduleMeetingProps {
  onCancel?: () => void;
  onSchedule?: () => void;
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

const ScheduleMeeting = ({ onCancel, onSchedule }: ScheduleMeetingProps) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAttendeePopoverOpen, setIsAttendeePopoverOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

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
      attendee_emails: [],
      description: "",
    },
  });

  const selectedAttendeeEmails = watch("attendee_emails");

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

  const teamMembers: TeamMember[] = teamMembersData?.data ?? [];

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const { mutate, isPending } = useMutation({
    mutationFn: schedule_meeting,
    onSuccess: () => {
      reset();
      onSchedule?.();
    },
    onError: (error) => {
      console.error("Failed to schedule meeting:", error);
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
    mutate({
      title: values.title,
      type: values.type,
      description: values.description ?? "",
      date: format(values.date, "yyyy-MM-dd"),
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

  const removeAttendee = (email: string) => {
    setValue(
      "attendee_emails",
      selectedAttendeeEmails.filter((e) => e !== email),
    );
  };

  const getSelectedMemberDetails = () => {
    return teamMembers.filter((m) => selectedAttendeeEmails.includes(m.email));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-[680px] max-h-[80vh] overflow-y-auto"
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

        {/* Attendees */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-foreground">
              Attendees <span className="text-destructive">*</span>
            </Label>
            <Popover
              open={isAttendeePopoverOpen}
              onOpenChange={setIsAttendeePopoverOpen}
            >
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add attendee
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80 p-0 bg-white border-gray-200/80 rounded-xl shadow-xl"
                align="end"
              >
                {/* Team Tabs */}
                <TeamTabs
                  teams={teams}
                  activeTeamId={activeTeamId}
                  onSelectTeam={setSelectedTeamId}
                  isLoading={teamsLoading}
                  className="p-3 border-b border-gray-100"
                />

                {/* Search */}
                <div className="p-3 border-b border-gray-100">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    <Input
                      placeholder="Search team members..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-10 pl-9 bg-gray-50/80 border-gray-200/60 rounded-lg text-sm placeholder:text-muted-foreground/50"
                    />
                  </div>
                </div>

                {/* Team members list */}
                <div className="max-h-64 overflow-y-auto p-2">
                  <TeamMemberSelector
                    members={filteredMembers}
                    selectedValues={selectedAttendeeEmails}
                    onToggle={toggleAttendee}
                    isLoading={membersLoading}
                    emptyMessage="No members found"
                    valueKey="email"
                  />
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-gray-100 bg-gray-50/50">
                  <p className="text-xs text-muted-foreground text-center">
                    {selectedAttendeeEmails.length} attendee
                    {selectedAttendeeEmails.length !== 1 ? "s" : ""} selected
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="p-4 bg-gray-50/60 rounded-xl border border-gray-100/80">
            <div className="flex items-center gap-4">
              {/* You (Organizer) */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="w-10 h-10 ring-2 ring-white">
                    <AvatarImage src={user?.user?.avatar_url ?? ""} alt="You" />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-sm font-medium">
                      {user?.user?.first_name?.[0]}
                      {user?.user?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    {user?.user?.first_name ?? "You"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Organizer
                  </span>
                </div>
              </div>

              {getSelectedMemberDetails().length > 0 && (
                <>
                  <div className="w-px h-8 bg-gray-200/80" />

                  {/* Selected attendees */}
                  <div className="flex items-center gap-2 flex-1 flex-wrap">
                    {getSelectedMemberDetails().map((member) => (
                      <div
                        key={member.id}
                        className="group relative flex items-center gap-2 pl-1 pr-2 py-1 bg-white rounded-full border border-gray-200/80 shadow-sm transition-all duration-150 hover:border-gray-300"
                      >
                        <Avatar className="w-6 h-6">
                          <AvatarImage
                            src={member.avatar_url ?? ""}
                            alt={`${member.first_name} ${member.last_name}`}
                          />
                          <AvatarFallback className="bg-gray-100 text-muted-foreground text-[10px] font-medium">
                            {member.first_name[0]}
                            {member.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium text-foreground">
                          {member.first_name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeAttendee(member.email)}
                          className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200"
                        >
                          <X className="w-2.5 h-2.5 text-muted-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          {errors.attendee_emails && (
            <p className="text-red-500 text-sm">
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

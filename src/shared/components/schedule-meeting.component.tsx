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
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarIcon,
  Clock,
  User,
  Video,
  Users,
  Plus,
  X,
  Search,
  Check,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ScheduleMeetingProps {
  onCancel?: () => void;
  onSchedule?: () => void;
}

interface Attendee {
  id: number;
  name: string;
  email: string;
  image: string;
}

const availableTeamMembers: Attendee[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@company.com",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Mike Williams",
    email: "mike.williams@company.com",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@company.com",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
  },
  {
    id: 5,
    name: "Alex Chen",
    email: "alex.chen@company.com",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face",
  },
  {
    id: 6,
    name: "Lisa Brown",
    email: "lisa.brown@company.com",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=32&h=32&fit=crop&crop=face",
  },
];

const ScheduleMeeting = ({ onCancel, onSchedule }: ScheduleMeetingProps) => {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [selectedAttendees, setSelectedAttendees] = useState<Attendee[]>([
    availableTeamMembers[0],
    availableTeamMembers[1],
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAttendeePopoverOpen, setIsAttendeePopoverOpen] = useState(false);

  const filteredMembers = availableTeamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleAttendee = (attendee: Attendee) => {
    setSelectedAttendees((prev) => {
      const isSelected = prev.some((a) => a.id === attendee.id);
      if (isSelected) {
        return prev.filter((a) => a.id !== attendee.id);
      } else {
        return [...prev, attendee];
      }
    });
  };

  const removeAttendee = (attendeeId: number) => {
    setSelectedAttendees((prev) => prev.filter((a) => a.id !== attendeeId));
  };

  const isSelected = (attendeeId: number) =>
    selectedAttendees.some((a) => a.id === attendeeId);

  return (
    <div className="w-full max-w-[680px]">
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
            placeholder="e.g Weekly Check-in"
            className="h-12 bg-gray-50/80 border border-gray-200/60 rounded-xl text-sm placeholder:text-muted-foreground/50 transition-all duration-200 focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
          />
        </div>

        {/* Meeting Type */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Meeting Type <span className="text-destructive">*</span>
          </Label>
          <Select>
            <SelectTrigger className="h-12 bg-gray-50/80 border border-gray-200/60 rounded-xl text-sm transition-all duration-200 focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/10 [&>span]:text-muted-foreground/50 [&[data-state=open]>span]:text-foreground">
              <SelectValue placeholder="Select Meeting Type" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200/80 rounded-xl shadow-lg">
              <SelectItem value="standup" className="rounded-lg cursor-pointer">
                Daily Standup
              </SelectItem>
              <SelectItem value="review" className="rounded-lg cursor-pointer">
                Sprint Review
              </SelectItem>
              <SelectItem
                value="planning"
                className="rounded-lg cursor-pointer"
              >
                Planning Session
              </SelectItem>
              <SelectItem
                value="one-on-one"
                className="rounded-lg cursor-pointer"
              >
                One-on-One
              </SelectItem>
              <SelectItem
                value="brainstorm"
                className="rounded-lg cursor-pointer"
              >
                Brainstorming
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Description
          </Label>
          <Textarea
            placeholder="Meeting agenda and notes..."
            className="min-h-[100px] bg-gray-50/80 border border-gray-200/60 rounded-xl text-sm placeholder:text-muted-foreground/50 resize-none transition-all duration-200 focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
          />
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Date <span className="text-destructive">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "h-12 w-full justify-between text-left font-normal bg-gray-50/80 border border-gray-200/60 rounded-xl text-sm transition-all duration-200 hover:bg-gray-100/80 hover:border-gray-300/60",
                    !date && "text-muted-foreground/50"
                  )}
                >
                  {date ? format(date, "MMM dd, yyyy") : "Select date"}
                  <CalendarIcon className="h-4 w-4 text-muted-foreground/60" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 bg-white border-gray-200/80 rounded-xl shadow-lg"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Time <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="h-12 bg-gray-50/80 border border-gray-200/60 rounded-xl text-sm pr-10 transition-all duration-200 focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
              />
              <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Attendees */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-foreground">
              Attendees
            </Label>
            <Popover
              open={isAttendeePopoverOpen}
              onOpenChange={setIsAttendeePopoverOpen}
            >
              <PopoverTrigger asChild>
                <button className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                  <Plus className="h-3.5 w-3.5" />
                  Add attendee
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80 p-0 bg-white border-gray-200/80 rounded-xl shadow-xl"
                align="end"
              >
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
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                      <button
                        key={member.id}
                        onClick={() => toggleAttendee(member)}
                        className={cn(
                          "w-full flex items-center gap-3 p-2.5 rounded-lg transition-all duration-150",
                          isSelected(member.id)
                            ? "bg-primary/5 hover:bg-primary/10"
                            : "hover:bg-gray-50"
                        )}
                      >
                        <Avatar className="w-9 h-9 border border-gray-100">
                          <AvatarImage src={member.image} alt={member.name} />
                          <AvatarFallback className="bg-gray-100 text-muted-foreground text-xs font-medium">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-foreground">
                            {member.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {member.email}
                          </p>
                        </div>
                        <div
                          className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-150",
                            isSelected(member.id)
                              ? "border-primary bg-primary"
                              : "border-gray-300"
                          )}
                        >
                          {isSelected(member.id) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-6">
                      No members found
                    </p>
                  )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-gray-100 bg-gray-50/50">
                  <p className="text-xs text-muted-foreground text-center">
                    {selectedAttendees.length} attendee
                    {selectedAttendees.length !== 1 ? "s" : ""} selected
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
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-2 ring-white">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    You
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Organizer
                  </span>
                </div>
              </div>

              {selectedAttendees.length > 0 && (
                <>
                  <div className="w-px h-8 bg-gray-200/80" />

                  {/* Selected attendees */}
                  <div className="flex items-center gap-2 flex-1 flex-wrap">
                    {selectedAttendees.map((attendee) => (
                      <div
                        key={attendee.id}
                        className="group relative flex items-center gap-2 pl-1 pr-2 py-1 bg-white rounded-full border border-gray-200/80 shadow-sm transition-all duration-150 hover:border-gray-300"
                      >
                        <Avatar className="w-6 h-6">
                          <AvatarImage
                            src={attendee.image}
                            alt={attendee.name}
                          />
                          <AvatarFallback className="bg-gray-100 text-muted-foreground text-[10px] font-medium">
                            {attendee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium text-foreground">
                          {attendee.name.split(" ")[0]}
                        </span>
                        <button
                          onClick={() => removeAttendee(attendee.id)}
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
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="h-11 px-6 rounded-xl text-muted-foreground font-medium transition-all duration-200 hover:bg-gray-100 hover:text-foreground"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={onSchedule}
            className="h-11 px-6 rounded-xl bg-primary text-white font-medium transition-all duration-200 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
          >
            <Users className="w-4 h-4 mr-2" />
            Schedule Meeting
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleMeeting;

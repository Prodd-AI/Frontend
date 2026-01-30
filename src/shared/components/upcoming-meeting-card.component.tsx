import { Clock, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { MeetingData } from "@/team-leader/typings/team-leader";

export interface UpcomingMeetingProps {
  meeting: MeetingData;
  className?: string;
}

const getBadgeStyles = (badge: string): string => {
  const normalizedBadge = badge.toLowerCase();

  if (normalizedBadge === "tomorrow") {
    return "bg-amber-100 text-[#E38F2B]";
  }
  if (normalizedBadge === "today") {
    return "bg-[#E3E6EA] text-[#6B7280]";
  }
  return "bg-amber-100 text-[#E38F2B]";
};

const UpcomingMeeting = ({ meeting, className }: UpcomingMeetingProps) => {
  return (
    <div
      className={cn(
        "bg-[#F3F4F6] rounded-2xl p-6 shadow-card animate-fade-in",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-semibold text-foreground">{meeting.title}</h3>
          <p className="text-sm text-muted-foreground">{meeting.description}</p>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{meeting.time}</span>

            {meeting.meeting_link && (
              <a href={meeting.meeting_link} target="_blank">
                <ExternalLink
                  size={18}
                  className=" ml-4 hover:scale-110 cursor-pointer transition-all"
                />
              </a>
            )}
          </div>
        </div>

        <div
          className={cn(
            "px-3 py-1 rounded-full text-sm font-medium",
            getBadgeStyles(meeting.badge),
          )}
        >
          {meeting.badge}
        </div>
      </div>
    </div>
  );
};

export default UpcomingMeeting;

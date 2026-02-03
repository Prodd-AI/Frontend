import { Video, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Meeting {
  id: string;
  title: string;
  meeting_link: string;
  participant_count: number;
  start_in_minutes: number;
}

interface UpcomingScheduleProps {
  meeting: Meeting | null | undefined;
  remainingCount: number;
  isLoading?: boolean;
}

export const UpcomingSchedule = ({
  meeting,
  remainingCount,
  isLoading,
}: UpcomingScheduleProps) => {
  if (isLoading) {
    return (
      <div className="bg-[#F8F8F9] rounded-3xl px-[2.25rem] py-[2.75rem] shadow-sm animate-pulse min-h-[16.25rem]">
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div
        className="bg-[#F8F8F9] rounded-3xl px-[2.25rem] py-[2.75rem]  flex flex-col items-center justify-center text-center min-h-[16.25rem] shadow-[0_4px_4px_-4px_rgba(0,0,0,0.55),_0_16px_16px_-8px_rgba(0,0,0,0.1)]
"
      >
        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-2">
          <Video className="w-5 h-5 text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-600">
          No upcoming meetings today
        </p>
      </div>
    );
  }

  return (
    <div
      className="bg-[#F8F8F9] rounded-3xl px-[2.25rem] py-[2.75rem]  relative overflow-hidden group transition-all duration-300 min-h-[16.25rem] flex flex-col justify-between gap-6 shadow-[0_4px_4px_-4px_rgba(0,0,0,0.55),_0_16px_16px_-8px_rgba(0,0,0,0.1)]
"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[1.625rem]">
          <Video size={28} className="text-[#934DFF]" />
          <h5 className="text-[#5C5666] text-[1.375rem] font-medium">
            Upcoming Meeting/Call
          </h5>
        </div>
        <Badge
          variant="secondary"
          className="bg-[#FEF3C7] text-[#D97706] hover:bg-[#FEF3C7] border-none px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
        >
          Starting Soon
        </Badge>
      </div>

      {/* Main Info */}
      <div className="flex items-center gap-4">
        <h3 className="text-[1.375rem] font-semibold text-[#5C5666] whitespace-nowrap">
          {meeting.title}
        </h3>
        <div className="flex items-center gap-4 text-[#6B7280]">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span className="text-sm text-[#6B7280]">
              in {meeting.start_in_minutes} minutes
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[#6B7280]">
            <Users className="w-4 h-4" />
            <span className="text-sm">
              {meeting.participant_count} Participants
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button
          className="text-white rounded-xl h-[50px] px-8 font-semibold text-sm transition-all duration-200 shadow-sm"
          onClick={() => window.open(meeting.meeting_link, "_blank")}
        >
          Join Call
        </Button>
        {remainingCount > 0 && (
          <span className="text-xs font-medium text-slate-400">
            +{remainingCount} more today
          </span>
        )}
      </div>
    </div>
  );
};

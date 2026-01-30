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
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm animate-pulse h-[160px]">
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
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-500 flex flex-col items-center justify-center text-center h-[160px]">
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
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-500 relative overflow-hidden group transition-all duration-300 h-[180px] flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
            <Video className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-semibold text-gray-500">
            Upcoming Meeting/Call
          </span>
        </div>
        <Badge
          variant="secondary"
          className="bg-amber-50 text-amber-600 border-none px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
        >
          Starting Soon
        </Badge>
      </div>

      {/* Main Info */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 line-clamp-1 mb-2">
          {meeting.title}
        </h3>
        <div className="flex items-center gap-6 text-gray-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">
              in {meeting.start_in_minutes} minutes
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">
              {meeting.participant_count} Participants
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 mt-auto">
        <Button
          className="bg-primary hover:bg-primary/90 text-white rounded-xl h-9 px-6 font-semibold text-sm transition-all duration-200 group-hover:scale-[1.02]"
          onClick={() => window.open(meeting.meeting_link, "_blank")}
        >
          Join Call
        </Button>
        {remainingCount > 0 && (
          <span className="text-xs font-medium text-gray-400">
            +{remainingCount} more today
          </span>
        )}
      </div>
    </div>
  );
};

import { Video, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { parseWallClockIso } from "@/shared/utils/date.utils";

interface Meeting {
  id: string;
  title: string;
  meeting_link: string;
  participant_count: number;
  start_in_minutes: number;
  scheduled_at?: string;
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
      <div className="bg-white rounded-3xl p-6 border border-gray-200 animate-pulse min-h-[280px]">
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  // Backend stores the user-picked wall-clock with a Z suffix even though it
  // isn't actually UTC, so its `start_in_minutes` is computed against real
  // UTC and ends up shifted. Recompute locally from `scheduled_at` when we
  // have it, treating the stored value as local wall-clock.
  const startInMinutes = (() => {
    if (meeting?.scheduled_at) {
      const diffMs =
        parseWallClockIso(meeting.scheduled_at).getTime() - Date.now();
      return Math.max(0, Math.round(diffMs / 60000));
    }
    return meeting?.start_in_minutes ?? 0;
  })();

  if (!meeting) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-gray-200 flex flex-col items-center justify-center text-center min-h-[280px]">
        <div className="size-11 rounded-xl bg-[#F3EBFF] flex items-center justify-center mb-3">
          <Video className="w-5 h-5 text-[#6619DE]" />
        </div>
        <p className="text-sm font-medium text-gray-500">
          No upcoming meetings today
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-200 min-h-[280px] flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="size-11 rounded-xl bg-[#6619DE] flex items-center justify-center">
            <Video size={20} className="text-white" />
          </span>
          <h5 className="text-[#5A5D61] text-base font-medium">
            Upcoming Meeting/Call
          </h5>
        </div>
        <Badge
          variant="secondary"
          className="bg-[#F3EBFF] text-[#6619DE] hover:bg-[#F3EBFF] border-none px-3 py-1 text-[11px] font-semibold rounded-full"
        >
          Starting Soon
        </Badge>
      </div>

      {/* Main Info */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold text-[#251F2D]">
          {meeting.title}
        </h3>
        <div className="flex flex-wrap items-center gap-5 text-[#6B7280]">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span className="text-sm">
              in{" "}
              {startInMinutes >= 60
                ? `${Math.floor(startInMinutes / 60)}h ${
                    startInMinutes % 60 > 0 ? `${startInMinutes % 60}m` : ""
                  }`
                : `${startInMinutes} ${
                    startInMinutes === 1 ? "min" : "mins"
                  }`}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span className="text-sm">
              {meeting.participant_count} Participants
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 mt-auto">
        <Button
          className="text-white rounded-xl h-11 px-7 font-semibold text-sm bg-[#6619DE] hover:bg-[#5710c4] transition-colors"
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

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UpcomingMeeting from "@/shared/components/upcoming-meeting-card.component";
import ScheduleMeeting from "@/shared/components/schedule-meeting.component";
import { MeetingsTabContentProps } from "@/team-leader/typings/team-leader";
import { parseWallClockIso } from "@/shared/utils/date.utils";

const MeetingsTabContent = ({
  meetings,
  onScheduleMeeting,
  pagination,
  filter,
  isLoading,
}: MeetingsTabContentProps) => {
  const [open, setOpen] = useState(false);

  const handleSchedule = () => {
    onScheduleMeeting?.();
    setOpen(false);
  };

  const statuses = ["scheduled", "cancelled", "completed"] as const;

  // Split scheduled meetings into upcoming vs. already-passed so the user can
  // see what's coming next without losing the history.
  const now = Date.now();
  const isPast = (iso?: string): boolean => {
    if (!iso) return false;
    const t = parseWallClockIso(iso).getTime();
    return Number.isFinite(t) && t < now;
  };
  const upcomingMeetings = meetings.filter((m) => !isPast(m.scheduled_at));
  const previousMeetings = meetings
    .filter((m) => isPast(m.scheduled_at))
    .sort(
      (a, b) =>
        (b.scheduled_at ? parseWallClockIso(b.scheduled_at).getTime() : 0) -
        (a.scheduled_at ? parseWallClockIso(a.scheduled_at).getTime() : 0),
    );

  return (
    <div className="bg-[#FBFBFB] rounded-[1.5rem] p-[1.625rem]">
      <div className="flex justify-between items-center">
        {" "}
        <h4 className="text-[1.75rem] font-semibold">
          Upcoming Meetings & 1:1s
        </h4>
        <div className="flex items-center gap-2">
          {filter && (
            <Select
              value={filter.status}
              onValueChange={(value) =>
                filter.onStatusChange(
                  value as "scheduled" | "cancelled" | "completed",
                )
              }
            >
              <SelectTrigger className="w-[180px] !h-[52px] bg-white border-gray-200">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem
                    key={status}
                    value={status}
                    className="capitalize"
                  >
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="h-[52px]">
                <Plus /> Schedule Meeting
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[720px] p-8 rounded-lg border-gray-200/80 shadow-xl">
              <ScheduleMeeting
                onCancel={() => setOpen(false)}
                onSchedule={handleSchedule}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-[1.25rem]">
        {isLoading ? (
          <div className="py-8 text-center text-gray-500">
            Loading meetings...
          </div>
        ) : meetings.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No {filter?.status} meetings found
          </div>
        ) : (
          <>
            {upcomingMeetings.length > 0 && (
              <div className="flex flex-col gap-4">
                {upcomingMeetings.map((meeting, index) => (
                  <UpcomingMeeting key={`upcoming-${index}`} meeting={meeting} />
                ))}
              </div>
            )}
            {previousMeetings.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h5 className="text-sm font-semibold text-[#5A5D61] uppercase tracking-wider mb-3">
                  Previous Meetings
                </h5>
                <div className="flex flex-col gap-4 opacity-80">
                  {previousMeetings.map((meeting, index) => (
                    <UpcomingMeeting
                      key={`previous-${index}`}
                      meeting={meeting}
                    />
                  ))}
                </div>
              </div>
            )}
            {upcomingMeetings.length === 0 && previousMeetings.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                No meetings to show
              </div>
            )}
          </>
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              pagination.onPageChange(Math.max(1, pagination.currentPage - 1))
            }
            disabled={pagination.currentPage === 1 || isLoading}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              pagination.onPageChange(
                Math.min(pagination.totalPages, pagination.currentPage + 1),
              )
            }
            disabled={
              pagination.currentPage === pagination.totalPages || isLoading
            }
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default MeetingsTabContent;

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
        ) : meetings.length > 0 ? (
          meetings.map((meeting, index) => (
            <UpcomingMeeting key={index} meeting={meeting} />
          ))
        ) : (
          <div className="py-8 text-center text-gray-500">
            No {filter?.status} meetings found
          </div>
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

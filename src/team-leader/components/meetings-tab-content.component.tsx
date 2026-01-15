import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import UpcomingMeeting from "@/shared/components/upcoming-meeting-card.component";
import ScheduleMeeting from "@/shared/components/schedule-meeting.component";
import { MeetingsTabContentProps } from "@/team-leader/typings/team-leader";

const MeetingsTabContent = ({
  meetings,
  onScheduleMeeting,
}: MeetingsTabContentProps) => {
  const [open, setOpen] = useState(false);

  const handleSchedule = () => {
    onScheduleMeeting?.();
    setOpen(false);
  };

  return (
    <div className="bg-[#FBFBFB] rounded-[1.5rem] p-[1.625rem]">
      <h4 className="text-[1.75rem] font-semibold">Upcoming Meetings & 1:1s</h4>
      <div className="flex flex-col gap-4 mt-[1.25rem]">
        {meetings.map((meeting, index) => (
          <UpcomingMeeting key={index} meeting={meeting} />
        ))}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="h-[52px] mt-[3.125rem]">
              <Plus /> Schedule Meeting
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[720px] p-8 rounded-2xl border-gray-200/80 shadow-xl">
            <ScheduleMeeting
              onCancel={() => setOpen(false)}
              onSchedule={handleSchedule}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MeetingsTabContent;

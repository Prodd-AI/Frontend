import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { RiCalendarScheduleLine } from "react-icons/ri";
import ScheduleMeeting from "@/shared/components/schedule-meeting.component";

const ScheduleMeetingButton = () => {
  const [open, setOpen] = useState(false);

  const handleSchedule = () => {
    // Handle the schedule logic here
    console.log("Meeting scheduled!");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <RiCalendarScheduleLine className="h-4 w-4" />
          Schedule Meeting
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[720px] p-8 rounded-2xl border-gray-200/80 shadow-xl">
        <ScheduleMeeting
          onCancel={() => setOpen(false)}
          onSchedule={handleSchedule}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleMeetingButton;

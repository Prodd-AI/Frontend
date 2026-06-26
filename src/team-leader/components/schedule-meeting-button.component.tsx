import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ScheduleMeeting from "@/shared/components/schedule-meeting.component";
import ScheduleMeetingCtaButton from "@/shared/components/schedule-meeting-cta-button.component";

const ScheduleMeetingButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ScheduleMeetingCtaButton />
      </DialogTrigger>
      <DialogContent className="!min-w-[40rem] p-8 rounded-2xl border-gray-200/80 shadow-xl">
        <ScheduleMeeting
          onCancel={() => setOpen(false)}
          onSchedule={() => {
            setTimeout(() => {
              setOpen(false);
            }, 1000);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleMeetingButton;
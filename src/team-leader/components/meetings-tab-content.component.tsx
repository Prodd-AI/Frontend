import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import UpcomingMeeting from "@/shared/components/upcoming-meeting-card.component";
import { MeetingsTabContentProps } from "@/team-leader/typings/team-leader";

const MeetingsTabContent = ({
  meetings,
  onScheduleMeeting,
}: MeetingsTabContentProps) => {
  return (
    <div className="bg-[#FBFBFB] rounded-[1.5rem] p-[1.625rem]">
      <h4 className="text-[1.75rem] font-semibold">Upcoming Meetings & 1:1s</h4>
      <div className="flex flex-col gap-4 mt-[1.25rem]">
        {meetings.map((meeting, index) => (
          <UpcomingMeeting key={index} meeting={meeting} />
        ))}
        <Button className="h-[52px] mt-[3.125rem]" onClick={onScheduleMeeting}>
          <Plus /> Schedule Meeting
        </Button>
      </div>
    </div>
  );
};

export default MeetingsTabContent;

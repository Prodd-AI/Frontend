import { Button } from "@/components/ui/button";
import { RiCalendarScheduleLine } from "react-icons/ri";

const ScheduleMeetingButton = () => {
  return (
    <Button variant="outline">
      <RiCalendarScheduleLine />
      Schedule Meeting
    </Button>
  );
};

export default ScheduleMeetingButton;

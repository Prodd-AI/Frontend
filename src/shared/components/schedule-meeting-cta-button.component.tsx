import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RiCalendarScheduleLine } from "react-icons/ri";

type ScheduleMeetingCtaButtonProps = React.ComponentProps<typeof Button> & {
  showIcon?: boolean;
};

function ScheduleMeetingCtaButton({
  className,
  showIcon = true,
  children = "Schedule Meeting",
  ...props
}: ScheduleMeetingCtaButtonProps) {
  return (
    <Button
      variant="scheduleMeeting"
      className={cn(className)}
      {...props}
    >
      {showIcon && (
        <RiCalendarScheduleLine className="size-[15px] shrink-0" />
      )}
      {children}
    </Button>
  );
}

export default ScheduleMeetingCtaButton;
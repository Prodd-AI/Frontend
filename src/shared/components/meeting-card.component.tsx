import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IoTimeOutline, IoPeopleOutline } from "react-icons/io5";
import { HiOutlineVideoCamera } from "react-icons/hi2";
import { badge_by_status } from "../utils/meeting.constants";
import { MeetingCardProps } from "@/shared/typings/meeting-card";

export default function MeetingCardComponent({
  meeting,
  actions,
  className,
}: MeetingCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-white p-4 md:py-10 md:px-8 shadow-lg flex flex-col gap-6",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <HiOutlineVideoCamera size={20} color="var(--primary-color)" />
          <span className="text-base font-semibold text-[#5C5666]">
            {meeting.subtitle ?? "Meeting"}
          </span>
        </div>
        <span
          className={cn(
            "text-xs px-3 py-1 rounded-full whitespace-nowrap cursor-default font-semibold",
            badge_by_status[meeting.status]
          )}
        >
          {meeting.status === "starting_soon" && "Starting Soon"}
          {meeting.status === "live" && "Live"}
          {meeting.status === "scheduled" && "Scheduled"}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <p className="text-base font-semibold text-[#5C5666]">
          {meeting.title}
        </p>
        <div className="flex items-center gap-5 text-xs text-muted-foreground">
          {typeof meeting.start_in_minutes === "number" && (
            <span className="inline-flex items-center gap-1">
              <IoTimeOutline /> in {meeting.start_in_minutes} minutes
            </span>
          )}
          {typeof meeting.participants_count === "number" && (
            <span className="inline-flex items-center gap-1">
              <IoPeopleOutline /> {meeting.participants_count} Participants
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          onClick={() => actions?.on_join?.(meeting.id)}
          className="cursor-pointer h-[44px] bg-gradient-to-r px-6 from-primary-color to-[#1C75BC] hover:scale-105 transition-all duration-300"
        >
          Join Call
        </Button>
        <div className="text-xs text-muted-foreground">
          <button
            className="px-0 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={() => actions?.on_open_more?.(meeting.id)}
          >
            +1 more today
          </button>
        </div>
      </div>
    </div>
  );
}

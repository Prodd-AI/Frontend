import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Video, Clock, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { get_upcoming_meetings_today } from "@/config/services/meeting.service";
import { parseWallClockIso } from "@/shared/utils/date.utils";

interface NormalizedMeeting {
  id: string;
  title: string;
  scheduledAt: string;
  meetingLink: string | null;
  minutesUntil: number;
}

function minutesUntil(scheduledAt: string): number {
  const diffMs = parseWallClockIso(scheduledAt).getTime() - Date.now();
  return Math.round(diffMs / 60000);
}

function formatClockTime(scheduledAt: string): string {
  return parseWallClockIso(scheduledAt).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatStartsIn(mins: number): string {
  if (mins < 0) return "Started";
  if (mins === 0) return "Starting now";
  if (mins < 60) return `in ${mins} min`;
  const hours = Math.floor(mins / 60);
  const rest = mins % 60;
  return rest > 0 ? `in ${hours}h ${rest}m` : `in ${hours}h`;
}

const MeetingCard = memo(({ meeting }: { meeting: NormalizedMeeting }) => {
  const isImminent = meeting.minutesUntil >= 0 && meeting.minutesUntil <= 15;
  return (
    <div
      className={cn(
        "rounded-2xl p-4 border bg-white flex items-center gap-4",
        isImminent ? "border-[#6619DE]/30 bg-[#F8F3FF]" : "border-gray-200",
      )}
    >
      <span
        className={cn(
          "size-10 rounded-xl flex items-center justify-center shrink-0",
          isImminent
            ? "bg-[#6619DE] text-white"
            : "bg-[#F3EBFF] text-[#6619DE]",
        )}
      >
        <Video size={18} aria-hidden="true" />
      </span>

      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <p className="text-sm font-semibold text-[#251F2D] truncate">
          {meeting.title}
        </p>
        <p className="text-xs text-gray-500 flex items-center gap-2">
          <span>{formatClockTime(meeting.scheduledAt)}</span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock size={11} aria-hidden="true" />
            {formatStartsIn(meeting.minutesUntil)}
          </span>
        </p>
      </div>

      {meeting.meetingLink && (
        <a
          href={meeting.meetingLink}
          target="_blank"
          rel="noreferrer"
          className={cn(
            "inline-flex items-center gap-1 h-9 px-3 rounded-lg text-xs font-semibold transition-colors shrink-0",
            isImminent
              ? "bg-[#6619DE] text-white hover:bg-[#5710c4]"
              : "bg-[#F3EBFF] text-[#6619DE] hover:bg-[#E8DBFF]",
          )}
        >
          Join
          <ArrowUpRight size={12} aria-hidden="true" />
        </a>
      )}
    </div>
  );
});
MeetingCard.displayName = "MeetingCard";

/**
 * Compact list of all meetings still ahead for today. Renders nothing when the
 * user has nothing scheduled. Sits above the task focus list on the Today's
 * Focus page so meetings get equal billing.
 */
function TodaysMeetingsList() {
  const { data, isLoading } = useQuery({
    queryKey: ["upcoming-meetings-today"],
    queryFn: () => get_upcoming_meetings_today(),
  });

  const primary = data?.data;
  const remaining = primary?.remaining_meetings ?? [];

  const meetings: NormalizedMeeting[] = primary?.id
    ? [
        {
          id: primary.id,
          title: primary.title,
          scheduledAt: primary.scheduled_at,
          meetingLink: primary.meeting_link ?? null,
          minutesUntil: minutesUntil(primary.scheduled_at),
        },
        ...remaining.map((m) => ({
          id: m.id,
          title: m.title,
          scheduledAt: m.scheduled_at,
          meetingLink: m.meeting_link ?? null,
          minutesUntil: minutesUntil(m.scheduled_at),
        })),
      ]
    : [];

  if (isLoading || meetings.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-[#251F2D]">
        Meetings today
        <span className="ml-2 text-xs font-normal text-gray-500">
          {meetings.length} scheduled
        </span>
      </h3>
      <div className="flex flex-col gap-3">
        {meetings.map((m) => (
          <MeetingCard key={m.id} meeting={m} />
        ))}
      </div>
    </section>
  );
}

export default memo(TodaysMeetingsList);

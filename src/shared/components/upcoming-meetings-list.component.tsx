import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Video, Clock, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { get_meetings } from "@/config/services/meeting.service";
import {
  parseWallClockIso,
  isMeetingUpcomingOrRecent,
} from "@/shared/utils/date.utils";

function minutesUntil(scheduledAt: string): number {
  return Math.round(
    (parseWallClockIso(scheduledAt).getTime() - Date.now()) / 60000,
  );
}

/** "Today, 2:30 PM" / "Tomorrow, 9:00 AM" / "Jun 18, 10:00 AM". */
function formatWhen(scheduledAt: string): string {
  const d = parseWallClockIso(scheduledAt);
  const now = new Date();
  const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  if (isSameDay(d, now)) return `Today, ${time}`;
  if (isSameDay(d, tomorrow)) return `Tomorrow, ${time}`;
  return `${d.toLocaleDateString([], { month: "short", day: "numeric" })}, ${time}`;
}

function formatStartsIn(mins: number): string {
  if (mins < 0) return "Started";
  if (mins === 0) return "Starting now";
  if (mins < 60) return `in ${mins} min`;
  if (mins < 60 * 24) {
    const hours = Math.floor(mins / 60);
    const rest = mins % 60;
    return rest > 0 ? `in ${hours}h ${rest}m` : `in ${hours}h`;
  }
  const days = Math.round(mins / (60 * 24));
  return `in ${days} day${days > 1 ? "s" : ""}`;
}

/**
 * All of the user's upcoming meetings (today and future), newest first, on the
 * dashboard. Unlike the single "next meeting" card, this lists everything still
 * ahead so meetings on later days surface too. Recently-started meetings stay
 * visible for the shared grace window; ones long past drop off.
 */
function UpcomingMeetingsList() {
  const { data, isLoading } = useQuery({
    queryKey: ["meetings", "scheduled", "upcoming-list"],
    queryFn: () =>
      get_meetings({ page: "1", limit: "50", status: "scheduled" }),
  });

  const meetings = (data?.data ?? [])
    .filter((m) => isMeetingUpcomingOrRecent(m.scheduled_at))
    .sort(
      (a, b) =>
        parseWallClockIso(a.scheduled_at).getTime() -
        parseWallClockIso(b.scheduled_at).getTime(),
    );

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-200 min-h-[280px] flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="size-11 rounded-xl bg-[#6619DE] flex items-center justify-center">
          <Video size={20} className="text-white" />
        </span>
        <h5 className="text-[#5A5D61] text-base font-medium">
          Upcoming Meetings
        </h5>
        {!isLoading && meetings.length > 0 && (
          <span className="ml-auto text-xs font-medium text-gray-400">
            {meetings.length} scheduled
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
          Loading meetings…
        </div>
      ) : meetings.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="size-11 rounded-xl bg-[#F3EBFF] flex items-center justify-center mb-3">
            <Video className="w-5 h-5 text-[#6619DE]" />
          </div>
          <p className="text-sm font-medium text-gray-500">
            No upcoming meetings
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {meetings.map((m) => {
            const mins = minutesUntil(m.scheduled_at);
            const imminent = mins >= 0 && mins <= 15;
            return (
              <div
                key={m.id}
                className={cn(
                  "rounded-2xl p-4 border flex items-center gap-4",
                  imminent
                    ? "border-[#6619DE]/30 bg-[#F8F3FF]"
                    : "border-gray-200",
                )}
              >
                <span
                  className={cn(
                    "size-10 rounded-xl flex items-center justify-center shrink-0",
                    imminent
                      ? "bg-[#6619DE] text-white"
                      : "bg-[#F3EBFF] text-[#6619DE]",
                  )}
                >
                  <Video size={18} aria-hidden="true" />
                </span>

                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                  <p className="text-sm font-semibold text-[#251F2D] truncate">
                    {m.title}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <span>{formatWhen(m.scheduled_at)}</span>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={11} aria-hidden="true" />
                      {formatStartsIn(mins)}
                    </span>
                  </p>
                </div>

                {m.meeting_link && (
                  <a
                    href={m.meeting_link}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      "inline-flex items-center gap-1 h-9 px-3 rounded-lg text-xs font-semibold transition-colors shrink-0",
                      imminent
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
          })}
        </div>
      )}
    </div>
  );
}

export default memo(UpcomingMeetingsList);

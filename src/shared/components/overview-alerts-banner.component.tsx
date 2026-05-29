import { Link } from "react-router-dom";
import { AlertTriangle, Calendar, ArrowRight } from "lucide-react";
import { useOverviewAlerts } from "@/shared/hooks/use-overview-alerts";

interface OverviewAlertsBannerProps {
  /** Optional route for the "View tasks" link. Omit for HR (no personal tasks). */
  tasksRoute?: string;
}

function buildTaskSummary(overdue: number, dueToday: number): string | null {
  if (overdue === 0 && dueToday === 0) return null;
  const parts: string[] = [];
  if (overdue > 0) parts.push(`${overdue} overdue`);
  if (dueToday > 0) parts.push(`${dueToday} due today`);
  return parts.join(" · ");
}

function formatMinutes(mins: number): string {
  if (mins <= 0) return "now";
  if (mins === 1) return "in 1 min";
  return `in ${mins} min`;
}

/**
 * Persist-until-resolved alert banner shown on dashboard overview pages.
 * Auto-hides when both task and meeting conditions clear — no dismiss control.
 */
export default function OverviewAlertsBanner({
  tasksRoute,
}: OverviewAlertsBannerProps) {
  const { overdueCount, dueTodayCount, nextMeeting, hasAlerts } =
    useOverviewAlerts();

  if (!hasAlerts) return null;

  const taskSummary = tasksRoute
    ? buildTaskSummary(overdueCount, dueTodayCount)
    : null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 flex flex-col sm:flex-row sm:items-center gap-3"
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <span className="size-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-700">
          <AlertTriangle size={18} aria-hidden="true" />
        </span>
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          {taskSummary && (
            <p className="text-sm text-amber-900">
              <span className="font-semibold">Tasks:</span> {taskSummary}.
            </p>
          )}
          {nextMeeting && (
            <p className="text-sm text-amber-900 flex items-center gap-2 min-w-0">
              <Calendar size={14} aria-hidden="true" className="shrink-0" />
              <span className="truncate">
                <span className="font-semibold">{nextMeeting.title}</span>{" "}
                starts {formatMinutes(nextMeeting.minutesUntil)}.
              </span>
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {taskSummary && tasksRoute && (
          <Link
            to={tasksRoute}
            className="inline-flex items-center gap-1 h-9 px-3 rounded-lg text-sm font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 transition-colors"
          >
            View tasks
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        )}
        {nextMeeting?.meetingLink && (
          <a
            href={nextMeeting.meetingLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 h-9 px-3 rounded-lg text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-colors"
          >
            Join meeting
            <ArrowRight size={14} aria-hidden="true" />
          </a>
        )}
      </div>
    </div>
  );
}

import { useQueries } from "@tanstack/react-query";
import { getWeeklyStreak } from "@/config/services/tasks.service";
import { get_upcoming_meetings_today } from "@/config/services/meeting.service";

const MEETING_SOON_MINUTES = 60;

function isOverdue(dueDate: string, todayStart: Date) {
  const due = new Date(dueDate);
  return due.getTime() < todayStart.getTime();
}

function isDueToday(dueDate: string, todayStart: Date, tomorrowStart: Date) {
  const due = new Date(dueDate).getTime();
  return due >= todayStart.getTime() && due < tomorrowStart.getTime();
}

export interface OverviewAlerts {
  overdueCount: number;
  dueTodayCount: number;
  totalPendingCount: number;
  nextMeeting: {
    id: string;
    title: string;
    minutesUntil: number;
    meetingLink: string | null;
  } | null;
  hasAlerts: boolean;
  isLoading: boolean;
}

/**
 * Shared, query-cache-deduped read of "things the user should know about now":
 * overdue tasks, tasks due today, and any meeting starting within the next
 * hour. Used by both the sidebar (dot badges) and the dashboard banner.
 */
export function useOverviewAlerts(enabled = true): OverviewAlerts {
  const [tasksQuery, meetingsQuery] = useQueries({
    queries: [
      {
        queryKey: ["streaks", { duration: "week", status: "all" }],
        queryFn: () => getWeeklyStreak({ duration: "week", status: "all" }),
        enabled,
      },
      {
        queryKey: ["upcoming-meetings-today"],
        queryFn: () => get_upcoming_meetings_today(),
        enabled,
      },
    ],
  });

  const now = new Date();
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);

  const weekTasks = tasksQuery.data?.data;
  const allTasks = weekTasks
    ? (
        ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const
      ).flatMap((day) => weekTasks[day] ?? [])
    : [];

  const pending = allTasks.filter((t) => t.task?.status !== "completed");
  const overdueCount = pending.filter((t) =>
    isOverdue(t.task.due_date, todayStart),
  ).length;
  const dueTodayCount = pending.filter((t) =>
    isDueToday(t.task.due_date, todayStart, tomorrowStart),
  ).length;

  const meeting = meetingsQuery.data?.data;
  const minutesUntil = meeting?.start_in_minutes ?? null;
  const nextMeeting =
    meeting?.id &&
    typeof minutesUntil === "number" &&
    minutesUntil >= 0 &&
    minutesUntil <= MEETING_SOON_MINUTES
      ? {
          id: meeting.id,
          title: meeting.title,
          minutesUntil,
          meetingLink: meeting.meeting_link ?? null,
        }
      : null;

  const totalPendingCount = overdueCount + dueTodayCount;
  const hasAlerts = totalPendingCount > 0 || nextMeeting !== null;

  return {
    overdueCount,
    dueTodayCount,
    totalPendingCount,
    nextMeeting,
    hasAlerts,
    isLoading: tasksQuery.isLoading || meetingsQuery.isLoading,
  };
}

/**
 * Classify a due date for color coding in task tables.
 * - overdue: due date is in the past
 * - soon: due within the next 24 hours
 * - safe: due more than 24 hours away
 */
export const classifyDueDate = (
  value: string | Date | null | undefined,
): "overdue" | "soon" | "safe" | "unknown" => {
  if (!value) return "unknown";
  // Due dates come back from the API with a `Z` suffix even though they are
  // really the wall-clock the user picked. Use parseWallClockIso so we don't
  // shift by the local UTC offset (Today's Focus does the same — keep parity).
  const date =
    value instanceof Date ? value : parseWallClockIso(String(value));
  if (Number.isNaN(date.getTime())) return "unknown";
  const diffMs = date.getTime() - Date.now();
  if (diffMs < 0) return "overdue";
  if (diffMs <= 24 * 60 * 60 * 1000) return "soon";
  return "safe";
};

export const DUE_DATE_CLASSES: Record<
  "overdue" | "soon" | "safe" | "unknown",
  string
> = {
  overdue: "text-red-600 font-medium",
  soon: "text-amber-600 font-medium",
  safe: "text-emerald-600",
  unknown: "text-muted-foreground",
};

/**
 * Build the list of pending tasks to show in "Today's Focus".
 * Filters to tasks whose due_date is today (in the user's local wall-clock)
 * and returns them in priority order (high → medium → low).
 */
export const buildFocusGoals = (
  tasks: UserTaskAssignment[] | undefined,
): Array<{
  id: string;
  description: string;
  priority: "high" | "medium" | "low";
  due_at?: string;
}> => {
  if (!tasks || tasks.length === 0) return [];
  const rank: Record<string, number> = { high: 0, medium: 1, low: 2 };
  const today = new Date();
  const isSameLocalDay = (iso: string | undefined): boolean => {
    if (!iso) return false;
    // Due dates are wall-clock-as-UTC — strip the Z so the date is read in
    // the user's local zone, matching how we render them elsewhere.
    const d = parseWallClockIso(iso);
    if (Number.isNaN(d.getTime())) return false;
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  };
  return tasks
    .filter(
      (t) => t.task.status === "pending" && isSameLocalDay(t.task.due_date),
    )
    .map((t) => ({
      id: t.id,
      description: t.task.description,
      priority: ((t.task.priority as "high" | "medium" | "low") ?? "low"),
      due_at: t.task.due_date,
    }))
    .sort((a, b) => (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9));
};

/**
 * Parse an ISO timestamp as a wall-clock value in the user's local timezone.
 *
 * The meetings API stores the wall-clock the user picked (e.g. "10:00" local)
 * with a `Z` suffix ("2026-05-28T10:00:00.000Z") even though it isn't actually
 * UTC. If we parse that with `new Date(iso)` and format with local methods,
 * UTC+N users see the time shifted by N hours.
 *
 * This helper strips the timezone designator so the browser reads the ISO as
 * local time, preserving the original wall-clock numbers.
 */
export const parseWallClockIso = (iso: string): Date => {
  const naive = iso.replace(/(?:Z|[+-]\d{2}:?\d{2})$/, "");
  return new Date(naive);
};

export const formatTimeAgo = (date: Date | string): string => {
  const currentDate = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - currentDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} mins ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

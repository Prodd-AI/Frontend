import { format, isWithinInterval, startOfWeek, endOfWeek } from "date-fns";
import type { Interval } from "date-fns";
import { CheckCircle2, Clock3, RotateCcw, UserRoundCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AssignedTask } from "@/team-leader/typings/team-leader";

interface TeamWeeklyTaskSummaryProps {
  tasks: AssignedTask[];
  isLoading?: boolean;
}

interface MemberSummary {
  id: string;
  name: string;
  completed: AssignedTask[];
  approved: AssignedTask[];
  rejected: AssignedTask[];
  pending: AssignedTask[];
}

const parseDate = (value?: string | Date | null) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const isTaskTouchedThisWeek = (task: AssignedTask, range: Interval) => {
  const date =
    parseDate(task.task.updated_at) ??
    parseDate(task.task.created_at) ??
    parseDate(task.assigned_at);

  return date ? isWithinInterval(date, range) : false;
};

const getMemberName = (task: AssignedTask) =>
  `${task.user.first_name} ${task.user.last_name}`.trim();

const buildSummaries = (tasks: AssignedTask[]): MemberSummary[] => {
  const now = new Date();
  const weekRange = {
    start: startOfWeek(now, { weekStartsOn: 1 }),
    end: endOfWeek(now, { weekStartsOn: 1 }),
  };

  const weeklyTasks = tasks.filter((task) =>
    isTaskTouchedThisWeek(task, weekRange),
  );
  const summaries = new Map<string, MemberSummary>();

  for (const task of weeklyTasks) {
    const userId = task.user.id;
    const summary =
      summaries.get(userId) ??
      ({
        id: userId,
        name: getMemberName(task),
        completed: [],
        approved: [],
        rejected: [],
        pending: [],
      } satisfies MemberSummary);

    if (task.task.status === "approved") {
      summary.approved.push(task);
    } else if (task.task.status === "completed") {
      summary.completed.push(task);
    } else if (task.task.status === "changes_requested") {
      summary.rejected.push(task);
    } else {
      summary.pending.push(task);
    }

    summaries.set(userId, summary);
  }

  return Array.from(summaries.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
};

function TeamWeeklyTaskSummary({
  tasks,
  isLoading,
}: TeamWeeklyTaskSummaryProps) {
  const summaries = buildSummaries(tasks);
  const completedTotal = summaries.reduce(
    (sum, member) => sum + member.completed.length + member.approved.length,
    0,
  );
  const submittedTotal = summaries.reduce(
    (sum, member) => sum + member.completed.length,
    0,
  );
  const approvedTotal = summaries.reduce(
    (sum, member) => sum + member.approved.length,
    0,
  );
  const rejectedTotal = summaries.reduce(
    (sum, member) => sum + member.rejected.length,
    0,
  );
  const weekLabel = `${format(startOfWeek(new Date(), { weekStartsOn: 1 }), "MMM d")} - ${format(
    endOfWeek(new Date(), { weekStartsOn: 1 }),
    "MMM d",
  )}`;

  return (
    <section className="rounded-lg border border-border/60 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <UserRoundCheck className="size-5 text-[#6619DE]" />
            <h2 className="text-lg font-semibold text-[#251F2D]">
              Team Weekly Task Summary
            </h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Tasks done by each team member for {weekLabel}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SummaryMetric label="Done" value={completedTotal} />
          <SummaryMetric label="Awaiting Review" value={submittedTotal} />
          <SummaryMetric label="Approved" value={approvedTotal} />
          <SummaryMetric label="Rejected" value={rejectedTotal} />
        </div>
      </div>

      {isLoading ? (
        <div className="mt-6 rounded-lg bg-muted/30 p-6 text-center text-sm text-muted-foreground">
          Loading weekly task summary...
        </div>
      ) : summaries.length === 0 ? (
        <div className="mt-6 rounded-lg bg-muted/30 p-6 text-center text-sm text-muted-foreground">
          No team member tasks were completed or updated this week.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {summaries.map((member) => {
            const doneTasks = [...member.approved, ...member.completed];
            const total =
              member.pending.length +
              member.completed.length +
              member.approved.length +
              member.rejected.length;

            return (
              <article
                key={member.id}
                className="rounded-lg border border-border/60 bg-background p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-[#251F2D]">
                      {member.name || "Team Member"}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {doneTasks.length}/{total} tasks done this week
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
                      {member.completed.length} review
                    </Badge>
                    <Badge className="bg-green-50 text-green-700 hover:bg-green-50">
                      {member.approved.length} approved
                    </Badge>
                    <Badge className="bg-orange-50 text-orange-700 hover:bg-orange-50">
                      {member.rejected.length} rejected
                    </Badge>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {doneTasks.length === 0 ? (
                    <div className="flex items-center gap-2 rounded-md bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                      <Clock3 className="size-4" />
                      No completed tasks recorded this week.
                    </div>
                  ) : (
                    doneTasks.slice(0, 4).map((task) => (
                      <div
                        key={task.user_task_id}
                        className="flex items-center justify-between gap-3 rounded-md bg-muted/30 px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p
                            className="truncate text-sm font-medium text-[#251F2D]"
                            title={task.task.title}
                          >
                            {task.task.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {task.task.status === "approved"
                              ? "Approved"
                              : "Awaiting review"}
                          </p>
                        </div>
                        {task.task.status === "approved" ? (
                          <CheckCircle2 className="size-4 shrink-0 text-green-600" />
                        ) : (
                          <RotateCcw className="size-4 shrink-0 text-emerald-600" />
                        )}
                      </div>
                    ))
                  )}
                  {doneTasks.length > 4 && (
                    <p className="text-xs text-muted-foreground">
                      +{doneTasks.length - 4} more completed task(s)
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function SummaryMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-[#F8F7FB] px-4 py-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold text-[#251F2D]">{value}</p>
    </div>
  );
}

export default TeamWeeklyTaskSummary;

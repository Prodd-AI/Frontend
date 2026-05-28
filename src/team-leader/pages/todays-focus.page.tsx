import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/shared/components/page-header.component";
import TodaysFocusComponent from "@/shared/components/todays-focus.component";
import { getWeeklyStreak } from "@/config/services/tasks.service";
import { buildFocusGoals } from "@/shared/utils/date.utils";

function TodaysFocusPage() {
  const weekTasksQuery = useQuery({
    queryKey: ["streaks", { duration: "week", status: "all" }],
    queryFn: () => getWeeklyStreak({ duration: "week", status: "all" }),
  });

  const weekTasks = weekTasksQuery.data?.data;
  // Flatten the whole week and let buildFocusGoals filter to tasks whose
  // due_date is actually today (the API buckets by day-of-week which doesn't
  // line up with calendar-today).
  const allWeekTasks = weekTasks ? Object.values(weekTasks).flat() : [];
  const goals = buildFocusGoals(allWeekTasks as UserTaskAssignment[]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Today's Focus"
        subtitle="Pending tasks for today, ordered by priority"
      />
      <TodaysFocusComponent goals={goals} />
    </div>
  );
}

export default TodaysFocusPage;

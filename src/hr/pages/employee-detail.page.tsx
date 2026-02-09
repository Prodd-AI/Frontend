import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import GoBackBtn from "@/shared/components/go-back-btn";
import TeamMemberProfileRow from "@/team-leader/components/team-member-profile-row.component";
import TeamMemberProductivityTracker from "@/team-leader/components/team-member-productivity-tracker.component";
import TeamMemberOverviewCard from "@/team-leader/components/team-member-overview.component";
import { get_user_mood_history } from "@/config/services/mood-trends.service";
import { get_employee_detail } from "@/config/services/hr.service";
import { DataTable } from "@/shared/components/data-table/data-table";
import { memberAssignedTasksColumns } from "@/team-leader/components/columns/member-assigned-tasks-columns";
import { getAssignedTasksForTeamMember } from "@/config/services/tasks.service";
import { Loader2 } from "lucide-react";

type MoodLevel = "rough" | "notGreat" | "okay" | "good" | "great" | null;

interface DayMood {
  date: Date;
  mood: MoodLevel;
}

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: mood_data = [], isLoading: is_mood_loading } = useQuery({
    queryKey: ["user-mood-history", id],
    queryFn: async () => {
      if (!id) return [];
      const response = await get_user_mood_history(id);
      const parsed_data: DayMood[] = response.data.map((item) => ({
        date: new Date(item.date),
        mood: item.mood,
      }));
      return parsed_data;
    },
    enabled: !!id,
  });

  const { data: employee_detail, isLoading: is_detail_loading } = useQuery({
    queryKey: ["employee-detail", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await get_employee_detail(id);
      return response.data;
    },
    enabled: !!id,
  });

  const { data: assigned_tasks_data = [] } = useQuery({
    queryKey: ["member-assigned-tasks", id],
    queryFn: async () => {
      if (!id) return [];
      const response = await getAssignedTasksForTeamMember(id!);
      return response.data;
    },
    enabled: !!id,
  });

  if (is_detail_loading) {
    return (
      <div className="h-full flex items-center justify-center p-20">
        <Loader2 className="size-8 text-primary-color animate-spin" />
      </div>
    );
  }

  return (
    <div className="pb-12 space-y-8">
      <GoBackBtn title="Back to Dashboard" />

      <TeamMemberProfileRow
        name={employee_detail?.name}
        role={employee_detail?.job_title}
        email={employee_detail?.email}
        avatar_url={employee_detail?.avatar_url}
        isLoading={is_detail_loading}
      />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        <TeamMemberProductivityTracker
          moodData={mood_data}
          isLoading={is_mood_loading}
        />
        <TeamMemberOverviewCard
          joinDate={employee_detail?.join_date}
          performanceTrend={employee_detail?.performance_trend}
          workloadStatus={employee_detail?.workload_status}
          isLoading={is_detail_loading}
        />
      </section>

      <DataTable
        columns={memberAssignedTasksColumns}
        data={assigned_tasks_data}
        tableName="Assigned Tasks"
        tableDescription="Tasks currently assigned to this employee"
        className="mt-10"
      />
    </div>
  );
}

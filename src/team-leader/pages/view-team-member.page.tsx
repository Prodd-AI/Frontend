import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import GoBackBtn from "@/shared/components/go-back-btn";
import TeamMemberProfileRow from "../components/team-member-profile-row.component";
import TeamMemberProductivityTracker from "../components/team-member-productivity-tracker.component";
import TeamMemberOverviewCard from "../components/team-member-overview.component";
import { get_user_mood_history } from "@/config/services/mood-trends.service";
import { get_team_member_overview } from "@/config/services/team-member.service";
import { getAssignedTasksForTeamMember } from "@/config/services/tasks.service";
import { DataTable } from "@/shared/components/data-table/data-table";
import { memberAssignedTasksColumns } from "../components/columns/member-assigned-tasks-columns";

type MoodLevel = "rough" | "notGreat" | "okay" | "good" | "great" | null;

interface DayMood {
  date: Date;
  mood: MoodLevel;
}

function ViewTeamMember() {
  const { id } = useParams<{ id: string }>();

  const { data: moodData = [], isLoading: isMoodLoading } = useQuery({
    queryKey: ["user-mood-history", id],
    queryFn: async () => {
      if (!id) return [];
      const response = await get_user_mood_history(id);
      const parsedData: DayMood[] = response.data.map((item) => ({
        date: new Date(item.date),
        mood: item.mood,
      }));
      return parsedData;
    },
    enabled: !!id,
  });

  const { data: memberOverview, isLoading: isOverviewLoading } = useQuery({
    queryKey: ["team-member-overview", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await get_team_member_overview(id);
      return response.data;
    },
    enabled: !!id,
  });

  const { data: assignedTasksData = [] } = useQuery({
    queryKey: ["member-assigned-tasks", id],
    queryFn: async () => {
      if (!id) return [];
      const response = await getAssignedTasksForTeamMember(id);
      return response.data;
    },
    enabled: !!id,
  });

  return (
    <div className="pb-12">
      <GoBackBtn title="Back to team" />
      <TeamMemberProfileRow
        name={memberOverview?.name}
        role={memberOverview?.job_title}
        email={memberOverview?.email}
        avatar_url={memberOverview?.avatar_url}
        isLoading={isOverviewLoading}
      />
      <section className=" grid grid-cols-2 gap-x-[1.125rem] mt-[2.875rem]">
        <TeamMemberProductivityTracker
          moodData={moodData}
          isLoading={isMoodLoading}
        />
        <TeamMemberOverviewCard
          joinDate={memberOverview?.join_date}
          performanceTrend={memberOverview?.performance_trend}
          workloadStatus={memberOverview?.workload_status}
          isLoading={isOverviewLoading}
        />
      </section>
      <DataTable
        columns={memberAssignedTasksColumns}
        data={assignedTasksData}
        tableName="Assigned Tasks"
        tableDescription="Tasks assigned to this team member"
        className="mt-[2.875rem]"
      />
    </div>
  );
}

export default ViewTeamMember;

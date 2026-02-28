import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { get_mood_distribution } from "@/config/services/mood-trends.service";
import { getTeamData } from "@/config/services/teams.service";
import TeamMemberOverviewCard from "@/shared/components/team-member-overview-card.component";
import { useTeamAnalysis } from "@/team-leader/hooks/use-team-analysis";
import { useDateRange } from "@/team-leader/hooks/use-date-range";
import GoBackBtn from "@/shared/components/go-back-btn";
import InviteTeamMembersDialog from "@/hr/components/invite-team-members-dialog.component";
import TeamProductivity from "@/hr/components/team-productivity.component";
import { DataTable } from "@/shared/components/data-table/data-table";
import {
  columns,
  TeamMemberData,
} from "@/team-leader/components/columns/team-members-table-columns";
import { useQuery } from "@tanstack/react-query";
import { LayoutGrid, List, Plus, Search, User } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

export default function TeamDetailPage() {
  const param = useParams();
  const id = param.id || "";

  const { data } = useQuery({
    queryKey: ["get-Team-Data", id],
    queryFn: () => getTeamData(id),
    enabled: !!id,
  });

  const { startDate, endDate } = useDateRange();

  const { metrics, analysisLoading } = useTeamAnalysis({
    teamId: id || undefined,
    startDate,
    endDate,
  });

  const teamMembers: TeamMemberData[] = useMemo(
    () =>
      metrics?.team_members_details.map((member) => ({
        id: member.member_id,
        name: member.member_name,
        role: member.job_title || "Team Member",
        status: (member.flight_risk_indicator === "at risk"
          ? "At risk"
          : "On track") as "At risk" | "On track",
        taskCompletion: member.task_completion,
        tasksCompleted: member.completed_task,
        totalTasks: member.total_task,
        weekStreak: `${member.week_streak} weeks`,
        lastActive: member.last_active,
        email: member.email,
      })) || [],
    [metrics],
  );

  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [search, setSearch] = useState("");

  const filteredMembers = useMemo(
    () =>
      teamMembers.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [teamMembers, search],
  );

  const [moodDateFilter, setMoodDateFilter] = useState<
    "this_week" | "last_week"
  >("this_week");

  const { data: moodDistResponse, isLoading: isMoodLoading } = useQuery({
    queryKey: ["get-mood-distribution", id, moodDateFilter],
    queryFn: () =>
      get_mood_distribution({ date_filter: moodDateFilter, team_id: id }),
    enabled: !!id,
  });

  const moodDistData = moodDistResponse?.data ?? [];

  const teamData = data?.data;

  return (
    <div className="pb-12">
      <GoBackBtn title="Back to teams" path="/dash/hr/teams" />
      <div className="flex items-center justify-between gap-4 bg-inherit rounded-2xl mt-[2.875rem]">
        <div className="flex items-center gap-4">
          {" "}
          <Avatar className="size-[92px] bg-primary/10">
            <AvatarFallback className="bg-primary/10">
              <User className=" text-primary/60" size={48} />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex flex-col items-center">
              <h3 className="font-semibold text-foreground text-[1.75rem]">
                {teamData ? teamData.name + " Team" : "—"}
              </h3>
              <h6 className=" text-[#4B4357] text-[1.375rem]">
                {teamData ? teamData.size + " team members" : "-"}
              </h6>
            </div>
          </div>
        </div>

        <InviteTeamMembersDialog
          teamId={id}
          teamName={teamData?.name}
          trigger={
            <Button>
              <Plus /> Add Member
            </Button>
          }
        />
      </div>
      <section className="mt-[2.875rem]">
        <TeamProductivity
          data={moodDistData}
          isLoading={isMoodLoading}
          dateFilter={moodDateFilter}
          onDateFilterChange={setMoodDateFilter}
        />
      </section>
      <section className="mt-[2.875rem]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
            <Button
              variant={viewMode === "card" ? "secondary" : "ghost"}
              size="sm"
              className="px-2"
              onClick={() => setViewMode("card")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="sm"
              className="px-2"
              onClick={() => setViewMode("table")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {viewMode === "card" && (
            <div className="relative w-fit">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search member"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 rounded-full border-none bg-[#F3F0F7] shadow-none focus-visible:ring-0"
              />
            </div>
          )}
        </div>

        {analysisLoading ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Loading team members...</p>
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="flex items-center justify-center h-40 border rounded-lg bg-card">
            <p className="text-muted-foreground">No team members found.</p>
          </div>
        ) : viewMode === "card" ? (
          <div className="flex flex-wrap gap-4">
            {filteredMembers.map((member) => (
              <TeamMemberOverviewCard
                key={member.id}
                id={member.id}
                name={member.name}
                role={member.role}
                status={member.status}
                taskCompletion={member.taskCompletion}
                tasksCompleted={member.tasksCompleted}
                totalTasks={member.totalTasks}
                weekStreak={member.weekStreak}
                lastActive={member.lastActive}
              />
            ))}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={teamMembers}
            tableName="Team Members"
            tableDescription="View detailed performance metrics for each team member."
          />
        )}
      </section>
    </div>
  );
}

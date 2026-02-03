import GoBackBtn from "@/shared/components/go-back-btn";
import { useTeams } from "@/team-leader/hooks/use-teams";
import { useTeamAnalysis } from "@/team-leader/hooks/use-team-analysis";
import { useDateRange } from "@/team-leader/hooks/use-date-range";
import { TeamPerformanceOverview } from "@/team-leader/components/team-performance-overview.component";
import TeamMemberOverviewCard from "@/shared/components/team-member-overview-card.component";
import WelcomeBackHeader from "@/shared/components/welcome-back-header.component";
import { DataTable } from "@/shared/components/data-table/data-table";
import { useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  columns,
  TeamMemberData,
} from "@/team-leader/components/columns/team-members-table-columns";

function ViewTeamMembers() {
  const { teams, activeTeamId, setSelectedTeamId, teamsLoading } = useTeams();
  const { startDate, endDate, handleDateRangeChange } = useDateRange();

  const { metrics, analysisLoading } = useTeamAnalysis({
    teamId: activeTeamId,
    startDate,
    endDate,
  });

  const [viewMode, setViewMode] = useState<"card" | "table">("table");

  const teamMembers: TeamMemberData[] =
    metrics?.team_members_details.map((member) => ({
      id: member.member_id,
      name: member.member_name,
      role: member.job_title || "Team Member",
      status:
        member.flight_risk_indicator === "at risk" ? "At risk" : "On track",
      taskCompletion: member.task_completion,
      tasksCompleted: member.completed_task,
      totalTasks: member.total_task,
      weekStreak: `${member.week_streak} weeks`,
      lastActive: member.last_active,
      email: member.email,
    })) || [];

  return (
    <div className="pb-12">
      <GoBackBtn title="Back home" />
      <WelcomeBackHeader
        heading={"Team Dashboard and Insight"}
        subHeading={"Manage your team's tasks and wellbeing"}
        badge
        className="sm:mt-6"
      />
      <TeamPerformanceOverview
        teams={teams}
        activeTeamId={activeTeamId}
        onSelectTeam={setSelectedTeamId}
        teamsLoading={teamsLoading}
        metrics={metrics}
        analysisLoading={analysisLoading}
        startDate={startDate}
        endDate={endDate}
        onDateRangeChange={handleDateRangeChange}
        className="mt-5"
      />

      <div className="mt-8">
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
        </div>

        {analysisLoading ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Loading team members...</p>
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="flex items-center justify-center h-40 border rounded-lg bg-card">
            <p className="text-muted-foreground">
              No team members found for this team.
            </p>
          </div>
        ) : viewMode === "card" ? (
          <div className="flex flex-wrap gap-4">
            {teamMembers.map((member) => (
              <TeamMemberOverviewCard
                id={member.id}
                key={member.id}
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
      </div>
    </div>
  );
}

export default ViewTeamMembers;

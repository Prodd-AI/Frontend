import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { GoGraph } from "react-icons/go";
import { cn } from "@/lib/utils";
import PageHeader from "@/shared/components/page-header.component";
import TeamAnalysisCardComponent from "@/shared/components/team-analysis-card.component";
import TimesheetWeeklyOverview from "@/hr/components/timesheet-overview.component";
import HrPayroll from "@/hr/components/hr-payroll.component";
import { useTeamsOverview } from "@/hr/hooks/use-teams-overview";
import {
  getTeamsAnalysis,
  getTeamsPerformance,
} from "@/config/services/teams.service";
import useTeamStore from "@/config/stores/team.store";
import type { TeamAnalysisInfo } from "@/shared/typings/team-analysis-card";

type AnalysisTeam = TeamAnalysisInfo & { team_name?: string };

function HrTeamAnalysisPage() {
  const navigate = useNavigate();
  const { search_term } = useTeamStore();
  const [active_sub_tab, set_active_sub_tab] = useState<
    "analysis" | "timesheet" | "payroll"
  >("analysis");
  const { teams: analysis_teams_raw, is_loading } = useTeamsOverview();
  const analysis_teams = analysis_teams_raw as unknown as AnalysisTeam[];

  // Capture: response shapes not in OpenAPI spec.
  // Disabled: backend currently registers GET /teams/{id} before the literal
  // /teams/teams-performance and /teams/teams-analysis routes, so these get
  // routed into the {id} handler and fail with a UUID parse error.
  // Re-enable once the backend re-orders routes.
  const { data: teamsPerformanceResponse } = useQuery({
    queryKey: ["teams-performance"],
    queryFn: () => getTeamsPerformance(),
    enabled: false,
  });
  const { data: teamsAnalysisResponse } = useQuery({
    queryKey: ["teams-analysis"],
    queryFn: () => getTeamsAnalysis(),
    enabled: false,
  });
  useEffect(() => {
    if (teamsPerformanceResponse) {
      console.log(
        "[capture] GET /teams/teams-performance",
        teamsPerformanceResponse,
      );
    }
  }, [teamsPerformanceResponse]);
  useEffect(() => {
    if (teamsAnalysisResponse) {
      console.log(
        "[capture] GET /teams/teams-analysis",
        teamsAnalysisResponse,
      );
    }
  }, [teamsAnalysisResponse]);

  const filtered = analysis_teams.filter(
    (team) =>
      (team.team_name ?? team.name)
        ?.toLowerCase()
        .includes(search_term.toLowerCase()) ||
      team.lead_name?.toLowerCase().includes(search_term.toLowerCase()),
  );

  const handle_view_team = (id: string) => navigate(`/dash/hr/teams/${id}`);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Team Analysis"
        subtitle="Breakdown of every team's activities, morale and participation by department"
      />

      <div className="flex items-center gap-6 border-b border-gray-200 overflow-x-auto">
        {(["analysis", "timesheet", "payroll"] as const).map((tab) => (
          <button
            key={tab}
            className={cn(
              "text-sm font-semibold pb-3 px-1 whitespace-nowrap transition-colors border-b-2",
              active_sub_tab === tab
                ? "text-[#251F2D] border-[#6619DE]"
                : "text-gray-400 border-transparent hover:text-gray-600",
            )}
            onClick={() => set_active_sub_tab(tab)}
          >
            {tab === "analysis"
              ? "Team Analysis"
              : tab === "timesheet"
                ? "Timesheet Weekly Overview"
                : "HR Payroll"}
          </button>
        ))}
      </div>

      {active_sub_tab === "analysis" && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-bold flex items-center gap-2 text-[#251F2D]">
                <GoGraph className="text-primary-color" /> Team Analysis
              </h3>
              <p className="text-sm text-gray-500">
                Morale and participation by department
              </p>
            </div>
            <div className="bg-[#EAEBEB] px-3 py-1 rounded-full text-xs font-bold text-[#6B7280]">
              {analysis_teams.length} teams
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {is_loading ? (
              <div className="col-span-full flex items-center justify-center p-20">
                <Loader2 className="animate-spin text-primary-color" />
              </div>
            ) : (
              filtered.map((team, idx) => (
                <TeamAnalysisCardComponent
                  key={`${team.team_id}-analysis-${idx}`}
                  team={team}
                  className="border-none shadow-sm hover:shadow-md transition-shadow"
                  actions={{ on_view: (id) => handle_view_team(id) }}
                />
              ))
            )}
          </div>
        </>
      )}

      {active_sub_tab === "timesheet" && <TimesheetWeeklyOverview />}
      {active_sub_tab === "payroll" && <HrPayroll />}
    </div>
  );
}

export default HrTeamAnalysisPage;

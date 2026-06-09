import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RiCalendarScheduleLine, RiHeartPulseLine } from "react-icons/ri";
import { PiUsersThree } from "react-icons/pi";
import { GoGraph } from "react-icons/go";
import { IoWarningOutline } from "react-icons/io5";
import { HiOutlineUserGroup } from "react-icons/hi";
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";

import StatusCards from "@/shared/components/status-cards.component";
import { UpcomingSchedule } from "@/shared/components/upcoming-schedule.component";
import PageHeader from "@/shared/components/page-header.component";
import BurnoutAlertsChart from "@/hr/components/burnout-alerts-chart.component";
import TeamPerformanceListItem from "@/hr/components/team-performance-list-item.component";
// Wellness Trend cards hidden — no backing API endpoint in docs; the prior
// implementation surfaced only sample data.
import { useTeamsOverview } from "@/hr/hooks/use-teams-overview";
import { useHrScheduleMeeting } from "@/hr/hooks/use-hr-schedule-meeting";
import { get_upcoming_meetings_today } from "@/config/services/meeting.service";
import { get_average_mood_for_the_week } from "@/config/services/mood-trends.service";
import { getAnalyticsDashboard } from "@/config/services/teams.service";
import useTeamStore from "@/config/stores/team.store";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import type { TeamOverviewCardResponse } from "@/shared/typings/hr-service";
import {
  TakeTourButton,
  useGuidedTour,
} from "@/shared/components/guided-tour";
import OverviewAlertsBanner from "@/shared/components/overview-alerts-banner.component";
import { hrOverviewTourSteps } from "../hr-overview.tour-steps";

type AnalysisTeam = TeamOverviewCardResponse;

function HrOverviewPage() {
  const navigate = useNavigate();
  const { open: openScheduleMeeting } = useHrScheduleMeeting();
  const { search_term } = useTeamStore();
  const { startTour } = useGuidedTour("hr", hrOverviewTourSteps);

  const { teams: analysis_teams_raw, is_loading: is_analysis_loading } =
    useTeamsOverview();
  const analysis_teams: AnalysisTeam[] =
    analysis_teams_raw as unknown as AnalysisTeam[];

  const { data: upcomingMeetingsData, isLoading: upcomingMeetingsLoading } =
    useQuery({
      queryKey: ["upcoming-meetings-today"],
      queryFn: () => get_upcoming_meetings_today(),
    });
  const upcomingMeetingData = upcomingMeetingsData?.data;
  const upcomingRemainingCount =
    upcomingMeetingData?.remaining_meetings?.length ?? 0;

  // Capture: response shape not in the OpenAPI spec — log so it can be wired in.
  // Disabled: backend currently registers GET /teams/{id} before the literal
  // /teams/analytics-dashboard route, so requests hit the {id} handler and
  // fail with "invalid input syntax for type uuid". Re-enable once the
  // backend re-orders routes (literal segments before :id params).
  const { data: analyticsDashboardResponse } = useQuery({
    queryKey: ["hr-analytics-dashboard"],
    queryFn: () => getAnalyticsDashboard(),
    enabled: false,
  });
  useEffect(() => {
    if (analyticsDashboardResponse) {
      console.log(
        "[capture] GET /teams/analytics-dashboard",
        analyticsDashboardResponse,
      );
    }
  }, [analyticsDashboardResponse]);
  // Org-wide check-in volume for the week.
  const { data: avgMoodResponse } = useQuery({
    queryKey: ["mood-average", "week"],
    queryFn: () => get_average_mood_for_the_week({ period: "week" }),
  });
  const checkin_sample_size = avgMoodResponse?.data?.mood_scores?.length ?? 0;
  const teamCount = analysis_teams.length;
  const totalStaff = analysis_teams.reduce(
    (acc, team) => acc + (team.member_count || 0),
    0,
  );
  const atRiskStaff = analysis_teams
    .filter((team) => team.status === "AT_RISK" || team.status === "FLAGGED")
    .reduce((acc, team) => acc + (team.member_count || 0), 0);
  const activeStaff = Math.max(0, totalStaff - atRiskStaff);
  const avgProductivityScore = teamCount
    ? Math.round(
        analysis_teams.reduce(
          (acc, team) => acc + (team.performance_score || 0),
          0,
        ) / teamCount,
      )
    : 0;
  const attendancePercentage =
    totalStaff > 0
      ? Math.min(
          100,
          Math.round((checkin_sample_size / totalStaff) * 100),
        )
      : 0;
  const burnoutAlertsCount = analysis_teams.filter(
    (team) => team.status === "AT_RISK" || team.status === "FLAGGED",
  ).length;
  const highPerformingTeams = analysis_teams.filter(
    (team) => (team.performance_score || 0) >= 80,
  ).length;
  const managerPerformanceReview = teamCount
    ? Math.round((highPerformingTeams / teamCount) * 100)
    : 0;

  const filtered_analysis_teams = analysis_teams.filter(
    (team) =>
      team.name?.toLowerCase().includes(search_term.toLowerCase()) ||
      team.lead_name?.toLowerCase().includes(search_term.toLowerCase()),
  );

  const status_items = [
    {
      id: "total_staff",
      title: "Total Staff",
      value: String(totalStaff),
      icon: <PiUsersThree size={16} />,
      icon_classname: "text-[#6619DE]",
      delta_value: 0,
      value_suffix: "",
      delta_text: totalStaff > 0 ? "Live headcount" : "—",
      delta_color: "success" as const,
      delta_period: "across teams",
    },
    {
      id: "active_staff",
      title: "Active Staff",
      value: String(activeStaff),
      icon: <HiOutlineUserGroup size={16} />,
      icon_classname: "text-success-color",
      delta_value: activeStaff,
      delta_text: totalStaff > 0 ? "engaged" : "—",
      delta_color: "success" as const,
      delta_period: "currently active",
    },
    {
      id: "productivity_score",
      title: "Productivity Score",
      value: String(avgProductivityScore),
      value_suffix: "%",
      icon: <GoGraph size={16} />,
      icon_classname: "text-primary-color",
      delta_value: 0,
      delta_text: "team average",
      delta_color: "success" as const,
      delta_period: "across teams",
    },
    {
      id: "attendance_percentage",
      title: "Attendance Percentage",
      value: String(attendancePercentage),
      value_suffix: "%",
      icon: <RiHeartPulseLine size={16} />,
      icon_classname: "text-success-color",
      delta_value: 0,
      delta_text: "weekly check-ins",
      delta_color: "success" as const,
      delta_period: "attendance",
    },
    {
      id: "attrition_risk_indicator",
      title: "Attrition Risk Indicator",
      value: String(atRiskStaff),
      icon: <IoWarningOutline size={16} />,
      icon_classname: "text-danger-color",
      delta_value: atRiskStaff,
      delta_text: atRiskStaff > 0 ? "staff at risk" : "safe",
      delta_color: atRiskStaff > 0 ? ("danger" as const) : ("success" as const),
      delta_period: "headcount",
    },
    {
      id: "burnout_alerts_count",
      title: "Burnout Alerts Count",
      value: String(burnoutAlertsCount),
      icon: <IoWarningOutline size={16} />,
      icon_classname: "text-danger-color",
      delta_value: burnoutAlertsCount,
      delta_text: burnoutAlertsCount > 0 ? "teams flagged" : "clear",
      delta_color:
        burnoutAlertsCount > 0 ? ("danger" as const) : ("success" as const),
      delta_period: "this week",
    },
    {
      id: "manager_performance_review",
      title: "Manager Performance Review",
      value: String(managerPerformanceReview),
      value_suffix: "%",
      icon: <HiOutlineClipboardDocumentCheck size={16} />,
      icon_classname: "text-[#7C3AED]",
      delta_value: highPerformingTeams,
      delta_text: highPerformingTeams > 0 ? "managers on target" : "—",
      delta_color: "success" as const,
      delta_period: "team review",
    },
  ];

  const burnoutSeries = analysis_teams
    .slice()
    .filter((team) => team.status === "AT_RISK" || team.status === "FLAGGED")
    .map((team) => ({
      label: team.name ?? "Team",
      value: team.status === "FLAGGED" ? 2 : 1,
    }));

  const handle_view_team = (id: string) => {
    navigate(`/dash/hr/teams/${id}`);
  };

  return (
    <div className="space-y-8">
      <OverviewAlertsBanner />
      <PageHeader
        dataTour="page-header"
        title="Admin Analytics Dashboard (Overview)"
        subtitle="Strategic insights into team wellbeing and productivity"
        actions={
          <>
            <TakeTourButton onStart={startTour} />
            <Button
              onClick={() => openScheduleMeeting(null)}
              className="bg-[#6619DE] hover:bg-[#5710c4] h-11 px-6 rounded-xl gap-2 font-semibold"
            >
              <RiCalendarScheduleLine className="h-4 w-4" />
              Schedule Meeting
            </Button>
          </>
        }
      />

      <div data-tour="status-cards">
        <StatusCards items={status_items} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div data-tour="burnout-alerts">
          <BurnoutAlertsChart
            total_at_risk={burnoutAlertsCount}
            // delta_vs_last_week omitted — no API for weekly delta in the docs yet.
            series={burnoutSeries}
          />
        </div>
        <div data-tour="upcoming-schedule">
          <UpcomingSchedule
            meeting={upcomingMeetingData}
            remainingCount={upcomingRemainingCount}
            isLoading={upcomingMeetingsLoading}
          />
        </div>
      </div>

      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-[#251F2D]">
            Organizational Health Overview
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Real-time telemetry on team performance metrics and predictive
            wellness indicators.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div
            data-tour="team-performance"
            className="rounded-3xl bg-white p-5 border border-gray-200"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="size-8 rounded-full bg-[#F3EBFF] flex items-center justify-center">
                <HiOutlineUserGroup className="text-[#6619DE]" size={16} />
              </span>
              <h3 className="text-sm font-semibold text-[#251F2D]">
                Team Performance
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              {is_analysis_loading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="animate-spin text-primary-color" />
                </div>
              ) : filtered_analysis_teams.length === 0 ? (
                <p className="text-sm text-gray-400 italic px-2 py-6 text-center">
                  No teams to display.
                </p>
              ) : (
                filtered_analysis_teams.map((team, idx) => (
                  <TeamPerformanceListItem
                    key={`${team.team_id}-${idx}`}
                    team={team}
                    onClick={() => handle_view_team(team.team_id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Wellness Trend section removed — no backing API endpoint in docs. */}
        </div>
      </section>
    </div>
  );
}

export default HrOverviewPage;

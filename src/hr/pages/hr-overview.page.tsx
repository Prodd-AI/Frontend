import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RiCalendarScheduleLine, RiHeartPulseLine } from "react-icons/ri";
import { PiUsersThree } from "react-icons/pi";
import { GoGraph } from "react-icons/go";
import { IoWarningOutline } from "react-icons/io5";
import { HiOutlineUserGroup } from "react-icons/hi";

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

  // Org-wide average mood for the week.
  const { data: avgMoodResponse } = useQuery({
    queryKey: ["mood-average", "week"],
    queryFn: () => get_average_mood_for_the_week({ period: "week" }),
  });

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
  const org_avg_mood = avgMoodResponse?.data?.average_mood;
  const org_avg_mood_text =
    typeof org_avg_mood === "number" ? org_avg_mood.toFixed(1) : "—";
  const checkin_sample_size = avgMoodResponse?.data?.mood_scores?.length ?? 0;

  const filtered_analysis_teams = analysis_teams.filter(
    (team) =>
      team.name?.toLowerCase().includes(search_term.toLowerCase()) ||
      team.lead_name?.toLowerCase().includes(search_term.toLowerCase()),
  );

  const total_employees = analysis_teams.reduce(
    (acc, team) => acc + (team.member_count || 0),
    0,
  );
  const total_at_risk = analysis_teams.filter(
    (team) => team.status === "AT_RISK" || team.status === "FLAGGED",
  ).length;
  const checkin_rate =
    total_employees > 0
      ? Math.min(
          100,
          Math.round((checkin_sample_size / total_employees) * 100),
        )
      : 0;

  const status_items = [
    {
      id: "total_employees",
      title: "Total Employees",
      value: String(total_employees),
      icon: <PiUsersThree size={16} />,
      icon_classname: "text-[#6619DE]",
      delta_value: 0,
      value_suffix: "",
      delta_text: total_employees > 0 ? "Active" : "—",
      delta_color: "success" as const,
      delta_period: "across teams",
    },
    {
      id: "check_in_rate",
      title: "Check-in Rate",
      value: String(checkin_rate),
      value_suffix: "%",
      icon: <RiHeartPulseLine size={16} />,
      icon_classname: "text-success-color",
      delta_value: 0,
      delta_text: "weekly",
      delta_color: "success" as const,
      delta_period: "participation",
    },
    {
      id: "avg_mood",
      title: "Average Mood",
      value: org_avg_mood_text,
      icon: <GoGraph size={16} />,
      icon_classname: "text-primary-color",
      delta_value: 0,
      delta_text: "score",
      delta_color: "success" as const,
      delta_period: "out of 5",
    },
    {
      id: "flight_risks",
      title: "Flight Risks",
      value: String(total_at_risk),
      icon: <IoWarningOutline size={16} />,
      icon_classname: "text-danger-color",
      delta_value: total_at_risk,
      delta_text: total_at_risk > 0 ? "alert" : "safe",
      delta_color: total_at_risk > 0 ? ("danger" as const) : ("success" as const),
      delta_period: "team count",
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
      <PageHeader
        dataTour="page-header"
        title="HR Analytics Dashboard (Overview)"
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
            total_at_risk={total_at_risk}
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

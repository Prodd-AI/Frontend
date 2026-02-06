import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MeetingCardComponent from "@/shared/components/meeting-card.component";
import StatusCards from "@/shared/components/status-cards.component";
import TeamAnalysisCardComponent from "@/shared/components/team-analysis-card.component";
import TeamPerformanceListItem from "../components/team-performance-list-item.component";
import FlightRiskCardComponent from "@/hr/components/flight-risk-card.component";
import WellnessTrendCards from "@/hr/components/wellness-trend-cards.component";
import MoodHeatmap from "../components/mood-heatmap.component";
import TimesheetWeeklyOverview from "../components/timesheet-overview.component";
import HrPayroll from "../components/hr-payroll.component";
import useTeamStore from "@/config/stores/team.store";
import useDateStore from "@/config/stores/date.store";
import { DatePeriod } from "@/shared/typings/date.store";
import { FiDownload, FiFilter } from "react-icons/fi";
import { GoGraph, GoArrowUpRight } from "react-icons/go";
import { HiOutlineUserGroup } from "react-icons/hi";
import { IoWarningOutline } from "react-icons/io5";
import { MdOutlineDashboard } from "react-icons/md";
import { PiUsersThree } from "react-icons/pi";
import { RiHeartPulseLine } from "react-icons/ri";
import { useFlightRisk } from "../hooks/use-flight-risk";
import { useTeams } from "@/shared/hooks/use-teams";
import { useTeamsOverview } from "../hooks/use-teams-overview";
import { Loader2 } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function HrPage() {
  const navigate = useNavigate();
  const [active_tab, set_active_tab] = useState("overview");

  const handle_view_employee = (id: string) => {
    navigate(`/dash/hr/employee/${id}`);
  };

  const handle_view_team = (id: string) => {
    navigate(`/dash/hr/team/${id}`);
  };
  const [active_team_sub_tab, set_active_team_sub_tab] = useState<
    "analysis" | "timesheet" | "payroll"
  >("analysis");

  const [invite_email, set_invite_email] = useState("");

  const handle_invite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invite_email) return toast.error("Please enter an email address");
    toast.success(`Invitation sent to ${invite_email}!`);
    set_invite_email("");
  };

  const {
    selectedTeamId: selected_team_id,
    setSelectedTeamId: set_selected_team_id,
    search_term,
    set_search_term,
  } = useTeamStore();
  const { selected_period, set_selected_period } = useDateStore();

  const { teams: real_teams, is_loading: is_teams_loading } = useTeams();
  const { flight_risks, is_loading: is_flight_risk_loading } = useFlightRisk();
  const { teams: analysis_teams, is_loading: is_analysis_loading } =
    useTeamsOverview();

  const filtered_analysis_teams = analysis_teams.filter(
    (team: any) =>
      team.team_name.toLowerCase().includes(search_term.toLowerCase()) ||
      team.lead_name.toLowerCase().includes(search_term.toLowerCase()),
  );

  const filtered_flight_risks = flight_risks.filter((person: any) =>
    person.member_name.toLowerCase().includes(search_term.toLowerCase()),
  );

  const total_employees = analysis_teams.reduce(
    (acc: number, team: any) => acc + (team.member_count || 0),
    0,
  );
  const total_at_risk = analysis_teams.reduce(
    (acc: number, team: any) => acc + (team.at_risk_count || 0),
    0,
  );
  const avg_mood =
    analysis_teams.length > 0
      ? (
          analysis_teams.reduce(
            (acc: number, team: any) => acc + (team.avg_score || 0),
            0,
          ) / analysis_teams.length
        ).toFixed(1)
      : "0";
  const avg_participation =
    analysis_teams.length > 0
      ? (
          analysis_teams.reduce(
            (acc: number, team: any) => acc + (team.participation_percent || 0),
            0,
          ) / analysis_teams.length
        ).toFixed(0)
      : "0";

  const status_items = [
    {
      id: "total_employees",
      title: "Total Employees",
      value: String(total_employees),
      icon: <PiUsersThree size={18} />,
      icon_classname: "text-[#6619DE]",
      delta_value: 0,
      value_suffix: "",
      delta_text: total_employees > 0 ? "Active" : "None",
      delta_color: "success" as const,
      delta_period: "Across teams",
      description: "Total number of employees on board",
    },
    {
      id: "check_in_rate",
      title: "Check-in Rate",
      value: avg_participation,
      value_suffix: "%",
      icon: <RiHeartPulseLine size={18} />,
      icon_classname: "text-success-color",
      delta_value: 0,
      delta_text: "Avg",
      delta_color: "success" as const,
      delta_period: "Daily average",
      description: "More employees are checking in daily",
    },
    {
      id: "avg_mood",
      title: "Average Mood",
      value: avg_mood,
      icon: <GoGraph size={18} />,
      icon_classname: "text-primary-color",
      delta_value: 0,
      delta_text: "Score",
      delta_color: "success" as const,
      delta_period: "Global average",
      description: "Avg. team mood across organization",
    },
    {
      id: "at_risk",
      title: "At Risk",
      value: String(total_at_risk),
      icon: <IoWarningOutline size={18} />,
      icon_classname: "text-danger-color",
      delta_value: total_at_risk,
      delta_text: total_at_risk > 0 ? "Alert" : "Safe",
      delta_color:
        total_at_risk > 0 ? ("danger" as const) : ("success" as const),
      delta_period: total_at_risk > 0 ? "Needs Attention" : "All good",
      description: "Employees showing signs of burnout",
    },
    {
      id: "burnout_alerts",
      title: "Burnout Alerts",
      value: String(total_at_risk), // Mirror at risk for now
      icon: <RiHeartPulseLine size={18} />,
      icon_classname: "text-danger-color",
      delta_value: total_at_risk,
      delta_text: total_at_risk > 0 ? "High" : "Low",
      delta_color:
        total_at_risk > 0 ? ("danger" as const) : ("success" as const),
      delta_period: "Organization wide",
      description: "Burnout risk notifications",
    },
  ];

  const wellness_trends = [
    {
      id: "1",
      title: "Positive Trend",
      description:
        "Engineering team mood improved 15% this month after implementing flexible hours",
      variant: "positive" as const,
    },
    {
      id: "2",
      title: "Attention Needed",
      description:
        "Design team maintained 4.2+ mood rating for 3 consecutive weeks",
      variant: "achievement" as const,
    },
    {
      id: "4",
      title: "Burnout Risk Alerts",
      description: "Sales team showing elevated stress levels during Q1 push",
      variant: "risk" as const,
    },
  ];

  const overview_content = (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2 text-[#251F2D]">
              <HiOutlineUserGroup className="text-primary-color" /> Team
              Performance
            </h3>
            <p className="text-sm text-gray-500">
              Check how various teams performed so far
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {is_analysis_loading ? (
              <div className="flex items-center justify-center p-10">
                <Loader2 className="animate-spin text-primary-color" />
              </div>
            ) : (
              filtered_analysis_teams.map((team: any, idx: number) => (
                <TeamPerformanceListItem
                  key={`${team.id}-${idx}`}
                  team={team}
                  onClick={() => handle_view_team(team.id)}
                />
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2 text-[#251F2D]">
              <RiHeartPulseLine className="text-success-color" /> Wellness
              Trends
            </h3>
            <p className="text-sm text-gray-500">
              Check how various teams performed so far
            </p>
          </div>
          <WellnessTrendCards items={wellness_trends} />
        </div>
      </div>

      {/* Invite Attendee Section */}
      <div className="w-full max-w-md">
        <h4 className="text-sm font-bold text-[#251F2D] mb-3">
          Invite Attendee
        </h4>
        <form onSubmit={handle_invite} className="flex items-center gap-3">
          <Input
            placeholder="email address"
            className="bg-[#F9FAFB] border border-[#E5E7EB] h-[48px] focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-[#6619DE]"
            value={invite_email}
            onChange={(e) => set_invite_email(e.target.value)}
            type="email"
          />
          <Button
            type="submit"
            className="bg-[#6619DE] hover:bg-[#5214B3] w-[56px] h-[48px] shrink-0 rounded-[8px]"
          >
            <GoArrowUpRight size={24} />
          </Button>
        </form>
      </div>
    </div>
  );

  const flight_risk_content = (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-[#251F2D] flex items-center gap-2">
          <IoWarningOutline className="text-danger-color" size={20} /> Flight
          Risk Panel
        </h3>
        <p className="text-sm text-gray-500">
          Employees showing signs of burnout or disengagement
        </p>
      </div>

      {is_flight_risk_loading ? (
        <div className="flex flex-col items-center justify-center p-20 bg-white rounded-xl">
          <Loader2 className="size-8 text-primary-color animate-spin mb-2" />
          <p className="text-gray-500 font-medium">
            Loading flight risk analysis...
          </p>
        </div>
      ) : flight_risks.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 bg-white rounded-xl text-gray-400 italic">
          No at-risk employees found for the selected filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered_flight_risks.map((person) => (
            <FlightRiskCardComponent
              key={person.id}
              person={person}
              actions={{
                on_view_profile: (id) => handle_view_employee(id),
              }}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="py-4 md:py-6 space-y-8">
      {/* Header & Filters */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#251F2D]">
              HR Analytics Dashboard
            </h1>
            <p className="text-gray-500">
              Strategic insights into team wellbeing and productivity
            </p>
          </div>
          <Button className="w-full md:w-auto cursor-pointer h-[44px] bg-gradient-to-r px-6 from-primary-color to-[#1C75BC] hover:scale-105 transition-all duration-300 gap-2">
            <FiDownload /> Export Report
          </Button>
        </div>

        <div className="mt-4 bg-white p-6 rounded-xl shadow-sm grid grid-cols-1 md:grid-cols-12 items-center gap-4">
          <div className="md:col-span-1 flex items-center gap-2 text-gray-500 font-medium whitespace-nowrap">
            <FiFilter /> Filters:
          </div>

          <div className="md:col-span-2">
            <Select
              value={selected_team_id || "all"}
              onValueChange={(val) =>
                set_selected_team_id(val === "all" ? null : val)
              }
              disabled={is_teams_loading}
            >
              <SelectTrigger className="w-full bg-[#F3F4F6] border-none">
                <SelectValue
                  placeholder={is_teams_loading ? "Loading..." : "All Teams"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teams</SelectItem>
                {real_teams.map((team: any) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.team_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Select
              value={selected_period}
              onValueChange={(val: DatePeriod) => set_selected_period(val)}
            >
              <SelectTrigger className="w-full bg-[#F3F4F6] border-none">
                <SelectValue placeholder="Last 30 days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-3">
            <Input
              placeholder="Search employees..."
              className="bg-[#F3F4F6] border-none w-full"
              value={search_term}
              onChange={(e) => set_search_term(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Top Metrics */}
      <StatusCards items={status_items} />

      {/* Meeting Card */}
      <MeetingCardComponent
        meeting={{
          id: "m1",
          title: "1:1 with Mike Chan",
          subtitle: "Upcoming Meeting/Call",
          status: "starting_soon",
          start_in_minutes: 20,
          participants_count: 1,
        }}
      />

      {/* Tabs & Content */}
      <Tabs
        value={active_tab}
        onValueChange={set_active_tab}
        className="w-full"
      >
        {/* Scrollable List Wrapper */}
        <div className="w-full overflow-x-auto pb-2">
          <TabsList className="bg-[#EAEBEB] h-14 p-1.5 rounded-[12px] min-w-[600px] md:w-full gap-1 grid grid-cols-4">
            <TabsTrigger
              value="overview"
              className="flex items-center justify-center text-sm gap-2 cursor-pointer px-5 py-2.5 rounded-[8px] transition-all duration-300 font-medium text-[#6B7280] hover:text-[#251F2D] data-[state=active]:bg-white data-[state=active]:text-[#251F2D] data-[state=active]:shadow-sm"
            >
              <MdOutlineDashboard className="text-base" /> Overview
            </TabsTrigger>
            <TabsTrigger
              value="mood"
              className="flex items-center justify-center text-sm gap-2 cursor-pointer px-5 py-2.5 rounded-[8px] transition-all duration-300 font-medium text-[#6B7280] hover:text-[#251F2D] data-[state=active]:bg-white data-[state=active]:text-[#251F2D] data-[state=active]:shadow-sm"
            >
              <RiHeartPulseLine className="text-base" /> Mood Heatmap
            </TabsTrigger>
            <TabsTrigger
              value="team"
              className="flex items-center justify-center text-sm gap-2 cursor-pointer px-5 py-2.5 rounded-[8px] transition-all duration-300 font-medium text-[#6B7280] hover:text-[#251F2D] data-[state=active]:bg-white data-[state=active]:text-[#251F2D] data-[state=active]:shadow-sm"
            >
              <GoGraph className="text-base" /> Team Analysis
            </TabsTrigger>
            <TabsTrigger
              value="flight_risk"
              className="flex items-center justify-center text-sm gap-2 cursor-pointer px-5 py-2.5 rounded-[8px] transition-all duration-300 font-medium text-[#6B7280] hover:text-[#251F2D] data-[state=active]:bg-white data-[state=active]:text-[#251F2D] data-[state=active]:shadow-sm"
            >
              <IoWarningOutline className="text-base" /> Flight Risk
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-6">
          {overview_content}
        </TabsContent>

        <TabsContent value="mood" className="mt-6">
          <MoodHeatmap />
        </TabsContent>

        <TabsContent value="team" className="mt-6 space-y-6">
          {
            <div className="flex flex-col gap-4">
              {/* Shared Sub-tabs header */}
              <div className="flex items-center gap-6 border-b border-gray-200 pb-1 overflow-x-auto">
                <button
                  className={cn(
                    "text-sm font-semibold pb-3 px-1 whitespace-nowrap transition-colors border-b-2",
                    active_team_sub_tab === "analysis"
                      ? "text-[#251F2D] border-[#251F2D]"
                      : "text-gray-400 border-transparent hover:text-gray-600",
                  )}
                  onClick={() => set_active_team_sub_tab("analysis")}
                >
                  Team Analysis
                </button>
                <button
                  className={cn(
                    "text-sm font-semibold pb-3 px-1 whitespace-nowrap transition-colors border-b-2",
                    active_team_sub_tab === "timesheet"
                      ? "text-[#251F2D] border-[#251F2D]"
                      : "text-gray-400 border-transparent hover:text-gray-600",
                  )}
                  onClick={() => set_active_team_sub_tab("timesheet")}
                >
                  Timesheet Weekly Overview
                </button>
                <button
                  className={cn(
                    "text-sm font-semibold pb-3 px-1 whitespace-nowrap transition-colors border-b-2",
                    active_team_sub_tab === "payroll"
                      ? "text-[#251F2D] border-[#251F2D]"
                      : "text-gray-400 border-transparent hover:text-gray-600",
                  )}
                  onClick={() => set_active_team_sub_tab("payroll")}
                >
                  HR Payroll
                </button>
              </div>

              {active_team_sub_tab === "analysis" && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-lg font-bold flex items-center gap-2 text-[#251F2D]">
                        <GoGraph className="text-primary-color" /> Team Analysis
                      </h3>
                      <p className="text-sm text-gray-500">
                        Breakdown of every team activities, Morale and
                        participation by department
                      </p>
                    </div>
                    <div className="bg-[#EAEBEB] px-3 py-1 rounded-full text-xs font-bold text-[#6B7280]">
                      {analysis_teams.length} teams
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {is_analysis_loading ? (
                      <div className="col-span-full flex items-center justify-center p-20">
                        <Loader2 className="animate-spin text-primary-color" />
                      </div>
                    ) : (
                      filtered_analysis_teams.map((team: any, idx: number) => (
                        <TeamAnalysisCardComponent
                          key={`${team.id}-analysis-${idx}`}
                          team={team}
                          className="border-none shadow-sm hover:shadow-md transition-shadow"
                          actions={{
                            on_view: (id) => handle_view_team(id),
                          }}
                        />
                      ))
                    )}
                  </div>
                </>
              )}

              {active_team_sub_tab === "timesheet" && (
                <TimesheetWeeklyOverview />
              )}
              {active_team_sub_tab === "payroll" && <HrPayroll />}
            </div>
          }
        </TabsContent>

        <TabsContent value="flight_risk" className="mt-6">
          {flight_risk_content}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default HrPage;

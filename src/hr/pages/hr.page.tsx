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
import { FiDownload, FiFilter } from "react-icons/fi";
import { GoGraph, GoArrowUpRight } from "react-icons/go";
import { HiOutlineUserGroup } from "react-icons/hi";
import { IoWarningOutline } from "react-icons/io5";
import { MdOutlineDashboard } from "react-icons/md";
import { PiUsersThree } from "react-icons/pi";
import { RiHeartPulseLine } from "react-icons/ri";

function HrPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeTeamSubTab, setActiveTeamSubTab] = useState<
    "analysis" | "timesheet" | "payroll"
  >("analysis");

  const statusItems = [
    {
      id: "total_employees",
      title: "Total Employees",
      value: "156",
      icon: <PiUsersThree size={18} />,
      icon_classname: "text-[#6619DE]",
      delta_value: 0.3,
      value_suffix: "",
      delta_text: "+0.3",
      delta_color: "success" as const,
      delta_period: "vs Last week",
      description: "Total number of employees on board",
    },
    {
      id: "check_in_rate",
      title: "Check-in Rate",
      value: "87",
      value_suffix: "%",
      icon: <RiHeartPulseLine size={18} />,
      icon_classname: "text-success-color",
      delta_value: 5,
      delta_text: "+5",
      delta_color: "success" as const,
      delta_period: "vs Last week",
      description: "More employees are checking in daily",
    },
    {
      id: "avg_mood",
      title: "Average Mood",
      value: "3.8",
      icon: <GoGraph size={18} />,
      icon_classname: "text-primary-color",
      delta_value: 0.3,
      delta_text: "+0.3",
      delta_color: "success" as const,
      delta_period: "vs Last week",
      description: "Avg. team mood improved this week",
    },
    {
      id: "flight_risk",
      title: "Flight Risk",
      value: "12",
      icon: <IoWarningOutline size={18} />,
      icon_classname: "text-danger-color",
      delta_value: 2,
      delta_text: "+2",
      delta_color: "danger" as const,
      delta_period: "Needs Attention",
      description: "More team members poses risk",
    },
    {
      id: "burnout_alerts",
      title: "Burnout Alerts",
      value: "4",
      icon: <RiHeartPulseLine size={18} />,
      icon_classname: "text-success-color",
      delta_value: 1,
      delta_text: "+1",
      delta_color: "danger" as const,
      delta_period: "vs Last week",
      description: "Employees showing signs of burnout",
    },
  ];

  const teams = [
    {
      id: "eng",
      team_name: "Engineering",
      lead_name: "Sarah Johnson",
      avg_score: 3.9,
      member_count: 25,
      at_risk_count: 2,
      morale_percent: 78,
      participation_percent: 92,
    },
    {
      id: "des",
      team_name: "Design",
      lead_name: "Mike Chan",
      avg_score: 4.2,
      member_count: 12,
      at_risk_count: 0,
      morale_percent: 88,
      participation_percent: 95,
    },
    {
      id: "prod",
      team_name: "Product",
      lead_name: "Lisa Wang",
      avg_score: 3.6,
      member_count: 18,
      at_risk_count: 3,
      morale_percent: 65,
      participation_percent: 80,
    },
    {
      id: "eng2",
      team_name: "Engineering",
      lead_name: "Sarah Johnson",
      avg_score: 3.9,
      member_count: 25,
      at_risk_count: 2,
      morale_percent: 78,
      participation_percent: 92,
    },
  ];

  const wellnessTrends = [
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

  const OverviewContent = (
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
            {teams.map((team, idx) => (
              <TeamPerformanceListItem key={`${team.id}-${idx}`} team={team} />
            ))}
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
          <WellnessTrendCards items={wellnessTrends} />
        </div>
      </div>

      {/* Invite Attendee Section */}
      <div className="w-full max-w-md">
        <h4 className="text-sm font-bold text-[#251F2D] mb-3">
          Invite Attendee
        </h4>
        <div className="flex items-center gap-3">
          <Input
            placeholder="email address"
            className="bg-[#F9FAFB] border border-[#E5E7EB] h-[48px] focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-[#6619DE]"
          />
          <Button className="bg-[#6619DE] hover:bg-[#5214B3] w-[56px] h-[48px] shrink-0 rounded-[8px]">
            <GoArrowUpRight size={24} />
          </Button>
        </div>
      </div>
    </div>
  );

  const flightRiskPeople = [
    {
      id: "p1",
      member_name: "Alex Chan",
      role_title: "Frontend Develop",
      team_name: "Engineering Team",
      status: "at_risk" as const,
      avg_mood_score: 2.1,
      avg_mood_scale: 5,
      task_completion_percent: 55,
      weekly_streak_days: 2,
      last_checkin_label: "2 days ago",
      risk_factors: [
        "Low task completion",
        "Missed deadlines",
        "Reduced activity",
      ],
      scheduled_call_label: undefined,
    },
    {
      id: "p2",
      member_name: "Alex Chan",
      role_title: "Frontend Develop",
      team_name: "Engineering Team",
      status: "at_risk" as const,
      avg_mood_score: 2.1,
      avg_mood_scale: 5,
      task_completion_percent: 55,
      weekly_streak_days: 2,
      last_checkin_label: "2 days ago",
      risk_factors: [
        "Very Low task completion",
        "Extended inactivity",
        "Multiple missed check-ins",
      ],
      scheduled_call_label: "Call scheduled for 1/21/2024",
    },
    {
      id: "p3",
      member_name: "Alex Chan",
      role_title: "Frontend Develop",
      team_name: "Engineering Team",
      status: "at_risk" as const,
      avg_mood_score: 2.1,
      avg_mood_scale: 5,
      task_completion_percent: 55,
      weekly_streak_days: 2,
      last_checkin_label: "2 days ago",
      risk_factors: ["Declining Productivity", "Missed team meetings"],
      scheduled_call_label: "Call scheduled for 1/21/2024",
    },
  ];

  const FlightRiskContent = (
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
      <div className="grid grid-cols-1 gap-4">
        {flightRiskPeople.map((person) => (
          <FlightRiskCardComponent key={person.id} person={person} />
        ))}
      </div>
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

        <div className="mt-4 bg-white p-3 rounded-xl shadow-sm grid grid-cols-1 md:grid-cols-12 items-center gap-4">
          <div className="md:col-span-1 flex items-center gap-2 text-gray-500 font-medium whitespace-nowrap">
            <FiFilter /> Filters:
          </div>

          <div className="md:col-span-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-full bg-[#F3F4F6] border-none">
                <SelectValue placeholder="All Teams" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teams</SelectItem>
                <SelectItem value="eng">Engineering</SelectItem>
                <SelectItem value="design">Design</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Select defaultValue="30days">
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
            />
          </div>

          <div className="md:col-span-4 flex items-center justify-end gap-2">
            <span className="text-xs font-bold text-[#251F2D] whitespace-nowrap">
              View Screen
            </span>
            <div className="flex bg-[#F3F4F6] p-1 rounded-lg">
              <button className="px-3 py-1 text-xs font-semibold text-gray-500 hover:text-gray-900 rounded-md">
                Team Member
              </button>
              <button className="px-3 py-1 text-xs font-semibold text-gray-500 hover:text-gray-900 rounded-md">
                Team Lead
              </button>
              <button className="px-3 py-1 text-xs font-semibold bg-primary-color text-white rounded-md shadow-sm">
                HR
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Top Metrics */}
      <StatusCards items={statusItems} />

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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
          {OverviewContent}
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
                    activeTeamSubTab === "analysis"
                      ? "text-[#251F2D] border-[#251F2D]"
                      : "text-gray-400 border-transparent hover:text-gray-600",
                  )}
                  onClick={() => setActiveTeamSubTab("analysis")}
                >
                  Team Analysis
                </button>
                <button
                  className={cn(
                    "text-sm font-semibold pb-3 px-1 whitespace-nowrap transition-colors border-b-2",
                    activeTeamSubTab === "timesheet"
                      ? "text-[#251F2D] border-[#251F2D]"
                      : "text-gray-400 border-transparent hover:text-gray-600",
                  )}
                  onClick={() => setActiveTeamSubTab("timesheet")}
                >
                  Timesheet Weekly Overview
                </button>
                <button
                  className={cn(
                    "text-sm font-semibold pb-3 px-1 whitespace-nowrap transition-colors border-b-2",
                    activeTeamSubTab === "payroll"
                      ? "text-[#251F2D] border-[#251F2D]"
                      : "text-gray-400 border-transparent hover:text-gray-600",
                  )}
                  onClick={() => setActiveTeamSubTab("payroll")}
                >
                  HR Payroll
                </button>
              </div>

              {activeTeamSubTab === "analysis" && (
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
                      {teams.length} teams
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {teams.map((team, idx) => (
                      <TeamAnalysisCardComponent
                        key={`${team.id}-analysis-${idx}`}
                        team={team}
                        className="border-none shadow-sm hover:shadow-md transition-shadow"
                      />
                    ))}
                  </div>
                </>
              )}

              {activeTeamSubTab === "timesheet" && <TimesheetWeeklyOverview />}
              {activeTeamSubTab === "payroll" && <HrPayroll />}
            </div>
          }
        </TabsContent>

        <TabsContent value="flight_risk" className="mt-6">
          {FlightRiskContent}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default HrPage;

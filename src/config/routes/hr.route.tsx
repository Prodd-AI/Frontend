import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import TeamMemberScreenLayout from "@/shared/components/layouts/team-member-screen-layout.component";
import HrScheduleMeetingProvider from "@/hr/components/hr-schedule-meeting-context";
import {
  hr_sidebar_nav,
  getSidebarFooterForRole,
} from "@/shared/components/layouts/role-sidebar-nav";

const HrOverviewPage = lazy(() => import("@/hr/pages/hr-overview.page"));
const HrMoodPage = lazy(() => import("@/hr/pages/hr-mood.page"));
const HrTeamAnalysisPage = lazy(
  () => import("@/hr/pages/hr-team-analysis.page"),
);
const HrFlightRisksPage = lazy(
  () => import("@/hr/pages/hr-flight-risks.page"),
);
const EmployeeDetailPage = lazy(
  () => import("@/hr/pages/employee-detail.page"),
);
const TeamDetailPage = lazy(() => import("@/hr/pages/team-detail.page"));
const HrViewTeamMember = lazy(() => import("@/hr/pages/view-team-member.page"));
const Teams = lazy(() => import("@/hr/pages/teams.page"));
const TaskDetailPage = lazy(() => import("@/shared/pages/task-detail.page"));

export const hr_routes: RouteObject[] = [
  {
    element: <TeamMemberScreenLayout />,
    handle: {
      sidebarNav: hr_sidebar_nav,
      sidebarFooter: getSidebarFooterForRole("hr"),
    },
    children: [
      {
        element: <HrScheduleMeetingProvider />,
        children: [
          {
            index: true,
            element: <HrOverviewPage />,
          },
          {
            path: "mood",
            element: <HrMoodPage />,
          },
          {
            path: "team-analysis",
            element: <HrTeamAnalysisPage />,
          },
          {
            path: "flight-risks",
            element: <HrFlightRisksPage />,
          },
          {
            path: "employee/:id",
            element: <EmployeeDetailPage />,
          },
          {
            path: "teams/:id",
            element: <TeamDetailPage />,
          },
          {
            path: "teams/:id/:memberId",
            element: <HrViewTeamMember />,
          },
          {
            path: "teams",
            element: <Teams />,
          },
          {
            path: "tasks/:id",
            element: <TaskDetailPage />,
          },
        ],
      },
    ],
  },
];

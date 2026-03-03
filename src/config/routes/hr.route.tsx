import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import TeamMemberScreenLayout from "@/shared/components/layouts/team-member-screen-layout.component";
import ScheduleMeetingButton from "@/team-leader/components/schedule-meeting-button.component";
import ViewTeamsButton from "@/hr/components/view-teams-btn.component";

const HrPage = lazy(() => import("@/hr/pages/hr.page"));
const EmployeeDetailPage = lazy(
  () => import("@/hr/pages/employee-detail.page"),
);
const TeamDetailPage = lazy(() => import("@/hr/pages/team-detail.page"));
const HrViewTeamMember = lazy(() => import("@/hr/pages/view-team-member.page"));
const Teams = lazy(() => import("@/hr/pages/teams.page"));
export const hr_routes: RouteObject[] = [
  {
    element: <TeamMemberScreenLayout />,
    handle: {
      headerChild: (
        <>
          <ViewTeamsButton />
          <ScheduleMeetingButton />
        </>
      ),
    },
    children: [
      {
        index: true,
        element: <HrPage />,
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
    ],
  },
];

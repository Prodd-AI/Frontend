import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import TeamMemberScreenLayout from "@/shared/components/layouts/team-member-screen-layout.component";
import AssignTask from "@/team-leader/components/assign-task.component";
import ScheduleMeetingButton from "@/team-leader/components/schedule-meeting-button.component";
import MyTeamButton from "@/team-leader/components/my-team-button.component";

const TeamLeaderPage = lazy(
  () => import("@/team-leader/pages/team-leader.page")
);
const ViewTeamMembers = lazy(
  () => import("@/team-leader/pages/view-team-members.page")
);

const ViewTeamMember = lazy(
  () => import("@/team-leader/pages/view-team-member.page")
);

export const team_leader_routes: RouteObject[] = [
  {
    element: <TeamMemberScreenLayout />,
    handle: {
      headerChild: (
        <>
          <AssignTask />
          <ScheduleMeetingButton />
          <MyTeamButton />
        </>
      ),
    },
    children: [
      {
        index: true,
        element: <TeamLeaderPage />,
      },
      {
        path: "view-team",
        element: <ViewTeamMembers />,
      },
      {
        path: "view-team/:id",
        element: <ViewTeamMember />,
      },
    ],
  },
];

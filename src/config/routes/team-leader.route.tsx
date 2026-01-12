import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import TeamMemberScreenLayout from "@/shared/components/layouts/team-member-screen-layout.component";
import AssignTask from "@/team-leader/components/assign-task.component";
import ScheduleMeetingButton from "@/team-leader/components/schedule-meeting-button.component";
import MyTeamButton from "@/team-leader/components/my-team-button.component";

const TeamLeaderPage = lazy(
  () => import("@/team-leader/pages/team-leader.page")
);

export const team_leader_routes: RouteObject[] = [
  {
    element: <TeamMemberScreenLayout />,
    children: [
      {
        index: true,
        element: <TeamLeaderPage />,
        handle: {
          headerChild: (
            <>
              <AssignTask />
              <ScheduleMeetingButton />
              <MyTeamButton />
            </>
          ),
        },
      },
    ],
  },
];

import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import TeamMemberScreenLayout from "@/shared/components/layouts/team-member-screen-layout.component";

const TeamMemberPage = lazy(
  () => import("@/team-member/pages/team-member.page")
);

export const team_member_routes: RouteObject[] = [
  {
    element: <TeamMemberScreenLayout />,
    children: [
      {
        index: true,
        element: <TeamMemberPage />,
      },
    ],
  },
];

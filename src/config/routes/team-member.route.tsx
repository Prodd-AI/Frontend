import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import DashboardLayout from "@/layout/dashboard.layout";

const TeamMemberPage = lazy(
  () => import("@/team-member/pages/team-member.page")
);

export const team_member_routes: RouteObject[] = [
  {
    index: true,
    element: (
      <DashboardLayout>
        <TeamMemberPage />
      </DashboardLayout>
    ),
  },
];

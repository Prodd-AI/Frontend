import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import DashboardLayout from "@/layout/dashboard.layout";

const TeamLeaderPage = lazy(
  () => import("@/team-leader/pages/team-leader.page")
);

export const team_leader_routes: RouteObject[] = [
  {
    index: true,
    element: (
      <DashboardLayout>
        <TeamLeaderPage />
      </DashboardLayout>
    ),
  },
];

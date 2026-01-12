import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const TeamLeaderPage = lazy(
  () => import("@/team-leader/pages/team-leader.page")
);

export const team_leader_routes: RouteObject[] = [
  {
    index: true,
    element: <TeamLeaderPage />,
  },
];

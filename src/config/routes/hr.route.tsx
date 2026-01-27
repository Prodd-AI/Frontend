import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import TeamMemberScreenLayout from "@/shared/components/layouts/team-member-screen-layout.component";

const HrPage = lazy(() => import("@/hr/pages/hr.page"));

export const hr_routes: RouteObject[] = [
  {

    element: <TeamMemberScreenLayout />,
    children: [
      {
        index: true,
        element: <HrPage />,
      },
    ],
  },
];

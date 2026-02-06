import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import TeamMemberScreenLayout from "@/shared/components/layouts/team-member-screen-layout.component";

const HrPage = lazy(() => import("@/hr/pages/hr.page"));
const EmployeeDetailPage = lazy(
  () => import("@/hr/pages/employee-detail.page"),
);
const TeamDetailPage = lazy(() => import("@/hr/pages/team-detail.page"));

export const hr_routes: RouteObject[] = [
  {
    element: <TeamMemberScreenLayout />,
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
        path: "team/:id",
        element: <TeamDetailPage />,
      },
    ],
  },
];

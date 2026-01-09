import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import DashboardLayout from "@/layout/dashboard.layout";

const HrPage = lazy(() => import("@/hr/pages/hr.page"));

export const hr_routes: RouteObject[] = [
  {
    index: true,
    element: (
      <DashboardLayout>
        <HrPage />
      </DashboardLayout>
    ),
  },
];

import { lazy } from "react";
import type { RouteObject } from "react-router-dom";


const SelectRole = lazy(() => import("@/onboarding/pages/select-role.page"));

const HrSetup = lazy(() => import("@/onboarding/pages/hr/setup.hr.page"))

export const onboarding_routes: RouteObject[] = [
  {
    path: "select-role",
    element: <SelectRole />,
  },
  {
    path : "hr-setup",
    element : <HrSetup />
  }
];

import TeamLeadSetup from "@/onboarding/pages/team-lead/setup.team-lead.page";
import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import withAuthGuard from "@/shared/components/HOC/with-auth-guard";

// const SelectRole = lazy(() => import("@/onboarding/pages/select-role.page"));

const HrSetup = lazy(() => import("@/onboarding/pages/hr/setup.hr.page"));

// const GuardedSelectRole = withAuthGuard(SelectRole);
const GuardedHrSetup = withAuthGuard(HrSetup);
const GuardedTeamLeadSetup = withAuthGuard(TeamLeadSetup);

export const onboarding_routes: RouteObject[] = [
  // {
  //   path: "select-role",
  //   element: <GuardedSelectRole />,
  // },
  {
    path: "hr-setup",
    element: <GuardedHrSetup />,
  },
  {
    path: "team-lead-setup",
    element: <GuardedTeamLeadSetup />,
  },
];

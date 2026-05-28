import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import TeamMemberScreenLayout from "@/shared/components/layouts/team-member-screen-layout.component";

const SettingsPage = lazy(() => import("@/settings/pages"));

export const settings_routes: RouteObject[] = [
  {
    element: <TeamMemberScreenLayout />,
    children: [
      {
        index: true,
        element: <SettingsPage />,
      },
    ],
  },
];

import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const SettingsPage = lazy(() => import("@/settings/pages"));

export const settings_routes: RouteObject[] = [
  {
    index: true,
    element: <SettingsPage />,
  },
];

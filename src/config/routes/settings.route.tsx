import withAuthGuard from "@/shared/components/HOC/with-auth-guard";
import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const SettingsPage = lazy(() => import("@/settings/pages"));

const SettingsPageWithAuthGuard = withAuthGuard(SettingsPage);
export const settings_routes: RouteObject[] = [
  {
    index: true,
    element: <SettingsPageWithAuthGuard />,
  },
];

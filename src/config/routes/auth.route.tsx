import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const AuthPage = lazy(() => import("@/shared/pages/auth/auth.page"));

export const auth_routes: RouteObject[] = [
  {
    index: true,
    element: <AuthPage />,
  },
];

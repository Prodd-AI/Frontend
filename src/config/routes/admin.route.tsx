import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const AdminPage = lazy(() => import("@/super-admin/pages/admin.page"));

export const admin_routes: RouteObject[] = [
  {
    index: true,
    element: <AdminPage />,
  },
];

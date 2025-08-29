import { Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { hr_routes } from "@/config/routes/hr.route";
import { team_member_routes } from "@/config/routes/team-member.route";
import { team_leader_routes } from "@/config/routes/team-leader.route";
import { admin_routes } from "@/config/routes/admin.route";
import { auth_routes } from "@/config/routes/auth.route";
import { onboarding_routes } from "@/config/routes/onboarding.route";
import NotFoundPage from "@/shared/pages/not-found.page";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/auth" replace /> },
  { path: "/hr", children: hr_routes },
  { path: "/team-member", children: team_member_routes },
  { path: "/team-leader", children: team_leader_routes },
  { path: "/admin", children: admin_routes },
  { path: "/auth", children: auth_routes },
  { path: "/onboarding", children: onboarding_routes },
  { path: "*", element: <NotFoundPage /> },
]);

export function AppRouter() {
  return (
    <Suspense fallback={null}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

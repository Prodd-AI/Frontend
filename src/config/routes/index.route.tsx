import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { hr_routes } from "@/config/routes/hr.route";
import { team_member_routes } from "@/config/routes/team-member.route";
import { team_leader_routes } from "@/config/routes/team-leader.route";
import { admin_routes } from "@/config/routes/admin.route";
import { auth_routes } from "@/config/routes/auth.route";
import { onboarding_routes } from "@/config/routes/onboarding.route";
import NotFoundPage from "@/shared/pages/not-found.page";
import { settings_routes } from "./settings.route";
import TeamMemberEntryDash from "@/shared/components/main/teamMemberDashEntry.component";
import Loader from "@/shared/components/loader.component";
import withAuthGuard from "@/shared/components/HOC/with-auth-guard";

const WelcomePage = lazy(() => import("@/onboarding/pages/welcome.page"));

const GuardedTeamMemberEntryDash = withAuthGuard(TeamMemberEntryDash);

const router = createBrowserRouter([
  {
    path: "/",
    element: <GuardedTeamMemberEntryDash />,
  },
  {
    path: "/welcome",
    element: <WelcomePage />,
  },
  { path: "/dash/hr", children: hr_routes },
  { path: "/dash/team-member", children: team_member_routes },
  { path: "/dash/team-lead", children: team_leader_routes },
  { path: "/dash/admin", children: admin_routes },
  { path: "/auth", children: auth_routes },
  { path: "/onboarding", children: onboarding_routes },
  { path: "/settings", children: settings_routes },
  { path: "*", element: <NotFoundPage /> },
]);

export function AppRouter() {
  return (
    <Suspense
      fallback={
        <div className="h-svh flex justify-center items-center">
          <Loader />
        </div>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  );
}

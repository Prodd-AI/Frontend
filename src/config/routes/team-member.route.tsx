import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import TeamMemberScreenLayout from "@/shared/components/layouts/team-member-screen-layout.component";
import { team_member_sidebar_nav } from "@/shared/components/layouts/role-sidebar-nav";

const TeamMemberPage = lazy(
  () => import("@/team-member/pages/team-member.page"),
);
const TodaysFocusPage = lazy(
  () => import("@/team-member/pages/todays-focus.page"),
);
const TasksPage = lazy(() => import("@/team-member/pages/tasks.page"));
const TimesheetPage = lazy(
  () => import("@/team-member/pages/timesheet.page"),
);
const RecentMoodsPage = lazy(
  () => import("@/team-member/pages/recent-moods.page"),
);
const TaskDetailPage = lazy(() => import("@/shared/pages/task-detail.page"));

export const team_member_routes: RouteObject[] = [
  {
    element: <TeamMemberScreenLayout />,
    handle: {
      sidebarNav: team_member_sidebar_nav,
    },
    children: [
      {
        index: true,
        element: <TeamMemberPage />,
      },
      {
        path: "todays-focus",
        element: <TodaysFocusPage />,
      },
      {
        path: "tasks",
        element: <TasksPage />,
      },
      {
        path: "tasks/:id",
        element: <TaskDetailPage />,
      },
      {
        path: "timesheet",
        element: <TimesheetPage />,
      },
      {
        path: "recent-moods",
        element: <RecentMoodsPage />,
      },
    ],
  },
];

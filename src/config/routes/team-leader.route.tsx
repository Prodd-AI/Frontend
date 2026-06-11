import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import TeamMemberScreenLayout from "@/shared/components/layouts/team-member-screen-layout.component";
import AssignTask from "@/team-leader/components/assign-task.component";
import ScheduleMeetingButton from "@/team-leader/components/schedule-meeting-button.component";
import {
  team_leader_sidebar_nav,
  getSidebarFooterForRole,
} from "@/shared/components/layouts/role-sidebar-nav";

const TeamLeaderPage  = lazy(
  () => import("@/team-leader/pages/team-leader.page"),
);
const TodaysFocusPage = lazy(
  () => import("@/team-leader/pages/todays-focus.page"),
);
const TasksPage = lazy(() => import("@/team-leader/pages/tasks.page"));
const TimesheetPage = lazy(
  () => import("@/team-leader/pages/timesheet.page"),
);
const RecentMoodsPage = lazy(
  () => import("@/team-leader/pages/recent-moods.page"),
);
const ViewTeamMembers = lazy(
  () => import("@/team-leader/pages/view-team-members.page"),
);
const ViewTeamMember = lazy(
  () => import("@/team-leader/pages/view-team-member.page"),
);
const TaskDetailPage = lazy(() => import("@/shared/pages/task-detail.page"));

const team_leader_header_actions = (
  <>
    <ScheduleMeetingButton />
    <AssignTask />
  </>
);

export const team_leader_routes: RouteObject[] = [
  {
    element: <TeamMemberScreenLayout />,
    handle: {
      sidebarNav: team_leader_sidebar_nav,
      headerActions: team_leader_header_actions,
      sidebarFooter: getSidebarFooterForRole("team_lead"),
    },
    children: [
      {
        index: true,
        element: <TeamLeaderPage />,
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
      {
        path: "view-team",
        element: <ViewTeamMembers />,
      },
      {
        path: "view-team/:id",
        element: <ViewTeamMember />,
      },
    ],
  },
];

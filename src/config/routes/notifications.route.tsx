import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import TeamMemberScreenLayout from "@/shared/components/layouts/team-member-screen-layout.component";
import AssignTask from "@/team-leader/components/assign-task.component";
import ScheduleMeetingButton from "@/team-leader/components/schedule-meeting-button.component";

const NotificationsPage = lazy(
  () => import("@/shared/pages/notifications.page"),
);

export const notifications_routes: RouteObject[] = [
  {
    element: <TeamMemberScreenLayout />,
    handle: {
      headerChild: (
        <>
          <AssignTask />
          <ScheduleMeetingButton />
        </>
      ),
    },
    children: [
      {
        index: true,
        element: <NotificationsPage />,
      },
    ],
  },
];

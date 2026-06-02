import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import TeamMemberScreenLayout from "@/shared/components/layouts/team-member-screen-layout.component";

const MeetingsPage = lazy(() => import("@/meetings/pages/meetings.page"));
const MeetingDetailPage = lazy(() => import("@/meetings/pages/meeting-detail.page"));
const AITaskReviewPage = lazy(() => import("@/meetings/pages/ai-task-review.page"));

export const meetings_routes: RouteObject[] = [
  {
    element: <TeamMemberScreenLayout />,
    children: [
      {
        index: true,
        element: <MeetingsPage />,
      },
      {
        path: "ai-tasks",
        element: <AITaskReviewPage />,
      },
      {
        path: ":id",
        element: <MeetingDetailPage />,
      },
    ],
  },
];

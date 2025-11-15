import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const TeamLeaderPage = lazy(
  () => import("@/team-leader/pages/team-leader.page")
);

// const SandboxComponent = () => {
//   return (
//     <div className="min-h-screen w-full bg-[#F8F8F9] p-8">
    
//     </div>
//   );
// };

export const team_leader_routes: RouteObject[] = [
  {
    index: true,
    element: <TeamLeaderPage />,
  },
  // {
  //   path: "sandbox",
  //   element: <SandboxComponent />,
  // },
];

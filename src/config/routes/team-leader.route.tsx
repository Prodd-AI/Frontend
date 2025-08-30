import WeeklyStreakComponent, { type WeeklyStreakRef } from "@/shared/components/weekly-streak.component";
import { lazy, useRef } from "react";
import type { RouteObject } from "react-router-dom";

const TeamLeaderPage = lazy(
  () => import("@/team-leader/pages/team-leader.page")
);

const SandboxComponent = () => {
  const weeklyStreakRef = useRef<WeeklyStreakRef>(null);

  const handleDayToggle = (day: number, newStatus: "completed" | "pending") => {
    console.log("Day toggle:", { day, newStatus });
    // Simulate API call delay
    setTimeout(() => {
      console.log("Day toggle completed");
    }, 1000);
  };



  return (
    <div className="min-h-screen w-full bg-[#F8F8F9] p-8">
      <div className="space-y-4">
        <WeeklyStreakComponent
          ref={weeklyStreakRef}
          numberOfTaskCompleted={14}
          numberOfTaskCompletedForTheDay={6}
          totalNumberOfTaskForTheDay={7}
          onDayToggle={handleDayToggle}
          customMessage="Great work this week! 🚀"
        />
        
      </div>
    </div>
  );
};

export const team_leader_routes: RouteObject[] = [
  {
    index: true,
    element: <TeamLeaderPage />,
  },
  {
    path: "sandbox",
    element: <SandboxComponent />,
  },
];

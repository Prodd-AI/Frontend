import { Button } from "@/components/ui/button";
import { useState } from "react";
import useUrlSearchParams from "@/shared/hooks/use-url-search-params";
import WelcomeBackHeader from "@/shared/components/welcome-back-header.component";
import NudgeBanner from "@/shared/components/nudge-banner.component";
import TeamDashboardSection from "../components/team-dashboard-section.component";
import TeamTabsSection from "../components/team-tabs-section.component";
import PersonalTabsSection from "../components/personal-tabs-section.component";
import PersonalDashboardSection from "../components/personal-dashboard-section.component";
import { useQueries,} from "@tanstack/react-query";
import { getWeeklyStreak } from "@/config/services/tasks.service";
import { get_average_mood_for_the_week } from "@/config/services/mood-trends.service";

function TeamLeaderPage() {
  const [openNudgeBanner, setOpenNudgeBanner] = useState(true);
  const { getParam, updateParam, setParams } = useUrlSearchParams();

  const [weekTasksQuery, averageMoodQuery] = useQueries({
    queries: [
      {
        queryKey: ["streaks"],
        queryFn: () =>
          getWeeklyStreak({
            duration: "week",
            status: "all",
          }),
      },
      {
        queryKey: ["average-mood-week"],
        queryFn: () =>
          get_average_mood_for_the_week({
            period: "week",
          }),
      },
    ],
  });


  const currentView = getParam("view") || "team";
  const isPersonalView = currentView === "personal";
  const personalTab = getParam("personalTab") || "todays_focus";
  const teamTab = getParam("teamTab") || "team_task";

  const handleViewTeamDashboard = () => {
    setParams({ view: "team", teamTab: "team_task" });
  };

  const handleViewPersonalDashboard = () => {
    setParams({ view: "personal", personalTab: "todays_focus" });
  };

  return (
    <div className="p-2 sm:p-4 sm:pb-20">
      <WelcomeBackHeader
        heading={
          isPersonalView
            ? "Glad to have you back! 🤗"
            : "Team Dashboard and Insight"
        }
        subHeading={
          isPersonalView
            ? "Here's your team's pulse and tasks at a glance — lead with clarity, collaborate with ease"
            : "Manage your team's tasks and wellbeing"
        }
        badge
        className="mt-4 sm:mt-0"
      />

      <NudgeBanner
        className="mt-[25px] sm:mt-[1.7rem]"
        heading="Feeling overwhelmed? Try the 4-7-8 breathing technique. 🧘‍♀️"
        subHeading="❤️‍🔥 Wellness tip of the moment"
        open={openNudgeBanner}
        onDismiss={() => setOpenNudgeBanner(false)}
        isDismissable
        autoShowIntervalMs={3 * 60 * 60 * 1000}
        setOpen={setOpenNudgeBanner}
        child={
          <Button
            variant="outline"
            className="mt-2.5 sm:mt-0 text-[12px] font-bold rounded-[100px] sm:rounded-md"
          >
            Take a 5 minutes break
          </Button>
        }
      />

      {isPersonalView ? (
        <PersonalDashboardSection
          weekTasksQuery={weekTasksQuery}
          averageMoodQuery={averageMoodQuery}
        />
      ) : (
        <TeamDashboardSection />
      )}

      {isPersonalView ? (
        <PersonalTabsSection
          activeTab={personalTab}
          onTabChange={(tab) => updateParam("personalTab", tab)}
          onViewTeamDashboard={handleViewTeamDashboard}
          averageMoodQuery={averageMoodQuery}
          weekTasksQuery={weekTasksQuery}
        />
      ) : (
        <TeamTabsSection
          activeTab={teamTab}
          onTabChange={(tab) => updateParam("teamTab", tab)}
          onViewPersonalDashboard={handleViewPersonalDashboard}
        />
      )}
    </div>
  );
}

export default TeamLeaderPage;



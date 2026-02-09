import { Button } from "@/components/ui/button";
import { useState } from "react";
import WelcomeBackHeader from "@/shared/components/welcome-back-header.component";
import NudgeBanner from "@/shared/components/nudge-banner.component";
import PersonalDashboardSection from "@/team-leader/components/personal-dashboard-section.component";
import PersonalTabsSection from "@/team-leader/components/personal-tabs-section.component";
import useUrlSearchParams from "@/shared/hooks/use-url-search-params";
import { useQueries } from "@tanstack/react-query";
import { getWeeklyStreak } from "@/config/services/tasks.service";
import { get_average_mood_for_the_week } from "@/config/services/mood-trends.service";

function Page() {
  const [openNudgeBanner, setOpenNudgeBanner] = useState(true);
  const { getParam, updateParam, setParams } = useUrlSearchParams();
  const tab = getParam("tab") || "todays_focus";
  const handleTabChange = (tab: string) => {
    updateParam("tab", tab);
    setParams({ tab });
  };

  const [weekTasksQuery, averageMoodQuery] = useQueries({
    queries: [
      {
        queryKey: ["streaks"],
        queryFn: () =>
          getWeeklyStreak({
            duration: "week",
            status: "completed",
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

  return (
    <div className="py-2 sm:py-4 sm:pb-20">
      <WelcomeBackHeader
        heading={"Welcome back, Saviour! 👋"}
        subHeading={
          "How are you feeling today? Let's make it productive and positive."
        }
        className="mt-4 sm:mt-0"
      />

      <NudgeBanner
        className="mt-[25px] sm:mt-[1.7rem]"
        heading="Feeling overwhelmed? Try the 4-7-8 breathing technique. 🧘‍♀️"
        subHeading="❤️‍🔥 Wellness tip of the moment"
        open={openNudgeBanner}
        onDismiss={() => setOpenNudgeBanner(false)}
        isDismissable
        child={
          <Button
            variant="outline"
            className="mt-2.5 sm:mt-0 text-[12px] font-bold rounded-[100px] sm:rounded-md"
          >
            Take a 5 minutes break
          </Button>
        }
      />

      <PersonalDashboardSection
        weekTasksQuery={weekTasksQuery}
        averageMoodQuery={averageMoodQuery}
      />

      <PersonalTabsSection
        activeTab={tab}
        showAssignButton={false}
        onTabChange={handleTabChange}
        weekTasksQuery={weekTasksQuery}
        averageMoodQuery={averageMoodQuery}
      />
    </div>
  );
}

const TeamMemberPage = () => <Page />;

export default TeamMemberPage;

import PageHeader from "@/shared/components/page-header.component";
import PersonalDashboardSection from "../components/personal-dashboard-section.component";
import { useQueries } from "@tanstack/react-query";
import { getWeeklyStreak } from "@/config/services/tasks.service";
import { get_average_mood_for_the_week } from "@/config/services/mood-trends.service";
import {
  TakeTourButton,
  useGuidedTour,
} from "@/shared/components/guided-tour";
import { teamLeaderTourSteps } from "../team-leader.tour-steps";

function TeamLeaderPage() {
  const { startTour } = useGuidedTour("team-lead", teamLeaderTourSteps);

  const [weekTasksQuery, averageMoodQuery] = useQueries({
    queries: [
      {
        queryKey: ["streaks", { duration: "week", status: "all" }],
        queryFn: () =>
          getWeeklyStreak({ duration: "week", status: "all" }),
      },
      {
        queryKey: ["average-mood-week"],
        queryFn: () =>
          get_average_mood_for_the_week({ period: "week" }),
      },
    ],
  });

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        dataTour="page-header"
        title="Glad to have you back! 🤗"
        subtitle="Here's your team's pulse and tasks at a glance"
        actions={<TakeTourButton onStart={startTour} />}
      />

      {/* NudgeBanner removed — content was a hardcoded wellness tip
          ("4-7-8 breathing technique") with no backing recommendations
          endpoint in the docs. */}

      <PersonalDashboardSection
        weekTasksQuery={weekTasksQuery}
        averageMoodQuery={averageMoodQuery}
      />
    </div>
  );
}

export default TeamLeaderPage;

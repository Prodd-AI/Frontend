import PageHeader from "@/shared/components/page-header.component";
import PersonalDashboardSection from "@/team-leader/components/personal-dashboard-section.component";
import { useQueries } from "@tanstack/react-query";
import { getWeeklyStreak } from "@/config/services/tasks.service";
import { get_average_mood_for_the_week } from "@/config/services/mood-trends.service";
import useAuthStore from "@/config/stores/auth.store";
import {
  TakeTourButton,
  useGuidedTour,
} from "@/shared/components/guided-tour";
import OverviewAlertsBanner from "@/shared/components/overview-alerts-banner.component";
import { teamMemberTourSteps } from "../team-member.tour-steps";

function Page() {
  const user = useAuthStore((state) => state.user);
  const { startTour } = useGuidedTour("team-member", teamMemberTourSteps);

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
      <OverviewAlertsBanner tasksRoute="/dash/team-member/tasks" />
      <PageHeader
        dataTour="page-header"
        title={`Welcome back, ${user?.user.first_name ?? ""}`}
        subtitle="How are you feeling today? Let's make it productive and positive."
        actions={<TakeTourButton onStart={startTour} />}
      />

      {/* NudgeBanner removed — content was a hardcoded wellness tip with no
          backing recommendations endpoint in the docs. */}

      <PersonalDashboardSection
        weekTasksQuery={weekTasksQuery}
        averageMoodQuery={averageMoodQuery}
      />
    </div>
  );
}

const TeamMemberPage = () => <Page />;

export default TeamMemberPage;

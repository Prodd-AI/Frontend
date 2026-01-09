import { Button } from "@/components/ui/button";
import { useState } from "react";
import withTeamMemberScaffold from "@/shared/components/HOC/team-member-screen-scaffold-hoc";
import WelcomeBackHeader from "@/shared/components/welcome-back-header.component";
import NudgeBanner from "@/shared/components/nudge-banner.component";
import PersonalDashboardSection from "@/team-leader/components/personal-dashboard-section.component";
import PersonalTabsSection from "@/team-leader/components/personal-tabs-section.component";
import useUrlSearchParams from "@/shared/hooks/use-url-search-params";
import MeetingCardComponent from "@/shared/components/meeting-card.component";
import { sample_meetings } from "@/shared/utils/meeting.constants";

function Page() {
  const [openNudgeBanner, setOpenNudgeBanner] = useState(true);
  const { getParam, updateParam, setParams } = useUrlSearchParams();
  const tab = getParam("tab") || "todays_focus";
  const handleTabChange = (tab: string) => {
    updateParam("tab", tab);
    setParams({ tab });
  };

  return (
    <div className="p-2 sm:p-4 sm:pb-20">
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

      <PersonalDashboardSection />

      <MeetingCardComponent
        meeting={sample_meetings[0]}
        actions={{
          on_join: () => {},
          on_open_more: () => {},
        }}
        className="mt-[25px] sm:mt-[1.7rem]"
      />

      <PersonalTabsSection
        activeTab={tab}
        hasViewTeamDashboard={false}
        showAssignButton={false}
        onTabChange={handleTabChange}
      />
    </div>
  );
}

const WrappedHrPage = withTeamMemberScaffold(Page);

const TeamLeadPage = () => <WrappedHrPage HeaderChild={null} />;

export default TeamLeadPage;

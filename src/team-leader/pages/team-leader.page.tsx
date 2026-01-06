import { Button } from "@/components/ui/button";
import { useState } from "react";
import withTeamMemberScaffold from "@/shared/components/HOC/team-member-screen-scaffold-hoc";
import useUrlSearchParams from "@/shared/hooks/use-url-search-params";
import WelcomeBackHeader from "@/shared/components/welcome-back-header.component";
import NudgeBanner from "@/shared/components/nudge-banner.component";
import AssignTask from "../components/assign-task.component";
import ScheduleMeetingButton from "../components/schedule-meeting-button.component";
import MyTeamButton from "../components/my-team-button.component";
import PersonalDashboardSection from "../components/personal-dashboard-section.component";
import TeamDashboardSection from "../components/team-dashboard-section.component";
import PersonalTabsSection from "../components/personal-tabs-section.component";
import TeamTabsSection from "../components/team-tabs-section.component";

function Page() {
  const [openNudgeBanner, setOpenNudgeBanner] = useState(true);
  const { getParam, updateParam, setParams } = useUrlSearchParams();
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
        child={
          <Button
            variant="outline"
            className="mt-2.5 sm:mt-0 text-[12px] font-bold rounded-[100px] sm:rounded-md"
          >
            Take a 5 minutes break
          </Button>
        }
      />

      {isPersonalView ? <PersonalDashboardSection /> : <TeamDashboardSection />}

      {isPersonalView ? (
        <PersonalTabsSection
          activeTab={personalTab}
          onTabChange={(tab) => updateParam("personalTab", tab)}
          onViewTeamDashboard={handleViewTeamDashboard}
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

const WrappedHrPage = withTeamMemberScaffold(Page);

const TeamLeadPage = () => (
  <WrappedHrPage
    HeaderChild={
      <>
        <AssignTask />
        <ScheduleMeetingButton />
        <MyTeamButton />
      </>
    }
  />
);

export default TeamLeadPage;

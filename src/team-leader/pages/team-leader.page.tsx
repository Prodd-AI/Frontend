import { Button } from "@/components/ui/button";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { RxPerson } from "react-icons/rx";
import withTeamMemberScaffold from "@/shared/components/HOC/team-member-screen-scaffold-hoc";
import AssignTask from "../components/assign-task.component";
import WelcomeBackHeader from "@/shared/components/welcome-back-header.component";
import NudgeBanner from "@/shared/components/nudge-banner.component";
import { useState } from "react";
function Page() {
  const [openNudgeBanner, setOpenNudgeBanner] = useState(true);
  return (
    <div className="p-2 sm:p-4">
      <WelcomeBackHeader
        heading="Glad to have you back! 🤗"
        subHeading="Here’s your team’s pulse and tasks at a glance — lead with clarity, collaborate with ease"
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
    </div>
  );
}
const WrappedHrPage = withTeamMemberScaffold(Page);

const ScheduleMeeting = () => {
  return (
    <Button variant="outline">
      <RiCalendarScheduleLine />
      Schedule Meeting
    </Button>
  );
};
const MyTeam = () => {
  return (
    <Button variant="outline">
      {" "}
      <RxPerson />
      My Team
    </Button>
  );
};

const TeamLeadPage = () => (
  <WrappedHrPage
    HeaderChild={
      <>
        <AssignTask />
        <ScheduleMeeting />
        <MyTeam />
      </>
    }
  />
);
export default TeamLeadPage;

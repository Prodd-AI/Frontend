import { Button } from "@/components/ui/button";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { RxPerson } from "react-icons/rx";
import withTeamMemberScaffold from "@/shared/components/HOC/team-member-screen-scaffold-hoc";
import AssignTask from "../components/assign-task.component";
import WelcomeBackHeader from "@/shared/components/welcome-back-header.component";
import NudgeBanner from "@/shared/components/nudge-banner.component";
import { useState } from "react";
import DailyMoodCheckIn from "@/shared/components/daily-mood-check-in.component";
import WeeklyStreakComponent from "@/shared/components/weekly-streak.component";
import TodaysProgress from "@/shared/components/todays-progress.component";
import TabComponent from "@/shared/components/tab.component";
import { MdOutlineCenterFocusStrong } from "react-icons/md";
import { IoCheckmarkOutline } from "react-icons/io5";
import { LuClock2 } from "react-icons/lu";
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
      <section className=" grid grid-cols-2 mt-9 gap-4">
        <DailyMoodCheckIn onSubmit={() => null} className="w-full h-full" />
        <div className=" flex flex-col gap-3.5">
          <WeeklyStreakComponent
            className="w-full"
            numberOfTaskCompleted={2}
            totalNumberOfTaskForTheDay={2}
            numberOfTaskCompletedForTheDay={2}
            days={[
              {
                day: 1,
                status: "completed",
                tasksCompleted: 2,
                totalTasks: 2,
              },
              {
                day: 2,
                status: "completed",
                tasksCompleted: 2,
                totalTasks: 2,
              },
              {
                day: 3,
                status: "completed",
                tasksCompleted: 2,
                totalTasks: 2,
              },
              {
                day: 4,
                status: "completed",
                tasksCompleted: 2,
                totalTasks: 2,
              },
              {
                day: 5,
                status: "completed",
                tasksCompleted: 2,
                totalTasks: 2,
              },
              {
                day: 6,
                status: "completed",
                tasksCompleted: 2,
                totalTasks: 2,
              },
              {
                day: 7,
                status: "completed",
                tasksCompleted: 2,
                totalTasks: 2,
              },
            ]}
          />
          <TodaysProgress
            title="Today's Progress"
            numberOfTaskCompleted={2}
            totalNumberOfTask={4}
            avgMood={3}
            className="w-full"
          />
        </div>
      </section>
      <TabComponent
        className=" mt-[48px]"
        items={[
          {
            label: "Today’s Focus",
            value: "todays_focus",
            icon: <MdOutlineCenterFocusStrong />,
            content: <div>Tasks content goes here</div>,
          },
          {
            label: "Tasks",
            value: "tasks",
            icon: <IoCheckmarkOutline />,
            content: <div>Mood content goes here</div>,
          },
          {
            label: "Recent Moods",
            value: "recent_moods",
            icon: <LuClock2 />,
            content: <div>Streak content goes here</div>,
          },
        ]}
        activeTab="tasks"
        onTabChange={(tab) => console.log(tab)}
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

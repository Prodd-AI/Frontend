import { Button } from "@/components/ui/button";
import TabComponent from "@/shared/components/tab.component";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { IoCheckmarkOutline } from "react-icons/io5";
import { LuClock2 } from "react-icons/lu";
import { BsCameraReels } from "react-icons/bs";
import { MdOutlineReviews } from "react-icons/md";
import TasksTabContent from "./tasks-tab-content.component";
import TeamMoodTabContent from "./team-mood-tab-content.component";
import MeetingsTabContent from "./meetings-tab-content.component";
import ReviewsTabContent from "./reviews-tab-content.component";
import {
  teamTasksData,
  upcomingMeetingsData,
  progressReviewsData,
} from "@/team-leader/mock-data/index.mock";
import { TeamTabsSectionProps } from "@/team-leader/typings/team-leader";
import { useEffect, useState } from "react";

const TeamTabsSection = ({
  activeTab,
  onTabChange,
  onViewPersonalDashboard,
  hasViewPersonalDashboard = true,
}: TeamTabsSectionProps) => {
  const [currentTab, setCurrentTab] = useState<string>(activeTab);
  const handleTabChange = (tab: string) => {
    onTabChange ? onTabChange(tab) : setCurrentTab(tab);
  };

  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);

  return (
    <TabComponent
      className="mt-[38px]"
      items={[
        {
          label: "Team Tasks",
          value: "team_task",
          icon: <IoCheckmarkOutline />,
          content: <TasksTabContent tasks={teamTasksData} showHeader={false} />,
        },
        {
          label: "Team Mood",
          value: "team_mood",
          icon: <LuClock2 />,
          content: <TeamMoodTabContent />,
        },
        {
          label: "Meetings",
          value: "meeting",
          icon: <BsCameraReels />,
          content: <MeetingsTabContent meetings={upcomingMeetingsData} />,
        },
        {
          label: "Reviews",
          value: "reviews",
          icon: <MdOutlineReviews />,
          content: <ReviewsTabContent reviews={progressReviewsData} />,
        },
      ]}
      activeTab={currentTab}
      onTabChange={(tab) => handleTabChange(tab)}
      ToggleViewComponent={
        hasViewPersonalDashboard
          ? () => (
              <Button
                className="bg-[#E5E5E5] text-[#494451] font-semibold"
                variant="ghost"
                onClick={onViewPersonalDashboard}
              >
                View Personal Dashboard <MdOutlineRemoveRedEye />
              </Button>
            )
          : undefined
      }
    />
  );
};

export default TeamTabsSection;

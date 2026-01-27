import { Button } from "@/components/ui/button";
import TabComponent from "@/shared/components/tab.component";
import {
  MdOutlineCenterFocusStrong,
  MdOutlineRemoveRedEye,
} from "react-icons/md";
import { IoCheckmarkOutline } from "react-icons/io5";
import { LuClock2 } from "react-icons/lu";
import TodaysFocusExample from "@/shared/components/todays-focus.example";
import TasksTabContent from "./tasks-tab-content.component";
import { personalTasksData } from "@/team-leader/mock-data/index.mock";
import { PersonalTabsSectionProps } from "@/team-leader/typings/team-leader";
import { useEffect, useState } from "react";
import AssignTask from "./assign-task.component";
import MoodTrends from "@/shared/components/mood-trend.component";
import { MoodType } from "@/shared/typings/mood-trend";

const MoodEntryMapper: Record<number, MoodType> = {
  1: "rough",
  2: "notGreat",
  3: "okay",
  4: "good",
  5: "great",
};
const PersonalTabsSection = ({
  activeTab,
  onTabChange,
  onViewTeamDashboard,
  averageMoodQuery,
  hasViewTeamDashboard = true,
  showAssignButton = true,
}: PersonalTabsSectionProps) => {
  const [currentTab, setCurrentTab] = useState<string>(activeTab);
  const handleTabChange = (tab: string) => {
    onTabChange ? onTabChange(tab) : setCurrentTab(tab);
  };

  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);

  const data = averageMoodQuery?.data;
  const moodEntries = data?.data.mood_scores.map((entry) => {
    return {
      id: entry.user_id,
      title: entry.description,
      date: new Date(entry.created_at).toLocaleString(),
      mood: MoodEntryMapper[entry.mood_score],
    };
  });
  return (
    <TabComponent
      className="mt-[38px]"
      items={[
        {
          label: "Today's Focus",
          value: "todays_focus",
          icon: <MdOutlineCenterFocusStrong />,
          content: <TodaysFocusExample />,
        },
        {
          label: "Tasks",
          value: "tasks",
          icon: <IoCheckmarkOutline />,
          content: (
            <TasksTabContent
              tasks={personalTasksData}
              title="Today's Tasks"
              description="Stay focused and organized with your daily task list."
              showAssignButton={showAssignButton}
              AssignButton={AssignTask}
            />
          ),
        },
        {
          label: "Recent Moods",
          value: "recent_moods",
          icon: <LuClock2 />,
          content: (
            <MoodTrends
              moodEntries={moodEntries ?? []}
              averageMood={
                data?.data.average_mood
                  ? MoodEntryMapper[data.data.average_mood]
                  : undefined
              }
            />
          ),
        },
      ]}
      activeTab={currentTab}
      onTabChange={(tab) => handleTabChange(tab)}
      ToggleViewComponent={
        hasViewTeamDashboard
          ? () => (
            <Button
              className="bg-[#E5E5E5] text-[#494451] font-semibold"
              variant="ghost"
              onClick={onViewTeamDashboard}
            >
              View Team Dashboard <MdOutlineRemoveRedEye />
            </Button>
          )
          : undefined
      }
    />
  );
};

export default PersonalTabsSection;

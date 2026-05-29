import { Button } from "@/components/ui/button";
import TabComponent from "@/shared/components/tab.component";
import {
  MdOutlineCenterFocusStrong,
  MdOutlineRemoveRedEye,
} from "react-icons/md";
import { IoCheckmarkOutline } from "react-icons/io5";
import { LuClock2, LuFileClock } from "react-icons/lu";
import TimesheetTabContent from "@/shared/components/timesheet/timesheet-tab-content.component";
import TasksTabContent from "./tasks-tab-content.component";
// import { personalTasksData } from "@/team-leader/mock-data/index.mock";
import { PersonalTabsSectionProps } from "@/team-leader/typings/team-leader";

import AssignTask from "./assign-task.component";
import MoodTrends from "@/shared/components/mood-trend.component";
import { MoodType } from "@/shared/typings/mood-trend";
import TodaysFocusComponent from "@/shared/components/todays-focus.component";
import { personalTasksColumns } from "./columns/personal-tasks-columns";
import { formatDistanceToNowStrict } from "date-fns";
import { buildFocusGoals } from "@/shared/utils/date.utils";
import { useNavigate } from "react-router-dom";
import { getTaskDetailPath } from "@/shared/utils/task-routes";
import useAuthStore from "@/config/stores/auth.store";

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
  showAssignButton = true,
  weekTasksQuery,
}: PersonalTabsSectionProps) => {
  const navigate = useNavigate();
  const role = useAuthStore((s) => s.user?.user.user_role);
  const handleTabChange = (tab: string) => {
    onTabChange(tab);
  };
  const weekTasks = weekTasksQuery.data?.data;
  // Flatten the whole week — buildFocusGoals filters to tasks whose due_date
  // is actually today.
  const allWeekTasks = weekTasks ? Object.values(weekTasks).flat() : [];
  const focusGoals = buildFocusGoals(allWeekTasks as UserTaskAssignment[]);

  const data = averageMoodQuery?.data;
  const moodEntries = data?.data.mood_scores.map((entry) => {
    return {
      id: entry.user_id,
      title: entry.description,
      date: `${formatDistanceToNowStrict(new Date(entry.created_at))} ago`,
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
          content: (
            <TodaysFocusComponent goals={focusGoals} />
          ),
        },
        {
          label: "Tasks",
          value: "tasks",
          icon: <IoCheckmarkOutline />,
          content: (
            <TasksTabContent
              title="Your Tasks"
              description="Stay focused and organized with your daily task list."
              showAssignButton={showAssignButton}
              AssignButton={AssignTask}
              assignedTasks={weekTasks ? Object.values(weekTasks).flat() : []}
              columns={personalTasksColumns}
              onRowClick={(row) =>
                navigate(getTaskDetailPath(role, row.task.id))
              }
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
        {
          label: "Timesheet",
          value: "timesheet",
          icon: <LuFileClock />,
          content: <TimesheetTabContent />,
        },
      ]}
      activeTab={activeTab}
      onTabChange={(tab) => handleTabChange(tab)}
      ToggleViewComponent={
        onViewTeamDashboard
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

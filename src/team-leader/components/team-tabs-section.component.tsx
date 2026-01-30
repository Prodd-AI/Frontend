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
import { progressReviewsData } from "@/team-leader/mock-data/index.mock";
import { TeamTabsSectionProps } from "@/team-leader/typings/team-leader";
import { useState } from "react";
import {
  get_meetings,
  MeetingResponse,
} from "@/config/services/meeting.service";
import { useQuery } from "@tanstack/react-query";
import { format, isToday, isTomorrow } from "date-fns";
import { MeetingData } from "@/team-leader/typings/team-leader";
import { getAllTasksAssignedToTeamMembersByTeamLead } from "@/config/services/tasks.service";

const TeamTabsSection = ({
  activeTab,
  onTabChange,
  onViewPersonalDashboard,
}: TeamTabsSectionProps) => {
  const [internalTab, setInternalTab] = useState<string>(activeTab);

  const currentTab = onTabChange ? activeTab : internalTab;

  const handleTabChange = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalTab(tab);
    }
  };
  const [meetingsPage, setMeetingsPage] = useState("1");
  const [meetingsStatus, setMeetingsStatus] = useState<
    "scheduled" | "cancelled" | "completed"
  >("scheduled");

  const { data: meetingsResponse, isLoading: isMeetingsLoading } = useQuery({
    queryKey: ["meetings", meetingsPage, meetingsStatus],
    queryFn: () =>
      get_meetings({
        page: meetingsPage,
        limit: "5",
        status: meetingsStatus,
      }),
  });
  const { data: assignedTasksResponse, isLoading: isAssignedTasksLoading } =
    useQuery({
      queryKey: ["team-assigned-tasks"],
      queryFn: getAllTasksAssignedToTeamMembersByTeamLead,
    });

  const assignedTasks = assignedTasksResponse?.data || [];

  const transformMeetingData = (meeting: MeetingResponse): MeetingData => {
    const date = new Date(meeting.scheduled_at);
    let badge = format(date, "MMM dd");
    if (isToday(date)) badge = "Today";
    if (isTomorrow(date)) badge = "Tomorrow";

    const timeStr = format(date, "h:mm a");

    return {
      title: meeting.title,
      description: meeting.description,
      time: timeStr,
      badge: badge,
      meeting_link: meeting.meeting_link,
    };
  };

  const meetingsData = meetingsResponse?.data?.map(transformMeetingData) || [];

  return (
    <TabComponent
      className="mt-[38px]"
      items={[
        {
          label: "Team Tasks",
          value: "team_task",
          icon: <IoCheckmarkOutline />,
          content: (
            <TasksTabContent
              assignedTasks={assignedTasks}
              isLoading={isAssignedTasksLoading}
              showHeader={false}
            />
          ),
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
          content: (
            <MeetingsTabContent
              meetings={meetingsData}
              isLoading={isMeetingsLoading}
              pagination={{
                currentPage: Number(meetingsPage),
                totalPages: meetingsResponse?.meta?.total_pages || 1,
                onPageChange: (page) => setMeetingsPage(page.toString()),
              }}
              filter={{
                status: meetingsStatus,
                onStatusChange: setMeetingsStatus,
              }}
            />
          ),
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
        onViewPersonalDashboard
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

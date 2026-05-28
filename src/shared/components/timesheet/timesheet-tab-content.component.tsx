import { useState } from "react";
import { LuClock2, LuFileClock } from "react-icons/lu";
import { MdOutlineCalendarViewWeek } from "react-icons/md";
import TabComponent from "@/shared/components/tab.component";
import TimeClockTab from "./tabs/time-clock-tab.component";
import DailyLogTab from "./tabs/daily-log-tab.component";
import WeeklyOverviewTab from "./tabs/weekly-overview-tab.component";

const TIMESHEET_TABS = [
  {
    value: "time_clock",
    label: "Time Clock",
    icon: <LuClock2 />,
    content: <TimeClockTab />,
  },
  {
    value: "daily_log",
    label: "Daily Log",
    icon: <LuFileClock />,
    content: <DailyLogTab />,
  },
  {
    value: "weekly_overview",
    label: "Weekly Overview",
    icon: <MdOutlineCalendarViewWeek />,
    content: <WeeklyOverviewTab />,
  },
];

const TimesheetTabContent = () => {
  const [activeTab, setActiveTab] = useState("time_clock");

  return (
    <TabComponent
      items={TIMESHEET_TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  );
};

export default TimesheetTabContent;

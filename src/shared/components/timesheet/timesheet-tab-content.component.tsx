import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TimeClockTab from './tabs/time-clock-tab.component';
import DailyLogTab from './tabs/daily-log-tab.component';
import WeeklyOverviewTab from './tabs/weekly-overview-tab.component';

// Reusable configuration for tabs
const TIMESHEET_TABS = [
	{
		value: 'time_clock',
		label: 'Time Clock',
		content: <TimeClockTab />,
	},
	{
		value: 'daily_log',
		label: 'Daily Log',
		content: <DailyLogTab />,
	},
	{
		value: 'weekly_overview',
		label: 'Weekly Overview',
		content: <WeeklyOverviewTab />,
	},
];

const TimesheetTabContent = () => {
	return (
		<div className="w-full rounded-[20px] h-full min-h-[400px]">
			<Tabs defaultValue="time_clock" className="w-full h-full flex flex-col">
				<TabsList className="bg-transparent w-full justify-start   p-0 h-auto mb-6">
					{TIMESHEET_TABS.map((tab) => (
						<TabsTrigger
							key={tab.value}
							value={tab.value}
							className="px-6 py-2.5 text-gray-500 rounded-none font-medium transition-all hover:text-gray-900 
                data-[state=active]:bg-deep-indigo
                data-[state=active]:text-white 
                data-[state=active]:bg-[#393343]">
							{tab.label}
						</TabsTrigger>
					))}
				</TabsList>
				{TIMESHEET_TABS.map((tab) => (
					<TabsContent key={tab.value} value={tab.value} className="flex-1 mt-0">
						{tab.content}
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
};

export default TimesheetTabContent;

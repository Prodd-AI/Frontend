import { LuCalendar } from 'react-icons/lu';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { getWeeklySummary, WeeklySummaryData, ChartDataPoint } from '@/config/services/time-tracking.service';
import { toast } from 'sonner';

interface Entry {
	id: string;
	date: string;
	title: string;
	range: string;
	duration: string;
}

// Mock entries (will be replaced with API later)
const ALL_ENTRIES: Entry[] = [
	{ id: '1', date: 'Sun, Dec 1', title: 'Product Development', range: '(09:00 - 13:00)', duration: '4.00h' },
	{ id: '2', date: 'Sun, Dec 1', title: 'Team Meetings', range: '(14:00 - 16:00)', duration: '2.00h' },
	{ id: '3', date: 'Mon, Dec 2', title: 'Code Review', range: '(09:00 - 12:00)', duration: '3.00h' },
];

const StatCard = ({ value, label }: { value: string | number; label: string }) => (
	<div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
		<div className="text-2xl font-bold text-[#1F1F1F] mb-1">{value}</div>
		<div className="text-sm text-gray-500">{label}</div>
	</div>
);

const WeeklyOverviewTab = () => {
	const [summaryData, setSummaryData] = useState<WeeklySummaryData | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchSummary = async () => {
			try {
				const response = await getWeeklySummary();
				if (response.success) {
					setSummaryData(response.data);
				}
			} catch (error) {
				toast.error(error instanceof Error ? error.message : 'Failed to load weekly summary');
			} finally {
				setIsLoading(false);
			}
		};

		fetchSummary();
	}, []);

	// Derive values from API data or use defaults
	const chartData: ChartDataPoint[] = summaryData?.chart_data || [];
	const totalHours = summaryData?.total_hours || 0;
	const dailyAvg = summaryData?.daily_avg || '0.0';
	const entryCount = summaryData?.total_entries || 0;
	const maxHours = Math.max(...chartData.map((d) => d.value), 8);

	if (isLoading) {
		return (
			<div className="flex flex-col gap-[30px]">
				<div className="bg-white p-6 rounded-3xl w-full flex items-center justify-center h-96">
					<p className="text-gray-400">Loading weekly summary...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-[30px]">
			{/* Weekly Summary Card */}
			<div className="bg-white p-6 rounded-3xl w-full">
				{/* Header */}
				<div className="flex justify-between items-start mb-8">
					<div className="flex gap-4">
						<div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center shrink-0">
							<LuCalendar className="w-6 h-6 text-primary" />
						</div>
						<div>
							<h2 className="text-xl font-semibold text-[#1F1F1F]">Weekly Summary</h2>
							<p className="text-sm text-gray-400 mt-1">Hours logged this week</p>
						</div>
					</div>
					<Badge
						variant="secondary"
						className="px-3 py-1.5 h-fit text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-100">
						{totalHours.toFixed(2)}h total
					</Badge>
				</div>

				{/* Chart */}
				<div className="flex items-end justify-between h-48 gap-4 mb-10 pb-4 border-b border-gray-100 px-2">
					{chartData.map((day) => {
						const heightPercentage = maxHours > 0 ? (day.value / maxHours) * 100 : 0;
						const isZero = day.value === 0;

						return (
							<div key={day.day} className="flex flex-col items-center gap-3 flex-1 h-full justify-end group">
								<div className="relative w-full rounded-t-lg bg-gray-50 flex items-end h-full overflow-hidden">
									{!isZero && (
										<div
											className="w-full bg-[#A855F7] rounded-t-lg transition-all duration-500 ease-out hover:opacity-90"
											style={{ height: `${heightPercentage}%` }}
										/>
									)}
									{/* Tooltip on hover */}
									<div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
										{day.value}h
									</div>
								</div>
								<span className="text-xs text-gray-400 font-medium">{day.day}</span>
							</div>
						);
					})}
				</div>

				{/* Stats */}
				<div className="grid grid-cols-3 gap-4">
					<StatCard value={`${totalHours.toFixed(2)}h`} label="Total Hours" />
					<StatCard value={`${dailyAvg}h`} label="Daily Avg" />
					<StatCard value={entryCount} label="Entries" />
				</div>
			</div>

			{/* All Entries Card */}
			<div className="bg-white p-6 rounded-3xl w-full">
				<h2 className="text-xl font-semibold text-[#1F1F1F] mb-8">All Entries</h2>
				<div className="flex flex-col gap-6">
					{ALL_ENTRIES.map((entry) => (
						<div
							key={entry.id}
							className="flex items-center justify-between pb-4 border-b border-gray-50 last:border-0 last:pb-0">
							<div className="flex items-center gap-12">
								<span className="text-gray-400 text-sm w-24">{entry.date}</span>
								<span className="font-semibold text-[#1F1F1F] text-base min-w-[200px]">{entry.title}</span>
								<span className="text-gray-400 text-sm">{entry.range}</span>
							</div>
							<Badge variant="outline" className="text-gray-500 border-gray-200 rounded-full px-3 font-normal">
								{entry.duration}
							</Badge>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default WeeklyOverviewTab;

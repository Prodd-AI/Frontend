import { LuCalendar } from 'react-icons/lu';
import { Badge } from '@/components/ui/badge';
import {
	getMyEntries,
	getWeeklySummary,
	TimeEntry,
	ChartDataPoint,
} from '@/config/services/time-tracking.service';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { parseWallClockIso } from '@/shared/utils/date.utils';

const toNumber = (n: number | string | null | undefined): number => {
	if (typeof n === 'number') return Number.isFinite(n) ? n : 0;
	if (typeof n === 'string') {
		const parsed = parseFloat(n);
		return Number.isFinite(parsed) ? parsed : 0;
	}
	return 0;
};

const formatHours = (h: number | string | null | undefined) => `${toNumber(h).toFixed(2)}h`;
const stripSeconds = (t?: string): string => (t ? t.slice(0, 5) : '');
const formatRange = (entry: TimeEntry): string => {
	if (entry.start_time && entry.end_time) {
		return `(${stripSeconds(entry.start_time)} - ${stripSeconds(entry.end_time)})`;
	}
	return '';
};
const formatEntryDate = (entry: TimeEntry): string => {
	const iso = entry.date ?? entry.created_at;
	if (!iso) return '';
	const d = parseWallClockIso(iso);
	if (Number.isNaN(d.getTime())) return '';
	return format(d, 'EEE, MMM d');
};

// /time-tracking/my-entries returns inconsistent shapes — sometimes an array,
// sometimes a day-bucketed object like { Mon: [...], Tue: [...] }, sometimes
// { entries: [...] }. Normalize to a flat array so the rest of the UI doesn't
// have to care.
const normalizeEntries = (raw: unknown): TimeEntry[] => {
	if (!raw) return [];
	if (Array.isArray(raw)) return raw as TimeEntry[];
	if (typeof raw === 'object') {
		const obj = raw as Record<string, unknown>;
		if (Array.isArray(obj.entries)) return obj.entries as TimeEntry[];
		if (Array.isArray(obj.data)) return obj.data as TimeEntry[];
		// Day-bucketed (e.g. Mon/Tue/Wed) — flatten any array values into one list.
		const flattened: TimeEntry[] = [];
		Object.values(obj).forEach((value) => {
			if (Array.isArray(value)) flattened.push(...(value as TimeEntry[]));
		});
		return flattened;
	}
	return [];
};

const StatCard = ({ value, label }: { value: string | number; label: string }) => (
	<div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
		<div className="text-2xl font-bold text-[#1F1F1F] mb-1">{value}</div>
		<div className="text-sm text-gray-500">{label}</div>
	</div>
);

const WeeklyOverviewTab = () => {
	// Move the weekly summary onto useQuery so it gets cached/deduped — the
	// previous manual useEffect re-fired every time the tab mounted, causing
	// duplicate /weekly-summary calls when switching tabs.
	const { data: summaryResponse, isLoading } = useQuery({
		queryKey: ['weekly-time-summary'],
		queryFn: () => getWeeklySummary(),
		staleTime: 60_000,
		refetchOnWindowFocus: false,
	});
	const summaryData = summaryResponse?.success ? summaryResponse.data : null;

	const { data: entriesData, isLoading: isLoadingEntries } = useQuery({
		queryKey: ['my-time-entries', { duration: 'week' }],
		queryFn: () => getMyEntries({ duration: 'week' }),
		staleTime: 60_000,
		refetchOnWindowFocus: false,
	});
	const allEntries: TimeEntry[] = normalizeEntries(entriesData?.data);

	// Derive values from API data or use defaults
	const chartData: ChartDataPoint[] = summaryData?.chart_data || [];
	const totalHours = summaryData?.total_hours || 0;
	const dailyAvg = summaryData?.daily_avg || '0.0';
	const entryCount = summaryData?.total_entries || 0;
	const maxHours = Math.max(...chartData.map((d) => d.value), 8);

	if (isLoading) {
		return (
			<div className="flex flex-col gap-[30px]">
				<div className="bg-white p-6 rounded-3xl w-full border border-gray-200 flex items-center justify-center h-96">
					<p className="text-gray-400">Loading weekly summary...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-[30px]">
			{/* Weekly Summary Card */}
			<div className="bg-white p-6 rounded-3xl w-full border border-gray-200">
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
			<div className="bg-white p-6 rounded-3xl w-full border border-gray-200">
				<h2 className="text-xl font-semibold text-[#1F1F1F] mb-8">All Entries</h2>
				{isLoadingEntries ? (
					<p className="text-gray-400 text-sm">Loading entries…</p>
				) : allEntries.length === 0 ? (
					<p className="text-gray-400 text-sm">No entries this week.</p>
				) : (
					<div className="flex flex-col gap-6">
						{allEntries.map((entry) => (
							<div
								key={entry.id}
								className="flex items-center justify-between pb-4 border-b border-gray-50 last:border-0 last:pb-0">
								<div className="flex items-center gap-12">
									<span className="text-gray-400 text-sm w-24">{formatEntryDate(entry)}</span>
									<span className="font-semibold text-[#1F1F1F] text-base min-w-[200px]">
										{entry.description || entry.title || 'Untitled entry'}
									</span>
									<span className="text-gray-400 text-sm">{formatRange(entry)}</span>
								</div>
								<Badge variant="outline" className="text-gray-500 border-gray-200 rounded-full px-3 font-normal">
									{formatHours(entry.duration_hours ?? 0)}
								</Badge>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default WeeklyOverviewTab;

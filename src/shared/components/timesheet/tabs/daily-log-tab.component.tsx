import { LuClock3 } from 'react-icons/lu';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { getMyEntries, TimeEntry } from '@/config/services/time-tracking.service';
import { Loader2 } from 'lucide-react';

// Backend sometimes returns duration_hours as a number, sometimes as a
// stringified number — coerce defensively so .toFixed never blows up.
const toNumber = (n: number | string | null | undefined): number => {
	if (typeof n === 'number') return Number.isFinite(n) ? n : 0;
	if (typeof n === 'string') {
		const parsed = parseFloat(n);
		return Number.isFinite(parsed) ? parsed : 0;
	}
	return 0;
};

const formatHours = (h?: number | string | null) => `${toNumber(h).toFixed(2)}h`;

// Show both hours and minutes for the daily total — short sessions like
// 0.05h are easier to read as "3 mins".
const formatHoursAndMinutes = (h?: number | string | null): string => {
	const hours = toNumber(h);
	const totalMinutes = Math.round(hours * 60);
	return `${hours.toFixed(2)}h · ${totalMinutes} ${totalMinutes === 1 ? 'min' : 'mins'}`;
};

// API returns start_time / end_time as 24-hour "HH:MM:SS" strings — drop
// the seconds for display.
const stripSeconds = (t?: string): string => (t ? t.slice(0, 5) : '');

const formatRange = (entry: TimeEntry): string | null => {
	if (entry.start_time && entry.end_time) {
		return `${stripSeconds(entry.start_time)} - ${stripSeconds(entry.end_time)}`;
	}
	return null;
};

// /time-tracking/my-entries can return a plain array, an { entries: [] }
// wrapper, or a day-bucketed object. Normalize to a flat array so the
// component doesn't crash on shape changes.
const normalizeEntries = (raw: unknown): TimeEntry[] => {
	if (!raw) return [];
	if (Array.isArray(raw)) return raw as TimeEntry[];
	if (typeof raw === 'object') {
		const obj = raw as Record<string, unknown>;
		if (Array.isArray(obj.entries)) return obj.entries as TimeEntry[];
		if (Array.isArray(obj.data)) return obj.data as TimeEntry[];
		const flattened: TimeEntry[] = [];
		Object.values(obj).forEach((value) => {
			if (Array.isArray(value)) flattened.push(...(value as TimeEntry[]));
		});
		return flattened;
	}
	return [];
};

export const DailyLogTab = () => {
	const { data, isLoading, isError } = useQuery({
		queryKey: ['my-time-entries', { duration: 'day' }],
		queryFn: () => getMyEntries({ duration: 'day' }),
	});

	const entries: TimeEntry[] = normalizeEntries(data?.data);
	const totalHours = entries.reduce((acc, e) => acc + toNumber(e.duration_hours), 0);

	return (
		<div className="flex flex-col gap-6">
			<div className="bg-white p-6 rounded-3xl w-full border border-gray-200">
				<div className="flex items-center justify-between mb-8">
					<div className="flex items-center gap-2">
						<LuClock3 className="w-6 h-6 text-primary" />
						<h2 className="text-xl font-semibold text-[#1F1F1F]">Today's Entries</h2>
					</div>
					<Badge
						variant="secondary"
						className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-500 hover:bg-gray-100">
						{entries.length} logged
					</Badge>
				</div>

				{isLoading ? (
					<div className="flex items-center justify-center py-10 text-gray-400">
						<Loader2 className="animate-spin mr-2" size={18} /> Loading entries…
					</div>
				) : isError ? (
					<p className="text-center text-sm text-red-500 py-10">
						Could not load today's entries.
					</p>
				) : entries.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<p className="text-gray-400">
							No entries for today yet. Use the Time Clock to log your hours.
						</p>
					</div>
				) : (
					<div className="flex flex-col gap-2">
						{entries.map((entry) => {
							// Entries from /allocate carry the description but no separate
							// title field — surface that as the row's heading so the row
							// isn't just "Untitled entry".
							const heading = entry.description || entry.title || 'Untitled entry';
							const range = formatRange(entry);
							return (
								<div
									key={entry.id}
									className="group relative flex justify-between items-start py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors rounded-xl px-4 -mx-4">
									<div className="flex-1 pr-12">
										<div className="flex items-center gap-3 mb-2">
											<h3 className="font-semibold text-[#1F1F1F] text-base">{heading}</h3>
											<div className="flex items-center gap-2">
												<span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs font-medium text-gray-600 border border-gray-200">
													{formatHours(entry.duration_hours)}
												</span>
												{range && (
													<span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs font-medium text-gray-600 border border-gray-200">
														{range}
													</span>
												)}
											</div>
										</div>
									</div>
								</div>
							);
						})}
						<div className="flex justify-end pt-4">
							<span className="text-sm font-semibold text-[#251F2D]">
								Total: {formatHoursAndMinutes(totalHours)}
							</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default DailyLogTab;

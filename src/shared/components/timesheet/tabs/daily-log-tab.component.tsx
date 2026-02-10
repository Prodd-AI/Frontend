import { LuClock3 } from 'react-icons/lu';
import { IoTrashOutline } from 'react-icons/io5';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

// Types
interface TimeEntry {
	id: string;
	title: string;
	duration: string;
	startTime: string;
	endTime: string;
	description?: string;
}

// Mock Data
const MOCK_ENTRIES: TimeEntry[] = [
	{
		id: '1',
		title: 'Update project documentation',
		duration: '0.00h',
		startTime: '14:01',
		endTime: '14:01',
		description: 'Description will be contained here',
	},
];

export const DailyLogTab = () => {
	const [entries, setEntries] = useState<TimeEntry[]>(MOCK_ENTRIES);

	const totalHours = entries.reduce((acc, entry) => {
		// Just a placeholder calculation, would be real duration in practice
		return acc + parseFloat(entry.duration);
	}, 0);

	const handleDelete = (id: string) => {
		setEntries(entries.filter((e) => e.id !== id));
	};

	return (
		<div className="flex flex-col gap-6">
			{/* Daily Log Card */}
			<div className="bg-white p-6 rounded-3xl w-full">
				<div className="flex items-center justify-between mb-8">
					<div className="flex items-center gap-2">
						<LuClock3 className="w-6 h-6 text-primary" />
						<h2 className="text-xl font-semibold text-[#1F1F1F]">Today's Entries</h2>
					</div>
					<Badge
						variant="secondary"
						className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-500 hover:bg-gray-100">
						{totalHours} logged
					</Badge>
				</div>

				{entries.length > 0 ? (
					<div className="flex flex-col gap-2">
						{entries.map((entry) => (
							<div
								key={entry.id}
								className="group relative flex justify-between items-start py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors rounded-xl px-4 -mx-4">
								<div className="flex-1 pr-12">
									<div className="flex items-center gap-3 mb-2">
										<h3 className="font-semibold text-[#1F1F1F] text-base">{entry.title}</h3>
										<div className="flex items-center gap-2">
											<span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs font-medium text-gray-600 border border-gray-200">
												{entry.duration}
											</span>
											<span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs font-medium text-gray-600 border border-gray-200">
												{entry.startTime} - {entry.endTime}
											</span>
										</div>
									</div>
									<p className="text-gray-400 text-sm">{entry.description || 'No description provided'}</p>
								</div>
								<button
									onClick={() => handleDelete(entry.id)}
									className="absolute bottom-3 right-3 text-red-500 hover:text-red-600 transition-colors p-1">
									<IoTrashOutline className="w-5 h-5" />
								</button>
							</div>
						))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<p className="text-gray-400">No entries for today yet. Use the Time Clock to log your hours.</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default DailyLogTab;

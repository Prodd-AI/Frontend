import { useState, useMemo, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
	IoTrashOutline,
	IoPencilOutline,
	IoSparklesOutline,
	IoCheckmarkOutline,
	IoCloseOutline,
} from 'react-icons/io5';
import { LuClock3, LuPause, LuActivity } from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TimePicker } from '@/components/ui/time-picker';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { clockAction, allocateTime, TaskAllocation } from '@/config/services/time-tracking.service';
import useTimeTrackingStore from '@/config/stores/time-tracking.store';
import { getWeeklyStreak } from '@/config/services/tasks.service';
import { cn } from '@/lib/utils';

interface Task {
	name: string;
	description?: string;
	startTime: string; // HH:MM AM/PM (TimePicker format)
	endTime: string; // HH:MM AM/PM
}

interface ClockOutSummaryProps {
	startTime: Date;
	endTime: Date;
	elapsedSeconds: number;
	initialTasks: Task[];
	sessionId: string;
	onCancel: () => void;
	onConfirm: () => void;
}

// Parse "HH:MM[:SS] AM/PM" against a base date so we get a real timestamp.
// Returns NaN Date on bad input — callers should guard.
const parseTimeOfDay = (timeStr: string, baseDate: Date): Date => {
	const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s?(AM|PM)$/i);
	if (!match) return new Date(NaN);
	let h = parseInt(match[1], 10);
	const m = parseInt(match[2], 10);
	const s = match[3] ? parseInt(match[3], 10) : 0;
	const period = match[4].toUpperCase();
	if (period === 'PM' && h !== 12) h += 12;
	if (period === 'AM' && h === 12) h = 0;
	const d = new Date(baseDate);
	d.setHours(h, m, s, 0);
	return d;
};

// Resolve a clock-time to a real Date. Only bump to the next calendar day
// when the session actually spans midnight — otherwise a user entering e.g.
// 9am for a session that clocked in at 10am gets falsely shifted to "tomorrow
// 9am" and the end time looks earlier than the start.
const taskTimeWithinSession = (timeStr: string, sessionStart: Date, sessionEnd: Date): Date => {
	const candidate = parseTimeOfDay(timeStr, sessionStart);
	if (Number.isNaN(candidate.getTime())) return candidate;
	const spansMidnight = sessionStart.toDateString() !== sessionEnd.toDateString();
	if (spansMidnight && candidate.getTime() < sessionStart.getTime()) {
		candidate.setDate(candidate.getDate() + 1);
	}
	return candidate;
};

const taskDurationHours = (task: Task, sessionStart: Date, sessionEnd: Date): number => {
	const s = taskTimeWithinSession(task.startTime, sessionStart, sessionEnd).getTime();
	let e = taskTimeWithinSession(task.endTime, sessionStart, sessionEnd).getTime();
	if (Number.isNaN(s) || Number.isNaN(e)) return 0;
	if (e <= s) e += 24 * 60 * 60 * 1000;
	return Math.max(0, (e - s) / (1000 * 60 * 60));
};

const convertTo24Hour = (timeStr: string) => {
	const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s?(AM|PM)$/i);
	if (!match) return '00:00';
	let h = parseInt(match[1], 10);
	const minutes = match[2];
	const period = match[4].toUpperCase();
	if (period === 'PM' && h !== 12) h += 12;
	if (period === 'AM' && h === 12) h = 0;
	return `${h.toString().padStart(2, '0')}:${minutes}`;
};

const dateToPickerString = (d: Date): string => {
	if (Number.isNaN(d.getTime())) return '';
	let h = d.getHours();
	const m = d.getMinutes();
	const period = h >= 12 ? 'PM' : 'AM';
	h = h % 12 || 12;
	return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}`;
};

const formatHM = (date: Date) =>
	date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });

const formatHoursShort = (h: number): string => {
	if (h <= 0) return '0m';
	const hours = Math.floor(h);
	const minutes = Math.round((h - hours) * 60);
	if (hours === 0) return `${minutes}m`;
	if (minutes === 0) return `${hours}h`;
	return `${hours}h ${minutes}m`;
};

const StatCard = ({
	icon,
	label,
	value,
	accent,
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
	accent?: string;
}) => (
	<div className={cn('rounded-2xl border p-4 flex flex-col gap-2', accent ?? 'border-gray-200 bg-white')}>
		<div className="flex items-center gap-2 text-xs font-medium text-gray-500">
			<span className="size-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500">
				{icon}
			</span>
			{label}
		</div>
		<p className="text-lg font-semibold text-[#1F1F1F]">{value}</p>
	</div>
);

const ClockOutSummary = ({
	startTime,
	endTime,
	elapsedSeconds,
	initialTasks,
	sessionId,
	onCancel,
	onConfirm,
}: ClockOutSummaryProps) => {
	const { clearSession } = useTimeTrackingStore();
	const queryClient = useQueryClient();

	// Initial tasks coming from the Time Clock tab use HH:MM:SS AM/PM; the
	// TimePicker only round-trips HH:MM AM/PM, so strip seconds upfront so an
	// edit-then-save cycle doesn't reformat or look inconsistent.
	const normalizeTimeForPicker = (s: string): string => {
		const m = s.trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s?(AM|PM)$/i);
		if (!m) return s;
		return `${m[1].padStart(2, '0')}:${m[2]} ${m[3].toUpperCase()}`;
	};

	const [tasks, setTasks] = useState<Task[]>(() =>
		initialTasks.map((t) => ({
			...t,
			startTime: normalizeTimeForPicker(t.startTime),
			endTime: normalizeTimeForPicker(t.endTime),
		})),
	);
	const [newTaskName, setNewTaskName] = useState('');
	const [newTaskStart, setNewTaskStart] = useState('');
	const [newTaskEnd, setNewTaskEnd] = useState('');
	const [newDescription, setNewDescription] = useState('');
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Pull the user's pending tasks so they can pick from a dropdown instead
	// of having to retype the task name they were already working on.
	const { data: pendingTasksData } = useQuery({
		queryKey: ['streaks', { duration: 'week', status: 'pending' }],
		queryFn: () => getWeeklyStreak({ duration: 'week', status: 'pending' }),
	});
	const pendingTaskTitles = useMemo(() => {
		const buckets = pendingTasksData?.data;
		if (!buckets) return [] as string[];
		const titles = new Set<string>();
		Object.values(buckets).forEach((day) =>
			(day as UserTaskAssignment[]).forEach((t) => {
				if (t?.task?.title) titles.add(t.task.title);
			}),
		);
		return Array.from(titles);
	}, [pendingTasksData]);

	const sessionDurationHours = elapsedSeconds / 3600;
	const wallClockSeconds = Math.max(0, Math.round((endTime.getTime() - startTime.getTime()) / 1000));
	const pausedSeconds = Math.max(0, wallClockSeconds - elapsedSeconds);

	const allocatedDuration = useMemo(
		() => tasks.reduce((acc, task) => acc + taskDurationHours(task, startTime, endTime), 0),
		[tasks, startTime, endTime],
	);

	const remainingDuration = sessionDurationHours - allocatedDuration;
	const isFullyAllocated = Math.abs(remainingDuration) < 0.001;
	const isOverAllocated = remainingDuration < -0.001;
	const allocationPercent = sessionDurationHours > 0 ? Math.min(100, (allocatedDuration / sessionDurationHours) * 100) : 0;

	const hasOverlaps = useMemo(() => {
		for (let i = 0; i < tasks.length; i++) {
			for (let j = i + 1; j < tasks.length; j++) {
				const aStart = taskTimeWithinSession(tasks[i].startTime, startTime, endTime).getTime();
				const aEnd = taskTimeWithinSession(tasks[i].endTime, startTime, endTime).getTime();
				const bStart = taskTimeWithinSession(tasks[j].startTime, startTime, endTime).getTime();
				const bEnd = taskTimeWithinSession(tasks[j].endTime, startTime, endTime).getTime();
				if (aStart < bEnd && bStart < aEnd) return true;
			}
		}
		return false;
	}, [tasks, startTime, endTime]);

	// Default smart times for the new-task row: start = last task's end (or
	// session start), end = session end. Reseed whenever tasks change unless
	// the user has typed something custom.
	useEffect(() => {
		if (editingIndex !== null) return;
		const lastTask = tasks[tasks.length - 1];
		const suggestedStart = lastTask
			? lastTask.endTime
			: dateToPickerString(startTime);
		const suggestedEnd = dateToPickerString(endTime);
		setNewTaskStart((prev) => (prev ? prev : suggestedStart));
		setNewTaskEnd((prev) => (prev ? prev : suggestedEnd));
	}, [tasks, startTime, endTime, editingIndex]);

	const validateNewTask = useMemo((): string | null => {
		if (!newTaskStart || !newTaskEnd) return null;
		const s = taskTimeWithinSession(newTaskStart, startTime, endTime).getTime();
		const e = taskTimeWithinSession(newTaskEnd, startTime, endTime).getTime();
		if (Number.isNaN(s) || Number.isNaN(e)) return null;
		if (e <= s) return 'End time must be after start time';
		for (let i = 0; i < tasks.length; i++) {
			if (editingIndex === i) continue;
			const otherStart = taskTimeWithinSession(tasks[i].startTime, startTime, endTime).getTime();
			const otherEnd = taskTimeWithinSession(tasks[i].endTime, startTime, endTime).getTime();
			if (s < otherEnd && otherStart < e) {
				return 'This time range overlaps with an existing task';
			}
		}
		const newDuration = (e - s) / (1000 * 60 * 60);
		const previousDuration = editingIndex !== null ? taskDurationHours(tasks[editingIndex], startTime, endTime) : 0;
		if (allocatedDuration - previousDuration + newDuration > sessionDurationHours + 0.001) {
			return 'Adding this would exceed the session duration';
		}
		return null;
	}, [newTaskStart, newTaskEnd, tasks, allocatedDuration, sessionDurationHours, editingIndex, startTime, endTime]);

	const resetNewTaskForm = () => {
		setNewTaskName('');
		setNewTaskStart('');
		setNewTaskEnd('');
		setNewDescription('');
		setEditingIndex(null);
	};

	const handleSaveTask = () => {
		if (!newTaskName || !newTaskStart || !newTaskEnd) return;
		if (validateNewTask) return;
		const next: Task = {
			name: newTaskName,
			description: newDescription.trim() || undefined,
			startTime: newTaskStart,
			endTime: newTaskEnd,
		};
		if (editingIndex !== null) {
			setTasks(tasks.map((t, i) => (i === editingIndex ? next : t)));
		} else {
			setTasks([...tasks, next]);
		}
		resetNewTaskForm();
	};

	const handleEditTask = (index: number) => {
		const t = tasks[index];
		setEditingIndex(index);
		setNewTaskName(t.name);
		setNewDescription(t.description ?? '');
		setNewTaskStart(t.startTime);
		setNewTaskEnd(t.endTime);
	};

	const handleAllocateRemaining = () => {
		if (remainingDuration <= 0.001) return;
		const lastTask = tasks[tasks.length - 1];
		const startStr = lastTask ? lastTask.endTime : dateToPickerString(startTime);
		setNewTaskStart(startStr);
		setNewTaskEnd(dateToPickerString(endTime));
		setEditingIndex(null);
	};

	const buildAllocations = (): TaskAllocation[] =>
		tasks.map((task) => ({
			description: task.description ? `${task.name}: ${task.description}` : task.name,
			duration_hours: taskDurationHours(task, startTime, endTime),
			start_time: convertTo24Hour(task.startTime),
			end_time: convertTo24Hour(task.endTime),
		}));

	const invalidateAll = () => {
		queryClient.invalidateQueries({ queryKey: ['my-sessions'] });
		queryClient.invalidateQueries({ queryKey: ['my-time-entries'] });
		queryClient.invalidateQueries({ queryKey: ['weekly-time-summary'] });
		queryClient.invalidateQueries({ queryKey: ['active-time-session'] });
	};

	const handleConfirmClockOut = async () => {
		if (hasOverlaps || isOverAllocated) return;

		setIsSubmitting(true);
		try {
			const clockOutResponse = await clockAction('clock_out');
			if (!clockOutResponse.success) throw new Error('Failed to clock out');

			// Allocation is now optional. Only POST if there's something to send.
			if (tasks.length > 0) {
				const allocations = buildAllocations();
				const allocResponse = await allocateTime(sessionId, allocations);
				if (!allocResponse.success) throw new Error('Failed to allocate time');
			}

			clearSession();
			invalidateAll();
			toast.success(
				tasks.length > 0
					? 'Clocked out and time allocated'
					: 'Clocked out — you can allocate this session later from My Sessions',
			);
			onConfirm();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Failed to complete clock out');
		} finally {
			setIsSubmitting(false);
		}
	};

	const hasAnyAllocation = tasks.length > 0;
	const allocationStatusLabel = isOverAllocated
		? `${formatHoursShort(Math.abs(remainingDuration))} over`
		: isFullyAllocated
			? 'Fully allocated'
			: hasAnyAllocation
				? `${formatHoursShort(remainingDuration)} left`
				: 'Optional';

	const allocationStatusTone = isOverAllocated
		? 'text-red-600'
		: isFullyAllocated
			? 'text-emerald-600'
			: hasAnyAllocation
				? 'text-[#6619DE]'
				: 'text-gray-500';

	return (
		<Dialog open={true} onOpenChange={() => (isSubmitting ? null : onCancel())}>
			<DialogContent className="max-w-[820px] w-full p-0 rounded-3xl bg-white border-none shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
				<div className="px-8 pt-8 pb-5 border-b border-gray-100">
					<DialogHeader>
						<DialogTitle className="text-2xl font-bold text-[#1F1F1F] mb-1">
							Clock Out & Allocate Time
						</DialogTitle>
						<p className="text-gray-500 text-sm">
							Tag what you worked on so this session shows up in your daily and weekly
							logs. Allocations are optional — you can skip them and add them later.
						</p>
					</DialogHeader>
				</div>

				<div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-6">
					{/* Guidance */}
					<div className="rounded-2xl border border-[#6619DE]/15 bg-[#F8F3FF] p-4 flex gap-3">
						<span className="size-9 rounded-xl bg-white border border-[#6619DE]/20 flex items-center justify-center text-[#6619DE] shrink-0">
							<IoSparklesOutline className="size-4" />
						</span>
						<div className="text-sm text-[#3F2A6A] leading-relaxed">
							<p className="font-semibold text-[#251F2D] mb-0.5">How this works</p>
							<p>
								Break your <span className="font-semibold">{formatHoursShort(sessionDurationHours)}</span> of
								active time into the tasks you worked on. You can allocate part of it,
								all of it, or none — whatever's accurate. Then hit
								<span className="font-semibold"> Confirm Clock Out</span>.
							</p>
						</div>
					</div>

					{/* Stats */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
						<StatCard icon={<LuClock3 className="size-3.5" />} label="Clock In" value={formatHM(startTime)} />
						<StatCard icon={<LuClock3 className="size-3.5" />} label="Clock Out" value={formatHM(endTime)} />
						<StatCard
							icon={<LuActivity className="size-3.5" />}
							label="Active"
							value={formatHoursShort(sessionDurationHours)}
							accent="border-emerald-200 bg-emerald-50"
						/>
						<StatCard
							icon={<LuPause className="size-3.5" />}
							label="Paused"
							value={formatHoursShort(pausedSeconds / 3600)}
							accent="border-amber-200 bg-amber-50"
						/>
					</div>

					{/* Allocation progress */}
					<div className="rounded-2xl border border-gray-200 bg-gray-50/60 p-5 flex flex-col gap-3">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
									Time allocation
								</p>
								<p className="text-sm text-gray-700 mt-0.5">
									<span className="font-semibold text-[#1F1F1F]">
										{formatHoursShort(allocatedDuration)}
									</span>{' '}
									of {formatHoursShort(sessionDurationHours)} allocated
								</p>
							</div>
							<span className={cn('text-sm font-semibold', allocationStatusTone)}>
								{allocationStatusLabel}
							</span>
						</div>
						<div className="h-2.5 bg-white border border-gray-200 rounded-full overflow-hidden">
							<div
								className={cn(
									'h-full transition-all',
									isOverAllocated ? 'bg-red-500' : isFullyAllocated ? 'bg-emerald-500' : 'bg-[#6619DE]',
								)}
								style={{ width: `${allocationPercent}%` }}
							/>
						</div>
						{!isFullyAllocated && !isOverAllocated && (
							<Button
								variant="outline"
								size="sm"
								onClick={handleAllocateRemaining}
								className="self-start h-8 gap-1.5 border-[#6619DE]/30 bg-white text-xs font-semibold text-[#6619DE] hover:bg-[#F3EBFF]">
								<IoSparklesOutline className="size-3.5" />
								Fill remaining {formatHoursShort(remainingDuration)} with new task
							</Button>
						)}
					</div>

					{/* Task list */}
					{tasks.length > 0 && (
						<div className="flex flex-col gap-2">
							<div className="flex items-center justify-between">
								<h3 className="text-sm font-semibold text-[#1F1F1F]">
									Allocations ({tasks.length})
								</h3>
								{hasOverlaps && (
									<span className="text-xs font-semibold text-red-600">
										Overlapping times — adjust below
									</span>
								)}
							</div>
							<div className="flex flex-col gap-2">
								{tasks.map((task, index) => {
									const duration = taskDurationHours(task, startTime, endTime);
									const isEditing = editingIndex === index;
									return (
										<div
											key={index}
											className={cn(
												'rounded-xl border p-3 pr-2 flex items-center gap-3',
												isEditing ? 'border-[#6619DE]/50 bg-[#F8F3FF]' : 'border-gray-200 bg-white',
											)}>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-semibold text-[#1F1F1F] truncate">{task.name}</p>
												{task.description && (
													<p className="text-xs text-gray-500 truncate">{task.description}</p>
												)}
												<p className="text-xs text-gray-400 mt-0.5">
													{task.startTime} — {task.endTime} ·{' '}
													<span className="font-medium text-gray-600">{formatHoursShort(duration)}</span>
												</p>
											</div>
											<button
												type="button"
												title="Edit"
												className="p-2 rounded-lg text-gray-500 hover:text-[#6619DE] hover:bg-[#F3EBFF] transition-colors"
												onClick={() => handleEditTask(index)}>
												<IoPencilOutline className="w-4 h-4" />
											</button>
											<button
												type="button"
												title="Delete"
												className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
												onClick={() => {
													setTasks(tasks.filter((_, i) => i !== index));
													if (editingIndex === index) resetNewTaskForm();
												}}>
												<IoTrashOutline className="w-4 h-4" />
											</button>
										</div>
									);
								})}
							</div>
						</div>
					)}

					{/* Add / edit form */}
					<div className="rounded-2xl border border-gray-200 p-5 flex flex-col gap-4">
						<div className="flex items-center justify-between">
							<h3 className="text-sm font-semibold text-[#1F1F1F]">
								{editingIndex !== null ? 'Edit allocation' : 'Add allocation'}
							</h3>
							{editingIndex !== null && (
								<button
									type="button"
									onClick={resetNewTaskForm}
									className="text-xs font-medium text-gray-500 hover:text-gray-800 flex items-center gap-1">
									<IoCloseOutline className="size-3.5" /> Cancel edit
								</button>
							)}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							{pendingTaskTitles.length > 0 && (
								<Select onValueChange={setNewTaskName} value={pendingTaskTitles.includes(newTaskName) ? newTaskName : undefined}>
									<SelectTrigger className="h-12 rounded-lg border-gray-200 bg-white">
										<SelectValue placeholder="Pick from pending tasks…" />
									</SelectTrigger>
									<SelectContent>
										{pendingTaskTitles.map((title) => (
											<SelectItem key={title} value={title}>
												{title}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
							<Input
								placeholder="Or type a task name"
								className={cn('h-12 rounded-lg border-gray-200 bg-white', pendingTaskTitles.length === 0 && 'md:col-span-2')}
								value={newTaskName}
								onChange={(e) => setNewTaskName(e.target.value)}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<TimePicker placeholder="Start time" value={newTaskStart} onChange={setNewTaskStart} />
							<TimePicker placeholder="End time" value={newTaskEnd} onChange={setNewTaskEnd} />
						</div>

						<Textarea
							placeholder="Notes (optional) — e.g. what you tackled, blockers, decisions"
							className="bg-white resize-none min-h-[72px]"
							value={newDescription}
							onChange={(e) => setNewDescription(e.target.value)}
						/>

						{validateNewTask && (
							<p className="text-red-600 text-xs font-medium flex items-center gap-1">
								<span className="size-1.5 rounded-full bg-red-500 inline-block" />
								{validateNewTask}
							</p>
						)}

						<Button
							onClick={handleSaveTask}
							disabled={!newTaskName || !newTaskStart || !newTaskEnd || !!validateNewTask}
							className="h-11 gap-2 bg-[#6619DE] hover:bg-[#5710c4] text-white font-semibold disabled:opacity-40">
							<IoCheckmarkOutline className="size-4" />
							{editingIndex !== null ? 'Save changes' : 'Add allocation'}
						</Button>
					</div>
				</div>

				{/* Footer */}
				<div className="border-t border-gray-100 px-8 py-5 flex flex-col gap-3 bg-white">
					<div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-3">
						<p className="text-xs text-gray-500 self-start md:self-center">
							{hasOverlaps
								? 'Fix the overlapping times above to continue.'
								: isOverAllocated
									? 'Your allocations exceed the session length — adjust to continue.'
									: tasks.length === 0
										? "No allocations? That's fine — your session will be saved as one block."
										: isFullyAllocated
											? 'Everything is accounted for. Ready to clock out.'
											: `You've allocated ${formatHoursShort(allocatedDuration)} of ${formatHoursShort(sessionDurationHours)}. The rest will be saved as unallocated.`}
						</p>
						<div className="flex justify-end gap-3">
							<Button
								variant="outline"
								className="px-6 h-11"
								onClick={onCancel}
								disabled={isSubmitting}>
								Cancel
							</Button>
							<Button
								className="bg-[#6619DE] hover:bg-[#5710c4] text-white px-6 h-11 disabled:opacity-40"
								disabled={hasOverlaps || isOverAllocated || isSubmitting}
								onClick={handleConfirmClockOut}>
								{isSubmitting ? 'Processing…' : 'Confirm Clock Out'}
							</Button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ClockOutSummary;

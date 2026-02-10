import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TimePicker } from '@/components/ui/time-picker';
import { useState, useMemo } from 'react';
import { IoTrashOutline } from 'react-icons/io5';
import { clockAction, allocateTime, TaskAllocation } from '@/config/services/time-tracking.service';
import useTimeTrackingStore from '@/config/stores/time-tracking.store';
import { toast } from 'sonner';

interface Task {
	name: string;
	startTime: string; // HH:MM:SS AM/PM
	endTime: string; // HH:MM:SS AM/PM
}

interface ClockOutSummaryProps {
	startTime: Date;
	endTime: Date;
	elapsedSeconds: number; // Actual timer elapsed time
	initialTasks: Task[];
	sessionId: string;
	onCancel: () => void;
	onConfirm: () => void;
}

const parseTime = (timeStr: string) => {
	const [time, modifier] = timeStr.split(' ');
	const [hoursStr, minutesStr, secondsStr] = time.split(':');
	let hours = parseInt(hoursStr, 10);
	const minutes = parseInt(minutesStr, 10);
	const seconds = secondsStr ? parseInt(secondsStr, 10) : 0;

	if (hours === 12) {
		hours = 0;
	}
	if (modifier === 'PM') {
		hours += 12;
	}

	// Create a date object for today with this time for comparison
	const now = new Date();
	return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds);
};

// Helper to calculate duration in decimal hours between two time strings
const calculateDuration = (start: string, end: string) => {
	const startDate = parseTime(start);
	const endDate = parseTime(end);

	// Handle overnight edge case? Assuming same day for this scope as per simplified requirements
	let diffMs = endDate.getTime() - startDate.getTime();
	if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000; // Just in case, though usually same session

	return diffMs / (1000 * 60 * 60); // Convert to hours
};

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
	const [tasks, setTasks] = useState<Task[]>(initialTasks);
	const [newTaskName, setNewTaskName] = useState('');
	const [newTaskStart, setNewTaskStart] = useState('');
	const [newTaskEnd, setNewTaskEnd] = useState('');
	const [description, setDescription] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const formatTimeForDisplay = (date: Date) => {
		return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
	};

	// Use elapsed timer seconds for session duration (not clock-in to clock-out difference)
	const sessionDuration = elapsedSeconds / 3600; // Convert seconds to hours

	const allocatedDuration = useMemo(() => {
		return tasks.reduce((acc, task) => acc + calculateDuration(task.startTime, task.endTime), 0);
	}, [tasks]);

	const remainingDuration = sessionDuration - allocatedDuration;
	const isFullyAllocated = Math.abs(remainingDuration) < 0.001; // Tolerance for float math
	const isOverAllocated = remainingDuration < -0.001;

	// Validation Logic
	const hasOverlaps = useMemo(() => {
		for (let i = 0; i < tasks.length; i++) {
			for (let j = i + 1; j < tasks.length; j++) {
				const startA = parseTime(tasks[i].startTime).getTime();
				const endA = parseTime(tasks[i].endTime).getTime();
				const startB = parseTime(tasks[j].startTime).getTime();
				const endB = parseTime(tasks[j].endTime).getTime();

				if (startA < endB && startB < endA) {
					return true;
				}
			}
		}
		return false;
	}, [tasks]);

	// Real-time validation for new task
	const validateNewTask = useMemo(() => {
		if (!newTaskStart || !newTaskEnd) return null;

		try {
			const newStart = parseTime(newTaskStart).getTime();
			const newEnd = parseTime(newTaskEnd).getTime();

			if (newEnd <= newStart) {
				return 'End time must be after start time';
			}

			// Check overlaps with existing tasks
			for (const task of tasks) {
				const existingStart = parseTime(task.startTime).getTime();
				const existingEnd = parseTime(task.endTime).getTime();

				if (newStart < existingEnd && existingStart < newEnd) {
					return 'This time range overlaps with an existing task';
				}
			}

			// Check for over-allocation
			const newDuration = calculateDuration(newTaskStart, newTaskEnd);
			if (allocatedDuration + newDuration > sessionDuration + 0.001) {
				return 'Adding this task would exceed the session duration';
			}

			return null;
		} catch {
			return null; // Invalid time format, but don't show error yet
		}
	}, [newTaskStart, newTaskEnd, tasks, allocatedDuration, sessionDuration]);

	const handleAddTask = () => {
		if (!newTaskName || !newTaskStart || !newTaskEnd) return;
		if (validateNewTask) return; // Already validated, button should be disabled

		const newTask: Task = {
			name: newTaskName,
			startTime: newTaskStart,
			endTime: newTaskEnd,
		};

		setTasks([...tasks, newTask]);
		setNewTaskName('');
		setNewTaskStart('');
		setNewTaskEnd('');
		setDescription('');
	};

	// Convert HH:MM AM/PM to HH:MM (24h)
	const convertTo24Hour = (timeStr: string) => {
		const [time, modifier] = timeStr.split(' ');
		const [hoursStr, minutesStr] = time.split(':').map((s) => s.slice(0, 2));
		let h = parseInt(hoursStr, 10);
		if (modifier === 'PM' && h !== 12) h += 12;
		if (modifier === 'AM' && h === 12) h = 0;
		return `${h.toString().padStart(2, '0')}:${minutesStr}`;
	};

	const handleConfirmClockOut = async () => {
		if (tasks.length === 0 || hasOverlaps) return;

		setIsSubmitting(true);
		try {
			// Step 1: Clock out
			const clockOutResponse = await clockAction('clock_out');
			if (!clockOutResponse.success) {
				throw new Error('Failed to clock out');
			}

			// Step 2: Allocate time to tasks
			const allocations: TaskAllocation[] = tasks.map((task) => ({
				description: task.name,
				duration_hours: calculateDuration(task.startTime, task.endTime),
				start_time: convertTo24Hour(task.startTime),
				end_time: convertTo24Hour(task.endTime),
			}));

			const allocResponse = await allocateTime(sessionId, allocations);
			if (!allocResponse.success) {
				throw new Error('Failed to allocate time');
			}

			clearSession();
			toast.success('Clocked out and time allocated successfully');
			onConfirm();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Failed to complete clock out');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={true} onOpenChange={() => onCancel()}>
			<DialogContent className="max-w-[800px] w-full p-8 rounded-3xl bg-white border-none shadow-xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold text-[#1F1F1F] mb-1">Clock Out Summary</DialogTitle>
					<p className="text-gray-500 text-base">
						Review and allocate your time for this session. All time must be accounted for.
					</p>
				</DialogHeader>

				{/* Stats Cards */}
				<div className="grid grid-cols-3 gap-4 mt-6">
					<div className="bg-[#F8F9FB] rounded-xl p-6 text-center">
						<p className="text-gray-500 text-sm mb-1">Clock In</p>
						<p className="text-xl font-semibold text-[#1F1F1F]">{formatTimeForDisplay(startTime)}</p>
					</div>
					<div className="bg-[#F8F9FB] rounded-xl p-6 text-center">
						<p className="text-gray-500 text-sm mb-1">Clock Out</p>
						<p className="text-xl font-semibold text-[#1F1F1F]">{formatTimeForDisplay(endTime)}</p>
					</div>
					<div className="bg-[#EDEDED] rounded-xl p-6 text-center">
						<p className="text-gray-500 text-sm mb-1">Total Time</p>
						<p className="text-xl font-semibold text-[#1F1F1F]">{sessionDuration.toFixed(2)}h</p>
					</div>
				</div>

				{/* Allocation Bar */}
				<div className="mt-8">
					<div className="flex justify-between items-center mb-2">
						<span className="text-gray-500 text-sm">Time Allocation</span>
						<span
							className={`text-sm ${isOverAllocated ? 'text-red-500' : isFullyAllocated ? 'text-green-600' : 'text-[#F8285A]'}`}>
							{remainingDuration > 0
								? `${remainingDuration.toFixed(2)}h remaining to allocate`
								: isOverAllocated
									? `${Math.abs(remainingDuration).toFixed(2)}h over-allocated`
									: 'Fully allocated'}
						</span>
					</div>
					{/* Remaining Time Bar (Starts full, shrinks) */}
					<div className="h-2 bg-gray-100 rounded-full overflow-hidden flex mb-2">
						<div
							className={`h-full ${isOverAllocated ? 'bg-red-500' : 'bg-[#12B76A]'}`}
							style={{ width: `${Math.max((remainingDuration / sessionDuration) * 100, 0)}%` }}
						/>
					</div>

					<div className="flex justify-between mt-1 text-xs text-gray-400 mb-1">
						<span>Allocated: {allocatedDuration.toFixed(2)}h</span>
						<span>Total: {sessionDuration.toFixed(2)}h</span>
					</div>

					{/* Allocated Time Bar (Starts empty, grows) */}
					<div className="h-2 bg-gray-100 rounded-full overflow-hidden flex mb-2">
						<div
							className={`h-full ${isOverAllocated ? 'bg-red-500' : 'bg-[#12B76A]'}`}
							style={{ width: `${Math.min((allocatedDuration / sessionDuration) * 100, 100)}%` }}
						/>
					</div>

					<div className="flex justify-between mt-1 text-xs text-gray-400">
						<span>{formatTimeForDisplay(startTime)}</span>
						<span>{formatTimeForDisplay(endTime)}</span>
					</div>
				</div>

				{/* Task List */}
				<div className="mt-8">
					<h3 className="text-base font-medium text-[#1F1F1F] mb-4">Tasks Completed</h3>
					<div className="flex flex-col gap-3">
						{tasks.map((task, index) => (
							<div
								key={index}
								className="bg-white border boundary-gray-200 rounded-lg p-4 flex justify-between items-center">
								<span className="font-medium text-[#1F1F1F]">{task.name}</span>
								<div className="flex items-center gap-2">
									<span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-md">
										{task.startTime} - {task.endTime}
									</span>
									<button
										type="button"
										className="p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
										onClick={() => setTasks(tasks.filter((_, i) => i !== index))}>
										<IoTrashOutline className="w-5 h-5" />
									</button>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Add Another Task */}
				<div className="mt-6 border border-gray-200 rounded-xl p-6">
					<h3 className="text-base font-semibold text-[#666D80] mb-4">Add Another Task</h3>
					<div className="grid grid-cols-[2fr_1fr_1fr] gap-4 mb-4">
						<Input
							placeholder="Task name"
							className="bg-white h-[55px]"
							value={newTaskName}
							onChange={(e) => setNewTaskName(e.target.value)}
						/>
						<TimePicker placeholder="Start time" value={newTaskStart} onChange={setNewTaskStart} />
						<TimePicker placeholder="End time" value={newTaskEnd} onChange={setNewTaskEnd} />
					</div>
					<Textarea
						placeholder="Description (Optional)"
						className="bg-white mb-4 resize-none"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
					{validateNewTask && <p className="text-red-500 text-sm mb-3">{validateNewTask}</p>}
					<Button
						className="w-full bg-[#A855F7] hover:bg-[#9333EA] text-white py-6 text-base font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
						onClick={handleAddTask}
						disabled={!newTaskName || !newTaskStart || !newTaskEnd || !!validateNewTask}>
						+ Add Task
					</Button>
				</div>

				{/* Footer and Validation Messages */}
				<div className="mt-8 flex flex-col gap-4">
					{hasOverlaps && (
						<p className="text-red-500 text-sm">Error: Timeline contains overlapping tasks. Please adjust times.</p>
					)}
					{!isFullyAllocated && !isOverAllocated && tasks.length === 0 && (
						<p className="text-[#F8285A] text-sm">
							Add at least one task. {remainingDuration.toFixed(2)}h unallocated.
						</p>
					)}
					{!isFullyAllocated && !isOverAllocated && tasks.length > 0 && (
						<p className="text-[#F8285A] text-sm">
							{remainingDuration.toFixed(2)}h still unallocated. Add more tasks or adjust times.
						</p>
					)}
					{isOverAllocated && (
						<p className="text-red-500 text-sm">
							Error: Total time exceeds session duration by {Math.abs(remainingDuration).toFixed(2)}h.
						</p>
					)}

					<div className="flex justify-end gap-3 mt-4">
						<Button variant="outline" className="px-8 py-6 h-auto" onClick={onCancel}>
							Cancel
						</Button>
						<Button
							className="bg-[#F8285A] hover:bg-[#D4224C] text-white px-8 py-6 h-auto"
							disabled={tasks.length === 0 || hasOverlaps || isSubmitting}
							onClick={handleConfirmClockOut}>
							{isSubmitting ? 'Processing...' : 'Confirm Clock Out'}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ClockOutSummary;

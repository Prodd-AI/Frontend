import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { IoPlayOutline, IoStopOutline, IoPauseOutline, IoCheckmarkOutline } from 'react-icons/io5';
import { LuClock3 } from 'react-icons/lu';
import ClockOutSummary from '../clock-out-summary.component';
import { clockAction } from '@/config/services/time-tracking.service';
import useTimeTrackingStore from '@/config/stores/time-tracking.store';
import { toast } from 'sonner';

const TimeClockTab = () => {
	const { sessionData, setSession } = useTimeTrackingStore();

	// Derive state from session data
	const isClockedIn = sessionData !== null && sessionData.status !== 'ended';
	const isActive = sessionData?.status === 'active';

	const [seconds, setSeconds] = useState(0);
	const [isLoading, setIsLoading] = useState(false);

	// Initialize seconds from accumulated_seconds on mount or session change
	useEffect(() => {
		if (sessionData) {
			setSeconds(parseInt(sessionData.accumulated_seconds, 10) || 0);
		} else {
			setSeconds(0);
		}
	}, [sessionData]);

	// Timer effect
	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;

		if (isActive && isClockedIn) {
			interval = setInterval(() => {
				setSeconds((prev) => prev + 1);
			}, 1000);
		} else if (!isActive && interval) {
			clearInterval(interval);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [isActive, isClockedIn]);

	const formatTime = (totalSeconds: number) => {
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const secs = totalSeconds % 60;

		const pad = (num: number) => num.toString().padStart(2, '0');
		return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
	};

	const handleClockIn = async () => {
		setIsLoading(true);
		try {
			const response = await clockAction('clock_in');
			if (response.success) {
				setSession(response.data);
				setSessionStartTime(new Date(response.data.started_at));
				toast.success('Clocked in successfully');
			}
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Failed to clock in');
		} finally {
			setIsLoading(false);
		}
	};

	const handleClockOut = () => {
		setSessionEndTime(new Date());
		setShowSummary(true);
	};

	const handlePause = async () => {
		setIsLoading(true);
		try {
			const action = isActive ? 'pause' : 'resume';
			const response = await clockAction(action);
			if (response.success) {
				setSession(response.data);
				toast.success(isActive ? 'Timer paused' : 'Timer resumed');
			}
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Failed to update timer');
		} finally {
			setIsLoading(false);
		}
	};

	const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
	const [showSummary, setShowSummary] = useState(false);
	const [sessionEndTime, setSessionEndTime] = useState<Date | null>(null);

	// Sync sessionStartTime from store
	useEffect(() => {
		if (sessionData?.started_at) {
			setSessionStartTime(new Date(sessionData.started_at));
		}
	}, [sessionData?.started_at]);

	const handleConfirmClockOut = () => {
		// API calls are now handled in ClockOutSummary
		// This just cleans up local state after successful clock out
		setSeconds(0);
		setActiveTask(null);
		setCompletedTasks([]);
		setShowSummary(false);
		setSessionStartTime(null);
		setSessionEndTime(null);
	};

	const handleCancelClockOut = () => {
		setShowSummary(false);
		setSessionEndTime(null);
	};

	const [activeTask, setActiveTask] = useState<{ name: string; startTime: string } | null>(null);
	const [taskInput, setTaskInput] = useState('');

	const handleStartTask = () => {
		if (!taskInput.trim()) return;
		const now = new Date();
		setActiveTask({
			name: taskInput,
			startTime: now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }),
		});
		setTaskInput('');
	};

	const [completedTasks, setCompletedTasks] = useState<{ name: string; startTime: string; endTime: string }[]>([]);

	const handleCompleteTask = () => {
		if (!activeTask) return;
		const now = new Date();
		const endTime = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
		setCompletedTasks((prev) => [{ ...activeTask, endTime }, ...prev]);
		setActiveTask(null);
	};

	return (
		<div className="flex flex-col gap-6">
			{/* Timer Card */}
			<div className="bg-white p-6 rounded-3xl w-full">
				<div className="flex items-center gap-2 mb-2">
					<LuClock3 className="w-6 h-6 text-primary" />
					<h2 className="text-xl font-semibold text-[#1F1F1F]">Time-Clock</h2>
				</div>
				<p className="text-gray-400 text-sm mb-8">
					{!isClockedIn
						? 'Clock in to start tracking your time'
						: `Clocked in at ${sessionStartTime?.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}`}
				</p>

				<div className="flex flex-col items-center justify-center py-8">
					<div className="text-6xl font-mono font-medium tracking-[-0.015em] text-[#1F1F1F] mb-8">
						{formatTime(seconds)}
					</div>

					{!isClockedIn ? (
						<Button
							variant="gradient"
							onClick={handleClockIn}
							disabled={isLoading}
							className="hover:bg-[#4a2bc2] text-white !px-12 py-6 rounded-lg font-semibold flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-purple-200">
							<IoPlayOutline className="w-5 h-5" /> {isLoading ? 'Clocking In...' : 'Clock In'}
						</Button>
					) : (
						<div className="flex items-center gap-4">
							<Button
								variant="outline"
								onClick={handlePause}
								disabled={isLoading}
								className={`
                  ${isActive ? 'bg-[#EF8913] hover:bg-[#EF8913]/90' : 'bg-green-500 hover:bg-green-600'} 
                  text-white border-none !px-8 py-6 rounded-lg font-semibold flex items-center gap-2 transition-transform active:scale-95 
                  ${isActive ? 'shadow-lg shadow-orange-200' : 'shadow-lg shadow-green-200'}
                `}>
								{isActive ? (
									<>
										<IoPauseOutline className="w-5 h-5" /> {isLoading ? '...' : 'Pause'}
									</>
								) : (
									<>
										<IoPlayOutline className="w-5 h-5" /> {isLoading ? '...' : 'Resume'}
									</>
								)}
							</Button>
							<Button
								variant="outline"
								onClick={handleClockOut}
								disabled={isLoading}
								className="bg-[#F8285A] hover:bg-[#F8285A]/90 text-white border-none !px-8 py-6 rounded-lg font-semibold flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-red-200">
								<IoStopOutline className="w-5 h-5" /> Clock Out
							</Button>
						</div>
					)}
				</div>
			</div>

			{/* Current Task Card - Only visible when clocked in */}
			{isClockedIn && (
				<div className="bg-white p-6 rounded-3xl w-full">
					<div className="mb-6">
						<h3 className="text-lg font-medium text-[#1F1F1F] mb-1">Current Task (Optional)</h3>
						<p className="text-sm text-gray-500">Track what you are working on right now</p>
					</div>

					{!activeTask ? (
						<>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
								<Select onValueChange={setTaskInput}>
									<SelectTrigger className="w-full h-[52px] rounded-lg border-gray-200 bg-white">
										<SelectValue placeholder="Select from task list..." />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Design System Update">Design System Update</SelectItem>
										<SelectItem value="Frontend Integration">Frontend Integration</SelectItem>
										<SelectItem value="Bug Fixes">Bug Fixes</SelectItem>
									</SelectContent>
								</Select>

								<Input
									placeholder="Or enter task name manually"
									className="h-[52px] rounded-lg border-gray-200 bg-white"
									value={taskInput}
									onChange={(e) => setTaskInput(e.target.value)}
								/>
							</div>

							<Input
								placeholder="Add some notes if you wish"
								className="h-[52px] rounded-lg border-gray-200 bg-white mb-6"
							/>

							<Button
								className="w-full h-[52px] bg-[#A855F7] hover:bg-[#9333EA] text-white rounded-lg font-medium text-base"
								onClick={handleStartTask}>
								+ Start Task
							</Button>
						</>
					) : (
						<div className="bg-[#ECFDF3] border border-[#A6EBC4] rounded-xl p-4 flex justify-between items-center">
							<div>
								<h4 className="text-[#344054] font-medium text-base mb-1">{activeTask.name}</h4>
								<span className="text-[#667085] text-sm">Started: {activeTask.startTime}</span>
							</div>
							<Button
								className="bg-[#12B76A] hover:bg-[#039855] text-white rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2"
								onClick={handleCompleteTask}>
								<IoCheckmarkOutline className="w-4 h-4" /> Complete
							</Button>
						</div>
					)}
					{completedTasks.length > 0 && (
						<div className="mt-8 border-t border-gray-100 pt-6">
							<h4 className="text-sm font-medium text-gray-500 mb-4">Completed this session:</h4>
							<div className="flex flex-col gap-3">
								{completedTasks.map((task, index) => (
									<div key={index} className="bg-[#ECFDF3]/50 rounded-lg p-3 flex justify-between items-center">
										<span className="text-sm font-medium text-[#344054]">{task.name}</span>
										<div className="px-3 py-1 rounded-full bg-white border border-[#A6EBC4] text-xs font-medium text-[#117B54]">
											{task.startTime} - {task.endTime}
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			)}

			{showSummary && sessionStartTime && sessionEndTime && sessionData && (
				<ClockOutSummary
					startTime={sessionStartTime}
					endTime={sessionEndTime}
					elapsedSeconds={seconds}
					initialTasks={completedTasks}
					sessionId={sessionData.id}
					onCancel={handleCancelClockOut}
					onConfirm={handleConfirmClockOut}
				/>
			)}
		</div>
	);
};

export default TimeClockTab;

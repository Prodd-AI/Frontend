import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { clockAction, ClockAction, isSessionEnded } from '@/config/services/time-tracking.service';
import useTimeTrackingStore from '@/config/stores/time-tracking.store';

// Shared pause/resume/clock-in/clock-out wiring. Both the timer card and the
// My Sessions list call into this so the store and the my-sessions query stay
// in sync no matter which surface triggered the action.
export function useTimeClockActions() {
	const { setSession, clearSession } = useTimeTrackingStore();
	const queryClient = useQueryClient();
	const [isLoading, setIsLoading] = useState(false);

	const run = useCallback(
		async (action: ClockAction, labels: { success: string; failure: string }) => {
			setIsLoading(true);
			try {
				const res = await clockAction(action);
				if (res.success) {
					// Treat any terminal status (ended/completed) as a clear, regardless
					// of which action returned it — keeps the store from latching onto
					// a finished session.
					if (action === 'clock_out' || isSessionEnded(res.data.status)) {
						clearSession();
					} else {
						setSession(res.data);
					}
					toast.success(labels.success);
					queryClient.invalidateQueries({ queryKey: ['my-sessions'] });
					queryClient.invalidateQueries({ queryKey: ['active-time-session'] });
				}
				return res;
			} catch (error) {
				toast.error(error instanceof Error ? error.message : labels.failure);
				throw error;
			} finally {
				setIsLoading(false);
			}
		},
		[setSession, clearSession, queryClient],
	);

	return {
		isLoading,
		clockIn: () => run('clock_in', { success: 'Clocked in successfully', failure: 'Failed to clock in' }),
		pause: () => run('pause', { success: 'Timer paused', failure: 'Failed to pause timer' }),
		resume: () => run('resume', { success: 'Timer resumed', failure: 'Failed to resume timer' }),
		clockOut: () => run('clock_out', { success: 'Clocked out', failure: 'Failed to clock out' }),
	};
}

export default useTimeClockActions;

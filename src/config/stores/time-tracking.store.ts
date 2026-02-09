import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TimeTrackingSession } from '@/config/services/time-tracking.service';

interface TimeTrackingState {
	sessionId: string | null;
	sessionData: TimeTrackingSession | null;

	// Actions
	setSession: (data: TimeTrackingSession) => void;
	clearSession: () => void;
}

const useTimeTrackingStore = create<TimeTrackingState>()(
	persist(
		(set) => ({
			sessionId: null,
			sessionData: null,

			setSession: (data) =>
				set({
					sessionId: data.id,
					sessionData: data,
				}),

			clearSession: () =>
				set({
					sessionId: null,
					sessionData: null,
				}),
		}),
		{
			name: 'time-tracking-storage',
		},
	),
);

export default useTimeTrackingStore;

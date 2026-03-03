import { SERVER_URL } from '@/shared/utils/constants';
import { ApiService } from './root.service';

// Types
export type ClockAction = 'clock_in' | 'pause' | 'resume' | 'clock_out';

export interface TimeTrackingSession {
	id: string;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
	user_id: string;
	started_at: string;
	ended_at: string | null;
	accumulated_seconds: string;
	status: 'active' | 'paused' | 'ended';
	last_action_at: string;
}

export interface ClockActionResponse {
	message: string;
	data: TimeTrackingSession;
	timestamp: string;
	success: boolean;
}

// Allocation types
export interface TaskAllocation {
	description: string;
	duration_hours: number;
	start_time: string;
	end_time: string;
}

export interface AllocateTimeRequest {
	session_id: string;
	allocations: TaskAllocation[];
}

export interface AllocateTimeResponse {
	message: string;
	success: boolean;
	timestamp: string;
}

// Weekly Summary types
export interface ChartDataPoint {
	day: string;
	value: number;
}

export interface WeeklySummaryData {
	total_hours: number;
	daily_avg: string;
	total_entries: number;
	chart_data: ChartDataPoint[];
}

export interface WeeklySummaryResponse {
	message: string;
	data: WeeklySummaryData;
	timestamp: string;
	success: boolean;
}

// Team entries (time entries grouped by team and member)
export interface TeamEntryMember {
	user_id: string;
	full_name: string;
	role: string;
	entries_count: number;
	total_hours: number;
}

export interface TeamEntryTeam {
	team_id: string;
	team_name: string;
	member_count: number;
	total_entries: number;
	total_hours: number;
	members: TeamEntryMember[];
}

export interface TeamEntriesResponse {
	message?: string;
	data: TeamEntryTeam[];
	timestamp?: string;
	success?: boolean;
}

// Service
const timeTrackingService = new ApiService(`${SERVER_URL}time-tracking`);

/**
 * Perform a clock action (clock_in, pause, resume, clock_out)
 */
const clockAction = (action: ClockAction) => {
	return timeTrackingService.post<ClockActionResponse, { action: ClockAction }>('clock', { action }, true);
};

/**
 * Allocate time to tasks after clocking out
 */
const allocateTime = (sessionId: string, allocations: TaskAllocation[]) => {
	return timeTrackingService.post<AllocateTimeResponse, AllocateTimeRequest>(
		'allocate',
		{ session_id: sessionId, allocations },
		true,
	);
};

/**
 * Get weekly time tracking summary
 */
const getWeeklySummary = () => {
	return timeTrackingService.get<WeeklySummaryResponse>('weekly-summary', undefined, true);
};

/**
 * Get detailed time entries grouped by team and member
 */
const getTeamEntries = () => {
	return timeTrackingService.get<TeamEntriesResponse>('team-entries', undefined, true);
};

export { clockAction, allocateTime, getWeeklySummary, getTeamEntries };

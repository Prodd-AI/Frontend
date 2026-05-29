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

// Time entries returned by /time-tracking/my-entries. Backend response shape
// isn't documented but we observed { task_id, title, description,
// duration_hours, start_time, end_time, date/created_at } in practice. The
// fields below cover both old and new shapes so the UI is tolerant.
export interface TimeEntry {
	id: string;
	task_id?: string | null;
	title?: string;
	description?: string;
	duration_hours?: number;
	start_time?: string;
	end_time?: string;
	date?: string;
	created_at?: string;
}

export interface MyTimeEntriesResponse {
	message?: string;
	data: TimeEntry[];
	timestamp?: string;
	success?: boolean;
}

const getMyEntries = (params: { duration: 'day' | 'week' | 'month' }) => {
	return timeTrackingService.get<MyTimeEntriesResponse>('my-entries', params, true);
};

/**
 * Get the current user's active (in-progress) time tracking session so the
 * timer can be rehydrated after a refresh / on a new device. The docs don't
 * explicitly list this route — we probe `/time-tracking/active` and the
 * useActiveTimeSession hook silently ignores 404s so this stays safe whether
 * or not the backend has shipped it.
 */
const getActiveSession = () => {
	return timeTrackingService.get<{
		message?: string;
		data: TimeTrackingSession | null;
	}>('active', undefined, true);
};

// /time-tracking/my-sessions — paginated list of every session belonging to
// the current user. Includes active, paused, and ended sessions; backend
// returns `meta` with page/limit/total/total_pages.
export interface PaginationMeta {
	page: number;
	limit: number;
	total: number;
	total_pages: number;
}

export interface MySessionsResponse {
	message?: string;
	data: TimeTrackingSession[];
	meta?: PaginationMeta;
	timestamp?: string;
	success?: boolean;
}

export interface MySessionsParams {
	page?: number;
	limit?: number;
	status?: 'active' | 'paused' | 'ended';
}

const getMySessions = (params?: MySessionsParams) => {
	const query: Record<string, string> = {};
	if (params?.page !== undefined) query.page = String(params.page);
	if (params?.limit !== undefined) query.limit = String(params.limit);
	if (params?.status) query.status = params.status;
	return timeTrackingService.get<MySessionsResponse>(
		'my-sessions',
		Object.keys(query).length ? query : undefined,
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

export {
	clockAction,
	allocateTime,
	getActiveSession,
	getMySessions,
	getMyEntries,
	getWeeklySummary,
	getTeamEntries,
};

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, History, ChevronLeft, ChevronRight } from 'lucide-react';
import { IoPauseOutline, IoPlayOutline, IoStopOutline } from 'react-icons/io5';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
	getMySessions,
	isSessionEnded,
	TimeTrackingSession,
} from '@/config/services/time-tracking.service';
import useTimeTrackingStore from '@/config/stores/time-tracking.store';
import useTimeClockActions from '@/shared/hooks/use-time-clock-actions';
import { parseWallClockIso } from '@/shared/utils/date.utils';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 5;

interface MySessionsListProps {
	onRequestClockOut?: () => void;
}

const formatDuration = (totalSeconds: number) => {
	if (totalSeconds <= 0) return '0m';
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;
	if (hours > 0) return `${hours}h ${minutes}m`;
	if (minutes > 0) return `${minutes}m ${seconds}s`;
	return `${seconds}s`;
};

const formatDateTime = (iso: string | null) => {
	if (!iso) return '—';
	const d = parseWallClockIso(iso);
	if (Number.isNaN(d.getTime())) return '—';
	return d.toLocaleString([], {
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
	});
};

// Live elapsed time for an active row — paused sessions are static, active
// ones tick. We don't store this; it's recomputed on each render so the
// header / store updates push through without ceremony.
const computeElapsed = (session: TimeTrackingSession): number => {
	const accumulated = parseInt(session.accumulated_seconds, 10) || 0;
	if (session.status === 'active' && session.last_action_at) {
		const last = new Date(session.last_action_at).getTime();
		return accumulated + Math.max(0, Math.floor((Date.now() - last) / 1000));
	}
	return accumulated;
};

const statusStyles: Record<TimeTrackingSession['status'], string> = {
	active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
	paused: 'bg-amber-100 text-amber-700 border-amber-200',
	ended: 'bg-gray-100 text-gray-500 border-gray-200',
	completed: 'bg-gray-100 text-gray-500 border-gray-200',
};

const statusLabels: Record<TimeTrackingSession['status'], string> = {
	active: 'Active',
	paused: 'Paused',
	ended: 'Completed',
	completed: 'Completed',
};

const SessionRow = ({
	session,
	isCurrent,
	onRequestClockOut,
}: {
	session: TimeTrackingSession;
	isCurrent: boolean;
	onRequestClockOut?: () => void;
}) => {
	const { pause, resume, isLoading } = useTimeClockActions();
	const elapsed = computeElapsed(session);
	const isActive = session.status === 'active';
	const isEnded = isSessionEnded(session.status);

	return (
		<div
			className={cn(
				'flex flex-col gap-3 rounded-2xl border p-4 transition-colors md:flex-row md:items-center md:justify-between',
				isCurrent ? 'border-[#6619DE]/40 bg-[#F8F3FF]' : 'border-gray-200 bg-white',
			)}>
			<div className="flex flex-1 flex-col gap-1 min-w-0">
				<div className="flex flex-wrap items-center gap-2">
					<span className="text-sm font-semibold text-[#251F2D]">
						{formatDateTime(session.started_at)}
					</span>
					<Badge
						variant="outline"
						className={cn(
							'rounded-full border px-2 py-0.5 text-[11px] font-medium',
							statusStyles[session.status],
						)}>
						{statusLabels[session.status]}
					</Badge>
					{isCurrent && (
						<Badge
							variant="outline"
							className="rounded-full border-[#6619DE]/30 bg-white px-2 py-0.5 text-[11px] font-semibold text-[#6619DE]">
							Current
						</Badge>
					)}
				</div>
				<p className="text-xs text-gray-500">
					{isEnded ? (
						<>Ended {formatDateTime(session.ended_at)} · </>
					) : (
						<>Started {formatDateTime(session.started_at)} · </>
					)}
					<span className="font-medium text-gray-700">{formatDuration(elapsed)} tracked</span>
				</p>
			</div>

			{isCurrent && !isEnded && (
				<div className="flex items-center gap-2">
					{isActive ? (
						<Button
							size="sm"
							variant="outline"
							onClick={pause}
							disabled={isLoading}
							className="h-9 gap-1.5 border-amber-200 bg-amber-50 px-3 text-xs font-semibold text-amber-700 hover:bg-amber-100">
							<IoPauseOutline className="h-4 w-4" />
							{isLoading ? '…' : 'Pause'}
						</Button>
					) : (
						<Button
							size="sm"
							variant="outline"
							onClick={resume}
							disabled={isLoading}
							className="h-9 gap-1.5 border-emerald-200 bg-emerald-50 px-3 text-xs font-semibold text-emerald-700 hover:bg-emerald-100">
							<IoPlayOutline className="h-4 w-4" />
							{isLoading ? '…' : 'Resume'}
						</Button>
					)}
					{onRequestClockOut && (
						<Button
							size="sm"
							variant="outline"
							onClick={onRequestClockOut}
							disabled={isLoading}
							className="h-9 gap-1.5 border-rose-200 bg-rose-50 px-3 text-xs font-semibold text-rose-700 hover:bg-rose-100">
							<IoStopOutline className="h-4 w-4" />
							Clock Out
						</Button>
					)}
				</div>
			)}
		</div>
	);
};

const MySessionsList = ({ onRequestClockOut }: MySessionsListProps) => {
	const [page, setPage] = useState(1);
	const { sessionData } = useTimeTrackingStore();

	const { data, isLoading, isError } = useQuery({
		queryKey: ['my-sessions', { page, limit: PAGE_SIZE }],
		queryFn: () => getMySessions({ page, limit: PAGE_SIZE }),
		// Active sessions tick every second so a 1-min stale window is plenty —
		// we don't want to refetch on every component re-render.
		staleTime: 60_000,
		refetchOnWindowFocus: false,
	});

	const sessions = data?.data ?? [];
	const meta = data?.meta;
	const totalPages = meta?.total_pages ?? 1;

	return (
		<div className="w-full rounded-3xl border border-gray-200 bg-white p-6">
			<div className="mb-6 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<History className="h-5 w-5 text-primary" />
					<h2 className="text-lg font-semibold text-[#1F1F1F]">My Sessions</h2>
				</div>
				{meta && (
					<Badge
						variant="secondary"
						className="bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100">
						{meta.total} total
					</Badge>
				)}
			</div>

			{isLoading ? (
				<div className="flex items-center justify-center py-12 text-gray-400">
					<Loader2 className="mr-2 animate-spin" size={18} />
					Loading sessions…
				</div>
			) : isError ? (
				<p className="py-12 text-center text-sm text-red-500">
					Could not load your sessions.
				</p>
			) : sessions.length === 0 ? (
				<p className="py-12 text-center text-sm text-gray-400">
					No sessions yet. Clock in above to start your first one.
				</p>
			) : (
				<>
					<div className="flex flex-col gap-3">
						{sessions.map((session) => (
							<SessionRow
								key={session.id}
								session={session}
								isCurrent={sessionData?.id === session.id}
								onRequestClockOut={
									sessionData?.id === session.id ? onRequestClockOut : undefined
								}
							/>
						))}
					</div>

					{totalPages > 1 && (
						<div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
							<span className="text-xs text-gray-500">
								Page {meta?.page ?? page} of {totalPages}
							</span>
							<div className="flex items-center gap-2">
								<Button
									size="sm"
									variant="outline"
									onClick={() => setPage((p) => Math.max(1, p - 1))}
									disabled={page <= 1}
									className="h-8 gap-1 px-3 text-xs">
									<ChevronLeft className="h-3.5 w-3.5" /> Prev
								</Button>
								<Button
									size="sm"
									variant="outline"
									onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
									disabled={page >= totalPages}
									className="h-8 gap-1 px-3 text-xs">
									Next <ChevronRight className="h-3.5 w-3.5" />
								</Button>
							</div>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default MySessionsList;

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import {
	IoPauseOutline,
	IoPlayOutline,
	IoStopOutline,
	IoOpenOutline,
} from 'react-icons/io5';
import useTimeTrackingStore from '@/config/stores/time-tracking.store';
import useTimeClockActions from '@/shared/hooks/use-time-clock-actions';

// Document Picture-in-Picture API typings — TypeScript's lib.dom doesn't
// ship them yet. Behaviour: requestWindow() returns a Window whose lifecycle
// is owned by the user agent's PiP container; it stays above other windows
// and the host page can render into it like any other Window.document.
declare global {
	interface Window {
		documentPictureInPicture?: {
			requestWindow(options?: {
				width?: number;
				height?: number;
				disallowReturnToOpener?: boolean;
				preferInitialWindowPlacement?: boolean;
			}): Promise<Window>;
			window: Window | null;
		};
	}
}

const PIP_WIDTH = 320;
const PIP_HEIGHT = 220;

// Mirror the host document's stylesheets into the PiP document so Tailwind
// classes resolve inside the popped-out window. Both <style> and <link
// rel="stylesheet"> nodes are cloned — covers Vite's dev injection and
// production bundles. Catches re-entry by tagging cloned nodes.
const cloneStylesIntoPip = (pipDoc: Document) => {
	const tag = 'data-pip-clone';
	pipDoc.querySelectorAll(`[${tag}]`).forEach((el) => el.remove());
	document.querySelectorAll('style, link[rel="stylesheet"]').forEach((node) => {
		const clone = node.cloneNode(true) as HTMLElement;
		clone.setAttribute(tag, 'true');
		pipDoc.head.appendChild(clone);
	});
};

const formatTime = (totalSeconds: number) => {
	const h = Math.floor(totalSeconds / 3600);
	const m = Math.floor((totalSeconds % 3600) / 60);
	const s = totalSeconds % 60;
	const pad = (n: number) => n.toString().padStart(2, '0');
	return `${pad(h)}:${pad(m)}:${pad(s)}`;
};

// Live-elapsed counter that ticks each second when the session is active.
// Reads from the store so external pause/resume actions stay in sync with
// the PiP UI without prop wiring.
const useLiveElapsed = () => {
	const { sessionData } = useTimeTrackingStore();
	const [seconds, setSeconds] = useState(0);

	useEffect(() => {
		if (!sessionData) {
			setSeconds(0);
			return;
		}
		const compute = () => {
			const accumulated = parseInt(sessionData.accumulated_seconds, 10) || 0;
			if (sessionData.status === 'active' && sessionData.last_action_at) {
				const delta = Math.floor(
					(Date.now() - new Date(sessionData.last_action_at).getTime()) / 1000,
				);
				setSeconds(accumulated + Math.max(0, delta));
			} else {
				setSeconds(accumulated);
			}
		};
		compute();
		const id = setInterval(compute, 1000);
		return () => clearInterval(id);
	}, [sessionData]);

	return seconds;
};

interface FloatingTimerContentProps {
	onRequestClose: () => void;
}

const FloatingTimerContent = ({ onRequestClose }: FloatingTimerContentProps) => {
	const { sessionData } = useTimeTrackingStore();
	const { pause, resume, clockOut, isLoading } = useTimeClockActions();
	const seconds = useLiveElapsed();

	const isActive = sessionData?.status === 'active';

	const handlePauseResume = async () => {
		try {
			await (isActive ? pause() : resume());
		} catch {
			// hook toasts already
		}
	};

	const handleClockOut = async () => {
		try {
			await clockOut();
			onRequestClose();
		} catch {
			// hook toasts already
		}
	};

	if (!sessionData) {
		return (
			<div className="flex h-full w-full items-center justify-center bg-white text-sm text-gray-500">
				No active session
			</div>
		);
	}

	return (
		<div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-white p-4 font-sans">
			<div className="flex w-full items-center justify-between">
				<span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
					{isActive ? 'Tracking' : 'Paused'}
				</span>
				<span
					className={`size-2 rounded-full ${
						isActive ? 'animate-pulse bg-emerald-500' : 'bg-amber-500'
					}`}
				/>
			</div>

			<div className="font-mono text-4xl font-semibold tracking-tight text-[#1F1F1F]">
				{formatTime(seconds)}
			</div>

			<div className="flex w-full items-center gap-2">
				<button
					type="button"
					onClick={handlePauseResume}
					disabled={isLoading}
					className={`flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50 ${
						isActive
							? 'bg-[#EF8913] hover:bg-[#d97a0d]'
							: 'bg-emerald-500 hover:bg-emerald-600'
					}`}>
					{isActive ? <IoPauseOutline className="size-4" /> : <IoPlayOutline className="size-4" />}
					{isLoading ? '…' : isActive ? 'Pause' : 'Resume'}
				</button>
				<button
					type="button"
					onClick={handleClockOut}
					disabled={isLoading}
					className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#F8285A] text-sm font-semibold text-white transition-colors hover:bg-[#d4214c] disabled:opacity-50">
					<IoStopOutline className="size-4" />
					Clock Out
				</button>
			</div>

			<p className="text-[10px] text-gray-400 text-center">
				Clocking out here won't open the allocation form — you can allocate later from My Sessions.
			</p>
		</div>
	);
};

// Public hook — exposes openFloatingTimer + isOpen so the parent can show
// a toggle button. Manages a single PiP window and tears down listeners on
// close. Falls back to a toast on unsupported browsers.
export function useFloatingTimer() {
	const [pipWindow, setPipWindow] = useState<Window | null>(null);
	const closingRef = useRef(false);

	const closePip = useCallback(() => {
		if (closingRef.current) return;
		closingRef.current = true;
		const w = pipWindow;
		setPipWindow(null);
		if (w && !w.closed) {
			try {
				w.close();
			} catch {
				// noop — user may have closed it already
			}
		}
		closingRef.current = false;
	}, [pipWindow]);

	const openFloatingTimer = useCallback(async () => {
		if (pipWindow) return;
		if (typeof window === 'undefined' || !window.documentPictureInPicture) {
			toast.error(
				'Floating timer isn\'t supported in this browser. Try the latest Chrome or Edge.',
			);
			return;
		}
		try {
			const win = await window.documentPictureInPicture.requestWindow({
				width: PIP_WIDTH,
				height: PIP_HEIGHT,
				disallowReturnToOpener: false,
			});
			cloneStylesIntoPip(win.document);
			win.document.body.style.margin = '0';
			win.document.body.style.background = '#fff';
			win.document.title = 'Time tracker';
			win.addEventListener('pagehide', () => {
				setPipWindow(null);
			});
			setPipWindow(win);
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : 'Could not open the floating timer',
			);
		}
	}, [pipWindow]);

	// Re-clone styles whenever the host's stylesheets change (Vite HMR can
	// add/remove <style> nodes during dev). MutationObserver on <head>.
	useEffect(() => {
		if (!pipWindow) return;
		const observer = new MutationObserver(() => cloneStylesIntoPip(pipWindow.document));
		observer.observe(document.head, { childList: true, subtree: true });
		return () => observer.disconnect();
	}, [pipWindow]);

	const portal = pipWindow
		? createPortal(<FloatingTimerContent onRequestClose={closePip} />, pipWindow.document.body)
		: null;

	return {
		openFloatingTimer,
		closeFloatingTimer: closePip,
		isFloatingTimerOpen: pipWindow !== null,
		isFloatingTimerSupported:
			typeof window !== 'undefined' && 'documentPictureInPicture' in window,
		FloatingTimerPortal: portal,
	};
}

// Re-export the icon so consumers can put it on their toggle button without
// pulling react-icons themselves.
export { IoOpenOutline as FloatingTimerIcon };

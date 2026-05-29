import { useCallback, useEffect } from "react";
import useAuthStore from "@/config/stores/auth.store";
import useGuidedTourStore from "./guided-tour.store";
import { hasSeenTour } from "./guided-tour.storage";
import type { TourId, TourStep } from "./guided-tour.types";

interface UseGuidedTourReturn {
  startTour: () => void;
}

/**
 * Auto-starts the tour the first time the user lands on the dashboard home,
 * and exposes a manual `startTour` for the replay button. Tour rendering lives
 * in the screen layout so it survives route changes.
 */
export function useGuidedTour(
  tourId: TourId,
  steps: TourStep[],
): UseGuidedTourReturn {
  const userId = useAuthStore((s) => s.user?.user.id);
  const start = useGuidedTourStore((s) => s.startTour);
  const activeTourId = useGuidedTourStore((s) => s.tourId);

  useEffect(() => {
    if (!userId) return;
    if (activeTourId) return; // tour already running
    if (hasSeenTour(userId, tourId)) return;
    const t = window.setTimeout(() => start(tourId, steps), 400);
    return () => window.clearTimeout(t);
    // steps reference is stable per-module so excluding it is safe.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, tourId, start, activeTourId]);

  const startTour = useCallback(
    () => start(tourId, steps),
    [start, tourId, steps],
  );

  return { startTour };
}

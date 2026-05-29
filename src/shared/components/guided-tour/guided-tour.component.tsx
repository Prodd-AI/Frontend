import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Joyride,
  ACTIONS,
  EVENTS,
  STATUS,
  type EventData,
} from "react-joyride";
import useAuthStore from "@/config/stores/auth.store";
import useGuidedTourStore from "./guided-tour.store";
import { markTourSeen } from "./guided-tour.storage";
import { joyrideOptions, joyrideStyles } from "./guided-tour.theme";
import type { TourStepData } from "./guided-tour.types";

/**
 * Mirrors the canonical react-joyride multi-route demo:
 * https://github.com/gilbarbara/react-joyride/blob/main/website/src/app/demos/multi-route
 *
 * Joyride runs uncontrolled. On STEP_AFTER we read `step.data.next` /
 * `step.data.previous` to navigate. Joyride's `targetWaitTimeout` waits for
 * the new page's target to appear in the DOM before positioning the tooltip.
 */
export default function GuidedTour() {
  const { run, steps, tourId, stopTour } = useGuidedTourStore();
  const userId = useAuthStore((s) => s.user?.user.id);
  const navigate = useNavigate();

  const finish = useCallback(() => {
    if (userId && tourId) markTourSeen(userId, tourId);
    stopTour();
  }, [userId, tourId, stopTour]);

  const onEvent = useCallback(
    (data: EventData) => {
      const { action, status, step, type } = data;

      if (
        status === STATUS.FINISHED ||
        status === STATUS.SKIPPED ||
        action === ACTIONS.CLOSE
      ) {
        finish();
        return;
      }

      if (type === EVENTS.STEP_AFTER) {
        const routes = (step.data ?? {}) as TourStepData;
        const isPrevious = action === ACTIONS.PREV;
        const route = isPrevious ? routes.previous : routes.next;
        if (route) navigate(route);
      }
    },
    [navigate, finish],
  );

  if (!run || steps.length === 0) return null;

  return (
    <Joyride
      run={run}
      steps={steps}
      onEvent={onEvent}
      continuous
      scrollToFirstStep
      options={{
        ...joyrideOptions,
        showProgress: true,
        skipBeacon: true,
        buttons: ["back", "skip", "primary"],
        overlayClickAction: false,
        scrollOffset: 96,
        targetWaitTimeout: 5000,
      }}
      styles={joyrideStyles}
      locale={{
        back: "Back",
        next: "Next",
        last: "Done",
        skip: "Skip tour",
        close: "Close",
      }}
    />
  );
}

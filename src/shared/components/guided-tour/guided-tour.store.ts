import { create } from "zustand";
import type { TourId, TourStep } from "./guided-tour.types";

interface GuidedTourState {
  tourId: TourId | null;
  steps: TourStep[];
  run: boolean;
  startTour: (tourId: TourId, steps: TourStep[]) => void;
  stopTour: () => void;
}

const useGuidedTourStore = create<GuidedTourState>((set) => ({
  tourId: null,
  steps: [],
  run: false,
  startTour: (tourId, steps) => set({ tourId, steps, run: true }),
  stopTour: () => set({ run: false, tourId: null, steps: [] }),
}));

export default useGuidedTourStore;

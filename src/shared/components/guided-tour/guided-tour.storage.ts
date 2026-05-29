import type { TourId } from "./guided-tour.types";

const key = (userId: string, tourId: TourId) =>
  `guided-tour:seen:${userId}:${tourId}`;

export const hasSeenTour = (userId: string, tourId: TourId): boolean => {
  try {
    return localStorage.getItem(key(userId, tourId)) === "1";
  } catch {
    return true;
  }
};

export const markTourSeen = (userId: string, tourId: TourId) => {
  try {
    localStorage.setItem(key(userId, tourId), "1");
  } catch {
    // localStorage unavailable — ignore silently.
  }
};

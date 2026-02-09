/**
 * @fileoverview Example usage of MoodTrends component
 *
 * This file demonstrates how to use the MoodTrends component with sample data.
 * Use this as a reference when implementing the component in your application.
 */

import MoodTrends from "./mood-trend.component";
import type { MoodEntry } from "@/shared/typings/mood-trend";

/**
 * Sample mood entries data
 */
const sampleMoodEntries: MoodEntry[] = [
  {
    id: "1",
    mood: "good",
    title: "Good weekend prep",
    date: "Saturday, January 6",
  },
  {
    id: "2",
    mood: "okay",
    title: "Busy day but manageable",
    date: "Friday, January 5",
  },
  {
    id: "3",
    mood: "notGreat",
    title: "Feeling overwhelmed",
    date: "Thursday, January 4",
  },
  {
    id: "4",
    mood: "great",
    title: "Finished big project!",
    date: "Wednesday, January 3",
  },
];

/**
 * Example usage component
 */
export default function MoodTrendsExample() {
  return (
    <MoodTrends
      moodEntries={sampleMoodEntries}
      averageMood="good"
      periodLabel="Last 7 days"
    />
  );
}

/**
 * @fileoverview Example usage of TodaysFocus component
 *
 * This file demonstrates how to use the TodaysFocus component with sample data.
 * Use this as a reference when implementing the component in your application.
 */

import TodaysFocus from "./todays-focus.component";
import type { FocusInfoCard } from "@/shared/typings/todays-focus";

/**
 * Sample info cards data
 */
const sampleInfoCards: FocusInfoCard[] = [
  {
    icon: "break",
    title: "Recommended Break",
    description: "Take a 15-minute walk at 2:30 PM",
  },
  {
    icon: "energy",
    title: "Energy Level",
    description: "Peak hours: 9-11 AM & 2-4 PM",
  },
];

/**
 * Example usage component
 */
export default function TodaysFocusExample() {
  return (
    <TodaysFocus
      primaryGoalTitle="Primary Goal"
      primaryGoalDescription="Complete Q1 performance review and prepare talking points for 1:1 meeting"
      infoCards={sampleInfoCards}
    />
  );
}

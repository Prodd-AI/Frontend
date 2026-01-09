/**
 * @fileoverview Mood Trends Component
 *
 * Displays a list of recent mood entries with average mood tracking.
 * Shows mood history with emojis, descriptions, and dates.
 */

import { memo } from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  MoodTrendsProps,
  MoodType,
  MoodEntry,
} from "@/shared/typings/mood-trend";
import { MOOD_EMOJIS } from "../utils/constants";

/**
 * Label mapping for mood types
 */
const MOOD_LABELS: Record<MoodType, string> = {
  great: "Great",
  good: "Good",
  okay: "Okay",
  notGreat: "Not Great",
  rough: "Rough",
};

/**
 * Background colors for mood badges
 */
const MOOD_BADGE_BG: Record<MoodType, string> = {
  great: "bg-[#e6f4e9]",
  good: "bg-[#e6f4e9]",
  okay: "bg-[#f3f4f6]",
  notGreat: "bg-[#fff3f3]",
  rough: "bg-[#fff3f3]",
};

/**
 * Mood Entry Card Component
 */
const MoodEntryCard = memo(({ entry }: { entry: MoodEntry }) => {
  const emoji = MOOD_EMOJIS[entry.mood];
  const label = MOOD_LABELS[entry.mood];
  const badgeBg = MOOD_BADGE_BG[entry.mood];

  return (
    <div
      className={cn(
        "flex items-center gap-6 rounded-[18px] px-6 py-5 bg-[#F3F4F6]"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 flex-col px-6 py-3 rounded-[9px]",
          badgeBg
        )}
      >
        {/* Large Emoji */}
        <div className="text-[26px] leading-[25px] ">{emoji}</div>

        {/* Mood Badge */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] font-semibold leading-[9px] tracking-[-0.16px] text-[#131c24]">
            {label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-0.5">
        <p className="text-[16px] font-semibold leading-[24px] tracking-[-0.32px] text-[#4b4357]">
          {entry.title}
        </p>
        <p className="text-[12px] font-normal leading-[16px] tracking-[-0.24px] text-[#6b7280]">
          {entry.date}
        </p>
      </div>
    </div>
  );
});

MoodEntryCard.displayName = "MoodEntryCard";

/**
 * Mood Trends Component
 *
 * Displays recent mood history with average mood summary
 */
function MoodTrends({
  moodEntries,
  averageMood = "good",
  periodLabel = "Last 7 days",
  className,
}: MoodTrendsProps) {
  const avgMoodEmoji = MOOD_EMOJIS[averageMood];
  const avgMoodLabel = MOOD_LABELS[averageMood];

  return (
    <div
      className={cn(
        "flex flex-col gap-6 rounded-[24px] bg-[#fbfbfb] px-10 py-8",
        "shadow-[0px_4px_4px_-4px_rgba(12,12,13,0.05),0px_16px_16px_-8px_rgba(12,12,13,0.10)]",
        className
      )}
    >
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        {/* Title Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Calendar Icon with gradient */}
            <Calendar size={35} className="text-[#6619DE]" />

            <h2 className="text-[36px] font-bold leading-[44px] tracking-[-1.44px] text-[#393343]">
              Recent moods
            </h2>
          </div>
          <span className="text-[14px] font-semibold leading-[14.48px] tracking-[-0.28px] text-[#6b7280] bg-[#E3E6EA] p-2 rounded-[100px]">
            {periodLabel}
          </span>
        </div>

        {/* Average Mood Row */}
        <div className="flex items-center gap-3">
          <span className="text-[16px] font-semibold leading-[24px] tracking-[-0.32px] text-[#6b7280]">
            Average mood:
          </span>
          <div className="flex items-center gap-1 rounded-full bg-[rgba(37,172,66,0.14)] px-3 py-1.5">
            <span className="text-[18.82px] font-bold leading-[17.88px] tracking-[2.82px]">
              {avgMoodEmoji}
            </span>
            <span className="text-[16px] font-semibold leading-[24px] tracking-[-0.32px] text-[#6b7280]">
              {avgMoodLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Mood Entries List */}
      <div className="flex flex-col gap-3">
        {moodEntries.map((entry) => (
          <MoodEntryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}

export default memo(MoodTrends);

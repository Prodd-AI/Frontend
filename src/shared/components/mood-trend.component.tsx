import { memo } from "react";
import { cn } from "@/lib/utils";
import type {
  MoodTrendsProps,
  MoodType,
  MoodEntry,
} from "@/shared/typings/mood-trend";
import { MOOD_EMOJIS } from "../utils/constants";

const MOOD_LABELS: Record<MoodType, string> = {
  great: "Great",
  good: "Good",
  okay: "Okay",
  notGreat: "Not Great",
  rough: "Rough",
};

const MOOD_BADGE_BG: Record<MoodType, string> = {
  great: "bg-[#e6f4e9]",
  good: "bg-[#e6f4e9]",
  okay: "bg-[#f3f4f6]",
  notGreat: "bg-[#fff3f3]",
  rough: "bg-[#fff3f3]",
};

const MoodEntryCard = memo(({ entry }: { entry: MoodEntry }) => {
  const emoji = MOOD_EMOJIS[entry.mood];
  const label = MOOD_LABELS[entry.mood];
  const badgeBg = MOOD_BADGE_BG[entry.mood];

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4">
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-1 size-14 rounded-xl shrink-0",
          badgeBg,
        )}
      >
        <span className="text-xl leading-none">{emoji}</span>
        <span className="text-[9px] font-semibold text-[#131c24]">{label}</span>
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <p
          className={cn(
            "text-sm truncate",
            entry.title
              ? "font-semibold text-[#251F2D]"
              : "font-normal italic text-gray-400",
          )}
        >
          {entry.title || "No description"}
        </p>
        <p className="text-xs text-gray-500">{entry.date}</p>
      </div>
    </div>
  );
});

MoodEntryCard.displayName = "MoodEntryCard";

function MoodTrends({
  moodEntries,
  averageMood,
  className,
}: MoodTrendsProps) {
  const hasAverageMood = averageMood !== undefined;
  const avgMoodEmoji = hasAverageMood ? MOOD_EMOJIS[averageMood] : null;
  const avgMoodLabel = hasAverageMood ? MOOD_LABELS[averageMood] : null;
  const hasMoodEntries = moodEntries.length > 0;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-[#6B7280]">
          Average mood:
        </span>
        {hasAverageMood ? (
          <div className="inline-flex items-center gap-2 rounded-full bg-[#F3EBFF] px-3 py-1">
            <span className="text-base leading-none">{avgMoodEmoji}</span>
            <span className="text-xs font-semibold text-[#6619DE]">
              {avgMoodLabel}
            </span>
          </div>
        ) : (
          <span className="text-xs text-gray-400 italic">
            No recent mood logged
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {hasMoodEntries ? (
          moodEntries.map((entry) => (
            <MoodEntryCard key={entry.id} entry={entry} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border border-gray-200 bg-white">
            <span className="text-4xl mb-3">📊</span>
            <p className="text-sm font-semibold text-[#6B7280]">
              No mood entries available
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(MoodTrends);

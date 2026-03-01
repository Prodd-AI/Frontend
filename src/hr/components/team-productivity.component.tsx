import { CalendarDays } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface MoodDistributionEntry {
  date: string;
  average_score: number;
  total_checkins: number;
}

interface TeamProductivityProps {
  data: MoodDistributionEntry[];
  isLoading?: boolean;
  dateFilter: "this_week" | "last_week";
  onDateFilterChange: (value: "this_week" | "last_week") => void;
}

type MoodLevel = "rough" | "notGreat" | "okay" | "good" | "great";

const moodConfig: Record<
  MoodLevel,
  { label: string; emoji: string; bg: string; legendBg: string }
> = {
  rough: {
    label: "Rough",
    emoji: "😔",
    bg: "bg-[#FFD6E0]",
    legendBg: "bg-[#FFB6C8]",
  },
  notGreat: {
    label: "Not Great",
    emoji: "😟",
    bg: "bg-[#FFDCC8]",
    legendBg: "bg-[#FFC8A8]",
  },
  okay: {
    label: "Okay",
    emoji: "🙂",
    bg: "bg-[#FFF4B8]",
    legendBg: "bg-[#FFE978]",
  },
  good: {
    label: "Good",
    emoji: "😊",
    bg: "bg-[#D0F0E8]",
    legendBg: "bg-[#A0E0D0]",
  },
  great: {
    label: "Great",
    emoji: "🤩",
    bg: "bg-[#C8F0D8]",
    legendBg: "bg-[#90E0B0]",
  },
};

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thurs", "Fri", "Sat", "Sun"];

function scoreToMood(score: number): MoodLevel {
  if (score <= 1.5) return "rough";
  if (score <= 2.5) return "notGreat";
  if (score <= 3.5) return "okay";
  if (score <= 4.5) return "good";
  return "great";
}

export default function TeamProductivity({
  data,
  isLoading = false,
  dateFilter,
  onDateFilterChange,
}: TeamProductivityProps) {

  const sortedData = [...data]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 7);

  return (
    <div className="bg-white rounded-2xl p-6 w-full shadow-[0_4px_4px_-4px_rgba(12,12,13,0.05),0_16px_16px_-8px_rgba(12,12,13,0.1)] border border-gray-100/80">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <CalendarDays className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            Team Productivity
          </h3>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-sm font-semibold text-foreground">Filter</span>
          <Select
            value={dateFilter}
            onValueChange={(v) =>
              onDateFilterChange(v as "this_week" | "last_week")
            }
          >
            <SelectTrigger className="w-[140px] h-9 rounded-lg text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this_week">This week</SelectItem>
              <SelectItem value="last_week">Last week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Day cards */}
      {isLoading ? (
        <div className="grid grid-cols-7 gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="h-4 w-8 bg-slate-200 rounded animate-pulse" />
              <div className="w-full aspect-square bg-slate-100 rounded-xl animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-3">
          {DAY_LABELS.map((day, i) => {
            const entry = sortedData[i];
            const mood = entry ? scoreToMood(entry.average_score) : null;
            const config = mood ? moodConfig[mood] : null;

            return (
              <div key={day} className="flex flex-col items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {day}
                </span>
                <div
                  className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all duration-200 ${
                    config ? config.bg : "bg-gray-100"
                  }`}
                >
                  {config ? (
                    <span className="text-3xl">{config.emoji}</span>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 mt-6 flex-wrap">
        {(Object.keys(moodConfig) as MoodLevel[]).map((key) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={`w-4 h-4 rounded ${moodConfig[key].legendBg}`} />
            <span className="text-xs font-medium text-muted-foreground">
              {moodConfig[key].label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

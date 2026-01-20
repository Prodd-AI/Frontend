import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays } from "lucide-react";

type MoodLevel = "Rough" | "Not Great" | "Okay" | "Good" | "Great";

interface DayMood {
  day: string;
  mood: MoodLevel;
}

interface ProductivityTrackerProps {
  name?: string;
  weekData?: DayMood[];
}

const moodConfig: Record<
  MoodLevel,
  { emoji: string; bg: string; border: string; shadow: string }
> = {
  Rough: {
    emoji: "😣",
    bg: "bg-gradient-to-br from-red-50 to-red-100",
    border: "border-red-200/60",
    shadow: "shadow-red-100/50",
  },
  "Not Great": {
    emoji: "😞",
    bg: "bg-gradient-to-br from-orange-50 to-orange-100",
    border: "border-orange-200/60",
    shadow: "shadow-orange-100/50",
  },
  Okay: {
    emoji: "😐",
    bg: "bg-gradient-to-br from-amber-50 to-yellow-100",
    border: "border-yellow-200/60",
    shadow: "shadow-yellow-100/50",
  },
  Good: {
    emoji: "😊",
    bg: "bg-gradient-to-br from-sky-50 to-blue-100",
    border: "border-blue-200/60",
    shadow: "shadow-blue-100/50",
  },
  Great: {
    emoji: "😄",
    bg: "bg-gradient-to-br from-emerald-50 to-green-100",
    border: "border-green-200/60",
    shadow: "shadow-green-100/50",
  },
};

const legendColors: Record<MoodLevel, string> = {
  Rough: "bg-red-400",
  "Not Great": "bg-orange-400",
  Okay: "bg-yellow-400",
  Good: "bg-blue-400",
  Great: "bg-emerald-400",
};

const defaultWeekData: DayMood[] = [
  { day: "Mon", mood: "Rough" },
  { day: "Tue", mood: "Not Great" },
  { day: "Wed", mood: "Great" },
  { day: "Thu", mood: "Rough" },
  { day: "Fri", mood: "Okay" },
  { day: "Sat", mood: "Great" },
  { day: "Sun", mood: "Not Great" },
];

const TeamMemberProductivityTracker = ({
  name = "Alex Johnson",
  weekData = defaultWeekData,
}: ProductivityTrackerProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 w-full shadow-[0_4px_4px_-4px_rgba(12,12,13,0.05),0_16px_16px_-8px_rgba(12,12,13,0.1)] border border-gray-100/80 hover:shadow-[0_4px_4px_-4px_rgba(12,12,13,0.08),0_20px_20px_-8px_rgba(12,12,13,0.15)] transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <CalendarDays className="h-[18px] w-[18px] text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-semibold text-foreground leading-tight">
              {name}'s Productivity
            </span>
            <span className="text-xs text-muted-foreground">
              Weekly mood tracker
            </span>
          </div>
        </div>

        <Select defaultValue="last-week">
          <SelectTrigger className="w-[130px] h-9 text-sm bg-gray-50/80 border-gray-200/60 rounded-lg hover:bg-gray-100/80 hover:border-gray-300/60 transition-all duration-200 focus:ring-primary/20">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent
            align="end"
            className="rounded-xl shadow-lg border-gray-200/80"
          >
            <SelectItem value="this-week" className="rounded-lg cursor-pointer">
              This week
            </SelectItem>
            <SelectItem value="last-week" className="rounded-lg cursor-pointer">
              Last week
            </SelectItem>
            <SelectItem
              value="last-month"
              className="rounded-lg cursor-pointer"
            >
              Last month
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7 gap-2 sm:gap-4 mb-8">
        {weekData.map((item, index) => (
          <div
            key={item.day}
            className="flex flex-col items-center gap-2.5 group animate-fade-in-up cursor-pointer"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <span className="text-xs font-medium text-muted-foreground/80 uppercase tracking-wide transition-colors duration-200 group-hover:text-foreground">
              {item.day}
            </span>
            <div
              className={`
                w-11 h-11 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center 
                text-xl sm:text-2xl border backdrop-blur-sm
                transition-all duration-300 ease-out
                group-hover:scale-110 group-hover:-translate-y-1
                group-hover:shadow-lg ${moodConfig[item.mood].shadow}
                ${moodConfig[item.mood].bg} ${moodConfig[item.mood].border}
              `}
            >
              <span className="transition-transform duration-300 group-hover:scale-110">
                {moodConfig[item.mood].emoji}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center gap-1 sm:gap-2 px-4 py-2.5 bg-gray-50/60 rounded-full">
          {(Object.keys(moodConfig) as MoodLevel[]).map((level, index) => (
            <div
              key={level}
              className="flex items-center gap-1.5 px-2 py-1 rounded-full transition-all duration-200 hover:bg-white hover:shadow-sm cursor-pointer group"
              style={{ animationDelay: `${(index + 7) * 60}ms` }}
            >
              <div
                className={`w-3.5 h-3.5 rounded transition-transform duration-200 group-hover:scale-125 ${legendColors[level]}`}
              />
              <span className="text-[11px] sm:text-xs font-medium text-muted-foreground transition-colors duration-200 group-hover:text-foreground whitespace-nowrap">
                {level}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamMemberProductivityTracker;

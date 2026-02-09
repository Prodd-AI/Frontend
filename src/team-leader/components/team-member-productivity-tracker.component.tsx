import { memo, useMemo, useState, useRef, useLayoutEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type MoodLevel = "rough" | "notGreat" | "okay" | "good" | "great" | null;

interface DayMood {
  date: Date;
  mood: MoodLevel;
}

interface ProductivityTrackerProps {
  moodData?: DayMood[];
  isLoading?: boolean;
}

const moodConfig: Record<
  NonNullable<MoodLevel>,
  { emoji: string; color: string; label: string; glow: string }
> = {
  rough: {
    emoji: "😣",
    color: "bg-[#bbf7d0]",
    label: "Rough Day",
    glow: "shadow-[#bbf7d0]/40",
  },
  notGreat: {
    emoji: "😞",
    color: "bg-[#86efac]",
    label: "Not Great",
    glow: "shadow-[#86efac]/40",
  },
  okay: {
    emoji: "😐",
    color: "bg-[#4ade80]",
    label: "Okay",
    glow: "shadow-[#4ade80]/40",
  },
  good: {
    emoji: "😊",
    color: "bg-[#22c55e]",
    label: "Good Day",
    glow: "shadow-[#22c55e]/40",
  },
  great: {
    emoji: "😄",
    color: "bg-[#16a34a]",
    label: "Great Day",
    glow: "shadow-[#16a34a]/40",
  },
};

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;
const MOOD_LEVELS: NonNullable<MoodLevel>[] = [
  "rough",
  "notGreat",
  "okay",
  "good",
  "great",
];

const SKELETON_MONTHS = Array.from({ length: 12 });
const SKELETON_WEEKS = Array.from({ length: 52 });
const SKELETON_DAYS = Array.from({ length: 7 });
const SKELETON_LEGENDS = Array.from({ length: 5 });

const groupByWeeks = (data: DayMood[]): DayMood[][] => {
  if (data.length === 0) return [];

  // Sort data by date ascending
  const sortedData = [...data].sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );

  // Find the start date (first date in data, aligned to Sunday)
  const firstDate = new Date(sortedData[0].date);
  firstDate.setDate(firstDate.getDate() - firstDate.getDay());

  // Find the end date (last date in data)
  const lastDate = sortedData[sortedData.length - 1].date;

  // Create a Map for O(1) lookups
  const dataMap = new Map<string, DayMood>();
  sortedData.forEach((d) => dataMap.set(d.date.toDateString(), d));

  const weeks: DayMood[][] = [];
  let currentWeek: DayMood[] = [];
  const currentDate = new Date(firstDate);

  // Iterate from first Sunday to last date
  while (currentDate <= lastDate) {
    const dateKey = currentDate.toDateString();
    currentWeek.push(
      dataMap.get(dateKey) || { date: new Date(currentDate), mood: null },
    );

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Push remaining days if any
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
};

const getMonthLabels = (
  weeks: DayMood[][],
): { month: string; span: number }[] => {
  const labels: { month: string; span: number }[] = [];
  let currentMonth = -1;
  let spanStart = 0;

  weeks.forEach((week, index) => {
    const month = week[0]?.date.getMonth() ?? -1;
    if (month !== currentMonth) {
      if (labels.length > 0) {
        labels[labels.length - 1].span = index - spanStart;
      }
      labels.push({ month: MONTHS[month], span: 1 });
      currentMonth = month;
      spanStart = index;
    }
  });

  if (labels.length > 0) {
    labels[labels.length - 1].span = weeks.length - spanStart;
  }

  return labels;
};

const MoodCell = memo(
  ({
    day,
    isToday,
    isFuture,
    isHighlighted,
  }: {
    day: DayMood;
    isToday: boolean;
    isFuture: boolean;
    isHighlighted: boolean;
  }) => {
    const config = day.mood ? moodConfig[day.mood] : null;
    const dateStr = day.date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return (
      <div
        className={cn(
          "transition-opacity duration-200",
          !isHighlighted && "opacity-20",
        )}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "w-4 h-4 rounded-[4px] transition-all duration-200 cursor-pointer relative",
                "hover:scale-150 hover:z-10",
                isFuture && "opacity-30 cursor-not-allowed",
                isToday && "ring-2 ring-primary ring-offset-1",
                config
                  ? cn(
                      config.color,
                      "hover:shadow-lg border-transparent",
                      config.glow,
                    )
                  : "bg-slate-200 border border-slate-300 hover:bg-slate-300 hover:border-slate-400",
              )}
            >
              {config && (
                <span className="absolute inset-0 flex items-center justify-center text-[10px] opacity-0 hover:opacity-100 transition-opacity duration-200">
                  {config.emoji}
                </span>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className={cn(
              "px-3 py-2 rounded-lg shadow-xl border-0",
              config ? "bg-gray-900 text-white" : "bg-gray-800 text-gray-300",
            )}
          >
            <div className="flex items-center gap-2">
              {config && <span className="text-lg">{config.emoji}</span>}
              <div className="flex flex-col">
                <span className="font-semibold text-sm">
                  {config ? config.label : "No mood logged"}
                </span>
                <span className="text-xs text-gray-400">{dateStr}</span>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  },
);

MoodCell.displayName = "MoodCell";

// Legend Item Component
const LegendItem = memo(
  ({
    level,
    isActive,
    onClick,
  }: {
    level: NonNullable<MoodLevel>;
    isActive: boolean;
    onClick: () => void;
  }) => {
    const config = moodConfig[level];

    return (
      <button
        onClick={onClick}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all duration-200",
          "hover:bg-white hover:shadow-md cursor-pointer group border border-transparent",
          isActive && "bg-white shadow-md border-gray-200",
        )}
      >
        <div
          className={cn(
            "w-4 h-4 rounded-sm transition-transform duration-200 group-hover:scale-110",
            config.color,
          )}
        />
        <span className="text-base">{config.emoji}</span>
        <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground whitespace-nowrap">
          {config.label}
        </span>
      </button>
    );
  },
);

LegendItem.displayName = "LegendItem";

// Loading Skeleton Component - extracted for cleaner code
const ProductivityTrackerSkeleton = memo(() => (
  <div className="bg-white rounded-2xl p-6 w-full shadow-[0_4px_4px_-4px_rgba(12,12,13,0.05),0_16px_16px_-8px_rgba(12,12,13,0.1)] border border-gray-100/80 animate-pulse">
    <div className="w-full overflow-hidden pb-2">
      <div className="inline-block min-w-max">
        <div className="flex mb-1.5 pl-7 gap-8">
          {SKELETON_MONTHS.map((_, i) => (
            <div key={i} className="h-3 w-8 bg-slate-200 rounded" />
          ))}
        </div>
        <div className="flex gap-1">
          <div className="flex flex-col gap-1 pr-1">
            {SKELETON_DAYS.map((_, i) => (
              <div key={i} className="h-4 w-5" />
            ))}
          </div>
          {SKELETON_WEEKS.map((_, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {SKELETON_DAYS.map((_, dayIndex) => (
                <div
                  key={dayIndex}
                  className="w-4 h-4 rounded-[4px] bg-slate-200"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="flex items-center justify-center mt-6 pt-4 border-t border-gray-100">
      <div className="flex items-center gap-4">
        {SKELETON_LEGENDS.map((_, i) => (
          <div key={i} className="h-6 w-20 bg-slate-200 rounded-full" />
        ))}
      </div>
    </div>
  </div>
));

ProductivityTrackerSkeleton.displayName = "ProductivityTrackerSkeleton";

const TeamMemberProductivityTracker = ({
  moodData,
  isLoading = false,
}: ProductivityTrackerProps) => {
  const [hoveredMood, setHoveredMood] = useState<MoodLevel>(null);

  const today = useMemo(() => new Date(), []);

  const weeks = useMemo(() => groupByWeeks(moodData || []), [moodData]);

  const monthLabels = useMemo(() => getMonthLabels(weeks), [weeks]);

  const yearRange = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return `${currentYear - 1}-${currentYear}`;
  }, []);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft =
        scrollContainerRef.current.scrollWidth;
    }
  }, [moodData]);

  if (isLoading) {
    return <ProductivityTrackerSkeleton />;
  }

  return (
    <div className="bg-white rounded-2xl p-6 w-full shadow-[0_4px_4px_-4px_rgba(12,12,13,0.05),0_16px_16px_-8px_rgba(12,12,13,0.1)] border border-gray-100/80 hover:shadow-[0_4px_4px_-4px_rgba(12,12,13,0.08),0_20px_20px_-8px_rgba(12,12,13,0.15)] transition-shadow duration-300">
      {yearRange && (
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            Mood Distribution
          </h3>
          <span className="text-xs font-medium text-muted-foreground bg-gray-100 px-2 py-1 rounded-md">
            {yearRange}
          </span>
        </div>
      )}
      {/* Single TooltipProvider for all cells instead of one per cell */}
      <TooltipProvider delayDuration={100}>
        <div className="w-full overflow-x-auto pb-2" ref={scrollContainerRef}>
          <div className="inline-block min-w-max">
            {/* Month labels */}
            <div className="flex mb-1.5 pl-7">
              {monthLabels.map((label, index) => (
                <div
                  key={`${label.month}-${index}`}
                  className="text-[10px] font-medium text-muted-foreground"
                  style={{ width: `${label.span * 20}px` }}
                >
                  {label.month}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="flex gap-1">
              {/* Day labels */}
              <div className="flex flex-col gap-1 pr-1 sticky left-0 bg-white z-10">
                {DAYS_OF_WEEK.map((day, index) => (
                  <div
                    key={day}
                    className={cn(
                      "h-4 text-[9px] font-medium text-muted-foreground flex items-center",
                      index % 2 === 0 ? "opacity-100" : "opacity-0",
                    )}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Weeks */}
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => {
                    const isToday =
                      day.date.toDateString() === today.toDateString();
                    const isFuture = day.date > today;
                    const isHighlighted =
                      hoveredMood === null || day.mood === hoveredMood;

                    return (
                      <MoodCell
                        key={`${weekIndex}-${dayIndex}`}
                        day={day}
                        isToday={isToday}
                        isFuture={isFuture}
                        isHighlighted={isHighlighted}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </TooltipProvider>

      {/* Legend */}
      <div className="flex items-center justify-center mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {MOOD_LEVELS.map((level) => (
            <LegendItem
              key={level}
              level={level}
              isActive={hoveredMood === level}
              onClick={() =>
                setHoveredMood(hoveredMood === level ? null : level)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(TeamMemberProductivityTracker);

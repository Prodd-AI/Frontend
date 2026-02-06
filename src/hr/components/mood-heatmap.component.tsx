import { useMoodAnalytics } from "@/hr/hooks/use-mood-analytics";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const legend_items = [
  { label: "Rough", color: "bg-[#FFC5C5]", border: "border-[#FFB0B0]" },
  { label: "Not Great", color: "bg-[#FFD5A5]", border: "border-[#FFC080]" },
  { label: "Okay", color: "bg-[#FFF490]", border: "border-[#FFE560]" },
  { label: "Good", color: "bg-[#DAE7FF]", border: "border-[#B8D1FF]" },
  { label: "Great", color: "bg-[#C1F0C8]", border: "border-[#A1E0AD]" },
];

const get_bar_color = (score: number) => {
  if (score < 2) return "bg-[#FFC5C5] hover:bg-[#FFB0B0]";
  if (score < 3) return "bg-[#FFD5A5] hover:bg-[#FFC080]";
  if (score < 4) return "bg-[#FFF490] hover:bg-[#FFE560]";
  if (score < 4.5) return "bg-[#DAE7FF] hover:bg-[#B8D1FF]";
  return "bg-[#C1F0C8] hover:bg-[#A1E0AD]";
};

import useDateStore from "@/config/stores/date.store";
import { DatePeriod } from "@/shared/typings/date.store";

interface MoodDataItem {
  day: string;
  label: string;
  score: number;
  emoji: string;
  total_checkins: number;
}

export default function MoodHeatmap({ team_id }: { team_id?: string | null }) {
  const { selected_period, set_selected_period } = useDateStore();
  const { mood_data, is_loading, average_weekly_score } = useMoodAnalytics({
    period: selected_period,
    team_id,
  });

  // SVG Line Chart Constants
  const width = 800;
  const height = 200;
  const padding = 40;
  const chart_width = width - padding * 2;
  const chart_height = height - padding * 2;

  // Map scores to SVG points
  // Score 5 -> 0, Score 0 -> chartHeight
  const get_x = (index: number) =>
    padding +
    (index * chart_width) / (mood_data.length > 1 ? mood_data.length - 1 : 1);
  const get_y = (score: number) =>
    padding + chart_height - (score / 5) * chart_height;

  const points = mood_data
    .map((d: MoodDataItem, i: number) => `${get_x(i)},${get_y(d.score)}`)
    .join(" ");

  if (is_loading) {
    return (
      <div className="bg-white p-20 rounded-2xl shadow-sm flex flex-col items-center justify-center space-y-4">
        <Loader2 className="size-8 text-primary-color animate-spin" />
        <p className="text-gray-500 font-medium">
          Loading mood distribution...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm space-y-8 overflow-hidden">
      {/* Header Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#251F2D] flex items-center gap-2">
              📅 Mood Distribution Calendar
            </h2>
            <p className="text-sm text-gray-500">
              Visual representation of company-wide Average mood trends over the{" "}
              {selected_period.includes("7") || selected_period.includes("week")
                ? "last 7 days"
                : "last 30 days"}
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                Filter
              </span>
              <Select
                value={selected_period}
                onValueChange={(val: DatePeriod) => set_selected_period(val)}
              >
                <SelectTrigger className="w-[120px] h-9 bg-white border border-gray-200 text-sm">
                  <SelectValue placeholder="Last week" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last_week">Last week</SelectItem>
                  <SelectItem value="last_month">Last month</SelectItem>
                  <SelectItem value="7days">7 Days</SelectItem>
                  <SelectItem value="30days">30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                Team
              </span>
              <Select defaultValue="all">
                <SelectTrigger className="w-[130px] h-9 bg-white border border-gray-200 text-sm">
                  <SelectValue placeholder="All Teams" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart Section */}
      <div className="bg-[#FBFCFD] border border-gray-50 rounded-2xl p-4 md:p-8">
        <div className="relative h-[320px] md:h-[400px] w-full flex items-end justify-between pl-8 pr-2 md:px-12 gap-1.5 md:gap-4 lg:gap-8">
          {/* Y-Axis Grid Lines & Labels */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-[2.5rem] md:pb-[3rem]">
            {[5, 4, 3, 2, 1, 0].map((val) => (
              <div key={val} className="flex items-center w-full">
                <span className="w-6 text-[10px] md:text-xs text-gray-400 font-medium text-right mr-3">
                  {val}
                </span>
                <div className="h-[1px] flex-1 border-t border-dashed border-gray-200/60"></div>
              </div>
            ))}
          </div>

          {/* Bars */}
          {mood_data.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 italic">
              No data available for this period
            </div>
          ) : (
            mood_data.map((item: MoodDataItem, index: number) => (
              <div
                key={index}
                className="relative flex flex-col items-center flex-1 h-full justify-end z-10 pb-[2.5rem] md:pb-[3rem]"
              >
                {/* The Bar */}
                <div
                  className={cn(
                    "w-full max-w-[60px] rounded-t-xl transition-all duration-500 ease-out relative group cursor-pointer",
                    get_bar_color(item.score),
                  )}
                  style={{ height: `${(item.score / 5) * 100}%` }}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#251F2D] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                    Score: {item.score.toFixed(1)}
                  </div>

                  {/* Emoji on top */}
                  <div className="absolute -top-7 md:-top-10 left-1/2 -translate-x-1/2 text-lg md:text-3xl transition-transform group-hover:scale-125 duration-300">
                    {item.emoji}
                  </div>
                </div>
                {/* X-Axis Label */}
                <div className="absolute bottom-0 text-[10px] md:text-sm text-gray-500 font-medium translate-y-4 md:translate-y-5 text-center w-full truncate">
                  <span className="block md:hidden">{item.label}</span>
                  <span className="hidden md:block">{item.day}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 mt-12 px-4">
          {legend_items.map((legend, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className={cn(
                  "w-3 h-3 md:w-4 md:h-4 rounded-full border shadow-sm",
                  legend.color,
                  legend.border,
                )}
              ></div>
              <span className="text-[10px] md:text-xs text-gray-500 font-medium whitespace-nowrap">
                {legend.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent w-full my-4 md:my-8"></div>

      {/* Bottom Line Chart Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base md:text-lg font-bold text-[#251F2D]">
            Overall Weekly Mood Score:{" "}
            <span className="text-primary-color">{average_weekly_score}/5</span>
          </h3>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
            <span>↑ 0.4</span>
            <span className="text-gray-400 font-normal">vs last week</span>
          </div>
        </div>

        {/* SVG Line Chart Container */}
        <div className="relative w-full border border-gray-100 rounded-2xl bg-white p-2 md:p-6 overflow-hidden">
          <div className="w-full aspect-[16/6] min-h-[200px]">
            {mood_data.length < 2 ? (
              <div className="w-full h-full flex items-center justify-center text-gray-400 italic">
                Not enough data for trend analysis
              </div>
            ) : (
              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-full overflow-visible"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient
                    id="lineGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#6619DE" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#6619DE" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <line
                    key={i}
                    x1={padding}
                    y1={height - padding - (i * chart_height) / 5}
                    x2={width - padding}
                    y2={height - padding - (i * chart_height) / 5}
                    stroke="#F3F4F6"
                    strokeWidth="1"
                  />
                ))}

                {/* Y-Labels */}
                {[0, 1, 2, 3, 4, 5].map((val) => (
                  <text
                    key={val}
                    x={padding - 10}
                    y={height - padding - (val * chart_height) / 5 + 4}
                    fontSize="10"
                    fill="#9CA3AF"
                    textAnchor="end"
                    fontWeight="500"
                  >
                    {val}
                  </text>
                ))}

                {/* Area under the line */}
                <path
                  d={`M ${get_x(0)},${height - padding} ${points} L ${get_x(mood_data.length - 1)},${height - padding} Z`}
                  fill="url(#lineGradient)"
                />

                {/* The Line */}
                <polyline
                  fill="none"
                  stroke="#6619DE"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                  className="drop-shadow-sm"
                />

                {/* Data Points */}
                {mood_data.map((d: MoodDataItem, i: number) => (
                  <g key={i} className="group cursor-pointer">
                    <circle
                      cx={get_x(i)}
                      cy={get_y(d.score)}
                      r="5"
                      fill="white"
                      stroke="#6619DE"
                      strokeWidth="2.5"
                      className="transition-all duration-200 group-hover:r-7"
                    />
                    {/* Invisible larger circle for easier hover */}
                    <circle
                      cx={get_x(i)}
                      cy={get_y(d.score)}
                      r="15"
                      fill="transparent"
                    />
                  </g>
                ))}

                {/* X-Labels */}
                {mood_data.map((d: MoodDataItem, i: number) => (
                  <text
                    key={d.label}
                    x={get_x(i)}
                    y={height - padding + 25}
                    fontSize="10"
                    fill="#6B7280"
                    textAnchor="middle"
                    fontWeight="500"
                  >
                    {d.label}
                  </text>
                ))}
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

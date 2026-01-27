import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Mock Data for the Charts
const MOOD_DATA = [
  { day: "Monday", score: 1.4, label: "Mon", emoji: "😐" },
  { day: "Tuesday", score: 1.5, label: "Tues", emoji: "😔" },
  { day: "Wednesday", score: 3.9, label: "Wed", emoji: "😊" },
  { day: "Thursday", score: 4.2, label: "Thurs", emoji: "😃" },
  { day: "Friday", score: 4.5, label: "Fri", emoji: "🥳" },
  { day: "Saturday", score: 3.6, label: "Sat", emoji: "🙂" },
  { day: "Sunday", score: 3.5, label: "Sun", emoji: "🙂" },
];

const LEGEND_ITEMS = [
  { label: "Rough", color: "bg-[#FFC0CB]" }, // Pinkish
  { label: "Not Great", color: "bg-[#FFDAB9]" }, // Peach/Orange
  { label: "Okay", color: "bg-[#F0E68C]" }, // Yellow
  { label: "Good", color: "bg-[#ADD8E6]" }, // Light Blue
  { label: "Great", color: "bg-[#90EE90]" }, // Light Green
];

// Helper to determine color based on score
const getBarColor = (score: number) => {
  if (score < 2) return "bg-[#FFC5C5]"; // Rough
  if (score < 3) return "bg-[#FFD5A5]"; // Not Great
  if (score < 4) return "bg-[#FFF490]"; // Okay
  if (score < 4.5) return "bg-[#DAE7FF]"; // Good (Blueish)
  return "bg-[#C1F0C8]"; // Great (Greenish)
};

export default function MoodHeatmap() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[#251F2D] flex items-center gap-2">
            📅 Mood Distribution Calendar
          </h2>
          <p className="text-sm text-gray-500">
            Visual representation of company-wide Average mood trends over the
            last 7 days
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#251F2D]">Filter</span>
            <Select defaultValue="last_week">
              <SelectTrigger className="w-[140px] bg-white border border-gray-200">
                <SelectValue placeholder="Last week" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last_week">Last week</SelectItem>
                <SelectItem value="last_month">Last month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#251F2D]">Team</span>
            <Select defaultValue="engineering">
              <SelectTrigger className="w-[140px] bg-white border border-gray-200">
                <SelectValue placeholder="Engineering" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="product">Product</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Bar Chart Section */}
      <div className="bg-[#FFFFFF] rounded-xl pt-6 pb-2">
        <div className="relative h-[400px] w-full flex items-end justify-between pl-8 pr-4 md:px-12 gap-2 md:gap-4">
          {/* Y-Axis Grid Lines & Labels */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-[3rem]">
            {[5, 4, 3, 2, 1, 0].map((val) => (
              <div key={val} className="flex items-center w-full">
                <span className="w-6 text-xs text-gray-400 font-medium text-right mr-3">
                  {val}
                </span>
                <div className="h-[1px] flex-1 border-t border-dashed border-gray-200"></div>
              </div>
            ))}
          </div>

          {/* Bars */}
          {MOOD_DATA.map((item, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center flex-1 h-full justify-end z-10 pb-[3rem]"
            >
              {/* The Bar */}
              <div
                className={cn(
                  "w-full max-w-[50px] rounded-t-lg transition-all duration-500 relative group",
                  getBarColor(item.score),
                )}
                style={{ height: `${(item.score / 5) * 100}%` }}
              >
                {/* Emoji on top */}
                <div className="absolute -top-6 md:-top-8 left-1/2 -translate-x-1/2 text-xl md:text-3xl transition-transform group-hover:scale-110">
                  {item.emoji}
                </div>
              </div>
              {/* X-Axis Label */}
              <div className="absolute bottom-0 text-xs md:text-sm text-gray-500 font-medium translate-y-4 text-center w-full">
                <span className="md:hidden">{item.label}</span>
                <span className="hidden md:block">{item.day}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {LEGEND_ITEMS.map((legend, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className={cn("w-4 h-4 rounded-[4px]", legend.color)}></div>
              <span className="text-xs text-gray-600 font-medium">
                {legend.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-200 w-full my-8"></div>

      {/* Bottom Line Chart Section */}
      <div>
        <h3 className="text-lg font-bold text-[#251F2D] mb-6">
          Overall Weekly Mood Score: 3.2/5
        </h3>

        {/* SVG Line Chart Container */}
        <div className="relative h-[250px] w-full border border-gray-100 rounded-lg p-4">
          {/* Y-Axis Labels (Simple) */}
          <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-400 px-2 h-full py-4">
            {/* We manually place absolute grid lines inside the SVG for precision or here for simple CSS */}
          </div>

          <div className="w-full h-full">
            <svg
              viewBox="0 0 800 300"
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              {/* Grid Lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={i}
                  x1="0"
                  y1={i * 60 + 20}
                  x2="800"
                  y2={i * 60 + 20}
                  stroke="#E5E7EB"
                  strokeWidth="1"
                />
              ))}

              {/* Y-Labels (SVG Text) */}
              {[5, 4, 3, 2, 1].map((val, i) => (
                <text
                  key={val}
                  x="-15"
                  y={i * 60 + 25}
                  fontSize="12"
                  fill="#9CA3AF"
                  textAnchor="end"
                >
                  {val}
                </text>
              ))}

              {/* The Line (Polyline) 
                 Mapping Map:
                 Score 5 -> Y=20
                 Score 1 -> Y=260
                 Range = 240 units for 4 score units (60 units per score)
                 Score X -> Y = 260 - ((X - 1) * 60)
                 
                 X-Coordinates: Distributed evenly (Total 800 width, 7 points)
                 Step ~ 114px
                 Start ~ 50
              */}
              <polyline
                fill="none"
                stroke="#6619DE"
                strokeWidth="3"
                points="50,20 164,200 278,80 392,260 506,200 620,260 734,200"
              />

              {/* Data Points (Circles) */}
              {[
                { x: 50, y: 20 },
                { x: 164, y: 200 },
                { x: 278, y: 80 },
                { x: 392, y: 260 },
                { x: 506, y: 200 },
                { x: 620, y: 260 },
                { x: 734, y: 200 },
              ].map((p, i) => (
                <g key={i}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="5"
                    fill="white"
                    stroke="#6619DE"
                    strokeWidth="2"
                  />
                </g>
              ))}

              {/* X-Labels */}
              {MOOD_DATA.map((d, i) => (
                <text
                  key={d.label}
                  x={50 + i * 114}
                  y="290"
                  fontSize="12"
                  fill="#4B5563"
                  textAnchor="middle"
                >
                  {d.label}
                </text>
              ))}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

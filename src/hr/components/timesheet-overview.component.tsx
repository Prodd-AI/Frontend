import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";
import {
  TeamEntryCard,
  type TeamEntry,
} from "@/shared/components/team-entry-card.component";

const HOURS_DATA = [
  { day: "Mon", hours: 6, color: "bg-[#934DFF]" },
  { day: "Tue", hours: 8, color: "bg-[#934DFF]" },
  { day: "Wed", hours: 2, color: "bg-[#934DFF]" },
  { day: "Thur", hours: 0, color: "bg-transparent" },
  { day: "Fri", hours: 0, color: "bg-transparent" },
  { day: "Sat", hours: 0, color: "bg-transparent" },
  { day: "Sun", hours: 6, color: "bg-[#934DFF]" },
];

const TEAMS_DATA: TeamEntry[] = [
  {
    id: "marketing",
    team: "Marketing",
    icon_color: "bg-[#934DFF]",
    members_count: 2,
    total_entries: 5,
    total_hours: 60.5,
    people: [
      {
        id: "sarah",
        name: "Sarah Chen",
        role: "Marketing Lead",
        entries: 3,
        hours: 32.5,
      },
      {
        id: "james",
        name: "James Wilson",
        role: "Content Writer",
        entries: 2,
        hours: 28.5,
      },
    ],
  },
  {
    id: "engineering",
    team: "Engineering",
    icon_color: "bg-[#0EB5C9]",
    members_count: 3,
    total_entries: 6,
    total_hours: 60.5,
    people: [],
  },
  {
    id: "design",
    team: "Design",
    icon_color: "bg-[#DF38D3]",
    members_count: 2,
    total_entries: 3,
    total_hours: 60.5,
    people: [],
  },
];

export default function TimesheetWeeklyOverview() {
  const totalHours = "14h";

  return (
    <div className="space-y-8">
      {/* Weekly Summary Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#F3F4F6] rounded-lg">
              <Calendar className="text-[#6619DE]" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#251F2D]">
                Weekly Summary
              </h2>
              <p className="text-sm text-gray-500">Hours logged this week</p>
            </div>
          </div>
          <div className="bg-[#EAEBEB] px-3 py-1.5 rounded-full text-xs font-bold text-[#6B7280]">
            {totalHours} total
          </div>
        </div>

        {/* Bar Chart */}
        <div className="flex items-end justify-between gap-2 h-[120px] mb-8 relative">
          {/* Background Track */}
          <div className="absolute bottom-[24px] left-0 right-0 h-2 bg-[#F3F4F6] rounded-full z-0"></div>

          {HOURS_DATA.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center flex-1 z-10 w-full group"
            >
              {/* Bar Container - fixed height to align bottom */}
              <div className="h-[80px] w-full flex items-end justify-center mb-2">
                <div
                  className={cn(
                    "w-full rounded-t-sm transition-all duration-300 hover:opacity-90",
                    item.hours > 0 ? item.color : "h-0",
                  )}
                  style={{
                    height:
                      item.hours > 0 ? `${(item.hours / 8) * 100}%` : "0%",
                    minHeight: item.hours > 0 ? "4px" : "0",
                  }}
                ></div>
              </div>
              <span className="text-xs text-gray-500 font-medium">
                {item.day}
              </span>
            </div>
          ))}
        </div>

        <div className="h-px bg-gray-100 w-full mb-6"></div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox value="14h" label="Total Hours" className="bg-[#F9FAFB]" />
          <StatBox value="2.8h" label="Daily Avg" className="bg-[#F9FAFB]" />
          <StatBox value="3" label="Teams" className="bg-[#F9FAFB]" />
          <StatBox value="5" label="Entries" className="bg-[#F9FAFB]" />
        </div>
      </div>

      {/* Team Entries List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#251F2D]">Team Entries</h3>
        <div className="space-y-3">
          {TEAMS_DATA.map((team) => (
            <TeamEntryCard key={team.id} team={team} showPayout={false} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatBox({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-4 rounded-xl",
        className,
      )}
    >
      <span className="text-lg md:text-xl font-bold text-[#251F2D] break-all text-center">
        {value}
      </span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}

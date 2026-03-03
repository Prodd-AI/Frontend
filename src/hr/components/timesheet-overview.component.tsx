import { cn } from "@/lib/utils";
import { Calendar, Loader2 } from "lucide-react";
import { TeamEntryCard } from "@/shared/components/team-entry-card.component";
import { useTeamsWithMembers } from "../hooks/use-teams-with-members";
import { useWeeklySummary } from "../hooks/use-weekly-summary";

export default function TimesheetWeeklyOverview() {
  const { teamsWithMembers, is_loading: teamsLoading } = useTeamsWithMembers();
  const {
    hoursData,
    totalHoursLabel,
    dailyAvgLabel,
    totalEntries: weeklyTotalEntries,
    is_loading: summaryLoading,
  } = useWeeklySummary();

  const totalTeams = teamsWithMembers.length;

  return (
    <div className="space-y-8">
      {/* Weekly Summary Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        {summaryLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="animate-spin text-primary-color mb-2" size={28} />
            <p className="text-sm text-gray-500">Loading weekly summary...</p>
          </div>
        ) : (
          <>
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
                {totalHoursLabel} total
              </div>
            </div>

            {/* Bar Chart */}
            <div className="flex items-end justify-between gap-2 h-[120px] mb-8 relative">
              <div className="absolute bottom-[24px] left-0 right-0 h-2 bg-[#F3F4F6] rounded-full z-0" />
              {hoursData.map((item) => (
                <div
                  key={item.day}
                  className="flex flex-col items-center flex-1 z-10 w-full group"
                >
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
                    />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>

            <div className="h-px bg-gray-100 w-full mb-6" />

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatBox value={totalHoursLabel} label="Total Hours" className="bg-[#F9FAFB]" />
              <StatBox
                value={dailyAvgLabel.endsWith("h") ? dailyAvgLabel : `${dailyAvgLabel}h`}
                label="Daily Avg"
                className="bg-[#F9FAFB]"
              />
              <StatBox value={String(totalTeams)} label="Teams" className="bg-[#F9FAFB]" />
              <StatBox value={String(weeklyTotalEntries)} label="Entries" className="bg-[#F9FAFB]" />
            </div>
          </>
        )}
      </div>

      {/* Team Entries List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#251F2D]">Team Entries</h3>
        {teamsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-primary-color" size={32} />
          </div>
        ) : teamsWithMembers.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">No teams found.</p>
        ) : (
          <div className="space-y-3">
            {teamsWithMembers.map((team) => (
              <TeamEntryCard key={team.id} team={team} showPayout={false} />
            ))}
          </div>
        )}
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

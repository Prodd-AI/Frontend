import { Users, CheckCheck, TrendingUp, AlertTriangle } from "lucide-react";
import { FilterBar } from "./filter-search-bar.component";
import { StatCard } from "./stat-card.component";
import clsx, { ClassValue } from "clsx";

interface TeamInsightMetricCardPropsInt {
  className?: ClassValue;
  teamSize?: number;
  completedTasks?: number;
  moraleScore?: number;
  atRiskCount?: number;
  isLoading?: boolean;
  onDateRangeChange?: (startDate: string, endDate: string) => void;
}

const MoodEmojiMapper: Record<number, string> = {
  1: "😢",
  2: "😕",
  3: "😐",
  4: "😊",
  5: "😄",
};

function TeamInsightMetricCard({
  className,
  teamSize = 0,
  completedTasks = 0,
  moraleScore = 0,
  atRiskCount = 0,
  isLoading = false,
  onDateRangeChange,
}: TeamInsightMetricCardPropsInt) {
  const moodScale = Math.ceil((moraleScore / 100) * 5) || 1;
  const moodEmoji = MoodEmojiMapper[moodScale] ?? "😐";

  return (
    <div
      className={clsx(
        `w-full  mx-auto p-6 bg-[#F8F8F9] rounded-[12px]`,
        "shadow-[0px_4px_4px_-4px_rgba(12,12,13,0.05),0px_16px_16px_-8px_rgba(12,12,13,0.1)]",
        className,
      )}
    >
      <FilterBar onDateRangeChange={onDateRangeChange} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Team Size"
          value={isLoading ? "-" : teamSize}
          subtitle="Total team members you lead"
          icon={<Users className="w-5 h-5 text-primary" />}
        />

        <StatCard
          title="Completed task"
          value={isLoading ? "-" : completedTasks}
          icon={<CheckCheck className="w-5 h-5 text-[#0B7322] text-success" />}
        />

        <StatCard
          title="Team Morale"
          value={isLoading ? "-" : `${moraleScore}%`}
          subtitle="Team average"
          icon={<TrendingUp className="w-5 h-5 text-primary" />}
          emoji={isLoading ? undefined : moodEmoji}
        />

        <StatCard
          title="At Risk"
          value={isLoading ? "-" : atRiskCount}
          subtitle="Needs attention"
          icon={<AlertTriangle className="w-5 h-5 text-[#EF4444]" />}
        />
      </div>
    </div>
  );
}
export default TeamInsightMetricCard;

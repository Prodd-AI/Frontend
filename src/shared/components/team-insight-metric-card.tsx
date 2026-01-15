import { Users, CheckCheck, TrendingUp, AlertTriangle } from "lucide-react";
import { FilterBar } from "./filter-search-bar.component";
import { StatCard } from "./stat-card.component";
import clsx, { ClassValue } from "clsx";

interface TeamInsightMetricCardPropsInt {
  className?: ClassValue;
}
function TeamInsightMetricCard({ className }: TeamInsightMetricCardPropsInt) {
  return (
    <div
      className={clsx(
        `w-full  mx-auto p-6 bg-[#F8F8F9] rounded-[12px]`,
        "shadow-[0px_4px_4px_-4px_rgba(12,12,13,0.05),0px_16px_16px_-8px_rgba(12,12,13,0.1)]",
        className
      )}
    >
      <FilterBar />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Team Size"
          value={5}
          subtitle="Total team members you lead"
          icon={<Users className="w-5 h-5 text-primary" />}
        />

        <StatCard
          title="Completed task"
          value={1}
          icon={<CheckCheck className="w-5 h-5 text-[#0B7322] text-success" />}
          badge={
            <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full bg-success/10 text-[#10B981] bg-[#E6F4E9]">
              +3
            </span>
          }
        />

        <StatCard
          title="Avg. Team Mood"
          value="3.5"
          subtitle="Above last week"
          icon={<TrendingUp className="w-5 h-5 text-primary" />}
          emoji="😌"
        />

        <StatCard
          title="Flight Risk"
          value={4}
          subtitle="Needs attention"
          icon={<AlertTriangle className="w-5 h-5 text-[#EF4444]" />}
        />
      </div>
    </div>
  );
}
export default TeamInsightMetricCard;

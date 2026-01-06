import { Users, CheckCheck, TrendingUp, AlertTriangle } from "lucide-react";
import { FilterBar } from "./filter-search-bar.component";
import { StatCard } from "./stat-card.component";
import clsx, { ClassValue } from "clsx";

interface TeamInsightMetricCardPropsInt {
  className?: ClassValue;
}
export function TeamDashboard({ className }: TeamInsightMetricCardPropsInt) {
  return (
    <div
      className={clsx(
        `w-full  mx-auto p-6 bg-[#F8F8F9] rounded-[20px]`,
        
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
          delay={0}
        />

        <StatCard
          title="Completed task"
          value={1}
          icon={<CheckCheck className="w-5 h-5 text-success" />}
          badge={
            <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-success/10 text-success">
              +3
            </span>
          }
          delay={100}
        />

        <StatCard
          title="Avg. Team Mood"
          value="3.5"
          subtitle="Above last week"
          icon={<TrendingUp className="w-5 h-5 text-primary" />}
          emoji="😌"
          delay={200}
        />

        <StatCard
          title="Flight Risk"
          value={1}
          subtitle="Needs attention"
          icon={<AlertTriangle className="w-5 h-5 text-warning" />}
          delay={300}
        />
      </div>
    </div>
  );
}

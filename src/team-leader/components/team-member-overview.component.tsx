import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamMemberOverviewCardProps {
  joinDate?: string;
  performanceTrend?: "improving" | "stable" | "declining";
  workloadStatus?: "light" | "balanced" | "heavy";
  isLoading?: boolean;
}

const performanceTrendStyles = {
  improving: "text-emerald-600 bg-emerald-50 border-emerald-100",
  stable: "text-blue-600 bg-blue-50 border-blue-100",
  declining: "text-red-600 bg-red-50 border-red-100",
};

const workloadStatusStyles = {
  light: "bg-green-100 text-green-700 border-green-200/60",
  balanced: "bg-gray-100 text-muted-foreground border-gray-200/60",
  heavy: "bg-orange-100 text-orange-700 border-orange-200/60",
};

function TeamMemberOverviewCard({
  joinDate,
  performanceTrend,
  workloadStatus,
  isLoading = false,
}: TeamMemberOverviewCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 w-full shadow-[0_4px_4px_-4px_rgba(12,12,13,0.05),0_16px_16px_-8px_rgba(12,12,13,0.1)] border border-gray-100/80 animate-pulse">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-slate-200" />
          <div className="flex flex-col gap-1">
            <div className="h-4 w-28 bg-slate-200 rounded" />
            <div className="h-3 w-20 bg-slate-200 rounded" />
          </div>
        </div>
        <div className="space-y-2.5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3.5 px-4 bg-gray-50/80 rounded-xl"
            >
              <div className="h-4 w-24 bg-slate-200 rounded" />
              <div className="h-6 w-20 bg-slate-200 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const formattedDate = joinDate
    ? new Date(joinDate).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  return (
    <div className="bg-white rounded-2xl p-6 w-full shadow-[0_4px_4px_-4px_rgba(12,12,13,0.05),0_16px_16px_-8px_rgba(12,12,13,0.1)] border border-gray-100/80 hover:shadow-[0_4px_4px_-4px_rgba(12,12,13,0.08),0_20px_20px_-8px_rgba(12,12,13,0.15)] transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
          <User className="h-[18px] w-[18px] text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-[15px] font-semibold text-foreground leading-tight">
            Member Overview
          </span>
          <span className="text-xs text-muted-foreground">Key information</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {/* Join Date Row */}
        <div className="flex items-center justify-between py-3.5 px-4 bg-gray-50/80 rounded-xl border border-gray-100/60 transition-all duration-200 hover:bg-gray-100/60 hover:border-gray-200/60 cursor-pointer group">
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-200">
            Join Date
          </span>
          <span className="text-sm font-medium text-foreground">
            {formattedDate}
          </span>
        </div>

        {/* Performance Trend Row */}
        <div className="flex items-center justify-between py-3.5 px-4 bg-gray-50/80 rounded-xl border border-gray-100/60 transition-all duration-200 hover:bg-gray-100/60 hover:border-gray-200/60 cursor-pointer group">
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-200">
            Performance Trend
          </span>
          {performanceTrend ? (
            <span
              className={cn(
                "text-[13px] font-semibold py-1 px-3 rounded-full border capitalize",
                performanceTrendStyles[performanceTrend],
              )}
            >
              {performanceTrend}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          )}
        </div>

        {/* Workload Status Row */}
        <div className="flex items-center justify-between py-3.5 px-4 bg-gray-50/80 rounded-xl border border-gray-100/60 transition-all duration-200 hover:bg-gray-100/60 hover:border-gray-200/60 cursor-pointer group">
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-200">
            Workload Status
          </span>
          {workloadStatus ? (
            <Badge
              variant="secondary"
              className={cn(
                "font-medium text-xs px-3 py-1 rounded-full border transition-all duration-200 hover:scale-105 capitalize",
                workloadStatusStyles[workloadStatus],
              )}
            >
              {workloadStatus}
            </Badge>
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeamMemberOverviewCard;

import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

function TeamMemberOverviewCard() {
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
          <span className="text-sm font-medium text-foreground">6/14/2023</span>
        </div>

        {/* Performance Trend Row */}
        <div className="flex items-center justify-between py-3.5 px-4 bg-gray-50/80 rounded-xl border border-gray-100/60 transition-all duration-200 hover:bg-gray-100/60 hover:border-gray-200/60 cursor-pointer group">
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-200">
            Performance Trend
          </span>
          <span className="text-[13px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 py-1 px-3 rounded-full">
            Improving
          </span>
        </div>

        {/* Workload Status Row */}
        <div className="flex items-center justify-between py-3.5 px-4 bg-gray-50/80 rounded-xl border border-gray-100/60 transition-all duration-200 hover:bg-gray-100/60 hover:border-gray-200/60 cursor-pointer group">
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-200">
            Workload Status
          </span>
          <Badge
            variant="secondary"
            className="bg-gray-100 text-muted-foreground font-medium text-xs px-3 py-1 rounded-full border border-gray-200/60 transition-all duration-200 hover:scale-105 hover:bg-gray-150"
          >
            Balanced
          </Badge>
        </div>
      </div>
    </div>
  );
}

export default TeamMemberOverviewCard;

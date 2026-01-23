import { cn } from "@/lib/utils";
import { TeamAnalysisInfo } from "@/shared/typings/team-analysis-card";

interface TeamPerformanceListItemProps {
  team: TeamAnalysisInfo;
  className?: string;
  onClick?: () => void;
}

export default function TeamPerformanceListItem({
  team,
  className,
  onClick,
}: TeamPerformanceListItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl bg-[#F3F4F6] p-4 flex items-center justify-between cursor-pointer hover:bg-gray-200 transition-colors",
        className
      )}
    >
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold text-[#251F2D]">{team.team_name}</p>
        <p className="text-xs text-[#6B7280] font-medium">
          {team.member_count} members • Led by {team.lead_name}
        </p>
      </div>

      <div className="flex flex-col items-end gap-1">
        <span
          className={cn(
            "text-xs px-2 py-1 rounded-md font-bold",
            Number(team.avg_score) >= 4
              ? "bg-success-color/20 text-success-color"
              : Number(team.avg_score) >= 3
              ? "bg-[#EAEBEB] text-[#6B7280]"
              : "bg-danger-color/20 text-danger-color"
          )}
        >
          {Number(team.avg_score) >= 4
            ? `${team.avg_score} Avg.`
            : String(team.avg_score)}
        </span>
        {team.at_risk_count > 0 && (
          <span className="text-[10px] text-danger-color font-semibold">
            {team.at_risk_count} at risk
          </span>
        )}
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface TeamPerformanceListItemTeam {
  team_id: string;
  name: string;
  lead_name?: string;
  performance_score: number;
}

interface TeamPerformanceListItemProps {
  team: TeamPerformanceListItemTeam;
  className?: string;
  onClick?: () => void;
  /** Optional short reference code shown as a chip (e.g. "ENG-042"). */
  refCode?: string;
}

function buildRefCode(team: TeamPerformanceListItemTeam): string {
  const prefix = (team.name ?? "TEAM").slice(0, 3).toUpperCase();
  const num =
    typeof team.team_id === "string"
      ? team.team_id.slice(-3).padStart(3, "0")
      : "000";
  return `${prefix}-${num}`;
}

export default function TeamPerformanceListItem({
  team,
  className,
  onClick,
  refCode,
}: TeamPerformanceListItemProps) {
  const score = Number(team.performance_score) || 0;
  const isUp = score >= 3.5;
  const chip = refCode ?? buildRefCode(team);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-2xl bg-white border border-gray-100 p-4 flex items-center justify-between gap-4 hover:shadow-sm transition-shadow",
        className,
      )}
    >
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-[11px] font-medium text-gray-400 tracking-wide w-fit">
          {chip}
        </span>
        <p className="text-sm font-semibold text-[#251F2D] truncate">
          {team.name}
        </p>
        <p className="text-xs text-[#6B7280] truncate">
          {team.lead_name === "Unassigned"
            ? "No team lead assigned"
            : `Lead: ${team.lead_name}`}
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {isUp ? (
          <TrendingUp size={16} className="text-success-color" />
        ) : (
          <TrendingDown size={16} className="text-danger-color" />
        )}
        <span
          className={cn(
            "text-xs px-3 py-1 rounded-full font-semibold text-white",
            isUp ? "bg-[#6619DE]" : "bg-danger-color",
          )}
        >
          {score.toFixed(1)}
        </span>
      </div>
    </button>
  );
}

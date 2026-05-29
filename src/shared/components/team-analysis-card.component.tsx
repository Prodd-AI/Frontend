import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PiUsersThreeLight } from "react-icons/pi";
import { ArrowRight, CheckCircle2, AlertTriangle, Flame } from "lucide-react";
import {
  TeamAnalysisCardProps,
  TeamHealthStatus,
} from "@/shared/typings/team-analysis-card";

// Backend ships status either as "healthy" or "HEALTHY" — normalize once.
const normalizeStatus = (status?: TeamHealthStatus): "healthy" | "at_risk" | "flagged" => {
  if (!status) return "healthy";
  const lower = status.toLowerCase() as "healthy" | "at_risk" | "flagged";
  return lower === "at_risk" || lower === "flagged" ? lower : "healthy";
};

const statusConfig = {
  healthy: {
    label: "Healthy",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Icon: CheckCircle2,
    accent: "text-emerald-600",
    progress: "bg-emerald-500",
    ring: "stroke-emerald-500",
  },
  at_risk: {
    label: "At Risk",
    chip: "bg-amber-50 text-amber-700 border-amber-200",
    Icon: AlertTriangle,
    accent: "text-amber-600",
    progress: "bg-amber-500",
    ring: "stroke-amber-500",
  },
  flagged: {
    label: "Flagged",
    chip: "bg-red-50 text-red-700 border-red-200",
    Icon: Flame,
    accent: "text-red-600",
    progress: "bg-red-500",
    ring: "stroke-red-500",
  },
} as const;

const performanceLabel = (score: number, status: "healthy" | "at_risk" | "flagged") => {
  if (score === 0 && status !== "healthy") return "Needs attention";
  if (score >= 80) return "Strong performance";
  if (score >= 60) return "Steady performance";
  if (score >= 40) return "Mixed signals";
  return "Underperforming";
};

export default function TeamAnalysisCardComponent({
  team,
  actions,
  className,
}: TeamAnalysisCardProps) {
  const status = normalizeStatus(team.status);
  const config = statusConfig[status];
  const score = Math.max(0, Math.min(100, Math.round(team.performance_score ?? 0)));
  // Geometry for the SVG dial.
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div
      className={cn(
        "rounded-2xl bg-white p-5 border border-gray-200 flex flex-col gap-5 transition-shadow hover:shadow-md",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-bold text-[#251F2D] truncate">
            {team.name}
          </h3>
          <p className="text-xs text-gray-500 truncate">
            Led by{" "}
            <span className="font-semibold text-[#5A5D61]">
              {team.lead_name || "—"}
            </span>
          </p>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full border whitespace-nowrap",
            config.chip,
          )}
        >
          <config.Icon size={12} />
          {config.label}
        </span>
      </div>

      {/* Performance dial + label */}
      <div className="flex items-center gap-4">
        <div className="relative size-[76px] shrink-0">
          <svg width={76} height={76} viewBox="0 0 76 76" className="-rotate-90">
            <circle
              cx={38}
              cy={38}
              r={radius}
              fill="none"
              strokeWidth={6}
              className="stroke-gray-100"
            />
            <circle
              cx={38}
              cy={38}
              r={radius}
              fill="none"
              strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className={cn("transition-[stroke-dashoffset]", config.ring)}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-[#251F2D] leading-none">
              {score}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-gray-400">
              / 100
            </span>
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Performance
          </p>
          <p className={cn("text-sm font-semibold", config.accent)}>
            {performanceLabel(score, status)}
          </p>
        </div>
      </div>

      {/* Footer info row */}
      <div className="flex items-center justify-between rounded-xl bg-gray-50 border border-gray-100 px-3 py-2">
        <div className="flex items-center gap-2 text-sm text-[#5A5D61]">
          <PiUsersThreeLight size={18} className="text-gray-500" />
          <span className="font-semibold text-[#251F2D]">
            {team.member_count}
          </span>
          <span>{team.member_count === 1 ? "member" : "members"}</span>
        </div>
      </div>

      <Button
        variant="outline"
        className="h-10 justify-between"
        onClick={() => actions?.on_view?.(team.team_id)}
      >
        View Details
        <ArrowRight size={16} />
      </Button>
    </div>
  );
}

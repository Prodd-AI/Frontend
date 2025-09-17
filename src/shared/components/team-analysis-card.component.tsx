import type { TeamAnalysisCardProps } from "../typings/team-analysis-card.d";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PiUsersThreeLight } from "react-icons/pi";
import { GoAlert } from "react-icons/go";

export default function TeamAnalysisCardComponent({
  team,
  actions,
  className,
}: TeamAnalysisCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-white p-5 shadow-lg flex flex-col gap-5",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-base font-bold text-[#605A69]">{team.team_name}</p>
          <p className="text-xs text-[#6B7280] font-semibold">
            {team.lead_name} · Team Lead
          </p>
        </div>
        <span
          className={`text-[10px] px-2 py-1 rounded-full font-bold ${
            Number(team.avg_score.toFixed(2)) > 4
              ? "bg-success-color/20 text-success-color"
              : Number(team.avg_score.toFixed(2)) > 3
              ? "bg-[#E3E6EA] text-[#6B7280]"
              : "bg-danger-color/20 text-danger-color"
          }`}
        >
          {team.avg_score.toFixed(2)} avg
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2 text-[#605A69] font-semibold">
          <PiUsersThreeLight size={18} />
          <span>Team Size</span>
        </div>
        <div className="text-right text-[#605A69] font-bold">
          {team.member_count} Members
        </div>

        <div className="flex items-center gap-2 text-[#605A69] font-semibold">
          <GoAlert size={16} />
          <span>At Risk Member</span>
        </div>
        <div
          className={cn(
            "text-right text-[#605A69] font-bold",
            team.at_risk_count > 0 ? "text-danger-color" : "text-emerald-600"
          )}
        >
          {team.at_risk_count}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Bar label="Morale" textColor="#6B7280" percent={team.morale_percent} />
        <Bar
          label="Participation"
          textColor="#6B7280"
          percent={team.participation_percent}
        />
      </div>

      <Button
        className="h-10 bg-primary-color-purple"
        onClick={() => actions?.on_view?.(team.id)}
      >
        View Details
      </Button>
    </div>
  );
}

function Bar({
  label,
  textColor,
  percent,
}: {
  label: string;
  textColor: string;
  percent: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className={cn("text-xs text-[#605A69] font-semibold", textColor)}>
          {label}: {percent}%
        </span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-[#EAEBEB]">
        <div
          className="h-2 rounded-full bg-[#251F2D]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

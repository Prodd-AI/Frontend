import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FlightRiskCardProps } from "@/hr/typings/flight-risk-card";

export default function FlightRiskCardComponent({
  person,
  actions,
  className,
}: FlightRiskCardProps) {
  const [expanded, setExpanded] = useState<boolean>(false);
  const pill =
    person.status === "at_risk"
      ? "bg-danger-color/10 text-danger-color"
      : person.status === "watch"
      ? "bg-warning-color/20 text-warning-color"
      : "bg-success-color/20 text-success-color";

  return (
    <div
      className={cn(
        "rounded-xl bg-white p-5 shadow-lg flex flex-col gap-5",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-base font-bold text-[#251F2D]">
            {person.member_name}
          </p>
          <p className="text-xs text-[#6B7280]">
            {person.role_title} • {person.team_name}
          </p>
        </div>
        <span
          className={cn("text-[10px] px-2 py-1 rounded-full font-bold", pill)}
        >
          {person.status === "at_risk"
            ? "At Risk"
            : person.status === "watch"
            ? "Watch"
            : "Healthy"}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <Metric label="Avg Mood (30 days)">
          <span className="text-primary-color font-bold">
            {person.avg_mood_score}
            {person.avg_mood_scale ? `/${person.avg_mood_scale}` : ""}
          </span>
        </Metric>
        <Metric label="Task Completion">
          <span className="text-danger-color font-bold">
            {person.task_completion_percent}%
          </span>
        </Metric>
        <Metric label="Weekly Streak">
          <span className="font-bold">{person.weekly_streak_days} Days</span>
        </Metric>
        <Metric label="Last Check-in">
          <span className="font-bold">{person.last_checkin_label}</span>
        </Metric>
      </div>

      <div className="flex items-center gap-3">
        <Button
          className="h-8 text-xs font-semibold bg-[#EAEBEB] text-[#251F2D] hover:opacity-95"
          onClick={() => actions?.on_schedule_one_to_one?.(person.id)}
        >
          Schedule 1:1
        </Button>
        <Button
          className="h-8 text-xs font-semibold bg-[#EAEBEB] text-[#251F2D] hover:opacity-95"
          onClick={() => actions?.on_contact_team_lead?.(person.id)}
        >
          Contact Team Lead
        </Button>
        <Button
          className="h-8 text-xs font-semibold bg-[#EAEBEB] text-[#251F2D] hover:opacity-95"
          onClick={() => actions?.on_view_profile?.(person.id)}
        >
          View Profile
        </Button>
        <div className="ml-auto text-xs">
          <button
            className="px-0 text-primary-color hover:underline cursor-pointer"
            onClick={() => {
              setExpanded((v) => !v);
              actions?.on_see_more?.(person.id);
            }}
          >
            {expanded ? "See Less" : "See More"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-2">
          {Array.isArray(person.risk_factors) &&
            person.risk_factors.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-[#6B7280] font-semibold">
                  Risk Factors:
                </p>
                <ul className="mt-2 space-y-2">
                  {person.risk_factors.map((risk, idx) => (
                    <li
                      key={`${person.id}-risk-${idx}`}
                      className="flex items-center gap-2 text-xs text-[#6B7280]"
                    >
                      <span className="text-danger-color">⚠</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {person.scheduled_call_label && (
            <div className="mt-4 inline-flex items-center gap-2 border border-success-color/40 rounded-md px-3 py-2 text-xs text-success-color bg-success-color/10">
              <span>🗓</span>
              <span>{person.scheduled_call_label}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Metric({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-[#6B7280]">{label}</span>
      <div className="text-sm text-[#251F2D]">{children}</div>
    </div>
  );
}

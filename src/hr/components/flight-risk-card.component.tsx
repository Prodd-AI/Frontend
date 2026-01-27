import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FlightRiskCardProps } from "@/hr/typings/flight-risk-card";
import { ChevronRight, Phone } from "lucide-react";
import { IoWarningOutline } from "react-icons/io5";

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
        "rounded-xl bg-white p-5 shadow-lg flex flex-col gap-5 transition-all duration-300",
        className,
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
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
          <span className="font-bold text-[#251F2D]">
            {person.weekly_streak_days} Days
          </span>
        </Metric>
        <Metric label="Last Check-in">
          <span className="font-bold text-[#251F2D]">
            {person.last_checkin_label}
          </span>
        </Metric>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Button
            className="flex-1 md:flex-none h-9 text-xs font-semibold bg-[#F3F4F6] text-[#251F2D] hover:bg-[#E5E7EB] shadow-none border border-transparent"
            onClick={() => actions?.on_schedule_one_to_one?.(person.id)}
          >
            Schedule 1:1
          </Button>
          <Button
            className="flex-1 md:flex-none h-9 text-xs font-semibold bg-[#F3F4F6] text-[#251F2D] hover:bg-[#E5E7EB] shadow-none border border-transparent"
            onClick={() => actions?.on_contact_team_lead?.(person.id)}
          >
            Contact Team Lead
          </Button>
          <Button
            className="flex-1 md:flex-none h-9 text-xs font-semibold bg-[#F3F4F6] text-[#251F2D] hover:bg-[#E5E7EB] shadow-none border border-transparent"
            onClick={() => actions?.on_view_profile?.(person.id)}
          >
            View Profile
          </Button>
        </div>

        <div className="ml-auto flex items-center mt-2 md:mt-0">
          <button
            className="flex items-center gap-1 text-xs text-primary-color hover:underline font-medium"
            onClick={() => {
              setExpanded((v) => !v);
              actions?.on_see_more?.(person.id);
            }}
          >
            {expanded ? "See Less" : "See More"}
            <ChevronRight
              size={14}
              className={cn(
                "transition-transform duration-200",
                expanded ? "-rotate-90" : "rotate-90",
              )}
            />
          </button>
        </div>
      </div>

      {/* Expanded Content with Animation */}
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out overflow-hidden",
          expanded
            ? "grid-rows-[1fr] opacity-100 mt-2"
            : "grid-rows-[0fr] opacity-0 mt-0",
        )}
      >
        <div className="min-h-0">
          {Array.isArray(person.risk_factors) &&
            person.risk_factors.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-[#251F2D] font-bold mb-2">
                  Risk Factors:
                </p>
                <ul className="space-y-1.5">
                  {person.risk_factors.map((risk, idx) => (
                    <li
                      key={`${person.id}-risk-${idx}`}
                      className="flex items-center gap-2 text-xs text-[#6B7280]"
                    >
                      <IoWarningOutline
                        className="text-danger-color shrink-0"
                        size={14}
                      />
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {person.scheduled_call_label && (
            <div className="inline-flex items-center gap-2 border border-success-color rounded-lg px-4 py-2.5 text-xs font-medium text-success-color bg-[#F0FDF4]">
              <Phone size={14} />
              <span>{person.scheduled_call_label}</span>
            </div>
          )}
        </div>
      </div>
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

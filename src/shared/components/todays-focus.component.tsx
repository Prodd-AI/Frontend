import { memo } from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, Flag, Sparkles, Clock } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import { parseWallClockIso } from "@/shared/utils/date.utils";
import type {
  TodaysFocusProps,
  FocusGoal,
} from "@/shared/typings/todays-focus";

type Priority = FocusGoal["priority"];

// Visual tiers per priority. High = urgent red, medium = amber, low = calm blue.
const TIERS: Record<
  Priority,
  {
    border: string;
    bg: string;
    stripe: string;
    iconWrap: string;
    iconHalo: string;
    iconColor: string;
    Icon: typeof AlertTriangle;
    pillBg: string;
    pillLabel: string;
    bodyText: string;
    helper: string;
    rank: number;
  }
> = {
  high: {
    border: "border-[#FCA5A5]",
    bg: "bg-gradient-to-br from-[#FEF2F2] via-white to-[#FFF7ED]",
    stripe: "bg-gradient-to-b from-[#EF4444] to-[#F97316]",
    iconWrap: "bg-[#EF4444]/10 ring-2 ring-[#EF4444]/20",
    iconHalo: "bg-[#EF4444]/15 animate-ping",
    iconColor: "text-[#DC2626]",
    Icon: AlertTriangle,
    pillBg: "bg-[#DC2626]",
    pillLabel: "High Priority",
    bodyText: "text-[#7F1D1D]",
    helper: "text-[#9A3412]",
    rank: 0,
  },
  medium: {
    border: "border-[#FCD34D]",
    bg: "bg-gradient-to-br from-[#FFFBEB] via-white to-[#FEF3C7]",
    stripe: "bg-gradient-to-b from-[#F59E0B] to-[#D97706]",
    iconWrap: "bg-[#F59E0B]/10 ring-2 ring-[#F59E0B]/20",
    iconHalo: "",
    iconColor: "text-[#B45309]",
    Icon: Flag,
    pillBg: "bg-[#D97706]",
    pillLabel: "Medium Priority",
    bodyText: "text-[#78350F]",
    helper: "text-[#92400E]",
    rank: 1,
  },
  low: {
    border: "border-[#BFDBFE]",
    bg: "bg-gradient-to-br from-[#EFF6FF] via-white to-[#F0F9FF]",
    stripe: "bg-gradient-to-b from-[#3B82F6] to-[#0EA5E9]",
    iconWrap: "bg-[#3B82F6]/10 ring-2 ring-[#3B82F6]/20",
    iconHalo: "",
    iconColor: "text-[#1D4ED8]",
    Icon: Sparkles,
    pillBg: "bg-[#1D4ED8]",
    pillLabel: "Low Priority",
    bodyText: "text-[#1E3A8A]",
    helper: "text-[#1E40AF]",
    rank: 2,
  },
};

const dueLabel = (due_at: string | undefined): string | null => {
  if (!due_at) return null;
  const date = parseWallClockIso(due_at);
  if (Number.isNaN(date.getTime())) return null;
  const diffMs = date.getTime() - Date.now();
  const distance = formatDistanceToNowStrict(date);
  return diffMs >= 0 ? `Due in ${distance}` : `Overdue by ${distance}`;
};

const GoalCard = memo(({ goal }: { goal: FocusGoal }) => {
  const tier = TIERS[goal.priority];
  const due = dueLabel(goal.due_at);
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-5 border",
        tier.border,
        tier.bg,
      )}
    >
      <span
        aria-hidden
        className={cn("absolute left-0 top-0 h-full w-1.5", tier.stripe)}
      />

      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className={cn(
              "relative size-9 rounded-xl flex items-center justify-center shrink-0",
              tier.iconWrap,
            )}
          >
            {tier.iconHalo && (
              <span
                aria-hidden
                className={cn("absolute inset-0 rounded-xl", tier.iconHalo)}
              />
            )}
            <tier.Icon size={18} className={cn("relative", tier.iconColor)} />
          </span>
          <p
            className={cn(
              "text-base font-semibold leading-snug",
              tier.bodyText,
            )}
          >
            {goal.description}
          </p>
        </div>

        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm shrink-0",
            tier.pillBg,
          )}
        >
          {goal.priority === "high" && (
            <span className="size-1.5 rounded-full bg-white animate-pulse" />
          )}
          {tier.pillLabel}
        </span>
      </div>

      {due && (
        <p
          className={cn(
            "mt-1 inline-flex items-center gap-1.5 text-xs font-medium",
            tier.helper,
          )}
        >
          <Clock size={12} />
          {due}
        </p>
      )}
    </div>
  );
});
GoalCard.displayName = "GoalCard";

function TodaysFocus({ title, goals, className }: TodaysFocusProps) {
  // Sort by priority so the most urgent always renders at the top, no matter
  // what order the caller passed them in.
  const sorted = [...goals].sort(
    (a, b) => TIERS[a.priority].rank - TIERS[b.priority].rank,
  );

  if (sorted.length === 0) {
    return (
      <div
        className={cn(
          "rounded-2xl bg-white border border-gray-200 p-5",
          className,
        )}
      >
        <div className="flex items-center gap-2.5 mb-2">
          <span className="size-9 rounded-xl bg-[#F3EBFF] flex items-center justify-center">
            <AlertTriangle size={18} className="text-[#6619DE]" />
          </span>
          <h3 className="text-sm font-semibold text-[#251F2D]">
            {title ?? "Today's Focus"}
          </h3>
        </div>
        <p className="text-base font-medium text-[#251F2D]">
          No pending tasks for today. Stay sharp!
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {title && (
        <h3 className="text-sm font-semibold text-[#251F2D]">{title}</h3>
      )}
      {sorted.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
}

export default memo(TodaysFocus);

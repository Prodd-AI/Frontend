import { cn } from "@/lib/utils";

interface BurnoutAlertsChartProps {
  /** Total at-risk count (headline). */
  total_at_risk: number;
  /** Delta vs last week. Negative = improvement, positive = worsening. */
  delta_vs_last_week?: number;
  /** Per-team at-risk counts, used as bar heights. */
  series?: { label: string; value: number }[];
  className?: string;
}

export default function BurnoutAlertsChart({
  total_at_risk,
  delta_vs_last_week,
  series,
  className,
}: BurnoutAlertsChartProps) {
  // Use the real per-team series the caller provides. No more placeholder
  // month labels — there's no monthly burnout-trend endpoint in the docs.
  const bars = (series ?? []).slice(0, 8);

  const maxValue = Math.max(1, ...bars.map((b) => b.value));
  const tallestIndex = bars.reduce(
    (acc, b, idx) => (b.value > bars[acc].value ? idx : acc),
    0,
  );

  const deltaText = (() => {
    if (delta_vs_last_week === undefined) return null;
    const sign = delta_vs_last_week > 0 ? "+" : "";
    return `${sign}${delta_vs_last_week}`;
  })();

  return (
    <div
      className={cn(
        "bg-white rounded-3xl p-6 border border-gray-200 flex flex-col gap-4 min-h-[280px]",
        className,
      )}
    >
      <div className="flex items-baseline gap-3">
        <h3 className="text-sm font-semibold text-[#5A5D61]">Burnout Alerts</h3>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold text-[#251F2D]">
          {total_at_risk}
        </span>
        {deltaText && (
          <span
            className={cn(
              "px-2 py-0.5 rounded-md text-xs font-semibold",
              delta_vs_last_week! < 0
                ? "bg-success-color/10 text-success-color"
                : delta_vs_last_week! > 0
                  ? "bg-danger-color/10 text-danger-color"
                  : "bg-gray-100 text-gray-500",
            )}
          >
            {deltaText}
          </span>
        )}
        <span className="text-xs text-gray-400">vs Last week</span>
      </div>

      <div className="flex-1 flex items-end justify-between gap-2 sm:gap-3 mt-2 pt-2">
        {bars.length === 0 ? (
          <div className="w-full text-center text-xs text-gray-400 py-12">
            No at-risk teams to display.
          </div>
        ) : (
          bars.map((bar, idx) => {
            const heightPct = Math.max(8, (bar.value / maxValue) * 100);
            const isTallest = idx === tallestIndex && bar.value > 0;
            return (
              <div
                key={bar.label}
                className="flex flex-col items-center gap-2 flex-1 min-w-0"
              >
                <div className="w-full h-32 flex items-end">
                  <div
                    className={cn(
                      "w-full rounded-md transition-all",
                      isTallest ? "bg-[#6619DE]" : "bg-[#EDEDF0]",
                    )}
                    style={{ height: `${heightPct}%` }}
                    aria-label={`${bar.label}: ${bar.value}`}
                  />
                </div>
                <span
                  className="text-[11px] font-medium text-gray-400 truncate w-full text-center"
                  title={bar.label}
                >
                  {bar.label}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
import {
  StatusCardItem,
  StatusCardsProps,
} from "@/shared/typings/status-cards";

function formatDelta(item: StatusCardItem): { text: string; cls: string } {
  const color = item.delta_color ?? "auto";
  const value =
    item.delta_text ??
    (typeof item.delta_value === "number"
      ? `${item.delta_value > 0 ? "+" : ""}${item.delta_value}`
      : "");

  const clsBy = {
    success: "text-success-color",
    danger: "text-danger-color",
    warning: "text-warning-color",
    muted: "text-[#6B7280]",
  } as const;

  const autoCls =
    typeof item.delta_value === "number"
      ? item.delta_value >= 0
        ? clsBy.success
        : clsBy.danger
      : clsBy.muted;

  const cls = color === "auto" ? autoCls : (clsBy[color] ?? clsBy.muted);
  return { text: String(value), cls };
}

export default function StatusCards({
  items,
  className,
  grid_classname,
  on_item_click,
}: StatusCardsProps) {
  return (
    <div
      className={cn(
        "grid gap-4",
        grid_classname ?? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
      )}
    >
      {items.map((it) => {
        const delta = formatDelta(it);
        return (
          <button
            key={it.id}
            type="button"
            className={cn(
              "rounded-2xl bg-white p-5 text-left transition-colors border border-gray-200 hover:border-gray-300",
              className,
            )}
            onClick={() => on_item_click?.(it.id)}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-[#5A5D61]">{it.title}</p>
              {it.icon && (
                <span
                  className={cn(
                    "inline-flex items-center justify-center size-8 rounded-full bg-[#F3EBFF]",
                    it.icon_classname,
                  )}
                >
                  {it.icon}
                </span>
              )}
            </div>

            <p className="mt-4 text-3xl font-bold text-[#251F2D]">
              {it.value_prefix ? `${it.value_prefix}` : ""}
              {it.value}
              {it.value_suffix ? `${it.value_suffix}` : ""}
            </p>

            {(delta.text || it.delta_period) && (
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-success-color/10 px-2 py-1">
                {delta.text && (
                  <span className={cn("text-xs font-semibold", delta.cls)}>
                    {delta.text}
                  </span>
                )}
                {it.delta_period && (
                  <span className="text-xs text-[#6B7280]">
                    {it.delta_period}
                  </span>
                )}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

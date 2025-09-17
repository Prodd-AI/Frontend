import { cn } from "@/lib/utils";

function formatDelta(item: StatusCardItem): { text: string; cls: string } {
  const color = item.delta_color ?? "auto";
  const value =
    item.delta_text ??
    (typeof item.delta_value === "number"
      ? item.value_suffix === "%" || item.id.includes("rate")
        ? `${item.delta_value > 0 ? "+" : ""}${item.delta_value}`
        : `${item.delta_value > 0 ? "+" : ""}${item.delta_value}`
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

  const cls = color === "auto" ? autoCls : clsBy[color] ?? clsBy.muted;
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
        grid_classname ?? "grid-cols-1 md:grid-cols-5"
      )}
    >
      {items.map((it) => {
        const delta = formatDelta(it);
        return (
          <button
            key={it.id}
            className={cn(
              "rounded-xl bg-[#F3F4F6] p-4 text-left hover:shadow-md transition-all",
              className
            )}
            onClick={() => on_item_click?.(it.id)}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-[#6B7280] flex items-center gap-2">
                {it.icon ? (
                  <span
                    className={cn(
                      "inline-flex items-center",
                      it.icon_classname
                    )}
                  >
                    {it.icon}
                  </span>
                ) : null}
                {it.title}
              </p>
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-3xl font-bold text-[#251F2D]">
                {it.value_prefix ? `${it.value_prefix}` : ""}
                {it.value}
                {it.value_suffix ? `${it.value_suffix}` : ""}
              </p>
              {delta.text && (
                <span className={cn("text-xs font-semibold", delta.cls)}>
                  {delta.text}
                </span>
              )}
              {it.delta_period && (
                <span className="text-xs text-[#9CA3AF]">
                  {it.delta_period}
                </span>
              )}
            </div>

            {it.description && (
              <p className="mt-2 text-xs text-[#9CA3AF]">{it.description}</p>
            )}
          </button>
        );
      })}
    </div>
  );
}

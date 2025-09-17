import { cn } from "@/lib/utils";
import { stylesByVariant } from "../utils/wellness-trend.constants";

export default function WellnessTrendCards({
  items,
  className,
}: WellnessTrendCardsProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {items.map((it) => (
        <div
          key={it.id}
          className={cn("rounded-xl px-4 py-3", stylesByVariant[it.variant])}
        >
          <p className={cn("text-sm font-semibold")}>{it.title}</p>
          <p
            className={cn(
              "text-xs mt-1",
              it.variant === "risk" ? "text-danger-color" : ""
            )}
          >
            {it.description}
          </p>
        </div>
      ))}
    </div>
  );
}

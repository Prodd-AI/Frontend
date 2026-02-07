import { cn } from "@/lib/utils";
import { stylesByVariant } from "../utils/wellness-trend.constants";
import { WellnessTrendCardsProps } from "@/hr/typings/wellness-trend-cards";

export default function WellnessTrendCards({
  items,
  className,
}: WellnessTrendCardsProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {items.length > 0 ? (
        items.map((it) => (
          <div
            key={it.id}
            className={cn("rounded-xl px-4 py-3", stylesByVariant[it.variant])}
          >
            <p className={cn("text-sm font-semibold")}>{it.title}</p>
            <p
              className={cn(
                "text-xs mt-1",
                it.variant === "risk" ? "text-danger-color" : "",
              )}
            >
              {it.description}
            </p>
          </div>
        ))
      ) : (
        <div className="p-10 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
          <p className="text-sm italic">No wellness trends at the moment</p>
        </div>
      )}
    </div>
  );
}

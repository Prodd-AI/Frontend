import { Globe } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { GiPadlock } from "react-icons/gi";
import { COMMON_TIMEZONES } from "@/shared/utils/constants";

export function TimezoneSelect({
  value,
  label,
  className,
}: {
  value?: string;
  label?: string;
  className?: string;
}) {
  const timezoneValue =
    value || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const displayValue =
    COMMON_TIMEZONES.find((tz) => tz.value === timezoneValue)?.label ||
    timezoneValue;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <Label htmlFor="timezone">{label}</Label>}
      <div className="relative mt-2">
        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          id="timezone"
          type="text"
          value={displayValue}
          disabled
          className="flex h-[55px] w-full rounded-md border border-input bg-[#F3F4F6] pl-10 pr-10 py-2 text-base text-[#6B7280] font-semibold ring-offset-background disabled:cursor-not-allowed md:text-sm"
          readOnly
        />
        <GiPadlock className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
      </div>
    </div>
  );
}

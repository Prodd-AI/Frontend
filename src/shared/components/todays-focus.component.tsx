/**
 * @fileoverview Today's Focus Component
 *
 * Displays the user's primary goal for the day along with helpful recommendations
 * like break times and energy level insights.
 */

import { memo } from "react";
import { cn } from "@/lib/utils";
import { MdOutlineCenterFocusStrong } from "react-icons/md";
import type { TodaysFocusProps } from "@/shared/typings/todays-focus";
import InfoCard from "./info-card.component";

/**
 * Today's Focus Component
 *
 * Shows the primary goal and helpful insights for the day
 */
function TodaysFocus({
  primaryGoalTitle,
  primaryGoalDescription,
  infoCards = [],
  className,
}: TodaysFocusProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-8 rounded-[24px] bg-[#fbfbfb] px-10 py-10",
        "shadow-[0px_4px_4px_-4px_rgba(12,12,13,0.05),0px_16px_16px_-8px_rgba(12,12,13,0.10)]",
        className,
      )}
    >
      {/* Header with Title */}
      <div className="flex items-center gap-2">
        {/* Focus Icon with border */}
        <MdOutlineCenterFocusStrong size={24} className="text-[#6619DE]" />

        <h2 className="text-[36px] font-bold leading-[44px] tracking-[-1.44px] text-[#393343]">
          Today's Focus
        </h2>
      </div>

      {/* Primary Goal Section */}
      <div className="flex flex-col gap-0.5 bg-[#F3F4F6] px-10 py-6 rounded-[14px]">
        <h3 className="text-[22px] font-bold leading-[30px] tracking-[-0.33px] text-[#4b4357]">
          {primaryGoalTitle}
        </h3>
        <p className="text-[16px] font-medium leading-[24px] tracking-[-0.24px] text-[#6b7280]">
          {primaryGoalDescription || "No primary goals for today. Stay sharp!"}
        </p>
      </div>

      {/* Info Cards Grid */}
      {infoCards.length > 0 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {infoCards.map((card, index) => (
            <InfoCard key={index} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(TodaysFocus);

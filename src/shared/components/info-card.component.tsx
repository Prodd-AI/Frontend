/**
 * @fileoverview Info Card Component
 *
 * Reusable card component for displaying recommendation or insight information
 * with an icon, title, and description.
 */

import { memo } from "react";
import { PiCoffeeBold, PiSunBold } from "react-icons/pi";
import type { FocusInfoCard } from "@/shared/typings/todays-focus";
import type { IconType } from "react-icons";

/**
 * Icon mapping for info card types
 */
const iconMap: Record<string, IconType> = {
  break: PiCoffeeBold,
  energy: PiSunBold,
};

/**
 * Icon component for info cards - uses react-icons
 */
const InfoCardIcon = ({ type }: { type: string }) => {
  const Icon = iconMap[type];
  if (!Icon) return null;

  return <Icon className="h-4 w-4" />;
};

/**
 * Info Card Component for recommendations
 */
const InfoCard = memo(({ card }: { card: FocusInfoCard }) => {
  return (
    <div className="flex flex-col gap-1 rounded-[16px] border border-[#6B728069] bg-white px-6 py-5">
      {/* Header with Icon */}
      <div className="flex items-center gap-0.5">
        <div className="text-[#f59e0b]">
          <InfoCardIcon type={card.icon} />
        </div>
        <span className="text-[16px] font-bold leading-[24px] tracking-[-0.32px] text-[#4b4357]">
          {card.title}
        </span>
      </div>

      {/* Description */}
      <p className="text-[16px] font-medium leading-[24px] tracking-[-0.24px] text-[#6b7280]">
        {card.description}
      </p>
    </div>
  );
});

InfoCard.displayName = "InfoCard";

export default InfoCard;

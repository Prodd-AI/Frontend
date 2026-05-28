import { memo } from "react";
import { PiCoffeeBold, PiSunBold } from "react-icons/pi";
import type { FocusInfoCard } from "@/shared/typings/todays-focus";
import type { IconType } from "react-icons";

const iconMap: Record<string, IconType> = {
  break: PiCoffeeBold,
  energy: PiSunBold,
};

const InfoCardIcon = ({ type }: { type: string }) => {
  const Icon = iconMap[type];
  if (!Icon) return null;
  return <Icon className="h-4 w-4" />;
};

const InfoCard = memo(({ card }: { card: FocusInfoCard }) => {
  return (
    <div className="rounded-2xl bg-white border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="size-7 rounded-full bg-[#FFF7ED] flex items-center justify-center text-[#F59E0B]">
          <InfoCardIcon type={card.icon} />
        </span>
        <span className="text-sm font-semibold text-[#251F2D]">
          {card.title}
        </span>
      </div>
      <p className="text-sm text-[#6B7280]">{card.description}</p>
    </div>
  );
});

InfoCard.displayName = "InfoCard";

export default InfoCard;

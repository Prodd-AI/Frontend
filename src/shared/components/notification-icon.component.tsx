import { Bell } from "lucide-react";
import { RiEmotionHappyLine } from "react-icons/ri";
import { FaUserTie } from "react-icons/fa";
import { HiStar } from "react-icons/hi";
import { MdBusinessCenter, MdPerson } from "react-icons/md";

type NotificationIconSize = "sm" | "lg";

interface SizeConfig {
  container: string;
  icon: string;
  innerCircle: string;
  innerIcon: string;
  badge: string;
  badgeIcon: string;
}

const sizeConfigs: Record<NotificationIconSize, SizeConfig> = {
  sm: {
    container: "size-10",
    icon: "size-6",
    innerCircle: "size-6",
    innerIcon: "size-4",
    badge: "size-3",
    badgeIcon: "size-2",
  },
  lg: {
    container: "size-12",
    icon: "size-7",
    innerCircle: "size-7",
    innerIcon: "size-5",
    badge: "size-4",
    badgeIcon: "size-2.5",
  },
};

interface NotificationIconProps {
  icon?: string;
  size?: NotificationIconSize;
}


export function NotificationIcon({ icon, size = "lg" }: NotificationIconProps) {
  const config = sizeConfigs[size];

  switch (icon) {
    case "mood":
      return (
        <div
          className={`${config.container} flex-shrink-0 flex items-center justify-center rounded-full bg-yellow-100`}
        >
          <RiEmotionHappyLine className={`${config.icon} text-yellow-600`} />
        </div>
      );
    case "task":
      return (
        <div
          className={`${config.container} flex-shrink-0 flex items-center justify-center rounded-full bg-gray-100 relative`}
        >
          <div
            className={`${config.innerCircle} bg-blue-500 rounded-full flex items-center justify-center`}
          >
            <MdPerson className={`${config.innerIcon} text-white`} />
          </div>
          <div
            className={`absolute -top-0.5 -right-0.5 ${config.badge} bg-blue-500 rounded-full flex items-center justify-center`}
          >
            <HiStar className={`${config.badgeIcon} text-white`} />
          </div>
        </div>
      );
    case "meeting":
      return (
        <div
          className={`${config.container} flex-shrink-0 flex items-center justify-center rounded-full bg-gray-100 relative`}
        >
          <div
            className={`${config.innerCircle} bg-pink-500 rounded-full flex items-center justify-center`}
          >
            <FaUserTie className={`${config.innerIcon} text-white`} />
          </div>
          <div
            className={`absolute -bottom-0.5 -right-0.5 ${config.badge} bg-pink-500 rounded-full flex items-center justify-center`}
          >
            <MdBusinessCenter className={`${config.badgeIcon} text-white`} />
          </div>
        </div>
      );
    default:
      return (
        <div
          className={`${config.container} flex-shrink-0 flex items-center justify-center rounded-full bg-[#6619DE]/10`}
        >
          <Bell className={`${config.icon} text-[#6619DE]`} />
        </div>
      );
  }
}

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PopoverContent } from "@/components/ui/popover";
import { RiEmotionHappyLine } from "react-icons/ri";
import { FaUserTie } from "react-icons/fa";
import { HiStar } from "react-icons/hi";
import { MdBusinessCenter, MdPerson } from "react-icons/md";

interface Notification {
  id: string;
  type: "mood" | "task" | "meeting";
  message: string;
  timestamp: string;
  actionLabel?: string;
  onAction?: () => void;
}

const NotificationDropdown = () => {
  // Dummy notifications data
  const notifications: Notification[] = [
    {
      id: "1",
      type: "mood",
      message: "You missed today's mood check-in",
      timestamp: "5 mins ago",
      actionLabel: "Check-in now",
      onAction: () => console.log("Check-in clicked"),
    },
    {
      id: "2",
      type: "task",
      message: "Team Lead added a new sprint task",
      timestamp: "3h ago",
      actionLabel: "View task",
      onAction: () => console.log("View task clicked"),
    },
    {
      id: "3",
      type: "meeting",
      message: "HR scheduled a 1:1 Meeting/Call with you",
      timestamp: "3h ago",
    },
  ];

  const renderNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "mood":
        return (
          <div className="size-10 flex-shrink-0 flex items-center justify-center rounded-full bg-yellow-100">
            <RiEmotionHappyLine className="size-6 text-yellow-600" />
          </div>
        );
      case "task":
        return (
          <div className="size-10 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-100 relative">
            <div className="size-6 bg-blue-500 rounded-full flex items-center justify-center">
              <MdPerson className="size-4 text-white" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 size-3 bg-blue-500 rounded-full flex items-center justify-center">
              <HiStar className="size-2 text-white" />
            </div>
          </div>
        );
      case "meeting":
        return (
          <div className="size-10 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-100 relative">
            <div className="size-6 bg-pink-500 rounded-full flex items-center justify-center">
              <FaUserTie className="size-4 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 size-3 bg-pink-500 rounded-full flex items-center justify-center">
              <MdBusinessCenter className="size-2 text-white" />
            </div>
          </div>
        );
    }
  };

  return (
    <PopoverContent
      align="end"
      sideOffset={8}
      className="w-[400px] p-0 max-h-[600px] flex flex-col bg-white/90 backdrop-blur-sm shadow-lg rounded-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
        <h2 className="text-lg font-bold text-[#251F2D]">Notifications</h2>
        <button
          type="button"
          onClick={() => console.log("Mark all as read")}
          className="text-sm text-[#6619DE] hover:text-[#6619DE]/80 transition-colors"
        >
          Mark all as read
        </button>
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto flex-1">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className={`px-6 py-4 ${
              index < notifications.length - 1
                ? "border-b border-[#E5E7EB]"
                : ""
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              {renderNotificationIcon(notification.type)}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-normal text-[#251F2D] mb-1">
                  {notification.message}
                </p>
                <p className="text-xs text-[#9CA3AF] mb-3">
                  {notification.timestamp}
                </p>
                {notification.actionLabel && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={notification.onAction}
                    className="border-[#6619DE] text-[#6619DE] hover:bg-[#6619DE]/10"
                  >
                    {notification.actionLabel}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[#E5E7EB]">
        <button
          type="button"
          onClick={() => console.log("View all notifications")}
          className="flex items-center justify-center gap-2 w-full text-sm text-[#6619DE] hover:text-[#6619DE]/80 transition-colors"
        >
          View all notifications
          <ArrowRight className="size-4" />
        </button>
      </div>
    </PopoverContent>
  );
};

export default NotificationDropdown;

import { ArrowRight } from "lucide-react";
import { PopoverContent, PopoverClose } from "@/components/ui/popover";
import { Link } from "react-router-dom";
import { formatTimeAgo } from "@/shared/utils/date.utils";
import { NotificationIcon } from "@/shared/components/notification-icon.component";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAllUserNoficationAsRead } from "@/config/services/notifications.service";
import { toast } from "sonner";

const NotificationDropdown = ({
  notifications,
  onMarkAllAsRead,
}: {
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
}) => {
  const queryClient = useQueryClient();

  const markAllAsReadMutation = useMutation({
    mutationFn: () => markAllUserNoficationAsRead(),
    onSuccess: () => {
      onMarkAllAsRead();
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All notifications marked as read");
    },
  });

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const hasUnread = notifications.some((n) => !n.is_read);

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
          onClick={handleMarkAllAsRead}
          disabled={markAllAsReadMutation.isPending || !hasUnread}
          className="text-sm text-[#6619DE] hover:text-[#6619DE]/80 transition-colors disabled:opacity-50"
        >
          {markAllAsReadMutation.isPending ? "Marking..." : "Mark all as read"}
        </button>
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto flex-1">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className={`px-6 py-4 ${
              !notification.is_read ? "bg-[#F3EBFF]/40" : ""
            } ${
              index < notifications.length - 1
                ? "border-b border-[#E5E7EB]"
                : ""
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <NotificationIcon icon={notification.icon} size="sm" />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-normal text-[#251F2D] mb-1">
                  {notification.message}
                </p>
                <p className="text-xs text-[#9CA3AF] mb-3">
                  {formatTimeAgo(notification.created_at)}
                </p>
              </div>

              {/* Unread indicator */}
              {!notification.is_read && (
                <span className="size-2 rounded-full bg-[#6619DE] mt-2 shrink-0" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[#E5E7EB]">
        <PopoverClose asChild>
          <Link
            to="/notifications"
            className="flex items-center justify-center gap-2 w-full text-sm text-[#6619DE] hover:text-[#6619DE]/80 transition-colors"
          >
            View all notifications
            <ArrowRight className="size-4" />
          </Link>
        </PopoverClose>
      </div>
    </PopoverContent>
  );
};

export default NotificationDropdown;

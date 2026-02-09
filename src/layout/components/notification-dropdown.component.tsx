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
}: {
  notifications: AppNotification[];
}) => {
  const queryClient = useQueryClient();

  const markAllAsReadMutation = useMutation({
    mutationFn: () => markAllUserNoficationAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All notifications marked as read");
    },
  });

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
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
          onClick={handleMarkAllAsRead}
          disabled={markAllAsReadMutation.isPending}
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
                {/* {notification.action_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      (window.location.href = notification.action_url!)
                    }
                    className="border-[#6619DE] text-[#6619DE] hover:bg-[#6619DE]/10"
                  >
                    View
                  </Button>
                )} */}
              </div>
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

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowLeft, Bell, Check, CheckCheck, Trash2 } from "lucide-react";
import {
  getAllUserNotifications,
  markAUserNoficationAsRead,
  markAllUserNoficationAsRead,
  deleteASeletedUserNofication,
} from "@/config/services/notifications.service";
import Loader from "@/shared/components/loader.component";
import useAppNotifications from "@/shared/hooks/use-socket-notifications";
import { formatTimeAgo } from "@/shared/utils/date.utils";
import { NotificationIcon } from "@/shared/components/notification-icon.component";
import { toast } from "sonner";

function NotificationsPage() {
  const queryClient = useQueryClient();
  const realtimeNotifications = useAppNotifications();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getAllUserNotifications({ page: "1", limit: "50" }),
  });

  const persistedNotifications: AppNotification[] = data?.data ?? [];

  const allNotifications = [
    ...realtimeNotifications,
    ...persistedNotifications.filter(
      (pn) => !realtimeNotifications.some((rn) => rn.id === pn.id),
    ),
  ].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  const unreadCount = allNotifications.filter((n) => !n.is_read).length;

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => markAUserNoficationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => markAllUserNoficationAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All notifications marked as read");
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (id: string) => deleteASeletedUserNofication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification deleted");
    },
  });

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleDeleteNotification = (id: string) => {
    deleteNotificationMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center gap-4">
        <p className="text-red-500">Failed to load notifications</p>
        <Link
          to="/"
          className="text-[#6619DE] hover:text-[#6619DE]/80 transition-colors"
        >
          Go back home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="p-2 rounded-lg hover:bg-black/5 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="size-5 text-[#251F2D]" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#251F2D]">Notifications</h1>
            <p className="text-sm text-[#9CA3AF]">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "You're all caught up!"}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            disabled={markAllAsReadMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 text-sm text-[#6619DE] hover:bg-[#6619DE]/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCheck className="size-4" />
            {markAllAsReadMutation.isPending
              ? "Marking..."
              : "Mark all as read"}
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden">
        {allNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="size-16 flex items-center justify-center rounded-full bg-[#6619DE]/10 mb-4">
              <Bell className="size-8 text-[#6619DE]" />
            </div>
            <p className="text-lg font-medium text-[#251F2D] mb-1">
              No notifications yet
            </p>
            <p className="text-sm text-[#9CA3AF]">
              When you get notifications, they'll show up here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#E5E7EB]">
            {allNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-4 p-5 transition-colors hover:bg-[#F9FAFB] ${
                  !notification.is_read ? "bg-[#6619DE]/5" : ""
                }`}
              >
                {/* Icon */}
                <NotificationIcon icon={notification.icon} size="lg" />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p
                        className={`text-sm mb-1 ${
                          !notification.is_read
                            ? "font-semibold text-[#251F2D]"
                            : "text-[#251F2D]"
                        }`}
                      >
                        {notification.title}
                      </p>
                      <p className="text-sm text-[#6B7280] mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-[#9CA3AF]">
                        {formatTimeAgo(notification.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!notification.is_read && (
                        <button
                          type="button"
                          className="p-1.5 rounded-lg hover:bg-[#6619DE]/10 transition-colors"
                          aria-label="Mark as read"
                          onClick={() => handleMarkAsRead(notification.id)}
                          disabled={markAsReadMutation.isPending}
                        >
                          <Check className="size-4 text-[#6619DE]" />
                        </button>
                      )}
                      <button
                        type="button"
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        aria-label="Delete notification"
                        onClick={() =>
                          handleDeleteNotification(notification.id)
                        }
                        disabled={deleteNotificationMutation.isPending}
                      >
                        <Trash2 className="size-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsPage;

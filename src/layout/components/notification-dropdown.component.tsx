import { ArrowRight, Check, Trash2 } from "lucide-react";
import { PopoverContent, PopoverClose } from "@/components/ui/popover";
import { Link } from "react-router-dom";
import { formatTimeAgo } from "@/shared/utils/date.utils";
import { NotificationIcon } from "@/shared/components/notification-icon.component";

interface NotificationDropdownProps {
  notifications: AppNotification[];
  isLoading?: boolean;
  unreadCount: number;
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  isMarkingAllAsRead?: boolean;
}

const NotificationDropdown = ({
  notifications,
  isLoading = false,
  unreadCount,
  onMarkAllAsRead,
  onMarkAsRead,
  onDelete,
  isMarkingAllAsRead = false,
}: NotificationDropdownProps) => {
  const hasUnread = unreadCount > 0;

  return (
    <PopoverContent
      align="end"
      sideOffset={8}
      className="w-[400px] p-0 max-h-[600px] flex flex-col bg-white/95 backdrop-blur-sm shadow-lg rounded-lg"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
        <h2 className="text-lg font-bold text-[#251F2D]">Notifications</h2>
        <button
          type="button"
          onClick={onMarkAllAsRead}
          disabled={isMarkingAllAsRead || !hasUnread}
          className="text-sm text-[#6619DE] hover:text-[#6619DE]/80 transition-colors disabled:opacity-50"
        >
          {isMarkingAllAsRead ? "Marking..." : "Mark all as read"}
        </button>
      </div>

      <div className="overflow-y-auto flex-1">
        {isLoading ? (
          <div className="py-10 text-center text-sm text-gray-500">
            Loading notifications…
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-500">
            You're all caught up.
          </div>
        ) : (
          notifications.map((notification, index) => {
            const body = (
              <div className="flex items-start gap-4">
                <NotificationIcon icon={notification.icon} size="sm" />
                <div className="flex-1 min-w-0">
                  {notification.title && (
                    <p
                      className={`text-sm mb-0.5 truncate ${
                        !notification.is_read
                          ? "font-semibold text-[#251F2D]"
                          : "text-[#251F2D]"
                      }`}
                    >
                      {notification.title}
                    </p>
                  )}
                  <p className="text-sm text-[#5A5D61] mb-1 line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-[#9CA3AF]">
                    {formatTimeAgo(notification.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!notification.is_read && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onMarkAsRead(notification.id);
                      }}
                      className="p-1.5 rounded-md hover:bg-[#6619DE]/10 transition-colors"
                      aria-label="Mark as read"
                    >
                      <Check className="size-4 text-[#6619DE]" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDelete(notification.id);
                    }}
                    className="p-1.5 rounded-md hover:bg-red-50 transition-colors"
                    aria-label="Delete notification"
                  >
                    <Trash2 className="size-4 text-red-500" />
                  </button>
                </div>
              </div>
            );

            const wrapperClass = `block px-6 py-4 transition-colors ${
              !notification.is_read ? "bg-[#F3EBFF]/40" : ""
            } ${
              index < notifications.length - 1
                ? "border-b border-[#E5E7EB]"
                : ""
            } hover:bg-gray-50/60`;

            return notification.action_url ? (
              <Link
                key={notification.id}
                to={notification.action_url}
                className={wrapperClass}
                onClick={() => {
                  if (!notification.is_read) onMarkAsRead(notification.id);
                }}
              >
                {body}
              </Link>
            ) : (
              <div key={notification.id} className={wrapperClass}>
                {body}
              </div>
            );
          })
        )}
      </div>

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

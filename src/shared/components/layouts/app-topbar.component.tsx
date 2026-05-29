import { ReactNode } from "react";
import { Bell, Settings, LogOut } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Link } from "react-router-dom";
import AviPlaceholder from "../avi-placeholder.component";
import NotificationDropdown from "@/layout/components/notification-dropdown.component";
import useAuthStore from "@/config/stores/auth.store";
import useAppNotifications from "@/shared/hooks/use-socket-notifications";

interface AppTopbarProps {
  actions?: ReactNode;
  onOpenMobileMenu?: () => void;
}

function AppTopbar({ actions }: AppTopbarProps) {
  const { user } = useAuthStore();
  const {
    notifications,
    unreadCount,
    isLoading: isLoadingNotifications,
    markAllAsRead,
    markAsRead,
    deleteNotification,
    isMarkingAllAsRead,
  } = useAppNotifications();

  if (!user) return null;

  const userFullName = `${user.user.first_name} ${user.user.last_name}`;

  return (
    <div className="h-[72px] flex items-center justify-end gap-4 px-6 bg-white border-b border-gray-100">
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Role-specific actions */}
        {actions && (
          <div className="hidden md:flex items-center gap-2">{actions}</div>
        )}

        {/* Notification bell */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="relative p-2 rounded-full hover:bg-black/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#6619DE] focus:ring-offset-2"
              aria-label={`Notifications${
                unreadCount > 0 ? `, ${unreadCount} unread` : ""
              }`}
            >
              <Bell size={22} aria-hidden="true" />
              {unreadCount > 0 && (
                <span
                  className="size-2.5 bg-[#EF4444] rounded-full absolute top-1.5 right-1.5"
                  aria-hidden="true"
                />
              )}
            </button>
          </PopoverTrigger>
          <NotificationDropdown
            notifications={notifications}
            isLoading={isLoadingNotifications}
            unreadCount={unreadCount}
            onMarkAllAsRead={markAllAsRead}
            onMarkAsRead={markAsRead}
            onDelete={deleteNotification}
            isMarkingAllAsRead={isMarkingAllAsRead}
          />
        </Popover>

        {/* Profile */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full p-1 hover:bg-black/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#6619DE] focus:ring-offset-2"
              aria-label="Open user menu"
              aria-haspopup="menu"
            >
              {user.user.avatar_url ? (
                <img
                  src={user.user.avatar_url}
                  alt={`${userFullName}'s profile picture`}
                  className="size-10 rounded-full object-cover"
                />
              ) : (
                <AviPlaceholder
                  aria-label={`${userFullName}'s avatar placeholder`}
                />
              )}
              <div className="hidden md:flex flex-col text-left leading-tight pr-2">
                <span className="text-sm font-semibold text-[#251F2D]">
                  {userFullName}
                </span>
                <span className="text-xs text-gray-500">
                  {user.user.email}
                </span>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            sideOffset={8}
            className="w-56 p-3 bg-white rounded-xl shadow-xl border border-gray-100"
          >
            <div className="flex flex-col gap-1">
              <Link
                to="/settings"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#251F2D] hover:bg-[#F3EBFF] transition-colors group"
              >
                <Settings
                  size={18}
                  className="text-[#6619DE] group-hover:rotate-90 transition-transform duration-300"
                />
                <span className="text-sm font-medium">Settings</span>
              </Link>
              <button
                type="button"
                onClick={() => useAuthStore.getState().logout()}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#EF4444] hover:bg-red-50 transition-colors w-full"
              >
                <LogOut size={18} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export default AppTopbar;

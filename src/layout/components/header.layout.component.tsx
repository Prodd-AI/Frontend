import { Bell } from "lucide-react";
import Logo from "@/shared/components/Logo.component";
import AviPlaceholder from "@/shared/components/avi-placeholder.component";
import NotificationDropdown from "./notification-dropdown.component";
import { Popover, PopoverTrigger } from "@/components/ui/popover";

const HeaderLayoutComponent = () => {
  // Dummy user data
  const userFullName = "Sarah Chen";
  const userEmail = "sarah.chen@company.com";
  const userAvatarUrl = null; // Set to null to use placeholder, or provide a URL for dummy avatar

  // Check if user has notifications (placeholder - can be replaced with actual logic)
  const hasNotifications = true; // TODO: Replace with actual notification state

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E5E7EB] backdrop-blur-sm bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Right side - Notifications and User Profile */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Notification Bell with Dropdown */}
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#6619DE] focus:ring-offset-2"
                  aria-label="Notifications"
                >
                  <Bell
                    size={32}
                    className="text-[#251F2D]"
                    aria-hidden="true"
                  />
                  {hasNotifications && (
                    <span
                      className="absolute top-1 right-1 size-[14px] bg-[#EF4444] rounded-full border-2 border-white"
                      aria-label="Unread notifications"
                    />
                  )}
                </button>
              </PopoverTrigger>
              <NotificationDropdown />
            </Popover>

            {/* User Profile Section */}
            <div className="flex items-center gap-3">
              {/* Avatar */}
              {userAvatarUrl ? (
                <img
                  src={userAvatarUrl}
                  alt={`${userFullName}'s profile picture`}
                  className="size-10 rounded-full object-cover"
                />
              ) : (
                <div className="size-10 flex-shrink-0 flex items-center justify-center overflow-hidden rounded-full">
                  <div className="scale-[0.8]">
                    <AviPlaceholder />
                  </div>
                </div>
              )}

              {/* User Info */}
              <div className="hidden sm:flex flex-col">
                <h1 className="text-[#251F2D] font-bold text-base leading-tight">
                  {userFullName}
                </h1>
                <p className="text-[#5A5D61] text-sm font-normal leading-tight">
                  {userEmail}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderLayoutComponent;

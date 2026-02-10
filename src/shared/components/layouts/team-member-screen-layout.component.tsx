import { useState, useEffect, useRef, useCallback } from "react";
import { Outlet, Navigate, useMatches, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Logo from "../Logo.component";
import { Bell, X, Settings, LogOut } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useAuthStore from "@/config/stores/auth.store";
import { refresh_auth_with_team_member_profile } from "@/config/services/auth.service";
import Loader from "../loader.component";
import AviPlaceholder from "../avi-placeholder.component";
import HRBadgeIcon from "@/components/ui/hr-badge-icon";
import { RxHamburgerMenu } from "react-icons/rx";
import NotificationDropdown from "@/layout/components/notification-dropdown.component";
import useAppNotifications from "@/shared/hooks/use-socket-notifications";

/**
 * Layout component that provides the team member screen scaffold
 * Provides authentication check, header with logo, notifications, and user profile
 * Automatically shows HR badge for users with HR role
 *
 * Uses TanStack Query with side effects handled directly in queryFn for clean,
 * effect-free implementation.
 *
 * WCAG 2.1 AA Compliant:
 * - Semantic HTML landmarks (header, main, nav)
 * - Skip link for keyboard navigation
 * - Focus management for mobile menu
 * - Proper ARIA attributes for interactive elements
 * - Keyboard navigation support (Escape to close menu)
 * - Screen reader announcements for loading states
 */
function TeamMemberScreenLayout() {
  const { user, isAuthenticated } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const matches = useMatches();
  const currentMatch = matches[matches.length - 2];
  const headerChild = (currentMatch?.handle as RouteHandle)?.headerChild;
  const pathname = currentMatch.pathname;
  const { isLoading, isError } = useQuery({
    queryKey: ["auth", "session"],
    queryFn: async () => {
      const refresh_token_id = localStorage.getItem("refresh_token_id");
      console.log(refresh_token_id);
      if (!refresh_token_id) {
        throw new Error("No refresh token found");
      }

      try {
        const res = await refresh_auth_with_team_member_profile({
          refresh_token_id,
        });

        if (res.data?.user) {
          useAuthStore.getState().setUser(res.data, res.data.access_token);
          localStorage.setItem("refresh_token_id", res.data.refresh_token);
        }

        return res.data;
      } catch (error) {
        localStorage.removeItem("refresh_token_id");
        useAuthStore.setState({
          user: null,
          isAuthenticated: false,
          token: null,
        });
        throw error;
      }
    },
    enabled: !isAuthenticated || !user,
    retry: false,
    staleTime: Infinity,
  });

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    menuToggleRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMenuOpen) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen, closeMenu]);

  useEffect(() => {
    if (isMenuOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen || !menuPanelRef.current) return;

    const menuPanel = menuPanelRef.current;
    const focusableElements = menuPanel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      if (event.shiftKey) {
        if (document.activeElement === firstFocusable) {
          event.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          event.preventDefault();
          firstFocusable?.focus();
        }
      }
    };

    menuPanel.addEventListener("keydown", handleTabKey);
    return () => {
      menuPanel.removeEventListener("keydown", handleTabKey);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);
  const { notifications, markAllAsRead } = useAppNotifications();
  if (isError && !isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  if (isLoading) {
    return (
      <div
        className="h-screen w-full flex justify-center items-center"
        role="status"
        aria-live="polite"
        aria-label="Loading your dashboard"
      >
        <Loader />
        <span className="sr-only">Loading, please wait...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" />;
  }

  const isHR = user?.user.user_role === "hr";
  const userFullName = `${user?.user.first_name} ${user?.user.last_name}`;

  const unreadNotifications = notifications.filter((n) => !n.is_read);
  const notificationCount = unreadNotifications.length;
  const isNotification = notificationCount > 0;

  return (
    <div className="bg-gradient-to-b from-[#E4D6FA]/60 to-[#F8F8F9] min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:text-[#6619DE] focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:font-semibold focus:outline-none focus:ring-2 focus:ring-[#6619DE] focus:ring-offset-2"
      >
        Skip to main content
      </a>

      <header
        className="bg-[#F8F8F98A] backdrop-blur-[16.8px] sticky top-0 z-50"
        role="banner"
      >
        <div className="max-w-[1920px] mx-auto p-[22px] sm:px-[2.75rem] flex justify-between items-center min-h-[96px]">
          <div className="flex items-center gap-[1.75rem]">
            <Link to={pathname}>
              <Logo />
            </Link>

            {isHR && (
              <div
                className="bg-linear-0 from-[#6619DE] to-[#934DFF] w-[116px] h-[26px] rounded-[5px] flex justify-center items-center gap-[5.4px] text-[0.7rem] text-[#F3F4F6]"
                role="status"
                aria-label="HR Manager role badge"
              >
                <HRBadgeIcon aria-hidden="true" />
                <span>HR Manager</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-[1.75rem]">
            {/* Desktop Navigation */}
            <nav
              className="hidden sm:flex items-center gap-[1.75rem]"
              aria-label="Main navigation"
            >
              {headerChild}
            </nav>

            <div className="flex items-center gap-[30px] sm:gap-[4rem]">
              {/* Notification Bell Button */}
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="relative p-2 rounded-lg hover:bg-black/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#6619DE] focus:ring-offset-2"
                    aria-label={`Notifications${
                      notificationCount > 0
                        ? `, ${notificationCount} unread`
                        : ""
                    }`}
                  >
                    <Bell size={32} aria-hidden="true" />
                    {isNotification && (
                      <span
                        className="size-[14px] bg-[#EF4444] rounded-full absolute top-1 right-1"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </PopoverTrigger>
                <NotificationDropdown
                  notifications={notifications}
                  onMarkAllAsRead={markAllAsRead}
                />
              </Popover>

              {/* User Profile Section with Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center cursor-pointer rounded-lg p-1 hover:bg-black/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#6619DE] focus:ring-offset-2"
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

                    <div className="hidden sm:flex flex-col ml-[11px] text-left">
                      <h1 className="text-[#251F2D] font-bold text-base">
                        {userFullName}
                      </h1>
                      <p className="text-[#5A5D61] text-sm font-normal">
                        {user?.user.email}
                      </p>
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

              {/* Mobile Hamburger Menu Button */}
              <button
                ref={menuToggleRef}
                type="button"
                className="sm:hidden p-2 rounded-lg hover:bg-black/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#6619DE] focus:ring-offset-2"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu-panel"
                aria-haspopup="dialog"
              >
                <RxHamburgerMenu size={28} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 sm:hidden transition-opacity duration-300"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel - Accessible Dialog */}
      <div
        ref={menuPanelRef}
        id="mobile-menu-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed top-0 right-0 h-full w-[300px] bg-white z-50 sm:hidden transform transition-transform duration-300 ease-out shadow-2xl ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        inert={!isMenuOpen ? true : undefined}
      >
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeMenu}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#6619DE] focus:ring-offset-2"
            aria-label="Close navigation menu"
          >
            <X size={24} className="text-gray-600" aria-hidden="true" />
          </button>
        </div>

        {/* User info in mobile menu */}
        <div className="px-6 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {user.user.avatar_url ? (
              <img
                src={user.user.avatar_url}
                alt={`${userFullName}'s profile picture`}
                className="size-12 rounded-full object-cover"
              />
            ) : (
              <AviPlaceholder
                aria-label={`${userFullName}'s avatar placeholder`}
              />
            )}
            <div className="flex flex-col">
              <h2 className="text-[#251F2D] font-bold text-base">
                {userFullName}
              </h2>
              <p className="text-[#5A5D61] text-sm">{user?.user.email}</p>
            </div>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav
          className="flex flex-col px-6 py-6 gap-4"
          aria-label="Mobile navigation"
        >
          {headerChild}
        </nav>
      </div>

      {/* Main Content Area */}
      <main
        id="main-content"
        className="max-w-[1920px] mx-auto px-2 sm:px-[2.75rem]"
        tabIndex={-1}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default TeamMemberScreenLayout;

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { Outlet, Navigate, useMatches } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { RxHamburgerMenu } from "react-icons/rx";
import useAuthStore from "@/config/stores/auth.store";
import { refresh_auth_with_team_member_profile } from "@/config/services/auth.service";
import Loader from "../loader.component";
import AppSidebar from "./app-sidebar.component";
import AppTopbar from "./app-topbar.component";
import {
  getSidebarNavForRole,
  getSidebarFooterForRole,
} from "./role-sidebar-nav";
import { GuidedTour } from "@/shared/components/guided-tour";

/**
 * Authenticated app shell: persistent left sidebar + top bar + routed outlet.
 *
 * Route handles supply `sidebarNav` (nav items) and `headerActions` (top-bar
 * buttons). On mobile the sidebar collapses into a slide-in drawer triggered
 * by the hamburger; a11y plumbing (skip link, ESC close, focus trap, inert)
 * is preserved.
 */
function TeamMemberScreenLayout() {
  const { user, isAuthenticated } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const matches = useMatches();
  // Merge handles from all matches (leaf overrides ancestor) so intermediate
  // route layouts (e.g. dialog providers) don't shadow the layout's handle.
  const mergedHandle = matches.reduce<RouteHandle>((acc, m) => {
    const h = (m.handle as RouteHandle) ?? null;
    if (!h) return acc;
    return { ...acc, ...h };
  }, {});
  const userRole = user?.user.user_role ?? "";
  const sidebarNav =
    mergedHandle.sidebarNav ?? getSidebarNavForRole(userRole);
  const headerActions = mergedHandle.headerActions;
  const sidebarFooter =
    mergedHandle.sidebarFooter ?? getSidebarFooterForRole(userRole);

  const { isLoading, isError } = useQuery({
    queryKey: ["auth", "session"],
    queryFn: async () => {
      const refresh_token_id = localStorage.getItem("refresh_token_id");
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

  return (
    <div className="min-h-screen bg-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:text-[#6619DE] focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:font-semibold focus:outline-none focus:ring-2 focus:ring-[#6619DE] focus:ring-offset-2"
      >
        Skip to main content
      </a>

      <GuidedTour />
      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside
          data-tour="sidebar-nav"
          className="hidden md:flex md:w-[240px] lg:w-[260px] shrink-0 sticky top-0 h-screen bg-white border-r border-gray-100"
          role="navigation"
          aria-label="Primary"
        >
          <AppSidebar items={sidebarNav} footer={sidebarFooter} />
        </aside>

        {/* Right column: topbar + content */}
        <div className="flex-1 min-w-0 flex flex-col">
          <header
            className="sticky top-0 z-30 bg-white"
            role="banner"
          >
            <div className="flex items-center gap-2 md:hidden px-4 pt-3">
              <button
                ref={menuToggleRef}
                type="button"
                className="p-2 rounded-lg hover:bg-black/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#6619DE] focus:ring-offset-2"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu-panel"
                aria-haspopup="dialog"
              >
                <RxHamburgerMenu size={24} aria-hidden="true" />
              </button>
            </div>
            <AppTopbar actions={headerActions} />
          </header>

          <main
            id="main-content"
            className="flex-1 px-4 sm:px-8 py-6 max-w-[1600px] w-full mx-auto"
            tabIndex={-1}
          >
            <Suspense
              fallback={
                <div className="h-[50vh] flex justify-center items-center">
                  <Loader />
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>

      {/* Mobile drawer overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      <div
        ref={menuPanelRef}
        id="mobile-menu-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed top-0 left-0 h-full w-[280px] bg-white z-50 md:hidden transform transition-transform duration-300 ease-out shadow-2xl ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        inert={!isMenuOpen ? true : undefined}
      >
        <div className="flex justify-end p-3">
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
        <div className="h-[calc(100%-3.5rem)]">
          <AppSidebar items={sidebarNav} footer={sidebarFooter} />
        </div>
      </div>
    </div>
  );
}

export default TeamMemberScreenLayout;

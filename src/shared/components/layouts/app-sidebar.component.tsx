import { ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Settings, LogOut } from "lucide-react";
import Logo from "../Logo.component";
import useAuthStore from "@/config/stores/auth.store";
import { cn } from "@/lib/utils";
import { useOverviewAlerts } from "@/shared/hooks/use-overview-alerts";

interface AppSidebarProps {
  items: SidebarNavItem[];
  footer?: ReactNode;
}

function navItemClass(isActive: boolean) {
  return cn(
    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
    isActive
      ? "bg-[#F3EBFF] text-[#251F2D]"
      : "text-[#5A5D61] hover:bg-[#F5F0FF] hover:text-[#251F2D]",
  );
}

function NavItem({ item }: { item: SidebarNavItem }) {
  const location = useLocation();
  const { totalPendingCount, nextMeeting } = useOverviewAlerts();

  if (item.render) {
    // Render-prop items handle their own active state and click semantics.
    return <>{item.render({ isActive: false })}</>;
  }

  const matchesSearch = (() => {
    if (!item.matchSearch) return true;
    const params = new URLSearchParams(location.search);
    return Object.entries(item.matchSearch).every(
      ([key, value]) => params.get(key) === value,
    );
  })();

  if (!item.to) return null;

  const showBadge =
    (item.badgeKey === "tasks" && totalPendingCount > 0) ||
    (item.badgeKey === "meetings" && nextMeeting !== null);
  const badgeAria =
    item.badgeKey === "tasks"
      ? `${totalPendingCount} pending`
      : item.badgeKey === "meetings" && nextMeeting
        ? `Meeting in ${nextMeeting.minutesUntil} minutes`
        : undefined;

  return (
    <NavLink
      to={item.to}
      end={item.end ?? false}
      className={({ isActive }) => navItemClass(isActive && matchesSearch)}
    >
      <span className="text-base shrink-0" aria-hidden="true">
        {item.icon}
      </span>
      <span className="flex-1">{item.label}</span>
      {showBadge && (
        <span
          className="size-2 rounded-full bg-amber-500"
          aria-label={badgeAria}
        />
      )}
    </NavLink>
  );
}

function AppSidebar({ items, footer }: AppSidebarProps) {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="h-[72px] px-6 flex items-center border-b border-gray-100">
        <Link to="/" aria-label="Prodily home">
          <Logo />
        </Link>
      </div>

      <nav
        className="flex-1 px-4 pt-4 flex flex-col gap-1 overflow-y-auto"
        aria-label="Sidebar navigation"
      >
        {items.map((item, idx) => (
          <NavItem key={`${item.label}-${idx}`} item={item} />
        ))}
      </nav>

      <div className="px-4 pb-6 pt-4 flex flex-col gap-1">
        <NavLink
          to="/settings"
          className={({ isActive }) => navItemClass(isActive)}
        >
          <Settings size={18} aria-hidden="true" />
          <span>Settings</span>
        </NavLink>
        <button
          type="button"
          onClick={() => useAuthStore.getState().logout()}
          className={cn(
            "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
            "text-[#EF4444] hover:bg-red-50",
          )}
        >
          <LogOut size={18} aria-hidden="true" />
          <span>Log out</span>
        </button>

        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </div>
  );
}

export default AppSidebar;

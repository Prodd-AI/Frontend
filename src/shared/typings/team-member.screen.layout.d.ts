interface SidebarNavItem {
  label: string;
  icon: ReactNode;
  /** When provided, item renders as a NavLink (active = URL match). */
  to?: string;
  /** Optional URL search match — when set, the item is active iff every entry matches the current URL. */
  matchSearch?: Record<string, string>;
  /** Render-prop alternative — useful for items that open a dialog instead of navigating (e.g. Logout). */
  render?: (ctx: { isActive: boolean }) => ReactNode;
  /** When true, NavLink matches only when path matches exactly (end). Default: true for index items, false otherwise. */
  end?: boolean;
}

interface RouteHandle {
  /** @deprecated Use sidebarNav + headerActions instead. */
  headerChild?: ReactNode;
  sidebarNav?: SidebarNavItem[];
  /** Action buttons rendered in the top bar (right cluster). */
  headerActions?: ReactNode;
  /** Optional: render a promo card at the bottom of the sidebar (e.g. Invite team). */
  sidebarFooter?: ReactNode;
}

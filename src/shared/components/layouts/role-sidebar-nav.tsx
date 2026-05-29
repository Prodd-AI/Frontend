import type { ReactNode } from "react";
import { MdOutlineDashboard } from "react-icons/md";
import { MdOutlineCenterFocusStrong } from "react-icons/md";
import { RiHeartPulseLine } from "react-icons/ri";
import { GoGraph } from "react-icons/go";
import { IoCheckmarkOutline, IoWarningOutline } from "react-icons/io5";
import { LuClock2, LuFileClock } from "react-icons/lu";
import { HiOutlineUserGroup } from "react-icons/hi";
import { RxPerson } from "react-icons/rx";
import InviteTeamPromo from "./invite-team-promo.component";

type UserRole = "hr" | "team_lead" | "team_member" | "super_admin" | string;

export const hr_sidebar_nav: SidebarNavItem[] = [
  {
    label: "Overview",
    icon: <MdOutlineDashboard size={18} />,
    to: "/dash/hr",
    end: true,
    badgeKey: "meetings",
  },
  {
    label: "Mood Heatmap",
    icon: <RiHeartPulseLine size={18} />,
    to: "/dash/hr/mood",
  },
  {
    label: "Team Analysis",
    icon: <GoGraph size={18} />,
    to: "/dash/hr/team-analysis",
  },
  {
    label: "Flight Risks",
    icon: <IoWarningOutline size={18} />,
    to: "/dash/hr/flight-risks",
  },
  {
    label: "Teams",
    icon: <HiOutlineUserGroup size={18} />,
    to: "/dash/hr/teams",
  },
];

export const team_leader_sidebar_nav: SidebarNavItem[] = [
  {
    label: "Overview",
    icon: <MdOutlineDashboard size={18} />,
    to: "/dash/team-lead",
    end: true,
    badgeKey: "meetings",
  },
  {
    label: "Today's Focus",
    icon: <MdOutlineCenterFocusStrong size={18} />,
    to: "/dash/team-lead/todays-focus",
  },
  {
    label: "Task",
    icon: <IoCheckmarkOutline size={18} />,
    to: "/dash/team-lead/tasks",
    badgeKey: "tasks",
  },
  {
    label: "Timesheet",
    icon: <LuFileClock size={18} />,
    to: "/dash/team-lead/timesheet",
  },
  {
    label: "Recent Mood",
    icon: <LuClock2 size={18} />,
    to: "/dash/team-lead/recent-moods",
  },
  {
    label: "My Team",
    icon: <RxPerson size={18} />,
    to: "/dash/team-lead/view-team",
  },
];

export const team_member_sidebar_nav: SidebarNavItem[] = [
  {
    label: "Overview",
    icon: <MdOutlineDashboard size={18} />,
    to: "/dash/team-member",
    end: true,
    badgeKey: "meetings",
  },
  {
    label: "Today's Focus",
    icon: <MdOutlineCenterFocusStrong size={18} />,
    to: "/dash/team-member/todays-focus",
  },
  {
    label: "Task",
    icon: <IoCheckmarkOutline size={18} />,
    to: "/dash/team-member/tasks",
    badgeKey: "tasks",
  },
  {
    label: "Timesheet",
    icon: <LuFileClock size={18} />,
    to: "/dash/team-member/timesheet",
  },
  {
    label: "Recent Mood",
    icon: <LuClock2 size={18} />,
    to: "/dash/team-member/recent-moods",
  },
];

export function getSidebarNavForRole(role: UserRole): SidebarNavItem[] {
  switch (role) {
    case "hr":
      return hr_sidebar_nav;
    case "team_lead":
      return team_leader_sidebar_nav;
    case "team_member":
      return team_member_sidebar_nav;
    default:
      return [];
  }
}

export function getSidebarFooterForRole(role: UserRole): ReactNode {
  if (role === "hr" || role === "team_lead") return <InviteTeamPromo />;
  return null;
}

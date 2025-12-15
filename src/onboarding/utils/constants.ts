import { FaUserShield } from "react-icons/fa";
import { MdPeopleAlt } from "react-icons/md";
import { FaUserTie } from "react-icons/fa";
import { IconType } from "react-icons/lib";
import { TeamMemberRole } from "@/shared/typings/team-member";
export const role_cards: Array<{
  title: string;
  description: string;
  value: TeamMemberRole;
  Icon: IconType;
}> = [
  {
    title: "Team Member",
    description:
      "Complete tasks, receive call notifications, & track personal progress & performance.",
    value: "team_member",
    Icon: MdPeopleAlt,
  },
  {
    title: "Team Lead",
    description:
      "Oversee team by assigning tasks, scheduling calls, & reviewing progress & performance.",
    value: "team_lead",
    Icon: FaUserShield,
  },
  {
    title: "HR/Admin",
    description:
      "Set up teams, manage employee profiles, and track overall performance.",
    value: "hr",
    Icon: FaUserTie,
  },
];

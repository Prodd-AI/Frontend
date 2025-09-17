import { HiOutlineUserGroup } from "react-icons/hi2";
import { IoCheckboxOutline } from "react-icons/io5";
import { IoTrendingUpOutline } from "react-icons/io5";
import { GoAlert } from "react-icons/go";
import { PiHeartbeatLight } from "react-icons/pi";
import type { StatusCardItem } from "../typings/status-cards.d";

export const sample_status_cards: StatusCardItem[] = [
  {
    id: "total_employees",
    title: "Total Employees",
    value: 156,
    description: "Total number of employees on board",
    icon: HiOutlineUserGroup({ size: 18 }),
    delta_value: 0.3,
    delta_period: "vs Last week",
  },
  {
    id: "checkin_rate",
    title: "Check-in Rate",
    value: 87,
    value_suffix: "%",
    description: "More employees are checking in daily",
    icon: IoCheckboxOutline({ size: 18 }),
    delta_value: 5,
    delta_period: "vs Last week",
    delta_color: "success",
  },
  {
    id: "average_mood",
    title: "Average Mood",
    value: 3.8,
    description: "Avg. team mood improved this week",
    icon: IoTrendingUpOutline({ size: 18 }),
    delta_value: 0.3,
    delta_period: "vs Last week",
  },
  {
    id: "flight_risk",
    title: "Flight Risk",
    value: 12,
    description: "More team members pose risk",
    icon: GoAlert({ size: 18 }),
    delta_value: -2,
    delta_period: "Needs Attention",
    delta_color: "danger",
  },
  {
    id: "burnout_alerts",
    title: "Burnout Alerts",
    value: 4,
    description: "Employees showing signs of burnout",
    icon: PiHeartbeatLight({ size: 18 }),
    delta_value: -1,
    delta_period: "vs Last week",
    delta_color: "danger",
  },
];

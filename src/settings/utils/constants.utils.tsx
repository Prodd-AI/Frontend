import { CiUser } from "react-icons/ci";
import { PiGearLight } from "react-icons/pi";
import { CiCircleCheck } from "react-icons/ci";
import { IoShieldOutline } from "react-icons/io5";
// import { PiUsersLight } from "react-icons/pi";
import { TbFocusCentered } from "react-icons/tb";
import { IoCheckmark } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";

export const tabs = [
  {
    label: "Profile Overview",
    value: "overview",
    icon: <CiUser size={20} />,
  },

  {
    label: "Account Settings",
    value: "account",
    icon: <PiGearLight size={20} />,
  },

  {
    label: "Preferences",
    value: "preferences",
    icon: <CiCircleCheck size={20} />,
  },
  {
    label: "Privacy Policy",
    value: "privacy",
    icon: <IoShieldOutline size={20} />,
  },
  // {
  //   label: "Team Details",
  //   value: "team",
  //   icon: <PiUsersLight size={20} />,
  // },
];

export const tabItems = [
  {
    label: "Today's Focus",
    value: "todays_focus",
    icon: <TbFocusCentered size={20} />,
  },
  {
    label: "Tasks",
    value: "tasks",
    icon: <IoCheckmark size={20} />,
  },
  {
    label: "Recent Mood",
    value: "mood",
    icon: <FaRegClock size={20} />,
  },
];

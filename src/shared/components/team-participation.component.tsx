import { clsx }from "clsx";
import { GrGroup } from "react-icons/gr";
import type { TeamParticipationSliderPropsInt } from "../typings/team-participation";


/**
 * TeamParticipationSlider - A visual component that displays team engagement metrics and participation rates.
 *
 * This component provides a clear overview of team activity by showing:
 * - Real-time team participation percentage with animated progress bar
 * - Active vs total team members ratio
 * - Visual progress indicator with smooth gradient transitions
 * - Interactive hover effects for enhanced user experience
 *
 * The component features a clean, professional design with blue/gray gradient themes and smooth animations
 * that help team leaders quickly assess team engagement levels.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <TeamParticipationSlider
 *   totalTeamMembers={12}
 *   activeTeamMembers={9}
 *   teamParticipationPercentage={75}
 * />
 *
 * // With custom title and styling
 * <TeamParticipationSlider
 *   title="Weekly Team Engagement"
 *   totalTeamMembers={25}
 *   activeTeamMembers={20}
 *   teamParticipationPercentage={80}
 *   className="mb-6 shadow-2xl"
 * />
 * ```
 *
 * @param {Object} props - Component props
 * @param {string} [props.title="Team Participation"] - The title displayed at the top of the component
 * @param {number} props.totalTeamMembers - Total number of team members in the organization
 * @param {number} props.activeTeamMembers - Number of currently active/participating team members
 * @param {number} props.teamParticipationPercentage - Participation rate as percentage (0-100)
 * @param {ClassValue} [props.className] - Additional CSS classes for custom styling
 *
 * @returns {JSX.Element} A styled team participation dashboard with animated progress indicator
 *
 * @author wizzy
 * @version 1.0.0
 * @since 2025-09-03
 */
function TeamParticipationSlider({
  className,
  title = "Team Participation",
  totalTeamMembers,
  activeTeamMembers,
  teamParticipationPercentage,
}: TeamParticipationSliderPropsInt) {
  return (
    <div
      className={clsx(
        className,
        ` bg-[#F8F8F9] border h-[12.375rem] rounded-[20px] shadow-xl px-[15px] py-[30px] transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-[1.02] cursor-pointer`
      )}
    >
      <div className="">
        <div className="flex items-center gap-2 transition-colors duration-200">
          <GrGroup
            className="text-[#1186DA] transition-transform duration-200 hover:scale-110"
            size={22.5}
          />{" "}
          <h3 className="text-[#6B7280] text-[1.375rem] font-[600] transition-colors duration-200">
            {title}
          </h3>
        </div>
        <div className=" flex justify-between mt-2 items-center mx-4 transition-opacity duration-300 hover:opacity-90">
          <span className=" text-[#25AC42] text-[2.486rem] font-bold transition-all duration-300 hover:scale-105">{`${teamParticipationPercentage}%`}</span>
          <span className=" text-[#6B7280] font-[500] transition-colors duration-200">
            {`${activeTeamMembers}/${totalTeamMembers}`} Team members are active
          </span>
        </div>
        <div className=" min-w-[81.375rem] relative h-[12px] bg-[#EAEBEB] mx-4 rounded-[100px] mt-[15px] overflow-hidden">
          <div
            className=" w-full absolute h-full rounded-[100px] bg-linear-to-r from-[#251F2D] to-[#686371] transition-all duration-1000 ease-out"
            style={{
              width: `${teamParticipationPercentage}%`,
              transform: "translateX(0)",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default TeamParticipationSlider;

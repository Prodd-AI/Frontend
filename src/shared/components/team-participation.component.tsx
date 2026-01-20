import { clsx } from "clsx";
import { GrGroup } from "react-icons/gr";
import { TeamParticipationSliderPropsInt } from "@/shared/typings/team-participation";

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

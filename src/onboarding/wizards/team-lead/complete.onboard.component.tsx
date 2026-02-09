import { IoCheckmarkDone } from "react-icons/io5";

const CompleteTeamLeadOnBoard = () => (
  <div className="flex justify-center items-center flex-col">
    <div className="size-[80px] rounded-full flex justify-center items-center bg-[#e6f7e9] mb-6">
      <IoCheckmarkDone size={40} className="text-[#22c55e]" />
    </div>
    <div className="text-center">
      <h3 className="font-semibold text-[22px] text-[#251F2D]">
        You're all set to lead your team.
      </h3>
      <p className="text-[#6F7277] font-medium text-[16px]">
        Start managing goals and tracking progress effectively
      </p>
    </div>
  </div>
);

export default CompleteTeamLeadOnBoard;

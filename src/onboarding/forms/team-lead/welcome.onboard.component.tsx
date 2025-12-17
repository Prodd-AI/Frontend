import { RiUserLine } from "react-icons/ri";

const WelcomeTeamLeadOnBoard = () => (<div className="flex justify-center items-center flex-col">
    <div className="size-[128px] rounded-full flex justify-center items-center bg-[#F3EDFE]">
        <RiUserLine size={68} className="text-[#6619DE]" />
    </div>
    <div className=" text-center">
        <h3 className="font-semibold text-[22px] text-[#251F2D]">Welcome on Board 🎉</h3>
        <p className=" text-[#6F7277] font-medium text-[16px]">You've been added as a team lead in <b>ACME Corp</b></p>
    </div>

</div>)

export default WelcomeTeamLeadOnBoard
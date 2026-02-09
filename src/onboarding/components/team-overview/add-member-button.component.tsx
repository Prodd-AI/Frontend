import { PiPlusBold } from "react-icons/pi";

const AddMemberButton = ({ onClick }: AddMemberButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full h-full min-h-[70px] flex flex-col justify-center items-center gap-1 text-[#6B7280] hover:text-[#6619DE] transition-colors cursor-pointer"
  >
    <div className="w-6 h-6 rounded-full bg-[#F3F4F6] flex items-center justify-center">
      <PiPlusBold className="text-sm" />
    </div>
    <span className="text-[10px] text-center font-medium leading-tight">
      Add Member
    </span>
  </button>
);

export default AddMemberButton;

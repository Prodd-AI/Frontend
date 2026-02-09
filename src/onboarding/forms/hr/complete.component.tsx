import { IoCheckmarkDone } from "react-icons/io5";

function Complete() {
  return (
    <div className="flex justify-center items-center flex-col py-10">
      <div className="size-[80px] rounded-full flex justify-center items-center bg-[#e6f7e9] mb-6">
        <IoCheckmarkDone size={40} className="text-[#22c55e]" />
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-[22px] text-[#251F2D]">All Set!</h3>
        <p className="text-[#6F7277] font-medium text-[16px] mt-2">
          Your organization has been successfully set up.
        </p>
      </div>
    </div>
  );
}

export default Complete;

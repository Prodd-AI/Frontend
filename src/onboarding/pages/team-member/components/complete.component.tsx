import { FaCheckDouble } from "react-icons/fa6";

const CompleteComponent = () => {
  return (
    <div className="flex justify-center items-center flex-col">
      <div className="size-[80px] rounded-full flex justify-center items-center bg-[#e6f7e9] mb-6">
        <FaCheckDouble size={40} className="text-[#16a34a]" />
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-[22px] text-[#251F2D] mb-2">
          You're ready to collaborate!
        </h3>
        <p className="text-[#6F7277] font-medium text-[16px]">
          Start working with your team and contributing to shared goals.
        </p>
      </div>
    </div>
  );
};

export default CompleteComponent;

import { RiUserLine } from "react-icons/ri";

const WelcomeComponent = () => {
  return (
    <div className="flex justify-center items-center flex-col">
      <div className="size-[128px] rounded-full flex justify-center items-center bg-[#F3EDFE]">
        <RiUserLine size={68} className="text-[#6619DE]" />
      </div>
      <div className="text-center mt-6">
        <h3 className="font-semibold text-[22px] text-[#251F2D]">
          Welcome to the Team! 🎉
        </h3>
        <p className="text-[#6F7277] font-medium text-[16px] mt-2">
          Connect with your team and start collaborating.
        </p>
      </div>
    </div>
  );
};

export default WelcomeComponent;

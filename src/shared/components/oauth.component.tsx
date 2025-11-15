import slackIcon from "@/assets/svgs/devicon_slack.svg";
import googleIcon from "@/assets/svgs/devicon_google.svg";
function Oauth() {
  return (
    <div className=" flex flex-col items-center">
      <p className=" text-[#454950] text-[1rem] font-medium mt-[27px]">
        or using
      </p>
      <div className=" flex gap-2 mt-[17px]">
        <button className="border border-[#6B72804F] hover:bg-black/10 transition-all duration-300 h-10 sm:h-[2.543rem] md:h-12 rounded-[9px] flex items-center py-[7px] px-[13px] gap-[10px] cursor-pointer">
          <img src={googleIcon} alt="Google" />
          <span className=" text-[#6B7280] font-medium text-[1rem]">
            Google account
          </span>
        </button>
        <button className="border border-[#6B72804F] hover:bg-black/10 transition-all duration-300 h-10 sm:h-[2.543rem] md:h-12 rounded-[9px] flex items-center py-[7px] px-[13px] gap-[10px] cursor-pointer">
          <img src={slackIcon} alt="Google" />
          <span className=" text-[#6B7280] font-medium text-[1rem]">Slack</span>
        </button>
      </div>
    </div>
  );
}

export default Oauth;

import { clsx } from "clsx";
import { TbWaveSawTool } from "react-icons/tb";
import { TodaysProgresssPropsInt } from "@/shared/typings/todays-progress";
import { MOOD_EMOJIS } from "@/shared/utils/constants";

const getMoodEmoji = (moodScore: number): string => {
  if (moodScore >= 5) return MOOD_EMOJIS.great;
  if (moodScore >= 4) return MOOD_EMOJIS.good;
  if (moodScore >= 3) return MOOD_EMOJIS.okay;
  if (moodScore >= 2) return MOOD_EMOJIS.notGreat;
  return MOOD_EMOJIS.rough;
};

function TodaysProgress({
  title = "Today's Progress",
  numberOfTaskCompleted,
  totalNumberOfTask,
  avgMood,
  className,
}: TodaysProgresssPropsInt) {
  const progress_metric =
    totalNumberOfTask > 0
      ? (numberOfTaskCompleted / totalNumberOfTask) * 100
      : 0;

  return (
    <div
      className={clsx(
        `w-[33.563rem] h-[18rem]  bg-[#F8F8F9] rounded-[20px] px-[1.25rem] py-[1.875rem]`,
        className,
      )}
      style={{
        boxShadow:
          "0px 4px 4px -4px rgba(12, 12, 13, 0.05), 0px 16px 16px -8px rgba(12, 12, 13, 0.1)",
      }}
    >
      <div className="flex items-center gap-2 transition-colors duration-200">
        <TbWaveSawTool
          size={20}
          className=" text-[#6619DE] font-bold transition-transform duration-200 hover:scale-110"
        />
        <h3 className=" font-[600] text-[1.375rem] text-[#6B7280] transition-colors duration-200">
          {title}
        </h3>
      </div>
      <div className="flex flex-col mt-4 gap-5">
        <div className=" flex justify-between transition-opacity duration-300 hover:opacity-80">
          <span className=" font-bold text-[#6B7280] text-[1rem]">
            Task Completed
          </span>
          <span className=" text-[#6B7280]">{`${numberOfTaskCompleted}/${totalNumberOfTask}`}</span>
        </div>
        <div className=" relative w-full h-[12px] bg-[#EAEBEB] rounded-[100px] overflow-hidden">
          <div
            className=" absolute w-full h-full rounded-[100px] bg-linear-to-tr from-[#370D78] to-[#1186DA] transition-all duration-1000 ease-out"
            style={{
              width: `${progress_metric}%`,
              transform: "translateX(0)",
            }}
          ></div>
        </div>
        <div className="flex gap-[14px] mt-3">
          <div className=" flex justify-center items-center bg-[#EDE2FE] flex-col w-[14.625rem] h-[5.563rem] rounded-[14px] transition-all duration-300 ease-in-out hover:bg-[#DDD6FE] hover:shadow-md hover:scale-105 cursor-pointer">
            <span className="text-[#6619DE] font-bold text-[1.75rem] p-0 transition-all duration-200 hover:scale-110">
              {numberOfTaskCompleted}
            </span>
            <p className=" text-[#6B7280] font-medium text-[1rem] transition-colors duration-200">
              Completed
            </p>
          </div>
          <div className=" bg-[#1186DA1C] w-[14.625rem] h-[5.563rem] rounded-[14px] flex justify-center items-center flex-col transition-all duration-300 ease-in-out hover:bg-[#1186DA30] hover:shadow-md hover:scale-105 cursor-pointer">
            <span className="text-[2rem] transition-all duration-200 hover:scale-110">
              {getMoodEmoji(avgMood)}
            </span>
            <span className="text-[#6B7280] font-medium transition-colors duration-200">
              Avg. Mood
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodaysProgress;

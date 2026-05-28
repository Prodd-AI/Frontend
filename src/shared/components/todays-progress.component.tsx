import { clsx } from "clsx";
import { Activity } from "lucide-react";
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
        "bg-white rounded-3xl p-5 border border-gray-200 flex flex-col gap-4",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <Activity size={16} className="text-[#6619DE]" />
        <h3 className="text-sm font-semibold text-[#5A5D61]">{title}</h3>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-baseline">
          <span className="font-semibold text-[#251F2D] text-sm">
            Task Completed
          </span>
          <span className="text-xs text-[#6B7280]">
            {numberOfTaskCompleted}/{totalNumberOfTask}
          </span>
        </div>
        <div className="relative w-full h-2 bg-[#EAEBEB] rounded-full overflow-hidden">
          <div
            className="absolute h-full rounded-full bg-gradient-to-r from-[#6619DE] to-[#955DEB] transition-all duration-700 ease-out"
            style={{ width: `${progress_metric}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col items-center justify-center bg-[#F3EBFF] rounded-2xl py-3">
          <span className="text-[#6619DE] font-bold text-xl">
            {numberOfTaskCompleted}
          </span>
          <p className="text-xs text-[#6B7280] font-medium">Completed</p>
        </div>
        <div className="flex flex-col items-center justify-center bg-[#EFF6FF] rounded-2xl py-3">
          <span className="text-xl">{getMoodEmoji(avgMood)}</span>
          <span className="text-xs text-[#6B7280] font-medium">Avg. Mood</span>
        </div>
      </div>
    </div>
  );
}

export default TodaysProgress;

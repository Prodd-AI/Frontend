import { memo } from "react";
import clsx from "clsx";
import { Calendar, Check, Plus, Gift } from "lucide-react";
import { WeeklyStreakPropsInt, DayName } from "@/shared/typings/weekly-streak";

const DAYS_ORDER: DayName[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const WeeklyStreak = ({
  className,
  numberOfTaskCompleted,
  totalNumberOfTaskForTheDay,
  numberOfTaskCompletedForTheDay,
  weekTasks,
  customMessage,
}: WeeklyStreakPropsInt) => {
  const progressPercentage =
    totalNumberOfTaskForTheDay > 0
      ? (numberOfTaskCompletedForTheDay / totalNumberOfTaskForTheDay) * 100
      : 0;

  const isDayCompleted = (day: DayName): boolean | null => {
    if (!weekTasks) return null;
    const dayTasks = weekTasks[day];
    if (!dayTasks || dayTasks.length === 0) return null;
    return dayTasks.every((task) => task.task.status === "completed");
  };

  const calculateStreak = (): number => {
    const todayIndex = DAYS_ORDER.indexOf(
      new Date().toLocaleDateString("en-US", { weekday: "short" }) as DayName,
    );
    let streak = 0;
    for (let i = Math.min(todayIndex, DAYS_ORDER.length - 1); i >= 0; i--) {
      const result = isDayCompleted(DAYS_ORDER[i]);
      if (result === true) streak++;
      else if (result === false) break;
    }
    return streak;
  };

  const currentStreak = calculateStreak();

  const getProgressMessage = () => {
    if (numberOfTaskCompleted === 0) return "Let's get started!";
    if (progressPercentage < 50) return "Good start, keep going!";
    if (progressPercentage < 100) return "Excellent progress!";
    return "Excellent progress!";
  };

  return (
    <div
      className={clsx(
        "bg-white rounded-3xl p-5 border border-gray-200 flex flex-col gap-4",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <Calendar size={16} className="text-[#6619DE]" />
        <h3 className="text-sm font-semibold text-[#5A5D61]">Weekly Streak</h3>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xl">🔥</span>
        <p className="font-semibold text-[#251F2D]">
          <span className="font-bold">{numberOfTaskCompleted}</span> tasks
          Completed this week
        </p>
      </div>

      <div className="flex items-center justify-between text-xs text-[#6B7280]">
        <span>{customMessage || getProgressMessage()}</span>
        <span>
          {numberOfTaskCompletedForTheDay}/{totalNumberOfTaskForTheDay} tasks
          done
        </span>
      </div>

      <div className="h-2 w-full rounded-full bg-[#EAEBEB] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#6619DE] to-[#955DEB] transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="grid grid-cols-7 gap-2">
        {[1, 2, 3, 4, 5, 6, 7].map((dayNumber) => {
          const index = dayNumber - 1;
          const isCompleted = index < currentStreak;
          const isLastDay = dayNumber === 7;
          const dayLabel = dayNumber === 1 ? "1 Day" : `${dayNumber} Days`;

          return (
            <div
              className="flex flex-col items-center gap-1.5"
              key={dayNumber}
            >
              <span className="text-[10px] text-[#5A5D61] font-medium">
                {dayLabel}
              </span>
              <div
                className={clsx(
                  "size-8 rounded-md flex justify-center items-center",
                  isCompleted
                    ? "bg-[#6619DE] text-white"
                    : "bg-[#F3EBFF] text-[#6619DE]",
                )}
              >
                {isLastDay && !isCompleted ? (
                  <Gift size={14} />
                ) : isCompleted ? (
                  <Check size={14} />
                ) : (
                  <Plus size={14} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(WeeklyStreak);

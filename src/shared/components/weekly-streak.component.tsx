import { memo } from "react";
import clsx from "clsx";
import { FaRegCalendar } from "react-icons/fa";
import { FaMinus, FaCheck } from "react-icons/fa6";
import { FaGift } from "react-icons/fa";
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
    if (!dayTasks || dayTasks.length === 0) return null; // No tasks = skip
    return dayTasks.every((task) => task.task.status === "completed");
  };

  const calculateStreak = (): number => {
    const todayIndex = DAYS_ORDER.indexOf(
      new Date().toLocaleDateString("en-US", { weekday: "short" }) as DayName,
    );
    let streak = 0;
    // Count backwards from today
    for (let i = Math.min(todayIndex, DAYS_ORDER.length - 1); i >= 0; i--) {
      const result = isDayCompleted(DAYS_ORDER[i]);
      if (result === true) {
        streak++;
      } else if (result === false) {
        break; // Had tasks but didn't complete them — streak broken
      }
      // result === null (no tasks) — skip, don't break streak
    }
    return streak;
  };

  const currentStreak = calculateStreak();
  const getProgressIndicator = () => {
    if (numberOfTaskCompleted === 0) {
      return { emoji: "📋", message: "Let's get started!" };
    } else if (progressPercentage < 25) {
      return { emoji: "🌱", message: "Good start, keep going!" };
    } else if (progressPercentage < 50) {
      return { emoji: "⚡", message: "Making progress!" };
    } else if (progressPercentage < 75) {
      return { emoji: "🔥", message: "Great momentum!" };
    } else if (progressPercentage < 100) {
      return { emoji: "🚀", message: "Almost there!" };
    } else {
      return { emoji: "🔥", message: "Excellent progress! 🔥" };
    }
  };

  const { emoji, message } = getProgressIndicator();

  return (
    <div
      className={clsx(
        "w-[33.563rem] h-[16.438rem] bg-[#F8F8F9] rounded-[20px] p-[20px]",
        "transition-all duration-300 ease-in-out",
        className,
      )}
      style={{
        boxShadow:
          "0px 4px 4px -4px rgba(12, 12, 13, 0.05), 0px 16px 16px -8px rgba(12, 12, 13, 0.1)",
      }}
    >
      <div className="flex items-center w-fit gap-2">
        <FaRegCalendar
          className="text-[#1186DA] transition-colors duration-200"
          size={15}
        />
        <h2 className="text-[1.096rem] text-[#6B7280] font-medium">
          Weekly Streak
        </h2>
      </div>

      <div className="text-[1.888rem] flex items-center gap-2 mt-3">
        <span className={numberOfTaskCompleted > 0 ? "animate-pulse" : ""}>
          {emoji}
        </span>
        <p
          className={clsx(
            "font-bold transition-colors duration-200",
            numberOfTaskCompleted > 0 ? "text-[#10B981]" : "text-[#6B7280]",
          )}
        >
          {numberOfTaskCompleted} tasks done this week
        </p>
      </div>

      <div className="flex flex-col mt-4 gap-2">
        <div className="justify-between flex text-[#6B7280] text-[1rem] font-medium">
          <p className="transition-colors duration-200 hover:text-gray-800">
            {customMessage || message}
          </p>
          <p className="transition-colors duration-200 hover:text-gray-800">
            {`${numberOfTaskCompletedForTheDay}/${totalNumberOfTaskForTheDay}`}{" "}
            tasks completed today
          </p>
        </div>

        <div className="h-[0.75rem] w-full border rounded-[100px] relative bg-[#EAEBEB] overflow-hidden">
          <div
            className="absolute h-full rounded-[100px] bg-gradient-to-r from-[#251F2D] to-[#686371] transition-all duration-500 ease-out"
            style={{
              width: `${progressPercentage}%`,
            }}
          />
          {progressPercentage > 0 && (
            <div
              className="absolute h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"
              style={{ width: `${progressPercentage}%` }}
            />
          )}
        </div>
      </div>

      <div className="flex gap-3 mt-4 ml-2">
        {DAYS_ORDER.map((_, index) => {
          const dayNumber = index + 1;
          const isCompleted = index < currentStreak;
          const isLastDay = dayNumber === 7;
          const dayLabel = dayNumber === 1 ? "1 Day" : `${dayNumber} Days`;

          return (
            <div className="flex flex-col items-center gap-1" key={dayNumber}>
              <span className="text-xs text-[#504C57] font-semibold">
                {dayLabel}
              </span>
              <div
                className={clsx(
                  "size-[31px] rounded-[4.24px] flex justify-center items-center",
                  isCompleted
                    ? "bg-gradient-to-b from-[#6619DE] to-[#1186DA] shadow-sm"
                    : "bg-[#E0DAE8]",
                )}
              >
                {isLastDay && !isCompleted ? (
                  <FaGift className="text-[#F97316]" size={16} />
                ) : isCompleted ? (
                  <FaCheck className="text-[#fff]" />
                ) : (
                  <FaMinus className="text-[#6B7280]" size={14} />
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

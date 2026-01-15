import {
  memo,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import type { DayData } from "@/shared/typings/weekly-streak";
import clsx from "clsx";
import { FaRegCalendar } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import {
  WeeklyStreakRef,
  DayStatus,
  WeeklyStreakPropsInt,
} from "@/shared/typings/weekly-streak";

const DEFAULT_DAYS: DayData[] = [];

const WeeklyStreak = forwardRef<WeeklyStreakRef, WeeklyStreakPropsInt>(
  (
    {
      className,
      numberOfTaskCompleted,
      totalNumberOfTaskForTheDay,
      numberOfTaskCompletedForTheDay,
      days: propDays,
      onDayToggle,
      disabled = false,
      customMessage,
    },
    ref
  ) => {
    const [updatingDays, setUpdatingDays] = useState<Set<number>>(new Set());
    const days = propDays ?? DEFAULT_DAYS;

    const handleDayToggle = useCallback(
      async (day: number, currentStatus: DayStatus) => {
        if (disabled || updatingDays.has(day)) return;

        setUpdatingDays((prev) => new Set(prev).add(day));

        const newStatus: DayStatus =
          currentStatus === "completed" ? "pending" : "completed";

        try {
          if (onDayToggle) {
            await onDayToggle(day, newStatus);
          }
        } catch (error) {
          console.error("Failed to update day status:", error);
        } finally {
          setUpdatingDays((prev) => {
            const newSet = new Set(prev);
            newSet.delete(day);
            return newSet;
          });
        }
      },
      [onDayToggle, disabled, updatingDays]
    );

    const getWeekData = useCallback(() => {
      const completedDays = days.filter((d) => d.status === "completed").length;
      const totalDays = days.length;
      const completionRate =
        totalDays > 0 ? (completedDays / totalDays) * 100 : 0;

      return {
        completedDays,
        totalDays,
        completionRate,
        days: [...days],
      };
    }, [days]);

    const focusNextPendingDay = useCallback(() => {
      const firstPendingDay = days.find((d) => d.status === "pending");
      if (firstPendingDay) {
        console.log(`Focus next pending day: ${firstPendingDay.day}`);
      }
    }, [days]);

    useImperativeHandle(
      ref,
      () => ({
        getWeekData,
        focusNextPendingDay,
      }),
      [getWeekData, focusNextPendingDay]
    );

    const progressPercentage =
      totalNumberOfTaskForTheDay > 0
        ? (numberOfTaskCompletedForTheDay / totalNumberOfTaskForTheDay) * 100
        : 0;

    return (
      <div
        className={clsx(
          "w-[33.563rem] h-[16.438rem] bg-[#F8F8F9] rounded-[20px] p-[20px]",
          "transition-all duration-300 ease-in-out",
          className
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
          <span className="animate-pulse">🔥</span>
          <p className="font-bold text-[#10B981] transition-colors duration-200">
            {numberOfTaskCompleted} tasks done this week
          </p>
        </div>

        <div className="flex flex-col mt-4 gap-2">
          <div className="justify-between flex text-[#6B7280] text-[1rem] font-medium">
            <p className="transition-colors duration-200 hover:text-gray-800">
              {customMessage || "Excellent progress! 🔥"}
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
          {days.map((dayData) => (
            <div
              className="flex flex-col items-center gap-1 cursor-pointer group"
              key={dayData.day}
              onClick={() => handleDayToggle(dayData.day, dayData.status)}
            >
              <span className="text-xs text-[#504C57] font-semibold transition-colors duration-200 group-hover:text-gray-800">
                {dayData.day} {dayData.day > 1 ? "Days" : "Day"}
              </span>
              <div
                className={clsx(
                  "size-[31px] rounded-[4.24px] flex justify-center items-center transition-all duration-300 ease-in-out",
                  "hover:scale-110 active:scale-95",
                  disabled || updatingDays.has(dayData.day)
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer hover:shadow-md",
                  dayData.status === "completed"
                    ? "bg-gradient-to-b from-[#6619DE] to-[#1186DA] shadow-sm hover:shadow-md"
                    : "bg-[#E0DAE8] hover:bg-[#D1CAD9]"
                )}
              >
                {updatingDays.has(dayData.day) ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : dayData.status === "completed" ? (
                  <FaCheck className="text-[#fff] transition-transform duration-200 group-hover:scale-110" />
                ) : (
                  <FiPlus
                    className="text-[#6B7280] transition-all duration-200 group-hover:text-gray-800 group-hover:scale-110"
                    size={22}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

WeeklyStreak.displayName = "WeeklyStreak";

export default memo(WeeklyStreak);

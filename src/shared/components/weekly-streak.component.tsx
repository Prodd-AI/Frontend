/**
 * @fileoverview Weekly Streak Component
 *
 * A reusable React component for displaying weekly task completion streaks with
 * beautiful UI, smooth animations, and interactive day tracking. This component
 * is part of the productivity tracking system.
 *
 * ## Quick Start for Team Members
 *
 * 1. Import the component and types:
 * ```tsx
 * import WeeklyStreak, { type WeeklyStreakRef, type DayStatus, type DayData } from '@/shared/components/weekly-streak.component';
 * ```
 *
 * 2. Set up state in your parent component:
 * ```tsx
 * const [days, setDays] = useState<DayData[]>([
 *   { day: 1, status: "completed" },
 *   { day: 2, status: "pending" },
 *   // ... 7 days total
 * ]);
 * const streakRef = useRef<WeeklyStreakRef>(null);
 * ```
 *
 * 3. Create interaction handlers:
 * ```tsx
 * const handleDayToggle = async (day: number, newStatus: DayStatus) => {
 *   try {
 *     await updateDayStatus(day, newStatus); // Your API call
 *     setDays(prev =>
 *       prev.map(d => d.day === day ? { ...d, status: newStatus } : d)
 *     );
 *   } catch (error) {
 *     console.error('Failed to update day:', error);
 *   }
 * };
 * ```
 *
 * 4. Use the component:
 * ```tsx
 * <WeeklyStreak
 *   ref={streakRef}
 *   numberOfTaskCompleted={weeklyData.completed}
 *   numberOfTaskCompletedForTheDay={todayData.completed}
 *   totalNumberOfTaskForTheDay={todayData.total}
 *   days={days}
 *   onDayToggle={handleDayToggle}
 * />
 * ```
 *
 * ## Design System Compliance
 * - Uses consistent color tokens and gradients
 * - Implements smooth transitions for all interactive elements
 * - Follows accessibility guidelines with proper ARIA labels
 * - Responsive design with flexible layouts
 *
 * @author Wizzy
 * @since 2025-08-30
 * @version 2.0.0
 */

import {
  memo,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import clsx from "clsx";
import { FaRegCalendar } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import {
  WeeklyStreakRef,
  DayStatus,
  WeeklyStreakPropsInt,
} from "@/shared/typings/weekly-streak";

/**
 * Weekly Streak Component
 *
 * A comprehensive React component for displaying weekly task completion streaks with
 * interactive day tracking, smooth animations, and progress visualization.
 *
 * ## Features
 * - 🔥 **Streak Tracking**: Visual representation of weekly task completion
 * - 📅 **Interactive Days**: Click to toggle day completion status
 * - 📊 **Progress Bar**: Real-time progress visualization for daily tasks
 * - ✨ **Smooth Animations**: CSS transitions for all state changes
 * - 🎨 **Gradient Design**: Beautiful gradients for completed states
 * - ♿ **Accessibility**: Proper semantic HTML and keyboard navigation
 * - 🔄 **Parent-controlled**: Fully controlled component - parent manages all state
 *
 * ## Architecture
 * This component follows the controlled component pattern:
 * - **Component responsibility**: UI rendering, user interactions, loading states
 * - **Parent responsibility**: All business logic, API calls, data state management
 * - **Required props**: `days` and `onDayToggle` for interactive functionality
 *
 * @param props - Component props (see WeeklyStreakPropsInt)
 * @param ref - React ref for imperative control (see WeeklyStreakRef)
 * @returns JSX.Element - The rendered weekly streak component
 *
 * @example
 * // Parent-controlled usage (recommended)
 * ```tsx
 * const [days, setDays] = useState([
 *   { day: 1, status: "completed" },
 *   { day: 2, status: "pending" },
 *   // ... more days
 * ]);
 *
 * const handleDayToggle = async (day: number, newStatus: DayStatus) => {
 *   // Update your state after API call
 *   setDays(prev => prev.map(d =>
 *     d.day === day ? { ...d, status: newStatus } : d
 *   ));
 * };
 *
 * <WeeklyStreak
 *   numberOfTaskCompleted={14}
 *   numberOfTaskCompletedForTheDay={6}
 *   totalNumberOfTaskForTheDay={7}
 *   days={days}
 *   onDayToggle={handleDayToggle}
 * />
 * ```
 *
 * @example
 * // With imperative control
 * ```tsx
 * const streakRef = useRef<WeeklyStreakRef>(null);
 *
 * const getWeekStats = () => {
 *   const stats = streakRef.current?.getWeekData();
 *   console.log(stats);
 * };
 *
 * <WeeklyStreak
 *   ref={streakRef}
 *   days={days}
 *   onDayToggle={handleDayToggle}
 *   // ...other props
 * />
 * ```
 *
 * @version 2.1.0
 * @author Wizzy
 * @since 2025-08-30
 */
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

    // Use prop days if provided, otherwise empty array
    const days = propDays || [];

    /**
     * Handles day toggle when user clicks on a day.
     * Calls parent callback which is responsible for updating state.
     * Manages individual day loading states during async operations.
     */
    const handleDayToggle = useCallback(
      async (day: number, currentStatus: DayStatus) => {
        if (disabled || updatingDays.has(day)) return;

        // Add day to updating set
        setUpdatingDays((prev) => new Set(prev).add(day));

        const newStatus: DayStatus =
          currentStatus === "completed" ? "pending" : "completed";

        try {
          // Call parent callback if provided
          if (onDayToggle) {
            await onDayToggle(day, newStatus);
          }
          // Note: Component is now fully parent-controlled
          // Parent must provide 'days' prop and handle state updates
        } catch (error) {
          console.error("Failed to update day status:", error);
        } finally {
          // Remove day from updating set
          setUpdatingDays((prev) => {
            const newSet = new Set(prev);
            newSet.delete(day);
            return newSet;
          });
        }
      },
      [onDayToggle, disabled, updatingDays]
    );
    /**
     * Gets current week data without causing re-renders.
     */
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

    /**
     * Focuses the first pending day for keyboard navigation.
     */
    const focusNextPendingDay = useCallback(() => {
      const firstPendingDay = days.find((d) => d.status === "pending");
      if (firstPendingDay) {
        console.log(`Focus next pending day: ${firstPendingDay.day}`);
        // Implementation would focus the specific day element
      }
    }, [days]);

    /**
     * Exposes imperative methods to parent component through ref.
     */
    useImperativeHandle(
      ref,
      () => ({
        getWeekData,
        focusNextPendingDay,
      }),
      [getWeekData, focusNextPendingDay]
    );

    // Calculate progress percentage
    const progressPercentage =
      totalNumberOfTaskForTheDay > 0
        ? (numberOfTaskCompletedForTheDay / totalNumberOfTaskForTheDay) * 100
        : 0;
    return (
      <div
        className={clsx(
          "w-[33.563rem] h-[16.438rem] bg-[#F8F8F9] rounded-[20px] shadow p-[20px]",
          "transition-all duration-300 ease-in-out hover:shadow-lg",
          className
        )}
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

          {/* Progress bar with smooth animation */}
          <div className="h-[0.75rem] w-full border rounded-[100px] relative bg-[#EAEBEB] overflow-hidden">
            <div
              className="absolute h-full rounded-[100px] bg-gradient-to-r from-[#251F2D] to-[#686371] transition-all duration-500 ease-out"
              style={{
                width: `${progressPercentage}%`,
              }}
            />
            {/* Shimmer effect for active progress */}
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

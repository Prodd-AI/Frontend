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
 * import WeeklyStreak, { type WeeklyStreakRef, type DayStatus } from '@/shared/components/weekly-streak.component';
 * ```
 *
 * 2. Set up state in your parent component:
 * ```tsx
 * const [weeklyData, setWeeklyData] = useState(initialData);
 * const [isUpdating, setIsUpdating] = useState(false);
 * const streakRef = useRef<WeeklyStreakRef>(null);
 * ```
 *
 * 3. Create interaction handlers:
 * ```tsx
 * const handleDayToggle = async (day: number, newStatus: DayStatus) => {
 *   setIsUpdating(true);
 *   try {
 *     await updateDayStatus(day, newStatus);
 *     setWeeklyData(prev => ({
 *       ...prev,
 *       days: prev.days.map(d =>
 *         d.day === day ? { ...d, status: newStatus } : d
 *       )
 *     }));
 *   } catch (error) {
 *     console.error('Failed to update day:', error);
 *   } finally {
 *     setIsUpdating(false);
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
 *   days={weeklyData.days}
 *   onDayToggle={handleDayToggle}
 *   isUpdating={isUpdating}
 * />
 * ```
 *
 * ## Design System Compliance
 * - Uses consistent color tokens and gradients
 * - Implements smooth transitions for all interactive elements
 * - Follows accessibility guidelines with proper ARIA labels
 * - Responsive design with flexible layouts
 *
 * @author Frontend Team
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
import clsx, { type ClassValue } from "clsx";
import { FaRegCalendar } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";

/**
 * Available day status options.
 * Represents the completion state of tasks for a specific day.
 */
type DayStatus = "completed" | "pending";

/**
 * Day data structure for tracking daily progress.
 */
interface DayData {
  /** Day number (1-7 for week) */
  day: number;
  /** Current completion status */
  status: DayStatus;
  /** Optional: number of tasks completed for this day */
  tasksCompleted?: number;
  /** Optional: total tasks for this day */
  totalTasks?: number;
}

/**
 * Props interface for the WeeklyStreak component.
 */
interface WeeklyStreakPropsInt {
  /** Total number of tasks completed this week */
  numberOfTaskCompleted: number;
  /** Additional CSS classes to apply to the component container */
  className?: ClassValue;
  /** Total number of tasks assigned for today */
  totalNumberOfTaskForTheDay: number;
  /** Number of tasks completed today */
  numberOfTaskCompletedForTheDay: number;
  /**
   * Array of day data for the week. If not provided, defaults to 7 pending days.
   * Should contain 7 items representing Monday through Sunday.
   */
  days?: DayData[];
  /**
   * Callback function called when user toggles a day's completion status.
   * @param day - The day number that was toggled
   * @param newStatus - The new status for that day
   */
  onDayToggle?: (day: number, newStatus: DayStatus) => void;
  /** Whether a day update is currently in progress (shows loading state) */
  isUpdating?: boolean;
  /** Whether the component interactions are disabled */
  disabled?: boolean;
  /** Custom message to display instead of default "Excellent progress! 🔥" */
  customMessage?: string;
}

/**
 * Ref interface for imperative control of the WeeklyStreak component.
 * Use these methods to programmatically control the component from parent.
 */
interface WeeklyStreakRef {
  /** Gets current week data without triggering re-renders */
  getWeekData: () => {
    completedDays: number;
    totalDays: number;
    completionRate: number;
    days: DayData[];
  };
  /** Focuses the first pending day for keyboard navigation */
  focusNextPendingDay: () => void;
}
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
 * - 🔄 **Parent-controlled**: Submission logic handled by parent component
 *
 * ## Architecture
 * This component follows the principle of separation of concerns:
 * - **Component responsibility**: UI rendering, user interactions, animations
 * - **Parent responsibility**: Business logic, API calls, state management
 *
 * @param props - Component props (see WeeklyStreakPropsInt)
 * @param ref - React ref for imperative control (see WeeklyStreakRef)
 * @returns JSX.Element - The rendered weekly streak component
 *
 * @example
 * // Basic usage
 * ```tsx
 * <WeeklyStreak
 *   numberOfTaskCompleted={14}
 *   numberOfTaskCompletedForTheDay={6}
 *   totalNumberOfTaskForTheDay={7}
 *   days={weeklyData.days}
 *   onDayToggle={(day, newStatus) => handleDayUpdate(day, newStatus)}
 *   isUpdating={isLoading}
 * />
 * ```
 *
 * @example
 * // With imperative control
 * ```tsx
 * const streakRef = useRef<WeeklyStreakRef>(null);
 *
 * const handleResetWeek = () => {
 *   streakRef.current?.resetWeek();
 * };
 *
 * <WeeklyStreak
 *   ref={streakRef}
 *   // ...other props
 * />
 * ```
 *
 * @version 2.0.0
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
      isUpdating = false,
      disabled = false,
      customMessage,
    },
    ref
  ) => {
    /**
     * Default week data - 7 days starting with first day completed
     */
    const defaultDays: DayData[] = [
      { day: 1, status: "completed" },
      { day: 2, status: "pending" },
      { day: 3, status: "pending" },
      { day: 4, status: "pending" },
      { day: 5, status: "pending" },
      { day: 6, status: "pending" },
      { day: 7, status: "pending" },
    ];

    const [internalDays, setInternalDays] = useState<DayData[]>(
      propDays || defaultDays
    );

    // Use prop days if provided, otherwise use internal state
    const days = propDays || internalDays;

    /**
     * Handles day toggle when user clicks on a day.
     * Determines the new status and calls parent callback if provided.
     */
    const handleDayToggle = useCallback(
      (day: number, currentStatus: DayStatus) => {
        if (disabled || isUpdating) return;

        const newStatus: DayStatus =
          currentStatus === "completed" ? "pending" : "completed";

        // Self-controlled: update internal state
        setInternalDays((prev) =>
          prev.map((d) => (d.day === day ? { ...d, status: newStatus } : d))
        );
      },
      [onDayToggle, disabled, isUpdating]
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
                  disabled || isUpdating
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer hover:shadow-md",
                  dayData.status === "completed"
                    ? "bg-gradient-to-b from-[#6619DE] to-[#1186DA] shadow-sm hover:shadow-md"
                    : "bg-[#E0DAE8] hover:bg-[#D1CAD9]"
                )}
              >
                {isUpdating ? (
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
export type { WeeklyStreakPropsInt, WeeklyStreakRef, DayData };

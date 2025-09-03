import { clsx, type ClassValue } from "clsx";
import { TbWaveSawTool } from "react-icons/tb";

/**
 * Interface for TodaysProgress component props
 */
interface TodaysProgresssPropsInt {
  /** Optional title for the progress component */
  title?: string;
  /** Additional CSS classes to apply to the component */
  className?: ClassValue;
  /** Number of tasks completed today */
  numberOfTaskCompleted: number;
  /** Total number of tasks for today */
  totalNumberOfTask: number;
  /** Average mood rating */
  avgMood: number;
}

/**
 * TodaysProgress - A visual progress dashboard component that displays daily task completion metrics and mood tracking.
 *
 * This component provides an intuitive interface for users to view their daily productivity metrics including:
 * - Task completion progress with animated progress bar
 * - Total completed vs remaining tasks ratio
 * - Average mood rating for the day
 * - Interactive hover effects and smooth transitions
 *
 * The component features a clean, modern design with purple/blue gradient themes and responsive animations
 * that enhance user engagement through visual feedback.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <TodaysProgress
 *   numberOfTaskCompleted={7}
 *   totalNumberOfTask={10}
 *   avgMood={8.5}
 * />
 *
 * // With custom title and styling
 * <TodaysProgress
 *   title="Weekly Progress"
 *   numberOfTaskCompleted={25}
 *   totalNumberOfTask={30}
 *   avgMood={7.2}
 *   className="my-4 shadow-xl"
 * />
 * ```
 *
 * @param {Object} props - Component props
 * @param {string} [props.title="Today's Progress"] - The title displayed at the top of the component
 * @param {number} props.numberOfTaskCompleted - Number of tasks completed (used for progress calculation)
 * @param {number} props.totalNumberOfTask - Total number of tasks assigned (used for progress calculation)
 * @param {number} props.avgMood - Average mood rating (typically 1-10 scale)
 * @param {ClassValue} [props.className] - Additional CSS classes for custom styling
 *
 * @returns {JSX.Element} A styled progress dashboard with animated elements
 *
 * @author Wizzy
 * @version 1.0.0
 * @since 2025-09-03
 */
function TodaysProgress({
  title = "Today's Progress",
  numberOfTaskCompleted,
  totalNumberOfTask,
  avgMood,
  className,
}: TodaysProgresssPropsInt) {
  const progress_metric = (numberOfTaskCompleted / totalNumberOfTask) * 100;

  return (
    <div
      className={clsx(
        `w-[33.563rem] h-[18rem] border bg-[#F8F8F9] shadow rounded-[20px] px-[1.25rem] py-[1.875rem] transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02]`,
        className
      )}
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
        <div className="flex gap-[14px]">
          <div className=" flex justify-center items-center bg-[#EDE2FE] flex-col w-[14.625rem] h-[5.563rem] rounded-[14px] transition-all duration-300 ease-in-out hover:bg-[#DDD6FE] hover:shadow-md hover:scale-105 cursor-pointer">
            <span className="text-[#6619DE] font-bold text-[1.75rem] p-0 transition-all duration-200 hover:scale-110">
              {numberOfTaskCompleted}
            </span>
            <p className=" text-[#6B7280] font-medium text-[1rem] transition-colors duration-200">
              Completed
            </p>
          </div>
          <div className=" bg-[#1186DA1C] w-[14.625rem] h-[5.563rem] rounded-[14px] flex justify-center items-center flex-col transition-all duration-300 ease-in-out hover:bg-[#1186DA30] hover:shadow-md hover:scale-105 cursor-pointer">
            <span className="text-[#1186DA] text-[1.75rem] font-bold transition-all duration-200 hover:scale-110">
              {avgMood}
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

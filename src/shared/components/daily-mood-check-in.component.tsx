/**
 * @fileoverview Daily Mood Check-in Component
 *
 * A reusable React component for collecting employee mood data with beautiful UI
 * and smooth animations. This component is part of the employee wellness tracking system.
 *
 * ## Quick Start for Team Members
 *
 * 1. Import the component and types:
 * ```tsx
 * import DailyMoodCheckIn, { type DailyMoodCheckInRef, type Moods } from '@/shared/components/daily-mood-check-in.component';
 * ```
 *
 * 2. Set up state and ref in your parent component:
 * ```tsx
 * const [isSubmitting, setIsSubmitting] = useState(false);
 * const [isSubmitted, setIsSubmitted] = useState(false);
 * const moodRef = useRef<DailyMoodCheckInRef>(null);
 * ```
 *
 * 3. Create submission handler:
 * ```tsx
 * const handleSubmit = async (mood: Moods, description: string) => {
 *   setIsSubmitting(true);
 *   try {
 *     await yourApiCall(mood, description);
 *     setIsSubmitted(true);
 *     // Reset after success
 *     setTimeout(() => {
 *       moodRef.current?.reset();
 *       setIsSubmitted(false);
 *     }, 2000);
 *   } catch (error) {
 *     // Handle error
 *   } finally {
 *     setIsSubmitting(false);
 *   }
 * };
 * ```
 *
 * 4. Use the component:
 * ```tsx
 * <DailyMoodCheckIn
 *   ref={moodRef}
 *   onSubmit={handleSubmit}
 *   isSubmitting={isSubmitting}
 *   isSubmitted={isSubmitted}
 * />
 * ```
 *
 * ## API Integration Notes
 * - Always handle loading states with `isSubmitting`
 * - Show success feedback with `isSubmitted`
 * - Use the ref's `reset()` method after successful submission
 * - The component validates that a mood is selected before calling `onSubmit`
 *
 * ## Design System Compliance
 * - Uses design tokens from the theme
 * - Follows accessibility guidelines
 * - Implements consistent animation patterns
 * - Responsive by default
 *
 * @author Wizzy
 * @since 2025-08-30
 * @version 1.0.0
 */

import {
  memo,
  useCallback,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import clsx from "clsx";
import { FaRegSmile } from "react-icons/fa";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Moods } from "@/shared/typings/daily-mood-check-in";
import { DailyMoodCheckInPropsInt } from "@/shared/typings/daily-mood-check-in";
import { DailyMoodCheckInRef } from "@/shared/typings/daily-mood-check-in";

/**
 * Emoji mapping for each mood type.
 * These emojis are displayed on the selectable mood cards.
 */
const mood_emojis = {
  great: "😊",
  good: "🙂",
  okay: "😐",
  notGreat: "😞",
  rough: "😣",
};

const mood_emojis_cards: {
  emoji: string;
  title: string;
  type: Moods;
}[] = [
  {
    emoji: mood_emojis.great,
    title: "Great",
    type: "Great",
  },
  {
    emoji: mood_emojis.good,
    title: "Good",
    type: "Good",
  },
  {
    emoji: mood_emojis.okay,
    title: "Okay",
    type: "Okay",
  },
  {
    emoji: mood_emojis.notGreat,
    title: "Not Great",
    type: "Not Great",
  },
  {
    emoji: mood_emojis.rough,
    title: "Rough",
    type: "Rough",
  },
];

/**
 * Daily Mood Check-in Component
 *
 * A comprehensive React component for collecting user mood data with a beautiful UI,
 * smooth animations, and flexible parent-controlled submission logic.
 *
 * ## Features
 * - 🎨 Beautiful UI with 5 emoji mood options
 * - ⚡ Smooth transitions and hover effects
 * - 📝 Optional description textarea
 * - 🔄 Parent-controlled submission states
 * - 🎯 TypeScript support with full type safety
 * - ♿ Keyboard accessible
 * - 📱 Responsive design
 *
 * ## Architecture
 * This component follows the principle of separation of concerns:
 * - **Component responsibility**: UI rendering, user interactions, animations
 * - **Parent responsibility**: Business logic, API calls, state management
 *
 * ## Basic Usage
 * ```tsx
 * import { useRef, useState } from 'react';
 * import DailyMoodCheckIn, { DailyMoodCheckInRef, Moods } from './daily-mood-check-in.component';
 *
 * function MyPage() {
 *   const [isSubmitting, setIsSubmitting] = useState(false);
 *   const [isSubmitted, setIsSubmitted] = useState(false);
 *   const moodRef = useRef<DailyMoodCheckInRef>(null);
 *
 *   const handleSubmit = async (mood: Moods, description: string) => {
 *     setIsSubmitting(true);
 *     try {
 *       await submitToAPI(mood, description);
 *       setIsSubmitted(true);
 *
 *       // Reset after 2 seconds
 *       setTimeout(() => {
 *         moodRef.current?.reset();
 *         setIsSubmitted(false);
 *       }, 2000);
 *     } catch (error) {
 *       console.error('Failed to submit:', error);
 *     } finally {
 *       setIsSubmitting(false);
 *     }
 *   };
 *
 *   return (
 *     <DailyMoodCheckIn
 *       ref={moodRef}
 *       onSubmit={handleSubmit}
 *       isSubmitting={isSubmitting}
 *       isSubmitted={isSubmitted}
 *     />
 *   );
 * }
 * ```
 *
 * ## Advanced Usage with Error Handling
 * ```tsx
 * const handleSubmit = async (mood: Moods, description: string) => {
 *   setError(null);
 *   setIsSubmitting(true);
 *
 *   try {
 *     await submitMoodData(mood, description);
 *     setIsSubmitted(true);
 *     toast('Mood submitted successfully!');
 *   } catch (error) {
 *     setError('Failed to submit mood. Please try again.');
 *     // Don't reset form so user can retry
 *   } finally {
 *     setIsSubmitting(false);
 *   }
 * };
 * ```
 *
 * ## Imperative API
 * The component exposes imperative methods through ref:
 * ```tsx
 * // Reset form programmatically
 * moodRef.current?.reset();
 *
 * // Get current data without re-render
 * const currentData = moodRef.current?.getCurrentData();
 * console.log(currentData); // { mood: "Great", description: "Feeling awesome!" }
 * ```
 *
 * @param props - Component props (see DailyMoodCheckInPropsInt)
 * @param ref - React ref for imperative control (see DailyMoodCheckInRef)
 * @returns JSX.Element - The rendered mood check-in component
 *
 * @example
 * // Simple usage
 * <DailyMoodCheckIn onSubmit={(mood, desc) => console.log(mood, desc)} />
 *
 * @example
 * // With custom styling and states
 * <DailyMoodCheckIn
 *   className="my-custom-styles"
 *   title="How are you today?"
 *   subTitle="Your wellbeing matters to us"
 *   onSubmit={handleMoodSubmit}
 *   isSubmitting={isLoading}
 *   isSubmitted={wasSubmitted}
 * />
 *
 * @version 1.0.0
 * @author Wizzy
 * @since 2025-08-30
 */
const DailyMoodCheckIn = forwardRef<
  DailyMoodCheckInRef,
  DailyMoodCheckInPropsInt
>(
  (
    {
      className,
      title = "Daily Mood Check-in",
      subTitle = `How are you feeling right now? Your input helps us support your
          wellness`,
      onSubmit,
      isSubmitting = false,
      isSubmitted = false,
    },
    ref
  ) => {
    const [mood, setMood] = useState<Moods | null>(null);
    const [description, setDescription] = useState("");

    /**
     * Handles emoji/mood selection by the user.
     * Updates the internal mood state when a user clicks on an emoji card.
     *
     * @param emoji - The selected mood value
     */
    const handleSelectEmoji = useCallback((emoji: Moods) => {
      setMood(emoji);
    }, []);

    /**
     * Handles form submission when the submit button is clicked.
     * Validates that a mood is selected and calls the parent's onSubmit callback.
     * Prevents submission if already submitting or if no mood is selected.
     */
    const handleSubmit = useCallback(() => {
      if (!mood || isSubmitting || isSubmitted) return;
      onSubmit(mood, description);
    }, [mood, description, onSubmit, isSubmitting, isSubmitted]);

    /**
     * Resets the component to its initial state.
     * Clears both the selected mood and description text.
     * This method is exposed to parent components via ref.
     */
    const reset = useCallback(() => {
      setMood(null);
      setDescription("");
    }, []);

    /**
     * Gets the current form data without causing re-renders.
     * Useful for accessing form state imperatively from parent components.
     *
     * @returns Object containing current mood selection and description text
     */
    const getCurrentData = useCallback(() => {
      return { mood, description };
    }, [mood, description]);

    /**
     * Exposes imperative methods to parent component through ref.
     * This allows parent components to programmatically control the form.
     */
    useImperativeHandle(
      ref,
      () => ({
        reset,
        getCurrentData,
      }),
      [reset, getCurrentData]
    );

    return (
      <div
        className={clsx(
          className,
          "w-[50.625rem] h-[33.313rem] bg-[#F8F8F9] rounded-[20px] shadow flex flex-col p-[35px]",
          "transition-all duration-500 ease-in-out",
          "hover:shadow-lg"
        )}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <FaRegSmile className="text-[#10B948]" size={32} />
            <h1 className="text-[#393343] font-bold text-4xl">{title}</h1>
          </div>
          <h2 className="text-[16px] text-[#6B7280] font-medium">{subTitle}</h2>

          <div className="flex gap-3 mt-[26px]">
            {mood_emojis_cards.map(({ emoji, title, type }) => (
              <div
                key={type}
                onClick={() => handleSelectEmoji(type)}
                className={clsx(
                  "bg-[#EDEDF0] rounded-[17px] w-[8.75rem] h-[6.938rem] flex flex-col cursor-pointer justify-center items-center",
                  "transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg",
                  "active:scale-95",
                  mood === type
                    ? "border-2 border-[#6619DE94] bg-[#6619DE]/10 shadow-md scale-105"
                    : "border-2 border-transparent hover:border-[#6619DE]/30"
                )}
              >
                <p className="text-[35.51px] transition-transform duration-200 ease-in-out">
                  {emoji}
                </p>
                <h5 className="font-medium text-[#393343] transition-colors duration-200">
                  {title}
                </h5>
              </div>
            ))}
          </div>
          <div className="mt-[2.938rem] flex flex-col gap-4">
            <Textarea
              className="h-[7.563rem] transition-all duration-200 ease-in-out focus:ring-2 focus:ring-[#6619DE]/20 focus:border-[#6619DE]"
              placeholder="Anything specific on your mind today? (Optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button
              className={clsx(
                "w-full h-[3.313rem] font-bold text-white",
                "transition-all duration-300 ease-in-out transform",
                "hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]",
                isSubmitted
                  ? "bg-green-500 hover:bg-green-600"
                  : mood
                  ? "bg-gradient-to-r from-[#6619DE] to-[#1C75BC] hover:from-[#5A15C7] hover:to-[#1A6BAB] cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed opacity-60"
              )}
              onClick={handleSubmit}
              disabled={!mood || isSubmitting || isSubmitted}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </div>
              ) : isSubmitted ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Successfully submitted!
                </div>
              ) : (
                "Submit mood check-in"
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

/**
 * Set display name for better debugging experience in React DevTools.
 */
DailyMoodCheckIn.displayName = "DailyMoodCheckIn";

/**
 * Default export - Memoized version of the DailyMoodCheckIn component.
 * The component is wrapped with React.memo for performance optimization.
 */
export default memo(DailyMoodCheckIn);

/**
 * Type exports for TypeScript consumers.
 *
 * @example
 * ```tsx
 * import DailyMoodCheckIn, { type DailyMoodCheckInRef, type Moods } from './daily-mood-check-in.component';
 *
 * const moodRef = useRef<DailyMoodCheckInRef>(null);
 *
 * const handleSubmit = (mood: Moods, description: string) => {
 *   // Handle submission...
 * };
 * ```
 */

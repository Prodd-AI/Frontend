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
import { MOOD_EMOJIS } from "../utils/constants";

const mood_emojis_cards: {
  emoji: string;
  title: string;
  type: Moods;
}[] = [
  {
    emoji: MOOD_EMOJIS.great,
    title: "Great",
    type: "Great",
  },
  {
    emoji: MOOD_EMOJIS.good,
    title: "Good",
    type: "Good",
  },
  {
    emoji: MOOD_EMOJIS.okay,
    title: "Okay",
    type: "Okay",
  },
  {
    emoji: MOOD_EMOJIS.notGreat,
    title: "Not Great",
    type: "Not Great",
  },
  {
    emoji: MOOD_EMOJIS.rough,
    title: "Rough",
    type: "Rough",
  },
];

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
    },
    ref,
  ) => {
    const [mood, setMood] = useState<Moods | null>(null);
    const [description, setDescription] = useState("");

    const handleSelectEmoji = useCallback((emoji: Moods) => {
      setMood(emoji);
    }, []);

    const handleSubmit = useCallback(() => {
      if (!mood || isSubmitting) return;
      onSubmit(mood, description);
    }, [mood, description, onSubmit, isSubmitting]);

    const reset = useCallback(() => {
      setMood(null);
      setDescription("");
    }, []);

    const getCurrentData = useCallback(() => {
      return { mood, description };
    }, [mood, description]);

    useImperativeHandle(
      ref,
      () => ({
        reset,
        getCurrentData,
      }),
      [reset, getCurrentData],
    );

    return (
      <div
        className={clsx(
          className,
          "w-[50.625rem] h-[33.313rem] bg-[#F8F8F9] rounded-[20px] flex flex-col p-[35px]",
          "transition-all duration-500 ease-in-out",
        )}
        style={{
          boxShadow:
            "0px 4px 4px -4px rgba(12, 12, 13, 0.05), 0px 16px 16px -8px rgba(12, 12, 13, 0.1)",
        }}
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
                    : "border-2 border-transparent hover:border-[#6619DE]/30",
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

                mood
                  ? "bg-gradient-to-r from-[#6619DE] to-[#1C75BC] hover:from-[#5A15C7] hover:to-[#1A6BAB] cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed opacity-60",
              )}
              onClick={handleSubmit}
              disabled={!mood || isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </div>
              ) : (
                "Submit mood check-in"
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  },
);

DailyMoodCheckIn.displayName = "DailyMoodCheckIn";

export default memo(DailyMoodCheckIn);

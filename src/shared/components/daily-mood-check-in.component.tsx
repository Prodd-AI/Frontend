import {
  memo,
  useCallback,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import clsx from "clsx";
import { ArrowUpRight, Smile } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Moods } from "@/shared/typings/daily-mood-check-in";
import { DailyMoodCheckInPropsInt } from "@/shared/typings/daily-mood-check-in";
import { DailyMoodCheckInRef } from "@/shared/typings/daily-mood-check-in";
import { MOOD_EMOJIS } from "../utils/constants";

const mood_emojis_cards: {
  emoji: string;
  title: string;
  type: Moods;
}[] = [
  { emoji: MOOD_EMOJIS.great, title: "Great", type: "Great" },
  { emoji: MOOD_EMOJIS.good, title: "Good", type: "Good" },
  { emoji: MOOD_EMOJIS.okay, title: "Okay", type: "Okay" },
  { emoji: MOOD_EMOJIS.notGreat, title: "Not Great", type: "Not Great" },
  { emoji: MOOD_EMOJIS.rough, title: "Rough", type: "Rough" },
];

const DailyMoodCheckIn = forwardRef<
  DailyMoodCheckInRef,
  DailyMoodCheckInPropsInt
>(
  (
    {
      className,
      title = "Daily Mood Check-in",
      subTitle = "How are you feeling right now?",
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

    const getCurrentData = useCallback(
      () => ({ mood, description }),
      [mood, description],
    );

    useImperativeHandle(
      ref,
      () => ({ reset, getCurrentData }),
      [reset, getCurrentData],
    );

    return (
      <div
        className={clsx(
          "bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 flex flex-col gap-5",
          className,
        )}
      >
        <div className="flex items-center gap-3">
          <span className="size-10 rounded-xl bg-[#6619DE] flex items-center justify-center">
            <Smile size={20} className="text-white" />
          </span>
          <h3 className="text-base font-semibold text-[#251F2D]">{title}</h3>
        </div>

        <div className="bg-[#F8F8F9] rounded-2xl p-5 sm:p-6">
          <p className="text-sm font-medium text-[#5A5D61] mb-4">{subTitle}</p>

          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {mood_emojis_cards.map(({ emoji, title, type }) => (
              <button
                key={type}
                type="button"
                onClick={() => handleSelectEmoji(type)}
                className={clsx(
                  "flex flex-col items-center justify-center gap-1 rounded-2xl py-3 px-1 transition-all",
                  "bg-white border-2",
                  mood === type
                    ? "border-[#6619DE] shadow-sm"
                    : "border-transparent hover:border-[#6619DE]/30",
                )}
              >
                <span className="text-2xl sm:text-3xl">{emoji}</span>
                <span className="text-[11px] sm:text-xs font-medium text-[#251F2D]">
                  {title}
                </span>
              </button>
            ))}
          </div>

          <div className="relative mt-5">
            <Textarea
              className="min-h-[92px] bg-white border-gray-200 rounded-xl pr-14 text-sm focus:ring-2 focus:ring-[#6619DE]/20 focus:border-[#6619DE]"
              placeholder="Anything specific on your mind today? (Optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!mood || isSubmitting}
              aria-label="Submit mood check-in"
              className={clsx(
                "absolute right-3 bottom-3 size-9 rounded-lg flex items-center justify-center transition-all",
                mood && !isSubmitting
                  ? "bg-[#6619DE] hover:bg-[#5710c4] text-white"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed",
              )}
            >
              {isSubmitting ? (
                <span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <ArrowUpRight size={18} />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  },
);

DailyMoodCheckIn.displayName = "DailyMoodCheckIn";

export default memo(DailyMoodCheckIn);

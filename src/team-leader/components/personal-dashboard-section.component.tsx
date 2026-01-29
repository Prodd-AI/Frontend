import DailyMoodCheckIn from "@/shared/components/daily-mood-check-in.component";

import TodaysProgress from "@/shared/components/todays-progress.component";
import { PersonalDashboardSectionProps } from "@/team-leader/typings/team-leader";
import { Moods } from "@/shared/typings/daily-mood-check-in";
import { useMutation,} from "@tanstack/react-query";
import { useRef } from "react";
import { toast } from "sonner";
import { DailyMoodCheckInRef } from "@/shared/typings/daily-mood-check-in";
import {
  submit_check_in_mood,
} from "@/config/services/mood-trends.service";
import WeeklyStreakComponent from "@/shared/components/weekly-streak.component";


const PersonalDashboardSection = ({
  className,
  weekTasksQuery,
  averageMoodQuery
}: PersonalDashboardSectionProps) => {
  const formRef = useRef<DailyMoodCheckInRef>(null);

  const weekTasks = weekTasksQuery.data?.data;
  const averageMoodData = averageMoodQuery.data?.data?.average_mood ?? 0;

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
  const todayDayName = dayNames[new Date().getDay()];
  const numberOfTaskCompleted = weekTasks
    ? Object.values(weekTasks)
        .flat()
        .filter((task) => task.task?.status === "COMPLETED").length
    : 0;

  const todaysTasks = weekTasks?.[todayDayName as keyof typeof weekTasks] ?? [];
  const totalNumberOfTaskForTheDay = todaysTasks.length;
  const numberOfTaskCompletedForTheDay = todaysTasks.filter(
    (task) => task.task.status === "completed",
  ).length;

  const MoodEmojisMapper = {
    Rough: 1,
    "Not Great": 2,
    Okay: 3,
    Good: 4,
    Great: 5,
  } as const;
  const { mutate, isPending } = useMutation<
    GeneralReturnInt<unknown>,
    GeneralErrorInt,
    {
      mood_score: number;
      description: string;
    }
  >({
    mutationFn: (data) => submit_check_in_mood(data),
    mutationKey: ["submit-daily-mood-check-in"],
    onSuccess: (res) => {
      toast.success(res.message || "Mood check-in submitted successfully!");
      formRef.current?.reset();
    },
  });

  const handleSubmitDailyMoodCheckIn = (mood: Moods, description: string) => {
    const mappedMood = MoodEmojisMapper[mood];
    mutate({
      mood_score: mappedMood,
      description,
    });
  };
  return (
    <section className={`grid grid-cols-2 mt-9 gap-4 ${className || ""}`}>
      <DailyMoodCheckIn
        ref={formRef}
        isSubmitting={isPending}
        onSubmit={handleSubmitDailyMoodCheckIn}
        className="w-full h-full"
      />
      <div className="flex flex-col gap-3.5">
        <WeeklyStreakComponent
          className="w-full"
          numberOfTaskCompleted={numberOfTaskCompleted}
          totalNumberOfTaskForTheDay={totalNumberOfTaskForTheDay}
          numberOfTaskCompletedForTheDay={numberOfTaskCompletedForTheDay}
          weekTasks={weekTasks}
        />
        <TodaysProgress
          title="Today's Progress"
          numberOfTaskCompleted={numberOfTaskCompletedForTheDay}
          totalNumberOfTask={totalNumberOfTaskForTheDay}
          avgMood={averageMoodData}
          className="w-full"
        />
      </div>
    </section>
  );
};

export default PersonalDashboardSection;

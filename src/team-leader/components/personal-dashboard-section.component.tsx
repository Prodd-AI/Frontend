import DailyMoodCheckIn from "@/shared/components/daily-mood-check-in.component";
import TodaysProgress from "@/shared/components/todays-progress.component";
import { PersonalDashboardSectionProps } from "@/team-leader/typings/team-leader";
import { Moods } from "@/shared/typings/daily-mood-check-in";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { toast } from "sonner";
import { DailyMoodCheckInRef } from "@/shared/typings/daily-mood-check-in";
import { submit_check_in_mood } from "@/config/services/mood-trends.service";
import WeeklyStreakComponent from "@/shared/components/weekly-streak.component";
import { get_upcoming_meetings_today } from "@/config/services/meeting.service";
import { UpcomingSchedule } from "@/shared/components/upcoming-schedule.component";

const PersonalDashboardSection = ({
  className,
  weekTasksQuery,
  averageMoodQuery,
}: PersonalDashboardSectionProps) => {
  const formRef = useRef<DailyMoodCheckInRef>(null);
  const queryClient = useQueryClient();

  const weekTasks = weekTasksQuery.data?.data;
  const averageMoodData = averageMoodQuery.data?.data?.average_mood ?? 0;

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
  const todayDayName = dayNames[new Date().getDay()];
  const numberOfTaskCompleted = weekTasks
    ? Object.values(weekTasks)
        .flat()
        .filter((task) => task.task?.status === "completed").length
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
      // Refresh any mood listings/averages so the new entry shows up
      // without a page reload.
      queryClient.invalidateQueries({ queryKey: ["average-mood-week"] });
      queryClient.invalidateQueries({ queryKey: ["average-mood"] });
      queryClient.invalidateQueries({ queryKey: ["mood-average"] });
      queryClient.invalidateQueries({ queryKey: ["user-mood-history"] });
      queryClient.invalidateQueries({ queryKey: ["get-mood-distribution"] });
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

  const { data: upcomingMeetingsData, isLoading: upcomingMeetingsLoading } =
    useQuery({
      queryKey: ["upcoming-meetings-today"],
      queryFn: () => get_upcoming_meetings_today(),
    });

  const meetingData = upcomingMeetingsData?.data;
  const remainingCount = meetingData?.remaining_meetings?.length ?? 0;

  return (
    <section className={`flex flex-col gap-6 ${className || ""}`}>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <DailyMoodCheckIn
          ref={formRef}
          isSubmitting={isPending}
          onSubmit={handleSubmitDailyMoodCheckIn}
          className="lg:col-span-3"
        />
        <div className="flex flex-col gap-4 lg:col-span-2">
          <WeeklyStreakComponent
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
          />
        </div>
      </div>
      <UpcomingSchedule
        meeting={meetingData}
        remainingCount={remainingCount}
        isLoading={upcomingMeetingsLoading}
      />
    </section>
  );
};

export default PersonalDashboardSection;

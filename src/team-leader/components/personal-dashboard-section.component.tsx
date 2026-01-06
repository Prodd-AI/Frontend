import DailyMoodCheckIn from "@/shared/components/daily-mood-check-in.component";
import WeeklyStreakComponent from "@/shared/components/weekly-streak.component";
import TodaysProgress from "@/shared/components/todays-progress.component";
import { weeklyStreakDaysData } from "@/team-leader/mock-data/index.mock";
import { PersonalDashboardSectionProps } from "@/team-leader/typings/team-leader";

const PersonalDashboardSection = ({
  className,
}: PersonalDashboardSectionProps) => {
  return (
    <section className={`grid grid-cols-2 mt-9 gap-4 ${className || ""}`}>
      <DailyMoodCheckIn onSubmit={() => null} className="w-full h-full" />
      <div className="flex flex-col gap-3.5">
        <WeeklyStreakComponent
          className="w-full"
          numberOfTaskCompleted={2}
          totalNumberOfTaskForTheDay={2}
          numberOfTaskCompletedForTheDay={2}
          days={weeklyStreakDaysData}
        />
        <TodaysProgress
          title="Today's Progress"
          numberOfTaskCompleted={2}
          totalNumberOfTask={4}
          avgMood={3}
          className="w-full"
        />
      </div>
    </section>
  );
};

export default PersonalDashboardSection;

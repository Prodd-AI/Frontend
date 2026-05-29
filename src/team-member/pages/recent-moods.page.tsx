import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNowStrict } from "date-fns";
import PageHeader from "@/shared/components/page-header.component";
import MoodTrends from "@/shared/components/mood-trend.component";
import { get_average_mood_for_the_week } from "@/config/services/mood-trends.service";
import type { MoodType } from "@/shared/typings/mood-trend";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MoodEntryMapper: Record<number, MoodType> = {
  1: "rough",
  2: "notGreat",
  3: "okay",
  4: "good",
  5: "great",
};

type MoodPeriod = "day" | "week" | "month";

const PERIOD_LABELS: Record<MoodPeriod, string> = {
  day: "Today",
  week: "This Week",
  month: "This Month",
};

function RecentMoodsPage() {
  const [period, setPeriod] = useState<MoodPeriod>("week");

  const { data } = useQuery({
    queryKey: ["average-mood", period],
    queryFn: () => get_average_mood_for_the_week({ period }),
  });

  const moodEntries = data?.data.mood_scores.map((entry) => ({
    id: entry.user_id,
    title: entry.description,
    date: `${formatDistanceToNowStrict(new Date(entry.created_at))} ago`,
    mood: MoodEntryMapper[entry.mood_score],
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        dataTour="page-header"
        title="Recent Moods"
        subtitle="Track recent mood check-ins and the average for the period"
        actions={
          <Select
            value={period}
            onValueChange={(v) => setPeriod(v as MoodPeriod)}
          >
            <SelectTrigger className="h-10 w-[140px] bg-white border-gray-200">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(PERIOD_LABELS) as MoodPeriod[]).map((p) => (
                <SelectItem key={p} value={p}>
                  {PERIOD_LABELS[p]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />
      <MoodTrends
        moodEntries={moodEntries ?? []}
        averageMood={
          data?.data.average_mood
            ? MoodEntryMapper[data.data.average_mood]
            : undefined
        }
      />
    </div>
  );
}

export default RecentMoodsPage;

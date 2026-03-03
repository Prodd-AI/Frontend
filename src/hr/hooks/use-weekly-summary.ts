import { useQuery } from "@tanstack/react-query";
import {
  getWeeklySummary,
  type ChartDataPoint,
} from "@/config/services/time-tracking.service";

const BAR_COLOR = "bg-[#934DFF]";

/** Map API chart_data (Mon–Sun with day, value) to bar chart items with hours and color */
export function mapChartDataToHoursData(
  chartData: ChartDataPoint[] = [],
): { day: string; hours: number; color: string }[] {
  return chartData.map(({ day, value }) => ({
    day,
    hours: value,
    color: value > 0 ? BAR_COLOR : "bg-transparent",
  }));
}

export function useWeeklySummary() {
  const { data, isLoading: is_loading, error } = useQuery({
    queryKey: ["time-tracking", "weekly-summary"],
    queryFn: async () => {
      const response = await getWeeklySummary();
      return response?.data ?? null;
    },
  });

  const summary = data ?? null;
  const hoursData = mapChartDataToHoursData(summary?.chart_data);
  const totalHoursLabel =
    summary != null
      ? `${Number(summary.total_hours).toFixed(1)}h`
      : "0h";
  const dailyAvgLabel = summary?.daily_avg ?? "0";
  const totalEntries = summary?.total_entries ?? 0;

  return {
    summary,
    hoursData,
    totalHoursLabel,
    dailyAvgLabel,
    totalEntries,
    is_loading,
    error,
  };
}

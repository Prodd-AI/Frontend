import { useState } from "react";
import { format, subDays } from "date-fns";

export const useDateRange = () => {
  const today = new Date();
  const [startDate, setStartDate] = useState(
    format(subDays(today, 30), "yyyy-MM-dd"),
  );
  const [endDate, setEndDate] = useState(format(today, "yyyy-MM-dd"));

  const handleDateRangeChange = (newStartDate: string, newEndDate: string) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  return {
    startDate,
    endDate,
    handleDateRangeChange,
  };
};

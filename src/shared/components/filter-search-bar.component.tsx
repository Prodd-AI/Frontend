import { Filter } from "lucide-react";
import { useState } from "react";
import { DatePickerField } from "./date-picker-field.component";
import { format, subDays } from "date-fns";

interface FilterBarProps {
  onDateRangeChange?: (startDate: string, endDate: string) => void;
}

export function FilterBar({ onDateRangeChange }: FilterBarProps) {
  const today = new Date();
  const defaultStartDate = format(subDays(today, 30), "yyyy-MM-dd");
  const defaultEndDate = format(today, "yyyy-MM-dd");

  const [startDate, setStartDate] = useState<string>(defaultStartDate);
  const [endDate, setEndDate] = useState<string>(defaultEndDate);

  const handleStartDateChange = (value: Date | string | undefined) => {
    const newStartDate =
      typeof value === "string"
        ? value
        : value
          ? format(value, "yyyy-MM-dd")
          : "";
    setStartDate(newStartDate);
    if (onDateRangeChange && newStartDate && endDate) {
      onDateRangeChange(newStartDate, endDate);
    }
  };

  const handleEndDateChange = (value: Date | string | undefined) => {
    const newEndDate =
      typeof value === "string"
        ? value
        : value
          ? format(value, "yyyy-MM-dd")
          : "";
    setEndDate(newEndDate);
    if (onDateRangeChange && startDate && newEndDate) {
      onDateRangeChange(startDate, newEndDate);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">Filters:</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">From:</span>
        <DatePickerField
          value={startDate}
          onChange={handleStartDateChange}
          placeholder="Start date"
          outputFormat="string"
          dateStringFormat="yyyy-MM-dd"
          className="w-[160px] border-transparent bg-[#ECEEF3] shadow-card"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">To:</span>
        <DatePickerField
          value={endDate}
          onChange={handleEndDateChange}
          placeholder="End date"
          outputFormat="string"
          dateStringFormat="yyyy-MM-dd"
          className="w-[160px] border-transparent bg-[#ECEEF3] shadow-card"
        />
      </div>
    </div>
  );
}

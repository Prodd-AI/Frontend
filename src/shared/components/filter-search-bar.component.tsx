import { Filter } from "lucide-react";
import { DatePickerField } from "./date-picker-field.component";
import { format } from "date-fns";

interface FilterBarProps {
  startDate: string;
  endDate: string;
  onDateRangeChange: (startDate: string, endDate: string) => void;
}

export function FilterBar({
  startDate,
  endDate,
  onDateRangeChange,
}: FilterBarProps) {
  const startDateAsDate = startDate ? new Date(startDate) : undefined;

  const handleStartDateChange = (value: Date | string | undefined) => {
    const newStartDate =
      typeof value === "string"
        ? value
        : value
        ? format(value, "yyyy-MM-dd")
          : "";

    if (newStartDate && endDate && new Date(newStartDate) > new Date(endDate)) {
      onDateRangeChange(newStartDate, newStartDate);
    } else if (newStartDate && endDate) {
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
    if (startDate && newEndDate) {
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
          minDate={startDateAsDate}
        />
      </div>
    </div>
  );
}

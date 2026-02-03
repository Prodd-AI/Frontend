import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface DatePickerFieldProps {
  value: Date | string | undefined;
  onChange: (value: Date | string | undefined) => void;
  placeholder?: string;
  outputFormat?: "date" | "string";
  dateStringFormat?: string;
  className?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

export const DatePickerField = ({
  value,
  onChange,
  placeholder = "Select date",
  outputFormat = "date",
  dateStringFormat = "yyyy-MM-dd",
  className,
  disabled = false,
  minDate,
  maxDate,
}: DatePickerFieldProps) => {
  // Convert value to Date for the Calendar
  const selectedDate = value
    ? typeof value === "string"
      ? new Date(value)
      : value
    : undefined;

  const handleSelect = (date: Date | undefined) => {
    if (!date) {
      onChange(undefined);
      return;
    }

    if (outputFormat === "string") {
      onChange(format(date, dateStringFormat));
    } else {
      onChange(date);
    }
  };

  const displayValue = selectedDate
    ? format(selectedDate, "MMM dd, yyyy")
    : placeholder;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          disabled={disabled}
          className={cn(
            "h-12 w-full justify-between text-left font-normal bg-gray-50/80 border border-gray-200/60 rounded-xl text-sm transition-all duration-200 hover:bg-gray-100/80 hover:border-gray-300/60",
            !value && "text-muted-foreground/50",
            className,
          )}
        >
          {displayValue}
          <CalendarIcon className="h-4 w-4 text-muted-foreground/60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 bg-white border-gray-200/80 rounded-xl shadow-lg"
        align="start"
      >
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          className="p-3 pointer-events-auto"
          disabled={(date) => {
            if (minDate && date < minDate) return true;
            if (maxDate && date > maxDate) return true;
            return false;
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePickerField;

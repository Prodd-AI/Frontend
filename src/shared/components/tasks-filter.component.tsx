import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type TasksDuration = "day" | "week" | "month";
export type TasksStatus = "all" | "pending" | "completed";

interface TasksFilterProps {
  duration: TasksDuration;
  status: TasksStatus;
  onDurationChange: (value: TasksDuration) => void;
  onStatusChange: (value: TasksStatus) => void;
}

const DURATION_LABELS: Record<TasksDuration, string> = {
  day: "Today",
  week: "This Week",
  month: "This Month",
};

const STATUS_LABELS: Record<TasksStatus, string> = {
  all: "All",
  pending: "Pending",
  completed: "Completed",
};

export default function TasksFilter({
  duration,
  status,
  onDurationChange,
  onStatusChange,
}: TasksFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={duration}
        onValueChange={(v) => onDurationChange(v as TasksDuration)}
      >
        <SelectTrigger className="h-10 w-[140px] bg-white border-gray-200">
          <SelectValue placeholder="Duration" />
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(DURATION_LABELS) as TasksDuration[]).map((d) => (
            <SelectItem key={d} value={d}>
              {DURATION_LABELS[d]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={status}
        onValueChange={(v) => onStatusChange(v as TasksStatus)}
      >
        <SelectTrigger className="h-10 w-[140px] bg-white border-gray-200">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(STATUS_LABELS) as TasksStatus[]).map((s) => (
            <SelectItem key={s} value={s}>
              {STATUS_LABELS[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

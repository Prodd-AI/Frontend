import { ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ReviewStatus = "pending" | "approved" | "changes-requested";

interface ProgressReviewCardProps {
  name: string;
  weekLabel: string;
  completedTasks: number;
  totalTasks: number;
  description: string;
  status?: ReviewStatus;
  onApprove?: () => void;
  onRequestChanges?: () => void;
  onClick?: () => void;
  className?: string;
}

const statusConfig: Record<ReviewStatus, { label: string; className: string }> =
  {
    pending: {
      label: "Pending Review",
      className: "bg-amber-100 text-amber-700",
    },
    approved: {
      label: "Approved",
      className: "bg-green-100 text-green-700",
    },
    "changes-requested": {
      label: "Changes Requested",
      className: "bg-red-100 text-red-700",
    },
  };

export function ProgressReviewCard({
  name,
  weekLabel,
  completedTasks,
  totalTasks,
  description,
  status = "pending",
  onApprove,
  onRequestChanges,
  onClick,
  className,
}: ProgressReviewCardProps) {
  const percentage = Math.round((completedTasks / totalTasks) * 100);
  const statusInfo = statusConfig[status];

  return (
    <div
      className={cn(
        "bg-[#F3F4F6] rounded-2xl p-6 shadow-card animate-fade-in",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-semibold text-foreground">
          {name} - {weekLabel}
        </h3>
        <span
          className={cn(
            "px-3 py-1 rounded-full text-sm font-medium",
            statusInfo.className
          )}
        >
          {statusInfo.label}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <Progress
          value={percentage}
          className="h-3 bg-[#D1D5DB] [&>div]:bg-[#25AC42]"
        />
      </div>

      {/* Description and Stats */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">{description}</p>
        <span className="text-sm text-muted-foreground whitespace-nowrap ml-4">
          {completedTasks}/{totalTasks} - {percentage}%
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <Button
            onClick={onApprove}
            className="bg-[#25AC42] hover:bg-[#1e9438] text-white font-medium"
            size="sm"
          >
            Approve
          </Button>
          <Button
            onClick={onRequestChanges}
            className="bg-red-500 hover:bg-red-600 text-white font-medium"
            size="sm"
          >
            Request Changes
          </Button>
        </div>

        <button
          onClick={onClick}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          aria-label="View details"
        >
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
}

export default ProgressReviewCard;

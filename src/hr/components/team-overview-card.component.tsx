import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type TeamHealth = "healthy" | "at_risk" | "critical";

interface TeamOverviewCardProps {
  teamName: string;
  leadName: string;
  health: TeamHealth;
  teamSize: number;
  performance: number;
  onViewDetails?: () => void;
  className?: string;
}

const healthConfig: Record<
  TeamHealth,
  { label: string; color: string; bg: string }
> = {
  healthy: {
    label: "Healthy",
    color: "text-[#10B981]",
    bg: "bg-[#E6F4E9]",
  },
  at_risk: {
    label: "At Risk",
    color: "text-[#EF4444]",
    bg: "bg-[#FD00000D]",
  },
  critical: {
    label: "Critical",
    color: "text-[#EF4444]",
    bg: "bg-[#FD00000D]",
  },
};

export default function TeamOverviewCard({
  teamName,
  leadName,
  health,
  teamSize,
  performance,
  onViewDetails,
  className,
}: TeamOverviewCardProps) {
  const { label, color, bg } = healthConfig[health];

  return (
    <Card
      className={cn(
        "bg-card",
        className,
        "shadow-[0px_4px_4px_-4px_rgba(12,12,13,0.05),0px_16px_16px_-8px_rgba(12,12,13,0.10)]",
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-4 pt-6">
        <div>
          <h3 className="text-lg font-semibold text-[#251F2D]">{teamName}</h3>
          {leadName === "Unassigned" ? (
            <p className="text-sm text-red-500 italic font-[400] mt-0.5">
              Team lead not yet assigned
            </p>
          ) : (
            <p className="text-sm text-[#6B7280] font-[400] mt-0.5">
              Led by {leadName}
            </p>
          )}
        </div>
        <span
          className={cn(
            "text-sm font-bold px-3 py-1 rounded-full shrink-0",
            color,
            bg,
          )}
        >
          {label}
        </span>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Team Size</span>
          <span className="text-sm font-semibold text-[#251F2D]">
            {teamSize} Member{teamSize !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Performance</span>
          <span className="text-sm font-semibold text-emerald-500">
            {performance}%
          </span>
        </div>

        {/* Performance progress bar — clean solid gradient (no stripes) */}
        <div className="relative h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-[width] duration-500 ease-out"
            style={{
              width: `${Math.min(Math.max(performance, 0), 100)}%`,
            }}
          />
        </div>
      </CardContent>

      <CardFooter className="pt-4 pb-6">
        <Button className="w-full" onClick={onViewDetails}>
          View Team Details
        </Button>
      </CardFooter>
    </Card>
  );
}

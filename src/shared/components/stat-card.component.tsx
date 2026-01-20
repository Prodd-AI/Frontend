import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  badge?: ReactNode;
  emoji?: string;
  className?: string;
  iconClassName?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  badge,
  emoji,
  className,
  iconClassName,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-[#F3F4F6] rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 opacity-0 animate-fade-in",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-[1rem] font-[600] text-[#6B7280]">{title}</h3>
        <div className={cn("p-1", iconClassName)}>{icon}</div>
      </div>

      <div className="flex items-center gap-2 ">
        {emoji && <span className="text-3xl">{emoji}</span>}
        <span className="text-4xl font-semibold text-foreground tracking-tight">
          {value}
        </span>
      </div>
      {badge && <div className="mt-2">{badge}</div>}
      {subtitle && (
        <p className="mt-2 text-[12px] text-[#6B7280]">{subtitle}</p>
      )}
    </div>
  );
}

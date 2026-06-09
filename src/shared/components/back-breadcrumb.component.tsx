import { ChevronRight, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface BreadcrumbSegment {
  label: string;
  /** When omitted, the segment renders as plain text (use for the current page). */
  to?: string;
}

interface BackBreadcrumbProps {
  /** Ordered list — last segment is the current page and shouldn't link. */
  trail: BreadcrumbSegment[];
  /** Optional explicit back target. Defaults to navigate(-1). */
  backTo?: string;
  /** Optional label for the back button. */
  backLabel?: string;
  className?: string;
}

/**
 * Unified back + breadcrumb header used at the top of every detail / nested page.
 * Keeps navigation affordances consistent across Admin, team-lead, and team-member.
 */
export function BackBreadcrumb({
  trail,
  backTo,
  backLabel = "Back",
  className,
}: BackBreadcrumbProps) {
  const navigate = useNavigate();
  const handleBack = () => (backTo ? navigate(backTo) : navigate(-1));

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Button
        type="button"
        variant="ghost"
        onClick={handleBack}
        className="px-2 w-fit text-sm text-[#5A5D61] hover:text-[#251F2D]"
      >
        <ArrowLeft className="size-4 mr-2" />
        {backLabel}
      </Button>

      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs">
        {trail.map((segment, idx) => {
          const isLast = idx === trail.length - 1;
          return (
            <span key={`${segment.label}-${idx}`} className="flex items-center gap-1.5">
              {idx > 0 && (
                <ChevronRight className="size-3.5 text-gray-300" aria-hidden />
              )}
              {isLast || !segment.to ? (
                <span
                  className={cn(
                    "truncate max-w-[260px]",
                    isLast ? "font-semibold text-[#251F2D]" : "text-[#5A5D61]",
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {segment.label}
                </span>
              ) : (
                <Link
                  to={segment.to}
                  className="text-[#5A5D61] hover:text-[#6619DE] hover:underline truncate max-w-[260px]"
                >
                  {segment.label}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
    </div>
  );
}

export default BackBreadcrumb;

import { cn } from "@/lib/utils";

interface AviPlaceholderProps {
  firstName?: string;
  lastName?: string;
  /** Full name fallback when first/last aren't available. */
  name?: string;
  className?: string;
  "aria-label"?: string;
}

/** Build avatar initials from a name (e.g. "Saviour Ise" → "SI"). */
function getInitials(firstName?: string, lastName?: string, name?: string) {
  const source =
    [firstName, lastName].filter(Boolean).join(" ").trim() ||
    (name ?? "").trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Profile avatar placeholder shown when a user has no uploaded image.
 * Renders the user's initials on a branded circle instead of a generic
 * avatar illustration.
 */
function AviPlaceholder({
  firstName,
  lastName,
  name,
  className,
  "aria-label": ariaLabel,
}: AviPlaceholderProps) {
  const initials = getInitials(firstName, lastName, name);

  return (
    <span
      role="img"
      aria-label={ariaLabel ?? `${initials} avatar placeholder`}
      className={cn(
        "size-10 shrink-0 rounded-full bg-[#EEE3FF] text-[#6619DE] flex items-center justify-center text-sm font-semibold select-none",
        className,
      )}
    >
      {initials}
    </span>
  );
}

export default AviPlaceholder;

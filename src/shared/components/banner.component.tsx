import clsx from "clsx"
import { MdDangerous } from "react-icons/md"
import { GoInfo } from "react-icons/go";
import { IoWarningOutline } from "react-icons/io5";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { VscClose } from "react-icons/vsc";
// Variant-based color styles
const variantStyles = {
  critical: "bg-bg-status-red border-text-status-red/20",
  success: "bg-bg-status-green border-text-status-green/20",
  warning: "bg-bg-status-yellow border-text-status-yellow/20",
  info: "bg-[#eff6ff] border-[#3b82f6]/20"
};

const iconStyles = {
  critical: "text-danger-color",
  success: "text-success-color",
  warning: "text-warning-color",
  info: "text-[#3b82f6]"
};

const textStyles = {
  critical: "text-text-status-red",
  success: "text-text-status-green",
  warning: "text-text-status-yellow",
  info: "text-[#2563eb]"
};

const paddingStyles = {
  default: "p-4",
  compact: "p-3"
};

function Banner({
  className,
  ariaLabel,
  description,
  primaryAction,
  secondaryAction,
  variant = "info",
  title,
  open,
  onDismiss,
  isDismiss = false,
  layout = "default",
  actionsLayout = "inline"
}: BannerPropsInt) {
  const Icon = variant === "critical" ? MdDangerous : variant === "info" ? GoInfo : variant === "success" ? IoCheckmarkCircleOutline : variant === "warning" ? IoWarningOutline : null


  const handleDismiss = () => {
    onDismiss?.();
  };

  const role = variant === "critical" || variant === "warning" ? "alert" : "status";

  if (!open) return null;

  return (
    <aside
      role={role}
      className={clsx(
        "flex gap-4 border rounded-lg shadow-sm transition-all duration-300",
        paddingStyles[layout],
        variant && variantStyles[variant],
        className
      )}
      aria-label={ariaLabel}
    >
      {
        Icon && <Icon size={20} className={clsx("flex-shrink-0", variant && iconStyles[variant])} />
      }
      <div className="flex-1 min-w-0">
        {title && <p className={clsx("font-semibold text-sm leading-5", variant && textStyles[variant])}>{title}</p>}
        {description && <p className={clsx("text-sm leading-5 mt-0.5", variant && textStyles[variant], "opacity-90")}>{description}</p>}
      </div>
      {
        (primaryAction || secondaryAction) && (
          <div className={clsx(
            "flex items-start gap-3 flex-shrink-0",
            actionsLayout === "stacked" && "flex-col",
            actionsLayout === "inline" && "flex-row"
          )}>
            {primaryAction}
            {secondaryAction}
          </div>
        )
      }

      {
        isDismiss && (
          <button
            onClick={handleDismiss}
            className={clsx(
              "flex items-center justify-center p-1.5 cursor-pointer rounded transition-colors flex-shrink-0",
              "hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-1",
              variant && textStyles[variant]
            )}
            aria-label="Dismiss banner"
          >
            <VscClose size={20} />
          </button>
        )
      }

    </aside>
  )
}

export default Banner
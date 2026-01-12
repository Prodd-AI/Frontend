import clsx from "clsx";
import { MdError, MdCheckCircle, MdInfo, MdWarning } from "react-icons/md";
import { IoClose } from "react-icons/io5";

// Variant-based color styles - brighter and more vibrant
const variantStyles = {
  critical: "bg-gradient-to-r from-red-50 to-red-100 border-red-300",
  success: "bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-300",
  warning: "bg-gradient-to-r from-amber-50 to-amber-100 border-amber-300",
  info: "bg-gradient-to-r from-blue-50 to-sky-100 border-blue-300",
};

const iconStyles = {
  critical: "text-red-500",
  success: "text-emerald-500",
  warning: "text-amber-500",
  info: "text-blue-500",
};

const textStyles = {
  critical: "text-red-700",
  success: "text-emerald-700",
  warning: "text-amber-700",
  info: "text-blue-700",
};

const paddingStyles = {
  default: "p-4",
  compact: "p-3",
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
  actionsLayout = "inline",
}: BannerPropsInt) {
  const Icon =
    variant === "critical"
      ? MdError
      : variant === "success"
      ? MdCheckCircle
      : variant === "warning"
      ? MdWarning
      : MdInfo;

  const handleDismiss = () => {
    onDismiss?.();
  };

  const role =
    variant === "critical" || variant === "warning" ? "alert" : "status";

  if (!open) return null;

  return (
    <aside
      role={role}
      className={clsx(
        "flex gap-3 border rounded-xl shadow-sm transition-all duration-300",
        paddingStyles[layout],
        variant && variantStyles[variant],
        className
      )}
      aria-label={ariaLabel}
    >
      <div
        className={clsx(
          "flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0",
          variant === "critical" && "bg-red-100",
          variant === "success" && "bg-emerald-100",
          variant === "warning" && "bg-amber-100",
          variant === "info" && "bg-blue-100"
        )}
      >
        <Icon size={20} className={clsx(variant && iconStyles[variant])} />
      </div>
      <div className="flex-1 min-w-0 py-0.5">
        {title && (
          <p
            className={clsx(
              "font-semibold text-sm leading-5",
              variant && textStyles[variant]
            )}
          >
            {title}
          </p>
        )}
        {description && (
          <p
            className={clsx(
              "text-sm leading-5",
              title && "mt-0.5",
              variant && textStyles[variant]
            )}
          >
            {description}
          </p>
        )}
      </div>
      {(primaryAction || secondaryAction) && (
        <div
          className={clsx(
            "flex items-start gap-3 flex-shrink-0",
            actionsLayout === "stacked" && "flex-col",
            actionsLayout === "inline" && "flex-row"
          )}
        >
          {primaryAction}
          {secondaryAction}
        </div>
      )}

      {isDismiss && (
        <button
          onClick={handleDismiss}
          className={clsx(
            "flex items-center justify-center w-7 h-7 cursor-pointer rounded-full transition-all duration-200 flex-shrink-0",
            "hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-1",
            variant === "critical" &&
              "text-red-400 hover:text-red-600 focus:ring-red-300",
            variant === "success" &&
              "text-emerald-400 hover:text-emerald-600 focus:ring-emerald-300",
            variant === "warning" &&
              "text-amber-400 hover:text-amber-600 focus:ring-amber-300",
            variant === "info" &&
              "text-blue-400 hover:text-blue-600 focus:ring-blue-300"
          )}
          aria-label="Dismiss banner"
        >
          <IoClose size={18} />
        </button>
      )}
    </aside>
  );
}

export default Banner;

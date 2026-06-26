import clsx from "clsx";
import { MdError, MdCheckCircle, MdInfo, MdWarning } from "react-icons/md";
import { IoClose } from "react-icons/io5";

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

const layoutStyles = {
  default: {
    root: "gap-3 rounded-xl p-4",
    iconWrapper: "h-8 w-8",
    iconSize: 20,
    content: "py-0.5",
    title: "text-sm font-semibold leading-5",
    description: "text-sm leading-5",
    descriptionSpacing: "mt-0.5",
    dismissButton: "h-7 w-7",
    dismissIconSize: 18,
  },
  compact: {
    root: "gap-2 rounded-lg p-2.5",
    iconWrapper: "h-6 w-6",
    iconSize: 16,
    content: "py-0",
    title: "text-xs font-semibold leading-4",
    description: "text-xs leading-snug",
    descriptionSpacing: "mt-0.5",
    dismissButton: "h-6 w-6",
    dismissIconSize: 14,
  },
} as const;

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
  titleClassName,
  descriptionClassName,
  contentClassName,
}: BannerPropsInt) {
  const Icon =
    variant === "critical"
      ? MdError
      : variant === "success"
        ? MdCheckCircle
        : variant === "warning"
          ? MdWarning
          : MdInfo;

  const styles = layoutStyles[layout];

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
        "flex border shadow-sm transition-all duration-300",
        styles.root,
        variant && variantStyles[variant],
        className,
      )}
      aria-label={ariaLabel}
    >
      <div
        className={clsx(
          "flex shrink-0 items-center justify-center rounded-full",
          styles.iconWrapper,
          variant === "critical" && "bg-red-100",
          variant === "success" && "bg-emerald-100",
          variant === "warning" && "bg-amber-100",
          variant === "info" && "bg-blue-100",
        )}
      >
        <Icon
          size={styles.iconSize}
          className={clsx(variant && iconStyles[variant])}
        />
      </div>
      <div className={clsx("min-w-0 flex-1", styles.content, contentClassName)}>
        {title && (
          <p
            className={clsx(
              styles.title,
              variant && textStyles[variant],
              titleClassName,
            )}
          >
            {title}
          </p>
        )}
        {description && (
          <p
            className={clsx(
              styles.description,
              title && styles.descriptionSpacing,
              variant && textStyles[variant],
              descriptionClassName,
            )}
          >
            {description}
          </p>
        )}
      </div>
      {(primaryAction || secondaryAction) && (
        <div
          className={clsx(
            "flex shrink-0 items-start gap-3",
            actionsLayout === "stacked" && "flex-col",
            actionsLayout === "inline" && "flex-row",
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
            "flex shrink-0 cursor-pointer items-center justify-center rounded-full transition-all duration-200",
            styles.dismissButton,
            "hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-1",
            variant === "critical" &&
              "text-red-400 hover:text-red-600 focus:ring-red-300",
            variant === "success" &&
              "text-emerald-400 hover:text-emerald-600 focus:ring-emerald-300",
            variant === "warning" &&
              "text-amber-400 hover:text-amber-600 focus:ring-amber-300",
            variant === "info" &&
              "text-blue-400 hover:text-blue-600 focus:ring-blue-300",
          )}
          aria-label="Dismiss banner"
        >
          <IoClose size={styles.dismissIconSize} />
        </button>
      )}
    </aside>
  );
}

export default Banner;
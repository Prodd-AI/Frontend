type BannerVariant = "critical" | "info" | "success" | "warning";

type BannerLayout = "default" | "compact";

type BannerActionLayout = "inline" | "stacked";

interface BannerPropsInt {
  open: boolean;
  title?: string;
  description?: string;
  className?: string;
  icon?: React.ReactNode;
  isDismiss?: boolean;
  onDismiss?: () => void;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  variant?: BannerVariant;
  layout?: BannerLayout;
  actionsLayout?: BannerActionLayout;
  ariaLabel?: string;
}

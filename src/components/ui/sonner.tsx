import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-[10px]",
          description:
            "group-[.toast]:text-muted-foreground group-[.toast]:text-sm",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success:
            "group-[.toaster]:!bg-green-50 group-[.toaster]:!text-success-color group-[.toaster]:!border-success-color/20",
          error:
            "group-[.toaster]:!bg-red-50 group-[.toaster]:!text-danger-color group-[.toaster]:!border-danger-color/20",
          warning:
            "group-[.toaster]:!bg-yellow-50 group-[.toaster]:!text-warning-color group-[.toaster]:!border-warning-color/20",
          info: "group-[.toaster]:!bg-blue-50 group-[.toaster]:!text-primary-color group-[.toaster]:!border-primary-color/20",
          loading:
            "group-[.toaster]:!bg-purple-50 group-[.toaster]:!text-primary-color group-[.toaster]:!border-primary-color/20",
        },
        style: {
          fontFamily: '"Open Sans", sans-serif',
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };

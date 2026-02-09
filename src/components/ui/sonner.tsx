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
            "group-[.toaster]:!bg-gradient-to-r group-[.toaster]:!from-emerald-50 group-[.toaster]:!to-emerald-100 group-[.toaster]:!text-emerald-700 group-[.toaster]:!border-emerald-300",
          error:
            "group-[.toaster]:!bg-gradient-to-r group-[.toaster]:!from-red-50 group-[.toaster]:!to-red-100 group-[.toaster]:!text-red-700 group-[.toaster]:!border-red-300",
          warning:
            "group-[.toaster]:!bg-gradient-to-r group-[.toaster]:!from-amber-50 group-[.toaster]:!to-amber-100 group-[.toaster]:!text-amber-700 group-[.toaster]:!border-amber-300",
          info: "group-[.toaster]:!bg-gradient-to-r group-[.toaster]:!from-blue-50 group-[.toaster]:!to-sky-100 group-[.toaster]:!text-blue-700 group-[.toaster]:!border-blue-300",
          loading:
            "group-[.toaster]:!bg-gradient-to-r group-[.toaster]:!from-purple-50 group-[.toaster]:!to-purple-100 group-[.toaster]:!text-purple-700 group-[.toaster]:!border-purple-300",
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

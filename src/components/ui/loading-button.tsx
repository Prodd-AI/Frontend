import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ComponentProps, Ref } from "react";

type ButtonPropsType = ComponentProps<typeof Button>;

interface LoadingButtonProps extends ButtonPropsType {
  loading?: boolean;
  loadingText?: string;
  ref?: Ref<HTMLButtonElement>;
}

function LoadingButton({
  loading,
  loadingText = "Loading...",
  children,
  disabled,
  ref,
  ...props
}: LoadingButtonProps) {
  return (
    <Button ref={ref} disabled={disabled || loading} {...props}>
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}

export { LoadingButton };
export type { LoadingButtonProps };

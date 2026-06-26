import { Label } from "@/components/ui/label";
import clsx from "clsx";

function FormFieldLabel({
  htmlFor,
  children,
  required = false,
  className,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <Label htmlFor={htmlFor} className={clsx("!gap-0", className)}>
      <span className="inline-flex items-baseline">
        {children}
        {required && <span className="form-required-asterisk">*</span>}
      </span>
    </Label>
  );
}

export default FormFieldLabel;
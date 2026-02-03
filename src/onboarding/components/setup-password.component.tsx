import { ResetPasswordFormData } from "@/auth/typings/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface SetupPasswordComponentProps {
  form: UseFormReturn<ResetPasswordFormData>;
}

function SetupPasswordComponent({ form }: SetupPasswordComponentProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, formState: { errors } } = form;

  return (
    <div className="flex flex-col gap-[19px]">
      <div className="flex flex-col gap-[9px]">
        <Label htmlFor="new_password" className="font-semibold text-[1rem]">
          Enter New Password
        </Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="New password"
            id="new_password"
            {...register("new_password")}
            className="h-[55px] rounded-[10px] pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#6619DE] transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        </div>
        {errors.new_password && (
          <div className="text-red-500 text-sm">
            {errors.new_password.message}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-[9px]">
        <Label htmlFor="confirm_password" className="font-semibold text-[1rem]">
          Confirm New Password
        </Label>
        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm new password"
            id="confirm_password"
            {...register("confirm_password")}
            className="h-[55px] rounded-[10px] pr-12"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#6619DE] transition-colors"
            aria-label={
              showConfirmPassword ? "Hide password" : "Show password"
            }
          >
            {showConfirmPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        </div>
        {errors.confirm_password && (
          <div className="text-red-500 text-sm">
            {errors.confirm_password.message}
          </div>
        )}
      </div>
    </div>
  );
}

export default SetupPasswordComponent;

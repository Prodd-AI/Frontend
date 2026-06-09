import { SetPasswordFormData } from "@/auth/typings/auth";
import Banner from "@/shared/components/banner.component";
import { LoadingButton } from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { set_password } from "@/config/services/auth.service";
import { set_password_schema } from "@/lib/schemas";
import { getErrorMessage } from "@/shared/utils/error-message.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

function SetPasswordFormComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [banner, setBanner] = useState<{
    message: string;
    isOpen: boolean;
  }>({
    message: "",
    isOpen: false,
  });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<SetPasswordFormData>({
    resolver: zodResolver(set_password_schema),
  });

  const { mutate, isPending } = useMutation<
    GeneralReturnInt<unknown>,
    Error,
    SetPasswordFormData
  >({
    mutationFn: (data) => set_password(data),
    onSuccess: (res) => {
      toast.success(res.message || "Password set successfully.");
      const email = searchParams.get("email");
      const redirectPath = email
        ? `/auth/login?email=${encodeURIComponent(email)}`
        : "/auth/login";
      navigate(redirectPath, { replace: true });
    },
    onError: (error) => {
      setBanner({
        message: getErrorMessage(error),
        isOpen: true,
      });
    },
  });

  const onSubmit = (values: SetPasswordFormData) => {
    mutate(values);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-[19px]"
      noValidate
    >
      <Banner
        open={banner.isOpen}
        description={banner.message}
        variant="critical"
        isDismiss
        onDismiss={() => setBanner({ message: "", isOpen: false })}
      />

      <div className="flex flex-col gap-[9px]">
        <Label htmlFor="password" className="font-semibold text-[1rem]">
          Password
        </Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Create password"
            id="password"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            {...register("password")}
            className="h-[55px] rounded-[10px] pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#6619DE] transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && (
          <div id="password-error" className="text-red-500 text-sm">
            {errors.password.message}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-[9px]">
        <Label htmlFor="confirm_password" className="font-semibold text-[1rem]">
          Confirm Password
        </Label>
        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            id="confirm_password"
            autoComplete="new-password"
            aria-invalid={!!errors.confirm_password}
            aria-describedby={
              errors.confirm_password ? "confirm-password-error" : undefined
            }
            {...register("confirm_password")}
            className="h-[55px] rounded-[10px] pr-12"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((value) => !value)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#6619DE] transition-colors"
            aria-label={
              showConfirmPassword ? "Hide password" : "Show password"
            }
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.confirm_password && (
          <div id="confirm-password-error" className="text-red-500 text-sm">
            {errors.confirm_password.message}
          </div>
        )}
      </div>

      <LoadingButton
        type="submit"
        loading={isPending}
        loadingText="Setting password..."
        className="h-11 sm:h-[2.543rem] md:h-14 mt-3"
      >
        Continue
      </LoadingButton>
    </form>
  );
}

export default SetPasswordFormComponent;

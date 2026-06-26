import { SetPasswordFormData } from "@/auth/typings/auth";
import Banner from "@/shared/components/banner.component";
import { LoadingButton } from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import FormFieldLabel from "@/shared/components/form-field-label";
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
      className="auth-immersive-form"
      noValidate
    >
      <Banner
        open={banner.isOpen}
        description={banner.message}
        variant="critical"
        layout="compact"
        isDismiss
        onDismiss={() => setBanner({ message: "", isOpen: false })}
      />

      <div className="auth-immersive-field">
        <FormFieldLabel htmlFor="password" className="auth-immersive-label" required>
          Password
        </FormFieldLabel>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Create password"
            id="password"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            {...register("password")}
            className="auth-immersive-input pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] transition-colors hover:text-[#6619DE]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <div id="password-error" className="auth-immersive-error">
            {errors.password.message}
          </div>
        )}
      </div>

      <div className="auth-immersive-field">
        <FormFieldLabel htmlFor="confirm_password" className="auth-immersive-label" required>
          Confirm Password
        </FormFieldLabel>
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
            className="auth-immersive-input pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((value) => !value)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] transition-colors hover:text-[#6619DE]"
            aria-label={
              showConfirmPassword ? "Hide password" : "Show password"
            }
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirm_password && (
          <div id="confirm-password-error" className="auth-immersive-error">
            {errors.confirm_password.message}
          </div>
        )}
      </div>

      <LoadingButton
        type="submit"
        loading={isPending}
        loadingText="Setting password..."
        className="auth-immersive-btn"
      >
        Continue
      </LoadingButton>
    </form>
  );
}

export default SetPasswordFormComponent;
import { ResetPasswordFormData } from "@/auth/typings/auth";
import { LoadingButton } from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import FormFieldLabel from "@/shared/components/form-field-label";
import { reset_password } from "@/config/services/auth.service";
import { reset_password_schema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Link } from "react-router-dom";

function ResetPasswordFormComponent({
  setShowPasswordResetSuccess,
}: ResetPasswordFormComponentPropsInt) {
  const [searchParam] = useSearchParams();

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(reset_password_schema),
  });
  const { mutate, isPending } = useMutation<
    GeneralReturnInt<unknown>,
    GeneralErrorInt,
    {
      new_password: string;
      confirm_password: string;
      token: string;
    }
  >({
    mutationFn: (data) => reset_password(data),
    onSuccess: (res) => {
      toast.success(res.message);
      setTimeout(() => {
        setShowPasswordResetSuccess(true);
      }, 500);
    },
  });

  const token = searchParam.get("token");
  const onSubmit = (values: ResetPasswordFormData) => {
    if (!token) return;
    const transformedData = Object.assign(
      {
        token,
      },
      values
    );

    mutate(transformedData);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-immersive-form">
      <div className="auth-immersive-field">
        <FormFieldLabel htmlFor="password" className="auth-immersive-label" required>
          Enter New Password
        </FormFieldLabel>
        <Input
          placeholder="New password"
          id="password"
          {...register("new_password")}
          className="auth-immersive-input"
        />
        {errors.new_password && (
          <div className="auth-immersive-error">{errors.new_password.message}</div>
        )}
      </div>
      <div className="auth-immersive-field">
        <FormFieldLabel htmlFor="confirm-password" className="auth-immersive-label" required>
          Confirm New Password
        </FormFieldLabel>
        <Input
          placeholder="Confirm new password"
          id="confirm-password"
          {...register("confirm_password")}
          className="auth-immersive-input"
        />
        {errors.confirm_password && (
          <div className="auth-immersive-error">
            {errors.confirm_password.message}
          </div>
        )}
      </div>
      <LoadingButton
        type="submit"
        loading={isPending}
        loadingText="Submitting..."
        className="auth-immersive-btn"
      >
        Submit
      </LoadingButton>

      <p className="auth-immersive-link-row">
        Go back to{" "}
        <Link
          to="/auth/login"
          className="text-[#6619DE] transition-all duration-300 hover:underline"
        >
          Login
        </Link>
      </p>
    </form>
  );
}

export default ResetPasswordFormComponent;
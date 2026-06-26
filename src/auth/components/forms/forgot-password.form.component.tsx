import { ForgotPasswordFormData } from "@/auth/typings/auth";
import { LoadingButton } from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import FormFieldLabel from "@/shared/components/form-field-label";
import { forgot_password_schema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutateFunction } from "@tanstack/react-query";

import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

interface ForgotPasswordFormComponentPropsInt {
  email: string;
  isPending: boolean;
  mutate: UseMutateFunction<
    GeneralReturnInt<unknown>,
    GeneralErrorInt,
    {
      email: string;
    },
    unknown
  >;
}
function ForgotPasswordFormComponent({
  email,
  isPending,
  mutate,
}: ForgotPasswordFormComponentPropsInt) {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgot_password_schema),
    defaultValues: {
      email: email ?? "",
    },
  });

  const ForgotPasswordOnSubmit = (values: ForgotPasswordFormData) => {
    mutate(values);
  };

  return (
    <form
      onSubmit={handleSubmit(ForgotPasswordOnSubmit)}
      className="auth-immersive-form"
    >
      <div className="auth-immersive-field">
        <FormFieldLabel htmlFor="email" className="auth-immersive-label" required>
          Email Address
        </FormFieldLabel>
        <Input
          id="email"
          placeholder="e.g johndoe@gmail.com"
          type="email"
          {...register("email")}
          className="auth-immersive-input"
        />
        {errors.email && (
          <div className="auth-immersive-error">{errors.email.message}</div>
        )}
      </div>
      <LoadingButton
        type="submit"
        loading={isPending}
        loadingText="Submitting..."
        className="auth-immersive-btn w-full"
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

export default ForgotPasswordFormComponent;
import AuthFormLayout from "@/shared/components/auth-form-layout";
import AuthLayout from "@/shared/components/auth.layout.component";
import ForgotPasswordFormComponent from "@/auth/components/forms/forgot-password.form.component";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ShowEmailConfirmation from "../components/show-email-confirmation.component";
import { useMutation } from "@tanstack/react-query";
import { forgot_password } from "@/config/services/auth.service";
import { toast } from "sonner";

function ForgotPassword() {
  const [showEmailConfirmationComponent, setShowEmailConfirmationComponent] =
    useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const { isPending, mutate } = useMutation<
    GeneralReturnInt<unknown>,
    GeneralErrorInt,
    { email: string }
  >({
    mutationFn: (data) => forgot_password(data),
    onSuccess: (res, data) => {
      if (
        typeof res.message === "string" &&
        res.message.includes(
          "Password reset link generated successfully. Check your email."
        )
      ) {
        setSearchParams({ email: data.email });
        setShowEmailConfirmationComponent(true);
        toast.success(res.message);
      }
    },
  });
  return (
    <AuthLayout
      children={
        <>
          {showEmailConfirmationComponent ? (
            <ShowEmailConfirmation email={email} mutate={mutate} />
          ) : (
            <AuthFormLayout
              title="Reset Your Password"
              subTitle="Enter your email to receive a link and create a new password."
              Form={
                <ForgotPasswordFormComponent
                  email={email}
                  isPending={isPending}
                  mutate={mutate}
                />
              }
            />
          )}
        </>
      }
    />
  );
}

export default ForgotPassword;

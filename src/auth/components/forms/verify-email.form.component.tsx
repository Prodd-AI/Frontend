import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { LoadingButton } from "@/components/ui/loading-button";
import { Label } from "@/components/ui/label";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState, useEffect } from "react";
import { verify_email_schema } from "@/lib/schemas";
import { VerifyEmailFormData } from "@/auth/typings/auth";
import useAuthStore from "@/config/stores/auth.store";
import { useMutation } from "@tanstack/react-query";
import { resend_otp, verify_email } from "@/config/services/auth.service";
import { useNavigate, useSearchParams, Navigate } from "react-router-dom";

const RESEND_COOLDOWN = 60;
import { Link } from "react-router-dom";
import { TeamMember } from "@/shared/typings/team-member";
import Banner from "@/shared/components/banner.component";

function VerifyEmailFormComponent() {
  const [resendCooldown, setResendCooldown] = useState(0);
  const [banner, setBanner] = useState<{
    message: string;
    variant: "success" | "critical";
    isOpen: boolean;
  }>({
    message: "",
    variant: "success",
    isOpen: false,
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verify_email_schema),
    defaultValues: {
      code: "",
    },
  });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const { login } = useAuthStore();

  // Cooldown timer effect
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Verify email mutation
  const { mutate, isPending } = useMutation<
    GeneralReturnInt<TeamMember>,
    Error,
    { email: string; otp: string }
  >({
    mutationFn: (data) => verify_email(data),
    onSuccess: (res) => {
      setBanner({
        message: "Verification Complete. Redirecting you to your Dashboard",
        variant: "success",
        isOpen: true,
      });
      login(res.data, res.data?.access_token);
      localStorage.setItem("refresh_token_id", res.data.refresh_token);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    },
    onError(error) {
      setBanner({
        message: error.message,
        variant: "critical",
        isOpen: true,
      });
    },
  });

  // Resend OTP mutation
  const { mutate: resendMutate, isPending: isResending } = useMutation<
    GeneralReturnInt<string>,
    Error,
    { email: string }
  >({
    mutationFn: (email) => resend_otp(email),
    onSuccess: () => {
      setBanner({
        message: "Verification code resent successfully!",
        variant: "success",
        isOpen: true,
      });
      setResendCooldown(RESEND_COOLDOWN);
    },
    onError(error) {
      setBanner({
        message: error.message,
        variant: "critical",
        isOpen: true,
      });
    },
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = email && emailRegex.test(email);

  if (!isValidEmail) {
    return <Navigate to="/auth/register" replace />;
  }

  const onSubmit = (values: VerifyEmailFormData) => {
    mutate({
      otp: values.code,
      email: email ?? "",
    });
  };

  const handleResendCode = () => {
    if (resendCooldown > 0) return;
    resendMutate({ email: email ?? "" });
  };

  const isResendDisabled = isResending || resendCooldown > 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <Banner
        open={banner.isOpen}
        description={banner.message}
        onDismiss={() =>
          setBanner({ message: "", variant: "success", isOpen: false })
        }
        variant={banner.variant}
        isDismiss
      />
      <div className="flex flex-col gap-4 items-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-[#000000] mb-2">
            Enter Verification Code
          </h3>
          <p className="text-sm text-gray-600">
            We sent a 6-digit code to{" "}
            <span className="font-medium">{email}</span>
          </p>
        </div>

        <div className="flex flex-col gap-2 items-center">
          <Label htmlFor="verification-code" className="sr-only">
            Verification Code
          </Label>
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <InputOTP
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                value={field.value}
                onChange={field.onChange}
                disabled={isPending}
              >
                <InputOTPGroup className="gap-2 w-[350px] lg:w-full sm:w-full">
                  <InputOTPSlot
                    index={0}
                    className="size-[60px] text-lg font-semibold"
                  />
                  <InputOTPSlot
                    index={1}
                    className="size-[60px] text-lg font-semibold"
                  />
                  <InputOTPSlot
                    index={2}
                    className="size-[60px] text-lg font-semibold"
                  />
                  <InputOTPSlot
                    index={3}
                    className="size-[60px] text-lg font-semibold"
                  />
                  <InputOTPSlot
                    index={4}
                    className="size-[60px] text-lg font-semibold"
                  />
                  <InputOTPSlot
                    index={5}
                    className="size-[60px] text-lg font-semibold"
                  />
                </InputOTPGroup>
              </InputOTP>
            )}
          />
          {errors.code && (
            <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <LoadingButton
          type="submit"
          loading={isPending}
          loadingText="Verifying..."
          className="h-11 sm:h-[2.543rem] md:h-14 lg:w-[70%] lg:mx-auto"
        >
          Verify Email
        </LoadingButton>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
          <button
            type="button"
            onClick={handleResendCode}
            disabled={isResendDisabled}
            className="text-[#6619DE] hover:underline text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {isResending
              ? "Resending..."
              : resendCooldown > 0
              ? `Resend Code (${resendCooldown}s)`
              : "Resend Code"}
          </button>
        </div>

        <p className="text-center mt-[19px] font-[600] text-[1rem]">
          Go back to{" "}
          <Link
            to="/auth/login"
            className=" text-[#6619DE] hover:underline transition-all duration-300"
          >
            Login
          </Link>
        </p>
      </div>
    </form>
  );
}

export default VerifyEmailFormComponent;

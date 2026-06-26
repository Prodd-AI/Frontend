import { LoadingButton } from "@/components/ui/loading-button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormFieldLabel from "@/shared/components/form-field-label";
import Oauth from "@/shared/components/oauth.component";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useMemo } from "react";
import { Eye, EyeOff } from "lucide-react";
import { register_schema } from "@/lib/schemas";
import { RegisterFormData } from "@/auth/typings/auth";
import { useMutation } from "@tanstack/react-query";
import { regsiter_team_member } from "@/config/services/auth.service";
import Banner from "@/shared/components/banner.component";

const calculatePasswordStrength = (password: string) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;

  let feedback = "";
  if (password.length === 0) {
    feedback = "";
  } else if (score <= 1) {
    feedback = "Very weak";
  } else if (score === 2) {
    feedback = "Weak";
  } else if (score === 3) {
    feedback = "Good";
  } else {
    feedback = "Strong";
  }

  return { score, feedback, checks };
};

const RegisterFormComponent = () => {
  const removeAuthGuard =
    import.meta.env.VITE_REMOVE_AUTH_GUARD === "true" ||
    import.meta.env.VITE_REMOVE_AUTH_GUARD === "1";

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [banner, setBanner] = useState<{
    message: string;
    variant: "success" | "critical";
    isOpen: boolean;
    title?: string;
  }>({
    message: "",
    variant: "success",
    isOpen: false,
  });
  const { mutate, isPending } = useMutation<
    GeneralReturnInt<RegisterTeamMemberReturnInt>,
    Error,
    Omit<RegisterFormData, "accepted">
  >({
    mutationFn: (data) => regsiter_team_member(data),
    onSuccess: (response) => {
      const userEmail = response?.data?.email ?? "";

      setBanner({
        message: response.message,
        variant: "success",
        isOpen: true,
        title: "Account created successfully!",
      });
      setTimeout(() => {
        navigate(`/auth/verify-email?email=${encodeURIComponent(userEmail)}`);
      }, 2000);
      reset();
    },
    onError: (error: unknown) => {
      console.log("removeAuthGuard", removeAuthGuard);
      if (removeAuthGuard) {
        return navigate("/onboarding/select-role");
      }
      let errorMessage = "Something went wrong, please try again later.";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      setBanner({
        message: errorMessage,
        variant: "critical",
        isOpen: true,
      });
    },
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(register_schema),
  });

  const watchedPassword = watch("password", "");

  const passwordStrength = useMemo(
    () => calculatePasswordStrength(watchedPassword),
    [watchedPassword]
  );

  const onSubmit = (values: Omit<RegisterFormData, "accepted">) => {
    mutate({
      last_name: values.last_name,
      first_name: values.first_name,
      email: values.email,
      password: values.password,
    });
  };

  return (
    <form
      className="auth-immersive-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <Banner
        open={banner.isOpen}
        description={banner.message}
        variant={banner.variant}
        layout="compact"
        isDismiss
        title={banner.title}
        onDismiss={() =>
          setBanner({ message: "", variant: "success", isOpen: false })
        }
      />

      <div className="auth-immersive-field">
        <FormFieldLabel htmlFor="first_name" className="auth-immersive-label" required>
          First Name
        </FormFieldLabel>
        <Input
          id="first_name"
          type="text"
          autoComplete="first_name"
          placeholder="Enter your First name"
          aria-invalid={!!errors.first_name}
          aria-describedby={errors.first_name ? "first_name-error" : undefined}
          className="auth-immersive-input"
          {...register("first_name")}
        />
        {errors.first_name && (
          <p id="first_name-error" className="auth-immersive-error">
            {errors.first_name.message}
          </p>
        )}
      </div>
      <div className="auth-immersive-field">
        <FormFieldLabel htmlFor="last_name" className="auth-immersive-label" required>
          Last Name
        </FormFieldLabel>
        <Input
          id="last_name"
          type="text"
          autoComplete="last_name"
          placeholder="Enter your Last name"
          aria-invalid={!!errors.last_name}
          aria-describedby={errors.last_name ? "last_name-error" : undefined}
          className="auth-immersive-input"
          {...register("last_name")}
        />
        {errors.last_name && (
          <p id="last_name-error" className="auth-immersive-error">
            {errors.last_name.message}
          </p>
        )}
      </div>

      <div className="auth-immersive-field">
        <FormFieldLabel htmlFor="email" className="auth-immersive-label" required>
          Email
        </FormFieldLabel>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="e.g johndoe@gmail.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="auth-immersive-input"
          {...register("email")}
        />
        {errors.email && (
          <p id="email-error" className="auth-immersive-error">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="auth-immersive-field">
        <FormFieldLabel htmlFor="password" className="auth-immersive-label" required>
          Password
        </FormFieldLabel>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Enter password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            className="auth-immersive-input pr-10"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" className="auth-immersive-error">
            {errors.password.message}
          </p>
        )}

        {watchedPassword.length > 0 && (
          <div className="auth-password-strength">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Password strength:</span>
              <span
                className={`text-xs font-medium ${
                  passwordStrength.score <= 1
                    ? "text-red-500"
                    : passwordStrength.score === 2
                    ? "text-orange-500"
                    : passwordStrength.score === 3
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                {passwordStrength.feedback}
              </span>
            </div>

            {/* Strength Bar */}
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div
                className={`h-1 rounded-full transition-all duration-300 ${
                  passwordStrength.score <= 1
                    ? "bg-red-500 w-1/4"
                    : passwordStrength.score === 2
                    ? "bg-orange-500 w-2/4"
                    : passwordStrength.score === 3
                    ? "bg-yellow-500 w-3/4"
                    : "bg-green-500 w-full"
                }`}
              />
            </div>

            <div className="auth-password-requirements space-y-1">
              <div
                className={`text-xs flex items-center gap-2 ${
                  passwordStrength.checks.length
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                <span className="text-[10px]">
                  {passwordStrength.checks.length ? "✓" : "○"}
                </span>
                At least 8 characters
              </div>
              <div
                className={`text-xs flex items-center gap-2 ${
                  passwordStrength.checks.uppercase
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                <span className="text-[10px]">
                  {passwordStrength.checks.uppercase ? "✓" : "○"}
                </span>
                One uppercase letter
              </div>
              <div
                className={`text-xs flex items-center gap-2 ${
                  passwordStrength.checks.lowercase
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                <span className="text-[10px]">
                  {passwordStrength.checks.lowercase ? "✓" : "○"}
                </span>
                One lowercase letter
              </div>
              <div
                className={`text-xs flex items-center gap-2 ${
                  passwordStrength.checks.number
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                <span className="text-[10px]">
                  {passwordStrength.checks.number ? "✓" : "○"}
                </span>
                One number
              </div>
              <div
                className={`text-xs flex items-center gap-2 ${
                  passwordStrength.checks.special
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                <span className="text-[10px]">
                  {passwordStrength.checks.special ? "✓" : "○"}
                </span>
                One special character (!@#$%...)
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-start gap-2 text-xs font-medium sm:text-sm">
        <Controller
          control={control}
          name="accepted"
          render={({ field }) => (
            <Checkbox
              id="accepted"
              className="mt-0.5 size-4 bg-[#E0DAE8]"
              checked={field.value}
              onCheckedChange={(v) => field.onChange(Boolean(v))}
              aria-invalid={!!errors.accepted}
              aria-describedby={errors.accepted ? "accepted-error" : undefined}
            />
          )}
        />
        <div className="flex-1">
          <Label htmlFor="accepted" className="sr-only">
            Accept terms
          </Label>
          <p>
            I agree to the{" "}
            <Link
              to="/privacy-policy"
              className="text-[#6619DE] underline underline-offset-2"
            >
              privacy policy
            </Link><span className="form-required-asterisk">*</span>
          </p>
          {errors.accepted && (
            <p id="accepted-error" className="auth-immersive-error mt-1">
              {errors.accepted.message}
            </p>
          )}
        </div>
      </div>

      <LoadingButton
        type="submit"
        loading={isPending}
        loadingText="Creating Account..."
        className="auth-immersive-btn"
      >
        Create Account
      </LoadingButton>
      <Oauth
        onError={(title, description) =>
          setBanner({
            isOpen: true,
            variant: "critical",
            title,
            message: description,
          })
        }
      />
      <div className="auth-immersive-link-row">
        <p>
          Already have an account?{" "}
          <Link to="/auth/login" className="text-[#6619DE] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </form>
  );
};

export default RegisterFormComponent;

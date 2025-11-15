import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Oauth from "@/shared/components/oauth.component";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { register_schema } from "@/lib/schemas";
import { RegisterFormData } from "@/auth/typings/auth";
const RegisterFormComponent = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "",
    checks: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
    },
  });

  // Password strength calculation
  const calculatePasswordStrength = (password: string) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
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

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(register_schema),
  });

  // Watch password field for real-time strength calculation
  const watchedPassword = watch("password", "");

  // Update password strength when password changes
  useEffect(() => {
    const strength = calculatePasswordStrength(watchedPassword);
    setPasswordStrength(strength);
  }, [watchedPassword]);

  const onSubmit = (values: RegisterFormData) => {
    console.log("Register submit:", values);
  };
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="fullName"
          className="text-[#000000] font-semibold text-sm sm:text-base"
        >
          Full Name
        </Label>
        <Input
          id="fullName"
          type="text"
          autoComplete="name"
          placeholder="Enter your full name"
          aria-invalid={!!errors.fullName}
          aria-describedby={errors.fullName ? "fullName-error" : undefined}
          className="border border-[#6B728021] rounded-[10px] h-11 sm:h-12 md:h-14"
          {...register("fullName")}
        />
        {errors.fullName && (
          <p id="fullName-error" className="text-red-500 text-xs sm:text-sm">
            {errors.fullName.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label
          htmlFor="email"
          className="text-[#000000] font-semibold text-sm sm:text-base"
        >
          Email
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="e.g johndoe@gmail.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="border border-[#6B728021] rounded-[10px] h-11 sm:h-12 md:h-14"
          {...register("email")}
        />
        {errors.email && (
          <p id="email-error" className="text-red-500 text-xs sm:text-sm">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label
          htmlFor="password"
          className="text-[#000000] font-semibold text-sm sm:text-base"
        >
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Enter password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            className="border border-[#6B728021] rounded-[10px] h-11 sm:h-12 md:h-14 pr-10"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" className="text-red-500 text-xs sm:text-sm">
            {errors.password.message}
          </p>
        )}

        {/* Password Strength Indicator */}
        {watchedPassword.length > 0 && (
          <div className="space-y-2">
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

            {/* Requirements Checklist */}
            <div className="space-y-1">
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
            </div>
          </div>
        )}
      </div>

      <div className="flex items-start sm:items-center gap-3 text-sm sm:text-base font-medium">
        <Controller
          control={control}
          name="accepted"
          render={({ field }) => (
            <Checkbox
              id="accepted"
              className="size-5 sm:size-[27px] bg-[#E0DAE8] mt-1 sm:mt-0"
              checked={field.value}
              // Radix can pass true | false | "indeterminate"
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
              to="/terms"
              className="text-[#6619DE] underline underline-offset-2"
            >
              terms of service & privacy policy
            </Link>
          </p>
          {errors.accepted && (
            <p
              id="accepted-error"
              className="text-red-500 text-xs sm:text-sm mt-1"
            >
              {errors.accepted.message}
            </p>
          )}
        </div>
      </div>

      <Button type="submit" className="mt-2 h-11 sm:h-[2.543rem] md:h-14">
        Create Account
      </Button>
      <Oauth />
      <div className="text-center mt-[19px] font-[600] text-[1rem]">
        <p>
          {" "}
          Already have an account?{" "}
          <Link to="/auth/login" className=" text-[#6619DE] hover:underline">
            {" "}
            Login
          </Link>
        </p>
      </div>
    </form>
  );
};

export default RegisterFormComponent;

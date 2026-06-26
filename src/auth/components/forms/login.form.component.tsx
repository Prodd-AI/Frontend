import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormFieldLabel from "@/shared/components/form-field-label";
import { login_schema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Oauth from "@/shared/components/oauth.component";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { LoginFormData } from "@/auth/typings/auth";
import { useMutation } from "@tanstack/react-query";
import { login_team_member } from "@/config/services/auth.service";
import useAuthStore from "@/config/stores/auth.store";
import { TeamMember } from "@/shared/typings/team-member";
import Banner from "@/shared/components/banner.component";
import {
  getPostLoginPath,
  persistAuthSession,
} from "@/auth/utils/auth-success.utils";

function LoginFormComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const [banner, setBanner] = useState<{
    open: boolean;
    variant: "success" | "critical" | "warning" | "info";
    title: string;
    description: string;
  }>({ open: false, variant: "info", title: "", description: "" });
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    getValues,
  } = useForm<LoginFormData>({
    resolver: zodResolver(login_schema),
  });
  const email = getValues("email") || "";
  const { mutate, isPending } = useMutation<
    GeneralReturnInt<TeamMember>,
    GeneralErrorInt,
    LoginFormData
  >({
    mutationFn: (data) => login_team_member(data),
    onSuccess: (response) => {
      if (response?.data) {
        persistAuthSession(response.data, login);

        setBanner({
          open: true,
          variant: "success",
          title: "Welcome back!",
          description: "You have been successfully signed in.",
        });

        reset();
        return navigate(getPostLoginPath(response.data.user));
      } else {
        setBanner({
          open: true,
          variant: "critical",
          title: "Login failed",
          description: "Unable to retrieve user data. Please try again.",
        });
      }
    },
    onError: (error: GeneralErrorInt) => {
      if (error && "message" in error) {
        if (typeof error.message !== "string") {
          setBanner({
            open: true,
            variant: "critical",
            title: "Login failed",
            description: "An unexpected error occurred. Please try again.",
          });
          return;
        }
        if (error.message.includes("Email is not verified")) {
          setBanner({
            open: true,
            variant: "critical",
            title: "Login failed",
            description: error.message,
          });

          setTimeout(() => {
            navigate(`/auth/verify-email?email=${encodeURIComponent(email)}`);
          }, 1000);

          return;
        }
        if (error.message.includes("Invalid credentials")) {
          setBanner({
            open: true,
            variant: "critical",
            title: "Login failed",
            description: error.message,
          });
          return;
        }
        setBanner({
          open: true,
          variant: "critical",
          title: "Login failed",
          description:
            error.message || "An unexpected error occurred. Please try again.",
        });
      } else {
        setBanner({
          open: true,
          variant: "critical",
          title: "Login failed",
          description: "An unexpected error occurred. Please try again.",
        });
      }
    },
  });

  const onSubmit = (values: LoginFormData) => {
    if (!values) {
      return;
    }
    mutate(values);
  };

  return (
    <>
      {banner.open && (
        <Banner
          open={banner.open}
          variant={banner.variant}
          title={banner.title}
          description={banner.description}
          layout="compact"
          isDismiss
          onDismiss={() => setBanner({ ...banner, open: false })}
        />
      )}
      <form
        noValidate
        className="auth-immersive-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="auth-immersive-field">
          <FormFieldLabel htmlFor="email" className="auth-immersive-label" required>
            Email Address
          </FormFieldLabel>
          <Input
            id="email"
            type="email"
            className="auth-immersive-input"
            placeholder="e.g johndoe@gmail.com"
            {...register("email")}
            autoComplete="true"
          />
          {errors.email && (
            <div className="auth-immersive-error">{errors.email.message}</div>
          )}
        </div>
        <div className="auth-immersive-field">
          <FormFieldLabel htmlFor="password" className="auth-immersive-label" required>
            Password
          </FormFieldLabel>
          <div className="relative">
            <Input
              id="password"
              className="auth-immersive-input pr-10"
              placeholder="Enter password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              autoComplete="true"
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
            <div className="auth-immersive-error">{errors.password.message}</div>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Checkbox id="remember-me" />
            <Label htmlFor="remember-me" className="text-xs font-light">
              Remember me
            </Label>
          </div>
          <Link
            to="/auth/forgot-password"
            className="text-xs font-light text-[#251F2D] underline hover:text-[#6619DE]"
          >
            Forgot Password?
          </Link>
        </div>
        <Button
          type="submit"
          className={`auth-immersive-btn ${isPending && "opacity-25"}`}
          disabled={isPending}
        >
          {isPending ? "..." : "Login"}
        </Button>
        <Oauth
          onError={(title, description) =>
            setBanner({
              open: true,
              variant: "critical",
              title,
              description,
            })
          }
        />
        <div className="auth-immersive-link-row">
          <p>
            Dont have an account?{" "}
            <Link to="/auth/register" className="text-[#6619DE] hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}

export default LoginFormComponent;
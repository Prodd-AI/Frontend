import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
        login(response.data, response.data.access_token);

        localStorage.setItem("refresh_token_id", response.data.refresh_token);

        setBanner({
          open: true,
          variant: "success",
          title: "Welcome back!",
          description: "You have been successfully signed in.",
        });

        reset();

        if (!response.data?.user?.organization_id) {
          // add that notice banner here and redirect to the onboarding page if they select yes
          return navigate("/onboarding/hr-setup");
        }
        // return navigate("/onboarding/select-role"); This is Redundant
        return navigate("/")
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
          isDismiss
          onDismiss={() => setBanner({ ...banner, open: false })}
        />
      )}
      <form
        noValidate
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className=" flex flex-col gap-2">
          <Label
            htmlFor="email"
            className="text-[#000000] font-semibold text-sm sm:text-base"
          >
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            className="border border-[#6B728021] rounded-[10px] h-11 sm:h-12 md:h-14"
            placeholder="e.g  johndoe@gmail.com"
            {...register("email")}
            autoComplete="true"
          />
          {errors.email && (
            <div className="text-red-500 text-xs sm:text-sm">
              {errors.email.message}
            </div>
          )}
        </div>
        <div className=" flex flex-col gap-2">
          <Label
            htmlFor="password"
            className="text-[#000000] font-semibold text-sm sm:text-base"
          >
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              className="border border-[#6B728021] rounded-[10px] h-11 sm:h-12 md:h-14 pr-10"
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
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <div className="text-red-500 text-xs sm:text-sm">
              {errors.password.message}
            </div>
          )}
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Checkbox id="remember-me" />
            <Label htmlFor="remember-me" className="text-sm font-medium">
              Remember me
            </Label>
          </div>
          <Link
            to="/auth/forgot-password"
            className=" text-[#251F2D] text-[1rem] underline hover:text-[#6619DE]"
          >
            Forgot Password?
          </Link>
        </div>
        <Button
          type="submit"
          className={`mt-2 h-11 sm:h-[2.543rem] md:h-14 ${isPending && "opacity-25"
            }`}
          disabled={isPending}
        >
          {isPending ? "..." : "Login"}
        </Button>
        <Oauth />
        <div className="text-center mt-[19px] font-[600] text-[1rem]">
          <p>
            {" "}
            Dont have an account?{" "}
            <Link
              to="/auth/register"
              className=" text-[#6619DE] hover:underline"
            >
              {" "}
              Create account
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}

export default LoginFormComponent;

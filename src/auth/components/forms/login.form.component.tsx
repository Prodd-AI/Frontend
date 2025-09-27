import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login_schema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Oauth from "@/shared/components/oauth.component";
//import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { LoginFormData } from "@/auth/typings/auth";

function LoginFormComponent() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(login_schema),
  });

  const onSubmit = (values: LoginFormData) => {
    console.log(values);
    /** try {
      // Show loading toast
      const loadingToast = toast.loading("Signing you in...");

      // TODO: Integrate with API/auth service
      // Simulate a network delay
      await new Promise((r) => setTimeout(r, 1500));

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      console.log("Login submit:", values);

      // Show success toast
      toast.success("Welcome back! 🎉", {
        description: "You have been successfully signed in.",
        duration: 3000,
      });

      // TODO: Redirect to dashboard or home page
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Failed to sign in", {
        description: "Please check your credentials and try again.",
        duration: 5000,
      });
    } */
  };

  return (
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
      <Button type="submit" className="mt-2 h-11 sm:h-[2.543rem]">
        Login
      </Button>
      <Oauth />
      <div className="text-center mt-[19px] font-[600] text-[1rem]">
        <p>
          {" "}
          Dont have an account?{" "}
          <Link to="/auth/register" className=" text-[#6619DE] hover:underline">
            {" "}
            Create account
          </Link>
        </p>
      </div>
    </form>
  );
}

export default LoginFormComponent;

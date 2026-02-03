import { Button } from "@/components/ui/button";
import AuthFormLayout from "@/shared/components/auth-form-layout";
import { Link } from "react-router-dom";
import PasswordResetSuccessIcon from "@/components/ui/password-reset-success-icon";

function ShowPasswordResetSuccess() {
  return (
    <AuthFormLayout
      authCardClassName=" !max-w-[41.875rem] !min-h-[37.75rem]"
      Form={
        <div className="flex flex-col items-center">
          <div className=" size-[7.375rem] rounded-full bg-[#6619DE1A] flex justify-center items-center">
            <PasswordResetSuccessIcon />
          </div>
          <div className="flex flex-col items-center mt-[1.313rem] gap-[6px] text-center">
            <h2 className=" text-[#251F2D] text-[1.75rem] font-semibold">
              Successful Password Reset
            </h2>
            <p className="text-[#6B7280] font-[500] text-[1rem]">
              You can now your password to login to login your account
            </p>
          </div>
          <Link to="/" className="w-full">
            <Button className="w-full mt-[5.688rem] h-[3.5rem]">
              Login
            </Button>
          </Link>
        </div>
      }
    />
  );
}

export default ShowPasswordResetSuccess;

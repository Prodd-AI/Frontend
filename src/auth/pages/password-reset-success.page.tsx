import { Button } from "@/components/ui/button";
import AuthFormLayout from "@/shared/components/auth-form-layout";
import AuthLayout from "@/shared/components/auth.layout.component";
import { Link } from "react-router-dom";
import CelebrationIcon from "@/components/ui/celebration-icon";

function PassWordResetSuccess() {
  return (
    <AuthLayout>
      <AuthFormLayout centralizeText Form={<ResetComponent />} />
    </AuthLayout>
  );
}

export default PassWordResetSuccess;

const ResetComponent = () => {
  return (
    <div className="flex flex-col items-center gap-[1.313rem] h-full">
      <div className=" flex justify-center items-center size-[118px] bg-[#6619DE1A] rounded-full ">
        <CelebrationIcon />
      </div>
      <div className="text-center flex flex-col gap-[6px]">
        <h1 className="text-[1.75rem] font-semibold">
          Successful Password Reset
        </h1>
        <p className=" text-[1rem] text-[#6B7280]">
          You can now your password to login to login your account
        </p>
      </div>
      <Link to="/auth/login" className=" w-full">
        {" "}
        <Button className=" w-full mt-[4.375rem]">Login</Button>
      </Link>
    </div>
  );
};

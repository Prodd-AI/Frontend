import type { LoginFormData, RegisterFormData } from "@/auth/typings/auth";

import { ApiService } from "./root.service";
import { server_url } from "@/shared/utils/constants";
const authService = new ApiService(server_url + "auth");
const RegsiterTeamMember = (data: Omit<RegisterFormData, "accepted">) => {
  return authService.post<
    GeneralReturnInt<RegisterTeamMemberReturnInt>,
    Omit<
      {
        first_name: string;
        last_name: string;
        email: string;
        password: string;
        accepted: boolean;
      },
      "accepted"
    >
  >("register", data);
};
const LoginTeamMember = (data: LoginFormData) => {
  return authService.post("login", data);
};

const verifyEmail = (data: { email: string; otp: string }) => {
  return authService.post<
    GeneralReturnInt<unknown>,
    { email: string; otp: string }
  >("verify", data);
};

export { RegsiterTeamMember, LoginTeamMember, verifyEmail };

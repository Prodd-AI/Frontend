import type { LoginFormData, RegisterFormData } from "@/auth/typings/auth";

import { ApiService } from "./root.service";
import { server_url } from "@/shared/utils/constants";
const authService = new ApiService(server_url + "auth");
const RegsiterStakeHolder = (data: Omit<RegisterFormData, "accepted">) => {
  return authService.post("register", data);
};
const LoginStakeHolder = (data: LoginFormData) => {
  return authService.post("login", data);
};

export { RegsiterStakeHolder, LoginStakeHolder };

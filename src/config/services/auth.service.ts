import type { LoginFormData, RegisterFormData } from "@/auth/typings/auth";

import { ApiService } from "./root.service";
import { server_url } from "@/shared/utils/constants";
const auth_service = new ApiService(server_url + "auth");

//Register Team Member
const regsiter_team_member = (data: Omit<RegisterFormData, "accepted">) => {
  return auth_service.post<
    GeneralReturnInt<RegisterTeamMemberReturnInt>,
    typeof data
  >("register", data);
};

//Login Team Member
const login_team_member = (data: LoginFormData) => {
  return auth_service.post<GeneralReturnInt<TeamMember>, LoginFormData>(
    "login",
    data
  );
};

//Verify Email
const verify_email = (data: { email: string; otp: string }) => {
  return auth_service.post<GeneralReturnInt<TeamMember>, typeof data>(
    "verify",
    data
  );
};

// Resend One Time Password
const resend_otp = (data: { email: string }) => {
  return auth_service.post<GeneralReturnInt<string>, typeof data>(
    "resend-otp",
    data
  );
};

// Refresh Token Which returns validated tokens alongside user's proflie
const refresh_auth_with_team_member_profile = (data: {
  refresh_token_id: string;
}) => {
  return auth_service.post<GeneralReturnInt<TeamMember>, typeof data>(
    "refresh",
    data
  );
};

//forgot password endpoint

const forgot_password = (data: { email: string }) => {
  return auth_service.post<GeneralReturnInt<unknown>, typeof data>(
    "forgot-password",
    data
  );
};

const reset_password = (data: {
  new_password: string;
  confirm_password: string;
  token: string;
}) => {
  return auth_service.post<GeneralReturnInt<unknown>, typeof data>(
    "reset-password",
    data
  );
};

export {
  regsiter_team_member,
  login_team_member,
  verify_email,
  resend_otp,
  refresh_auth_with_team_member_profile,
  forgot_password,
  reset_password,
};

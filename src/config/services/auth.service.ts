import type { LoginFormData, RegisterFormData } from "@/auth/typings/auth";

import { ApiService } from "./root.service";
import { SERVER_URL } from "@/shared/utils/constants";
import { TeamMember } from "@/shared/typings/team-member";
const auth_service = new ApiService(SERVER_URL + "auth");

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
    data,
  );
};

//Verify Email
const verify_email = (data: { email: string; otp: string }) => {
  return auth_service.post<GeneralReturnInt<TeamMember>, typeof data>(
    "verify",
    data,
  );
};

// Resend One Time Password
const resend_otp = (data: { email: string }) => {
  return auth_service.post<GeneralReturnInt<string>, typeof data>(
    "resend-otp",
    data,
  );
};

// Refresh Token Which returns validated tokens alongside user's proflie
const refresh_auth_with_team_member_profile = (data: {
  refresh_token_id: string;
}) => {
  return auth_service.post<GeneralReturnInt<TeamMember>, typeof data>(
    "refresh",
    data,
  );
};

//forgot password endpoint

const forgot_password = (data: { email: string }) => {
  return auth_service.post<GeneralReturnInt<unknown>, typeof data>(
    "forgot-password",
    data,
  );
};
//reset password

const reset_password = (data: {
  new_password: string;
  confirm_password: string;
  token: string;
}) => {
  return auth_service.post<GeneralReturnInt<unknown>, typeof data>(
    "reset-password",
    data,
  );
};
const change_password = (data: {
  current_password: string;
  new_password: string;
  confirm_password: string;
}) => {
  return auth_service.post<GeneralReturnInt<unknown>, typeof data>(
    "change-password",
    data,
    true,
  );
};

// logout
const logout = () => {
  const refresh_token_id = localStorage.getItem("refresh_token_id") ?? "";
  return auth_service.post("logout", refresh_token_id, true);
};

const get_active_all_sessions = () => {
  return auth_service.get<
    GeneralReturnInt<
      {
        id: string;
        device_info: string;
        created_at: string;
        expires_at: string;
        is_expired: string;
        is_current: boolean;
      }[]
    >
  >("sessions", undefined, true);
};
const end_a_session = (id: string) => {
  return auth_service.delete<GeneralReturnInt<unknown>>(
    `sessions/${id}`,
    undefined,
    true,
  );
};

const close_account = () => {
  return auth_service.delete<GeneralReturnInt<unknown>>(
    "account",
    undefined,
    true,
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
  logout,
  get_active_all_sessions,
  end_a_session,
  close_account,
  change_password
};

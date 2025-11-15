declare module "@/auth/typings/auth" {
  import type { z } from "zod";
  import type {
    forgot_password_schema,
    login_schema,
    register_schema,
    reset_password_schema,
    verify_email_schema,
  } from "@/lib/schemas";

  export type ForgotPasswordFormData = z.infer<typeof forgot_password_schema>;
  export type LoginFormData = z.infer<typeof login_schema>;
  export type RegisterFormData = z.infer<typeof register_schema>;
  export type ResetPasswordFormData = z.infer<typeof reset_password_schema>;
  export type VerifyEmailFormData = z.infer<typeof verify_email_schema>;
}

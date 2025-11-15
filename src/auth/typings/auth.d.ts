import { forgot_password_schema, login_schema } from "@/lib/schemas";
import z from "zod";

type ForgotPasswordFormData = z.infer<typeof forgot_password_schema>;
type LoginFormData = z.infer<typeof login_schema>;
type RegisterFormData = z.infer<typeof register_schema>;
type ResetPasswordFormData = z.infer<typeof reset_password_schema>;
type VerifyEmailFormData = z.infer<typeof verify_email_schema>;

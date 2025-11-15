import * as z from "zod";

export const password_update_schema = z
  .object({
    current_password: z.string().min(8, "Minimum 8 characters"),
    new_password: z.string().min(8, "Minimum 8 characters"),
    confirm_new_password: z.string().min(8, "Minimum 8 characters"),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "Passwords do not match",
    path: ["confirm_new_password"],
  });

export type PasswordUpdateForm = z.infer<typeof password_update_schema>;

export const two_factor_schema = z.object({
  enabled: z.boolean().default(false),
});

export type TwoFactorForm = z.infer<typeof two_factor_schema>;

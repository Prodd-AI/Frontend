import z from "zod";

// Registration Validation schema
const register_schema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(80, "Full name is too long"),
  email: z.email("Please enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  accepted: z.boolean("You must accept the terms to continue"),
});

//Login Validation Schema
const login_schema = z.object({
  email: z.email("Please enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

//Forgot Password Schema
const forgot_password_schema = z.object({
  email: z.email("Please enter a valid email"),
});
// Reset Password Schema
const reset_password_schema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
  })
  .refine((data) => data.password === data.newPassword, {
    error: "Passwords do not match",
    path: ["newPassword"],
  });

  const verify_email_schema = z.object({
    code: z.string().length(6, "Code must be exactly 6 digits"),
  });
  
export {
  register_schema,
  login_schema,
  forgot_password_schema,
  reset_password_schema,
  verify_email_schema
};

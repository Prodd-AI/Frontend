import z from "zod";

// Registration Validation schema
const register_schema = z.object({
  first_name: z
    .string()
    .min(2, "First Name is be at least 3 characters")
    .max(80, "First Name must not exceed 80 characters"),
  last_name: z
    .string()
    .min(2, "Last Name is be at least 3 characters")
    .max(80, "Last Name must not exceed 80 characters"),
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
    new_password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirm_password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    error: "Passwords do not match",
    path: ["new_password"],
  });

const verify_email_schema = z.object({
  code: z.string().length(6, "Code must be exactly 6 digits"),
});

// Company Info Schema
const company_info_schema = z.object({
  name: z
    .string()
    .min(1, "Company name is required")
    .max(100, "Company name must not exceed 100 characters"),
  size: z
    .number("Company size must be a number")
    .min(1, "Company size is required and must be at least 1")
    .int("Company size must be a whole number"),
  industry: z
    .string()
    .min(1, "Industry is required")
    .max(100, "Industry must not exceed 100 characters"),
});

// Team Schema
const team_schema = z.object({
  name: z
    .string()
    .min(1, "Team name is required")
    .max(100, "Team name must not exceed 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must not exceed 500 characters"),
  size: z.string().min(1, "Team size is required"),
});

// Teams Setup Schema (array of teams)
const teams_setup_schema = z.object({
  teams: z.array(team_schema).min(1, "At least one team is required"),
});

// Invite Member Schema
const invite_member_schema = z.object({
  first_name: z
    .string()
    .min(1, "First name is required")
    .max(80, "First name must not exceed 80 characters"),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .max(80, "Last name must not exceed 80 characters"),
  email: z.email("Please enter a valid email"),
  user_role: z.enum(["team_lead", "team_member"], {
    message: "Please select a valid role",
  }),
  team_id: z.string().min(1, "Team is required"),
});

// Invite Members Setup Schema (array of members)
const invite_members_setup_schema = z.object({
  members: z.array(invite_member_schema).min(1, "At least one member is required"),
});

export {
  register_schema,
  login_schema,
  forgot_password_schema,
  reset_password_schema,
  verify_email_schema,
  company_info_schema,
  team_schema,
  teams_setup_schema,
  invite_member_schema,
  invite_members_setup_schema,
};

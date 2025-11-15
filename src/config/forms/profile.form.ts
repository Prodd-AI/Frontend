import * as z from "zod";

export const profile_form_schema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  job_title: z.string().optional().default(""),
  bio: z
    .string()
    .max(500, "Bio should be under 500 characters")
    .optional()
    .default(""),
  avatar_url: z.string().optional().default(""),
});

export type ProfileForm = z.infer<typeof profile_form_schema>;

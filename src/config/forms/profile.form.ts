import * as z from "zod";

export const profile_form_schema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  job_title: z.string(),
  bio_description: z.string().max(500, "Bio should be under 500 characters"),
  avatar_url: z.string(),
});

export type ProfileForm = z.infer<typeof profile_form_schema>;

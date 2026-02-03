import z from "zod";

export const quick_setup_schema = z.object({
  first_name: z
    .string()
    .min(1, "First name is required")
    .max(80, "First name must not exceed 80 characters"),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .max(80, "Last name must not exceed 80 characters"),
  avatar_url: z.string().optional(),
});

export type QuickSetupForm = z.infer<typeof quick_setup_schema>;

export const QUICK_SETUP_FIELDS = ["first_name", "last_name", "avatar_url"] as const;

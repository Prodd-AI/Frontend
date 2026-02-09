import * as z from "zod";

export const visibility_schema = z.object({
  profile_photo: z.enum(["everyone", "team", "only me"]),
  contact_info: z.enum(["everyone", "team", "only me"]),
  working_hours: z.enum(["everyone", "team", "only me"]),
  activity_status: z.enum(["everyone", "team", "only me"]),
});

export type VisibilityForm = z.infer<typeof visibility_schema>;

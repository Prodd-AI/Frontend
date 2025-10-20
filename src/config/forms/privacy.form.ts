import * as z from "zod";

export const visibility_schema = z.object({
  profile_photo: z.enum(["Everyone", "Team", "Only me"]).default("Everyone"),
  contact_info: z.enum(["Everyone", "Team", "Only me"]).default("Everyone"),
  working_hours: z.enum(["Everyone", "Team", "Only me"]).default("Everyone"),
  activity_status: z.enum(["Everyone", "Team", "Only me"]).default("Everyone"),
});

export type VisibilityForm = z.infer<typeof visibility_schema>;

export const export_data_schema = z.object({
  confirm: z.boolean().default(true),
});
export type ExportDataForm = z.infer<typeof export_data_schema>;

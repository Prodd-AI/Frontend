import * as z from "zod";

export const notifications_schema = z.object({
  email: z.boolean().default(true),
  push: z.boolean().default(false),
  in_app: z.boolean().default(false),
  task_reminders: z.boolean().default(false),
  team_updates: z.boolean().default(false),
});

export type NotificationsForm = z.infer<typeof notifications_schema>;

export const working_hours_schema = z.object({
  start_time: z.string().default("09:00"),
  end_time: z.string().default("17:00"),
  time_zone: z.string().default("West African Time"),
  availability: z.enum(["Available", "Busy", "Away"]).default("Available"),
});

export type WorkingHoursForm = z.infer<typeof working_hours_schema>;

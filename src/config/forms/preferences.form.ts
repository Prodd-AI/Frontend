import * as z from "zod";

export const notifications_schema = z.object({
  email_notifications: z.boolean(),
  push_notifications: z.boolean(),
  in_app_notifications: z.boolean(),
  task_reminders: z.boolean(),
  team_updates: z.boolean(),
});

export type NotificationsForm = z.infer<typeof notifications_schema>;

export const working_hours_schema = z.object({
  start_time: z.string(),
  end_time: z.string(),
  timezone: z.string(),
  availability_status: z.enum(["available", "busy", "away"]),
});

export type WorkingHoursForm = z.infer<typeof working_hours_schema>;

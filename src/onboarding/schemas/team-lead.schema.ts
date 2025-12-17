import * as z from "zod";

export const team_lead_onboarding_schema = z.object({

  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  avatar_url: z.string().optional(),
  timezone: z.string().min(1, "Timezone is required"),
  start_work_hour: z.string().min(1, "Start work hour is required"),
  end_work_hour: z.string().min(1, "End work hour is required"),
  
});

export const SETUP_PROFILE_FIELDS = [
  "first_name",
  "last_name",
  "avatar_url",
  "timezone",
  "start_work_hour",
  "end_work_hour",
] as const;

export type TeamLeadOnboardingForm = z.infer<typeof team_lead_onboarding_schema>;

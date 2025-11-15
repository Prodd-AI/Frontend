import type { Profile } from "@/settings/typings/profile.typings";
import type { ProfileForm } from "@/config/forms/profile.form";

export const QUERY_KEY_PROFILE_OVERVIEW = [
  "settings",
  "profile_overview",
] as const;

export const simulate_fetch_profile = (): Promise<Profile> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: "demo-profile-1",
        first_name: "John",
        last_name: "Smith",
        email: "john.smith@company.com",
        job_title: "Senior Software Engineer",
        bio: "",
      });
    }, 400);
  });
};

export const simulate_update_profile = (
  updated: ProfileForm & { id: string }
): Promise<Profile> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...updated });
    }, 500);
  });
};

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  profile_form_schema,
  type ProfileForm,
} from "@/config/forms/profile.form";
import type { Profile } from "@/settings/typings/profile.typings";
import {
  QUERY_KEY_PROFILE_OVERVIEW,
  simulate_fetch_profile,
  simulate_update_profile,
} from "@/settings/utils/profile.functions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CiUser } from "react-icons/ci";
import { PiCameraLight } from "react-icons/pi";

const ProfileOverviewComponent = () => {
  const query_client = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: QUERY_KEY_PROFILE_OVERVIEW,
    queryFn: simulate_fetch_profile,
    staleTime: 1000 * 60,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: ProfileForm) =>
      simulate_update_profile({ id: profile?.id ?? "temp", ...payload }),
    onMutate: async (payload) => {
      await query_client.cancelQueries({
        queryKey: QUERY_KEY_PROFILE_OVERVIEW,
      });
      const previous = query_client.getQueryData<Profile>(
        QUERY_KEY_PROFILE_OVERVIEW
      );
      if (previous) {
        const optimistic: Profile = { ...previous, ...payload } as Profile;
        query_client.setQueryData(QUERY_KEY_PROFILE_OVERVIEW, optimistic);
      }
      return { previous };
    },
    onError: (_err, _payload, context) => {
      if (context?.previous)
        query_client.setQueryData(QUERY_KEY_PROFILE_OVERVIEW, context.previous);
    },
    onSettled: () => {
      query_client.invalidateQueries({ queryKey: QUERY_KEY_PROFILE_OVERVIEW });
    },
  });

  const [form_state, set_form_state] = useState<ProfileForm>({
    first_name: "",
    last_name: "",
    email: "",
    job_title: "",
    bio: "",
    avatar_url: "",
  });

  // Initialize once data loads
  if (!isLoading && profile && form_state.email === "") {
    set_form_state({
      first_name: profile.first_name,
      last_name: profile.last_name,
      email: profile.email,
      job_title: profile.job_title ?? "",
      bio: profile.bio ?? "",
      avatar_url: profile.avatar_url ?? "",
    });
  }

  const handle_change = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    set_form_state((prev) => ({ ...prev, [name]: value }));
  };

  const handle_submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = profile_form_schema.safeParse(form_state);
    if (!parsed.success) return;
    mutate(parsed.data);
    console.log(parsed.data);
  };

  const handle_avatar_change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      set_form_state((prev) => ({
        ...prev,
        avatar_url: String(reader.result ?? ""),
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-xl p-6 border border-[#E5E7EB]">
      <div className="mb-6">
        <p className="text-lg font-semibold">Profile Information</p>
        <p className="text-xs text-gray-500">
          Update your personal information and profile details
        </p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="size-20 rounded-full bg-[#F3F4F6] flex items-center justify-center overflow-hidden">
            {form_state.avatar_url ? (
              <img
                src={form_state.avatar_url}
                className="size-20 object-cover"
                alt="Avatar"
              />
            ) : (
              <CiUser size={28} color="var(--primary-color)" />
            )}
          </div>
          <label className="absolute -bottom-1 -right-1 inline-flex items-center justify-center size-7 rounded-full bg-[var(--primary-color)] text-white cursor-pointer shadow">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handle_avatar_change}
            />
            <PiCameraLight />
          </label>
        </div>
      </div>

      <form onSubmit={handle_submit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <Label className="mb-2 text-[13px] font-semibold text-[#111827]">
              First Name
            </Label>
            <Input
              className="h-12 rounded-lg border-[#E5E7EB] placeholder:text-gray-400 focus-visible:border-[var(--primary-color)] focus-visible:ring-0"
              name="first_name"
              value={form_state.first_name}
              onChange={handle_change}
              placeholder="John"
            />
          </div>
          <div className="flex flex-col">
            <Label className="mb-2 text-[13px] font-semibold text-[#111827]">
              Last Name
            </Label>
            <Input
              className="h-12 rounded-lg border-[#E5E7EB] placeholder:text-gray-400 focus-visible:border-[var(--primary-color)] focus-visible:ring-0"
              name="last_name"
              value={form_state.last_name}
              onChange={handle_change}
              placeholder="Smith"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <Label className="mb-2 text-[13px] font-semibold text-[#111827]">
            Email
          </Label>
          <Input
            className="h-12 rounded-lg border-[#E5E7EB] placeholder:text-gray-400 focus-visible:border-[var(--primary-color)] focus-visible:ring-0"
            name="email"
            type="email"
            value={form_state.email}
            onChange={handle_change}
            placeholder="john.smith@company.com"
          />
        </div>

        <div className="flex flex-col">
          <Label className="mb-2 text-[13px] font-semibold text-[#111827]">
            Job Title
          </Label>
          <Input
            className="h-12 rounded-lg border-[#E5E7EB] placeholder:text-gray-400 focus-visible:border-[var(--primary-color)] focus-visible:ring-0"
            name="job_title"
            value={form_state.job_title}
            onChange={handle_change}
            placeholder="Senior Software Engineer"
          />
        </div>

        <div className="flex flex-col">
          <Label className="mb-2 text-[13px] font-semibold text-[#111827]">
            Bio
          </Label>
          <Textarea
            className="rounded-lg border-[#E5E7EB] h-40 placeholder:text-gray-400 focus-visible:border-[var(--primary-color)] focus-visible:ring-0"
            name="bio"
            value={form_state.bio}
            onChange={handle_change}
            placeholder="Tell us about yourself..."
            rows={10}
          />
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-12 rounded-md bg-gradient-to-r from-[#6D28D9] to-[#2563EB] py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default ProfileOverviewComponent;

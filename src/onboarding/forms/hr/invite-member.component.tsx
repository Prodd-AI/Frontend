import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { UseFormReturn, useFieldArray, Controller } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { getTeams } from "@/config/services/teams.service";

export interface InviteMemberFormData {
  first_name: string;
  last_name: string;
  email: string;
  user_role: "team_lead" | "team_member";
  team_id: string;
}

export interface InviteMembersSetupFormData {
  members: InviteMemberFormData[];
}

interface InviteMemberProps {
  form: UseFormReturn<InviteMembersSetupFormData>;
  banner?: {
    open: boolean;
    variant: "success" | "critical" | "warning" | "info";
    title: string;
    description: string;
  };
  onDismissBanner?: () => void;
}

function InviteMember({ form }: InviteMemberProps) {
  const {
    control,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  const { data: teamsData, isLoading: isLoadingTeams } = useQuery({
    queryKey: ["teams"],
    queryFn: () => getTeams({ limit: "100" }),
  });

  const teams = teamsData?.data || [];

  const addMember = () => {
    append({
      first_name: "",
      last_name: "",
      email: "",
      user_role: "team_member",
      team_id: "",
    });
  };

  return (
    <div className="flex flex-col gap-8 mt-4">  
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="flex flex-col gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* First Name */}
            <div className="flex-1 flex flex-col gap-2">
              <Label className="text-[#000000] font-semibold text-sm sm:text-base">
                First Name
              </Label>
              <Input
                className="border border-[#6B728021] rounded-[10px] h-11 sm:h-12 md:h-14"
                placeholder="John"
                {...form.register(`members.${index}.first_name`)}
              />
              {errors.members?.[index]?.first_name && (
                <div className="text-red-500 text-xs sm:text-sm">
                  {errors.members[index]?.first_name?.message}
                </div>
              )}
            </div>

            {/* Last Name */}
            <div className="flex-1 flex flex-col gap-2">
              <Label className="text-[#000000] font-semibold text-sm sm:text-base">
                Last Name
              </Label>
              <Input
                className="border border-[#6B728021] rounded-[10px] h-11 sm:h-12 md:h-14"
                placeholder="Doe"
                {...form.register(`members.${index}.last_name`)}
              />
              {errors.members?.[index]?.last_name && (
                <div className="text-red-500 text-xs sm:text-sm">
                  {errors.members[index]?.last_name?.message}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Email */}
            <div className="flex-1 flex flex-col gap-2">
              <Label className="text-[#000000] font-semibold text-sm sm:text-base">
                Email
              </Label>
              <Input
                className="border border-[#6B728021] rounded-[10px] h-11 sm:h-12 md:h-14"
                placeholder="john@youremail.com"
                {...form.register(`members.${index}.email`)}
              />
              {errors.members?.[index]?.email && (
                <div className="text-red-500 text-xs sm:text-sm">
                  {errors.members[index]?.email?.message}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Role */}
            <div className="flex-1 flex flex-col gap-2">
              <Label className="text-[#000000] font-semibold text-sm sm:text-base">
                Role
              </Label>
              <Controller
                name={`members.${index}.user_role`}
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="!w-full !border !border-[#6B728021] !rounded-[10px] !h-11 sm:!h-12 md:!h-14">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="team_lead">Team Lead</SelectItem>
                      <SelectItem value="team_member">Team Member</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.members?.[index]?.user_role && (
                <div className="text-red-500 text-xs sm:text-sm">
                  {errors.members[index]?.user_role?.message}
                </div>
              )}
            </div>

            {/* Team */}
            <div className="flex-1 flex flex-col gap-2">
              <Label className="text-[#000000] font-semibold text-sm sm:text-base">
                Team
              </Label>
              <Controller
                name={`members.${index}.team_id`}
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="!w-full !border !border-[#6B728021] !rounded-[10px] !h-11 sm:!h-12 md:!h-14">
                      <SelectValue
                        placeholder={
                          isLoadingTeams ? "Loading teams..." : "Select Team"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.members?.[index]?.team_id && (
                <div className="text-red-500 text-xs sm:text-sm">
                  {errors.members[index]?.team_id?.message}
                </div>
              )}
            </div>

            {/* Remove Button */}
            {fields.length > 1 && (
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="px-3 text-red-500 hover:text-red-700 transition-colors h-11 sm:h-12 md:h-14"
                  aria-label="Remove member"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Add Button */}
      <button
        type="button"
        onClick={addMember}
        className="w-full py-4 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center gap-2 text-gray-500 font-medium hover:border-gray-400 hover:text-gray-700 transition-colors"
      >
        <Plus size={20} />
        Add Another Member
      </button>
    </div>
  );
}

export default InviteMember;

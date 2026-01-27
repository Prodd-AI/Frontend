import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddTeamMemberFormData } from "@/onboarding/wizards/team-lead/team-overview.team-lead.wizard";
import { Control, Controller, UseFormRegister } from "react-hook-form";

interface AddTeamMemberPropsInt {
  register: UseFormRegister<AddTeamMemberFormData>;
  control: Control<AddTeamMemberFormData>;
}
const AddTeamMember = ({ register, control }: AddTeamMemberPropsInt) => {
  return (
    <div className="w-full">
      <div className="space-y-4">
        {/* First Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="first_name"
            className="text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <Input
            {...register("first_name")}
            type="text"
            id="first_name"
            placeholder="eg. John"
            className="h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
        {/* Last Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="last_name"
            className="text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <Input
            {...register("last_name")}
            type="text"
            id="last_name"
            placeholder="eg. Doe"
            className="h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <Input
            {...register("email")}
            id="email"
            type="email"
            placeholder="john@youremail.com"
            className="h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="user_role"
            className="text-sm font-medium text-gray-700"
          >
            Role
          </label>
          <Controller
            name="user_role"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="h-11 w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500 bg-white">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                  <SelectItem value="team_lead">Team Lead</SelectItem>
                  <SelectItem value="team_member">Team Member</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default AddTeamMember;

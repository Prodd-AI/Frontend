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
import type { ChangeEvent } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";

const TEAM_TYPE_OPTIONS = ["Engineering", "Design", "Marketing", "Others"];

export interface TeamFormData {
  name: string;
  team_type: string;
  custom_team_type?: string;
  size: string;
  description: string;
}

export interface TeamsSetupFormData {
  teams: TeamFormData[];
}

interface TeamSetupProps {
  form: UseFormReturn<TeamsSetupFormData>;
  banner?: {
    open: boolean;
    variant: "success" | "critical" | "warning" | "info";
    title: string;
    description: string;
  };
  onDismissBanner?: () => void;
}

function TeamSetup({ form }: TeamSetupProps) {
  const {
    control,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "teams",
  });

  const addTeam = () => {
    append({
      name: "",
      team_type: "",
      custom_team_type: "",
      size: "",
      description: "",
    });
  };

  return (
    <div className="flex flex-col gap-6 mt-4">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="flex flex-col md:flex-row gap-4 md:items-end"
        >
          {/* Team Type */}
          <div className="flex-1 flex flex-col gap-2">
            <Label className="text-[#000000] font-semibold text-sm sm:text-base">
              Team Type
            </Label>
            <Select
              value={form.watch(`teams.${index}.team_type`)}
              onValueChange={(value) => {
                form.setValue(`teams.${index}.team_type`, value, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
                form.setValue(`teams.${index}.name`, value, {
                  shouldDirty: true,
                  shouldValidate: true,
                });

                if (value !== "Others") {
                  form.setValue(`teams.${index}.custom_team_type`, "", {
                    shouldDirty: true,
                  });
                }
              }}
            >
              <SelectTrigger className="border border-[#6B728021] rounded-[10px] h-11 sm:h-12 md:h-14 w-full">
                <SelectValue placeholder="Select team type" />
              </SelectTrigger>
              <SelectContent>
                {TEAM_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.watch(`teams.${index}.team_type`) === "Others" && (
              <Input
                className="border border-[#6B728021] rounded-[10px] h-11 sm:h-12 md:h-14"
                placeholder="Enter custom team type (optional)"
                {...form.register(`teams.${index}.custom_team_type`, {
                  onChange: (event: ChangeEvent<HTMLInputElement>) => {
                    const custom_type = event.target.value.trim();
                    form.setValue(
                      `teams.${index}.name`,
                      custom_type || "Others",
                      {
                        shouldDirty: true,
                        shouldValidate: true,
                      },
                    );
                  },
                })}
              />
            )}
            {errors.teams?.[index]?.name && (
              <div className="text-red-500 text-xs sm:text-sm">
                {errors.teams[index]?.name?.message}
              </div>
            )}
            {errors.teams?.[index]?.team_type && (
              <div className="text-red-500 text-xs sm:text-sm">
                {errors.teams[index]?.team_type?.message}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="flex-1 flex flex-col gap-2">
            <Label className="text-[#000000] font-semibold text-sm sm:text-base">
              Description
            </Label>
            <Input
              className="border border-[#6B728021] rounded-[10px] h-11 sm:h-12 md:h-14"
              placeholder="Enter team description"
              {...form.register(`teams.${index}.description`)}
            />
            {errors.teams?.[index]?.description && (
              <div className="text-red-500 text-xs sm:text-sm">
                {errors.teams[index]?.description?.message}
              </div>
            )}
          </div>

          {/* Team Size */}
          <div className="w-full md:w-1/3 flex flex-col gap-2">
            <Label className="text-[#000000] font-semibold text-sm sm:text-base">
              Team Size
            </Label>
            <div className="flex gap-2">
              <Input
                className="border border-[#6B728021] rounded-[10px] h-11 sm:h-12 md:h-14"
                placeholder="5"
                type="number"
                {...form.register(`teams.${index}.size`)}
              />
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="px-3 text-red-500 hover:text-red-700 transition-colors"
                  aria-label="Remove team"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            {errors.teams?.[index]?.size && (
              <div className="text-red-500 text-xs sm:text-sm">
                {errors.teams[index]?.size?.message}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Add Button */}
      <button
        type="button"
        onClick={addTeam}
        className="w-full py-4 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center gap-2 text-gray-500 font-medium hover:border-gray-400 hover:text-gray-700 transition-colors"
      >
        <Plus size={20} />
        Add Another Team
      </button>
    </div>
  );
}

export default TeamSetup;

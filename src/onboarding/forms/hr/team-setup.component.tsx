import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { UseFormReturn, useFieldArray } from "react-hook-form";

export interface TeamFormData {
  name: string;
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
    append({ name: "", size: "", description: "" });
  };

  return (
    <div className="flex flex-col gap-6 mt-4">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="flex flex-col md:flex-row gap-4 md:items-end"
        >
          {/* Team Name */}
          <div className="flex-1 flex flex-col gap-2">
            <Label className="text-[#000000] font-semibold text-sm sm:text-base">
              Team Name
            </Label>
            <Input
              className="border border-[#6B728021] rounded-[10px] h-11 sm:h-12 md:h-14"
              placeholder="e.g design, marketing, engineering"
              {...form.register(`teams.${index}.name`)}
            />
            {errors.teams?.[index]?.name && (
              <div className="text-red-500 text-xs sm:text-sm">
                {errors.teams[index]?.name?.message}
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

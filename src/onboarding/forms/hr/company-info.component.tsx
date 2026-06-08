import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

const ORGANIZATION_TYPE_OPTIONS = [
  "Tech",
  "Fintech",
  "Construction",
  "Healthcare",
  "Others",
];

export interface CompanyInfoFormData {
  name: string;
  size: number;
  industry: string;
}

interface CompanyInfoProps {
  form: UseFormReturn<CompanyInfoFormData>;
  banner?: {
    open: boolean;
    variant: "success" | "critical" | "warning" | "info";
    title: string;
    description: string;
  };
  onDismissBanner?: () => void;
}

function CompanyInfo({ form }: CompanyInfoProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="flex flex-col gap-6 mt-4">

      <div className="flex flex-col gap-6">
        {/* Company Name */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="companyName"
            className="text-[#000000] font-semibold text-sm sm:text-base"
          >
            Company Name
          </Label>
          <Input
            id="companyName"
            className="border border-[#6B728021] rounded-[10px] h-11 sm:h-12 md:h-14"
            placeholder="Enter your company name"
            {...register("name")}
          />
          {errors.name && (
            <div className="text-red-500 text-xs sm:text-sm">
              {errors.name.message}
            </div>
          )}
        </div>

        {/* Company Size */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="companySize"
            className="text-[#000000] font-semibold text-sm sm:text-base"
          >
            Company Size
          </Label>
          <Input
            id="companySize"
            type="number"
            className="border border-[#6B728021] rounded-[10px] h-11 sm:h-12 md:h-14"
            placeholder="Enter number of employees"
            {...register("size", { valueAsNumber: true })}
          />
          {errors.size && (
            <div className="text-red-500 text-xs sm:text-sm">
              {errors.size.message}
            </div>
          )}
        </div>

        {/* Organization Type */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="industry"
            className="text-[#000000] font-semibold text-sm sm:text-base"
          >
            Organization Type
          </Label>
          <Select
            value={form.watch("industry")}
            onValueChange={(value) =>
              form.setValue("industry", value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger
              id="industry"
              className="border border-[#6B728021] rounded-[10px] h-11 sm:h-12 md:h-14 w-full"
            >
              <SelectValue placeholder="Select organization type" />
            </SelectTrigger>
            <SelectContent>
              {ORGANIZATION_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.industry && (
            <div className="text-red-500 text-xs sm:text-sm">
              {errors.industry.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompanyInfo;

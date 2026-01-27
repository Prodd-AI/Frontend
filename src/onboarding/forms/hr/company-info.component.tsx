import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn, Controller } from "react-hook-form";

export interface CompanyInfoFormData {
  name: string;
  size: string;
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
    control,
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
          <Controller
            name="size"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="companySize"
                  className="!w-full !border !border-[#6B728021] !rounded-[10px] !h-11 sm:!h-12 md:!h-14"
                >
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 Employees</SelectItem>
                  <SelectItem value="11-50">11-50 Employees</SelectItem>
                  <SelectItem value="51-200">51-200 Employees</SelectItem>
                  <SelectItem value="201-500">201-500 Employees</SelectItem>
                  <SelectItem value="500+">500+ Employees</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.size && (
            <div className="text-red-500 text-xs sm:text-sm">
              {errors.size.message}
            </div>
          )}
        </div>

        {/* Industry */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="industry"
            className="text-[#000000] font-semibold text-sm sm:text-base"
          >
            Industry
          </Label>
          <Input
            id="industry"
            className="border border-[#6B728021] rounded-[10px] h-11 sm:h-12 md:h-14"
            placeholder="e.g Technology, healthcare, Finance"
            {...register("industry")}
          />
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

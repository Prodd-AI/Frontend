import { Input } from "@/components/ui/input";
import FormFieldLabel from "@/shared/components/form-field-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimePicker } from "@/components/ui/time-picker";
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
  opening_time: string;
  closing_time: string;
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
    watch,
    setValue,
    formState: { errors },
  } = form;

  const companySize = watch("size");

  const handleCompanySizeChange = (rawValue: string) => {
    if (rawValue === "") {
      setValue("size", 0, { shouldDirty: true, shouldValidate: true });
      return;
    }

    const parsed = Number(rawValue);
    if (Number.isNaN(parsed)) return;

    setValue("size", Math.max(1, Math.floor(parsed)), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="flex flex-col gap-6 mt-4">

      <div className="flex flex-col gap-6">
        {/* Company Name */}
        <div className="flex flex-col gap-2">
          <FormFieldLabel
            htmlFor="companyName"
            className="text-[#000000] font-semibold text-sm sm:text-base"
            required
          >
            Company Name
          </FormFieldLabel>
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
          <FormFieldLabel
            htmlFor="companySize"
            className="text-[#000000] font-semibold text-sm sm:text-base"
            required
          >
            Company Size
          </FormFieldLabel>
          <Input
            id="companySize"
            type="number"
            min={1}
            step={1}
            inputMode="numeric"
            className="border border-[#6B728021] rounded-[10px] h-11 sm:h-12 md:h-14"
            placeholder="Enter number of employees"
            value={companySize > 0 ? companySize : ""}
            onChange={(e) => handleCompanySizeChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "e" || e.key === "E") {
                e.preventDefault();
              }
            }}
            onBlur={() => {
              if (!companySize || companySize < 1) {
                setValue("size", 1, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }
            }}
          />
          {errors.size && (
            <div className="text-red-500 text-xs sm:text-sm">
              {errors.size.message}
            </div>
          )}
        </div>

        {/* Organization Type */}
        <div className="flex flex-col gap-2">
          <FormFieldLabel
            htmlFor="industry"
            className="text-[#000000] font-semibold text-sm sm:text-base"
            required
          >
            Organization Type
          </FormFieldLabel>
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

        {/* Work Hours */}
        <div className="flex flex-col gap-2">
          <FormFieldLabel
            className="text-[#000000] font-semibold text-sm sm:text-base"
            required
          >
            Work Hours
          </FormFieldLabel>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Set your organization&apos;s standard operating hours
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <TimePicker
                label="Opening Time"
                required
                value={watch("opening_time")}
                onChange={(time) =>
                  setValue("opening_time", time, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                placeholder="09:00 AM"
              />
              {errors.opening_time && (
                <div className="text-red-500 text-xs sm:text-sm">
                  {errors.opening_time.message}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <TimePicker
                label="Closing Time"
                required
                value={watch("closing_time")}
                onChange={(time) =>
                  setValue("closing_time", time, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                placeholder="05:00 PM"
              />
              {errors.closing_time && (
                <div className="text-red-500 text-xs sm:text-sm">
                  {errors.closing_time.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyInfo;

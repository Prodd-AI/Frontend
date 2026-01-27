import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera } from "lucide-react";
import { useState } from "react";
import AviPlaceholder from "@/shared/components/avi-placeholder.component";

function CompanyInfo() {
  const [logo, setLogo] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6 mt-4">
      {/* Avatar Upload */}
      <div className="flex justify-center">
        <label className="relative cursor-pointer group">
          <div className="size-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
            {logo ? (
              <img
                src={logo}
                alt="Company Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <AviPlaceholder />
            )}
          </div>
          <div className="absolute bottom-0 right-0 bg-[#6619DE] p-1.5 rounded-full text-white border-2 border-white">
            <Camera size={16} />
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                const url = URL.createObjectURL(e.target.files[0]);
                setLogo(url);
              }
            }}
          />
        </label>
      </div>

      {/* Company Name */}
      <div className="space-y-2">
        <Label htmlFor="companyName" className="font-semibold text-[#111827]">
          Company Name
        </Label>
        <Input id="companyName" placeholder="Enter your company name" />
      </div>

      {/* Company Size */}
      <div className="space-y-2">
        <Label htmlFor="companySize" className="font-semibold text-[#111827]">
          Company Size
        </Label>
        <Select>
          <SelectTrigger id="companySize" className="w-full">
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
      </div>

      {/* Industry */}
      <div className="space-y-2">
        <Label htmlFor="industry" className="font-semibold text-[#111827]">
          Industry
        </Label>
        <Input
          id="industry"
          placeholder="e.g Technology, healthcare, Finance"
        />
      </div>
    </div>
  );
}

export default CompanyInfo;

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useState } from "react";

interface Member {
  fullName: string;
  email: string;
  role: string;
  team: string;
}

function InviteMember() {
  const [members, setMembers] = useState<Member[]>([
    { fullName: "", email: "", role: "", team: "" },
  ]);

  const addMember = () => {
    setMembers([...members, { fullName: "", email: "", role: "", team: "" }]);
  };

  const updateMember = (index: number, field: keyof Member, value: string) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

  return (
    <div className="flex flex-col gap-8 mt-4">
      {members.map((member, index) => (
        <div
          key={index}
          className="flex flex-col gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Full Name */}
            <div className="flex-1 flex flex-col gap-2">
              <Label className="text-[#000000] font-semibold text-sm sm:text-base">
                Full Name
              </Label>
              <Input
                className="border border-[#6B728021] rounded-[10px] h-11 sm:h-12 md:h-14"
                placeholder="John Doe"
                value={member.fullName}
                onChange={(e) =>
                  updateMember(index, "fullName", e.target.value)
                }
              />
            </div>

            {/* Email */}
            <div className="flex-1 flex flex-col gap-2">
              <Label className="text-[#000000] font-semibold text-sm sm:text-base">
                Email
              </Label>
              <Input
                className="border border-[#6B728021] rounded-[10px] h-11 sm:h-12 md:h-14"
                placeholder="john@youremail.com"
                value={member.email}
                onChange={(e) => updateMember(index, "email", e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Role */}
            <div className="flex-1 flex flex-col gap-2">
              <Label className="text-[#000000] font-semibold text-sm sm:text-base">
                Role
              </Label>
              <Select
                value={member.role}
                onValueChange={(value) => updateMember(index, "role", value)}
              >
                <SelectTrigger className="!w-full !border !border-[#6B728021] !rounded-[10px] !h-11 sm:!h-12 md:!h-14">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Team */}
            <div className="flex-1 flex flex-col gap-2">
              <Label className="text-[#000000] font-semibold text-sm sm:text-base">
                Team
              </Label>
              <Select
                value={member.team}
                onValueChange={(value) => updateMember(index, "team", value)}
              >
                <SelectTrigger className="!w-full !border !border-[#6B728021] !rounded-[10px] !h-11 sm:!h-12 md:!h-14">
                  <SelectValue placeholder="Select Team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ))}

      {/* Add Button */}
      <button
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

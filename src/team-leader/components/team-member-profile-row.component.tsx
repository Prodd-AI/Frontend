import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

interface ProfileRowProps {
  name?: string;
  role?: string;
  email?: string;
  status?: "Healthy" | "At risk" | "Inactive";
}

const TeamMemberProfileRow = ({
  name = "Alex Johnson",
  role = "Senior Developer",
  email = "alex.johnson@company.com",
  status = "Healthy",
}: ProfileRowProps) => {
  const statusStyles = {
    Healthy: "bg-green-100 text-green-600 border-green-200",
    "At risk": "bg-red-100 text-red-600 border-red-200",
    Inactive: "bg-gray-100 text-gray-600 border-gray-200",
  };

  return (
    <div className="flex items-center gap-4 bg-inherit rounded-2xl mt-[2.875rem]">
      <Avatar className="size-[92px] bg-primary/10">
        <AvatarFallback className="bg-primary/10">
          <User className=" text-primary/60" size={48} />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <div className="flex items-center gap-10">
          <h3 className="font-semibold text-foreground text-[1.75rem]">
            {name}
          </h3>
          <Badge
            variant="outline"
            className={`text-xs font-medium px-2 py-0.5 ${statusStyles[status]}`}
          >
            {status}
          </Badge>
        </div>
        <span className="text-sm text-[#4B4357] text-[1.375rem]">
          {role} • {email}
        </span>
      </div>
    </div>
  );
};

export default TeamMemberProfileRow;

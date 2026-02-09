import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface ProfileRowProps {
  name?: string;
  role?: string;
  email?: string;
  avatar_url?: string;
  isLoading?: boolean;
}

const TeamMemberProfileRow = ({
  name,
  role,
  email,
  avatar_url,
  isLoading = false,
}: ProfileRowProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-4 bg-inherit rounded-2xl mt-[2.875rem] animate-pulse">
        <div className="size-[92px] rounded-full bg-slate-200" />
        <div className="flex flex-col gap-2">
          <div className="h-7 w-48 bg-slate-200 rounded" />
          <div className="h-5 w-64 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 bg-inherit rounded-2xl mt-[2.875rem]">
      <Avatar className="size-[92px] bg-primary/10">
        {avatar_url && (
          <AvatarImage src={avatar_url} alt={name || "User avatar"} />
        )}
        <AvatarFallback className="bg-primary/10">
          <User className=" text-primary/60" size={48} />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <div className="flex items-center gap-10">
          <h3 className="font-semibold text-foreground text-[1.75rem]">
            {name || "—"}
          </h3>
        </div>
        <span className="text-sm text-[#4B4357] text-[1.375rem]">
          {role && <>{role} • </>}
          {email || "—"}
        </span>
      </div>
    </div>
  );
};

export default TeamMemberProfileRow;

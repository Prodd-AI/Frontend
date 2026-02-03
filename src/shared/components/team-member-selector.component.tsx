import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check } from "lucide-react";

export interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url?: string | null;
}

interface TeamMemberSelectorProps {
  members: TeamMember[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  valueKey?: "id" | "email";
  className?: string;
}

export const TeamMemberSelector = ({
  members,
  selectedValues,
  onToggle,
  isLoading = false,
  emptyMessage = "No members found",
  valueKey = "id",
  className,
}: TeamMemberSelectorProps) => {
  const getValue = (member: TeamMember) =>
    valueKey === "email" ? member.email : member.id;

  const isSelected = (member: TeamMember) =>
    selectedValues.includes(getValue(member));

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6">
        Loading members...
      </p>
    );
  }

  if (members.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className={cn("", className)}>
      {members.map((member) => {
        const selected = isSelected(member);
        return (
          <button
            type="button"
            key={member.id}
            onClick={() => onToggle(getValue(member))}
            className={cn(
              "w-full flex items-center gap-3 p-2.5 rounded-lg transition-all duration-150",
              selected
                ? "bg-primary/5 hover:bg-primary/10"
                : "hover:bg-gray-50",
            )}
          >
            <Avatar className="w-9 h-9 border border-gray-100">
              <AvatarImage
                src={member.avatar_url ?? ""}
                alt={`${member.first_name} ${member.last_name}`}
              />
              <AvatarFallback className="bg-gray-100 text-muted-foreground text-xs font-medium">
                {member.first_name[0]}
                {member.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {member.first_name} {member.last_name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {member.email}
              </p>
            </div>
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-150",
                selected ? "border-primary bg-primary" : "border-gray-300",
              )}
            >
              {selected && <Check className="w-3 h-3 text-white" />}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default TeamMemberSelector;

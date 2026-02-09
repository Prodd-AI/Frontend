import { Users } from "lucide-react";

interface TeamMember {
  name: string;
  email: string;
  status: string;
  emoji: string;
  variant: "success" | "warning" | "good";
}

const teamMembers: TeamMember[] = [
  {
    name: "Alex Chen",
    email: "alex@company.com",
    status: "4/5",
    emoji: "😀",
    variant: "success",
  },
  {
    name: "Sarah Kim",
    email: "alex@company.com",
    status: "3/5",
    emoji: "😐",
    variant: "warning",
  },
  {
    name: "Mike Johnson",
    email: "alex@company.com",
    status: "Good",
    emoji: "🙂",
    variant: "good",
  },
  {
    name: "Lisa Wong",
    email: "alex@company.com",
    status: "5/5",
    emoji: "🥳",
    variant: "success",
  },
  {
    name: "Alex Chen",
    email: "alex@company.com",
    status: "Good",
    emoji: "🙂",
    variant: "good",
  },
];

const variantClasses = {
  success: "bg-[#25AC42] text-white",
  warning: "bg-[#F39428] text-white",
  good: "bg-[#E7E8EA] text-gray-600",
};

const TeamMemberStatus = () => {
  return (
    <div className="bg-card rounded-2xl p-6 animate-fade-in shadow-[0px_4px_4px_-4px_rgba(12,12,13,0.05),0px_16px_16px_-8px_rgba(12,12,13,0.10)]">
      <h2 className="text-[1.75rem] font-semibold text-foreground mb-6">
        Team Member Status
      </h2>

      <div className="space-y-4">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-2"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#6619DE1A] flex items-center justify-center">
                <Users className="w-6 h-6 text-[#934DFF]" />
              </div>
              <div>
                <p className="font-medium text-foreground">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.email}</p>
              </div>
            </div>

            <div
              className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                variantClasses[member.variant]
              }`}
            >
              {member.emoji} {member.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamMemberStatus;

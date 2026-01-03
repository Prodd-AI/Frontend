import { Card, CardContent } from "@/components/ui/card";
import { RiUserLine } from "react-icons/ri";

const TeamOverviewComponent = () => {
  // Default data - can be replaced with props/API data later
  const company_name = "Company Name";
  const team_name = "Engineering Team";
  const team_lead_name = "Sarah Johnson";
  const other_members_count = 9;

  // Sample avatar URLs for other team members (can be replaced with actual data)
  const other_member_avatars = [
    "https://i.pravatar.cc/150?img=12",
    "https://i.pravatar.cc/150?img=13",
    "https://i.pravatar.cc/150?img=14",
    "https://i.pravatar.cc/150?img=15",
  ];

  return (
    <Card className="w-full bg-white border-2 shadow-none rounded-xl">
      <CardContent className="p-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-lg font-bold text-[#251F2D] mb-1">
            {company_name}
          </h2>
          <p className="text-sm text-[#6B7280]">
            {team_name} • Led by {team_lead_name}
          </p>
        </div>

        {/* Team Member Display */}
        <div className="flex items-center justify-center gap-8 flex-wrap">
          {/* "You" Section */}
          <div className="flex flex-col items-center">
            <div className="size-16 rounded-full bg-[#F3EDFE] flex justify-center items-center">
              <RiUserLine size={40} className="text-[#6619DE]" />
            </div>
            <p className="text-sm font-semibold text-[#251F2D] mt-2">You</p>
            <p className="text-xs text-[#6B7280]">New Member</p>
          </div>

          {/* Team Lead Section */}
          <div className="flex flex-col items-center">
            <div className="size-16 rounded-full overflow-hidden border-2 border-white shadow-md">
              <img
                src="https://i.pravatar.cc/150?img=47"
                alt="Sarah Johnson"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm font-semibold text-[#251F2D] mt-2">
              Sarah J.
            </p>
            <p className="text-xs text-[#6B7280]">Team Lead</p>
          </div>

          {/* Other Team Members Section */}
          <div className="flex flex-col items-center">
            <div className="flex items-center">
              {other_member_avatars.map((avatar, index) => (
                <div
                  key={index}
                  className={`size-16 rounded-full overflow-hidden border-2 border-white shadow-md ${
                    index > 0 ? "-ml-3" : ""
                  }`}
                  style={{
                    zIndex: other_member_avatars.length - index,
                  }}
                >
                  <img
                    src={avatar}
                    alt={`Team member ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {/* "+9" indicator */}
              <div
                className="size-16 rounded-full bg-[#F3F4F6] border-2 border-white shadow-md flex justify-center items-center -ml-3"
                style={{
                  zIndex: 0,
                }}
              >
                <span className="text-sm font-semibold text-[#251F2D]">
                  +{other_members_count}
                </span>
              </div>
            </div>
            <p className="text-sm font-semibold text-[#251F2D] mt-2">Other</p>
            <p className="text-xs text-[#6B7280]">Team Member</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamOverviewComponent;

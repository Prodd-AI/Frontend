import MoodTrendsExample from "@/shared/components/mood-trend.example";
import TeamMemberStatus from "@/shared/components/team-member-status.component";

const TeamMoodTabContent = () => {
  return (
    <div className="grid grid-cols-2 gap-[1.875rem]">
      <MoodTrendsExample />
      <TeamMemberStatus />
    </div>
  );
};

export default TeamMoodTabContent;

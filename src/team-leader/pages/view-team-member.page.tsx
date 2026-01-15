import GoBackBtn from "@/shared/components/go-back-btn";
import TeamMemberProfileRow from "../components/team-member-profile-row.component";
import TeamMemberProductivityTracker from "../components/team-member-productivity-tracker.component";
import TeamMemberOverviewCard from "../components/team-member-overview.component";
import TeamMemberAssignedTasks from "../components/team-member-assigned-tasks.component";

function ViewTeamMember() {
  return (
    <div className="pb-12">
      <GoBackBtn title="Back to team" />
      <TeamMemberProfileRow />
      <section className=" grid grid-cols-2 gap-x-[1.125rem] mt-[2.875rem]">
        <TeamMemberProductivityTracker />
        <TeamMemberOverviewCard />
      </section>
      <TeamMemberAssignedTasks />
    </div>
  );
}

export default ViewTeamMember;

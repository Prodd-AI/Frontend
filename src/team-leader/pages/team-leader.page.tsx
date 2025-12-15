import withTeamMemberScaffold from "@/shared/components/HOC/team-member-screen-scaffold-hoc";
function TeamLeaderPage() {
  return <div className="p-4">Team Leader Page</div>;
}
const WrappedHrPage = withTeamMemberScaffold(TeamLeaderPage);

export default WrappedHrPage;

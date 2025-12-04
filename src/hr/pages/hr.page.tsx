import withTeamMemberScaffold from "@/shared/components/HOC/team-member-screen-scaffold-hoc";
function hrPage() {
  return <div className="">HR Page</div>;
}
const WrappedHrPage = withTeamMemberScaffold(hrPage);

export default WrappedHrPage;

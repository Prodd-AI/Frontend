import InviteTeamMembersDialog from "@/hr/components/invite-team-members-dialog.component";

function InviteTeamPromo() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#6619DE] to-[#955DEB] p-4 text-white">
      <p className="text-sm font-semibold leading-tight">
        Invite a team member?
      </p>
      <p className="mt-1 text-[11px] leading-snug text-white/80">
        Send an invite to someone to start off new team!
      </p>
      <InviteTeamMembersDialog
        trigger={
          <button
            type="button"
            className="mt-3 w-full rounded-md bg-white/15 hover:bg-white/25 transition-colors text-xs font-semibold py-2 text-white"
          >
            Invite now
          </button>
        }
      />
    </div>
  );
}

export default InviteTeamPromo;

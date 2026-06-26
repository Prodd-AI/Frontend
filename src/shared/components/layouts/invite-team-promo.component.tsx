import InviteTeamMembersDialog from "@/hr/components/invite-team-members-dialog.component";

function InviteTeamPromo() {
  return (
    <div className="rounded-2xl bg-gradient-to-b from-[#7B3AED] via-[#6619DE] to-[#4F16A7] p-4 text-white">
      <p className="text-sm font-semibold leading-tight">
        Invite a team member?
      </p>
      <p className="mt-1 text-[11px] leading-snug text-[#E8DCFF]">
        Send an invite to someone to start off new team!
      </p>
      <InviteTeamMembersDialog
        trigger={
          <button
            type="button"
            className="mt-3 w-full rounded-xl bg-[#955DEB]/50 hover:bg-[#955DEB]/65 transition-colors text-xs font-semibold py-2.5 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22),inset_0_2px_4px_-1px_rgba(79,22,167,0.25)]"
          >
            Invite now
          </button>
        }
      />
    </div>
  );
}

export default InviteTeamPromo;
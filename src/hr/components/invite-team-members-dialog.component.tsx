import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTeamMembers } from "@/config/services/teams.service";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";

interface MemberEntry {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  user_role: string;
}

const EMPTY_MEMBER = (): MemberEntry => ({
  id: crypto.randomUUID(),
  first_name: "",
  last_name: "",
  email: "",
  user_role: "",
});

const ROLE_OPTIONS = [
  { value: "team_member", label: "Team Member" },
  { value: "team_lead", label: "Team Lead" },
  { value: "hr", label: "HR" },
  { value: "executive", label: "Executive" },
] as const;

interface InviteTeamMembersDialogProps {
  trigger: React.ReactNode;
  teamId: string;
  teamName?: string;
}

export default function InviteTeamMembersDialog({
  trigger,
  teamId,
  teamName,
}: InviteTeamMembersDialogProps) {
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<MemberEntry[]>([EMPTY_MEMBER()]);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      addTeamMembers({
        members: members.map((m) => ({
          email: m.email.trim(),
          first_name: m.first_name.trim(),
          last_name: m.last_name.trim(),
          user_role: m.user_role,
          team_id: teamId,
        })),
      }),
    onSuccess: () => {
      toast.success(
        `${members.length} member${members.length > 1 ? "s" : ""} invited successfully`,
      );
      queryClient.invalidateQueries({ queryKey: ["get-Team-Data"] });
      queryClient.invalidateQueries({ queryKey: ["teams-overview-cards"] });
      handleClose();
    },

  });

  const handleClose = useCallback(() => {
    setOpen(false);
    setMembers([EMPTY_MEMBER()]);
  }, []);

  const updateMember = useCallback(
    (id: string, field: keyof Omit<MemberEntry, "id">, value: string) => {
      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
      );
    },
    [],
  );

  const addAnotherMember = useCallback(() => {
    setMembers((prev) => [...prev, EMPTY_MEMBER()]);
  }, []);

  const removeMember = useCallback((id: string) => {
    setMembers((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((m) => m.id !== id);
    });
  }, []);

  const isMemberValid = (m: MemberEntry) =>
    m.first_name.trim() && m.email.trim() && m.user_role;

  const isFormValid = members.length > 0 && members.every(isMemberValid);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    mutate();
  };

  const completedMembers = members.filter(isMemberValid);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Invite Team Members
          </DialogTitle>
          <DialogDescription>
            Add your team members and assign them to teams
          </DialogDescription>
        </DialogHeader>

        {/* Completed member chips */}
        {completedMembers.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {completedMembers.map((m) => (
              <span
                key={m.id}
                className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700"
              >
                {m.first_name} {m.last_name}
                <button
                  type="button"
                  onClick={() => removeMember(m.id)}
                  className="rounded-full p-0.5 hover:bg-gray-200 transition-colors"
                  disabled={isPending}
                >
                  <X className="size-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {members.map((member, index) => (
            <div key={member.id} className="space-y-4 relative">
              {members.length > 1 && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Member {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeMember(member.id)}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-gray-100"
                    disabled={isPending}
                  >
                    <X className="size-4" />
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor={`first-name-${member.id}`}>First Name</Label>
                  <Input
                    id={`first-name-${member.id}`}
                    placeholder="John"
                    value={member.first_name}
                    onChange={(e) =>
                      updateMember(member.id, "first_name", e.target.value)
                    }
                    disabled={isPending}
                    className="bg-[#F9FAFB]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`last-name-${member.id}`}>Last Name</Label>
                  <Input
                    id={`last-name-${member.id}`}
                    placeholder="Doe"
                    value={member.last_name}
                    onChange={(e) =>
                      updateMember(member.id, "last_name", e.target.value)
                    }
                    disabled={isPending}
                    className="bg-[#F9FAFB]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`email-${member.id}`}>Email</Label>
                <Input
                  id={`email-${member.id}`}
                  type="email"
                  placeholder="john@youremail.com"
                  value={member.email}
                  onChange={(e) =>
                    updateMember(member.id, "email", e.target.value)
                  }
                  disabled={isPending}
                  className="bg-[#F9FAFB]"
                />
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={member.user_role}
                  onValueChange={(value) =>
                    updateMember(member.id, "user_role", value)
                  }
                  disabled={isPending}
                >
                  <SelectTrigger className="w-full bg-[#F9FAFB]">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {teamName && (
                <div className="space-y-2">
                  <Label>Team</Label>
                  <Input
                    value={teamName}
                    disabled
                    className="bg-[#F9FAFB] text-foreground"
                  />
                </div>
              )}

              {index < members.length - 1 && (
                <div className="border-b border-gray-100 pt-1" />
              )}
            </div>
          ))}

          {/* Add Another Member */}
          <button
            type="button"
            onClick={addAnotherMember}
            disabled={isPending}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border-2 border-dashed border-gray-200 text-sm font-medium text-muted-foreground hover:border-gray-300 hover:text-foreground transition-colors disabled:opacity-50"
          >
            <Plus className="size-4" />
            Add Another Member
          </button>

          <DialogFooter className="pt-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
              className="px-6 border-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !isFormValid}
              className="px-6"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Inviting...
                </>
              ) : (
                `Invite ${members.length > 1 ? `${members.length} Members` : "Member"}`
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

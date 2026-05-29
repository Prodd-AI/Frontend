import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { CurrentUserProfile } from "@/shared/typings/team-member";
import { close_account } from "@/config/services/auth.service";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import useAuthStore from "@/config/stores/auth.store";
import { useNavigate } from "react-router-dom";

interface PrivacyProps {
  user: CurrentUserProfile | undefined;
}

const Section = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-xl border border-[#E5E7EB] p-6">{children}</div>
);

// Profile Visibility + Active Sessions hidden per request — keep only Data Management.
// (Backing services live in users.service / auth.service and can be restored later.)
const PrivacyComponent = ({ user: _user }: PrivacyProps) => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const { mutate: deleteAccount, isPending: isDeletingAccount } = useMutation({
    mutationFn: close_account,
    onSuccess: () => {
      toast.success("Account deleted");
      logout();
      navigate("/login");
    },
  });

  return (
    <div className="flex flex-col gap-6">
      {/* <Section>
        <p className="text-base font-semibold">Profile Visibility</p>
        <p className="text-xs text-gray-500 mb-4">
          Control who can see your profile information
        </p>
        ...visibility controls hidden per request...
      </Section> */}

      {/* <Section>
        <p className="text-base font-semibold">Active Sessions</p>
        <p className="text-xs text-gray-500 mb-4">
          Manage your active login sessions
        </p>
        ...sessions list hidden per request...
      </Section> */}

      <Section>
        <p className="text-base font-semibold">Data Management</p>
        <p className="text-xs text-gray-500 mb-4">Delete your account data</p>

        <div className="space-y-3">
          <div className="flex items-center justify-between border border-red-200 rounded-lg p-3">
            <div>
              <p className="text-sm font-semibold text-red-600">
                Delete Account
              </p>
              <p className="text-xs text-gray-500">
                Permanently delete your account and data
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteAccount()}
                    disabled={isDeletingAccount}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isDeletingAccount ? "Deleting..." : "Delete Account"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default PrivacyComponent;

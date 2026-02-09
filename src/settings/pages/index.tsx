import SettingsTabComponent from "../components/settings-tab.component";
import ProfileOverviewComponent from "../components/profile-overview.component";
import { useState } from "react";
import AccountSettingsComponent from "../components/account-settings.component";
import PreferencesComponent from "../components/preferences.component";
import PrivacyComponent from "../components/privacy.component";
// import TeamDetailsComponent from "../components/team-details.component";
import { SettingsTab } from "@/settings/typings/tab";
import useAuthStore from "@/config/stores/auth.store";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { get_current_user_profile } from "@/config/services/users.service";

function SettingsPage() {
  const [active_tab, set_active_tab] = useState<SettingsTab>("overview");
  const user = useAuthStore((state) => state.user);

  const { data: userProfileResponse } = useQuery({
    queryKey: ["current-user-profile"],
    queryFn: get_current_user_profile,
  });

  const currentUserProfile = userProfileResponse?.data;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="bg-linear-to-r from-primary-color/5 to-primary-color/5 min-h-screen">
      <div className="max-w-screen-xl mx-auto md:p-10 p-4 ">
        {/* Top brand bar */}
        <div className="flex items-center gap-2 mb-6">
          <img src="/assets/icons/logo.svg" alt="Prodily" className="h-6 w-6" />
          <span className="text-sm font-semibold">Prodily</span>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm pb-10">
          <p className="text-2xl font-bold">Profile & Settings</p>
          <p className="text-sm text-gray-500 mb-6">
            Manage your account and preferences
          </p>

          <SettingsTabComponent
            activeTab={active_tab}
            onTabChange={(tab) => set_active_tab(tab)}
          />

          <div className="mt-6">
            {active_tab === "overview" && (
              <ProfileOverviewComponent user={currentUserProfile} />
            )}
            {active_tab === "account" && (
              <AccountSettingsComponent user={currentUserProfile} />
            )}
            {active_tab === "preferences" && (
              <PreferencesComponent user={currentUserProfile} />
            )}
            {active_tab === "privacy" && (
              <PrivacyComponent user={currentUserProfile} />
            )}
            {/* {active_tab === "team" && <TeamDetailsComponent user={user} />} */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;

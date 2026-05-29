import SettingsTabComponent from "../components/settings-tab.component";
import ProfileOverviewComponent from "../components/profile-overview.component";
import { useState } from "react";
import AccountSettingsComponent from "../components/account-settings.component";
import PreferencesComponent from "../components/preferences.component";
import PrivacyComponent from "../components/privacy.component";
import { SettingsTab } from "@/settings/typings/tab";
import useAuthStore from "@/config/stores/auth.store";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { get_current_user_profile } from "@/config/services/users.service";
import PageHeader from "@/shared/components/page-header.component";

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
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Profile & Settings"
        subtitle="Manage your account and preferences"
      />

      <div className="rounded-3xl bg-white border border-gray-200 p-5">
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
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;

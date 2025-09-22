import SettingsTabComponent from "../components/settings-tab.component";
import ProfileOverviewComponent from "../components/profile-overview.component";
import { useState } from "react";
import AccountSettingsComponent from "../components/account-settings.component";

function SettingsPage() {
  const [active_tab, set_active_tab] = useState<SettingsTab>(
    "overview" as SettingsTab
  );

  return (
    <div className="bg-linear-to-r from-primary-color/5 to-primary-color/5 min-h-screen">
      <div className="max-w-screen-xl mx-auto md:p-10 p-4 ">
        {/* Top brand bar */}
        <div className="flex items-center gap-2 mb-6">
          <img src="/assets/icons/logo.svg" alt="Prod AI" className="h-6 w-6" />
          <span className="text-sm font-semibold">Prod AI</span>
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
            {active_tab === "overview" && <ProfileOverviewComponent />}
            {active_tab === "account" && <AccountSettingsComponent />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;

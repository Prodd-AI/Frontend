import TabComponent from "@/shared/components/tab.component";
import SettingsTabComponent from "../components/settings-tab.component";
import { SettingsTab } from "../typings/tab.d";
import { tabItems } from "../utils/constants.utils";
import { useState } from "react";

function SettingsPage() {
  const [activeTab, setActiveTab] = useState<string>("todays_focus");
  return (
    <div className="p-4">
      <p className="text-2xl font-bold">Settings</p>
      <p className="text-sm text-gray-500">Components</p>

      {/* Components */}
      <ul className="flex flex-col gap-4 mt-4">
        <li>
          <p className="text-sm font-bold">Settings Tab</p>
          <SettingsTabComponent initialActiveTab={SettingsTab.OVERVIEW} />
        </li>

        <li>
          <p className="text-sm font-bold">Tab</p>
          <TabComponent
            items={tabItems}
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab)}
          />
        </li>
      </ul>
    </div>
  );
}

export default SettingsPage;

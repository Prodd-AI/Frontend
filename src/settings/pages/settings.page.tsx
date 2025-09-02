import SettingsTabComponent from "../components/settings-tab.component";
import { SettingsTab } from "../typings/tab.d";

function SettingsPage() {
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
      </ul>
    </div>
  );
}

export default SettingsPage;

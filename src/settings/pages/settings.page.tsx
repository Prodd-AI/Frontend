import TabComponent from "@/shared/components/tab.component";
import SettingsTabComponent from "../components/settings-tab.component";
import { SettingsTab } from "../typings/tab.d";
import { tabItems } from "../utils/constants.utils";
import { useState } from "react";
import TaskReviewComponent from "@/team-leader/components/task-review.component";
import { sample_task_reviews } from "@/team-leader/utils/constants.utils";

function SettingsPage() {
  const [activeTab, setActiveTab] = useState<string>("todays_focus");
  return (
    <div className="p-4 bg-muted">
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

        <li className="flex flex-col gap-4 bg-white rounded-xl p-4">
          <p className="text-sm font-bold">Task Review Card</p>
          <div className="flex flex-col gap-4">
            {sample_task_reviews.map((item) => (
              <TaskReviewComponent key={item.id} item={item} />
            ))}
          </div>
        </li>
      </ul>
    </div>
  );
}

export default SettingsPage;

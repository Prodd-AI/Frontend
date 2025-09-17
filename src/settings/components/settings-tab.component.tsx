import { tabs } from "../utils/constants.utils";
import { useState } from "react";

const SettingsTabComponent = ({
  initialActiveTab,
}: {
  initialActiveTab: SettingsTab;
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialActiveTab);
  return (
    <div className="flex">
      {tabs.map((tab, index) => (
        <div
          key={tab.value}
          onClick={() => setActiveTab(tab.value as SettingsTab)}
          className={`cursor-pointer relative flex items-center justify-center text-[#6B7280] text-sm font-medium transition-all duration-300 py-4 ${
            activeTab === tab.value ? "text-primary-color" : ""
          } ${index === 0 ? "pr-4" : "px-4"}`}
        >
          <div className="flex items-center gap-2">
            {tab.icon}
            <p>{tab.label}</p>
          </div>

          <div
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1 bg-[#F3F4F6] rounded-lg transition-all duration-300 ${
              activeTab === tab.value ? "bg-primary-color z-10" : ""
            }`}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default SettingsTabComponent;

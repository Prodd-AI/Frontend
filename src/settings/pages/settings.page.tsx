import TabComponent from "@/shared/components/tab.component";
import SettingsTabComponent from "../components/settings-tab.component";
import { tabItems } from "../utils/constants.utils";
import { useState } from "react";
import TaskReviewComponent from "@/team-leader/components/task-review.component";
import { sample_task_reviews } from "@/team-leader/utils/constants.utils";
import MeetingCardComponent from "@/shared/components/meeting-card.component";
import { sample_meetings } from "@/shared/utils/meeting.constants";
import TeamAnalysisCardComponent from "@/shared/components/team-analysis-card.component";
import { sample_team_analyses } from "@/shared/utils/team-analysis.constants";
import FlightRiskCardComponent from "@/hr/components/flight-risk-card.component";
import { sample_flight_risks } from "@/hr/utils/flight-risk.constants";
import WellnessTrendCards from "@/hr/components/wellness-trend-cards.component";
import { sample_wellness_trends } from "@/hr/utils/wellness-trend.constants";

function SettingsPage() {
  const [activeTab, setActiveTab] = useState<string>("todays_focus");
  return (
    <div className="bg-linear-to-r from-primary-color/5 to-white">
      <div className="max-w-screen-xl mx-auto md:p-10 p-4 ">
        <p className="text-2xl font-bold">Settings</p>
        <p className="text-sm text-gray-500">Components</p>

        {/* Components */}
        <ul className="flex flex-col gap-10 mt-4">
          <li>
            <p className="text-sm font-bold">Settings Tab</p>
            <SettingsTabComponent
              initialActiveTab={"overview" as SettingsTab}
            />
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

          <li>
            <p className="text-sm font-bold mb-2">Meeting Card</p>
            <div className="flex flex-col gap-4">
              {sample_meetings.map((meeting) => (
                <MeetingCardComponent key={meeting.id} meeting={meeting} />
              ))}
            </div>
          </li>

          <li>
            <p className="text-sm font-bold mb-2">Team Analysis Card</p>
            <div className="grid md:grid-cols-2 gap-6">
              {sample_team_analyses.map((team) => (
                <TeamAnalysisCardComponent key={team.id} team={team} />
              ))}
            </div>
          </li>

          <li>
            <p className="text-sm font-bold mb-2">Flight Risk Card</p>
            <div className="flex flex-col gap-4">
              {sample_flight_risks.map((person) => (
                <FlightRiskCardComponent key={person.id} person={person} />
              ))}
            </div>
          </li>

          <li>
            <p className="text-sm font-bold mb-2">Wellness Trend Cards</p>
            <WellnessTrendCards items={sample_wellness_trends} />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SettingsPage;

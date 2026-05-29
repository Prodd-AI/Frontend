import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { IoWarningOutline } from "react-icons/io5";
import PageHeader from "@/shared/components/page-header.component";
import FlightRiskCardComponent from "@/hr/components/flight-risk-card.component";
import { useFlightRisk } from "@/hr/hooks/use-flight-risk";
import { useHrScheduleMeeting } from "@/hr/hooks/use-hr-schedule-meeting";
import useTeamStore from "@/config/stores/team.store";

function HrFlightRisksPage() {
  const navigate = useNavigate();
  const { open: openScheduleMeeting } = useHrScheduleMeeting();
  const { search_term } = useTeamStore();
  const { flight_risks, is_loading } = useFlightRisk();

  const filtered = flight_risks.filter((person) =>
    person.member_name?.toLowerCase().includes(search_term.toLowerCase()),
  );

  const handle_view_employee = (team_id: string | undefined, id: string) => {
    if (team_id) navigate(`/dash/hr/teams/${team_id}/${id}`);
    else navigate(`/dash/hr/employee/${id}`);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Flight Risks"
        subtitle="Employees showing signs of burnout or disengagement"
      />

      <div className="space-y-1 flex items-center gap-2">
        <IoWarningOutline className="text-danger-color" size={20} />
        <h3 className="text-base font-bold text-[#251F2D]">
          Flight Risk Panel
        </h3>
      </div>

      {is_loading ? (
        <div className="flex flex-col items-center justify-center p-20 bg-white rounded-3xl">
          <Loader2 className="size-8 text-primary-color animate-spin mb-2" />
          <p className="text-gray-500 font-medium">
            Loading flight risk analysis...
          </p>
        </div>
      ) : flight_risks.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 bg-white rounded-3xl text-gray-400 italic">
          No at-risk employees found for the selected filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((person) => (
            <FlightRiskCardComponent
              key={person.id}
              person={person}
              actions={{
                on_schedule_one_to_one: (p) => openScheduleMeeting(p),
                on_view_profile: (team_id, id) =>
                  handle_view_employee(team_id, id),
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default HrFlightRisksPage;

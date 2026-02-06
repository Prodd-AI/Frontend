import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import GoBackBtn from "@/shared/components/go-back-btn";
import {
  get_team_detail,
  get_teams_overview_cards,
} from "@/config/services/hr.service";
import TeamAnalysisCardComponent from "@/shared/components/team-analysis-card.component";
import { Loader2 } from "lucide-react";
import MoodHeatmap from "../components/mood-heatmap.component";

export default function TeamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handle_view_employee = (id: string) => {
    navigate(`/dash/hr/employee/${id}`);
  };

  const { data: team_detail, isLoading: is_detail_loading } = useQuery({
    queryKey: ["team-detail", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await get_team_detail(id);
      return response.data;
    },
    enabled: !!id,
  });

  // For the analysis card, we might need to find the specific team in the overview
  const { data: teams_overview } = useQuery({
    queryKey: ["teams-overview"],
    queryFn: () => get_teams_overview_cards(),
  });

  const selected_team_analysis = teams_overview?.data?.find(
    (t: any) => t.id === id,
  );

  if (is_detail_loading) {
    return (
      <div className="h-full flex items-center justify-center p-20">
        <Loader2 className="size-8 text-primary-color animate-spin" />
      </div>
    );
  }

  return (
    <div className="pb-12 space-y-10">
      <GoBackBtn title="Back to Dashboard" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          {selected_team_analysis && (
            <TeamAnalysisCardComponent
              team={selected_team_analysis}
              className="shadow-md border border-gray-100"
            />
          )}
        </div>

        <div className="lg:col-span-2 space-y-8">
          <MoodHeatmap team_id={id} />
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-[#251F2D] mb-4">Team Members</h3>
        {/* We can use a simple table or DataTable here to list members */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-3 text-sm font-semibold text-gray-500">
                  Name
                </th>
                <th className="pb-3 text-sm font-semibold text-gray-500">
                  Role
                </th>
                <th className="pb-3 text-sm font-semibold text-gray-500 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {team_detail?.members?.map((member: any) => (
                <tr
                  key={member.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 text-sm font-medium text-[#251F2D]">
                    {member.name}
                  </td>
                  <td className="py-4 text-sm text-gray-500">
                    {member.job_title}
                  </td>
                  <td className="py-4 text-sm text-right">
                    <button
                      className="text-primary-color font-semibold hover:underline"
                      onClick={() => handle_view_employee(member.id)}
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!team_detail?.members || team_detail.members.length === 0) && (
            <p className="py-8 text-center text-gray-400 italic text-sm">
              No members found in this team.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

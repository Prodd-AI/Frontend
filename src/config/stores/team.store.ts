import { create } from "zustand";
import { TeamState } from "@/shared/typings/team.store";

const useTeamStore = create<TeamState>((set) => ({
  selectedTeamId: null,
  setSelectedTeamId: (teamId) => set({ selectedTeamId: teamId }),
  search_term: "",
  set_search_term: (term) => set({ search_term: term }),
}));

export default useTeamStore;

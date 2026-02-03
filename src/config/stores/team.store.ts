import { create } from "zustand";
import { TeamState } from "@/shared/typings/team.store";

const useTeamStore = create<TeamState>((set) => ({
  selectedTeamId: null,
  setSelectedTeamId: (teamId) => set({ selectedTeamId: teamId }),
}));

export default useTeamStore;

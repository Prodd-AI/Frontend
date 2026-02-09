declare module "@/shared/typings/team.store" {
  export interface TeamState {
    selectedTeamId: string | null;
    setSelectedTeamId: (teamId: string | null) => void;
    search_term: string;
    set_search_term: (term: string) => void;
  }
}

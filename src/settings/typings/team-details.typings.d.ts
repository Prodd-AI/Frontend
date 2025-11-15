declare module "@/settings/typings/team-details.typings" {
  export type TeamInfo = {
    name: string;
    lead_name: string;
    department: string;
    members_count: number;
    active_projects: number;
  };

  export type TeamMemberItem = {
    id: string;
    name: string;
    role: string;
    is_lead?: boolean;
  };
}

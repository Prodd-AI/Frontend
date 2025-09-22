type TeamInfo = {
  name: string;
  lead_name: string;
  department: string;
  members_count: number;
  active_projects: number;
};

type TeamMemberItem = {
  id: string;
  name: string;
  role: string;
  is_lead?: boolean;
};

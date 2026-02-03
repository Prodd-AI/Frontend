interface UserTaskAssignment {
  id: string;
  user_id: string;
  task_id: string;
  assigned_at: string;
  created_at: string;
  updated_at: string;
  task: Task;
}

interface Task {
  id: string;
  title: string;
  description: string;
  external_link: string | null;
  status: "pending" |  "completed" ;
  priority: "low" | "medium" | "high" 
  due_date: string;
  created_by_id: string;
  created_at: string;
  updated_at: string;
}

interface WeekTasksResponse {
  Mon: UserTaskAssignment[];
  Tue: UserTaskAssignment[];
  Wed: UserTaskAssignment[];
  Thu: UserTaskAssignment[];
  Fri: UserTaskAssignment[];
  Sat: UserTaskAssignment[];
  Sun: UserTaskAssignment[];
  // total_tasks_today: number;
  // completed_tasks_today: number;
}

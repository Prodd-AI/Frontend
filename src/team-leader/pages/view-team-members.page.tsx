import GoBackBtn from "@/shared/components/go-back-btn";
import TeamInsightMetricCard from "@/shared/components/team-insight-metric-card";
import TeamMemberOverviewCard from "@/shared/components/team-member-overview-card.component";
import WelcomeBackHeader from "@/shared/components/welcome-back-header.component";

const teamMembers = [
  {
    id: 1,
    name: "Maria Rodriguez",
    role: "Frontend Developer",
    status: "At risk" as const,
    taskCompletion: 45,
    tasksCompleted: 4,
    totalTasks: 10,
    weekStreak: "2 weeks",
    lastActive: "1 day ago",
  },
  {
    id: 2,
    name: "James Chen",
    role: "Backend Developer",
    status: "On track" as const,
    taskCompletion: 78,
    tasksCompleted: 7,
    totalTasks: 9,
    weekStreak: "5 weeks",
    lastActive: "2 hours ago",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    role: "UI/UX Designer",
    status: "Completed" as const,
    taskCompletion: 100,
    tasksCompleted: 8,
    totalTasks: 8,
    weekStreak: "3 weeks",
    lastActive: "Just now",
  },
  {
    id: 4,
    name: "Michael Okonkwo",
    role: "DevOps Engineer",
    status: "On track" as const,
    taskCompletion: 65,
    tasksCompleted: 6,
    totalTasks: 10,
    weekStreak: "4 weeks",
    lastActive: "3 hours ago",
  },
  {
    id: 5,
    name: "Emily Davis",
    role: "Product Manager",
    status: "At risk" as const,
    taskCompletion: 30,
    tasksCompleted: 2,
    totalTasks: 7,
    weekStreak: "1 week",
    lastActive: "2 days ago",
  },
];

function ViewTeamMembers() {
  return (
    <div className="pb-12">
      <GoBackBtn title="Back home" />
      <WelcomeBackHeader
        heading={"Team Dashboard and Insight"}
        subHeading={"Manage your team's tasks and wellbeing"}
        badge
        className="sm:mt-6"
      />
      <TeamInsightMetricCard className="mt-5" />
      <div className="flex flex-wrap gap-4 mt-6">
        {teamMembers.map((member) => (
          <TeamMemberOverviewCard
            id={member.id}
            key={member.id}
            name={member.name}
            role={member.role}
            status={member.status}
            taskCompletion={member.taskCompletion}
            tasksCompleted={member.tasksCompleted}
            totalTasks={member.totalTasks}
            weekStreak={member.weekStreak}
            lastActive={member.lastActive}
          />
        ))}
      </div>
    </div>
  );
}

export default ViewTeamMembers;

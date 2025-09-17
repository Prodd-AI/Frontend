import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

interface ViewTeamMemberCardProps {
	name: string;
	role: string;
	status: "Healthy" | "Warning" | "Flagged";
	taskCompletion: number;
	tasksCompleted: number;
	totalTasks: number;
	weekStreak: number;
	lastActive: string;
}

export const ViewTeamMemberCard = ({
	name,
	role,
	status,
	taskCompletion,
	tasksCompleted,
	totalTasks,
	weekStreak,
	lastActive,
}: ViewTeamMemberCardProps) => {
	const getStatusColor = (status: string) => {
		switch (status) {
			case "Healthy":
				return "bg-bg-status-green text-text-status-green";
			case "Warning":
				return "bg-bg-status-yellow text-text-status-yellow";
			case "Flagged":
				return "bg-bg-status-red text-text-status-red";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getTaskCompletionColor = (completion: number) => {
		switch (true) {
			case completion > 75:
				return "text-performance-green";
			case completion > 50:
				return "text-performance-yellow";
			case completion <= 50:
				return "text-performance-red";
			default:
				return "text-gray-800";
		}
	};

	const getProgressBarColor = (completion: number) => {
		switch (true) {
			case completion > 75:
				return "bg-performance-green";
			case completion > 50:
				return "bg-performance-yellow";
			case completion <= 50:
				return "bg-performance-red";
			default:
				return "bg-gray-800";
		}
	};

	return (
		<Card className="w-full tracking-[-2%] min-w-2xs p-0 text-grey-400 rounded-2xl lg:max-w-xl bg-white shadow-lg border-none hover:scale-[1.01] transition-all duration-300">
			<CardContent className="p-6 space-y-4">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
							<User className="w-5 h-5 text-purple-600" />
						</div>
						<div>
							<h3 className="text-lg font-semibold text-gray-900">{name}</h3>
							<p className="text-sm text-gray-600">{role}</p>
						</div>
					</div>
					<Badge
						variant="secondary"
						className={`${getStatusColor(status)} font-bold`}>
						{status}
					</Badge>
				</div>

				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-600">Task completion</span>
						<span
							className={`${getTaskCompletionColor(
								taskCompletion
							)} text-sm font-bold`}>
							{taskCompletion}%
						</span>
					</div>

					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-600">Task</span>
						<span className="text-sm font-medium">
							{tasksCompleted}/{totalTasks}
						</span>
					</div>

					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-600">Week Streak</span>
						<span className="text-sm font-bold text-gray-900">
							{weekStreak} weeks
						</span>
					</div>

					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-600">Last Active</span>
						<span className="text-sm font-medium">{lastActive}</span>
					</div>

					<div className="w-full bg-gray-200 rounded-full h-2">
						<div
							className={`${getProgressBarColor(
								taskCompletion
							)} h-2 rounded-full transition-[width] duration-700 ease-in-out`}
							style={{ width: `${taskCompletion}%` }}
						/>
					</div>
				</div>

				<div className="space-y-2">
					<p className="w-full text-left text-sm text-gray-800 transition-colors">
						Click here to{" "}
						<span className="text-primary font-bold">Schedule Call</span>
					</p>
					<Button className="w-full bg-button-bg-primary text-white font-medium hover:bg-black/50 transition-all duration-300 ease-in-out hover:bg-opacity-90 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]">
						View Details
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};

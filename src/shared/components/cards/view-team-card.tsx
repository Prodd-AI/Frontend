import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ViewTeamCardProps {
	title: string;
	leader: string;
	status: "Healthy" | "Warning" | "Flagged";
	teamSize: number;
	performance: number;
}

export const ViewTeamCard = ({
	title,
	leader,
	status,
	teamSize,
	performance,
}: ViewTeamCardProps) => {
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

	const getProgressBarColor = (progress: number) => {
		switch (true) {
			case progress > 75:
				return "bg-performance-green text-performance-green";
			case progress > 50:
				return "bg-performance-yellow text-performance-yellow";
			case progress > 25:
				return "bg-performance-red text-performance-red";
			default:
				return "bg-gray-800";
		}
	};

	return (
		<Card className="w-full min-w-2xs p-0 rounded-2xl lg:max-w-xl bg-white shadow-lg border-none hover:scale-[1.01] transition-all duration-300">
			<CardContent className="p-6  space-y-4">
				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h3 className="text-lg font-semibold text-gray-900">{title}</h3>
						<p className="text-sm text-gray-600">Led by {leader}</p>
					</div>
					<Badge
						variant="secondary"
						className={`${getStatusColor(status)} font-bold`}>
						{status}
					</Badge>
				</div>

				{/* Metrics */}
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-600">Team Size</span>
						<span className="text-sm font-bold text-gray-900">
							{teamSize} Member
						</span>
					</div>

					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-600">Performance</span>
						<span
							className={`${getProgressBarColor(
								performance
							)} !bg-transparent text-sm font-bold `}>
							{performance}%
						</span>
					</div>

					<div className="w-full bg-gray-200 rounded-full h-2">
						<div
							className={`${getProgressBarColor(
								performance
							)} h-2 rounded-full transition-[width] duration-700 ease-in-out`}
							style={{ width: `${performance}%` }}
						/>
					</div>
				</div>

				<Button className="w-full bg-button-bg-primary text-white font-medium hover:bg-black/50 transition-all duration-300 ease-in-out hover:bg-opacity-90 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]">
					View Details
				</Button>
			</CardContent>
		</Card>
	);
};

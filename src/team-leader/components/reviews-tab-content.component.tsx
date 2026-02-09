import ProgressReviewCard from "@/shared/components/progress-review-card.component";
import { ReviewsTabContentProps } from "@/team-leader/typings/team-leader";

const ReviewsTabContent = ({ reviews }: ReviewsTabContentProps) => {
  return (
    <div className="bg-[#FBFBFB] py-[1.75rem] px-[1.25rem] rounded-[1.5rem]">
      <h4 className="text-[1.75rem] font-semibold">Weekly Task Review</h4>
      <div className="flex flex-col gap-4 mt-4">
        {reviews.map((review, index) => (
          <ProgressReviewCard
            key={index}
            name={review.name}
            weekLabel={review.weekLabel}
            completedTasks={review.completedTasks}
            totalTasks={review.totalTasks}
            description={review.description}
            status={review.status}
            tasks={review.tasks}
          />
        ))}
      </div>
    </div>
  );
};

export default ReviewsTabContent;

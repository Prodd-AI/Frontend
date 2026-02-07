import { useQuery } from "@tanstack/react-query";
import { get_upcoming_meetings_today } from "@/config/services/meeting.service";

export const useUpcomingMeetings = () => {
  const { data, isLoading: is_loading, error } = useQuery({
    queryKey: ["upcoming-meetings-today"],
    queryFn: () => get_upcoming_meetings_today(),
  });

  return {
    meeting: data?.data,
    is_loading,
    error
  };
};

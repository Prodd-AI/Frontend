import { useQuery } from "@tanstack/react-query";
import { get_employee_detail } from "@/config/services/hr.service";

export const useEmployeeDetail = (employee_id?: string) => {
  const { data, isLoading: is_loading, error } = useQuery({
    queryKey: ["employee-detail", employee_id],
    queryFn: () => get_employee_detail(employee_id!),
    enabled: !!employee_id,
  });

  return {
    employee_data: data?.data,
    is_loading,
    error,
  };
};

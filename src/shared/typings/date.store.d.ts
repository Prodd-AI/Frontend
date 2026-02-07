export type DatePeriod = "7days" | "30days" | "last_week" | "last_month" | "this_week" | "this_month";

export interface DateState {
  selected_period: DatePeriod;
  set_selected_period: (period: DatePeriod) => void;
}

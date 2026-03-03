export type DatePeriod = "last_week" | "this_week"

export interface DateState {
  selected_period: DatePeriod;
  set_selected_period: (period: DatePeriod) => void;
}

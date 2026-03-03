import { create } from "zustand";
import { DateState } from "@/shared/typings/date.store";

const useDateStore = create<DateState>((set) => ({
  selected_period: "this_week",
  set_selected_period: (period) => set({ selected_period: period }),
}));

export default useDateStore;

declare module "@/shared/typings/status-cards" {
  import { ReactNode } from "react";

  export type DeltaColor = "auto" | "success" | "danger" | "warning" | "muted";

  export interface StatusCardItem {
    id: string;
    title: string;
    value: number | string;
    value_prefix?: string;
    value_suffix?: string; // e.g., "%"
    description?: string;
    icon?: ReactNode;
    icon_classname?: string; // optional extra classes for icon wrapper
    delta_value?: number; // numeric delta; used when delta_text omitted
    delta_text?: string; // overrides delta_value presentation
    delta_period?: string; // e.g., "vs last week"
    delta_color?: DeltaColor; // default: auto based on sign
  }

  export interface StatusCardsProps {
    items: StatusCardItem[];
    className?: string;
    grid_classname?: string; // override grid layout classes
    on_item_click?: (id: string) => void;
  }
}

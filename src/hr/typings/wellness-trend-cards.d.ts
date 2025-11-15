declare module "@/hr/typings/wellness-trend-cards" {
  export type WellnessTrendVariant = "positive" | "attention" | "achievement" | "risk";

  export interface WellnessTrendItem {
    id: string;
    title: string; // e.g., "Positive Trend"
    description: string; // body text
    variant: WellnessTrendVariant;
  }

  export interface WellnessTrendCardsProps {
    items: WellnessTrendItem[];
    className?: string;
  }
}

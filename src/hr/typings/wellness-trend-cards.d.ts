type WellnessTrendVariant = "positive" | "attention" | "achievement" | "risk";

interface WellnessTrendItem {
  id: string;
  title: string; // e.g., "Positive Trend"
  description: string; // body text
  variant: WellnessTrendVariant;
}

interface WellnessTrendCardsProps {
  items: WellnessTrendItem[];
  className?: string;
}

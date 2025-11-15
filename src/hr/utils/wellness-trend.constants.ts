import { WellnessTrendItem } from "@/hr/typings/wellness-trend-cards";

export const sample_wellness_trends: WellnessTrendItem[] = [
  {
    id: "positive",
    title: "Positive Trend",
    description:
      "Engineering team mood improved 15% this month after implementing flexible hours",
    variant: "positive",
  },
  {
    id: "attention",
    title: "Attention Needed",
    description: "Sales team showing elevated stress levels during Q1 push",
    variant: "attention",
  },
  {
    id: "achievement",
    title: "Achievement",
    description:
      "Design team maintained 4.2+ mood rating for 3 consecutive weeks",
    variant: "achievement",
  },
  {
    id: "risk",
    title: "Burnout Risk Alerts",
    description: "Sales team showing elevated stress levels during Q1 push",
    variant: "risk",
  },
];

export const stylesByVariant: Record<WellnessTrendItem["variant"], string> = {
  positive: "bg-gradient-to-r from-[#1C75BC] to-primary-color text-white",
  attention: "bg-gradient-to-r from-[#F9E7D1] to-white text-[#8D591A]",
  achievement: "bg-gradient-to-r from-[#E6F5ED] to-white text-[#167F4B]",
  risk: "bg-danger-color/10 text-danger-color",
};
